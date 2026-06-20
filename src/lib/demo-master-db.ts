export type DemoEmployeeStatus = "active" | "inactive" | "planned";

export type DemoRoleGroup =
  | "owner"
  | "manager"
  | "chief-accountant"
  | "bookkeeper"
  | "hr-legal"
  | "support"
  | "technical"
  | "controller";

export type DemoDepartment = {
  id: string;
  name: string;
  description: string;
};

export type DemoPosition = {
  id: string;
  name: string;
  departmentId: string;
};

export type DemoEmployee = {
  id: string;
  employeeNumber: string;
  fullName: string;
  departmentId: string;
  positionId: string;
  roleGroup: DemoRoleGroup;
  status: DemoEmployeeStatus;
  canLogin: boolean;
  assignedPartnerScope: "all" | "assigned-only" | "none";
  note: string;
};

export type DemoAccessScope = "accounting" | "hr" | "support" | "management" | "control";

export type DemoOrganizationAccess = {
  employeeId: string;
  organizationId: string;
  accessScope: DemoAccessScope;
  accessRole?: string;
  status: "active" | "inactive";
};

export const masterDbDemoNote =
  "Սա Master DB-ի demo/sandbox տվյալների շերտ է։ Այստեղ պահվում են Finera/Sose-ի ներքին աշխատակիցները, դերերը, բաժինները և սպասարկվող գործընկերների հետ կապերը։ Սա դեռ production database չէ։";

export const demoDepartments: DemoDepartment[] = [
  {
    id: "dept-management",
    name: "Կառավարում",
    description: "Ընդհանուր վերահսկում, որոշումներ, հաստատումներ",
  },
  {
    id: "dept-accounting",
    name: "Հաշվապահություն",
    description: "Գլխավոր հաշվապահներ և հաշվետարներ",
  },
  {
    id: "dept-hr-legal",
    name: "Կադրեր և իրավական",
    description: "Կադրային, աշխատանքային և իրավական գործընթացներ",
  },
  {
    id: "dept-support",
    name: "Սպասարկում",
    description: "Գործընկերների հարցումներ, հաղորդակցություն և follow-up",
  },
  {
    id: "dept-technical",
    name: "Տեխնիկական թիմ",
    description: "Ծրագիր, DevOps, անվտանգություն, backup և deploy վերահսկում",
  },
  {
    id: "dept-control",
    name: "Վերահսկում",
    description: "Որակի վերահսկում, ներքին ստուգումներ, ռիսկերի գնահատում",
  },
];

export const demoPositions: DemoPosition[] = [
  { id: "pos-owner", name: "Տնօրեն / հիմնադիր", departmentId: "dept-management" },
  { id: "pos-service-manager", name: "Սպասարկման ղեկավար", departmentId: "dept-management" },
  { id: "pos-chief-accountant", name: "Գլխավոր հաշվապահ", departmentId: "dept-accounting" },
  { id: "pos-senior-bookkeeper", name: "Ավագ հաշվետար", departmentId: "dept-accounting" },
  { id: "pos-bookkeeper", name: "Հաշվետար", departmentId: "dept-accounting" },
  { id: "pos-hr-legal", name: "Կադրային / իրավական մասնագետ", departmentId: "dept-hr-legal" },
  { id: "pos-support-specialist", name: "Սպասարկման մասնագետ", departmentId: "dept-support" },
  { id: "pos-devops", name: "Տեխնիկական / DevOps մասնագետ", departmentId: "dept-technical" },
  { id: "pos-controller", name: "Ներքին վերահսկող", departmentId: "dept-control" },
];

