process.env.DATABASE_URL = process.env.DATABASE_URL || "file:./dev.db";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const ownOrganization = {
    name: "Սոսե / Finera Demo ՍՊԸ",
    shortName: "Finera",
    legalType: "ՍՊԸ",
    taxId: "45000000",
    status: "active",
    shortDescription: "Մեր կազմակերպությունը · սեփական հաշվապահություն",
    legalAddress: "ՀՀ, Երևան, Finera Demo հասցե",
    postalCode: "0000",
    businessAddress: "ՀՀ, Երևան, Finera Demo գրասենյակ",
    tenantDatabaseName: "tenant_finera_own_demo",
    organizationKind: "own_company",
    serviceStatus: "own",
    registryCheckStatus: "not_checked",
  };

  const organization = await prisma.organization.upsert({
    where: { taxId: ownOrganization.taxId },
    update: ownOrganization,
    create: ownOrganization,
  });

  const total = await prisma.organization.count();

  const byKind = await prisma.organization.groupBy({
    by: ["organizationKind"],
    _count: { organizationKind: true },
    orderBy: { organizationKind: "asc" },
  });

  const byServiceStatus = await prisma.organization.groupBy({
    by: ["serviceStatus"],
    _count: { serviceStatus: true },
    orderBy: { serviceStatus: "asc" },
  });

  console.log(JSON.stringify({ saved: organization, total, byKind, byServiceStatus }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
