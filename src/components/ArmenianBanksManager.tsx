"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type BankDirectoryType = "bank" | "central_bank" | "treasury";

type ArmenianBankRow = {
  id: string;
  bankCode: string;
  name: string;
  swiftCode: string | null;
  directoryType: BankDirectoryType;
  parentBankCode: string | null;
  isHeadOffice: boolean;
  isBranch: boolean;
  isActive: boolean;
};

type ArmenianBanksApiResponse = {
  banks?: ArmenianBankRow[];
  meta?: {
    total: number;
    limit: number;
    returned: number;
  };
  error?: string;
  detail?: string;
};

type ArmenianBanksManagerProps = {
  standalone?: boolean;
};

const text = {
  kicker: "\u053f\u0561\u057c\u0561\u057e\u0561\u0580\u0578\u0582\u0574 \u00b7 Master DB \u00b7 \u0532\u0561\u0576\u056f\u0561\u0575\u056b\u0576 \u057f\u0565\u0572\u0565\u056f\u0561\u057f\u0578\u0582",
  title: "\u0540\u0540 \u0562\u0561\u0576\u056f\u0565\u0580 \u0587 \u0574\u0561\u057d\u0576\u0561\u0573\u0575\u0578\u0582\u0572\u0565\u0580",
  description:
    "\u0532\u0561\u0576\u056f\u0561\u0575\u056b\u0576 \u056f\u0578\u0564\u0565\u0580\u0568, SWIFT \u056f\u0578\u0564\u0565\u0580\u0568, \u0563\u056c\u056d\u0561\u0574\u0561\u057d\u0565\u0580\u0568 \u0587 \u0574\u0561\u057d\u0576\u0561\u0573\u0575\u0578\u0582\u0572\u0565\u0580\u0568 \u057a\u0561\u0570\u057e\u0578\u0582\u0574 \u0565\u0576 Master DB-\u0578\u0582\u0574\u0589 \u053f\u0561\u0566\u0574\u0561\u056f\u0565\u0580\u057a\u0578\u0582\u0569\u0575\u0561\u0576 \u0562\u0561\u0576\u056f\u0561\u0575\u056b\u0576 \u0570\u0561\u0577\u056b\u057e \u0562\u0561\u0581\u0565\u056c\u056b\u057d \u056f\u0561\u0574 \u057e\u0573\u0561\u0580\u0578\u0582\u0574 \u0574\u0578\u0582\u057f\u0584\u0561\u0563\u0580\u0565\u056c\u056b\u057d \u0570\u0565\u057f\u0561\u0563\u0561\u0575\u0578\u0582\u0574 \u056f\u0585\u0563\u057f\u0561\u0563\u0578\u0580\u056e\u057e\u056b \u0561\u0575\u057d \u057f\u0565\u0572\u0565\u056f\u0561\u057f\u0578\u0582\u0576\u0589",
  searchPlaceholder: "\u0548\u0580\u0578\u0576\u0565\u056c \u056f\u0578\u0564\u0578\u057e, \u0561\u0576\u057e\u0561\u0576\u0578\u0582\u0574\u0578\u057e \u056f\u0561\u0574 SWIFT-\u0578\u057e\u2026",
  allTypes: "\u0532\u0578\u056c\u0578\u0580 \u057f\u0565\u057d\u0561\u056f\u0576\u0565\u0580\u0568",
  banks: "\u0532\u0561\u0576\u056f\u0565\u0580",
  centralBank: "\u053f\u0565\u0576\u057f\u0580\u0578\u0576\u0561\u056f\u0561\u0576 \u0562\u0561\u0576\u056f",
  treasury: "\u0533\u0561\u0576\u0571\u0561\u057a\u0565\u057f\u0561\u0580\u0561\u0576 / \u054f\u0534\u053f",
  allRows: "\u0532\u0578\u056c\u0578\u0580\u0568",
  headOffices: "\u0533\u056c\u056d\u0561\u0574\u0561\u057d\u0565\u0580",
  branches: "\u0544\u0561\u057d\u0576\u0561\u0573\u0575\u0578\u0582\u0572\u0565\u0580",
  includeInactive: "\u0551\u0578\u0582\u0575\u0581 \u057f\u0561\u056c \u0576\u0561\u0587 \u0578\u0579 \u0561\u056f\u057f\u056b\u057e\u0576\u0565\u0580\u0568",
  refresh: "\u0539\u0561\u0580\u0574\u0561\u0581\u0576\u0565\u056c",
  loading: "\u0532\u0565\u057c\u0576\u057e\u0578\u0582\u0574 \u0567\u2026",
  empty: "\u054f\u057e\u0575\u0561\u056c \u0579\u056f\u0561\u0589",
  listTitle: "\u0532\u0561\u0576\u056f\u0565\u0580\u056b \u0587 \u0574\u0561\u057d\u0576\u0561\u0573\u0575\u0578\u0582\u0572\u0565\u0580\u056b \u0581\u0561\u0576\u056f",
  total: "\u0538\u0576\u0564\u0561\u0574\u0565\u0576\u0568",
  shown: "\u0551\u0578\u0582\u0581\u0561\u0564\u0580\u057e\u0578\u0582\u0574 \u0567",
  code: "\u053f\u0578\u0564",
  name: "\u0531\u0576\u057e\u0561\u0576\u0578\u0582\u0574",
  swift: "SWIFT",
  type: "\u054f\u0565\u057d\u0561\u056f",
  parent: "\u0533\u056c\u056d\u0561\u0574\u0561\u057d\u056b \u056f\u0578\u0564",
  status: "\u053f\u0561\u0580\u0563\u0561\u057e\u056b\u0573\u0561\u056f",
  active: "\u0531\u056f\u057f\u056b\u057e",
  inactive: "\u0548\u0579 \u0561\u056f\u057f\u056b\u057e",
  yes: "\u0531\u0575\u0578",
  no: "\u0548\u0579",
  dbNote: "Read-only API \u00b7 DEV Master DB",
  errorFallback: "\u0532\u0561\u0576\u056f\u0565\u0580\u056b \u057f\u0565\u0572\u0565\u056f\u0561\u057f\u0578\u0582\u0576 \u0579\u0562\u0565\u057c\u0576\u057e\u0565\u0581\u0589",
};

