/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const positions = [
  { title: "Գլխավոր հաշվապահ", scope: "finera", departmentName: "Հաշվապահություն" },
  { title: "Հաշվետար", scope: "finera", departmentName: "Հաշվապահություն" },
  { title: "Աշխատավարձի հաշվապահ", scope: "finera", departmentName: "Աշխատավարձ և կադրեր" },
  { title: "HR մասնագետ", scope: "finera", departmentName: "Աշխատավարձ և կադրեր" },
  { title: "Իրավաբան", scope: "finera", departmentName: "Իրավաբանական" },
  { title: "Manager", scope: "finera", departmentName: "Կառավարում" },
  { title: "Support մասնագետ", scope: "finera", departmentName: "Տեխնիկական աջակցություն" },
];

async function main() {
  for (const position of positions) {
    const existing = await prisma.position.findFirst({
      where: {
        title: position.title,
        scope: position.scope,
        organizationId: null,
      },
    });

    if (!existing) {
      await prisma.position.create({ data: position });
    }
  }

  const all = await prisma.position.findMany({
    where: { scope: "finera" },
    orderBy: { title: "asc" },
  });

  console.log("===== FINERA POSITIONS =====");
  console.table(
    all.map((item) => ({
      title: item.title,
      department: item.departmentName,
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
