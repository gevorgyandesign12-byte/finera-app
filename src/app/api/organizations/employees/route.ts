import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toApiOrganizationEmployee(
  employee: Awaited<ReturnType<typeof prisma.organizationEmployee.findFirst>>
) {
  if (!employee) {
    return null;
  }

  return {
    id: employee.id,
    organizationId: employee.organizationId,
    fullName: employee.fullName,
    taxId: employee.taxId,
    phone: employee.phone,
    email: employee.email,
    positionTitle: employee.positionTitle,
    departmentName: employee.departmentName,
    employmentType: employee.employmentType,
    employmentStatus: employee.employmentStatus,
    hireDate: employee.hireDate,
    salaryAmount: employee.salaryAmount,
    notes: employee.notes,
    createdAt: employee.createdAt.toISOString(),
    updatedAt: employee.updatedAt.toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const organizationId = request.nextUrl.searchParams.get("organizationId") ?? "";

  if (!organizationId) {
    return NextResponse.json({ error: "Կազմակերպությունը ընտրված չէ։" }, { status: 400 });
  }

  const employees = await prisma.organizationEmployee.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    employees: employees.map((employee: (typeof employees)[number]) => toApiOrganizationEmployee(employee)),
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const organizationId = readString(body.organizationId);
    const fullName = readString(body.fullName);
    const taxId = readString(body.taxId);
    const phone = readString(body.phone);
    const email = readString(body.email);
    const positionTitle = readString(body.positionTitle);
    const departmentName = readString(body.departmentName);
    const employmentType = readString(body.employmentType) || "full_time";
    const hireDate = readString(body.hireDate);
    const salaryAmount = readString(body.salaryAmount);
    const notes = readString(body.notes);

    if (!organizationId) {
      return NextResponse.json({ error: "Կազմակերպությունը ընտրված չէ։" }, { status: 400 });
    }

    if (!fullName) {
      return NextResponse.json({ error: "Աշխատակցի անուն ազգանունը պարտադիր է։" }, { status: 400 });
    }

    if (!positionTitle) {
      return NextResponse.json({ error: "Պաշտոնը պարտադիր է։" }, { status: 400 });
    }

    if (!hireDate) {
      return NextResponse.json({ error: "Աշխատանքի ընդունման ամսաթիվը պարտադիր է։" }, { status: 400 });
    }

    if (taxId && !/^\d{8}$/.test(taxId)) {
      return NextResponse.json(
        { error: "Աշխատակցի ՀՎՀՀ-ն պետք է լինի 8 թվանշան կամ դատարկ թողնվի։" },
        { status: 400 }
      );
    }

    const employee = await prisma.organizationEmployee.create({
      data: {
        organizationId,
        fullName,
        taxId: taxId || null,
        phone: phone || null,
        email: email || null,
        positionTitle,
        departmentName: departmentName || null,
        employmentType,
        employmentStatus: "active",
        hireDate,
        salaryAmount: salaryAmount || null,
        notes: notes || null,
      },
    });

    return NextResponse.json({ employee: toApiOrganizationEmployee(employee) }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Չհաջողվեց գրանցել կազմակերպության աշխատակցին DEV DB-ում։" },
      { status: 500 }
    );
  }
}
