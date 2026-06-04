export type DemoOrganization = {
  id: string;
  name: string;
  taxId: string;
  status: "active" | "paused" | "demo";
  tenantDatabaseName: string;
  shortDescription: string;
};

export const demoOrganizations: DemoOrganization[] = [
  {
    id: "ararat-llc",
    name: "Արարատ ՍՊԸ",
    taxId: "00000001",
    status: "active",
    tenantDatabaseName: "tenant_ararat_llc_demo",
    shortDescription: "Demo արտադրական կազմակերպություն։",
  },
  {
    id: "lori-trade-llc",
    name: "Լոռի Թրեյդ ՍՊԸ",
    taxId: "00000002",
    status: "active",
    tenantDatabaseName: "tenant_lori_trade_llc_demo",
    shortDescription: "Demo առևտրային կազմակերպություն։",
  },
  {
    id: "syunik-production-llc",
    name: "Սյունիք Արտադրություն ՍՊԸ",
    taxId: "00000003",
    status: "demo",
    tenantDatabaseName: "tenant_syunik_production_llc_demo",
    shortDescription: "Demo արտադրություն և պահեստային հաշվառում։",
  },
];

export const masterDatabaseNote =
  "Demo note: ապագայում master database-ը կպահի tenant registry-ն, իսկ յուրաքանչյուր կազմակերպություն կունենա իր առանձին tenant database-ը։";
