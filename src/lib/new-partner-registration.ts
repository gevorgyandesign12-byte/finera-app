export const newPartnerRegistrationTabs = [
  "Ռեկվիզիտներ",
  "Իրավաբանական",
  "Գործունեություն",
  "Հիմնադիրներ",
  "Կառուցվածքային ստորաբաժանումներ",
  "Սպասարկման նշանակում",
  "Պայմանագիր",
] as const;

export type NewPartnerRegistrationTab =
  (typeof newPartnerRegistrationTabs)[number];

export const legalFormOptions = [
  "ՍՊԸ",
  "ԱՁ",
  "ՓԲԸ",
  "ԲԲԸ",
  "ՀԿ",
  "Հիմնադրամ",
  "Այլ",
] as const;

export const residencyStatusOptions = [
  "ՀՀ ռեզիդենտ",
  "Ոչ ռեզիդենտ",
] as const;

export const countryOptions = [
  "Հայաստան",
  "Ռուսաստան",
  "Վրաստան",
  "Իրան",
  "ԱՄՆ",
  "Ֆրանսիա",
  "Գերմանիա",
  "Այլ",
] as const;

export const defaultActivityTypeOptions = [
  "Շինարարություն",
  "Սննդի արտադրություն",
  "Առևտուր",
  "Ծառայությունների մատուցում",
  "Արտադրություն",
  "Տրանսպորտ և լոգիստիկա",
  "Տեղեկատվական տեխնոլոգիաներ",
  "Այլ",
] as const;

export const founderTypeOptions = [
  "Ֆիզիկական անձ",
  "Իրավաբանական անձ",
] as const;

export type NewPartnerActivityDraft = {
  activityType: string;
  activityCode: string;
  isMain: boolean;
};

export type NewPartnerFounderDraft = {
  founderType: string;
  name: string;
  socialCardNumber: string;
  passportOrIdNumber: string;
  taxNumber: string;
  sharePercent: string;
};

export type NewPartnerDepartmentDraft = {
  name: string;
  code: string;
};

export type NewPartnerRegistrationDraft = {
  requisites: {
    name: string;
    taxNumber: string;
    stateRegistryNumber: string;
    postalIndex: string;
  };
  legal: {
    legalForm: string;
    residencyStatus: string;
    country: string;
    region: string;
    city: string;
    street: string;
    buildingType: string;
    buildingNumber: string;
  };
  activities: {
    activityAddress: string;
    items: NewPartnerActivityDraft[];
  };
  founders: NewPartnerFounderDraft[];
  departments: NewPartnerDepartmentDraft[];
};

export function createEmptyNewPartnerRegistrationDraft(): NewPartnerRegistrationDraft {
  return {
    requisites: {
      name: "",
      taxNumber: "",
      stateRegistryNumber: "",
      postalIndex: "",
    },
    legal: {
      legalForm: "ՍՊԸ",
      residencyStatus: "ՀՀ ռեզիդենտ",
      country: "Հայաստան",
      region: "",
      city: "",
      street: "",
      buildingType: "Շենք",
      buildingNumber: "",
    },
    activities: {
      activityAddress: "",
      items: [
        {
          activityType: "",
          activityCode: "",
          isMain: true,
        },
      ],
    },
    founders: [
      {
        founderType: "Ֆիզիկական անձ",
        name: "",
        socialCardNumber: "",
        passportOrIdNumber: "",
        taxNumber: "",
        sharePercent: "",
      },
    ],
    departments: [
      {
        name: "Վարչակազմ",
        code: "",
      },
      {
        name: "Պահեստ",
        code: "",
      },
    ],
  };
}

export function normalizeStateRegistryNumber(value: string): string {
  return value.replace(/[^\d.]/g, "").slice(0, 20);
}

export function resolveCountryByResidencyStatus(
  residencyStatus: string,
  currentCountry: string,
): string {
  if (residencyStatus === "ՀՀ ռեզիդենտ") {
    return "Հայաստան";
  }

  return currentCountry === "Հայաստան" ? "" : currentCountry;
}
