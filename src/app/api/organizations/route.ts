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

function formatServiceCode(sequence: number) {
  return `FIN-${String(sequence).padStart(4, "0")}`;
}

async function makeNextServiceCode() {
  const organizations = await prisma.organization.findMany({
    select: { serviceCode: true },
  });

  const maxFromCodes = organizations.reduce((max, organization) => {
    const match = organization.serviceCode?.match(/^FIN-(\d+)$/);
    const value = match ? Number.parseInt(match[1] ?? "0", 10) : 0;

    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 0);

  const fallbackCount = await prisma.organization.count({
    where: { organizationKind: { not: "own_company" } },
  });

  return formatServiceCode(Math.max(maxFromCodes, fallbackCount) + 1);
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
    serviceCode: organization.serviceCode,
    status: organization.status,
    shortDescription: organization.shortDescription,
    legalAddress: organization.legalAddress,
    postalCode: organization.postalCode,
    businessAddress: organization.businessAddress,
    tenantDatabaseName: organization.tenantDatabaseName,
    tenantDatabaseStatus: organization.tenantDatabaseStatus,
    tenantDatabaseCreatedAt: organization.tenantDatabaseCreatedAt?.toISOString() ?? null,
    tenantDatabaseError: organization.tenantDatabaseError,
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
    stateRegistrationDate: organization.stateRegistrationDate,
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
    const stateRegistrationDate = readString(body.stateRegistrationDate);

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

    const serviceCode = organizationKind === "own_company" ? null : await makeNextServiceCode();

    const organization = await prisma.organization.create({
      data: {
        name,
        shortName: shortName || null,
        legalType,
        taxId,
        serviceCode,
        status,
        shortDescription: shortDescription || null,
        legalAddress: legalAddress || null,
        postalCode: postalCode || null,
        businessAddress: businessAddress || null,
        tenantDatabaseName: makeTenantDatabaseName(name, taxId),
        organizationKind: organizationKind === "own_company" ? "own_company" : "serviced_partner",
        serviceStatus: organizationKind === "own_company" ? "own" : "servicing",
        registryCheckStatus: "not_checked",
        stateRegistrationDate: stateRegistrationDate || null,
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

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const organizationId = readString(body.organizationId);
    const name = readString(body.name);
    const shortName = readString(body.shortName);
    const legalType = readString(body.legalType);
    const taxId = readString(body.taxId);
    const shortDescription = readString(body.shortDescription);
    const legalAddress = readString(body.legalAddress);
    const postalCode = readString(body.postalCode);
    const businessAddress = readString(body.businessAddress);
    const status = readString(body.status) || "draft";
    const stateRegistrationDate = readString(body.stateRegistrationDate);

    if (!organizationId) {
      return NextResponse.json({ error: "\u053f\u0561\u0566\u0574\u0561\u056f\u0565\u0580\u057a\u0578\u0582\u0569\u0575\u0561\u0576 ID-\u0576 \u057a\u0561\u0580\u057f\u0561\u0564\u056b\u0580 \u0567\u0589" }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ error: "\u0531\u0576\u057e\u0561\u0576\u0578\u0582\u0574\u0568 \u057a\u0561\u0580\u057f\u0561\u0564\u056b\u0580 \u0567\u0589" }, { status: 400 });
    }

    if (!legalType) {
      return NextResponse.json({ error: "\u053f\u0561\u0566\u0574\u0561\u056f\u0565\u0580\u057a\u0578\u0582\u0569\u0575\u0561\u0576 \u057f\u0565\u057d\u0561\u056f\u0568 \u057a\u0561\u0580\u057f\u0561\u0564\u056b\u0580 \u0567\u0589" }, { status: 400 });
    }

    if (!taxId) {
      return NextResponse.json({ error: "\u0540\u054e\u0540\u0540-\u0576 \u057a\u0561\u0580\u057f\u0561\u0564\u056b\u0580 \u0567 demo \u0563\u0580\u0561\u0576\u0581\u0574\u0561\u0576 \u0570\u0561\u0574\u0561\u0580\u0589" }, { status: 400 });
    }

    if (!/^\d{8}$/.test(taxId)) {
      return NextResponse.json(
        { error: "\u0540\u054e\u0540\u0540-\u0576 \u057a\u0565\u057f\u0584 \u0567 \u056c\u056b\u0576\u056b \u0574\u056b\u0561\u0575\u0576 8 \u0569\u057e\u0561\u0576\u0577\u0561\u0576\u055d \u0561\u057c\u0561\u0576\u0581 \u057f\u0561\u057c\u0565\u0580\u056b \u056f\u0561\u0574 \u0576\u0577\u0561\u0576\u0576\u0565\u0580\u056b\u0589" },
        { status: 400 }
      );
    }

    const organization = await prisma.organization.update({
      where: { id: organizationId },
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
        stateRegistrationDate: stateRegistrationDate || null,
      },
    });

    return NextResponse.json({ organization: toApiOrganization(organization) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "\u0531\u0575\u057d \u0540\u054e\u0540\u0540-\u0578\u057e \u056f\u0561\u0566\u0574\u0561\u056f\u0565\u0580\u057a\u0578\u0582\u0569\u0575\u0578\u0582\u0576 \u0561\u0580\u0564\u0565\u0576 \u056f\u0561 DEV Master DB-\u0578\u0582\u0574\u0589" },
        { status: 409 }
      );
    }

    if (message.includes("Record to update not found")) {
      return NextResponse.json(
        { error: "\u053f\u0561\u0566\u0574\u0561\u056f\u0565\u0580\u057a\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0568 \u0579\u0563\u057f\u0576\u057e\u0565\u0581 DEV DB-\u0578\u0582\u0574\u0589" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "\u053f\u0561\u0566\u0574\u0561\u056f\u0565\u0580\u057a\u0578\u0582\u0569\u0575\u0561\u0576 \u057f\u057e\u0575\u0561\u056c\u0576\u0565\u0580\u0568 \u0579\u0569\u0561\u0580\u0574\u0561\u0581\u057e\u0565\u0581\u056b\u0576 DEV DB-\u0578\u0582\u0574\u0589" },
      { status: 500 }
    );
  }
}
