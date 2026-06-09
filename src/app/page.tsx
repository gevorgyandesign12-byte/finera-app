"use client";

import type { CSSProperties, FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { demoUsers, type DemoUser } from "@/lib/demo-data";
import { demoOrganizations, masterDatabaseNote } from "@/lib/demo-organizations";
import { demoMenuByRole, type DemoMenuItem } from "@/lib/demo-menu";
import { CalendarDateField } from "@/components/CalendarDateField";
import { newPartnerRegistrationTabs } from "../lib/new-partner-registration";
type ServiceContract = {
  id: string;
  organizationId: string;
  contractNumber: string;
  signedAt?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;

  employeeCount?: number | null;
  monthlyDocumentCount?: number | null;
  taxRegime?: string | null;
  bankAccountCount?: number | null;
  hasVat?: boolean | null;
  hasWarehouse?: boolean | null;
  hasProduction?: boolean | null;
  hasImportExport?: boolean | null;
  suggestedFeeAmount?: string | null;
  approvedFeeAmount?: string | null;

  feeAmount?: string | null;
  feeCurrency?: string | null;
  status?: string | null;
  responsiblePerson?: string | null;
  notes?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};


type OrganizationEmployee = {
  id: string;
  organizationId: string;
  fullName: string;
  taxId?: string | null;
  phone?: string | null;
  email?: string | null;
  positionTitle?: string | null;
  departmentName?: string | null;
  employmentType?: string | null;
  employmentStatus?: string | null;
  hireDate?: string | null;
  salaryAmount?: string | null;
  notes?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type AppDepartment = {
  id: string;
  name: string;
  scope: string;
  organizationId?: string | null;
  status?: string | null;
  notes?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type AppPosition = {
  id: string;
  title: string;
  scope: string;
  organizationId?: string | null;
  departmentName?: string | null;
  status?: string | null;
  notes?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type AppEmployee = {
  id: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  roleGroup?: string | null;
  positionTitle?: string | null;
  departmentName?: string | null;
  employmentType?: string | null;
  employmentStatus?: string | null;
  hireDate?: string | null;
  notes?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type AppOrganizationActivity = {
  id: string;
  organizationId: string;
  title: string;
  code?: string | null;
  isPrimary: boolean;
  notes?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type AppOrganization = {
  id: string;
  name: string;
  shortName?: string | null;
  legalType?: string | null;
  taxId?: string | null;
  status?: string | null;
  shortDescription?: string | null;
  legalAddress?: string | null;
  postalCode?: string | null;
  businessAddress?: string | null;
  tenantDatabaseName?: string | null;
  serviceStatus?: string | null;
  serviceStoppedAt?: string | null;
  serviceStopReason?: string | null;
  archivedAt?: string | null;
  registryCheckStatus?: string | null;
  registryCheckedAt?: string | null;
  registryCheckedBy?: string | null;
  registryName?: string | null;
  registryTaxId?: string | null;
  registryLegalAddress?: string | null;
  registryStatus?: string | null;
  registrySource?: string | null;
  registryNotes?: string | null;
};

import {
  demoDepartments,
  demoEmployees,
  getDepartmentName,
  getPositionName,
  masterDbDemoNote,
} from "@/lib/demo-master-db";

const bookkeeperResponsibilityScopes = [
  "Դրամարկղ / Բանկ",
  "Փաստաթղթերի մուտքագրում",
  "Գործընկերներ և փոխադարձ հաշվարկներ",
  "Պահեստ / ապրանքներ / նյութեր",
  "Աշխատավարձ և կադրեր",
  "Հիմնական միջոցներ",
  "Հարկային հաշվետվությունների նախապատրաստում",
  "Ֆինանսական հաշվետվություններ դիտել",
] as const;

function getTodayInputDate() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60000;
  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

function getAllowedDemoOrganizations(user: DemoUser, organizations: AppOrganization[]) {
  if (user.organizations.includes("System / Infrastructure")) {
    return [];
  }

  if (user.id === "manager") {
    return organizations;
  }

  return organizations.filter((organization) => user.organizations.includes(organization.name));
}

export default function Home() {
  const [selectedUserId, setSelectedUserId] = useState(demoUsers[0].id);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("");
  const [activeMenuPath, setActiveMenuPath] = useState<DemoMenuItem[]>([]);
  const [activeDemoPage, setActiveDemoPage] = useState<string | null>(null);
  const [activeTabByPage, setActiveTabByPage] = useState<Record<string, string>>({});
  const [selectedBookkeeperIds, setSelectedBookkeeperIds] = useState<string[]>([]);
  const [activeBookkeeperId, setActiveBookkeeperId] = useState<string | null>(null);
  const [bookkeeperScopesById, setBookkeeperScopesById] = useState<Record<string, string[]>>({});
  const [organizations, setOrganizations] = useState<AppOrganization[]>(
    demoOrganizations as AppOrganization[]
  );
  const [isSavingOrganization, setIsSavingOrganization] = useState(false);
  const [organizationSaveStatus, setOrganizationSaveStatus] = useState<string | null>(null);
  const [taxIdWarningMessage, setTaxIdWarningMessage] = useState<string | null>(null);
  const [isSavingRegistryCheck, setIsSavingRegistryCheck] = useState(false);
  const [registryCheckMessage, setRegistryCheckMessage] = useState<string | null>(null);
  const [registryDifferences, setRegistryDifferences] = useState<string[]>([]);
  const [archiveTargetOrganizationId, setArchiveTargetOrganizationId] = useState<string | null>(null);
  const [archiveReason, setArchiveReason] = useState("");
  const [isArchivingOrganization, setIsArchivingOrganization] = useState(false);
  const [archiveMessage, setArchiveMessage] = useState<string | null>(null);
  const [archivedOrganizations, setArchivedOrganizations] = useState<AppOrganization[]>([]);
  const [archiveListMessage, setArchiveListMessage] = useState<string | null>(null);
  const [organizationProfileTab, setOrganizationProfileTab] = useState("Ընդհանուր տվյալներ");
  const [selectedContract, setSelectedContract] = useState<ServiceContract | null>(null);
  const [contractMessage, setContractMessage] = useState<string | null>(null);
  const [isSavingContract, setIsSavingContract] = useState(false);
  const [contractForm, setContractForm] = useState({
    contractNumber: "",
    signedAt: getTodayInputDate(),
    startsAt: getTodayInputDate(),
    endsAt: "",

    employeeCount: "",
    monthlyDocumentCount: "",
    taxRegime: "turnover_tax",
    bankAccountCount: "1",
    hasVat: false,
    hasWarehouse: false,
    hasProduction: false,
    hasImportExport: false,
    approvedFeeAmount: "",

    feeCurrency: "AMD",
    status: "draft",
    responsiblePerson: "",
    notes: "",
  });
  const [fineraEmployees, setFineraEmployees] = useState<AppEmployee[]>([]);
  const [employeeSaveMessage, setEmployeeSaveMessage] = useState<string | null>(null);
  const [isSavingEmployee, setIsSavingEmployee] = useState(false);
  const [hireEmployeeForm, setHireEmployeeForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    roleGroup: "bookkeeper",
    positionTitle: "",
    departmentName: "Հաշվապահություն",
    employmentType: "full_time",
    hireDate: getTodayInputDate(),
    notes: "",
  });
  const [organizationEmployees, setOrganizationEmployees] = useState<OrganizationEmployee[]>([]);
  const [organizationEmployeeMessage, setOrganizationEmployeeMessage] = useState<string | null>(null);
  const [isSavingOrganizationEmployee, setIsSavingOrganizationEmployee] = useState(false);
  const [organizationEmployeeForm, setOrganizationEmployeeForm] = useState({
    fullName: "",
    taxId: "",
    phone: "",
    email: "",
    positionTitle: "",
    departmentName: "",
    employmentType: "full_time",
    hireDate: getTodayInputDate(),
    salaryAmount: "",
    notes: "",
  });
  const [appPositions, setAppPositions] = useState<AppPosition[]>([]);
  const [positionMessage, setPositionMessage] = useState<string | null>(null);
  const [isSavingPosition, setIsSavingPosition] = useState(false);
  const [positionForm, setPositionForm] = useState({
    title: "",
    scope: "finera",
    departmentName: "Հաշվապահություն",
    notes: "",
  });
  const [appDepartments, setAppDepartments] = useState<AppDepartment[]>([]);
  const [departmentInlineName, setDepartmentInlineName] = useState("");
  const [departmentInlineMessage, setDepartmentInlineMessage] = useState<string | null>(null);
  const [isSavingDepartment, setIsSavingDepartment] = useState(false);
  const [newPartnerRegistrationTab, setNewPartnerRegistrationTab] = useState("Ռեկվիզիտներ");
  const [newPartnerDraft, setNewPartnerDraft] = useState<AppOrganization | null>(null);
  const [newPartnerMessage, setNewPartnerMessage] = useState<string | null>(null);
  const [isSavingNewPartner, setIsSavingNewPartner] = useState(false);
  const [newPartnerMainForm, setNewPartnerMainForm] = useState({
    name: "",
    legalType: "llc",
    taxId: "",
    registryNumber: "",
    legalAddress: "",
    postalCode: "",
    businessAddress: "",
    phone: "",
    email: "",
    directorName: "",
  });
  const [newPartnerActivities, setNewPartnerActivities] = useState<AppOrganizationActivity[]>([]);
  const [newPartnerActivityForm, setNewPartnerActivityForm] = useState({
    title: "",
    code: "",
    isPrimary: true,
    notes: "",
  });
  const [newPartnerDepartments, setNewPartnerDepartments] = useState<AppDepartment[]>([]);
  const [newPartnerDepartmentForm, setNewPartnerDepartmentForm] = useState({
    name: "",
    notes: "",
  });
  const taxIdInputRef = useRef<HTMLInputElement | null>(null);

  const selectedUser = demoUsers.find((user) => user.id === selectedUserId) ?? demoUsers[0];
  const loggedInUser = demoUsers.find((user) => user.id === loggedInUserId);
  const allowedOrganizations = loggedInUser ? getAllowedDemoOrganizations(loggedInUser, organizations) : [];
  const menuItems = loggedInUser ? demoMenuByRole[loggedInUser.id] ?? [] : [];
  const selectedOrganization = allowedOrganizations.find(
    (organization) => organization.id === selectedOrganizationId
  );
  const archiveTargetOrganization = organizations.find(
    (organization) => organization.id === archiveTargetOrganizationId
  );
  const activeMenuTitle = activeMenuPath[activeMenuPath.length - 1]?.label;
  const visibleMenuItems =
    activeMenuPath.length > 0
      ? activeMenuPath[activeMenuPath.length - 1]?.children ?? []
      : menuItems;
  const todayInputDate = getTodayInputDate();

  useEffect(() => {
    let isMounted = true;

    async function loadDepartmentsFromDb() {
      try {
        const response = await fetch("/api/departments", { cache: "no-store" });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { departments?: AppDepartment[] };

        if (isMounted && Array.isArray(data.departments)) {
          setAppDepartments(data.departments);
        }
      } catch {
        // DEV fallback
      }
    }

    loadDepartmentsFromDb();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadPositionsFromDb() {
      try {
        const response = await fetch("/api/positions", { cache: "no-store" });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { positions?: AppPosition[] };

        if (isMounted && Array.isArray(data.positions)) {
          setAppPositions(data.positions);
        }
      } catch {
        // DEV fallback
      }
    }

    loadPositionsFromDb();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadFineraEmployeesFromDb() {
      try {
        const response = await fetch("/api/employees", { cache: "no-store" });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { employees?: AppEmployee[] };

        if (isMounted && Array.isArray(data.employees)) {
          setFineraEmployees(data.employees);
        }
      } catch {
        // Demo fallback: employees API-ն կարող է դեռ պատրաստ չլինել։
      }
    }

    loadFineraEmployeesFromDb();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadOrganizationsFromDb() {
      try {
        const response = await fetch("/api/organizations", { cache: "no-store" });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { organizations?: AppOrganization[] };

        if (isMounted && Array.isArray(data.organizations) && data.organizations.length > 0) {
          setOrganizations(data.organizations);
        }
      } catch {
        // Demo fallback: եթե DEV DB-ն հասանելի չէ, պահում ենք ֆայլային demo ցուցակը։
      }
    }

    loadOrganizationsFromDb();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleDemoLogin() {
    setLoggedInUserId(selectedUser.id);
    setSelectedOrganizationId("");
    setActiveMenuPath([]);
    setActiveDemoPage(null);
  }

  function renderMenuItems(items: DemoMenuItem[]) {
    return items.map((item) => {
      const hasChildren = Boolean(item.children?.length);

      return (
        <div key={item.label}>
          <button
            style={styles.menuItem}
            title={item.note}
            onClick={() => {
              if (hasChildren) {
                setActiveMenuPath((current) => [...current, item]);
                setActiveDemoPage(null);
                return;
              }

              setActiveDemoPage(item.label);
              setActiveTabByPage((current) => ({
                ...current,
                [item.label]: current[item.label] ?? getTabsForDemoPage(item.label)[0] ?? "",
              }));
            }}
          >
            <span style={{ display: "flex", justifyContent: "space-between", gap: "10px", fontWeight: 700 }}>
              <span>{item.label}</span>
              {hasChildren ? <span>›</span> : null}
            </span>

            <small style={{ display: "block", marginTop: "4px", color: "#d9c7aa", lineHeight: 1.4 }}>
              {item.note}
            </small>
          </button>
        </div>
      );
    });
  }

  if (!loggedInUser) {
    return (
      <main style={styles.page}>
        <section style={styles.container}>
          <p style={styles.kicker}>Finera accounting app · safe frontend demo</p>
          <h1 style={styles.title}>Ֆինեռա հաշվապահական</h1>
          <p style={styles.text}>
            Սա demo login է։ Այստեղ չկա իրական password, չկա database, չկա իրական հաշվապահական տվյալ։
            Մենք միայն ստուգում ենք, թե տարբեր դերերով օգտատերը ինչ dashboard պետք է տեսնի։
          </p>

          <div style={styles.loginCard}>
            <h2 style={styles.cardTitle}>Demo մուտք</h2>

            <label style={styles.label} htmlFor="demo-user">
              Ընտրիր demo օգտատեր / դեր
            </label>

            <select
              id="demo-user"
              value={selectedUserId}
              onChange={(event) => setSelectedUserId(event.target.value)}
              style={styles.select}
            >
              {demoUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.role}
                </option>
              ))}
            </select>

            <div style={styles.previewBox}>
              <strong>{selectedUser.name}</strong>
              <p style={{ marginBottom: 0 }}>{selectedUser.description}</p>
            </div>

            <button style={styles.primaryButton} onClick={handleDemoLogin}>
              Մուտք demo ռեժիմով
            </button>
          </div>
        </section>
      </main>
    );
  }

  function renderOrganizationForm() {
    return (
      <section style={styles.accountingArea}>
        <p style={styles.kicker}>Գլխավոր մենյու · Կարգավորումներ</p>
        <h2>Կազմակերպության տվյալներ</h2>
        <p>
          Սա demo ձև է կազմակերպության հիմնական տվյալները պատկերացնելու համար։
          Այս փուլում տվյալները չեն պահպանվում, database չկա, իրական գրանցում չկա։
        </p>

        <div style={styles.formGrid}>
          <label style={styles.label}>
            Կազմակերպության անվանում
            <input style={styles.input} type="text" placeholder="Օրինակ՝ Ֆինեռա ՍՊԸ" />
          </label>

          <label style={styles.label}>
            ՀՎՀՀ
            <input style={styles.input} type="text" placeholder="Օրինակ՝ 00000000" />
          </label>

          <label style={styles.label}>
            Գրանցման համար
            <input style={styles.input} type="text" placeholder="Օրինակ՝ 000.000.000000" />
          </label>

          <label style={styles.label}>
            Իրավաբանական հասցե
            <input style={styles.input} type="text" placeholder="Քաղաք, փողոց, շենք, տարածք" />
          </label>

          <label style={styles.label}>
            Գործունեության հասցե
            <input style={styles.input} type="text" placeholder="Եթե տարբերվում է իրավաբանական հասցեից" />
          </label>

          <label style={styles.label}>
            Տնօրեն
            <input style={styles.input} type="text" placeholder="Անուն Ազգանուն" />
          </label>

          <label style={styles.label}>
            Հեռախոս
            <input style={styles.input} type="text" placeholder="+374 ..." />
          </label>

          <label style={styles.label}>
            Էլ. հասցե
            <input style={styles.input} type="email" placeholder="example@company.am" />
          </label>
        </div>

        <div style={styles.formActions}>
          <button style={styles.primaryButton} type="button">
            Պահպանել demo
          </button>
          <p style={styles.mutedNotice}>
            Demo կոճակ է․ այս պահին ոչինչ չի պահպանում։
          </p>
        </div>
      </section>
    );
  }

  function renderStructuralUnitsForm() {
    return (
      <section style={styles.accountingArea}>
        <p style={styles.kicker}>Գլխավոր մենյու · Կարգավորումներ</p>
        <h2>Կառուցվածքային ստորաբաժանումներ</h2>
        <p>
          Սա demo ձև է կազմակերպության ներքին բաժինները պատկերացնելու համար։
          Այս փուլում տվյալները չեն պահպանվում, database չկա, իրական գրանցում չկա։
        </p>

        <div style={styles.formGrid}>
          <label style={styles.label}>
            Ստորաբաժանման անվանում
            <input style={styles.input} type="text" placeholder="Օրինակ՝ Հաշվապահություն" />
          </label>

          <label style={styles.label}>
            Ներքին կոդ
            <input style={styles.input} type="text" placeholder="Օրինակ՝ DEP-001" />
          </label>

          <label style={styles.label}>
            Ստորաբաժանման տեսակ
            <select style={styles.select} defaultValue="">
              <option value="" disabled>Ընտրել տեսակը</option>
              <option value="management">Ղեկավարում</option>
              <option value="accounting">Հաշվապահություն</option>
              <option value="warehouse">Պահեստ</option>
              <option value="production">Արտադրություն</option>
              <option value="sales">Մատակարարում / վաճառք</option>
              <option value="hr">Կադրեր</option>
              <option value="support">Սպասարկում</option>
            </select>
          </label>

          <label style={styles.label}>
            Վերադաս ստորաբաժանում
            <input style={styles.input} type="text" placeholder="Օրինակ՝ Տնօրինություն" />
          </label>

          <label style={styles.label}>
            Պատասխանատու անձ
            <input style={styles.input} type="text" placeholder="Անուն Ազգանուն" />
          </label>

          <label style={styles.label}>
            Կարգավիճակ
            <select style={styles.select} defaultValue="active">
              <option value="active">Գործող</option>
              <option value="inactive">Չգործող</option>
              <option value="planned">Պլանավորված</option>
            </select>
          </label>
        </div>

        <div style={styles.previewBox}>
          <strong>Demo օրինակներ</strong>
          <ul>
            <li>Տնօրինություն</li>
            <li>Հաշվապահություն</li>
            <li>Պահեստ</li>
            <li>Կադրեր</li>
            <li>Արտադրամաս</li>
          </ul>
        </div>

        <div style={styles.formActions}>
          <button style={styles.primaryButton} type="button">
            Պահպանել demo
          </button>
          <p style={styles.mutedNotice}>
            Demo կոճակ է․ այս պահին ոչինչ չի պահպանում։
          </p>
        </div>
      </section>
    );
  }

  function renderOurCompanyForm() {
    const pageLabel = "Մեր կազմակերպությունը";
    const tabs = getTabsForDemoPage(pageLabel);
    const activeTab = getActiveTab(pageLabel);
    const activeBookkeeper = activeBookkeeperId
      ? demoEmployees.find((employee) => employee.id === activeBookkeeperId)
      : undefined;

    return (
      <section style={styles.accountingArea}>
        <p style={styles.kicker}>Գլխավոր մենյու</p>
        <h2>Մեր կազմակերպությունը</h2>
        <p>{masterDbDemoNote}</p>

        <div style={styles.tabsBar}>
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              style={{
                ...styles.tabButton,
                ...(tab === activeTab ? styles.tabButtonActive : {}),
              }}
              onClick={() => {
                setActiveTabByPage((current) => ({
                  ...current,
                  [pageLabel]: tab,
                }));
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Ընդհանուր տվյալներ" ? (
          <div style={styles.tabPanel}>
            <h3 style={styles.sectionTitle}>Ընդհանուր տվյալներ</h3>
            <div style={styles.formGrid}>
              <label style={styles.label}>
                Իրավական անվանում
                <input style={styles.input} type="text" placeholder="Օրինակ՝ Սոսե ՍՊԸ" />
              </label>

              <label style={styles.label}>
                Բրենդային անուն
                <input style={styles.input} type="text" placeholder="Օրինակ՝ Ֆինեռա / Finera" />
              </label>

              <label style={styles.label}>
                ՀՎՀՀ
                <input style={styles.input} type="text" placeholder="Մեր ՀՎՀՀ" />
              </label>

              <label style={styles.label}>
                Գործունեության նկարագրություն
                <input style={styles.input} type="text" placeholder="Հաշվապահական և ֆինանսական սպասարկում" />
              </label>
            </div>
          </div>
        ) : null}

        {activeTab === "Աշխատակիցներ" ? (
          <div style={styles.tabPanel}>
            <h3 style={styles.sectionTitle}>Մեր աշխատակիցներ</h3>
            <p>
              Սա Master DB-ի demo աշխատակիցների ցանկն է։
              Այս մարդիկ Finera/Sose-ի ներքին թիմն են, ոչ թե սպասարկվող գործընկերների աշխատակիցները։
            </p>

            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <strong>{demoEmployees.length}</strong>
                <span>աշխատակից</span>
              </div>
              <div style={styles.statCard}>
                <strong>{demoDepartments.length}</strong>
                <span>բաժին</span>
              </div>
              <div style={styles.statCard}>
                <strong>{demoEmployees.filter((employee) => employee.canLogin).length}</strong>
                <span>login ունեցող</span>
              </div>
            </div>

            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Կոդ</th>
                    <th style={styles.th}>Աշխատակից</th>
                    <th style={styles.th}>Բաժին</th>
                    <th style={styles.th}>Պաշտոն</th>
                    <th style={styles.th}>Դեր</th>
                    <th style={styles.th}>Scope</th>
                    <th style={styles.th}>Կարգավիճակ</th>
                  </tr>
                </thead>
                <tbody>
                  {demoEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td style={styles.td}>{employee.employeeNumber}</td>
                      <td style={styles.td}>
                        <strong>{employee.fullName}</strong>
                        <small style={styles.cellNote}>{employee.note}</small>
                      </td>
                      <td style={styles.td}>{getDepartmentName(employee.departmentId)}</td>
                      <td style={styles.td}>{getPositionName(employee.positionId)}</td>
                      <td style={styles.td}>{employee.roleGroup}</td>
                      <td style={styles.td}>{employee.assignedPartnerScope}</td>
                      <td style={styles.td}>{employee.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {activeTab === "Բաժիններ" ? (
          <div style={styles.tabPanel}>
            <h3 style={styles.sectionTitle}>Բաժիններ</h3>
            <div style={styles.cardsGrid}>
              {demoDepartments.map((department) => (
                <div key={department.id} style={styles.smallCard}>
                  <strong>{department.name}</strong>
                  <p>{department.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === "Իրավական տվյալներ" ? (
          <div style={styles.tabPanel}>
            <h3 style={styles.sectionTitle}>Իրավական տվյալներ</h3>
            <div style={styles.formGrid}>
              <label style={styles.label}>
                Գրանցման համար
                <input style={styles.input} type="text" placeholder="Մեր պետական գրանցման համարը" />
              </label>

              <label style={styles.label}>
                Իրավաբանական հասցե
                <input style={styles.input} type="text" placeholder="Մեր իրավաբանական հասցեն" />
              </label>

              <label style={styles.label}>
                Տնօրեն
                <input style={styles.input} type="text" placeholder="Անուն Ազգանուն" />
              </label>
            </div>
          </div>
        ) : null}

        {activeTab === "Կոնտակտներ" ? (
          <div style={styles.tabPanel}>
            <h3 style={styles.sectionTitle}>Կոնտակտներ</h3>
            <div style={styles.formGrid}>
              <label style={styles.label}>
                Հեռախոս
                <input style={styles.input} type="text" placeholder="+374 ..." />
              </label>

              <label style={styles.label}>
                Էլ. հասցե
                <input style={styles.input} type="email" placeholder="info@finera.am" />
              </label>

              <label style={styles.label}>
                Կայք
                <input style={styles.input} type="text" placeholder="finera.am" />
              </label>
            </div>
          </div>
        ) : null}

        {activeTab === "Բանկային տվյալներ" ? (
          <div style={styles.tabPanel}>
            <h3 style={styles.sectionTitle}>Բանկային տվյալներ</h3>
            <div style={styles.formGrid}>
              <label style={styles.label}>
                Բանկ
                <input style={styles.input} type="text" placeholder="Բանկի անվանում" />
              </label>

              <label style={styles.label}>
                Հաշվեհամար
                <input style={styles.input} type="text" placeholder="Հաշվեհամար" />
              </label>

              <label style={styles.label}>
                Նշում
                <input style={styles.input} type="text" placeholder="Լրացուցիչ բանկային տվյալներ" />
              </label>
            </div>
          </div>
        ) : null}

        <div style={styles.formActions}>
          <button style={styles.primaryButton} type="button">
            Պահպանել demo
          </button>
          <p style={styles.mutedNotice}>Demo կոճակ է․ այս պահին ոչինչ չի պահպանում։</p>
        </div>
      </section>
    );
  }



  function getEmployeesByRole(roleGroup: string) {
    return demoEmployees.filter(
      (employee) => employee.roleGroup === roleGroup && employee.status === "active"
    );
  }

  function renderEmployeeOptions(roleGroup: string) {
    return getEmployeesByRole(roleGroup).map((employee) => (
      <option key={employee.id} value={employee.id}>
        {employee.fullName} — {getPositionName(employee.positionId)}
      </option>
    ));
  }

  function toggleBookkeeper(employeeId: string) {
    const isAlreadySelected = selectedBookkeeperIds.includes(employeeId);

    if (isAlreadySelected) {
      const nextSelectedIds = selectedBookkeeperIds.filter((id) => id !== employeeId);
      setSelectedBookkeeperIds(nextSelectedIds);

      setBookkeeperScopesById((current) => {
        const next = { ...current };
        delete next[employeeId];
        return next;
      });

      if (activeBookkeeperId === employeeId) {
        setActiveBookkeeperId(nextSelectedIds[0] ?? null);
      }

      return;
    }

    setSelectedBookkeeperIds([...selectedBookkeeperIds, employeeId]);
    setActiveBookkeeperId(employeeId);
  }

  function toggleBookkeeperScope(employeeId: string, scope: string) {
    setBookkeeperScopesById((current) => {
      const currentScopes = current[employeeId] ?? [];
      const nextScopes = currentScopes.includes(scope)
        ? currentScopes.filter((item) => item !== scope)
        : [...currentScopes, scope];

      return {
        ...current,
        [employeeId]: nextScopes,
      };
    });
  }


  async function handleCreateOrganization(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      shortName: String(formData.get("shortName") ?? "").trim(),
      legalType: String(formData.get("legalType") ?? "").trim(),
      taxId: String(formData.get("taxId") ?? "").trim(),
      status: String(formData.get("status") ?? "draft").trim(),
      shortDescription: String(formData.get("shortDescription") ?? "").trim(),
      legalAddress: String(formData.get("legalAddress") ?? "").trim(),
      businessAddress: String(formData.get("businessAddress") ?? "").trim(),
    };

    if (!payload.name) {
      window.alert("Լրիվ անվանումը պարտադիր է։");
      return;
    }

    if (!payload.legalType) {
      window.alert("Կազմակերպության տեսակը պարտադիր է։");
      return;
    }

    if (!/^\d{8}$/.test(payload.taxId)) {
      setTaxIdWarningMessage(
        "ՀՎՀՀ-ն պետք է լինի միայն 8 թվանշան՝ առանց տառերի կամ նշանների։ Օրինակ՝ 01234567"
      );
      setOrganizationSaveStatus(null);
      return;
    }

    setIsSavingOrganization(true);
    setOrganizationSaveStatus("Պահպանում ենք DEV Master DB-ում...");

    try {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        organization?: AppOrganization;
        error?: string;
      };

      if (!response.ok || !data.organization) {
        setOrganizationSaveStatus(data.error ?? "Չհաջողվեց պահպանել կազմակերպությունը։");
        return;
      }

      setOrganizations((current) => {
        const withoutDuplicate = current.filter(
          (organization) => organization.id !== data.organization?.id
        );

        return [...withoutDuplicate, data.organization as AppOrganization];
      });

      setSelectedOrganizationId(data.organization.id);
      setOrganizationSaveStatus(`Պահպանվեց՝ ${data.organization.name}`);
      form.reset();
      setActiveDemoPage("Գործող սպասարկում");
    } catch {
      setOrganizationSaveStatus("Չհաջողվեց կապ հաստատել DEV DB API-ի հետ։");
    } finally {
      setIsSavingOrganization(false);
    }
  }

  function suggestActivityCode(title: string) {
    const value = title.toLocaleLowerCase("hy-AM");

    if (value.includes("շին")) {
      return "F";
    }

    if (value.includes("սննդ") || value.includes("մթեր")) {
      return "C10";
    }

    if (value.includes("արտադր")) {
      return "C";
    }

    if (value.includes("առևտուր") || value.includes("առեւտուր") || value.includes("խանութ")) {
      return "G47";
    }

    if (value.includes("ռեստորան") || value.includes("սրճարան")) {
      return "I56";
    }

    if (value.includes("տրանսպորտ") || value.includes("փոխադրում")) {
      return "H49";
    }

    if (value.includes("ծառայ")) {
      return "S";
    }

    return "";
  }

  async function loadWizardActivities(organizationId: string) {
    try {
      const response = await fetch(
        `/api/organizations/activities?organizationId=${encodeURIComponent(organizationId)}`,
        { cache: "no-store" }
      );

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as { activities?: AppOrganizationActivity[] };
      setNewPartnerActivities(data.activities ?? []);
    } catch {
      setNewPartnerMessage("Չհաջողվեց բեռնել գործունեության տեսակները։");
    }
  }

  async function handleCreateWizardActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!newPartnerDraft) {
      setNewPartnerMessage("Նախ պահպանիր հիմնական տեղեկությունները։");
      setNewPartnerRegistrationTab("Ռեկվիզիտներ");
      return;
    }

    if (!newPartnerActivityForm.title.trim()) {
      setNewPartnerMessage("Գործունեության տեսակը պարտադիր է։");
      return;
    }

    const suggestedCode = suggestActivityCode(newPartnerActivityForm.title);
    const code = newPartnerActivityForm.code.trim() || suggestedCode;

    try {
      const response = await fetch("/api/organizations/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organizationId: newPartnerDraft.id,
          ...newPartnerActivityForm,
          code,
        }),
      });

      const data = (await response.json()) as {
        activity?: AppOrganizationActivity;
        error?: string;
      };

      if (!response.ok || !data.activity) {
        setNewPartnerMessage(data.error ?? "Չհաջողվեց ավելացնել գործունեության տեսակը։");
        return;
      }

      setNewPartnerActivities((current) => {
        const next = newPartnerActivityForm.isPrimary
          ? current.map((item) => ({ ...item, isPrimary: false }))
          : current;

        return [...next, data.activity as AppOrganizationActivity];
      });

      setNewPartnerActivityForm({
        title: "",
        code: "",
        isPrimary: false,
        notes: "",
      });
      setNewPartnerMessage(`Գործունեության տեսակը ավելացվեց՝ ${data.activity.title}`);
    } catch {
      setNewPartnerMessage("Չհաջողվեց կապ հաստատել activities API-ի հետ։");
    }
  }

  async function loadWizardDepartments(organizationId: string) {
    try {
      const response = await fetch(
        `/api/departments?scope=organization&organizationId=${encodeURIComponent(organizationId)}`,
        { cache: "no-store" }
      );

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as { departments?: AppDepartment[] };
      setNewPartnerDepartments(data.departments ?? []);
    } catch {
      setNewPartnerMessage("Չհաջողվեց բեռնել ստորաբաժանումները։");
    }
  }

  async function handleCreateWizardDepartment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!newPartnerDraft) {
      setNewPartnerMessage("Նախ պահպանիր հիմնական տեղեկությունները։");
      setNewPartnerRegistrationTab("Ռեկվիզիտներ");
      return;
    }

    if (!newPartnerDepartmentForm.name.trim()) {
      setNewPartnerMessage("Ստորաբաժանման անվանումը պարտադիր է։");
      return;
    }

    try {
      const response = await fetch("/api/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newPartnerDepartmentForm.name,
          notes: newPartnerDepartmentForm.notes,
          scope: "organization",
          organizationId: newPartnerDraft.id,
        }),
      });

      const data = (await response.json()) as {
        department?: AppDepartment;
        error?: string;
      };

      if (!response.ok || !data.department) {
        setNewPartnerMessage(data.error ?? "Չհաջողվեց ավելացնել ստորաբաժանումը։");
        return;
      }

      setNewPartnerDepartments((current) =>
        [...current, data.department as AppDepartment].sort((a, b) => a.name.localeCompare(b.name))
      );
      setNewPartnerDepartmentForm({ name: "", notes: "" });
      setNewPartnerMessage(`Ստորաբաժանումը ավելացվեց՝ ${data.department.name}`);
    } catch {
      setNewPartnerMessage("Չհաջողվեց կապ հաստատել departments API-ի հետ։");
    }
  }

  async function handleCreateWizardOrganization(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!newPartnerMainForm.name.trim()) {
      setNewPartnerMessage("Կազմակերպության անվանումը պարտադիր է։");
      return;
    }

    if (!/^\d{8}$/.test(newPartnerMainForm.taxId.trim())) {
      setNewPartnerMessage("ՀՎՀՀ-ն պետք է լինի 8 թվանշան։");
      return;
    }

    setIsSavingNewPartner(true);
    setNewPartnerMessage("Պահպանում ենք հիմնական տեղեկությունները DEV DB-ում...");

    try {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPartnerMainForm),
      });

      const data = (await response.json()) as {
        organization?: AppOrganization;
        error?: string;
      };

      if (!response.ok || !data.organization) {
        setNewPartnerMessage(data.error ?? "Չհաջողվեց գրանցել կազմակերպությունը։");
        return;
      }

      setNewPartnerDraft(data.organization);
      setSelectedOrganizationId(data.organization.id);
      setOrganizations((current) => [data.organization as AppOrganization, ...current]);
      setNewPartnerMessage("Ռեկվիզիտները պահպանվեցին։ Կարող ես անցնել գործունեության տեսակներին։");
      setNewPartnerRegistrationTab("Իրավաբանական");
      void loadWizardActivities(data.organization.id);
      void loadWizardDepartments(data.organization.id);
    } catch {
      setNewPartnerMessage("Չհաջողվեց կապ հաստատել organizations API-ի հետ։");
    } finally {
      setIsSavingNewPartner(false);
    }
  }

  function renderNewPartnerRegistrationWizard() {
    const tabs = [
      "Ռեկվիզիտներ",
      "Գործունեություն",
      "Ստորաբաժանումներ",
    ];

    const suggestedActivityCode = suggestActivityCode(newPartnerActivityForm.title);

    return (
      <section style={styles.accountingArea}>
        <p style={styles.kicker}>Սպասարկվող գործընկերներ · Գրանցում</p>
        <h2>Նոր գործընկեր գրանցել</h2>
        <p>
          Գրանցումը բաժանում ենք փուլերի՝ հիմնական տվյալներ, գործունեության տեսակներ,
          հետո տվյալ կազմակերպության կառուցվածքային ստորաբաժանումներ։
        </p>

        <div style={styles.tabBar}>
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              style={{
                ...styles.tabButton,
                ...(newPartnerRegistrationTab === tab ? styles.tabButtonActive : {}),
              }}
              onClick={() => setNewPartnerRegistrationTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {newPartnerMessage ? (
          <div style={{ ...styles.previewBox, marginTop: "14px" }}>
            <strong>{newPartnerMessage}</strong>
          </div>
        ) : null}

        {newPartnerDraft ? (
          <div style={{ ...styles.previewBox, marginTop: "14px" }}>
            <strong>Գրանցվող կազմակերպություն՝ {newPartnerDraft.name}</strong>
            <p style={{ marginBottom: 0 }}>
              ՀՎՀՀ՝ {newPartnerDraft.taxId} · կարող ես լրացնել հաջորդ թաբերը։
            </p>
          </div>
        ) : null}

        {newPartnerRegistrationTab === "Ռեկվիզիտներ" ? (
          <div style={styles.tabPanel}>
            <h3 style={styles.sectionTitle}>Ռեկվիզիտներ</h3>

            <form noValidate onSubmit={handleCreateWizardOrganization} style={{ display: "grid", gap: "18px" }}>
              <div style={styles.formGrid}>
                <label style={styles.label}>
                  Կազմակերպության անվանում
                  <input
                    style={styles.input}
                    type="text"
                    value={newPartnerMainForm.name}
                    onChange={(event) =>
                      setNewPartnerMainForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Օրինակ՝ Լուկաս ՍՊԸ"
                  />
                </label>

                <label style={styles.label}>
                  Իրավակազմակերպական տեսակ
                  <select
                    style={styles.select}
                    value={newPartnerMainForm.legalType}
                    onChange={(event) =>
                      setNewPartnerMainForm((current) => ({
                        ...current,
                        legalType: event.target.value,
                      }))
                    }
                  >
                    <option value="llc">ՍՊԸ</option>
                    <option value="ie">ԱՁ</option>
                    <option value="cjsc">ՓԲԸ</option>
                    <option value="ojsc">ԲԲԸ</option>
                    <option value="ngo">ՀԿ</option>
                    <option value="other">Այլ</option>
                  </select>
                </label>

                <label style={styles.label}>
                  ՀՎՀՀ
                  <input
                    style={styles.input}
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    value={newPartnerMainForm.taxId}
                    onInput={(event) => {
                      event.currentTarget.value = event.currentTarget.value
                        .replace(/\D/g, "")
                        .slice(0, 8);
                    }}
                    onChange={(event) =>
                      setNewPartnerMainForm((current) => ({
                        ...current,
                        taxId: event.target.value,
                      }))
                    }
                    placeholder="8 թվանշան"
                  />
                </label>

                <label style={styles.label}>
                  Պետ․ գրանցման համար
                  <input
                    style={styles.input}
                    type="text"
                    value={newPartnerMainForm.registryNumber}
                    onChange={(event) =>
                      setNewPartnerMainForm((current) => ({
                        ...current,
                        registryNumber: event.target.value,
                      }))
                    }
                    placeholder="Գրանցման համար"
                  />
                </label>

                <label style={styles.label}>
                  Իրավաբանական հասցե
                  <input
                    style={styles.input}
                    type="text"
                    value={newPartnerMainForm.legalAddress}
                    onChange={(event) =>
                      setNewPartnerMainForm((current) => ({
                        ...current,
                        legalAddress: event.target.value,
                      }))
                    }
                    placeholder="Իրավաբանական հասցե"
                  />
                </label>

                <label style={styles.label}>
                  Փոստային կոդ
                  <input
                    style={styles.input}
                    type="text"
                    value={newPartnerMainForm.postalCode}
                    onChange={(event) =>
                      setNewPartnerMainForm((current) => ({
                        ...current,
                        postalCode: event.target.value,
                      }))
                    }
                    placeholder="Օրինակ՝ 0010"
                  />
                </label>

                <label style={styles.label}>
                  Գործունեության հասցե
                  <input
                    style={styles.input}
                    type="text"
                    value={newPartnerMainForm.businessAddress}
                    onChange={(event) =>
                      setNewPartnerMainForm((current) => ({
                        ...current,
                        businessAddress: event.target.value,
                      }))
                    }
                    placeholder="Գործունեության հասցե"
                  />
                </label>

                <label style={styles.label}>
                  Հեռախոս
                  <input
                    style={styles.input}
                    type="text"
                    value={newPartnerMainForm.phone}
                    onChange={(event) =>
                      setNewPartnerMainForm((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                    placeholder="+374..."
                  />
                </label>

                <label style={styles.label}>
                  Email
                  <input
                    style={styles.input}
                    type="email"
                    value={newPartnerMainForm.email}
                    onChange={(event) =>
                      setNewPartnerMainForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    placeholder="company@example.am"
                  />
                </label>

                <label style={styles.label}>
                  Տնօրեն / պատասխանատու անձ
                  <input
                    style={styles.input}
                    type="text"
                    value={newPartnerMainForm.directorName}
                    onChange={(event) =>
                      setNewPartnerMainForm((current) => ({
                        ...current,
                        directorName: event.target.value,
                      }))
                    }
                    placeholder="Անուն ազգանուն"
                  />
                </label>
              </div>

              <button type="submit" style={styles.primaryButton} disabled={isSavingNewPartner}>
                {isSavingNewPartner ? "Պահպանվում է..." : "Պահպանել և անցնել հաջորդ քայլին"}
              </button>
            </form>
          </div>
        ) : null}

        {newPartnerRegistrationTab === "Գործունեություն" ? (
          <div style={styles.tabPanel}>
            <h3 style={styles.sectionTitle}>Գործունեություն</h3>

            <div style={styles.previewBox}>
              <strong>Կրկնվող ցուցակ</strong>
              <p style={{ marginBottom: 0 }}>
                Մեկ կազմակերպությունը կարող է ունենալ շատ գործունեության տեսակներ։ Կոդը հիմա demo
                առաջարկ է, վերջնականը հաստատում է մարդը։
              </p>
            </div>

            <form noValidate onSubmit={handleCreateWizardActivity} style={{ display: "grid", gap: "18px", marginTop: "18px" }}>
              <div style={styles.formGrid}>
                <label style={styles.label}>
                  Գործունեության տեսակ
                  <input
                    style={styles.input}
                    type="text"
                    value={newPartnerActivityForm.title}
                    onChange={(event) => {
                      const title = event.target.value;
                      const suggestedCode = suggestActivityCode(title);

                      setNewPartnerActivityForm((current) => ({
                        ...current,
                        title,
                        code: current.code || suggestedCode,
                      }));
                    }}
                    placeholder="Օրինակ՝ Շինարարություն, սննդի արտադրություն"
                  />
                </label>

                <label style={styles.label}>
                  Գործունեության կոդ
                  <input
                    style={styles.input}
                    type="text"
                    value={newPartnerActivityForm.code}
                    onChange={(event) =>
                      setNewPartnerActivityForm((current) => ({
                        ...current,
                        code: event.target.value,
                      }))
                    }
                    placeholder={suggestedActivityCode || "Կոդ"}
                  />
                </label>

                <label style={{ ...styles.label, display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={newPartnerActivityForm.isPrimary}
                    onChange={(event) =>
                      setNewPartnerActivityForm((current) => ({
                        ...current,
                        isPrimary: event.target.checked,
                      }))
                    }
                  />
                  Հիմնական գործունեության տեսակ
                </label>
              </div>

              <label style={styles.label}>
                Նշումներ
                <textarea
                  style={{
                    ...styles.input,
                    minHeight: "80px",
                    resize: "vertical",
                  }}
                  value={newPartnerActivityForm.notes}
                  onChange={(event) =>
                    setNewPartnerActivityForm((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                  placeholder="Լրացուցիչ նկարագրություն"
                />
              </label>

              <button type="submit" style={styles.primaryButton}>
                + Ավելացնել գործունեության տեսակ
              </button>
            </form>

            <div style={{ display: "grid", gap: "12px", marginTop: "18px" }}>
              {newPartnerActivities.length > 0 ? (
                newPartnerActivities.map((activity) => (
                  <article key={activity.id} style={styles.previewBox}>
                    <strong>
                      {activity.title} {activity.isPrimary ? "· հիմնական" : ""}
                    </strong>
                    <p style={{ margin: "6px 0 0" }}>
                      Կոդ՝ {activity.code || "—"} {activity.notes ? `· ${activity.notes}` : ""}
                    </p>
                  </article>
                ))
              ) : (
                <div style={styles.previewBox}>
                  <strong>Գործունեության տեսակ դեռ չկա</strong>
                  <p style={{ marginBottom: 0 }}>Ավելացրու առաջին գործունեության տեսակը։</p>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {newPartnerRegistrationTab === "Ստորաբաժանումներ" ? (
          <div style={styles.tabPanel}>
            <h3 style={styles.sectionTitle}>Կառուցվածքային ստորաբաժանումներ</h3>

            <div style={styles.previewBox}>
              <strong>Այս բաժինները պատկանում են հենց գրանցվող կազմակերպությանը</strong>
              <p style={{ marginBottom: 0 }}>
                Օրինակ՝ վարչակազմ, արտադրամաս, պահեստ, վաճառքի բաժին, առաքում։
              </p>
            </div>

            <form noValidate onSubmit={handleCreateWizardDepartment} style={{ display: "grid", gap: "18px", marginTop: "18px" }}>
              <div style={styles.formGrid}>
                <label style={styles.label}>
                  Ստորաբաժանման անվանում
                  <input
                    style={styles.input}
                    type="text"
                    value={newPartnerDepartmentForm.name}
                    onChange={(event) =>
                      setNewPartnerDepartmentForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Օրինակ՝ Պահեստ"
                  />
                </label>

                <label style={styles.label}>
                  Նշումներ
                  <input
                    style={styles.input}
                    type="text"
                    value={newPartnerDepartmentForm.notes}
                    onChange={(event) =>
                      setNewPartnerDepartmentForm((current) => ({
                        ...current,
                        notes: event.target.value,
                      }))
                    }
                    placeholder="Կարճ նկարագրություն"
                  />
                </label>
              </div>

              <button type="submit" style={styles.primaryButton}>
                + Ավելացնել ստորաբաժանում
              </button>
            </form>

            <div style={{ display: "grid", gap: "12px", marginTop: "18px" }}>
              {newPartnerDepartments.length > 0 ? (
                newPartnerDepartments.map((department) => (
                  <article key={department.id} style={styles.previewBox}>
                    <strong>{department.name}</strong>
                    <p style={{ margin: "6px 0 0" }}>
                      {department.notes || "Նշումներ չկան"}
                    </p>
                  </article>
                ))
              ) : (
                <div style={styles.previewBox}>
                  <strong>Ստորաբաժանում դեռ չկա</strong>
                  <p style={{ marginBottom: 0 }}>
                    Ավելացրու կազմակերպության առաջին կառուցվածքային ստորաբաժանումը։
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </section>
    );
  }

  function renderDbNewOrganizationForm() {
    return (
      <section style={styles.accountingArea}>
        <p style={styles.kicker}>Կազմակերպություններ · DEV Master DB</p>
        <h2>Նոր գործընկեր գրանցել</h2>
        <p>
          Այս ձևը արդեն պահում է տվյալները DEV Master DB-ում։ Սա դեռ փորձնական գրանցում է՝
          ոչ production, ոչ իրական հաշվապահական posting։
        </p>

        {taxIdWarningMessage ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="ՀՎՀՀ զգուշացում"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              display: "grid",
              placeItems: "center",
              background: "rgba(0, 0, 0, 0.45)",
              padding: "20px",
            }}
          >
            <div
              style={{
                width: "min(420px, 100%)",
                borderRadius: "18px",
                border: "1px solid #d8c7ad",
                background: "#fffaf2",
                padding: "22px",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)",
              }}
            >
              <strong style={{ display: "block", fontSize: "18px", marginBottom: "10px" }}>
                Սխալ ՀՎՀՀ
              </strong>
              <p style={{ marginTop: 0 }}>{taxIdWarningMessage}</p>
              <button
                type="button"
                style={styles.primaryButton}
                onClick={() => {
                  setTaxIdWarningMessage(null);
                  setOrganizationSaveStatus(null);

                  if (taxIdInputRef.current) {
                    taxIdInputRef.current.value = "";
                    taxIdInputRef.current.focus();
                  }
                }}
              >
                Լավ
              </button>
            </div>
          </div>
        ) : null}

        <form noValidate onSubmit={handleCreateOrganization} style={{ display: "grid", gap: "18px" }}>
          <div style={styles.formGrid}>
            <label style={styles.label}>
              Կազմակերպության տեսակ
              <select name="legalType" style={styles.select} defaultValue="" required>
                <option value="" disabled>
                  Ընտրել տեսակը
                </option>
                <option value="ՍՊԸ">ՍՊԸ</option>
                <option value="ԱՁ">ԱՁ</option>
                <option value="ՀԿ">ՀԿ</option>
                <option value="Հիմնադրամ">Հիմնադրամ</option>
                <option value="Այլ">Այլ</option>
              </select>
            </label>

            <label style={styles.label}>
              Լրիվ անվանում
              <input
                name="name"
                style={styles.input}
                type="text"
                placeholder="Օրինակ՝ Example ՍՊԸ"
                required
              />
            </label>

            <label style={styles.label}>
              Կարճ անվանում
              <input
                name="shortName"
                style={styles.input}
                type="text"
                placeholder="Օրինակ՝ Example"
              />
            </label>

            <label style={styles.label}>
              ՀՎՀՀ
              <input
                ref={taxIdInputRef}
                name="taxId"
                style={styles.input}
                type="text"
                inputMode="numeric"
                pattern="\d{8}"
                maxLength={8}
                placeholder="Օրինակ՝ 01234567"
                title="ՀՎՀՀ-ն պետք է լինի միայն 8 թվանշան"
                onInput={(event) => {
                  event.currentTarget.value = event.currentTarget.value
                    .replace(/\D/g, "")
                    .slice(0, 8);
                  setTaxIdWarningMessage(null);
                  setOrganizationSaveStatus(null);
                }}
                required
              />
            </label>

            <label style={styles.label}>
              Կարգավիճակ
              <select name="status" style={styles.select} defaultValue="draft">
                <option value="draft">Նախնական / draft</option>
                <option value="active">Գործող</option>
                <option value="inactive">Պասիվ</option>
              </select>
            </label>

            <label style={styles.label}>
              Կարճ նկարագրություն
              <input
                name="shortDescription"
                style={styles.input}
                type="text"
                placeholder="Օրինակ՝ արտադրություն, առևտուր, ծառայություններ"
              />
            </label>

            <label style={styles.label}>
              Իրավաբանական հասցե
              <input
                name="legalAddress"
                style={styles.input}
                type="text"
                placeholder="Իրավաբանական հասցե"
              />
            </label>

            <label style={styles.label}>
              Գործունեության հասցե
              <input
                name="businessAddress"
                style={styles.input}
                type="text"
                placeholder="Եթե տարբերվում է իրավաբանականից"
              />
            </label>
          </div>

          {organizationSaveStatus ? (
            <div style={styles.previewBox}>
              <strong>{organizationSaveStatus}</strong>
            </div>
          ) : null}

          <button type="submit" style={styles.primaryButton} disabled={isSavingOrganization}>
            {isSavingOrganization ? "Պահպանվում է..." : "Գրանցել DEV DB-ում"}
          </button>
        </form>
      </section>
    );
  }

  function openOrganizationProfile(organizationId: string) {
    setSelectedOrganizationId(organizationId);
    setOrganizationProfileTab("Ընդհանուր տվյալներ");
    setActiveDemoPage("Կազմակերպության պրոֆիլ");
  }

  function openArchiveOrganizationDialog(organizationId: string) {
    setArchiveTargetOrganizationId(organizationId);
    setArchiveReason("");
    setArchiveMessage(null);
  }

  function closeArchiveOrganizationDialog() {
    setArchiveTargetOrganizationId(null);
    setArchiveReason("");
    setArchiveMessage(null);
    setIsArchivingOrganization(false);
  }

  async function handleArchiveOrganization() {
    if (!archiveTargetOrganization) {
      setArchiveMessage("Կազմակերպությունը ընտրված չէ։");
      return;
    }

    const reason = archiveReason.trim();

    if (!reason) {
      setArchiveMessage("Սպասարկումը դադարեցնելու պատճառը պարտադիր է։");
      return;
    }

    setIsArchivingOrganization(true);
    setArchiveMessage("Դադարեցնում ենք սպասարկումը և արխիվացնում ենք...");

    try {
      const response = await fetch("/api/organizations/archive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organizationId: archiveTargetOrganization.id,
          reason,
        }),
      });

      const data = (await response.json()) as {
        organization?: AppOrganization;
        error?: string;
      };

      if (!response.ok || !data.organization) {
        setArchiveMessage(data.error ?? "Չհաջողվեց արխիվացնել կազմակերպությունը։");
        return;
      }

      setOrganizations((current) =>
        current.filter((organization) => organization.id !== data.organization?.id)
      );

      if (selectedOrganizationId === data.organization.id) {
        setSelectedOrganizationId("");
      }

      setArchiveMessage("Կազմակերպությունը արխիվացվեց և այլևս չի երևում սպասարկվող ցուցակում։");

      window.setTimeout(() => {
        closeArchiveOrganizationDialog();
      }, 900);
    } catch {
      setArchiveMessage("Չհաջողվեց կապ հաստատել archive API-ի հետ։");
    } finally {
      setIsArchivingOrganization(false);
    }
  }

  function getRegistryCheckLabel(status?: string | null) {
    if (status === "verified") {
      return "Ստուգված";
    }

    if (status === "mismatch") {
      return "Կան տարբերություններ";
    }

    if (status === "needs_review") {
      return "Պետք է վերանայել";
    }

    if (status === "failed") {
      return "Ստուգումը ձախողվել է";
    }

    return "Չստուգված";
  }

  function openRegistryCheckPage(organizationId: string) {
    setSelectedOrganizationId(organizationId);
    setRegistryCheckMessage(null);
    setRegistryDifferences([]);
    setActiveDemoPage("Կազմակերպության տվյալների ստուգում");
  }

  async function handleRegistryCheck(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedOrganization) {
      setRegistryCheckMessage("Կազմակերպությունը ընտրված չէ։");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      organizationId: selectedOrganization.id,
      registryName: String(formData.get("registryName") ?? "").trim(),
      registryTaxId: String(formData.get("registryTaxId") ?? "").trim(),
      registryLegalAddress: String(formData.get("registryLegalAddress") ?? "").trim(),
      registryStatus: String(formData.get("registryStatus") ?? "").trim(),
      registrySource: String(formData.get("registrySource") ?? "").trim(),
      registryNotes: String(formData.get("registryNotes") ?? "").trim(),
    };

    if (!payload.registryName) {
      setRegistryCheckMessage("Պետռեգիստրի անվանումը պարտադիր է։");
      return;
    }

    if (!/^\d{8}$/.test(payload.registryTaxId)) {
      setRegistryCheckMessage("Պետռեգիստրի ՀՎՀՀ-ն պետք է լինի 8 թվանշան։");
      return;
    }

    setIsSavingRegistryCheck(true);
    setRegistryCheckMessage("Համեմատում և պահպանում ենք DEV Master DB-ում...");
    setRegistryDifferences([]);

    try {
      const response = await fetch("/api/organizations/registry-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        organization?: AppOrganization;
        differences?: string[];
        registryCheckStatus?: string;
        error?: string;
      };

      if (!response.ok || !data.organization) {
        setRegistryCheckMessage(data.error ?? "Չհաջողվեց կատարել համադրումը։");
        return;
      }

      setOrganizations((current) =>
        current.map((organization) =>
          organization.id === data.organization?.id ? (data.organization as AppOrganization) : organization
        )
      );

      setRegistryDifferences(data.differences ?? []);

      if ((data.differences ?? []).length === 0) {
        setRegistryCheckMessage("Տվյալները համընկնում են․ կազմակերպությունը նշվեց որպես ստուգված։");
      } else {
        setRegistryCheckMessage("Համադրումը ավարտվեց․ կան տարբերություններ, պետք է վերանայել։");
      }
    } catch {
      setRegistryCheckMessage("Չհաջողվեց կապ հաստատել registry check API-ի հետ։");
    } finally {
      setIsSavingRegistryCheck(false);
    }
  }

  function renderRegistryCheckPage() {
    const organization = selectedOrganization;

    if (!organization) {
      return (
        <section style={styles.accountingArea}>
          <p style={styles.kicker}>Կազմակերպություններ · Ստուգում</p>
          <h2>Կազմակերպությունը ընտրված չէ</h2>
          <p>Վերադարձիր «Գործող սպասարկում» էջ և ընտրիր կազմակերպությունը։</p>
        </section>
      );
    }

    return (
      <section style={styles.accountingArea}>
        <p style={styles.kicker}>Կազմակերպություններ · Տվյալների ստուգում</p>
        <h2>Ստուգել ներմուծված տվյալները</h2>
        <p>
          Այս էջում համադրում ենք մեր DEV Master DB-ում գրանցված տվյալները պետռեգիստրից
          ձեռքով վերցված տվյալների հետ։ Արտաքին պետական API դեռ միացված չէ։
        </p>

        <div style={styles.previewBox}>
          <strong>{organization.name}</strong>
          <p style={{ margin: "8px 0" }}>
            Ստուգման կարգավիճակ՝ {getRegistryCheckLabel(organization.registryCheckStatus)}
          </p>
          <small>
            ՀՎՀՀ՝ {organization.taxId ?? "—"} · tenant DB demo՝{" "}
            {organization.tenantDatabaseName ?? "—"}
          </small>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "14px",
            margin: "18px 0",
          }}
        >
          <div style={styles.previewBox}>
            <strong>Մեր ներմուծված տվյալները</strong>
            <p>Անվանում՝ {organization.name}</p>
            <p>ՀՎՀՀ՝ {organization.taxId ?? "—"}</p>
            <p>Իրավաբանական հասցե՝ {organization.legalAddress ?? "—"}</p>
            <p style={{ marginBottom: 0 }}>Կարգավիճակ՝ {organization.status ?? "—"}</p>
          </div>

          <div style={styles.previewBox}>
            <strong>Վերջին պետռեգիստրի տվյալները</strong>
            <p>Անվանում՝ {organization.registryName ?? "Դեռ լրացված չէ"}</p>
            <p>ՀՎՀՀ՝ {organization.registryTaxId ?? "Դեռ լրացված չէ"}</p>
            <p>Իրավաբանական հասցե՝ {organization.registryLegalAddress ?? "Դեռ լրացված չէ"}</p>
            <p style={{ marginBottom: 0 }}>
              Կարգավիճակ՝ {organization.registryStatus ?? "Դեռ լրացված չէ"}
            </p>
          </div>
        </div>

        <form noValidate onSubmit={handleRegistryCheck} style={{ display: "grid", gap: "18px" }}>
          <div style={styles.formGrid}>
            <label style={styles.label}>
              Պետռեգիստրի անվանում
              <input
                name="registryName"
                style={styles.input}
                type="text"
                defaultValue={organization.registryName ?? ""}
                placeholder="Օրինակ՝ ԼՈՒԿԱՍ ՍՊԸ"
                required
              />
            </label>

            <label style={styles.label}>
              Պետռեգիստրի ՀՎՀՀ
              <input
                name="registryTaxId"
                style={styles.input}
                type="text"
                inputMode="numeric"
                maxLength={8}
                defaultValue={organization.registryTaxId ?? organization.taxId ?? ""}
                placeholder="Օրինակ՝ 01234567"
                onInput={(event) => {
                  event.currentTarget.value = event.currentTarget.value
                    .replace(/\D/g, "")
                    .slice(0, 8);
                  setRegistryCheckMessage(null);
                }}
                required
              />
            </label>

            <label style={styles.label}>
              Պետռեգիստրի իրավաբանական հասցե
              <input
                name="registryLegalAddress"
                style={styles.input}
                type="text"
                defaultValue={organization.registryLegalAddress ?? ""}
                placeholder="Պետռեգիստրում նշված իրավաբանական հասցե"
              />
            </label>

            <label style={styles.label}>
              Պետռեգիստրի կարգավիճակ
              <select name="registryStatus" style={styles.select} defaultValue={organization.registryStatus ?? "active"}>
                <option value="active">Գործող</option>
                <option value="inactive">Պասիվ / դադարեցված</option>
                <option value="unknown">Անհայտ / լրացուցիչ ստուգում</option>
              </select>
            </label>

            <label style={styles.label}>
              Աղբյուր
              <input
                name="registrySource"
                style={styles.input}
                type="text"
                defaultValue={organization.registrySource ?? "manual_demo"}
                placeholder="Օրինակ՝ e-register manual check"
              />
            </label>

            <label style={styles.label}>
              Նշումներ
              <input
                name="registryNotes"
                style={styles.input}
                type="text"
                defaultValue={organization.registryNotes ?? ""}
                placeholder="Օրինակ՝ ստուգվել է ՀՎՀՀ-ով"
              />
            </label>
          </div>

          {registryCheckMessage ? (
            <div style={styles.previewBox}>
              <strong>{registryCheckMessage}</strong>
              {registryDifferences.length > 0 ? (
                <ul style={{ marginBottom: 0 }}>
                  {registryDifferences.map((difference) => (
                    <li key={difference}>{difference}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          <button type="submit" style={styles.primaryButton} disabled={isSavingRegistryCheck}>
            {isSavingRegistryCheck ? "Ստուգվում է..." : "Համեմատել և պահել ստուգումը"}
          </button>
        </form>
      </section>
    );
  }

  function openAccountingWorkspaceForOrganization(organizationId: string) {
    const servicedOrganizationsMenu = menuItems.find(
      (item) => item.label === "Կազմակերպություններ"
    );
    const accountingWorkspaceMenu = servicedOrganizationsMenu?.children?.find(
      (item) => item.label === "Կազմակերպության հաշվապահական տարածք"
    );

    setSelectedOrganizationId(organizationId);

    if (servicedOrganizationsMenu && accountingWorkspaceMenu) {
      setActiveMenuPath([servicedOrganizationsMenu, accountingWorkspaceMenu]);
      setActiveDemoPage(null);
      return;
    }

    setActiveMenuPath([]);
    setActiveDemoPage(null);
  }

  function renderOrganizationPickerForAccounting() {
    return (
      <section style={styles.accountingArea}>
        <p style={styles.kicker}>Կազմակերպություններ · Հաշվապահական տարածք</p>
        <h2>Ընտրել կազմակերպություն</h2>
        <p>
          Հաշվապահական տարածքը բացվում է միայն կոնկրետ սպասարկվող կազմակերպության համար։
          Նախ ընտրիր կազմակերպությունը, հետո կբացվեն այդ կազմակերպության հաշվապահական բաժինները։
        </p>

        {allowedOrganizations.length > 0 ? (
          <div style={{ display: "grid", gap: "12px", marginTop: "18px" }}>
            {allowedOrganizations.map((organization) => (
              <button
                key={organization.id}
                type="button"
                onClick={() => openAccountingWorkspaceForOrganization(organization.id)}
                style={{
                  ...styles.previewBox,
                  width: "100%",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <span style={{ display: "block", fontWeight: 700 }}>{organization.name}</span>
                <span style={{ display: "block", marginTop: "8px" }}>
                  {organization.shortDescription}
                </span>
                <small>
                  ՀՎՀՀ demo: {organization.taxId} · tenant DB demo:{" "}
                  {organization.tenantDatabaseName}
                </small>
              </button>
            ))}
          </div>
        ) : (
          <p>
            Այս դերի համար հասանելի սպասարկվող կազմակերպություն չկա։
          </p>
        )}
      </section>
    );
  }

  function formatContractFee(value: number | string | null | undefined) {
    const numericValue = typeof value === "number" ? value : Number(value ?? 0);

    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      return "0 AMD";
    }

    return `${numericValue.toLocaleString("hy-AM")} AMD`;
  }

  function calculateSuggestedContractFee() {
    const employeeCount = Number(contractForm.employeeCount || 0);
    const monthlyDocumentCount = Number(contractForm.monthlyDocumentCount || 0);
    const bankAccountCount = Number(contractForm.bankAccountCount || 0);

    let fee = 50_000;

    if (employeeCount > 50) {
      fee += 120_000;
    } else if (employeeCount > 20) {
      fee += 70_000;
    } else if (employeeCount > 5) {
      fee += 30_000;
    }

    if (monthlyDocumentCount > 300) {
      fee += 100_000;
    } else if (monthlyDocumentCount > 100) {
      fee += 60_000;
    } else if (monthlyDocumentCount > 30) {
      fee += 25_000;
    }

    if (contractForm.taxRegime === "vat") {
      fee += 30_000;
    }

    if (contractForm.taxRegime === "profit_tax") {
      fee += 20_000;
    }

    if (contractForm.taxRegime === "mixed") {
      fee += 50_000;
    }

    if (bankAccountCount > 1) {
      fee += (bankAccountCount - 1) * 10_000;
    }

    if (contractForm.hasVat && contractForm.taxRegime !== "vat") {
      fee += 30_000;
    }

    if (contractForm.hasWarehouse) {
      fee += 25_000;
    }

    if (contractForm.hasProduction) {
      fee += 40_000;
    }

    if (contractForm.hasImportExport) {
      fee += 35_000;
    }

    return fee;
  }

  function fillContractForm(contract: ServiceContract | null, organizationId?: string) {
    if (!contract) {
      setContractForm({
        contractNumber: organizationId ? `FIN-${organizationId.slice(-6).toUpperCase()}` : "",
        signedAt: getTodayInputDate(),
        startsAt: getTodayInputDate(),
        endsAt: "",

        employeeCount: "",
        monthlyDocumentCount: "",
        taxRegime: "turnover_tax",
        bankAccountCount: "1",
        hasVat: false,
        hasWarehouse: false,
        hasProduction: false,
        hasImportExport: false,
        approvedFeeAmount: "",

        feeCurrency: "AMD",
        status: "draft",
        responsiblePerson: "",
        notes: "",
      });
      return;
    }

    setContractForm({
      contractNumber: contract.contractNumber ?? "",
      signedAt: contract.signedAt ?? getTodayInputDate(),
      startsAt: contract.startsAt ?? getTodayInputDate(),
      endsAt: contract.endsAt ?? "",

      employeeCount: String(contract.employeeCount ?? ""),
      monthlyDocumentCount: String(contract.monthlyDocumentCount ?? ""),
      taxRegime: contract.taxRegime ?? "turnover_tax",
      bankAccountCount: String(contract.bankAccountCount ?? "1"),
      hasVat: Boolean(contract.hasVat),
      hasWarehouse: Boolean(contract.hasWarehouse),
      hasProduction: Boolean(contract.hasProduction),
      hasImportExport: Boolean(contract.hasImportExport),
      approvedFeeAmount: contract.approvedFeeAmount ?? contract.feeAmount ?? "",

      feeCurrency: contract.feeCurrency ?? "AMD",
      status: contract.status ?? "draft",
      responsiblePerson: contract.responsiblePerson ?? "",
      notes: contract.notes ?? "",
    });
  }

  async function loadContractForOrganization(organizationId: string) {
    setContractMessage("Բեռնում ենք պայմանագրի տվյալները...");

    try {
      const response = await fetch(
        `/api/organizations/contracts?organizationId=${encodeURIComponent(organizationId)}`,
        { cache: "no-store" }
      );

      if (!response.ok) {
        setContractMessage("Չհաջողվեց բեռնել պայմանագիրը։");
        return;
      }

      const data = (await response.json()) as { contract?: ServiceContract | null };
      const contract = data.contract ?? null;

      setSelectedContract(contract);
      fillContractForm(contract, organizationId);
      setContractMessage(
        contract ? "Պայմանագիրը բեռնվեց DEV DB-ից։" : "Պայմանագիր դեռ չկա․ լրացրու և պահպանիր։"
      );
    } catch {
      setContractMessage("Չհաջողվեց կապ հաստատել contract API-ի հետ։");
    }
  }

  async function handleSaveContract(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedOrganization) {
      setContractMessage("Կազմակերպությունը ընտրված չէ։");
      return;
    }

    if (!contractForm.contractNumber.trim()) {
      setContractMessage("Պայմանագրի համարը պարտադիր է։");
      return;
    }

    const suggestedFeeAmount = calculateSuggestedContractFee();
    const approvedFeeAmount = contractForm.approvedFeeAmount.trim() || String(suggestedFeeAmount);

    setIsSavingContract(true);
    setContractMessage("Պահպանում ենք պայմանագիրը DEV DB-ում...");

    try {
      const response = await fetch("/api/organizations/contracts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organizationId: selectedOrganization.id,
          ...contractForm,
          suggestedFeeAmount: String(suggestedFeeAmount),
          approvedFeeAmount,
        }),
      });

      const data = (await response.json()) as {
        contract?: ServiceContract;
        error?: string;
      };

      if (!response.ok || !data.contract) {
        setContractMessage(data.error ?? "Չհաջողվեց պահպանել պայմանագիրը։");
        return;
      }

      setSelectedContract(data.contract);
      fillContractForm(data.contract, selectedOrganization.id);
      setContractMessage("Պայմանագիրը և սակագինը պահպանվեցին DEV DB-ում։");
    } catch {
      setContractMessage("Չհաջողվեց կապ հաստատել contract API-ի հետ։");
    } finally {
      setIsSavingContract(false);
    }
  }

  function renderContractTabContent(organization: AppOrganization) {
    const suggestedFeeAmount = calculateSuggestedContractFee();
    const approvedFeeAmount = contractForm.approvedFeeAmount || String(suggestedFeeAmount);

    return (
      <div style={styles.tabPanel}>
        <h3 style={styles.sectionTitle}>Պայմանագիր և սակագին</h3>

        <div style={styles.previewBox}>
          <strong>{selectedContract ? "Պայմանագիր կա DEV DB-ում" : "Պայմանագիր դեռ չկա"}</strong>
          <p style={{ marginBottom: 0 }}>
            Կազմակերպություն՝ {organization.name} · ՀՎՀՀ՝ {organization.taxId ?? "—"}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "12px",
            marginTop: "14px",
          }}
        >
          <div style={styles.previewBox}>
            <strong>{formatContractFee(suggestedFeeAmount)}</strong>
            <p style={{ margin: "6px 0 0" }}>Համակարգի առաջարկած սակագին</p>
          </div>
          <div style={styles.previewBox}>
            <strong>{formatContractFee(approvedFeeAmount)}</strong>
            <p style={{ margin: "6px 0 0" }}>Հաստատվող ամսական սակագին</p>
          </div>
        </div>

        {contractMessage ? (
          <div style={{ ...styles.previewBox, marginTop: "14px" }}>
            <strong>{contractMessage}</strong>
          </div>
        ) : null}

        <form noValidate onSubmit={handleSaveContract} style={{ display: "grid", gap: "18px", marginTop: "18px" }}>
          <div style={styles.formGrid}>
            <label style={styles.label}>
              Պայմանագրի համար
              <input
                style={styles.input}
                type="text"
                value={contractForm.contractNumber}
                onChange={(event) =>
                  setContractForm((current) => ({
                    ...current,
                    contractNumber: event.target.value,
                  }))
                }
                placeholder="Օրինակ՝ FIN-0001"
              />
            </label>

            <CalendarDateField
              label="Պայմանագրի ամսաթիվ"
              value={contractForm.signedAt}
              onChange={(value) =>
                setContractForm((current) => ({
                  ...current,
                  signedAt: value,
                }))
              }
            />

            <CalendarDateField
              label="Սպասարկման սկիզբ"
              value={contractForm.startsAt}
              onChange={(value) =>
                setContractForm((current) => ({
                  ...current,
                  startsAt: value,
                }))
              }
            />

            <CalendarDateField
              label="Սպասարկման ավարտ"
              value={contractForm.endsAt}
              onChange={(value) =>
                setContractForm((current) => ({
                  ...current,
                  endsAt: value,
                }))
              }
            />
          </div>

          <h3 style={styles.sectionTitle}>Սակագնի հաշվարկ</h3>

          <div style={styles.formGrid}>
            <label style={styles.label}>
              Աշխատակիցների քանակ
              <input
                style={styles.input}
                type="text"
                inputMode="numeric"
                value={contractForm.employeeCount}
                onInput={(event) => {
                  event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "");
                }}
                onChange={(event) =>
                  setContractForm((current) => ({
                    ...current,
                    employeeCount: event.target.value,
                  }))
                }
                placeholder="Օրինակ՝ 50"
              />
            </label>

            <label style={styles.label}>
              Ամսական փաստաթղթերի մոտավոր քանակ
              <input
                style={styles.input}
                type="text"
                inputMode="numeric"
                value={contractForm.monthlyDocumentCount}
                onInput={(event) => {
                  event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "");
                }}
                onChange={(event) =>
                  setContractForm((current) => ({
                    ...current,
                    monthlyDocumentCount: event.target.value,
                  }))
                }
                placeholder="Օրինակ՝ 120"
              />
            </label>

            <label style={styles.label}>
              Հարկային ռեժիմ
              <select
                style={styles.select}
                value={contractForm.taxRegime}
                onChange={(event) =>
                  setContractForm((current) => ({
                    ...current,
                    taxRegime: event.target.value,
                  }))
                }
              >
                <option value="turnover_tax">Շրջանառության հարկ</option>
                <option value="vat">ԱԱՀ</option>
                <option value="profit_tax">Շահութահարկ</option>
                <option value="mixed">Խառը / բարդ ռեժիմ</option>
              </select>
            </label>

            <label style={styles.label}>
              Բանկային հաշիվների քանակ
              <input
                style={styles.input}
                type="text"
                inputMode="numeric"
                value={contractForm.bankAccountCount}
                onInput={(event) => {
                  event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "");
                }}
                onChange={(event) =>
                  setContractForm((current) => ({
                    ...current,
                    bankAccountCount: event.target.value,
                  }))
                }
                placeholder="Օրինակ՝ 2"
              />
            </label>

            <label style={styles.label}>
              Հաստատվող ամսական սակագին
              <input
                style={styles.input}
                type="text"
                inputMode="numeric"
                value={contractForm.approvedFeeAmount}
                onInput={(event) => {
                  event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "");
                }}
                onChange={(event) =>
                  setContractForm((current) => ({
                    ...current,
                    approvedFeeAmount: event.target.value,
                  }))
                }
                placeholder={`Առաջարկ՝ ${suggestedFeeAmount}`}
              />
            </label>

            <label style={styles.label}>
              Արժույթ
              <select
                style={styles.select}
                value={contractForm.feeCurrency}
                onChange={(event) =>
                  setContractForm((current) => ({
                    ...current,
                    feeCurrency: event.target.value,
                  }))
                }
              >
                <option value="AMD">AMD</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </label>
          </div>

          <div style={{ display: "grid", gap: "10px" }}>
            {[
              ["hasVat", "ԱԱՀ վճարող է"],
              ["hasWarehouse", "Պահեստային հաշվառում ունի"],
              ["hasProduction", "Արտադրություն ունի"],
              ["hasImportExport", "Ներմուծում / արտահանում ունի"],
            ].map(([key, label]) => (
              <label key={key} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={Boolean(contractForm[key as keyof typeof contractForm])}
                  onChange={(event) =>
                    setContractForm((current) => ({
                      ...current,
                      [key]: event.target.checked,
                    }))
                  }
                />
                {label}
              </label>
            ))}
          </div>

          <div style={styles.previewBox}>
            <strong>Հաշվարկի demo կանոններ</strong>
            <p style={{ marginBottom: 0 }}>
              Բազային՝ 50,000 AMD · 6-20 աշխատակից՝ +30,000 · 21-50՝ +70,000 ·
              51+՝ +120,000 · ԱԱՀ/պահեստ/արտադրություն/ներմուծում՝ առանձին հավելումներով։
              Վերջնական սակագինը հաստատում է մարդը։
            </p>
          </div>

          <div style={styles.formGrid}>
            <label style={styles.label}>
              Կարգավիճակ
              <select
                style={styles.select}
                value={contractForm.status}
                onChange={(event) =>
                  setContractForm((current) => ({
                    ...current,
                    status: event.target.value,
                  }))
                }
              >
                <option value="draft">Նախնական</option>
                <option value="active">Գործող</option>
                <option value="expired">Ժամկետանց</option>
                <option value="terminated">Դադարեցված</option>
              </select>
            </label>

            <label style={styles.label}>
              Պատասխանատու անձ
              <input
                style={styles.input}
                type="text"
                value={contractForm.responsiblePerson}
                onChange={(event) =>
                  setContractForm((current) => ({
                    ...current,
                    responsiblePerson: event.target.value,
                  }))
                }
                placeholder="Օրինակ՝ Տիգրան Գևորգյան"
              />
            </label>
          </div>

          <label style={styles.label}>
            Նշումներ
            <textarea
              style={{
                ...styles.input,
                minHeight: "90px",
                resize: "vertical",
              }}
              value={contractForm.notes}
              onChange={(event) =>
                setContractForm((current) => ({
                  ...current,
                  notes: event.target.value,
                }))
              }
              placeholder="Պայմանագրի պայմաններ, հատուկ նշումներ, վճարման պայմաններ"
            />
          </label>

          <button type="submit" style={styles.primaryButton} disabled={isSavingContract}>
            {isSavingContract ? "Պահպանվում է..." : "Պահպանել պայմանագիրը և սակագինը DEV DB-ում"}
          </button>
        </form>
      </div>
    );
  }

  async function reloadFineraEmployees() {
    try {
      const response = await fetch("/api/employees", { cache: "no-store" });

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as { employees?: AppEmployee[] };
      setFineraEmployees(data.employees ?? []);
    } catch {
      setEmployeeSaveMessage("Չհաջողվեց բեռնել աշխատակիցների ցուցակը։");
    }
  }

  async function handleHireEmployee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hireEmployeeForm.fullName.trim()) {
      setEmployeeSaveMessage("Անուն ազգանունը պարտադիր է։");
      return;
    }

    if (!hireEmployeeForm.positionTitle.trim()) {
      setEmployeeSaveMessage("Պաշտոնը պարտադիր է։");
      return;
    }

    if (!hireEmployeeForm.departmentName.trim()) {
      setEmployeeSaveMessage("Ստորաբաժանումը պարտադիր է։");
      return;
    }

    setIsSavingEmployee(true);
    setEmployeeSaveMessage("Պահպանում ենք աշխատակցին DEV Master DB-ում...");

    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hireEmployeeForm),
      });

      const data = (await response.json()) as {
        employee?: AppEmployee;
        error?: string;
      };

      if (!response.ok || !data.employee) {
        setEmployeeSaveMessage(data.error ?? "Չհաջողվեց գրանցել աշխատակցին։");
        return;
      }

      setFineraEmployees((current) => [data.employee as AppEmployee, ...current]);
      setEmployeeSaveMessage(`Աշխատակիցը ընդունվեց աշխատանքի՝ ${data.employee.fullName}`);
      setHireEmployeeForm({
        fullName: "",
        email: "",
        phone: "",
        roleGroup: "bookkeeper",
        positionTitle: "",
        departmentName: "Հաշվապահություն",
        employmentType: "full_time",
        hireDate: getTodayInputDate(),
        notes: "",
      });
      setActiveDemoPage("Աշխատակիցների ցանկ");
    } catch {
      setEmployeeSaveMessage("Չհաջողվեց կապ հաստատել employees API-ի հետ։");
    } finally {
      setIsSavingEmployee(false);
    }
  }

  async function reloadPositions() {
    setPositionMessage("Բեռնում ենք պաշտոնների ցանկը...");

    try {
      const response = await fetch("/api/positions", { cache: "no-store" });

      if (!response.ok) {
        setPositionMessage("Չհաջողվեց բեռնել պաշտոնների ցանկը։");
        return;
      }

      const data = (await response.json()) as { positions?: AppPosition[] };
      setAppPositions(data.positions ?? []);
      setPositionMessage(`Բեռնվեց պաշտոնների քանակ՝ ${(data.positions ?? []).length}`);
    } catch {
      setPositionMessage("Չհաջողվեց կապ հաստատել positions API-ի հետ։");
    }
  }

  async function handleCreatePosition(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!positionForm.title.trim()) {
      setPositionMessage("Պաշտոնի անվանումը պարտադիր է։");
      return;
    }

    if (positionForm.departmentName === "__add_department__") {
      setPositionMessage("Նախ ավելացրու նոր ստորաբաժանումը, հետո պահպանիր պաշտոնը։");
      return;
    }

    setIsSavingPosition(true);
    setPositionMessage("Պահպանում ենք պաշտոնը DEV DB-ում...");

    try {
      const response = await fetch("/api/positions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(positionForm),
      });

      const data = (await response.json()) as {
        position?: AppPosition;
        error?: string;
      };

      if (!response.ok || !data.position) {
        setPositionMessage(data.error ?? "Չհաջողվեց պահպանել պաշտոնը։");
        return;
      }

      setAppPositions((current) => [...current, data.position as AppPosition].sort((a, b) => a.title.localeCompare(b.title)));
      setPositionMessage(`Պաշտոնը ավելացվեց՝ ${data.position.title}`);
      setPositionForm({
        title: "",
        scope: "finera",
        departmentName: "Հաշվապահություն",
        notes: "",
      });
    } catch {
      setPositionMessage("Չհաջողվեց կապ հաստատել positions API-ի հետ։");
    } finally {
      setIsSavingPosition(false);
    }
  }

  function getFineraDepartments() {
    return appDepartments.filter(
      (department) => department.scope === "finera" && department.status !== "inactive"
    );
  }

  async function reloadDepartments() {
    setDepartmentInlineMessage("Բեռնում ենք ստորաբաժանումների ցանկը...");

    try {
      const response = await fetch("/api/departments", { cache: "no-store" });

      if (!response.ok) {
        setDepartmentInlineMessage("Չհաջողվեց բեռնել ստորաբաժանումների ցանկը։");
        return;
      }

      const data = (await response.json()) as { departments?: AppDepartment[] };
      setAppDepartments(data.departments ?? []);
      setDepartmentInlineMessage(`Բեռնվեց ստորաբաժանումների քանակ՝ ${(data.departments ?? []).length}`);
    } catch {
      setDepartmentInlineMessage("Չհաջողվեց կապ հաստատել departments API-ի հետ։");
    }
  }

  async function handleCreateDepartmentFromPositionForm() {
    const name = departmentInlineName.trim();

    if (!name) {
      setDepartmentInlineMessage("Նոր ստորաբաժանման անվանումը գրիր։");
      return;
    }

    setIsSavingDepartment(true);
    setDepartmentInlineMessage("Պահպանում ենք նոր ստորաբաժանումը DEV DB-ում...");

    try {
      const response = await fetch("/api/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          scope: "finera",
        }),
      });

      const data = (await response.json()) as {
        department?: AppDepartment;
        error?: string;
      };

      if (!response.ok || !data.department) {
        setDepartmentInlineMessage(data.error ?? "Չհաջողվեց ավելացնել ստորաբաժանումը։");
        return;
      }

      setAppDepartments((current) =>
        [...current, data.department as AppDepartment].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      );
      setPositionForm((current) => ({
        ...current,
        departmentName: data.department?.name ?? name,
      }));
      setDepartmentInlineName("");
      setDepartmentInlineMessage(`Ստորաբաժանումը ավելացվեց՝ ${data.department.name}`);
    } catch {
      setDepartmentInlineMessage("Չհաջողվեց կապ հաստատել departments API-ի հետ։");
    } finally {
      setIsSavingDepartment(false);
    }
  }

  function renderPositionsPage() {
    const fineraPositions = appPositions.filter((position) => position.scope === "finera");

    return (
      <section style={styles.accountingArea}>
        <p style={styles.kicker}>Աշխատակիցներ · Պաշտոններ</p>
        <h2>Պաշտոններ</h2>
        <p>
          Այստեղ պահում ենք մեր կազմակերպության պաշտոնների միասնական ցուցակը։
          Աշխատանքի ընդունման form-ում պաշտոնը ընտրվում է այս ցուցակից։
        </p>

        {positionMessage ? (
          <div style={styles.previewBox}>
            <strong>{positionMessage}</strong>
          </div>
        ) : null}

        {departmentInlineMessage ? (
          <div style={styles.previewBox}>
            <strong>{departmentInlineMessage}</strong>
          </div>
        ) : null}

        <form noValidate onSubmit={handleCreatePosition} style={{ display: "grid", gap: "18px", marginTop: "18px" }}>
          <div style={styles.formGrid}>
            <label style={styles.label}>
              Պաշտոնի անվանում
              <input
                style={styles.input}
                type="text"
                value={positionForm.title}
                onChange={(event) =>
                  setPositionForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                placeholder="Օրինակ՝ Հաշվետար"
              />
            </label>

            <label style={styles.label}>
              Որտեղ է կիրառվում
              <select
                style={styles.select}
                value={positionForm.scope}
                onChange={(event) =>
                  setPositionForm((current) => ({
                    ...current,
                    scope: event.target.value,
                  }))
                }
              >
                <option value="finera">Մեր կազմակերպություն</option>
                <option value="organization">Սպասարկվող կազմակերպություններ</option>
              </select>
            </label>

            <div style={styles.label}>
              Ստորաբաժանում
              <select
                style={styles.select}
                value={positionForm.departmentName}
                onChange={(event) =>
                  setPositionForm((current) => ({
                    ...current,
                    departmentName: event.target.value,
                  }))
                }
              >
                {getFineraDepartments().map((department) => (
                  <option key={department.id} value={department.name}>
                    {department.name}
                  </option>
                ))}
                <option value="__add_department__">+ Ավելացնել նոր ստորաբաժանում</option>
              </select>

              {positionForm.departmentName === "__add_department__" ? (
                <div style={{ display: "grid", gap: "8px", marginTop: "8px" }}>
                  <input
                    style={styles.input}
                    type="text"
                    value={departmentInlineName}
                    onChange={(event) => setDepartmentInlineName(event.target.value)}
                    placeholder="Օրինակ՝ Ներքին աուդիտ"
                  />
                  <button
                    type="button"
                    style={{
                      ...styles.primaryButton,
                      background: "#efe4d4",
                      color: "#2b2118",
                    }}
                    disabled={isSavingDepartment}
                    onClick={() => void handleCreateDepartmentFromPositionForm()}
                  >
                    {isSavingDepartment ? "Պահպանվում է..." : "Պահպանել նոր ստորաբաժանումը"}
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <label style={styles.label}>
            Նշումներ
            <textarea
              style={{
                ...styles.input,
                minHeight: "80px",
                resize: "vertical",
              }}
              value={positionForm.notes}
              onChange={(event) =>
                setPositionForm((current) => ({
                  ...current,
                  notes: event.target.value,
                }))
              }
              placeholder="Պարտականությունների կամ կիրառման կարճ նկարագրություն"
            />
          </label>

          <button type="submit" style={styles.primaryButton} disabled={isSavingPosition}>
            {isSavingPosition ? "Պահպանվում է..." : "Ավելացնել պաշտոն"}
          </button>
        </form>

        <button
          type="button"
          style={{ ...styles.primaryButton, marginTop: "18px", background: "#efe4d4", color: "#2b2118" }}
          onClick={() => void reloadPositions()}
        >
          Թարմացնել պաշտոնների ցանկը
        </button>

        <div style={{ display: "grid", gap: "12px", marginTop: "18px" }}>
          {fineraPositions.length > 0 ? (
            fineraPositions.map((position) => (
              <article key={position.id} style={{ ...styles.previewBox, display: "grid", gap: "8px" }}>
                <strong>{position.title}</strong>
                <small>
                  Ստորաբաժանում՝ {position.departmentName ?? "—"} · կարգավիճակ՝{" "}
                  {position.status === "active" ? "Գործող" : position.status ?? "—"}
                </small>
                {position.notes ? <p style={{ marginBottom: 0 }}>{position.notes}</p> : null}
              </article>
            ))
          ) : (
            <div style={styles.previewBox}>
              <strong>Պաշտոններ դեռ չկան</strong>
              <p style={{ marginBottom: 0 }}>Ավելացրու առաջին պաշտոնը, հետո այն կհայտնվի աշխատանքի ընդունման form-ում։</p>
            </div>
          )}
        </div>
      </section>
    );
  }

  function renderEmployeesListPage() {
    return (
      <section style={styles.accountingArea}>
        <p style={styles.kicker}>Աշխատակիցներ · DEV Master DB</p>
        <h2>Աշխատակիցների ցանկ</h2>
        <p>
          Այստեղ երևում են Finera/Sose-ի ներքին աշխատակիցները։ Հետո հենց այս ցուցակից
          կնշանակենք աշխատակիցներին սպասարկվող կազմակերպությունների վրա։
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            margin: "18px 0",
          }}
        >
          <div style={styles.previewBox}>
            <strong>{fineraEmployees.length}</strong>
            <p style={{ margin: "6px 0 0" }}>Ընդհանուր աշխատակիցներ</p>
          </div>
          <div style={styles.previewBox}>
            <strong>
              {fineraEmployees.filter((employee) => employee.employmentStatus === "active").length}
            </strong>
            <p style={{ margin: "6px 0 0" }}>Գործող</p>
          </div>
          <div style={styles.previewBox}>
            <strong>
              {fineraEmployees.filter((employee) => employee.roleGroup === "bookkeeper").length}
            </strong>
            <p style={{ margin: "6px 0 0" }}>Հաշվետարներ</p>
          </div>
        </div>

        <button type="button" style={styles.primaryButton} onClick={() => void reloadFineraEmployees()}>
          Թարմացնել ցուցակը
        </button>

        {employeeSaveMessage ? (
          <div style={{ ...styles.previewBox, marginTop: "14px" }}>
            <strong>{employeeSaveMessage}</strong>
          </div>
        ) : null}

        {fineraEmployees.length > 0 ? (
          <div style={{ display: "grid", gap: "12px", marginTop: "18px" }}>
            {fineraEmployees.map((employee) => (
              <article key={employee.id} style={{ ...styles.previewBox, display: "grid", gap: "10px" }}>
                <div>
                  <strong style={{ fontSize: "18px" }}>{employee.fullName}</strong>
                  <p style={{ margin: "8px 0" }}>
                    {employee.positionTitle ?? "Պաշտոն նշված չէ"} · {employee.departmentName ?? "Ստորաբաժանում չկա"}
                  </p>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: "10px",
                  }}
                >
                  <small>
                    <strong>Դերի խումբ</strong>
                    <br />
                    {employee.roleGroup ?? "—"}
                  </small>
                  <small>
                    <strong>Աշխատանքի սկիզբ</strong>
                    <br />
                    {employee.hireDate ?? "—"}
                  </small>
                  <small>
                    <strong>Կարգավիճակ</strong>
                    <br />
                    {employee.employmentStatus === "active" ? "Գործող" : employee.employmentStatus ?? "—"}
                  </small>
                  <small>
                    <strong>Կոնտակտ</strong>
                    <br />
                    {employee.email || employee.phone || "—"}
                  </small>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div style={{ ...styles.previewBox, marginTop: "18px" }}>
            <strong>Աշխատակիցներ դեռ չկան</strong>
            <p style={{ marginBottom: 0 }}>
              Սեղմիր «Աշխատանքի ընդունում» և գրանցիր առաջին ներքին աշխատակցին։
            </p>
          </div>
        )}
      </section>
    );
  }

  function renderHireEmployeePage() {
    return (
      <section style={styles.accountingArea}>
        <p style={styles.kicker}>Աշխատակիցներ · Աշխատանքի ընդունում</p>
        <h2>Աշխատանքի ընդունում</h2>
        <p>
          Այս ձևը գրանցում է Finera/Sose-ի ներքին աշխատակցին DEV Master DB-ում։
          Սա սպասարկվող կազմակերպության աշխատակից չէ։
        </p>

        {employeeSaveMessage ? (
          <div style={styles.previewBox}>
            <strong>{employeeSaveMessage}</strong>
          </div>
        ) : null}

        <form noValidate onSubmit={handleHireEmployee} style={{ display: "grid", gap: "18px", marginTop: "18px" }}>
          <div style={styles.formGrid}>
            <label style={styles.label}>
              Անուն ազգանուն
              <input
                style={styles.input}
                type="text"
                value={hireEmployeeForm.fullName}
                onChange={(event) =>
                  setHireEmployeeForm((current) => ({
                    ...current,
                    fullName: event.target.value,
                  }))
                }
                placeholder="Օրինակ՝ Աննա Մկրտչյան"
              />
            </label>

            <label style={styles.label}>
              Դերի խումբ
              <select
                style={styles.select}
                value={hireEmployeeForm.roleGroup}
                onChange={(event) =>
                  setHireEmployeeForm((current) => ({
                    ...current,
                    roleGroup: event.target.value,
                  }))
                }
              >
                <option value="chief_accountant">Գլխավոր հաշվապահ</option>
                <option value="bookkeeper">Հաշվետար / հաշվապահական օգնական</option>
                <option value="hr_legal">HR / իրավական</option>
                <option value="manager">Ղեկավար / վերահսկող</option>
                <option value="support">Support</option>
              </select>
            </label>

            <div style={styles.label}>
              Պաշտոն
              <select
                style={styles.select}
                value={hireEmployeeForm.positionTitle}
                onChange={(event) =>
                  setHireEmployeeForm((current) => ({
                    ...current,
                    positionTitle: event.target.value,
                  }))
                }
              >
                <option value="">Ընտրել պաշտոն</option>
                {appPositions
                  .filter((position) => position.scope === "finera" && position.status !== "inactive")
                  .map((position) => (
                    <option key={position.id} value={position.title}>
                      {position.title}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                style={{
                  ...styles.primaryButton,
                  marginTop: "8px",
                  background: "#efe4d4",
                  color: "#2b2118",
                }}
                onClick={() => setActiveDemoPage("Պաշտոններ")}
              >
                + Ավելացնել պաշտոն
              </button>
            </div>

            <label style={styles.label}>
              Ստորաբաժանում
              <select
                style={styles.select}
                value={hireEmployeeForm.departmentName}
                onChange={(event) =>
                  setHireEmployeeForm((current) => ({
                    ...current,
                    departmentName: event.target.value,
                  }))
                }
              >
                <option value="Հաշվապահություն">Հաշվապահություն</option>
                <option value="Աշխատավարձ և կադրեր">Աշխատավարձ և կադրեր</option>
                <option value="Իրավաբանական">Իրավաբանական</option>
                <option value="Կառավարում">Կառավարում</option>
                <option value="Տեխնիկական աջակցություն">Տեխնիկական աջակցություն</option>
              </select>
            </label>

            <CalendarDateField
              label="Աշխատանքի ընդունման ամսաթիվ"
              value={hireEmployeeForm.hireDate}
              onChange={(value) =>
                setHireEmployeeForm((current) => ({
                  ...current,
                  hireDate: value,
                }))
              }
            />

            <label style={styles.label}>
              Աշխատանքի տեսակ
              <select
                style={styles.select}
                value={hireEmployeeForm.employmentType}
                onChange={(event) =>
                  setHireEmployeeForm((current) => ({
                    ...current,
                    employmentType: event.target.value,
                  }))
                }
              >
                <option value="full_time">Լրիվ դրույք</option>
                <option value="part_time">Կես դրույք</option>
                <option value="contract">Քաղ․ իրավական / պայմանագրային</option>
              </select>
            </label>

            <label style={styles.label}>
              Email
              <input
                style={styles.input}
                type="email"
                value={hireEmployeeForm.email}
                onChange={(event) =>
                  setHireEmployeeForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                placeholder="example@finera.am"
              />
            </label>

            <label style={styles.label}>
              Հեռախոս
              <input
                style={styles.input}
                type="text"
                value={hireEmployeeForm.phone}
                onChange={(event) =>
                  setHireEmployeeForm((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
                placeholder="+374..."
              />
            </label>
          </div>

          <label style={styles.label}>
            Նշումներ
            <textarea
              style={{
                ...styles.input,
                minHeight: "90px",
                resize: "vertical",
              }}
              value={hireEmployeeForm.notes}
              onChange={(event) =>
                setHireEmployeeForm((current) => ({
                  ...current,
                  notes: event.target.value,
                }))
              }
              placeholder="Փորձաշրջան, պարտականություններ, ներքին նշումներ"
            />
          </label>

          <button type="submit" style={styles.primaryButton} disabled={isSavingEmployee}>
            {isSavingEmployee ? "Պահպանվում է..." : "Ընդունել աշխատանքի DEV DB-ում"}
          </button>
        </form>
      </section>
    );
  }

  function resetOrganizationEmployeeForm() {
    setOrganizationEmployeeForm({
      fullName: "",
      taxId: "",
      phone: "",
      email: "",
      positionTitle: "",
      departmentName: "",
      employmentType: "full_time",
      hireDate: getTodayInputDate(),
      salaryAmount: "",
      notes: "",
    });
  }

  async function loadOrganizationEmployees(organizationId: string) {
    setOrganizationEmployeeMessage("Բեռնում ենք կազմակերպության աշխատակիցներին...");

    try {
      const response = await fetch(
        `/api/organizations/employees?organizationId=${encodeURIComponent(organizationId)}`,
        { cache: "no-store" }
      );

      if (!response.ok) {
        setOrganizationEmployeeMessage("Չհաջողվեց բեռնել կազմակերպության աշխատակիցների ցուցակը։");
        return;
      }

      const data = (await response.json()) as { employees?: OrganizationEmployee[] };
      setOrganizationEmployees(data.employees ?? []);
      setOrganizationEmployeeMessage(
        (data.employees ?? []).length > 0
          ? `Բեռնվեց աշխատակիցների քանակ՝ ${(data.employees ?? []).length}`
          : "Այս կազմակերպության աշխատակիցներ դեռ գրանցված չեն։"
      );
    } catch {
      setOrganizationEmployeeMessage("Չհաջողվեց կապ հաստատել organization employees API-ի հետ։");
    }
  }

  async function handleCreateOrganizationEmployee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedOrganization) {
      setOrganizationEmployeeMessage("Կազմակերպությունը ընտրված չէ։");
      return;
    }

    if (!organizationEmployeeForm.fullName.trim()) {
      setOrganizationEmployeeMessage("Աշխատակցի անուն ազգանունը պարտադիր է։");
      return;
    }

    if (!organizationEmployeeForm.positionTitle.trim()) {
      setOrganizationEmployeeMessage("Պաշտոնը պարտադիր է։");
      return;
    }

    if (
      organizationEmployeeForm.taxId.trim() &&
      !/^\d{8}$/.test(organizationEmployeeForm.taxId.trim())
    ) {
      setOrganizationEmployeeMessage("Աշխատակցի ՀՎՀՀ-ն պետք է լինի 8 թվանշան կամ դատարկ թողնվի։");
      return;
    }

    setIsSavingOrganizationEmployee(true);
    setOrganizationEmployeeMessage("Պահպանում ենք աշխատակցին կազմակերպության DEV տվյալներում...");

    try {
      const response = await fetch("/api/organizations/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organizationId: selectedOrganization.id,
          ...organizationEmployeeForm,
        }),
      });

      const data = (await response.json()) as {
        employee?: OrganizationEmployee;
        error?: string;
      };

      if (!response.ok || !data.employee) {
        setOrganizationEmployeeMessage(data.error ?? "Չհաջողվեց գրանցել աշխատակցին։");
        return;
      }

      setOrganizationEmployees((current) => [data.employee as OrganizationEmployee, ...current]);
      setOrganizationEmployeeMessage(`Գրանցվեց աշխատակից՝ ${data.employee.fullName}`);
      resetOrganizationEmployeeForm();
    } catch {
      setOrganizationEmployeeMessage("Չհաջողվեց կապ հաստատել organization employees API-ի հետ։");
    } finally {
      setIsSavingOrganizationEmployee(false);
    }
  }

  function renderOrganizationEmployeesTab(organization: AppOrganization) {
    return (
      <div style={styles.tabPanel}>
        <h3 style={styles.sectionTitle}>Կազմակերպության աշխատակիցներ</h3>

        <div style={styles.previewBox}>
          <strong>{organization.name}</strong>
          <p style={{ marginBottom: 0 }}>
            Սա սպասարկվող կազմակերպության աշխատակիցների ցուցակն է։ Չի խառնվում Finera/Sose-ի
            ներքին աշխատակիցների հետ։
          </p>
        </div>

        {organizationEmployeeMessage ? (
          <div style={{ ...styles.previewBox, marginTop: "14px" }}>
            <strong>{organizationEmployeeMessage}</strong>
          </div>
        ) : null}

        <button
          type="button"
          style={{ ...styles.primaryButton, marginTop: "14px" }}
          onClick={() => void loadOrganizationEmployees(organization.id)}
        >
          Թարմացնել աշխատակիցների ցուցակը
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "12px",
            margin: "18px 0",
          }}
        >
          <div style={styles.previewBox}>
            <strong>{organizationEmployees.length}</strong>
            <p style={{ margin: "6px 0 0" }}>Գրանցված աշխատակիցներ</p>
          </div>
          <div style={styles.previewBox}>
            <strong>
              {
                organizationEmployees.filter(
                  (employee) => employee.employmentStatus === "active"
                ).length
              }
            </strong>
            <p style={{ margin: "6px 0 0" }}>Գործող</p>
          </div>
        </div>

        <form
          noValidate
          onSubmit={handleCreateOrganizationEmployee}
          style={{ display: "grid", gap: "18px", marginTop: "18px" }}
        >
          <h3 style={styles.sectionTitle}>Աշխատանքի ընդունում այս կազմակերպությունում</h3>

          <div style={styles.formGrid}>
            <label style={styles.label}>
              Անուն ազգանուն
              <input
                style={styles.input}
                type="text"
                value={organizationEmployeeForm.fullName}
                onChange={(event) =>
                  setOrganizationEmployeeForm((current) => ({
                    ...current,
                    fullName: event.target.value,
                  }))
                }
                placeholder="Օրինակ՝ Կարեն Սարգսյան"
              />
            </label>

            <label style={styles.label}>
              ՀՎՀՀ
              <input
                style={styles.input}
                type="text"
                inputMode="numeric"
                maxLength={8}
                value={organizationEmployeeForm.taxId}
                onInput={(event) => {
                  event.currentTarget.value = event.currentTarget.value
                    .replace(/\D/g, "")
                    .slice(0, 8);
                }}
                onChange={(event) =>
                  setOrganizationEmployeeForm((current) => ({
                    ...current,
                    taxId: event.target.value,
                  }))
                }
                placeholder="Եթե պետք է՝ 8 թվանշան"
              />
            </label>

            <label style={styles.label}>
              Պաշտոն
              <input
                style={styles.input}
                type="text"
                value={organizationEmployeeForm.positionTitle}
                onChange={(event) =>
                  setOrganizationEmployeeForm((current) => ({
                    ...current,
                    positionTitle: event.target.value,
                  }))
                }
                placeholder="Օրինակ՝ Վաճառող, պահեստապետ, տնօրեն"
              />
            </label>

            <label style={styles.label}>
              Ստորաբաժանում
              <input
                style={styles.input}
                type="text"
                value={organizationEmployeeForm.departmentName}
                onChange={(event) =>
                  setOrganizationEmployeeForm((current) => ({
                    ...current,
                    departmentName: event.target.value,
                  }))
                }
                placeholder="Օրինակ՝ Վաճառք, պահեստ, վարչակազմ"
              />
            </label>

            <CalendarDateField
              label="Աշխատանքի ընդունման ամսաթիվ"
              value={organizationEmployeeForm.hireDate}
              onChange={(value) =>
                setOrganizationEmployeeForm((current) => ({
                  ...current,
                  hireDate: value,
                }))
              }
            />

            <label style={styles.label}>
              Աշխատանքի տեսակ
              <select
                style={styles.select}
                value={organizationEmployeeForm.employmentType}
                onChange={(event) =>
                  setOrganizationEmployeeForm((current) => ({
                    ...current,
                    employmentType: event.target.value,
                  }))
                }
              >
                <option value="full_time">Լրիվ դրույք</option>
                <option value="part_time">Կես դրույք</option>
                <option value="civil_contract">Քաղ․ իրավական</option>
                <option value="temporary">Ժամանակավոր</option>
              </select>
            </label>

            <label style={styles.label}>
              Աշխատավարձ
              <input
                style={styles.input}
                type="text"
                inputMode="numeric"
                value={organizationEmployeeForm.salaryAmount}
                onInput={(event) => {
                  event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "");
                }}
                onChange={(event) =>
                  setOrganizationEmployeeForm((current) => ({
                    ...current,
                    salaryAmount: event.target.value,
                  }))
                }
                placeholder="Օրինակ՝ 180000"
              />
            </label>

            <label style={styles.label}>
              Հեռախոս
              <input
                style={styles.input}
                type="text"
                value={organizationEmployeeForm.phone}
                onChange={(event) =>
                  setOrganizationEmployeeForm((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
                placeholder="+374..."
              />
            </label>

            <label style={styles.label}>
              Email
              <input
                style={styles.input}
                type="email"
                value={organizationEmployeeForm.email}
                onChange={(event) =>
                  setOrganizationEmployeeForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                placeholder="employee@example.am"
              />
            </label>
          </div>

          <label style={styles.label}>
            Նշումներ
            <textarea
              style={{
                ...styles.input,
                minHeight: "90px",
                resize: "vertical",
              }}
              value={organizationEmployeeForm.notes}
              onChange={(event) =>
                setOrganizationEmployeeForm((current) => ({
                  ...current,
                  notes: event.target.value,
                }))
              }
              placeholder="Փորձաշրջան, պայմաններ, ներքին նշումներ"
            />
          </label>

          <button
            type="submit"
            style={styles.primaryButton}
            disabled={isSavingOrganizationEmployee}
          >
            {isSavingOrganizationEmployee
              ? "Պահպանվում է..."
              : "Ընդունել աշխատանքի այս կազմակերպությունում"}
          </button>
        </form>

        {organizationEmployees.length > 0 ? (
          <div style={{ display: "grid", gap: "12px", marginTop: "18px" }}>
            {organizationEmployees.map((employee) => (
              <article key={employee.id} style={{ ...styles.previewBox, display: "grid", gap: "10px" }}>
                <div>
                  <strong style={{ fontSize: "18px" }}>{employee.fullName}</strong>
                  <p style={{ margin: "8px 0" }}>
                    {employee.positionTitle ?? "Պաշտոն նշված չէ"} · {employee.departmentName ?? "Ստորաբաժանում չկա"}
                  </p>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: "10px",
                  }}
                >
                  <small>
                    <strong>ՀՎՀՀ</strong>
                    <br />
                    {employee.taxId ?? "—"}
                  </small>
                  <small>
                    <strong>Աշխատանքի սկիզբ</strong>
                    <br />
                    {employee.hireDate ?? "—"}
                  </small>
                  <small>
                    <strong>Աշխատավարձ</strong>
                    <br />
                    {employee.salaryAmount
                      ? `${Number(employee.salaryAmount).toLocaleString("hy-AM")} AMD`
                      : "—"}
                  </small>
                  <small>
                    <strong>Կարգավիճակ</strong>
                    <br />
                    {employee.employmentStatus === "active" ? "Գործող" : employee.employmentStatus ?? "—"}
                  </small>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  function renderOrganizationProfilePage() {
    const organization = selectedOrganization;
    const profileTabs = [
      "Ընդհանուր տվյալներ",
      "Աշխատակիցներ",
      "Ստուգում",
      "Սպասարկում",
      "Հաշվապահական տարածք",
      "Պայմանագիր",
    ];

    if (!organization) {
      return (
        <section style={styles.accountingArea}>
          <p style={styles.kicker}>Կազմակերպություններ · Պրոֆիլ</p>
          <h2>Կազմակերպությունը ընտրված չէ</h2>
          <p>Վերադարձիր «Գործող սպասարկում» բաժին և ընտրիր կազմակերպություն։</p>
          <button
            type="button"
            style={styles.primaryButton}
            onClick={() => setActiveDemoPage("Գործող սպասարկում")}
          >
            Վերադառնալ գործող սպասարկում
          </button>
        </section>
      );
    }

    return (
      <section style={styles.accountingArea}>
        <p style={styles.kicker}>Կազմակերպություններ · Պրոֆիլ</p>
        <h2>{organization.name}</h2>
        <p>
          Սա կազմակերպության կենտրոնական էջն է։ Այստեղից պետք է կառավարվի տվյալ կազմակերպության
          ընդհանուր տվյալները, ստուգումը, սպասարկման վիճակը, պայմանագիրը և հաշվապահական տարածքը։
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            margin: "18px 0",
          }}
        >
          <div style={styles.previewBox}>
            <strong>{organization.taxId ?? "—"}</strong>
            <p style={{ margin: "6px 0 0" }}>ՀՎՀՀ</p>
          </div>
          <div style={styles.previewBox}>
            <strong>{organization.serviceStatus === "archived" ? "Արխիվացված" : "Սպասարկվում է"}</strong>
            <p style={{ margin: "6px 0 0" }}>Սպասարկման վիճակ</p>
          </div>
          <div style={styles.previewBox}>
            <strong>{getRegistryCheckLabel(organization.registryCheckStatus)}</strong>
            <p style={{ margin: "6px 0 0" }}>Տվյալների ստուգում</p>
          </div>
        </div>

        <div style={styles.tabsBar}>
          {profileTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              style={{
                ...styles.tabButton,
                ...(organizationProfileTab === tab ? styles.tabButtonActive : {}),
              }}
              onClick={() => {
                setOrganizationProfileTab(tab);

                if (tab === "Պայմանագիր") {
                  void loadContractForOrganization(organization.id);
                }
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {organizationProfileTab === "Ընդհանուր տվյալներ" ? (
          <div style={styles.tabPanel}>
            <h3 style={styles.sectionTitle}>Ընդհանուր տվյալներ</h3>
            <div style={styles.formGrid}>
              <div style={styles.previewBox}>
                <strong>Լրիվ անվանում</strong>
                <p style={{ marginBottom: 0 }}>{organization.name}</p>
              </div>
              <div style={styles.previewBox}>
                <strong>Կարճ անվանում</strong>
                <p style={{ marginBottom: 0 }}>{organization.shortName ?? "—"}</p>
              </div>
              <div style={styles.previewBox}>
                <strong>Տեսակ</strong>
                <p style={{ marginBottom: 0 }}>{organization.legalType ?? "—"}</p>
              </div>
              <div style={styles.previewBox}>
                <strong>ՀՎՀՀ</strong>
                <p style={{ marginBottom: 0 }}>{organization.taxId ?? "—"}</p>
              </div>
              <div style={styles.previewBox}>
                <strong>Իրավաբանական հասցե</strong>
                <p style={{ marginBottom: 0 }}>{organization.legalAddress ?? "—"}</p>
              </div>
              <div style={styles.previewBox}>
                <strong>Գործունեության հասցե</strong>
                <p style={{ marginBottom: 0 }}>{organization.businessAddress ?? "—"}</p>
              </div>
            </div>
          </div>
        ) : null}

        {organizationProfileTab === "Աշխատակիցներ"
          ? renderOrganizationEmployeesTab(organization)
          : null}

        {organizationProfileTab === "Ստուգում" ? (
          <div style={styles.tabPanel}>
            <h3 style={styles.sectionTitle}>Տվյալների ստուգում</h3>
            <div style={styles.previewBox}>
              <strong>Կարգավիճակ՝ {getRegistryCheckLabel(organization.registryCheckStatus)}</strong>
              <p>Պետռեգիստրի անվանում՝ {organization.registryName ?? "Դեռ լրացված չէ"}</p>
              <p>Պետռեգիստրի ՀՎՀՀ՝ {organization.registryTaxId ?? "Դեռ լրացված չէ"}</p>
              <p style={{ marginBottom: 0 }}>
                Պետռեգիստրի հասցե՝ {organization.registryLegalAddress ?? "Դեռ լրացված չէ"}
              </p>
            </div>

            <button
              type="button"
              style={styles.primaryButton}
              onClick={() => openRegistryCheckPage(organization.id)}
            >
              Բացել ստուգման էջը
            </button>
          </div>
        ) : null}

        {organizationProfileTab === "Սպասարկում" ? (
          <div style={styles.tabPanel}>
            <h3 style={styles.sectionTitle}>Սպասարկման վիճակ</h3>
            <div style={styles.previewBox}>
              <strong>
                {organization.serviceStatus === "archived" ? "Արխիվացված" : "Գործող սպասարկում"}
              </strong>
              <p>Դադարեցման ամսաթիվ՝ {organization.serviceStoppedAt ? new Date(organization.serviceStoppedAt).toLocaleDateString("hy-AM") : "—"}</p>
              <p style={{ marginBottom: 0 }}>
                Դադարեցման պատճառ՝ {organization.serviceStopReason ?? "—"}
              </p>
            </div>

            {organization.serviceStatus === "archived" ? null : (
              <button
                type="button"
                style={{ ...styles.primaryButton, background: "#7c2d12" }}
                onClick={() => openArchiveOrganizationDialog(organization.id)}
              >
                Դադարեցնել սպասարկումը և արխիվացնել
              </button>
            )}
          </div>
        ) : null}

        {organizationProfileTab === "Հաշվապահական տարածք" ? (
          <div style={styles.tabPanel}>
            <h3 style={styles.sectionTitle}>Հաշվապահական տարածք</h3>
            <div style={styles.previewBox}>
              <strong>Tenant DB demo</strong>
              <p style={{ marginBottom: 0 }}>{organization.tenantDatabaseName ?? "—"}</p>
            </div>
            <p>
              Այս բաժնից բացվելու է հենց այս կազմակերպության հաշվապահական աշխատանքային տարածքը։
            </p>
            <button
              type="button"
              style={styles.primaryButton}
              onClick={() => openAccountingWorkspaceForOrganization(organization.id)}
            >
              Բացել հաշվապահական տարածքը
            </button>
          </div>
        ) : null}

        {organizationProfileTab === "Պայմանագիր" ? renderContractTabContent(organization) : null}

        <button
          type="button"
          style={{
            ...styles.primaryButton,
            marginTop: "18px",
            background: "#efe4d4",
            color: "#2b2118",
          }}
          onClick={() => setActiveDemoPage("Գործող սպասարկում")}
        >
          ← Վերադառնալ գործող սպասարկում
        </button>
      </section>
    );
  }

  async function loadArchivedOrganizations() {
    setArchiveListMessage("Բեռնում ենք արխիվացված կազմակերպությունները...");

    try {
      const response = await fetch("/api/organizations?includeArchived=1", {
        cache: "no-store",
      });

      if (!response.ok) {
        setArchiveListMessage("Չհաջողվեց բեռնել կազմակերպությունների արխիվը։");
        return;
      }

      const data = (await response.json()) as { organizations?: AppOrganization[] };
      const archived = (data.organizations ?? []).filter(
        (organization) => organization.serviceStatus === "archived"
      );

      setArchivedOrganizations(archived);
      setArchiveListMessage(
        archived.length > 0
          ? `Գտնվեց արխիվացված կազմակերպություն՝ ${archived.length}`
          : "Արխիվացված կազմակերպություններ դեռ չկան։"
      );
    } catch {
      setArchiveListMessage("Չհաջողվեց կապ հաստատել archive list API-ի հետ։");
    }
  }

  function renderOrganizationsArchivePage() {
    return (
      <section style={styles.accountingArea}>
        <p style={styles.kicker}>Կազմակերպություններ · Արխիվ</p>
        <h2>Կազմակերպությունների արխիվ</h2>
        <p>
          Այստեղ երևում են այն կազմակերպությունները, որոնց սպասարկումը դադարեցվել է։
          Դրանք չեն ջնջվում DB-ից և չեն երևում «Գործող սպասարկում» ցուցակում։
        </p>

        <button type="button" style={styles.primaryButton} onClick={loadArchivedOrganizations}>
          Թարմացնել արխիվը
        </button>

        {archiveListMessage ? (
          <div style={{ ...styles.previewBox, marginTop: "14px" }}>
            <strong>{archiveListMessage}</strong>
          </div>
        ) : null}

        {archivedOrganizations.length > 0 ? (
          <div style={{ display: "grid", gap: "12px", marginTop: "18px" }}>
            {archivedOrganizations.map((organization) => (
              <article
                key={organization.id}
                style={{
                  ...styles.previewBox,
                  display: "grid",
                  gap: "10px",
                }}
              >
                <div>
                  <strong style={{ fontSize: "18px" }}>{organization.name}</strong>
                  <p style={{ margin: "8px 0" }}>
                    {organization.shortDescription ?? "Նկարագրություն չկա"}
                  </p>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: "10px",
                  }}
                >
                  <small>
                    <strong>ՀՎՀՀ</strong>
                    <br />
                    {organization.taxId ?? "—"}
                  </small>
                  <small>
                    <strong>Սպասարկում</strong>
                    <br />
                    Արխիվացված
                  </small>
                  <small>
                    <strong>Դադարեցման ամսաթիվ</strong>
                    <br />
                    {organization.serviceStoppedAt
                      ? new Date(organization.serviceStoppedAt).toLocaleDateString("hy-AM")
                      : "—"}
                  </small>
                  <small>
                    <strong>Արխիվացման ամսաթիվ</strong>
                    <br />
                    {organization.archivedAt
                      ? new Date(organization.archivedAt).toLocaleDateString("hy-AM")
                      : "—"}
                  </small>
                </div>

                <div style={styles.previewBox}>
                  <strong>Դադարեցման պատճառ</strong>
                  <p style={{ marginBottom: 0 }}>{organization.serviceStopReason ?? "—"}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div style={{ ...styles.previewBox, marginTop: "18px" }}>
            <strong>Արխիվը դատարկ է</strong>
            <p style={{ marginBottom: 0 }}>
              Երբ «Գործող սպասարկում» բաժնից կազմակերպության սպասարկումը դադարեցվի,
              այն կհայտնվի այստեղ։
            </p>
          </div>
        )}
      </section>
    );
  }

  function renderAllOrganizationsPage() {
    return (
      <section style={styles.accountingArea}>
        {archiveTargetOrganization ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Դադարեցնել սպասարկումը և արխիվացնել"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              display: "grid",
              placeItems: "center",
              background: "rgba(0, 0, 0, 0.45)",
              padding: "20px",
            }}
          >
            <div
              style={{
                width: "min(520px, 100%)",
                borderRadius: "18px",
                border: "1px solid #d8c7ad",
                background: "#fffaf2",
                padding: "22px",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)",
              }}
            >
              <strong style={{ display: "block", fontSize: "18px", marginBottom: "10px" }}>
                Դադարեցնել սպասարկումը և արխիվացնել
              </strong>

              <p>
                Կազմակերպությունը չի ջնջվելու DB-ից։ Այն միայն կարխիվացվի և այլևս չի երևա
                գործող սպասարկման հիմնական ցուցակում։
              </p>

              <div style={styles.previewBox}>
                <strong>{archiveTargetOrganization.name}</strong>
                <p style={{ margin: "8px 0 0" }}>
                  ՀՎՀՀ՝ {archiveTargetOrganization.taxId ?? "—"}
                </p>
              </div>

              <label style={{ ...styles.label, marginTop: "14px" }}>
                Պատճառ
                <textarea
                  value={archiveReason}
                  onChange={(event) => {
                    setArchiveReason(event.target.value);
                    setArchiveMessage(null);
                  }}
                  style={{
                    ...styles.input,
                    minHeight: "90px",
                    resize: "vertical",
                  }}
                  placeholder="Օրինակ՝ պայմանագրի ժամկետը ավարտվել է / հաճախորդը դադարեցրել է սպասարկումը"
                />
              </label>

              {archiveMessage ? (
                <div style={{ ...styles.previewBox, marginTop: "14px" }}>
                  <strong>{archiveMessage}</strong>
                </div>
              ) : null}

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "16px" }}>
                <button
                  type="button"
                  style={{
                    ...styles.primaryButton,
                    background: "#7c2d12",
                  }}
                  disabled={isArchivingOrganization}
                  onClick={handleArchiveOrganization}
                >
                  {isArchivingOrganization ? "Արխիվացվում է..." : "Դադարեցնել և արխիվացնել"}
                </button>

                <button
                  type="button"
                  style={{
                    ...styles.primaryButton,
                    background: "#efe4d4",
                    color: "#2b2118",
                  }}
                  disabled={isArchivingOrganization}
                  onClick={closeArchiveOrganizationDialog}
                >
                  Չեղարկել
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <p style={styles.kicker}>Կազմակերպություններ · DEV Master DB</p>
        <h2>Գործող սպասարկում</h2>
        <p>
          Այստեղ երևում են միայն գործող սպասարկման կազմակերպությունները։ Յուրաքանչյուր կազմակերպություն
          ունի կենտրոնական profile էջ։
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            margin: "18px 0",
          }}
        >
          <div style={styles.previewBox}>
            <strong>{allowedOrganizations.length}</strong>
            <p style={{ margin: "6px 0 0" }}>Գործող սպասարկում</p>
          </div>
          <div style={styles.previewBox}>
            <strong>
              {allowedOrganizations.filter((organization) => organization.status === "active").length}
            </strong>
            <p style={{ margin: "6px 0 0" }}>Գործող կարգավիճակով</p>
          </div>
          <div style={styles.previewBox}>
            <strong>
              {
                allowedOrganizations.filter(
                  (organization) => organization.registryCheckStatus === "verified"
                ).length
              }
            </strong>
            <p style={{ margin: "6px 0 0" }}>Ստուգված</p>
          </div>
        </div>

        {allowedOrganizations.length > 0 ? (
          <div style={{ display: "grid", gap: "12px", marginTop: "18px" }}>
            {allowedOrganizations.map((organization) => (
              <article
                key={organization.id}
                style={{
                  ...styles.previewBox,
                  display: "grid",
                  gap: "10px",
                }}
              >
                <div>
                  <strong style={{ fontSize: "18px" }}>{organization.name}</strong>
                  <p style={{ margin: "8px 0" }}>
                    {organization.shortDescription ?? "Նկարագրություն չկա"}
                  </p>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: "10px",
                  }}
                >
                  <small>
                    <strong>Տեսակ</strong>
                    <br />
                    {organization.legalType ?? "—"}
                  </small>
                  <small>
                    <strong>ՀՎՀՀ</strong>
                    <br />
                    {organization.taxId ?? "—"}
                  </small>
                  <small>
                    <strong>Կարգավիճակ</strong>
                    <br />
                    {organization.status ?? "—"}
                  </small>
                  <small>
                    <strong>Սպասարկում</strong>
                    <br />
                    {organization.serviceStatus === "archived" ? "Արխիվացված" : "Սպասարկվում է"}
                  </small>
                  <small>
                    <strong>Ստուգում</strong>
                    <br />
                    {getRegistryCheckLabel(organization.registryCheckStatus)}
                  </small>
                  <small>
                    <strong>Tenant DB demo</strong>
                    <br />
                    {organization.tenantDatabaseName ?? "—"}
                  </small>
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => openOrganizationProfile(organization.id)}
                    style={{
                      ...styles.primaryButton,
                      width: "fit-content",
                    }}
                  >
                    Բացել պրոֆիլը
                  </button>

                  <button
                    type="button"
                    onClick={() => openAccountingWorkspaceForOrganization(organization.id)}
                    style={{
                      ...styles.primaryButton,
                      width: "fit-content",
                      background: "#2b2118",
                    }}
                  >
                    Հաշվապահական տարածք
                  </button>

                  <button
                    type="button"
                    onClick={() => openRegistryCheckPage(organization.id)}
                    style={{
                      ...styles.primaryButton,
                      width: "fit-content",
                      background: "#efe4d4",
                      color: "#2b2118",
                    }}
                  >
                    Ստուգել տվյալները
                  </button>

                  <button
                    type="button"
                    onClick={() => openArchiveOrganizationDialog(organization.id)}
                    style={{
                      ...styles.primaryButton,
                      width: "fit-content",
                      background: "#7c2d12",
                    }}
                  >
                    Դադարեցնել սպասարկումը
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div style={styles.previewBox}>
            <strong>Գործող սպասարկման կազմակերպություններ չկան</strong>
            <p style={{ marginBottom: 0 }}>
              Եթե կազմակերպություն արխիվացվել է, այն այս ցուցակում այլևս չի երևա։
            </p>
          </div>
        )}
      </section>
    );
  }

  function renderNewPartnerForm() {
    const pageLabel = "Նոր գործընկեր գրանցել";
    const tabs = getTabsForDemoPage(pageLabel);
    const activeTab = getActiveTab(pageLabel);
    const activeBookkeeper = activeBookkeeperId
      ? demoEmployees.find((employee) => employee.id === activeBookkeeperId)
      : undefined;

    return (
      <section style={styles.accountingArea}>
        <p style={styles.kicker}>Կազմակերպություններ · Գործողություններ</p>
        <h2>Նոր գործընկեր գրանցել</h2>
        <p>
          Գործընկերը կարող է լինել ՍՊԸ, ԱՁ կամ այլ իրավական սուբյեկտ։
          Այս էջը tabs-երով demo ձև է․ տվյալները չեն պահպանվում, database չկա։
        </p>

        <div style={styles.tabsBar}>
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              style={{
                ...styles.tabButton,
                ...(tab === activeTab ? styles.tabButtonActive : {}),
              }}
              onClick={() => {
                setActiveTabByPage((current) => ({
                  ...current,
                  [pageLabel]: tab,
                }));
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Ընդհանուր տվյալներ" ? (
          <div style={styles.tabPanel}>
            <h3 style={styles.sectionTitle}>Ընդհանուր տվյալներ</h3>
            <div style={styles.formGrid}>
              <label style={styles.label}>
                Գործընկերոջ տեսակ
                <select style={styles.select} defaultValue="">
                  <option value="" disabled>Ընտրել տեսակը</option>
                  <option value="llc">ՍՊԸ</option>
                  <option value="sole">ԱՁ</option>
                  <option value="ngo">ՀԿ</option>
                  <option value="foundation">Հիմնադրամ</option>
                  <option value="other">Այլ</option>
                </select>
              </label>

              <label style={styles.label}>
                Անվանում / ԱՁ անուն ազգանուն
                <input style={styles.input} type="text" placeholder="Օրինակ՝ Արամ Արամյան ԱՁ կամ Example ՍՊԸ" />
              </label>

              <label style={styles.label}>
                Կարճ անվանում
                <input style={styles.input} type="text" placeholder="Օրինակ՝ Example" />
              </label>

              <label style={styles.label}>
                ՀՎՀՀ
                <input style={styles.input} type="text" placeholder="Գործընկերոջ ՀՎՀՀ" />
              </label>

              <label style={styles.label}>
                Գրանցման համար
                <input style={styles.input} type="text" placeholder="Պետական գրանցման համար, եթե կիրառելի է" />
              </label>

              <label style={styles.label}>
                Կարգավիճակ
                <select style={styles.select} defaultValue="draft">
                  <option value="draft">Նախնական</option>
                  <option value="active">Գործող</option>
                  <option value="pending">Սպասման մեջ</option>
                </select>
              </label>

              <label style={styles.label}>
                Իրավաբանական հասցե
                <input style={styles.input} type="text" placeholder="Գործընկերոջ իրավաբանական հասցե" />
              </label>

              <label style={styles.label}>
                Գործունեության հասցե
                <input style={styles.input} type="text" placeholder="Եթե տարբերվում է իրավաբանական հասցեից" />
              </label>

              <label style={styles.label}>
                Տնօրեն / պատասխանատու անձ
                <input style={styles.input} type="text" placeholder="Անուն Ազգանուն" />
              </label>

              <label style={styles.label}>
                Հեռախոս / էլ. հասցե
                <input style={styles.input} type="text" placeholder="+374 ... / example@partner.am" />
              </label>
            </div>
          </div>
        ) : null}

        {activeTab === "Կառուցվածքային ստորաբաժանումներ" ? (
          <div style={styles.tabPanel}>
            <h3 style={styles.sectionTitle}>Կառուցվածքային ստորաբաժանումներ</h3>
            <p>
              Այստեղ նշում ենք գործընկերոջ ներքին բաժինները, որոնք մեզ պետք են սպասարկման և հաշվառման կազմակերպման համար։
            </p>

            <div style={styles.formGrid}>
              <label style={styles.label}>
                Ստորաբաժանման անվանում
                <input style={styles.input} type="text" placeholder="Օրինակ՝ Պահեստ, Վաճառք, Արտադրամաս" />
              </label>

              <label style={styles.label}>
                Ներքին կոդ
                <input style={styles.input} type="text" placeholder="Օրինակ՝ DEP-001" />
              </label>

              <label style={styles.label}>
                Ստորաբաժանման տեսակ
                <select style={styles.select} defaultValue="">
                  <option value="" disabled>Ընտրել տեսակը</option>
                  <option value="management">Ղեկավարում</option>
                  <option value="accounting">Հաշվապահություն</option>
                  <option value="warehouse">Պահեստ</option>
                  <option value="production">Արտադրություն</option>
                  <option value="sales">Վաճառք / մատակարարում</option>
                  <option value="hr">Կադրեր</option>
                  <option value="other">Այլ</option>
                </select>
              </label>

              <label style={styles.label}>
                Վերադաս ստորաբաժանում
                <input style={styles.input} type="text" placeholder="Օրինակ՝ Տնօրինություն" />
              </label>

              <label style={styles.label}>
                Պատասխանատու անձ
                <input style={styles.input} type="text" placeholder="Անուն Ազգանուն" />
              </label>

              <label style={styles.label}>
                Նշում
                <input style={styles.input} type="text" placeholder="Լրացուցիչ պարզաբանում" />
              </label>
            </div>

            <div style={styles.previewBox}>
              <strong>Demo ցանկ</strong>
              <ul>
                <li>Տնօրինություն</li>
                <li>Հաշվապահություն</li>
                <li>Պահեստ</li>
                <li>Վաճառք / սպասարկում</li>
              </ul>
            </div>
          </div>
        ) : null}

        {activeTab === "Սպասարկման նշանակում" ? (
          <div style={styles.tabPanel}>
            <h3 style={styles.sectionTitle}>Սպասարկման նշանակում</h3>
            <p>
              Այստեղ ընտրում ենք Finera-ի աշխատակիցներին և սահմանում ենք,
              թե ով ինչ պատասխանատվության շրջանակ ունի տվյալ սպասարկվող գործընկերոջ համար։
              Սա ապագայում պետք է պահպանվի Master DB-ում։
            </p>

            <div style={styles.formGrid}>
              <label style={styles.label}>
                Սպասարկման սկիզբ
                <CalendarDateField defaultValue={todayInputDate} />
              </label>

              <label style={styles.label}>
                Սպասարկման փաթեթ
                <select style={styles.select} defaultValue="">
                  <option value="" disabled>Ընտրել փաթեթը</option>
                  <option value="basic">Հիմնական հաշվապահական</option>
                  <option value="full">Լիարժեք հաշվապահական</option>
                  <option value="tax">Միայն հարկային հաշվետվություններ</option>
                  <option value="hr">Հաշվապահական + կադրային</option>
                  <option value="custom">Անհատական</option>
                </select>
              </label>

              <label style={styles.label}>
                Պատասխանատու գլխավոր հաշվապահ
                <select style={styles.select} defaultValue="">
                  <option value="" disabled>Ընտրել գլխավոր հաշվապահին</option>
                  {renderEmployeeOptions("chief-accountant")}
                </select>
              </label>

              <label style={styles.label}>
                HR / իրավական պատասխանատու
                <select style={styles.select} defaultValue="">
                  <option value="" disabled>Ընտրել HR/legal պատասխանատուին</option>
                  {renderEmployeeOptions("hr-legal")}
                </select>
              </label>

              <label style={styles.label}>
                Support պատասխանատու
                <select style={styles.select} defaultValue="">
                  <option value="" disabled>Ընտրել support պատասխանատուին</option>
                  {renderEmployeeOptions("support")}
                </select>
              </label>

              <label style={styles.label}>
                Ներքին վերահսկող
                <select style={styles.select} defaultValue="">
                  <option value="" disabled>Ընտրել վերահսկողին</option>
                  {renderEmployeeOptions("controller")}
                </select>
              </label>
            </div>

            <div style={styles.assignmentLayout}>
              <div style={styles.assignmentColumn}>
                <div style={styles.assignmentHeader}>
                  <strong>Հաշվետարների ցանկ</strong>
                  <span>ընտրիր մեկ կամ մի քանի հոգի</span>
                </div>

                <div style={styles.checkboxGrid}>
                  {getEmployeesByRole("bookkeeper").map((employee) => {
                    const isSelected = selectedBookkeeperIds.includes(employee.id);

                    return (
                      <label
                        key={employee.id}
                        style={{
                          ...styles.checkboxCard,
                          ...(isSelected ? styles.checkboxCardActive : {}),
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleBookkeeper(employee.id)}
                        />
                        <span>
                          <strong>{employee.fullName}</strong>
                          <small>
                            {getPositionName(employee.positionId)} · {employee.employeeNumber}
                          </small>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div style={styles.assignmentColumn}>
                <div style={styles.assignmentHeader}>
                  <strong>Պատասխանատվության շրջանակ</strong>
                  <span>
                    {activeBookkeeper ? activeBookkeeper.fullName : "հաշվետար ընտրված չէ"}
                  </span>
                </div>

                {activeBookkeeper ? (
                  <div style={styles.scopeGrid}>
                    {bookkeeperResponsibilityScopes.map((scope) => {
                      const selectedScopes = bookkeeperScopesById[activeBookkeeper.id] ?? [];
                      const isChecked = selectedScopes.includes(scope);

                      return (
                        <label
                          key={scope}
                          style={{
                            ...styles.scopeCard,
                            ...(isChecked ? styles.checkboxCardActive : {}),
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleBookkeeperScope(activeBookkeeper.id, scope)}
                          />
                          <span>{scope}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div style={styles.emptyState}>
                    Սկզբում ձախ կողմից ընտրիր հաշվետարին, հետո այստեղ կնշես նրա պատասխանատվության շրջանակը։
                  </div>
                )}
              </div>
            </div>

            <div style={styles.previewBox}>
              <strong>Master DB demo տրամաբանություն</strong>
              <p>
                Պահպանելիս ապագայում Master DB-ում կգրանցվի՝ որ սպասարկվող գործընկերոջ համար
                որ աշխատակիցներն են նշանակված և յուրաքանչյուրն ինչ աշխատանքների համար է պատասխանատու։
              </p>
              <p style={{ marginBottom: 0 }}>
                Այս տվյալները հետո կարող են օգտագործվել աշխատողների ծանրաբեռնվածությունը և արդյունավետությունը գնահատելու համար։
              </p>
            </div>
          </div>
        ) : null}

        {activeTab === "Պայմանագիր" ? (
          <div style={styles.tabPanel}>
            <h3 style={styles.sectionTitle}>Պայմանագիր</h3>
            <p>
              Այստեղ պահվում են սպասարկման պայմանագրի demo տվյալները։
              Հետագայում այստեղ կարող է լինել պայմանագրի ֆայլ, ժամկետներ և վճարային պայմաններ։
            </p>

            <div style={styles.formGrid}>
              <label style={styles.label}>
                Պայմանագրի համար
                <input style={styles.input} type="text" placeholder="Օրինակ՝ FIN-2026-001" />
              </label>

              <label style={styles.label}>
                Պայմանագրի ամսաթիվ
                <CalendarDateField defaultValue={todayInputDate} />
              </label>

              <label style={styles.label}>
                Սկիզբ
                <CalendarDateField defaultValue={todayInputDate} />
              </label>

              <label style={styles.label}>
                Ավարտ / վերանայման ժամկետ
                <CalendarDateField defaultValue={todayInputDate} />
              </label>

              <label style={styles.label}>
                Ամսական սպասարկման վճար
                <input style={styles.input} type="text" placeholder="Օրինակ՝ 150,000 AMD" />
              </label>

              <label style={styles.label}>
                Վճարման պայման
                <select style={styles.select} defaultValue="">
                  <option value="" disabled>Ընտրել պայմանը</option>
                  <option value="prepaid">Կանխավճար</option>
                  <option value="monthly">Ամսական վճարում</option>
                  <option value="postpaid">Հետվճարում</option>
                  <option value="custom">Անհատական պայման</option>
                </select>
              </label>

              <label style={styles.label}>
                Ծառայությունների շրջանակ
                <input style={styles.input} type="text" placeholder="Օրինակ՝ հաշվապահություն, հարկային, կադրեր" />
              </label>

              <label style={styles.label}>
                Պայմանագրի կարգավիճակ
                <select style={styles.select} defaultValue="draft">
                  <option value="draft">Նախագիծ</option>
                  <option value="signed">Ստորագրված</option>
                  <option value="active">Գործող</option>
                  <option value="ended">Ավարտված</option>
                </select>
              </label>
            </div>
          </div>
        ) : null}

        <div style={styles.formActions}>
          <button style={styles.primaryButton} type="button">
            Պահպանել demo
          </button>
          <p style={styles.mutedNotice}>Demo կոճակ է․ այս պահին ոչինչ չի պահպանում։</p>
        </div>
      </section>
    );
  }



  function getTabsForDemoPage(pageLabel: string) {
    if (pageLabel === "Նորություններ") {
      return ["Օրվա ամփոփում", "Ոլորտներ", "Պաշտոնական աղբյուրներ", "AI հսկողություն"];
    }

    if (pageLabel === "Գործընկերներ") {
      return ["Ընդհանուր", "Ցանկ", "Գործողություններ", "Հաշվետվություններ"];
    }

    if (pageLabel === "Նոր գործընկեր գրանցել") {
      return ["Ընդհանուր տվյալներ", "Կառուցվածքային ստորաբաժանումներ", "Սպասարկման նշանակում", "Պայմանագիր"];
    }

    if (pageLabel === "Մեր կազմակերպությունը") {
      return ["Ընդհանուր տվյալներ", "Աշխատակիցներ", "Բաժիններ", "Իրավական տվյալներ", "Կոնտակտներ", "Բանկային տվյալներ"];
    }

    if (pageLabel === "Դրամարկղ") {
      return ["Ընդհանուր", "Գործառնություններ", "Հաշվետվություններ", "Կարգավորումներ"];
    }

    return ["Ընդհանուր", "Տվյալներ", "Գործողություններ", "Հաշվետվություններ"];
  }



  function getActiveTab(pageLabel: string) {
    const tabs = getTabsForDemoPage(pageLabel);
    return activeTabByPage[pageLabel] ?? tabs[0] ?? "";
  }

  function renderTabs(pageLabel: string) {
    const tabs = getTabsForDemoPage(pageLabel);
    const activeTab = getActiveTab(pageLabel);

    return (
      <>
        <div style={styles.tabsBar}>
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              style={{
                ...styles.tabButton,
                ...(tab === activeTab ? styles.tabButtonActive : {}),
              }}
              onClick={() => {
                setActiveTabByPage((current) => ({
                  ...current,
                  [pageLabel]: tab,
                }));
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={styles.tabPanel}>
          <strong>{activeTab}</strong>
          <p>
            Սա demo tab բովանդակություն է «{pageLabel}» բաժնի համար։
            Հետո այս հատվածում կավելացնենք կոնկրետ դաշտերը, աղյուսակները կամ հաշվետվությունները։
          </p>
        </div>
      </>
    );
  }

  function renderLegalNewsPage() {
    const pageLabel = "Նորություններ";
    const tabs = getTabsForDemoPage(pageLabel);
    const activeTab = getActiveTab(pageLabel);

    return (
      <section style={styles.accountingArea}>
        <p style={styles.kicker}>Գլխավոր մենյու</p>
        <h2>Նորություններ</h2>
        <p>
          Այս բաժինը demo է․ ապագայում AI-ն օրական կստուգի պաշտոնական օրենսդրական և ոլորտային նորությունները
          և կցույց տա միայն այն ազդակները, որոնք կարող են ազդել սպասարկվող գործընկերների հաշվապահության վրա։
        </p>

        <div style={styles.tabsBar}>
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              style={{
                ...styles.tabButton,
                ...(tab === activeTab ? styles.tabButtonActive : {}),
              }}
              onClick={() => {
                setActiveTabByPage((current) => ({
                  ...current,
                  [pageLabel]: tab,
                }));
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Օրվա ամփոփում" ? (
          <div style={styles.tabPanel}>
            <h3 style={styles.sectionTitle}>Օրվա ամփոփում</h3>
            <div style={styles.cardsGrid}>
              <div style={styles.smallCard}>
                <strong>Գյուղմթերքներ</strong>
                <p>
                  AI-ն ապագայում կստուգի գյուղատնտեսական մթերքների գնման, վաճառքի,
                  փաստաթղթավորման և հարկային ռեժիմների նորությունները։
                </p>
              </div>

              <div style={styles.smallCard}>
                <strong>Գինու արտադրություն</strong>
                <p>
                  AI-ն կհետևի արտադրության, ակցիզային, մակնշման, թույլտվությունների և հարկային ազդակներին։
                </p>
              </div>

              <div style={styles.smallCard}>
                <strong>Հիվանդանոց / բժշկական ծառայություններ</strong>
                <p>
                  AI-ն կհետևի բժշկական ծառայությունների, պայմանագրերի, աշխատավարձի և հաշվետվությունների փոփոխություններին։
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === "Ոլորտներ" ? (
          <div style={styles.tabPanel}>
            <h3 style={styles.sectionTitle}>Ոլորտներ</h3>
            <div style={styles.checkboxGrid}>
              {["Գյուղմթերքներ", "Գինու արտադրություն", "Հիվանդանոց / բժշկական ծառայություններ", "Արտադրություն", "Առևտուր", "Շինարարություն", "Ծառայություններ"].map((sector) => (
                <label key={sector} style={styles.checkboxCard}>
                  <input type="checkbox" />
                  <span>
                    <strong>{sector}</strong>
                    <small>ոլորտային demo ֆիլտր</small>
                  </span>
                </label>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === "Պաշտոնական աղբյուրներ" ? (
          <div style={styles.tabPanel}>
            <h3 style={styles.sectionTitle}>Պաշտոնական աղբյուրներ</h3>
            <div style={styles.cardsGrid}>
              {[
                "Պաշտոնական օրենսդրական հրապարակումներ",
                "Պետական մարմինների հայտարարություններ",
                "Հարկային և մաքսային ոլորտի պաշտոնական նորություններ",
                "Կառավարության որոշումներ և նախագծեր",
                "Ոլորտային կարգավորող մարմինների հրապարակումներ",
              ].map((source) => (
                <div key={source} style={styles.smallCard}>
                  <strong>{source}</strong>
                  <p>Production փուլում այստեղ կլինի աղբյուրի հասցեն, ստուգման հաճախականությունը և վերջին ստուգման ամսաթիվը։</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === "AI հսկողություն" ? (
          <div style={styles.tabPanel}>
            <h3 style={styles.sectionTitle}>AI հսկողություն</h3>
            <div style={styles.formGrid}>
              <label style={styles.label}>
                Ստուգման հաճախականություն
                <select style={styles.select} defaultValue="daily">
                  <option value="daily">Ամեն օր</option>
                  <option value="weekly">Շաբաթական</option>
                  <option value="manual">Միայն ձեռքով</option>
                </select>
              </label>

              <label style={styles.label}>
                Մարդու հաստատում
                <select style={styles.select} defaultValue="required">
                  <option value="required">Պարտադիր է</option>
                  <option value="optional">Ըստ անհրաժեշտության</option>
                </select>
              </label>
            </div>

            <div style={styles.previewBox}>
              <strong>Անվտանգության կանոն</strong>
              <p style={{ marginBottom: 0 }}>
                AI-ն միայն կարդում, դասակարգում և ամփոփում է նորությունները։
                Իրավական կամ հարկային գործողություն ինքնուրույն չի կատարում։
              </p>
            </div>
          </div>
        ) : null}
      </section>
    );
  }

  function renderMainContent() {
    if (!loggedInUser) {
      return null;
    }


    if (activeDemoPage === "Կառուցվածքային ստորաբաժանումներ") {
      return renderStructuralUnitsForm();
    }

    if (activeDemoPage === "Մեր կազմակերպությունը") {
      return renderOurCompanyForm();
    }

    if (activeDemoPage === "Ընտրել կազմակերպություն") {
      return renderOrganizationPickerForAccounting();
    }

    if (activeDemoPage === "Կազմակերպության տվյալների ստուգում") {
      return renderRegistryCheckPage();
    }

    if (activeDemoPage === "Պաշտոններ") {
      return renderPositionsPage();
    }

    if (activeDemoPage === "Աշխատանքի ընդունում") {
      return renderHireEmployeePage();
    }

    if (activeDemoPage === "Աշխատակիցների ցանկ" || activeDemoPage === "Finera-ի աշխատակիցներ") {
      return renderEmployeesListPage();
    }

    if (activeDemoPage === "Կազմակերպության պրոֆիլ") {
      return renderOrganizationProfilePage();
    }

    if (activeDemoPage === "Կազմակերպությունների արխիվ") {
      return renderOrganizationsArchivePage();
    }

    if (activeDemoPage === "Գործող սպասարկում") {
      return renderAllOrganizationsPage();
    }

    if (activeDemoPage === "Ընտրել կազմակերպություն") {
      return renderOrganizationPickerForAccounting();
    }

    if (activeDemoPage === "Նոր գործընկեր գրանցել") {
      return renderNewPartnerRegistrationWizard();
    }

    if (activeDemoPage === "Նորություններ") {
      return renderLegalNewsPage();
    }

    if (activeDemoPage) {
      return (
        <section style={styles.accountingArea}>
          <p style={styles.kicker}>Ընտրված բաժին</p>
          <h2>{activeDemoPage}</h2>
          {renderTabs(activeDemoPage)}
          <p>
            Այս բաժնի աշխատանքային էջը դեռ placeholder է։
            Հետո այստեղ կավելացնենք կոնկրետ ձևերը, ցուցակները կամ հաշվետվությունները։
          </p>
        </section>
      );
    }

    return (
      <>
        <div style={styles.grid}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Օգտատեր</h2>
            <p><strong>{loggedInUser.name}</strong></p>
            <p>{loggedInUser.role}</p>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Dashboard-ի իմաստը</h2>
            <p>{loggedInUser.description}</p>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Թույլատրված սպասարկվող գործընկերներ</h2>
            <ul>
              {loggedInUser.organizations.map((organization) => (
                <li key={organization}>{organization}</li>
              ))}
            </ul>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Թույլատրված մոդուլներ</h2>
            <ul>
              {loggedInUser.allowedModules.map((module) => (
                <li key={module}>{module}</li>
              ))}
            </ul>
          </div>
        </div>

        <section style={styles.accountingArea}>
          <h2>Սպասարկվող գործընկերոջ ընտրություն</h2>

          {allowedOrganizations.length > 0 ? (
            <>
              <label style={styles.label} htmlFor="organization">
                Ընտրիր հասանելի սպասարկվող գործընկերոջը
              </label>

              <select
                id="organization"
                value={selectedOrganization?.id ?? ""}
                onChange={(event) => setSelectedOrganizationId(event.target.value)}
                style={styles.select}
              >
                <option value="">Ընտրել կազմակերպություն</option>
                {allowedOrganizations.map((organization) => (
                  <option key={organization.id} value={organization.id}>
                    {organization.name}
                  </option>
                ))}
              </select>

              {selectedOrganization ? (
                <div style={styles.previewBox}>
                  <strong>{selectedOrganization.name}</strong>
                  <p style={{ marginBottom: "8px" }}>{selectedOrganization.shortDescription}</p>
                  <small>
                    ՀՎՀՀ demo: {selectedOrganization.taxId} · tenant DB demo:{" "}
                    {selectedOrganization.tenantDatabaseName}
                  </small>
                </div>
              ) : null}
            </>
          ) : (
            <p>
              Այս դերը կապված չէ կոնկրետ սպասարկվող գործընկերոջ հետ։ Օրինակ՝ տեխնիկական թիմը տեսնում է system-level dashboard։
            </p>
          )}
        </section>

        <section style={styles.accountingArea}>
          <h2>Master registry demo</h2>
          <p>{masterDatabaseNote}</p>

          <div style={{ display: "grid", gap: "12px", marginTop: "18px" }}>
            {organizations.map((organization) => (
              <div
                key={organization.id}
                style={{
                  padding: "16px",
                  borderRadius: "14px",
                  border: "1px solid #e3d8c7",
                  background: "#f7f3ea",
                }}
              >
                <strong>{organization.name}</strong>
                <p style={{ margin: "8px 0" }}>{organization.shortDescription}</p>
                <small>
                  ՀՎՀՀ demo: {organization.taxId} · status: {organization.status} · tenant DB demo:{" "}
                  {organization.tenantDatabaseName}
                </small>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.accountingArea}>
          <h2>Հաշվապահական տարածք</h2>
          <p>
            Այստեղ ապագայում կբացվի իրական accounting workspace-ը՝ ձախ menu-ով,
            կազմակերպության ընտրությամբ և դերով սահմանափակված հասանելիությամբ։
          </p>
          <p>
            Այս փուլում սա միայն placeholder է․ իրական database և իրական գրանցումներ չկան։
          </p>
        </section>
      </>
    );
  }

  return (
    <main style={styles.appShell}>
      <aside style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Finera</h2>
        <p style={styles.sidebarSmall}>Accounting app</p>

          <nav style={styles.menu}>
            {activeMenuTitle ? (
              <>
                <div style={styles.menuSectionTitle}>
                  {activeMenuPath.map((item) => item.label).join(" / ")}
                </div>

                {renderMenuItems(visibleMenuItems)}

                <div style={styles.menuBackActions}>
                  {activeMenuPath.length > 1 ? (
                    <button
                      style={styles.backMenuButton}
                      onClick={() => {
                        setActiveMenuPath((current) => current.slice(0, -1));
                        setActiveDemoPage(null);
                      }}
                    >
                      ← Նախորդ մենյու
                    </button>
                  ) : null}

                  <button
                    style={styles.backMenuButton}
                    onClick={() => {
                      setActiveMenuPath([]);
                      setActiveDemoPage(null);
                    }}
                  >
                    ← Գլխավոր մենյու
                  </button>
                </div>
              </>
            ) : (
              renderMenuItems(visibleMenuItems)
            )}
          </nav>
      </aside>

      <section style={styles.content}>
        <header style={styles.header}>
          <div>
            <p style={styles.kicker}>Demo dashboard</p>
            <h1 style={styles.dashboardTitle}>Ֆինեռա հաշվապահական</h1>
          </div>

          <button
            style={styles.secondaryButton}
            onClick={() => {
              setLoggedInUserId(null);
              setActiveMenuPath([]);
              setActiveDemoPage(null);
                      }}
          >
            Դուրս գալ
          </button>
        </header>

        {renderMainContent()}
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "48px",
    fontFamily: "Arial, sans-serif",
    background: "#f7f3ea",
    color: "#172033",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  kicker: {
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontSize: "13px",
    color: "#7a5a2f",
  },
  title: {
    fontSize: "48px",
    margin: "16px 0",
    lineHeight: 1.1,
  },
  text: {
    fontSize: "20px",
    maxWidth: "760px",
    lineHeight: 1.6,
  },
  loginCard: {
    marginTop: "36px",
    padding: "28px",
    background: "#ffffff",
    borderRadius: "22px",
    border: "1px solid #e3d8c7",
    maxWidth: "560px",
  },
  cardTitle: {
    marginTop: 0,
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: 700,
  },
  select: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #c9bda9",
    fontSize: "16px",
  },
  previewBox: {
    marginTop: "18px",
    padding: "16px",
    background: "#f7f3ea",
    borderRadius: "14px",
  },
  primaryButton: {
    marginTop: "18px",
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "none",
    background: "#172033",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
  },
  appShell: {
    minHeight: "100vh",
    display: "flex",
    fontFamily: "Arial, sans-serif",
    background: "#f7f3ea",
    color: "#172033",
  },
  sidebar: {
    width: "280px",
    padding: "28px",
    background: "#172033",
    color: "#ffffff",
  },
  sidebarTitle: {
    margin: 0,
    fontSize: "30px",
  },
  sidebarSmall: {
    color: "#d9c7aa",
  },
  menu: {
    display: "grid",
    gap: "10px",
    marginTop: "32px",
  },
  menuSectionTitle: {
    padding: "12px",
    borderRadius: "14px",
    background: "rgba(217,199,170,0.14)",
    color: "#f6e7cc",
    fontWeight: 800,
    textAlign: "center",
    border: "1px solid rgba(217,199,170,0.22)",
  },
  backMenuButton: {
    width: "100%",
    marginTop: "18px",
    textAlign: "left",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid rgba(217,199,170,0.28)",
    background: "rgba(217,199,170,0.12)",
    color: "#f6e7cc",
    cursor: "pointer",
    fontWeight: 700,
  },
  menuItem: {
    textAlign: "left",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.06)",
    color: "#ffffff",
    cursor: "pointer",
  },
  submenuItem: {
    width: "100%",
    textAlign: "left",
    padding: "10px 12px",
    borderRadius: "11px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.10)",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
  },
  content: {
    flex: 1,
    padding: "36px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },
  dashboardTitle: {
    fontSize: "40px",
    margin: "10px 0 0",
  },
  secondaryButton: {
    padding: "12px 18px",
    borderRadius: "12px",
    border: "1px solid #172033",
    background: "transparent",
    color: "#172033",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px",
    marginTop: "28px",
  },
  card: {
    padding: "22px",
    background: "#ffffff",
    borderRadius: "18px",
    border: "1px solid #e3d8c7",
  },
  accountingArea: {
    marginTop: "28px",
    padding: "28px",
    background: "#ffffff",
    borderRadius: "22px",
    border: "1px solid #e3d8c7",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
    marginTop: "22px",
  },
  input: {
    width: "100%",
    marginTop: "8px",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #d5c7b5",
    background: "#fffaf2",
    color: "#172033",
    fontSize: "15px",
    boxSizing: "border-box",
  },
  formActions: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginTop: "22px",
    flexWrap: "wrap",
  },
  mutedNotice: {
    margin: 0,
    color: "#7a6a55",
    fontSize: "14px",
  },

  tabsBar: {
    display: "flex",
    alignItems: "flex-end",
    gap: "0",
    marginTop: "20px",
    borderBottom: "3px solid #27a9d8",
    overflowX: "auto",
  },
  tabButton: {
    minWidth: "170px",
    padding: "12px 20px",
    borderWidth: "1px 1px 0 1px",
    borderStyle: "solid",
    borderColor: "#d8cbb8",
    borderRadius: "14px 14px 0 0",
    background: "#f7f3ea",
    color: "#172033",
    fontWeight: 700,
    cursor: "pointer",
    marginRight: "4px",
    transition: "background 160ms ease, border-color 160ms ease, transform 160ms ease",
  },
  tabButtonActive: {
    background: "#fffaf2",
    borderColor: "#b89b68",
    transform: "translateY(1px)",
    boxShadow: "0 -2px 10px rgba(0,0,0,0.06)",
  },
  tabPanel: {
    padding: "20px",
    border: "1px solid #e3d8c7",
    borderTop: "0",
    borderRadius: "0 0 16px 16px",
    background: "#fffaf2",
    lineHeight: 1.6,
  },

  sectionTitle: {
    marginTop: 0,
    marginBottom: "14px",
    fontSize: "20px",
    color: "#172033",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "12px",
    margin: "18px 0",
  },
  statCard: {
    display: "grid",
    gap: "4px",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #e3d8c7",
    background: "#f7f3ea",
  },

  tableWrap: {
    width: "100%",
    overflowX: "auto",
    marginTop: "18px",
    borderRadius: "14px",
    border: "1px solid #e3d8c7",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "900px",
    background: "#fffaf2",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    borderBottom: "1px solid #e3d8c7",
    background: "#f7f3ea",
    fontSize: "13px",
    color: "#5f513f",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #eee2d0",
    verticalAlign: "top",
    fontSize: "14px",
  },
  cellNote: {
    display: "block",
    marginTop: "4px",
    color: "#7a6a55",
    lineHeight: 1.4,
  },

  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
    marginTop: "18px",
  },
  smallCard: {
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid #e3d8c7",
    background: "#f7f3ea",
    lineHeight: 1.5,
  },

  fullWidthField: {
    gridColumn: "1 / -1",
  },

  assignmentHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "center",
    marginBottom: "10px",
    color: "#172033",
  },

  checkboxGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "12px",
  },
  checkboxCard: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
    padding: "12px",
    borderRadius: "14px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#e3d8c7",
    background: "#f7f3ea",
    cursor: "pointer",
    lineHeight: 1.4,
  },

  assignmentLayout: {
    display: "grid",
    gridTemplateColumns: "minmax(280px, 0.9fr) minmax(320px, 1.1fr)",
    gap: "18px",
    marginTop: "22px",
  },
  assignmentColumn: {
    padding: "16px",
    borderRadius: "16px",
    border: "1px solid #e3d8c7",
    background: "#fffaf2",
  },

  checkboxCardActive: {
    borderColor: "#b89b68",
    background: "#fff3d8",
    boxShadow: "0 6px 18px rgba(97, 71, 35, 0.10)",
  },

  scopeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "10px",
  },
  scopeCard: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    padding: "12px",
    borderRadius: "14px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#e3d8c7",
    background: "#f7f3ea",
    cursor: "pointer",
  },

  emptyState: {
    padding: "18px",
    borderRadius: "14px",
    border: "1px dashed #d5c7b5",
    background: "#f7f3ea",
    color: "#7a6a55",
    lineHeight: 1.6,
  },

  menuBackActions: {
    display: "grid",
    gap: "10px",
    marginTop: "14px",
  },

};