export const demoEmployees: DemoEmployee[] = [
  {
    id: "emp-001",
    employeeNumber: "FIN-001",
    fullName: "Տիգրան Գևորգյան",
    departmentId: "dept-management",
    positionId: "pos-owner",
    roleGroup: "owner",
    status: "active",
    canLogin: true,
    assignedPartnerScope: "all",
    note: "Owner / Product Owner / ընդհանուր վերահսկում",
  },
  {
    id: "emp-002",
    employeeNumber: "FIN-002",
    fullName: "Անահիտ Մելիքյան",
    departmentId: "dept-accounting",
    positionId: "pos-chief-accountant",
    roleGroup: "chief-accountant",
    status: "active",
    canLogin: true,
    assignedPartnerScope: "assigned-only",
    note: "Գլխավոր հաշվապահ, սպասարկում է իրեն վստահված գործընկերներին",
  },
  {
    id: "emp-003",
    employeeNumber: "FIN-003",
    fullName: "Նարեկ Սարգսյան",
    departmentId: "dept-accounting",
    positionId: "pos-chief-accountant",
    roleGroup: "chief-accountant",
    status: "active",
    canLogin: true,
    assignedPartnerScope: "assigned-only",
    note: "Գլխավոր հաշվապահ, թիմի վերահսկում",
  },
  {
    id: "emp-004",
    employeeNumber: "FIN-004",
    fullName: "Մարիամ Հովհաննիսյան",
    departmentId: "dept-accounting",
    positionId: "pos-chief-accountant",
    roleGroup: "chief-accountant",
    status: "active",
    canLogin: true,
    assignedPartnerScope: "assigned-only",
    note: "Գլխավոր հաշվապահ, բարդ հաշվառման վերահսկում",
  },
  {
    id: "emp-005",
    employeeNumber: "FIN-005",
    fullName: "Գայանե Պետրոսյան",
    departmentId: "dept-accounting",
    positionId: "pos-senior-bookkeeper",
    roleGroup: "bookkeeper",
    status: "active",
    canLogin: true,
    assignedPartnerScope: "assigned-only",
    note: "Ավագ հաշվետար, փաստաթղթերի մուտքագրում և ստուգում",
  },
  {
    id: "emp-006",
    employeeNumber: "FIN-006",
    fullName: "Լիլիթ Հարությունյան",
    departmentId: "dept-accounting",
    positionId: "pos-bookkeeper",
    roleGroup: "bookkeeper",
    status: "active",
    canLogin: true,
    assignedPartnerScope: "assigned-only",
    note: "Հաշվետար, դրամարկղ/բանկային գործառնությունների demo scope",
  },
  {
    id: "emp-007",
    employeeNumber: "FIN-007",
    fullName: "Արամ Մկրտչյան",
    departmentId: "dept-accounting",
    positionId: "pos-bookkeeper",
    roleGroup: "bookkeeper",
    status: "active",
    canLogin: true,
    assignedPartnerScope: "assigned-only",
    note: "Հաշվետար, պահեստային փաստաթղթերի demo scope",
  },
  {
    id: "emp-008",
    employeeNumber: "FIN-008",
    fullName: "Սոնա Ավետիսյան",
    departmentId: "dept-accounting",
    positionId: "pos-bookkeeper",
    roleGroup: "bookkeeper",
    status: "active",
    canLogin: true,
    assignedPartnerScope: "assigned-only",
    note: "Հաշվետար, ընթացիկ փաստաթղթերի մուտքագրում",
  },
  {
    id: "emp-009",
    employeeNumber: "FIN-009",
    fullName: "Արմեն Գրիգորյան",
    departmentId: "dept-accounting",
    positionId: "pos-bookkeeper",
    roleGroup: "bookkeeper",
    status: "active",
    canLogin: true,
    assignedPartnerScope: "assigned-only",
    note: "Հաշվետար, նյութեր/ապրանքներ demo scope",
  },
  {
    id: "emp-010",
    employeeNumber: "FIN-010",
    fullName: "Էլեն Կարապետյան",
    departmentId: "dept-hr-legal",
    positionId: "pos-hr-legal",
    roleGroup: "hr-legal",
    status: "active",
    canLogin: true,
    assignedPartnerScope: "assigned-only",
    note: "Կադրային և իրավական սպասարկում",
  },
  {
    id: "emp-011",
    employeeNumber: "FIN-011",
    fullName: "Դավիթ Մանուկյան",
    departmentId: "dept-support",
    positionId: "pos-support-specialist",
    roleGroup: "support",
    status: "active",
    canLogin: true,
    assignedPartnerScope: "assigned-only",
    note: "Գործընկերների հարցումների ընդունում և routing",
  },
  {
    id: "emp-012",
    employeeNumber: "FIN-012",
    fullName: "Մարի Խաչատրյան",
    departmentId: "dept-support",
    positionId: "pos-support-specialist",
    roleGroup: "support",
    status: "active",
    canLogin: true,
    assignedPartnerScope: "assigned-only",
    note: "Chat / support / follow-up",
  },
  {
    id: "emp-013",
    employeeNumber: "FIN-013",
    fullName: "Արտակ Նազարյան",
    departmentId: "dept-technical",
    positionId: "pos-devops",
    roleGroup: "technical",
    status: "active",
    canLogin: true,
    assignedPartnerScope: "none",
    note: "Տեխնիկական սպասարկում, logs, backups, deploy վերահսկում",
  },
  {
    id: "emp-014",
    employeeNumber: "FIN-014",
    fullName: "Նելլի Բաբայան",
    departmentId: "dept-control",
    positionId: "pos-controller",
    roleGroup: "controller",
    status: "active",
    canLogin: true,
    assignedPartnerScope: "all",
    note: "Ներքին վերահսկում, որակի ստուգում, risk review",
  },
  {
    id: "emp-015",
    employeeNumber: "FIN-015",
    fullName: "Կարեն Աբրահամյան",
    departmentId: "dept-management",
    positionId: "pos-service-manager",
    roleGroup: "manager",
    status: "active",
    canLogin: true,
    assignedPartnerScope: "all",
    note: "Սպասարկման գործընթացների կազմակերպում",
  },
];


