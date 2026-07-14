export type MasterCity = {
  readonly code: string;
  readonly nameHy: string;
  readonly isActive: boolean;
};

export const masterCities = [
  { code: "CITY-001", nameHy: "Աբովյան", isActive: true },
  { code: "CITY-002", nameHy: "Երևան", isActive: true },
  { code: "CITY-003", nameHy: "Վանաձոր", isActive: true },
] as const satisfies readonly MasterCity[];
