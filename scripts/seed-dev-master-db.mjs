import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const organizations = [
  {
    name: "Լուկաս ՍՊԸ",
    shortName: "Լուկաս",
    legalType: "ՍՊԸ",
    taxId: "00000001",
    status: "active",
    shortDescription: "Demo սպասարկվող կազմակերպություն",
    legalAddress: "ՀՀ, Երևան, demo հասցե 1",
    businessAddress: "ՀՀ, Երևան, demo հասցե 1",
    tenantDatabaseName: "tenant_lukas_demo",
  },
  {
    name: "Արթուր Կեզ ԱՁ",
    shortName: "Արթուր Կեզ",
    legalType: "ԱՁ",
    taxId: "00000002",
    status: "active",
    shortDescription: "Demo անհատ ձեռնարկատեր",
    legalAddress: "ՀՀ, Երևան, demo հասցե 2",
    businessAddress: "ՀՀ, Երևան, demo հասցե 2",
    tenantDatabaseName: "tenant_arthur_kez_demo",
  },
  {
    name: "Նարեկ Demo ՍՊԸ",
    shortName: "Նարեկ Demo",
    legalType: "ՍՊԸ",
    taxId: "00000003",
    status: "draft",
    shortDescription: "Demo նոր գործընկեր",
    legalAddress: "ՀՀ, Երևան, demo հասցե 3",
    businessAddress: "ՀՀ, Երևան, demo հասցե 3",
    tenantDatabaseName: "tenant_narek_demo",
  },
];

for (const organization of organizations) {
  await prisma.organization.upsert({
    where: { taxId: organization.taxId },
    update: organization,
    create: organization,
  });
}

const all = await prisma.organization.findMany({
  orderBy: { createdAt: "asc" },
});

console.log("");
console.log("===== DEV MASTER DB ԿԱԶՄԱԿԵՐՊՈՒԹՅՈՒՆՆԵՐ =====");
console.table(
  all.map((item) => ({
    name: item.name,
    legalType: item.legalType,
    taxId: item.taxId,
    status: item.status,
    tenantDb: item.tenantDatabaseName,
  }))
);

await prisma.$disconnect();
