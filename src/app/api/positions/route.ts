import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toApiPosition(position: Awaited<ReturnType<typeof prisma.position.findFirst>>) {
  if (!position) {
    return null;
  }

  return {
    id: position.id,
    title: position.title,
    scope: position.scope,
    organizationId: position.organizationId,
    departmentName: position.departmentName,
    status: position.status,
    notes: position.notes,
    createdAt: position.createdAt.toISOString(),
    updatedAt: position.updatedAt.toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const scope = request.nextUrl.searchParams.get("scope");
  const organizationId = request.nextUrl.searchParams.get("organizationId");

  const positions = await prisma.position.findMany({
    where: {
      ...(scope ? { scope } : {}),
      ...(organizationId ? { organizationId } : {}),
    },
    orderBy: [{ scope: "asc" }, { title: "asc" }],
  });

  return NextResponse.json({
    positions: positions.map(toApiPosition),
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const title = readString(body.title);
    const scope = readString(body.scope) || "finera";
    const organizationId = readString(body.organizationId);
    const departmentName = readString(body.departmentName);
    const notes = readString(body.notes);

    if (!title) {
      return NextResponse.json({ error: "Պաշտոնի անվանումը պարտադիր է։" }, { status: 400 });
    }

    if (!["finera", "organization"].includes(scope)) {
      return NextResponse.json({ error: "Պաշտոնի scope-ը սխալ է։" }, { status: 400 });
    }

    const existing = await prisma.position.findFirst({
      where: {
        title,
        scope,
        organizationId: organizationId || null,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Այս պաշտոնը արդեն կա տվյալ ցուցակում։" },
        { status: 409 }
      );
    }

    const position = await prisma.position.create({
      data: {
        title,
        scope,
        organizationId: organizationId || null,
        departmentName: departmentName || null,
        status: "active",
        notes: notes || null,
      },
    });

    return NextResponse.json({ position: toApiPosition(position) }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Չհաջողվեց պահպանել պաշտոնը DEV DB-ում։" },
      { status: 500 }
    );
  }
}
