import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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
