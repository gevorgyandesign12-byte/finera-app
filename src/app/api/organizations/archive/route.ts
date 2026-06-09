import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toApiOrganization(organization: Awaited<ReturnType<typeof prisma.organization.findFirst>>) {
  if (!organization) {
    return null;
  }

  return {
    id: organization.id,
    name: organization.name,
    shortName: organization.shortName,
    legalType: organization.legalType,
    taxId: organization.taxId,
    status: organization.status,
    shortDescription: organization.shortDescription,
    legalAddress: organization.legalAddress,
    businessAddress: organization.businessAddress,
    tenantDatabaseName: organization.tenantDatabaseName,
    serviceStatus: organization.serviceStatus,
    serviceStoppedAt: organization.serviceStoppedAt?.toISOString() ?? null,
    serviceStopReason: organization.serviceStopReason,
    archivedAt: organization.archivedAt?.toISOString() ?? null,
    registryCheckStatus: organization.registryCheckStatus,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const organizationId = readString(body.organizationId);
    const reason = readString(body.reason);

    if (!organizationId) {
      return NextResponse.json({ error: "Կազմակերպությունը ընտրված չէ։" }, { status: 400 });
    }

    if (!reason) {
      return NextResponse.json(
        { error: "Սպասարկումը դադարեցնելու պատճառը պարտադիր է։" },
        { status: 400 }
      );
    }

    const organization = await prisma.organization.update({
      where: { id: organizationId },
      data: {
        serviceStatus: "archived",
        status: "inactive",
        serviceStoppedAt: new Date(),
        serviceStopReason: reason,
        archivedAt: new Date(),
      },
    });

    return NextResponse.json({
      organization: toApiOrganization(organization),
    });
  } catch {
    return NextResponse.json(
      { error: "Չհաջողվեց դադարեցնել սպասարկումը և արխիվացնել կազմակերպությունը։" },
      { status: 500 }
    );
  }
}
