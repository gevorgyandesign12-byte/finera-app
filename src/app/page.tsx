"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { demoUsers, type DemoUser } from "@/lib/demo-data";
import { demoOrganizations, masterDatabaseNote } from "@/lib/demo-organizations";
import { demoMenuByRole, type DemoMenuItem } from "@/lib/demo-menu";

function getAllowedDemoOrganizations(user: DemoUser) {
  if (user.organizations.includes("System / Infrastructure")) {
    return [];
  }

  return demoOrganizations.filter((organization) =>
    user.organizations.includes(organization.name)
  );
}

export default function Home() {
  const [selectedUserId, setSelectedUserId] = useState(demoUsers[0].id);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("");
  const [openMenuLabels, setOpenMenuLabels] = useState<Record<string, boolean>>({});
  const [activeMenuItem, setActiveMenuItem] = useState<DemoMenuItem | null>(null);
  const [activeDemoPage, setActiveDemoPage] = useState<string | null>(null);
  const [activeTabByPage, setActiveTabByPage] = useState<Record<string, string>>({});

  const selectedUser = demoUsers.find((user) => user.id === selectedUserId) ?? demoUsers[0];
  const loggedInUser = demoUsers.find((user) => user.id === loggedInUserId);
  const allowedOrganizations = loggedInUser ? getAllowedDemoOrganizations(loggedInUser) : [];
  const menuItems = loggedInUser ? demoMenuByRole[loggedInUser.id] ?? [] : [];
  const selectedOrganization =
    allowedOrganizations.find((organization) => organization.id === selectedOrganizationId) ??
    allowedOrganizations[0];

  function handleDemoLogin() {
    const allowed = getAllowedDemoOrganizations(selectedUser);
    setLoggedInUserId(selectedUser.id);
    setSelectedOrganizationId(allowed[0]?.id ?? "");
    setOpenMenuLabels({});
    setActiveMenuItem(null);
    setActiveDemoPage(null);
  }

  function toggleMenu(label: string) {
    setOpenMenuLabels((current) => ({
      ...current,
      [label]: !current[label],
    }));
  }

  function renderMenuItems(items: DemoMenuItem[], level = 0, allowDrillDown = false) {
    return items.map((item) => {
      const isOpen = Boolean(openMenuLabels[item.label]);
      const hasChildren = Boolean(item.children?.length);

      return (
        <div key={item.label}>
          <button
            style={level === 0 ? styles.menuItem : styles.submenuItem}
            title={item.note}
            onClick={() => {
              if (!hasChildren) {
                setActiveDemoPage(item.label);
                setActiveTabByPage((current) => ({
                  ...current,
                  [item.label]: current[item.label] ?? getTabsForDemoPage(item.label)[0] ?? "",
                }));
                return;
              }

              if (allowDrillDown && level === 0) {
                setActiveMenuItem(item);
                setActiveDemoPage(null);
                setOpenMenuLabels({});
                return;
              }

              toggleMenu(item.label);
            }}
          >
            <span style={{ display: "flex", justifyContent: "space-between", gap: "10px", fontWeight: 700 }}>
              <span>{item.label}</span>
              {hasChildren ? <span>{isOpen ? "▾" : "▸"}</span> : null}
            </span>
            {level === 0 ? (
              <small style={{ display: "block", marginTop: "4px", color: "#d9c7aa", lineHeight: 1.4 }}>
                {item.note}
              </small>
            ) : null}
          </button>

          {hasChildren ? (
            <div
              style={{
                display: "grid",
                gap: "7px",
                margin: isOpen ? "10px 0 6px 14px" : "0 0 0 14px",
                padding: isOpen ? "10px" : "0 10px",
                maxHeight: isOpen ? "900px" : "0px",
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? "translateY(0)" : "translateY(-6px)",
                overflow: "hidden",
                borderRadius: "16px",
                border: isOpen ? "1px solid rgba(255,255,255,0.10)" : "1px solid transparent",
                background: level === 0 ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.035)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                transition: "max-height 260ms ease, opacity 190ms ease, transform 190ms ease, margin 190ms ease, padding 190ms ease, border-color 190ms ease",
                pointerEvents: isOpen ? "auto" : "none",
              }}
            >
              {renderMenuItems(item.children ?? [], level + 1)}
            </div>
          ) : null}
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
    return (
      <section style={styles.accountingArea}>
        <p style={styles.kicker}>Գլխավոր մենյու</p>
        <h2>Մեր կազմակերպությունը</h2>
        <p>
          Այստեղ պահվում են Finera/Sose-ի սեփական իրավաբանական և գործառնական demo տվյալները։
          Այս փուլում տվյալները չեն պահպանվում, database չկա։
        </p>

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
            Գրանցման համար
            <input style={styles.input} type="text" placeholder="Մեր պետական գրանցման համարը" />
          </label>

          <label style={styles.label}>
            Իրավաբանական հասցե
            <input style={styles.input} type="text" placeholder="Մեր իրավաբանական հասցեն" />
          </label>

          <label style={styles.label}>
            Գործունեության հասցե
            <input style={styles.input} type="text" placeholder="Մեր գրասենյակի կամ գործունեության հասցեն" />
          </label>

          <label style={styles.label}>
            Տնօրեն
            <input style={styles.input} type="text" placeholder="Անուն Ազգանուն" />
          </label>

          <label style={styles.label}>
            Հեռախոս / էլ. հասցե
            <input style={styles.input} type="text" placeholder="+374 ... / email" />
          </label>
        </div>

        <div style={styles.formActions}>
          <button style={styles.primaryButton} type="button">
            Պահպանել demo
          </button>
          <p style={styles.mutedNotice}>Demo կոճակ է․ այս պահին ոչինչ չի պահպանում։</p>
        </div>
      </section>
    );
  }

  function renderNewPartnerForm() {
    return (
      <section style={styles.accountingArea}>
        <p style={styles.kicker}>Սպասարկվող գործընկերներ · Գործողություններ</p>
        <h2>Նոր գործընկեր գրանցել</h2>
        <p>
          Այստեղ լրացվում են նոր սպասարկվող գործընկերոջ տվյալները։
          Գործընկերը կարող է լինել ՍՊԸ, ԱՁ կամ այլ իրավական սուբյեկտ։
          Այս փուլում սա միայն demo ձև է, database չկա։
        </p>

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
            ՀՎՀՀ
            <input style={styles.input} type="text" placeholder="Գործընկերոջ ՀՎՀՀ" />
          </label>

          <label style={styles.label}>
            Գրանցման համար
            <input style={styles.input} type="text" placeholder="Պետական գրանցման համար, եթե կիրառելի է" />
          </label>

          <label style={styles.label}>
            Իրավաբանական հասցե
            <input style={styles.input} type="text" placeholder="Գործընկերոջ իրավաբանական հասցե" />
          </label>

          <label style={styles.label}>
            Գործունեության հասցե
            <input style={styles.input} type="text" placeholder="Գործունեության իրական հասցե, եթե տարբերվում է" />
          </label>

          <label style={styles.label}>
            Տնօրեն / պատասխանատու անձ
            <input style={styles.input} type="text" placeholder="Անուն Ազգանուն" />
          </label>

          <label style={styles.label}>
            Հեռախոս
            <input style={styles.input} type="text" placeholder="+374 ..." />
          </label>

          <label style={styles.label}>
            Էլ. հասցե
            <input style={styles.input} type="email" placeholder="example@partner.am" />
          </label>

          <label style={styles.label}>
            Սպասարկման սկիզբ
            <input style={styles.input} type="date" />
          </label>

          <label style={styles.label}>
            Պատասխանատու գլխավոր հաշվապահ
            <input style={styles.input} type="text" placeholder="Finera-ի պատասխանատու անձը" />
          </label>

          <label style={styles.label}>
            Սպասարկման կարգավիճակ
            <select style={styles.select} defaultValue="active">
              <option value="active">Գործող</option>
              <option value="pending">Սպասման մեջ</option>
              <option value="paused">Ժամանակավոր դադարեցված</option>
            </select>
          </label>
        </div>

        <div style={styles.formActions}>
          <button style={styles.primaryButton} type="button">
            Գրանցել demo
          </button>
          <p style={styles.mutedNotice}>Demo կոճակ է․ այս պահին ոչինչ չի պահպանում։</p>
        </div>
      </section>
    );
  }

  function getTabsForDemoPage(pageLabel: string) {
    if (pageLabel === "Գործընկերներ") {
      return ["Ընդհանուր", "Ցանկ", "Գործողություններ", "Հաշվետվություններ"];
    }

    if (pageLabel === "Նոր գործընկեր գրանցել") {
      return [
        "Հիմնական տվյալներ",
        "Իրավական տվյալներ",
        "Հասցեներ",
        "Կոնտակտներ",
        "Սպասարկման տվյալներ",
        "Պատասխանատուներ",
      ];
    }

    if (pageLabel === "Մեր կազմակերպությունը") {
      return ["Հիմնական տվյալներ", "Իրավական տվյալներ", "Հասցեներ", "Կոնտակտներ", "Բանկային տվյալներ", "Պատասխանատուներ"];
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

    if (activeDemoPage === "Նոր գործընկեր գրանցել") {
      return renderNewPartnerForm();
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
            {demoOrganizations.map((organization) => (
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
            {activeMenuItem ? (
              <>
                <div style={styles.menuSectionTitle}>
                  {activeMenuItem.label}
                </div>

                {renderMenuItems(activeMenuItem.children ?? [])}

                <button
                  style={styles.backMenuButton}
                  onClick={() => {
                    setActiveMenuItem(null);
                    setActiveDemoPage(null);
                    setOpenMenuLabels({});
                  }}
                >
                  ← Գլխավոր մենյու
                </button>
              </>
            ) : (
              renderMenuItems(menuItems, 0, true)
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
              setActiveMenuItem(null);
              setActiveDemoPage(null);
              setOpenMenuLabels({});
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
    border: "1px solid #d8cbb8",
    borderBottom: "0",
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

};
