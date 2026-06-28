export type DemoOrganization = {
  id: string;
  organizationNumber: number;
  name: string;
  taxId: string;
  status: "active" | "paused" | "demo";
  tenantDatabaseName: string;
  shortDescription: string;
};

export const demoOrganizations: DemoOrganization[] = [];

export const masterDatabaseNote =
  "Demo note: ապագայում master database-ը կպահի tenant registry-ն, իսկ յուրաքանչյուր կազմակերպություն կունենա իր առանձին tenant database-ը։";
