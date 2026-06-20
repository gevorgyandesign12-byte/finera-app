process.env.DATABASE_URL = process.env.DATABASE_URL || "file:./dev.db";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const legalTypes = [
  "ՍՊԸ", "ՍՊԸ", "ՍՊԸ", "ՍՊԸ", "ՍՊԸ",
  "ԱՁ", "ԱՁ",
  "Համատիրություն",
  "ՓԲԸ",
];

const baseNames = [
  "Արենի Վայն", "Նորք Ֆուդ", "Լուսակերտ Շին", "Արմ Մետալ", "Էրեբունի Տեքստիլ",
  "Սևան Լոգիստիկ", "Շիրակ Ագրո", "Դիլիջան Հոթել", "Արարատ Բետոն", "Գյումրի Բիլդ",
  "Վանաձոր Մարկետ", "Անի Ֆուդ", "Մասիս Ֆարմ", "Կապան Քար", "Տավուշ Վուդ",
  "Արմավիր Աուտո", "Վեդի Ջերմոց", "Ապարան Կաթ", "Մեղրի Ֆրութ", "Հրազդան Էներգո",
  "Արթուր Մելիքյան", "Նարեկ Գրիգորյան", "Մարիամ Ավետիսյան", "Գագիկ Պետրոսյան", "Սոնա Կարապետյան",
  "Հայկ Սարգսյան", "Արմեն Խաչատրյան", "Լիլիթ Մանուկյան", "Վահե Հարությունյան", "Աննա Մկրտչյան",
  "Կոմիտաս 12", "Նալբանդյան 45", "Մաշտոց 18", "Աջափնյակ 7", "Դավթաշեն 3",
  "Ավան 22", "Արմ Ինվեստ", "Կովկաս Էներջի", "Արաքս Տեք", "Հայ Լոջիք",
  "Արմենիա Քեմիքլ", "Գյումրի Մոլ", "Սյունիք Մայնինգ", "Արարատ Տրանս", "Երևան Դեվելոփմենթ",
];

const descriptions = {
  "ՍՊԸ": "Սահմանափակ պատասխանատվությամբ ընկերություն · սպասարկվող գործընկեր",
  "ԱՁ": "Անհատ ձեռնարկատեր · սպասարկվող գործընկեր",
  "Համատիրություն": "Համատիրություն · շենքի կառավարման հաշվառում",
  "ՓԲԸ": "Փակ բաժնետիրական ընկերություն · սպասարկվող գործընկեր",
};

function buildOrganization(index) {
  const legalType = legalTypes[index % legalTypes.length];
  const baseName = baseNames[index];
  const taxId = String(45100001 + index);

  return {
    name: legalType === "ԱՁ" ? `${baseName} ԱՁ` : `${baseName} ${legalType}`,
    shortName: legalType === "ԱՁ" ? `${baseName} ԱՁ` : `${baseName}`,
    legalType,
    taxId,
    status: "active",
    shortDescription: descriptions[legalType],
    legalAddress: `ՀՀ, Երևան, Demo հասցե ${index + 1}`,
    postalCode: "0000",
    businessAddress: `ՀՀ, Երևան, Demo հասցե ${index + 1}`,
    tenantDatabaseName: `tenant_${taxId}_demo`,
    serviceStatus: "servicing",
    registryCheckStatus: "not_checked",
  };
}

async function main() {
  let created = 0;
  let skipped = 0;

  for (let index = 0; index < 45; index += 1) {
    const organization = buildOrganization(index);

    const existing = await prisma.organization.findUnique({
      where: { taxId: organization.taxId },
    });

    if (existing) {
      skipped += 1;
      continue;
    }

    await prisma.organization.create({
      data: organization,
    });

    created += 1;
  }

  const total = await prisma.organization.count();
  const byType = await prisma.organization.groupBy({
    by: ["legalType"],
    _count: { legalType: true },
    orderBy: { legalType: "asc" },
  });

  console.log(JSON.stringify({ created, skipped, total, byType }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
