process.env.DATABASE_URL = process.env.DATABASE_URL || "file:./dev.db";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getEmployeeByEmail(email) {
  const employee = await prisma.fineraEmployee.findUnique({ where: { email } });

  if (!employee) {
    throw new Error(`Finera employee not found: ${email}`);
  }

  return employee;
}

async function upsertAssignment({ organizationId, fineraEmployeeId, roleScope, workScope, notes }) {
  await prisma.serviceAssignment.upsert({
    where: {
      organizationId_fineraEmployeeId_roleScope_workScope: {
        organizationId,
        fineraEmployeeId,
        roleScope,
        workScope,
      },
    },
    update: {
      status: "active",
      notes,
      endedAt: null,
    },
    create: {
      organizationId,
      fineraEmployeeId,
      roleScope,
      workScope,
      status: "active",
      notes,
    },
  });
}

async function main() {
  const organizations = await prisma.organization.findMany({
    where: { serviceStatus: "servicing" },
    orderBy: { taxId: "asc" },
  });

  const manager = await getEmployeeByEmail("anna.manager@finera.demo");

  const chiefAccountants = [
    await getEmployeeByEmail("mariam.chief@finera.demo"),
    await getEmployeeByEmail("lilit.chief@finera.demo"),
  ];

  const accountants = [
    await getEmployeeByEmail("hayk.accountant@finera.demo"),
    await getEmployeeByEmail("narek.accountant@finera.demo"),
    await getEmployeeByEmail("sona.accountant@finera.demo"),
    await getEmployeeByEmail("armen.accountant@finera.demo"),
  ];

  const payrollHr = await getEmployeeByEmail("gayane.payroll@finera.demo");
  const support = await getEmployeeByEmail("artur.support@finera.demo");
  const tech = await getEmployeeByEmail("vahe.tech@finera.demo");

  const accountantScopes = [
    "cash_bank",
    "purchase_sales_documents",
    "warehouse_inventory",
    "tax_reports",
  ];

  let operations = 0;

  for (const [index, organization] of organizations.entries()) {
    await upsertAssignment({
      organizationId: organization.id,
      fineraEmployeeId: manager.id,
      roleScope: "manager",
      workScope: "service_management",
      notes: "Demo manager assignment for serviced organization",
    });
    operations += 1;

    const chief = chiefAccountants[index % chiefAccountants.length];

    await upsertAssignment({
      organizationId: organization.id,
      fineraEmployeeId: chief.id,
      roleScope: "chief_accountant",
      workScope: "accounting_supervision",
      notes: "Demo chief accountant supervision",
    });
    operations += 1;

    const primaryAccountant = accountants[index % accountants.length];
    const secondaryAccountant = accountants[(index + 1) % accountants.length];

    await upsertAssignment({
      organizationId: organization.id,
      fineraEmployeeId: primaryAccountant.id,
      roleScope: "accountant",
      workScope: accountantScopes[index % accountantScopes.length],
      notes: "Demo primary accounting scope",
    });
    operations += 1;

    await upsertAssignment({
      organizationId: organization.id,
      fineraEmployeeId: secondaryAccountant.id,
      roleScope: "accountant",
      workScope: "documents",
      notes: "Demo document processing support",
    });
    operations += 1;

    await upsertAssignment({
      organizationId: organization.id,
      fineraEmployeeId: payrollHr.id,
      roleScope: "payroll_hr",
      workScope: "payroll_and_hr",
      notes: "Demo payroll and HR scope",
    });
    operations += 1;

    await upsertAssignment({
      organizationId: organization.id,
      fineraEmployeeId: support.id,
      roleScope: "support",
      workScope: "customer_support",
      notes: "Demo client support scope",
    });
    operations += 1;

    await upsertAssignment({
      organizationId: organization.id,
      fineraEmployeeId: tech.id,
      roleScope: "tech",
      workScope: "technical_support",
      notes: "Demo technical support scope",
    });
    operations += 1;
  }

  const total = await prisma.serviceAssignment.count();

  const byRole = await prisma.serviceAssignment.groupBy({
    by: ["roleScope"],
    _count: { roleScope: true },
    orderBy: { roleScope: "asc" },
  });

  const workload = await prisma.fineraEmployee.findMany({
    orderBy: { fullName: "asc" },
    select: {
      fullName: true,
      roleGroup: true,
      serviceAssignments: {
        where: { status: "active" },
        select: {
          roleScope: true,
          workScope: true,
        },
      },
    },
  });

  console.log(JSON.stringify({ organizations: organizations.length, operations, total, byRole }, null, 2));

  console.table(
    workload.map((employee) => ({
      employee: employee.fullName,
      roleGroup: employee.roleGroup,
      activeAssignments: employee.serviceAssignments.length,
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
