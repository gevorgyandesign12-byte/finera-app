import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function makeTenantDatabaseName(name: string, taxId: string) {
  const base = taxId || name || String(Date.now());

  return `tenant_${base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")}_demo`;
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
    postalCode: organization.postalCode,
    businessAddress: organization.businessAddress,
    tenantDatabaseName: organization.tenantDatabaseName,
    organizationKind: organization.organizationKind,

    serviceStatus: organization.serviceStatus,
    serviceStoppedAt: organization.serviceStoppedAt?.toISOString() ?? null,
    serviceStopReason: organization.serviceStopReason,
    archivedAt: organization.archivedAt?.toISOString() ?? null,

    registryCheckStatus: organization.registryCheckStatus,
    registryCheckedAt: organization.registryCheckedAt?.toISOString() ?? null,
    registryCheckedBy: organization.registryCheckedBy,
    registryName: organization.registryName,
    registryTaxId: organization.registryTaxId,
    registryLegalAddress: organization.registryLegalAddress,
    registryStatus: organization.registryStatus,
    registrySource: organization.registrySource,
    registryNotes: organization.registryNotes,
  };
}

export async function GET(request: NextRequest) {
  const includeArchived = request.nextUrl.searchParams.get("includeArchived") === "1";

  const organizations = await prisma.organization.findMany({
    where: includeArchived ? undefined : { serviceStatus: { not: "archived" } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    organizations: organizations.map((organization: (typeof organizations)[number]) => toApiOrganization(organization)),
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const name = readString(body.name);
    const shortName = readString(body.shortName);
    const legalType = readString(body.legalType);
    const taxId = readString(body.taxId);
    const shortDescription = readString(body.shortDescription);
    const legalAddress = readString(body.legalAddress);
    const postalCode = readString(body.postalCode);
    const businessAddress = readString(body.businessAddress);
    const status = readString(body.status) || "draft";
    const organizationKind = readString(body.organizationKind) || "serviced_partner";

    if (!name) {
      return NextResponse.json({ error: "Անվանումը պարտադիր է։" }, { status: 400 });
    }

    if (!legalType) {
      return NextResponse.json({ error: "Կազմակերպության տեսակը պարտադիր է։" }, { status: 400 });
    }

    if (!taxId) {
      return NextResponse.json({ error: "ՀՎՀՀ-ն պարտադիր է demo գրանցման համար։" }, { status: 400 });
    }

    if (!/^\d{8}$/.test(taxId)) {
      return NextResponse.json(
        { error: "ՀՎՀՀ-ն պետք է լինի միայն 8 թվանշան՝ առանց տառերի կամ նշանների։" },
        { status: 400 }
      );
    }

    const organization = await prisma.organization.create({
      data: {
        name,
        shortName: shortName || null,
        legalType,
        taxId,
        status,
        shortDescription: shortDescription || null,
        legalAddress: legalAddress || null,
        postalCode: postalCode || null,
        businessAddress: businessAddress || null,
        tenantDatabaseName: makeTenantDatabaseName(name, taxId),
        organizationKind: organizationKind === "own_company" ? "own_company" : "serviced_partner",
        serviceStatus: organizationKind === "own_company" ? "own" : "servicing",
        registryCheckStatus: "not_checked",
      },
    });

    return NextResponse.json({ organization: toApiOrganization(organization) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Այս ՀՎՀՀ-ով կազմակերպություն արդեն կա DEV Master DB-ում։" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Կազմակերպությունը չպահպանվեց DEV DB-ում։" },
      { status: 500 }
    );
  }
}
