import { NextResponse } from "next/server";
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

export async function GET() {
  const organizations = await prisma.organization.findMany({
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    organizations: organizations.map((organization) => ({
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
    })),
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
    const businessAddress = readString(body.businessAddress);
    const status = readString(body.status) || "draft";

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
        businessAddress: businessAddress || null,
        tenantDatabaseName: makeTenantDatabaseName(name, taxId),
      },
    });

    return NextResponse.json(
      {
        organization: {
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
        },
      },
      { status: 201 }
    );
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
