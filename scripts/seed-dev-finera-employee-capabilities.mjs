process.env.DATABASE_URL = process.env.DATABASE_URL || "file:./dev.db";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const capabilitiesByEmail = {
  "anna.manager@finera.demo": ["manager"],
  "mariam.chief@finera.demo": ["chief_accountant", "accountant"],
  "lilit.chief@finera.demo": ["chief_accountant"],
  "hayk.accountant@finera.demo": ["accountant"],
  "narek.accountant@finera.demo": ["accountant", "support"],
  "sona.accountant@finera.demo": ["accountant"],
  "armen.accountant@finera.demo": ["accountant", "chief_accountant"],
  "gayane.payroll@finera.demo": ["payroll_hr"],
  "artur.support@finera.demo": ["support"],
  "vahe.tech@finera.demo": ["tech", "support"],
};

const capabilityNotes = {
  manager: "Կարող է կառավարել սպասարկման նշանակումները",
  chief_accountant: "Կարող է նշանակվել որպես գլխավոր հաշվապահ",
  accountant: "Կարող է նշանակվել որպես հաշվետար / հաշվապահական աշխատանք կատարող",
  payroll_hr: "Կարող է նշանակվել աշխատավարձի և կադրերի աշխատանքի համար",
  support: "Կարող է նշանակվել հաճախորդների սպասարկման / support աշխատանքի համար",
  tech: "Կարող է նշանակվել տեխնիկական սպասարկման համար",
};

async function main() {
  let created = 0;
  let updated = 0;
  let skippedMissingEmployee = 0;

  for (const [email, capabilities] of Object.entries(capabilitiesByEmail)) {
    const employee = await prisma.fineraEmployee.findUnique({
      where: { email },
      select: { id: true, fullName: true, email: true },
    });

    if (!employee) {
      skippedMissingEmployee += 1;
      console.warn(`Չգտնվեց աշխատակիցը՝ ${email}`);
      continue;
    }

    for (const capabilityScope of capabilities) {
      const existing = await prisma.fineraEmployeeCapability.findUnique({
        where: {
          fineraEmployeeId_capabilityScope: {
            fineraEmployeeId: employee.id,
            capabilityScope,
          },
        },
      });

      await prisma.fineraEmployeeCapability.upsert({
        where: {
          fineraEmployeeId_capabilityScope: {
            fineraEmployeeId: employee.id,
            capabilityScope,
          },
        },
        update: {
          status: "active",
          notes: capabilityNotes[capabilityScope] ?? null,
        },
        create: {
          fineraEmployeeId: employee.id,
          capabilityScope,
          status: "active",
          notes: capabilityNotes[capabilityScope] ?? null,
        },
      });

      if (existing) {
        updated += 1;
      } else {
        created += 1;
      }
    }
  }

  const total = await prisma.fineraEmployeeCapability.count();

  const byCapability = await prisma.fineraEmployeeCapability.groupBy({
    by: ["capabilityScope"],
    _count: { capabilityScope: true },
    orderBy: { capabilityScope: "asc" },
  });

  const employees = await prisma.fineraEmployee.findMany({
    orderBy: { fullName: "asc" },
    select: {
      fullName: true,
      roleGroup: true,
      capabilities: {
        where: { status: "active" },
        orderBy: { capabilityScope: "asc" },
        select: { capabilityScope: true },
      },
    },
  });

  console.log(JSON.stringify({ created, updated, skippedMissingEmployee, total, byCapability }, null, 2));

  console.table(
    employees.map((employee) => ({
      employee: employee.fullName,
      primaryRoleGroup: employee.roleGroup,
      capabilities: employee.capabilities.map((capability) => capability.capabilityScope).join(", "),
    })),
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
