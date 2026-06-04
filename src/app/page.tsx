"use client";

import { useState } from "react";

const demoUsers = [
  {
    id: "manager",
    name: "Demo Manager",
    role: "Կառավարիչներ / Managers",
    description: "Տեսնում է ամբողջ համակարգի ընդհանուր վիճակը։",
    organizations: ["Արարատ ՍՊԸ", "Լոռի Թրեյդ ՍՊԸ", "Սյունիք Արտադրություն ՍՊԸ"],
  },
  {
    id: "chief-accountant",
    name: "Demo Chief Accountant",
    role: "Գլխավոր հաշվապահ",
    description: "Տեսնում է միայն իրեն վստահված կազմակերպությունները։",
    organizations: ["Արարատ ՍՊԸ", "Լոռի Թրեյդ ՍՊԸ"],
  },
  {
    id: "bookkeeper",
    name: "Demo Bookkeeper",
    role: "Հաշվետար / Bookkeeper",
    description: "Տեսնում է միայն թույլատրված կազմակերպությունները և մոդուլները։",
    organizations: ["Արարատ ՍՊԸ"],
  },
  {
    id: "client",
    name: "Demo Client Organization",
    role: "Գործընկեր կազմակերպություն",
    description: "Տեսնում է միայն իր կազմակերպության dashboard/report վիճակը։",
    organizations: ["Արարատ ՍՊԸ"],
  },
  {
    id: "hr-legal",
    name: "Demo HR / Legal",
    role: "Կադրային / իրավաբանական բաժին",
    description: "Աշխատում է աշխատակիցների, պայմանագրերի, արձակուրդների և ազատումների հետ։",
    organizations: ["Արարատ ՍՊԸ", "Լոռի Թրեյդ ՍՊԸ"],
  },
  {
    id: "support",
    name: "Demo Support",
    role: "Սպասարկող բաժին",
    description: "Ստանում և դասակարգում է գործընկերների հարցումները։",
    organizations: ["Արարատ ՍՊԸ", "Լոռի Թրեյդ ՍՊԸ", "Սյունիք Արտադրություն ՍՊԸ"],
  },
  {
    id: "tech",
    name: "Demo Technical Team",
    role: "Ծրագրավորողներ / տեխնիկական թիմ",
    description: "Տեսնում է technical dashboard՝ uptime, logs, errors, deployments, backups։",
    organizations: ["System / Infrastructure"],
  },
];

export default function Home() {
  const [selectedUserId, setSelectedUserId] = useState(demoUsers[0].id);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

  const selectedUser = demoUsers.find((user) => user.id === selectedUserId) ?? demoUsers[0];
  const loggedInUser = demoUsers.find((user) => user.id === loggedInUserId);

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

            <button style={styles.primaryButton} onClick={() => setLoggedInUserId(selectedUser.id)}>
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
          <button style={styles.menuItem}>Գլխավոր</button>
          <button style={styles.menuItem}>Կազմակերպություններ</button>
          <button style={styles.menuItem}>Հաշվապահական տարածք</button>
          <button style={styles.menuItem}>Հարցումներ</button>
          <button style={styles.menuItem}>Կարգավորումներ</button>
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
        </div>

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

const styles: Record<string, React.CSSProperties> = {
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
