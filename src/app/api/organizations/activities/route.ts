import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readBoolean(value: unknown) {
  return value === true || value === "true";
}

function toApiActivity(activity: Awaited<ReturnType<typeof prisma.organizationActivity.findFirst>>) {
  if (!activity) {
    return null;
  }

  return {
    id: activity.id,
    organizationId: activity.organizationId,
    title: activity.title,
    code: activity.code,
    isPrimary: activity.isPrimary,
    notes: activity.notes,
    createdAt: activity.createdAt.toISOString(),
    updatedAt: activity.updatedAt.toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const organizationId = request.nextUrl.searchParams.get("organizationId") ?? "";

  if (!organizationId) {
    return NextResponse.json({ error: "Կազմակերպությունը ընտրված չէ։" }, { status: 400 });
  }

  const activities = await prisma.organizationActivity.findMany({
    where: { organizationId },
    orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
  });

  return NextResponse.json({
    activities: activities.map(toApiActivity),
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const organizationId = readString(body.organizationId);
    const title = readString(body.title);
    const code = readString(body.code);
    const isPrimary = readBoolean(body.isPrimary);
    const notes = readString(body.notes);

    if (!organizationId) {
      return NextResponse.json({ error: "Կազմակերպությունը ընտրված չէ։" }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ error: "Գործունեության տեսակը պարտադիր է։" }, { status: 400 });
    }

    if (isPrimary) {
      await prisma.organizationActivity.updateMany({
        where: { organizationId },
        data: { isPrimary: false },
      });
    }

    const activity = await prisma.organizationActivity.create({
      data: {
        organizationId,
        title,
        code: code || null,
        isPrimary,
        notes: notes || null,
      },
    });

    return NextResponse.json({ activity: toApiActivity(activity) }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Չհաջողվեց պահպանել գործունեության տեսակը DEV DB-ում։" },
      { status: 500 }
    );
  }
}
