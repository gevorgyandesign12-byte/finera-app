export type CountryReferenceOption = {
  code: string;
  isoAlpha2: string;
  isoAlpha3: string;
  isoNumeric: string;
  nameHy: string;
  nameEn: string;
  isActive: boolean;
};

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
    code: "1001",
    label: "ՍՊԸ",
    description: "Սահմանափակ պատասխանատվությամբ ընկերություն",
    isActive: true,
  },
  {
    code: "1002",
    label: "ԱՁ",
    description: "Անհատ ձեռնարկատեր",
    isActive: true,
  },
  {
    code: "1003",
    label: "ՓԲԸ",
    description: "Փակ բաժնետիրական ընկերություն",
    isActive: true,
  },
  {
    code: "1004",
    label: "ԲԲԸ",
    description: "Բաց բաժնետիրական ընկերություն",
    isActive: true,
  },
  {
    code: "1005",
    label: "ՀԿ",
    description: "Հասարակական կազմակերպություն",
    isActive: true,
  },
  {
    code: "1006",
    label: "Հիմնադրամ",
    description: "Հիմնադրամ",
    isActive: true,
  },
  {
    code: "1007",
    label: "Մասնաճյուղ / ներկայացուցչություն",
    description: "Մասնաճյուղ կամ ներկայացուցչություն",
    isActive: true,
  },
  {
    code: "1008",
    label: "Օտարերկրյա կազմակերպություն",
    description: "Ոչ ռեզիդենտ իրավաբանական անձ կամ ընկերություն",
    isActive: true,
  },
  {
    code: "1009",
    label: "Այլ",
    description: "Այլ իրավակազմակերպական տեսակ",
    isActive: true,
  },
];

export const countries: CountryReferenceOption[] = [
  { code: "1001", isoAlpha2: "AM", isoAlpha3: "ARM", isoNumeric: "051", nameHy: "Հայաստան", nameEn: "Armenia", isActive: true },
  { code: "1002", isoAlpha2: "RU", isoAlpha3: "RUS", isoNumeric: "643", nameHy: "Ռուսաստան", nameEn: "Russia", isActive: true },
  { code: "1003", isoAlpha2: "US", isoAlpha3: "USA", isoNumeric: "840", nameHy: "ԱՄՆ", nameEn: "United States", isActive: true },
  { code: "1004", isoAlpha2: "GE", isoAlpha3: "GEO", isoNumeric: "268", nameHy: "Վրաստան", nameEn: "Georgia", isActive: true },
  { code: "1005", isoAlpha2: "TR", isoAlpha3: "TUR", isoNumeric: "792", nameHy: "Թուրքիա", nameEn: "Turkey", isActive: true },
  { code: "1006", isoAlpha2: "AE", isoAlpha3: "ARE", isoNumeric: "784", nameHy: "ԱՄԷ", nameEn: "United Arab Emirates", isActive: true },
  { code: "1007", isoAlpha2: "CN", isoAlpha3: "CHN", isoNumeric: "156", nameHy: "Չինաստան", nameEn: "China", isActive: true },
  { code: "1008", isoAlpha2: "IN", isoAlpha3: "IND", isoNumeric: "356", nameHy: "Հնդկաստան", nameEn: "India", isActive: true },
  { code: "1009", isoAlpha2: "DE", isoAlpha3: "DEU", isoNumeric: "276", nameHy: "Գերմանիա", nameEn: "Germany", isActive: true },
  { code: "1010", isoAlpha2: "FR", isoAlpha3: "FRA", isoNumeric: "250", nameHy: "Ֆրանսիա", nameEn: "France", isActive: true },
  { code: "1011", isoAlpha2: "IT", isoAlpha3: "ITA", isoNumeric: "380", nameHy: "Իտալիա", nameEn: "Italy", isActive: true },
  { code: "1012", isoAlpha2: "GB", isoAlpha3: "GBR", isoNumeric: "826", nameHy: "Մեծ Բրիտանիա", nameEn: "United Kingdom", isActive: true },
  { code: "1999", isoAlpha2: "OTHER", isoAlpha3: "OTHER", isoNumeric: "000", nameHy: "Այլ երկիր", nameEn: "Other country", isActive: true },
];