const directoryTypeLabels: Record<BankDirectoryType, string> = {
  bank: text.banks,
  central_bank: text.centralBank,
  treasury: text.treasury,
};

function buildApiUrl({
  query,
  directoryType,
  rowKind,
  includeInactive,
}: {
  query: string;
  directoryType: "all" | BankDirectoryType;
  rowKind: "all" | "head" | "branch";
  includeInactive: boolean;
}) {
  const params = new URLSearchParams();

  params.set("limit", "1000");

  if (query.trim()) {
    params.set("q", query.trim());
  }

  if (directoryType !== "all") {
    params.set("directoryType", directoryType);
  }

  if (rowKind === "head") {
    params.set("isHeadOffice", "true");
  }

  if (rowKind === "branch") {
    params.set("isBranch", "true");
  }

  if (includeInactive) {
    params.set("includeInactive", "true");
  }

  return "/api/master-data/armenian-banks?" + params.toString();
}

export function ArmenianBanksManager({ standalone = false }: ArmenianBanksManagerProps) {
  const [banks, setBanks] = useState<ArmenianBankRow[]>([]);
  const [query, setQuery] = useState("");
  const [directoryType, setDirectoryType] = useState<"all" | BankDirectoryType>("all");
  const [rowKind, setRowKind] = useState<"all" | "head" | "branch">("all");
  const [includeInactive, setIncludeInactive] = useState(false);
  const [total, setTotal] = useState(0);
  const [returned, setReturned] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const url = useMemo(
    () => buildApiUrl({ query, directoryType, rowKind, includeInactive }),
    [directoryType, includeInactive, query, rowKind],
  );

  const loadBanks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, { cache: "no-store" });
      const payload = (await response.json()) as ArmenianBanksApiResponse;

      if (!response.ok || payload.error) {
        throw new Error(payload.error || payload.detail || text.errorFallback);
      }

      setBanks(payload.banks ?? []);
      setTotal(payload.meta?.total ?? 0);
      setReturned(payload.meta?.returned ?? payload.banks?.length ?? 0);
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : text.errorFallback;
      setError(message);
      setBanks([]);
      setTotal(0);
      setReturned(0);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadBanks();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadBanks]);

  const cards = useMemo(() => {
    const headCount = banks.filter((bank) => bank.isHeadOffice).length;
    const branchCount = banks.filter((bank) => bank.isBranch).length;
    const inactiveCount = banks.filter((bank) => !bank.isActive).length;

    return [
      { label: text.shown, value: returned },
      { label: text.total, value: total },
      { label: text.headOffices, value: headCount },
      { label: text.branches, value: branchCount },
      { label: text.inactive, value: inactiveCount },
    ];
  }, [banks, returned, total]);

  return (
    <section style={standalone ? styles.standalonePage : styles.embeddedPage}>
      <div style={styles.wrap}>
        <section style={styles.headerCard}>
          <div>
            <p style={styles.kicker}>{text.kicker}</p>
            <h1 style={styles.title}>{text.title}</h1>
            <p style={styles.description}>{text.description}</p>
          </div>
          <button type="button" style={styles.primaryButton} onClick={() => void loadBanks()}>
            {text.refresh}
          </button>
        </section>

        <section style={styles.statsGrid}>
          {cards.map((card) => (
            <div key={card.label} style={styles.statCard}>
              <p style={styles.statLabel}>{card.label}</p>
              <strong style={styles.statValue}>{card.value}</strong>
            </div>
          ))}
        </section>

        <section style={styles.filterCard}>
          <input
            style={styles.searchInput}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={text.searchPlaceholder}
          />

          <select
            style={styles.select}
            value={directoryType}
            onChange={(event) => setDirectoryType(event.target.value as "all" | BankDirectoryType)}
          >
            <option value="all">{text.allTypes}</option>
            <option value="bank">{text.banks}</option>
            <option value="central_bank">{text.centralBank}</option>
            <option value="treasury">{text.treasury}</option>
          </select>

          <select
            style={styles.select}
            value={rowKind}
            onChange={(event) => setRowKind(event.target.value as "all" | "head" | "branch")}
          >
            <option value="all">{text.allRows}</option>
            <option value="head">{text.headOffices}</option>
            <option value="branch">{text.branches}</option>
          </select>

          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={includeInactive}
              onChange={(event) => setIncludeInactive(event.target.checked)}
            />
            {text.includeInactive}
          </label>
        </section>

        <section style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <div>
              <h2 style={styles.cardTitle}>{text.listTitle}</h2>
              <p style={styles.smallText}>{text.dbNote}</p>
            </div>
            {loading ? <span style={styles.loading}>{text.loading}</span> : null}
          </div>

          {error ? <div style={styles.errorBox}>{error}</div> : null}

          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>{text.code}</th>
                  <th style={styles.th}>{text.name}</th>
                  <th style={styles.th}>{text.swift}</th>
                  <th style={styles.th}>{text.type}</th>
                  <th style={styles.th}>{text.parent}</th>
                  <th style={styles.th}>{text.headOffices}</th>
                  <th style={styles.th}>{text.branches}</th>
                  <th style={styles.th}>{text.status}</th>
                </tr>
              </thead>
              <tbody>
                {banks.map((bank) => (
                  <tr key={bank.id}>
                    <td style={styles.tdMono}>{bank.bankCode}</td>
                    <td style={styles.tdStrong}>{bank.name}</td>
                    <td style={styles.tdMono}>{bank.swiftCode || "\u2014"}</td>
                    <td style={styles.td}>{directoryTypeLabels[bank.directoryType]}</td>
                    <td style={styles.tdMono}>{bank.parentBankCode || "\u2014"}</td>
                    <td style={styles.td}>{bank.isHeadOffice ? text.yes : text.no}</td>
                    <td style={styles.td}>{bank.isBranch ? text.yes : text.no}</td>
                    <td style={styles.td}>
                      <span style={bank.isActive ? styles.activeBadge : styles.inactiveBadge}>
                        {bank.isActive ? text.active : text.inactive}
                      </span>
                    </td>
                  </tr>
                ))}

                {!loading && banks.length === 0 ? (
                  <tr>
                    <td style={styles.emptyCell} colSpan={8}>
                      {text.empty}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
  );
}

const styles = {
  standalonePage: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: 24,
    color: "#0f172a",
  },
  embeddedPage: {
    color: "#0f172a",
  },
  wrap: {
    maxWidth: 1320,
    margin: "0 auto",
    display: "grid",
    gap: 18,
  },
  headerCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    padding: 20,
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
  },
  kicker: { margin: 0, color: "#64748b", fontSize: 13, fontWeight: 900 },
  title: { margin: "6px 0 8px", fontSize: 28 },
  description: { margin: 0, color: "#475569", lineHeight: 1.6, maxWidth: 960 },
  primaryButton: {
    border: "none",
    borderRadius: 12,
    padding: "11px 14px",
    background: "#1d4ed8",
    color: "#ffffff",
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(29, 78, 216, 0.18)",
    alignSelf: "flex-start",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 12,
  },
  statCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: 16,
  },
  statLabel: { margin: "0 0 8px", color: "#64748b", fontSize: 12, fontWeight: 800 },
  statValue: { fontSize: 26, color: "#0f172a" },
  filterCard: {
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: 18,
    padding: 16,
    display: "grid",
    gridTemplateColumns: "minmax(260px, 1fr) minmax(180px, 240px) minmax(160px, 220px) minmax(220px, 280px)",
    gap: 12,
    alignItems: "center",
  },
  searchInput: {
    border: "1px solid #bfdbfe",
    borderRadius: 12,
    padding: "11px 12px",
    fontSize: 14,
    outline: "none",
    background: "#ffffff",
  },
  select: {
    border: "1px solid #bfdbfe",
    borderRadius: 12,
    padding: "11px 12px",
    fontSize: 14,
    outline: "none",
    background: "#ffffff",
  },
  checkboxLabel: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    color: "#1e3a8a",
    fontWeight: 800,
    fontSize: 13,
  },
  tableCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 14,
  },
  cardTitle: { margin: 0, fontSize: 20 },
  smallText: { margin: "6px 0 0", color: "#64748b", fontSize: 13 },
  loading: { color: "#1d4ed8", fontWeight: 900 },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 12,
    padding: 12,
    color: "#991b1b",
    fontWeight: 800,
    marginBottom: 12,
  },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 980 },
  th: {
    textAlign: "left",
    padding: "10px 12px",
    borderBottom: "1px solid #e2e8f0",
    color: "#475569",
    fontSize: 12,
    fontWeight: 900,
    whiteSpace: "nowrap",
  },
  td: {
    padding: "10px 12px",
    borderBottom: "1px solid #f1f5f9",
    color: "#334155",
    fontSize: 13,
    verticalAlign: "top",
  },
  tdMono: {
    padding: "10px 12px",
    borderBottom: "1px solid #f1f5f9",
    color: "#0f172a",
    fontSize: 13,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    verticalAlign: "top",
    whiteSpace: "nowrap",
  },
  tdStrong: {
    padding: "10px 12px",
    borderBottom: "1px solid #f1f5f9",
    color: "#0f172a",
    fontSize: 13,
    fontWeight: 800,
    verticalAlign: "top",
  },
  activeBadge: {
    display: "inline-flex",
    borderRadius: 999,
    padding: "4px 8px",
    background: "#dcfce7",
    color: "#166534",
    fontWeight: 900,
    fontSize: 12,
  },
  inactiveBadge: {
    display: "inline-flex",
    borderRadius: 999,
    padding: "4px 8px",
    background: "#fee2e2",
    color: "#991b1b",
    fontWeight: 900,
    fontSize: 12,
  },
  emptyCell: {
    padding: 24,
    textAlign: "center",
    color: "#64748b",
    borderBottom: "1px solid #f1f5f9",
  },
} as const;
