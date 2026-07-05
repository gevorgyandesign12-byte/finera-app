import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const capabilityLabels: Record<string, string> = {
  manager: "Մենեջեր / նշանակումների կառավարում",
  chief_accountant: "Գլխավոր հաշվապահ",
  accountant: "Հաշվետար / հաշվապահ",
  payroll_hr: "Աշխատավարձ և կադրեր",
  support: "Support / սպասարկում",
  tech: "Տեխնիկական սպասարկում",
};

type CapabilityRecord = {
  id: string;
  capabilityScope: string;
  status: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type FineraEmployeeWithCapabilities = NonNullable<
  Awaited<ReturnType<typeof prisma.fineraEmployee.findFirst>>
> & {
  capabilities?: CapabilityRecord[];
};

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function inferCapabilitiesFromRoleGroup(roleGroup: string) {
  if (roleGroup === "chief_accountant") {
    return ["chief_accountant"];
  }

  if (roleGroup === "bookkeeper" || roleGroup === "accountant") {
    return ["accountant"];
  }

  if (roleGroup === "hr_legal" || roleGroup === "payroll_hr") {
    return ["payroll_hr"];
  }

  if (roleGroup === "manager") {
    return ["manager"];
  }

  if (roleGroup === "support") {
    return ["support"];
  }

  if (roleGroup === "tech") {
    return ["tech"];
  }

  return [];
}

function toApiEmployee(employee: FineraEmployeeWithCapabilities | null) {
  if (!employee) {
    return null;
  }

  const capabilities = employee.capabilities ?? [];

  return {
    id: employee.id,
    fullName: employee.fullName,
    email: employee.email,
    phone: employee.phone,
    roleGroup: employee.roleGroup,
    positionTitle: employee.positionTitle,
    departmentName: employee.departmentName,
    employmentType: employee.employmentType,
    employmentStatus: employee.employmentStatus,
    hireDate: employee.hireDate,
    notes: employee.notes,
    capabilities: capabilities.map((capability: (typeof capabilities)[number]) => ({
      id: capability.id,
      capabilityScope: capability.capabilityScope,
      capabilityLabel: capabilityLabels[capability.capabilityScope] ?? capability.capabilityScope,
      status: capability.status,
      notes: capability.notes,
    })),
    createdAt: employee.createdAt.toISOString(),
    updatedAt: employee.updatedAt.toISOString(),
  };
}

export async function GET() {
  const employees = await prisma.fineraEmployee.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      capabilities: {
        where: { status: "active" },
        orderBy: { capabilityScope: "asc" },
      },
    },
  });

  return NextResponse.json({
    employees: employees.map((employee: FineraEmployeeWithCapabilities) => toApiEmployee(employee)),
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const fullName = readString(body.fullName);
    const email = readString(body.email);
    const phone = readString(body.phone);
    const roleGroup = readString(body.roleGroup);
    const positionTitle = readString(body.positionTitle);
    const departmentName = readString(body.departmentName);
    const employmentType = readString(body.employmentType) || "full_time";
    const hireDate = readString(body.hireDate);
    const notes = readString(body.notes);
    const capabilityScopes = Array.from(
      new Set(
        (readStringArray(body.capabilityScopes).length > 0
          ? readStringArray(body.capabilityScopes)
          : inferCapabilitiesFromRoleGroup(roleGroup)
        ).filter(Boolean),
      ),
    );

    if (!fullName) {
      return NextResponse.json({ error: "Անուն ազգանունը պարտադիր է։" }, { status: 400 });
    }

    if (!roleGroup) {
      return NextResponse.json({ error: "Դերի խումբը պարտադիր է։" }, { status: 400 });
    }

    if (!positionTitle) {
      return NextResponse.json({ error: "Պաշտոնը պարտադիր է։" }, { status: 400 });
    }

    if (!departmentName) {
      return NextResponse.json({ error: "Ստորաբաժանումը պարտադիր է։" }, { status: 400 });
    }

    if (!hireDate) {
      return NextResponse.json({ error: "Աշխատանքի ընդունման ամսաթիվը պարտադիր է։" }, { status: 400 });
    }

    if (capabilityScopes.length === 0) {
      return NextResponse.json(
        { error: "Աշխատակցի առնվազն մեկ կարողություն պետք է ընտրված լինի։" },
        { status: 400 },
      );
    }

    const employee = await prisma.fineraEmployee.create({
      data: {
        fullName,
        email: email || null,
        phone: phone || null,
        roleGroup,
        positionTitle,
        departmentName,
        employmentType,
        employmentStatus: "active",
        hireDate,
        notes: notes || null,
        capabilities: {
          create: capabilityScopes.map((capabilityScope) => ({
            capabilityScope,
            status: "active",
          })),
        },
      },
      include: {
        capabilities: {
          where: { status: "active" },
          orderBy: { capabilityScope: "asc" },
        },
      },
    });

    return NextResponse.json({ employee: toApiEmployee(employee) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Այս email-ով աշխատակից արդեն կա։" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Չհաջողվեց աշխատակցին գրանցել DEV DB-ում։" },
      { status: 500 },
    );
  }
}