export const demoOrganizationAccesses: DemoOrganizationAccess[] = [
  { employeeId: "emp-002", organizationId: "ararat-llc", accessScope: "accounting", accessRole: "chief-accountant", status: "active" },
  { employeeId: "emp-002", organizationId: "lori-trade-llc", accessScope: "accounting", accessRole: "chief-accountant", status: "active" },
  { employeeId: "emp-002", organizationId: "ani-food-llc", accessScope: "accounting", accessRole: "chief-accountant", status: "active" },
  { employeeId: "emp-002", organizationId: "vanadzor-market-llc", accessScope: "accounting", accessRole: "chief-accountant", status: "active" },
  { employeeId: "emp-003", organizationId: "syunik-production-llc", accessScope: "accounting", accessRole: "chief-accountant", status: "active" },
  { employeeId: "emp-003", organizationId: "sevan-tour-cjsc", accessScope: "accounting", accessRole: "chief-accountant", status: "active" },
  { employeeId: "emp-003", organizationId: "gyumri-build-llc", accessScope: "accounting", accessRole: "chief-accountant", status: "active" },
  { employeeId: "emp-003", organizationId: "dvin-logistics-llc", accessScope: "accounting", accessRole: "chief-accountant", status: "active" },
  { employeeId: "emp-004", organizationId: "masis-pharma-llc", accessScope: "accounting", accessRole: "chief-accountant", status: "active" },
  { employeeId: "emp-004", organizationId: "shirak-agro-cjsc", accessScope: "accounting", accessRole: "chief-accountant", status: "active" },
  { employeeId: "emp-004", organizationId: "armavir-auto-llc", accessScope: "accounting", accessRole: "chief-accountant", status: "active" },
  { employeeId: "emp-004", organizationId: "kapan-metal-llc", accessScope: "accounting", accessRole: "chief-accountant", status: "active" },

  { employeeId: "emp-005", organizationId: "ararat-llc", accessScope: "accounting", accessRole: "bookkeeper", status: "active" },
  { employeeId: "emp-005", organizationId: "ani-food-llc", accessScope: "accounting", accessRole: "bookkeeper", status: "active" },
  { employeeId: "emp-006", organizationId: "lori-trade-llc", accessScope: "accounting", accessRole: "bookkeeper", status: "active" },
  { employeeId: "emp-006", organizationId: "vanadzor-market-llc", accessScope: "accounting", accessRole: "bookkeeper", status: "active" },
  { employeeId: "emp-007", organizationId: "gyumri-build-llc", accessScope: "accounting", accessRole: "bookkeeper", status: "active" },
  { employeeId: "emp-007", organizationId: "dvin-logistics-llc", accessScope: "accounting", accessRole: "bookkeeper", status: "active" },
  { employeeId: "emp-008", organizationId: "sevan-tour-cjsc", accessScope: "accounting", accessRole: "bookkeeper", status: "active" },
  { employeeId: "emp-008", organizationId: "tavush-hotel-llc", accessScope: "accounting", accessRole: "bookkeeper", status: "active" },
  { employeeId: "emp-009", organizationId: "masis-pharma-llc", accessScope: "accounting", accessRole: "bookkeeper", status: "active" },
  { employeeId: "emp-009", organizationId: "shirak-agro-cjsc", accessScope: "accounting", accessRole: "bookkeeper", status: "active" },

  { employeeId: "emp-010", organizationId: "ararat-llc", accessScope: "hr", accessRole: "hr-specialist", status: "active" },
  { employeeId: "emp-010", organizationId: "lori-trade-llc", accessScope: "hr", accessRole: "hr-specialist", status: "active" },
  { employeeId: "emp-010", organizationId: "gyumri-build-llc", accessScope: "hr", accessRole: "hr-specialist", status: "active" },
  { employeeId: "emp-010", organizationId: "masis-pharma-llc", accessScope: "hr", accessRole: "hr-specialist", status: "active" },

  { employeeId: "emp-011", organizationId: "ararat-llc", accessScope: "support", accessRole: "support-specialist", status: "active" },
  { employeeId: "emp-011", organizationId: "sevan-tour-cjsc", accessScope: "support", accessRole: "support-specialist", status: "active" },
  { employeeId: "emp-011", organizationId: "dvin-logistics-llc", accessScope: "support", accessRole: "support-specialist", status: "active" },
  { employeeId: "emp-011", organizationId: "tavush-hotel-llc", accessScope: "support", accessRole: "support-specialist", status: "active" },
  { employeeId: "emp-012", organizationId: "ani-food-llc", accessScope: "support", accessRole: "support-specialist", status: "active" },
  { employeeId: "emp-012", organizationId: "vanadzor-market-llc", accessScope: "support", accessRole: "support-specialist", status: "active" },
  { employeeId: "emp-012", organizationId: "armavir-auto-llc", accessScope: "support", accessRole: "support-specialist", status: "active" },
  { employeeId: "emp-012", organizationId: "yerevan-tech-cjsc", accessScope: "support", accessRole: "support-specialist", status: "active" },
];

export function getDepartmentName(departmentId: string) {
  return demoDepartments.find((department) => department.id === departmentId)?.name ?? departmentId;
}

export function getPositionName(positionId: string) {
  return demoPositions.find((position) => position.id === positionId)?.name ?? positionId;
}
