process.env.DATABASE_URL = process.env.DATABASE_URL || "file:./dev.db";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const employees = [
  {
    fullName: "Աննա Մանուկյան",
    email: "anna.manager@finera.demo",
    phone: "+37400000001",
    roleGroup: "manager",
    positionTitle: "Սպասարկման մենեջեր",
    departmentName: "Կառավարում",
    hireDate: "2026-01-10",
    notes: "Տեսնում է բոլոր սպասարկվող կազմակերպությունները",
  },
  {
    fullName: "Մարիամ Սարգսյան",
    email: "mariam.chief@finera.demo",
    phone: "+37400000002",
    roleGroup: "chief_accountant",
    positionTitle: "Գլխավոր հաշվապահ",
    departmentName: "Հաշվապահություն",
    hireDate: "2026-01-15",
    notes: "Վերահսկում է հաշվապահների աշխատանքը",
  },
  {
    fullName: "Լիլիթ Կարապետյան",
    email: "lilit.chief@finera.demo",
    phone: "+37400000003",
    roleGroup: "chief_accountant",
    positionTitle: "Գլխավոր հաշվապահ",
    departmentName: "Հաշվապահություն",
    hireDate: "2026-01-20",
    notes: "Վերահսկում է հաշվապահների աշխատանքը",
  },
  {
    fullName: "Հայկ Պետրոսյան",
    email: "hayk.accountant@finera.demo",
    phone: "+37400000004",
    roleGroup: "accountant",
    positionTitle: "Հաշվապահ",
    departmentName: "Հաշվապահություն",
    hireDate: "2026-02-01",
    notes: "Դրամարկղ, բանկ, փաստաթղթեր",
  },
  {
    fullName: "Նարեկ Գրիգորյան",
    email: "narek.accountant@finera.demo",
    phone: "+37400000005",
    roleGroup: "accountant",
    positionTitle: "Հաշվապահ",
    departmentName: "Հաշվապահություն",
    hireDate: "2026-02-03",
    notes: "Գնումներ, վաճառք, փաստաթղթեր",
  },
  {
    fullName: "Սոնա Հարությունյան",
    email: "sona.accountant@finera.demo",
    phone: "+37400000006",
    roleGroup: "accountant",
    positionTitle: "Հաշվապահ",
    departmentName: "Հաշվապահություն",
    hireDate: "2026-02-05",
    notes: "Պահեստ, նյութեր, ապրանքներ",
  },
  {
    fullName: "Արմեն Խաչատրյան",
    email: "armen.accountant@finera.demo",
    phone: "+37400000007",
    roleGroup: "accountant",
    positionTitle: "Հաշվապահ",
    departmentName: "Հաշվապահություն",
    hireDate: "2026-02-07",
    notes: "Հարկային հաշվետվություններ",
  },
  {
    fullName: "Գայանե Ավետիսյան",
    email: "gayane.payroll@finera.demo",
    phone: "+37400000008",
    roleGroup: "payroll_hr",
    positionTitle: "Աշխատավարձի և կադրերի մասնագետ",
    departmentName: "Աշխատավարձ և կադրեր",
    hireDate: "2026-02-10",
    notes: "Աշխատավարձ, կադրեր, պայմանագրեր",
  },
  {
    fullName: "Արթուր Մելիքյան",
    email: "artur.support@finera.demo",
    phone: "+37400000009",
    roleGroup: "support",
    positionTitle: "Հաճախորդների աջակցման մասնագետ",
    departmentName: "Աջակցություն",
    hireDate: "2026-02-15",
    notes: "Հարցումներ և հաճախորդների աջակցություն",
  },
  {
    fullName: "Վահե Մկրտչյան",
    email: "vahe.tech@finera.demo",
    phone: "+37400000010",
    roleGroup: "tech",
    positionTitle: "Տեխնիկական ադմինիստրատոր",
    departmentName: "Տեխնիկական բաժին",
    hireDate: "2026-02-20",
    notes: "System-level սպասարկում, backups, logs",
  },
];

async function main() {
  let created = 0;
  let skipped = 0;

  for (const employee of employees) {
    const existing = await prisma.fineraEmployee.findUnique({
      where: { email: employee.email },
    });

    if (existing) {
      skipped += 1;
      continue;
    }

    await prisma.fineraEmployee.create({
      data: {
        ...employee,
        employmentType: "full_time",
        employmentStatus: "active",
      },
    });

    created += 1;
  }

  const total = await prisma.fineraEmployee.count();

  const byRole = await prisma.fineraEmployee.groupBy({
    by: ["roleGroup"],
    _count: { roleGroup: true },
    orderBy: { roleGroup: "asc" },
  });

  console.log(JSON.stringify({ created, skipped, total, byRole }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
