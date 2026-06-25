export type MasterReferenceOption = {
  code: string;
  label: string;
  description: string;
  isActive: boolean;
};

export const residencyStatuses: MasterReferenceOption[] = [
  {
    code: "resident",
    label: "ՀՀ ռեզիդենտ",
    description: "Հայաստանի Հանրապետությունում ռեզիդենտ գործընկեր",
    isActive: true,
  },
  {
    code: "non_resident",
    label: "Ոչ ռեզիդենտ",
    description: "Հայաստանի Հանրապետությունում ոչ ռեզիդենտ գործընկեր",
    isActive: true,
  },
];

export const legalOrganizationTypes: MasterReferenceOption[] = [
  {
    code: "llc",
    label: "ՍՊԸ",
    description: "Սահմանափակ պատասխանատվությամբ ընկերություն",
    isActive: true,
  },
  {
    code: "ie",
    label: "ԱՁ",
    description: "Անհատ ձեռնարկատեր",
    isActive: true,
  },
  {
    code: "cjsc",
    label: "ՓԲԸ",
    description: "Փակ բաժնետիրական ընկերություն",
    isActive: true,
  },
  {
    code: "ojsc",
    label: "ԲԲԸ",
    description: "Բաց բաժնետիրական ընկերություն",
    isActive: true,
  },
  {
    code: "ngo",
    label: "ՀԿ",
    description: "Հասարակական կազմակերպություն",
    isActive: true,
  },
  {
    code: "foundation",
    label: "Հիմնադրամ",
    description: "Հիմնադրամ",
    isActive: true,
  },
  {
    code: "branch",
    label: "Մասնաճյուղ / ներկայացուցչություն",
    description: "Մասնաճյուղ կամ ներկայացուցչություն",
    isActive: true,
  },
  {
    code: "foreign_company",
    label: "Օտարերկրյա կազմակերպություն",
    description: "Ոչ ռեզիդենտ իրավաբանական անձ կամ ընկերություն",
    isActive: true,
  },
  {
    code: "other",
    label: "Այլ",
    description: "Այլ իրավակազմակերպական տեսակ",
    isActive: true,
  },
];
