/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const departments = [
  { name: "Հաշվապահություն", scope: "finera" },
  { name: "Աշխատավարձ և կադրեր", scope: "finera" },
  { name: "Իրավաբանական", scope: "finera" },
  { name: "Կառավարում", scope: "finera" },
  { name: "Տեխնիկական աջակցություն", scope: "finera" },
];

async function main() {
  for (const department of departments) {
    const existing = await prisma.department.findFirst({
      where: {
        name: department.name,
        scope: department.scope,
        organizationId: null,
      },
    });

    if (!existing) {
      await prisma.department.create({ data: department });
    }
  }

  const all = await prisma.department.findMany({
    where: { scope: "finera" },
    orderBy: { name: "asc" },
  });

  console.log("===== FINERA DEPARTMENTS =====");
  console.table(
    all.map((item) => ({
      name: item.name,
      scope: item.scope,
      status: item.status,
    }))
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
