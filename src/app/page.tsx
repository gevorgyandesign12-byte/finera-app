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
  }

  function toggleMenu(label: string) {
    setOpenMenuLabels((current) => ({
      ...current,
      [label]: !current[label],
    }));
  }

  function renderMenuItems(items: DemoMenuItem[], level = 0) {
    return items.map((item) => {
      const isOpen = Boolean(openMenuLabels[item.label]);
      const hasChildren = Boolean(item.children?.length);

      return (
        <div key={item.label}>
          <button
            style={level === 0 ? styles.menuItem : styles.submenuItem}
            title={item.note}
            onClick={() => hasChildren && toggleMenu(item.label)}
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

  return (
    <main style={styles.appShell}>
      <aside style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Finera</h2>
        <p style={styles.sidebarSmall}>Accounting app</p>

          <nav style={styles.menu}>
            {renderMenuItems(menuItems)}
          </nav>
      </aside>

      <section style={styles.content}>
        <header style={styles.header}>
          <div>
            <p style={styles.kicker}>Demo dashboard</p>
            <h1 style={styles.dashboardTitle}>Ֆինեռա հաշվապահական</h1>
          </div>

          <button style={styles.secondaryButton} onClick={() => setLoggedInUserId(null)}>
            Դուրս գալ
          </button>
        </header>

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
            <h2 style={styles.cardTitle}>Թույլատրված կազմակերպություններ</h2>
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
          <h2>Կազմակերպության ընտրություն</h2>

          {allowedOrganizations.length > 0 ? (
            <>
              <label style={styles.label} htmlFor="organization">
                Ընտրիր հասանելի կազմակերպությունը
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
              Այս դերը կապված չէ կոնկրետ client organization-ի հետ։ Օրինակ՝ տեխնիկական թիմը տեսնում է system-level dashboard։
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
  menuItem: {
    textAlign: "left",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.06)",
    color: "#ffffff",
    cursor: "pointer",
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
};
