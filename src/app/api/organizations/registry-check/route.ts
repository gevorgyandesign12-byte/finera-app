import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalize(value: string | null | undefined) {
  return (value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[«»"]/g, "")
    .toLowerCase();
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
    businessAddress: organization.businessAddress,
    tenantDatabaseName: organization.tenantDatabaseName,
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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const organizationId = readString(body.organizationId);
    const registryName = readString(body.registryName);
    const registryTaxId = readString(body.registryTaxId);
    const registryLegalAddress = readString(body.registryLegalAddress);
    const registryStatus = readString(body.registryStatus);
    const registrySource = readString(body.registrySource);
    const registryNotes = readString(body.registryNotes);

    if (!organizationId) {
      return NextResponse.json({ error: "Կազմակերպությունը ընտրված չէ։" }, { status: 400 });
    }

    if (!registryName) {
      return NextResponse.json({ error: "Պետռեգիստրի անվանումը պարտադիր է։" }, { status: 400 });
    }

    if (!/^\d{8}$/.test(registryTaxId)) {
      return NextResponse.json(
        { error: "Պետռեգիստրի ՀՎՀՀ-ն պետք է լինի 8 թվանշան։" },
        { status: 400 }
      );
    }

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      return NextResponse.json({ error: "Կազմակերպությունը չգտնվեց DEV DB-ում։" }, { status: 404 });
    }

    const differences: string[] = [];

    if (normalize(organization.name) !== normalize(registryName)) {
      differences.push("Անվանումը չի համընկնում");
    }

    if ((organization.taxId ?? "") !== registryTaxId) {
      differences.push("ՀՎՀՀ-ն չի համընկնում");
    }

    if (
      registryLegalAddress &&
      normalize(organization.legalAddress) !== normalize(registryLegalAddress)
    ) {
      differences.push("Իրավաբանական հասցեն չի համընկնում");
    }

    const registryCheckStatus =
      differences.length === 0 ? "verified" : registryLegalAddress ? "mismatch" : "needs_review";

    const updatedOrganization = await prisma.organization.update({
      where: { id: organizationId },
      data: {
        registryCheckStatus,
        registryCheckedAt: new Date(),
        registryCheckedBy: "demo-user",
        registryName,
        registryTaxId,
        registryLegalAddress: registryLegalAddress || null,
        registryStatus: registryStatus || null,
        registrySource: registrySource || "manual_demo",
        registryNotes: registryNotes || null,
      },
    });

    return NextResponse.json({
      organization: toApiOrganization(updatedOrganization),
      differences,
      registryCheckStatus,
    });
  } catch {
    return NextResponse.json(
      { error: "Չհաջողվեց կատարել պետռեգիստրի manual համադրումը։" },
      { status: 500 }
    );
  }
}
