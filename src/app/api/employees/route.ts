import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toApiEmployee(employee: Awaited<ReturnType<typeof prisma.fineraEmployee.findFirst>>) {
  if (!employee) {
    return null;
  }

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
    createdAt: employee.createdAt.toISOString(),
    updatedAt: employee.updatedAt.toISOString(),
  };
}

export async function GET() {
  const employees = await prisma.fineraEmployee.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    employees: employees.map((employee) => toApiEmployee(employee)),
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
      },
    });

    return NextResponse.json({ employee: toApiEmployee(employee) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Այս email-ով աշխատակից արդեն կա։" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Չհաջողվեց աշխատակցին գրանցել DEV DB-ում։" },
      { status: 500 }
    );
  }
}
