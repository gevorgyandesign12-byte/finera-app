import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toApiDepartment(department: Awaited<ReturnType<typeof prisma.department.findFirst>>) {
  if (!department) {
    return null;
  }

  return {
    id: department.id,
    name: department.name,
    scope: department.scope,
    organizationId: department.organizationId,
    status: department.status,
    notes: department.notes,
    createdAt: department.createdAt.toISOString(),
    updatedAt: department.updatedAt.toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const scope = request.nextUrl.searchParams.get("scope");
  const organizationId = request.nextUrl.searchParams.get("organizationId");

  const departments = await prisma.department.findMany({
    where: {
      ...(scope ? { scope } : {}),
      ...(organizationId ? { organizationId } : {}),
    },
    orderBy: [{ scope: "asc" }, { name: "asc" }],
  });

  return NextResponse.json({
    departments: departments.map((department) => toApiDepartment(department)),
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const name = readString(body.name);
    const scope = readString(body.scope) || "finera";
    const organizationId = readString(body.organizationId);
    const notes = readString(body.notes);

    if (!name) {
      return NextResponse.json({ error: "Ստորաբաժանման անվանումը պարտադիր է։" }, { status: 400 });
    }

    if (!["finera", "organization"].includes(scope)) {
      return NextResponse.json({ error: "Ստորաբաժանման scope-ը սխալ է։" }, { status: 400 });
    }

    const existing = await prisma.department.findFirst({
      where: {
        name,
        scope,
        organizationId: organizationId || null,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Այս ստորաբաժանումը արդեն կա տվյալ ցուցակում։" },
        { status: 409 }
      );
    }

    const department = await prisma.department.create({
      data: {
        name,
        scope,
        organizationId: organizationId || null,
        status: "active",
        notes: notes || null,
      },
    });

    return NextResponse.json({ department: toApiDepartment(department) }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Չհաջողվեց պահպանել ստորաբաժանումը DEV DB-ում։" },
      { status: 500 }
    );
  }
}
