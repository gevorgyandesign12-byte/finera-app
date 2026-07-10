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

type ArmenianBankEditForm = {
  id: string;
  bankCode: string;
  name: string;
  swiftCode: string;
  directoryType: BankDirectoryType;
  parentBankCode: string;
  isHeadOffice: boolean;
  isBranch: boolean;
  isActive: boolean;
};

type ArmenianBanksApiResponse = {
  banks?: ArmenianBankRow[];
  bank?: ArmenianBankRow;
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
  typeFilter: "\u054f\u0565\u057d\u0561\u056f",
  rowFilter: "\u053f\u0561\u057c\u0578\u0582\u0581\u057e\u0561\u056e\u0584",
  importDemoMessage: "SAFE demo\u2024 \u0562\u0561\u0576\u056f\u0565\u0580\u056b \u0576\u0565\u0580\u0574\u0578\u0582\u056e\u0578\u0582\u0574\u0568 \u057a\u0565\u057f\u0584 \u0567 \u0561\u0580\u057e\u056b \u0574\u056b\u0561\u0575\u0576 \u057e\u0565\u0580\u0561\u0570\u057d\u056f\u057e\u0578\u0572 script-\u0578\u057e\u055d backup-\u0578\u057e \u0587 \u057d\u057f\u0578\u0582\u0563\u0578\u0582\u0574\u0578\u057e\u0589",
  exportEmptyMessage: "\u0531\u0580\u057f\u0561\u0570\u0561\u0576\u0574\u0561\u0576 \u0570\u0561\u0574\u0561\u0580 \u057f\u0578\u0572\u0565\u0580 \u0579\u056f\u0561\u0576\u0589",
  import: "\u0546\u0565\u0580\u0574\u0578\u0582\u056e\u0565\u056c",
  export: "\u0531\u0580\u057f\u0561\u0570\u0561\u0576\u0565\u056c",
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
  actions: "\u0533\u0578\u0580\u056e\u0578\u0572\u0578\u0582\u0569\u0575\u0578\u0582\u0576",
  edit: "\u053d\u0574\u0562\u0561\u0563\u0580\u0565\u056c",
  editTitle: "\u053d\u0574\u0562\u0561\u0563\u0580\u0565\u056c \u0562\u0561\u0576\u056f\u0561\u0575\u056b\u0576 \u0563\u0580\u0561\u057c\u0578\u0582\u0574\u0568",
  save: "\u054a\u0561\u0570\u057a\u0561\u0576\u0565\u056c",
  saving: "\u054a\u0561\u0570\u057a\u0561\u0576\u057e\u0578\u0582\u0574 \u0567\u2026",
  cancel: "\u0549\u0565\u0572\u0561\u0580\u056f\u0565\u056c",
  saveErrorFallback: "\u054f\u057e\u0575\u0561\u056c\u0576\u0565\u0580\u0568 \u0579\u0570\u0561\u057b\u0578\u0572\u057e\u0565\u0581 \u057a\u0561\u0570\u057a\u0561\u0576\u0565\u056c\u0589",
  requiredFields: "\u053f\u0578\u0564\u0568 \u0587 \u0561\u0576\u057e\u0561\u0576\u0578\u0582\u0574\u0568 \u057a\u0561\u0580\u057f\u0561\u0564\u056b\u0580 \u0565\u0576\u0589",
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

function escapeCsvCell(value: string | number | boolean | null) {
  const textValue = value === null ? "" : String(value);
  return '"' + textValue.replaceAll('"', '""') + '"';
}

function downloadCsv(filename: string, rows: ArmenianBankRow[]) {
  const headers = [
    text.code,
    text.name,
    text.swift,
    text.type,
    text.parent,
    text.headOffices,
    text.branches,
    text.status,
  ];

  const csvRows = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((bank) =>
      [
        bank.bankCode,
        bank.name,
        bank.swiftCode,
        directoryTypeLabels[bank.directoryType],
        bank.parentBankCode,
        bank.isHeadOffice ? text.yes : text.no,
        bank.isBranch ? text.yes : text.no,
        bank.isActive ? text.active : text.inactive,
      ]
        .map(escapeCsvCell)
        .join(","),
    ),
  ];

  const blob = new Blob(["\ufeff" + csvRows.join("\r\n")], {
    type: "text/csv;charset=utf-8",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
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
  const [editingBank, setEditingBank] = useState<ArmenianBankEditForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

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

  function openEditDialog(bank: ArmenianBankRow) {
    setSaveError(null);
    setEditingBank({
      id: bank.id,
      bankCode: bank.bankCode,
      name: bank.name,
      swiftCode: bank.swiftCode ?? "",
      directoryType: bank.directoryType,
      parentBankCode: bank.parentBankCode ?? "",
      isHeadOffice: bank.isHeadOffice,
      isBranch: bank.isBranch,
      isActive: bank.isActive,
    });
  }

  function closeEditDialog() {
    if (saving) {
      return;
    }

    setSaveError(null);
    setEditingBank(null);
  }

  async function saveEditedBank(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingBank) {
      return;
    }

    if (!editingBank.bankCode.trim() || !editingBank.name.trim()) {
      setSaveError(text.requiredFields);
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      const response = await fetch("/api/master-data/armenian-banks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editingBank,
          bankCode: editingBank.bankCode.trim(),
          name: editingBank.name.trim(),
          swiftCode: editingBank.swiftCode.trim() || null,
          parentBankCode: editingBank.parentBankCode.trim() || null,
        }),
      });

      const payload = (await response.json()) as ArmenianBanksApiResponse;

      if (!response.ok || payload.error) {
        throw new Error(payload.error || payload.detail || text.saveErrorFallback);
      }

      if (!payload.bank) {
        throw new Error(text.saveErrorFallback);
      }

      setEditingBank(null);
      await loadBanks();
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : text.saveErrorFallback;
      setSaveError(message);
    } finally {
      setSaving(false);
    }
  }

  function handleImportClick() {
    window.alert(text.importDemoMessage);
  }

  function handleExportClick() {
    if (banks.length === 0) {
      window.alert(text.exportEmptyMessage);
      return;
    }

    downloadCsv("armenian-banks.csv", banks);
  }

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
          <div style={styles.headerActions}>
            <button type="button" style={styles.secondaryButton} onClick={handleImportClick}>
              {text.import}
            </button>
            <button type="button" style={styles.secondaryButton} onClick={handleExportClick}>
              {text.export}
            </button>
            <button type="button" style={styles.primaryButton} onClick={() => void loadBanks()}>
              {text.refresh}
            </button>
          </div>
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

          <label style={styles.selectLabel}>
            {text.typeFilter}
            <select
              style={styles.select}
              value={directoryType}
              onChange={(event) => setDirectoryType(event.target.value as "all" | BankDirectoryType)}
            >
              <option style={styles.option} value="all">{text.allTypes}</option>
              <option style={styles.option} value="bank">{text.banks}</option>
              <option style={styles.option} value="central_bank">{text.centralBank}</option>
              <option style={styles.option} value="treasury">{text.treasury}</option>
            </select>
          </label>

          <label style={styles.selectLabel}>
            {text.rowFilter}
            <select
              style={styles.select}
              value={rowKind}
              onChange={(event) => setRowKind(event.target.value as "all" | "head" | "branch")}
            >
              <option style={styles.option} value="all">{text.allRows}</option>
              <option style={styles.option} value="head">{text.headOffices}</option>
              <option style={styles.option} value="branch">{text.branches}</option>
            </select>
          </label>

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
                  <th style={styles.th}>{text.actions}</th>
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
                    <td style={styles.td}>
                      <button
                        type="button"
                        style={styles.editButton}
                        onClick={() => openEditDialog(bank)}
                      >
                        {text.edit}
                      </button>
                    </td>
                  </tr>
                ))}

                {!loading && banks.length === 0 ? (
                  <tr>
                    <td style={styles.emptyCell} colSpan={9}>
                      {text.empty}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>

        {editingBank ? (
          <div style={styles.modalOverlay} role="presentation">
            <form style={styles.modalCard} onSubmit={(event) => void saveEditedBank(event)}>
              <div style={styles.modalHeader}>
                <div>
                  <h2 style={styles.modalTitle}>{text.editTitle}</h2>
                  <p style={styles.smallText}>{editingBank.name}</p>
                </div>

                <button
                  type="button"
                  style={styles.closeButton}
                  onClick={closeEditDialog}
                  disabled={saving}
                  aria-label={text.cancel}
                >
                  ×
                </button>
              </div>

              {saveError ? <div style={styles.errorBox}>{saveError}</div> : null}

              <div style={styles.formGrid}>
                <label style={styles.formLabel}>
                  {text.code}
                  <input
                    style={styles.formInput}
                    value={editingBank.bankCode}
                    onChange={(event) =>
                      setEditingBank({ ...editingBank, bankCode: event.target.value })
                    }
                    disabled={saving}
                  />
                </label>

                <label style={styles.formLabel}>
                  {text.name}
                  <input
                    style={styles.formInput}
                    value={editingBank.name}
                    onChange={(event) =>
                      setEditingBank({ ...editingBank, name: event.target.value })
                    }
                    disabled={saving}
                  />
                </label>

                <label style={styles.formLabel}>
                  {text.swift}
                  <input
                    style={styles.formInput}
                    value={editingBank.swiftCode}
                    onChange={(event) =>
                      setEditingBank({ ...editingBank, swiftCode: event.target.value })
                    }
                    disabled={saving}
                  />
                </label>

                <label style={styles.formLabel}>
                  {text.type}
                  <select
                    style={styles.formInput}
                    value={editingBank.directoryType}
                    onChange={(event) =>
                      setEditingBank({
                        ...editingBank,
                        directoryType: event.target.value as BankDirectoryType,
                      })
                    }
                    disabled={saving}
                  >
                    <option style={styles.option} value="bank">{text.banks}</option>
                    <option style={styles.option} value="central_bank">{text.centralBank}</option>
                    <option style={styles.option} value="treasury">{text.treasury}</option>
                  </select>
                </label>

                <label style={styles.formLabel}>
                  {text.parent}
                  <input
                    style={styles.formInput}
                    value={editingBank.parentBankCode}
                    onChange={(event) =>
                      setEditingBank({ ...editingBank, parentBankCode: event.target.value })
                    }
                    disabled={saving}
                  />
                </label>
              </div>

              <div style={styles.booleanGrid}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={editingBank.isHeadOffice}
                    onChange={(event) =>
                      setEditingBank({ ...editingBank, isHeadOffice: event.target.checked })
                    }
                    disabled={saving}
                  />
                  {text.headOffices}
                </label>

                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={editingBank.isBranch}
                    onChange={(event) =>
                      setEditingBank({ ...editingBank, isBranch: event.target.checked })
                    }
                    disabled={saving}
                  />
                  {text.branches}
                </label>

                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={editingBank.isActive}
                    onChange={(event) =>
                      setEditingBank({ ...editingBank, isActive: event.target.checked })
                    }
                    disabled={saving}
                  />
                  {text.active}
                </label>
              </div>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={closeEditDialog}
                  disabled={saving}
                >
                  {text.cancel}
                </button>

                <button type="submit" style={styles.primaryButton} disabled={saving}>
                  {saving ? text.saving : text.save}
                </button>
              </div>
            </form>
          </div>
        ) : null}
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
  headerActions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    alignSelf: "flex-start",
  },
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
  secondaryButton: {
    border: "1px solid #bfdbfe",
    borderRadius: 12,
    padding: "11px 14px",
    background: "#ffffff",
    color: "#1d4ed8",
    fontWeight: 900,
    cursor: "pointer",
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
    color: "#0f172a",
    WebkitTextFillColor: "#0f172a",
    caretColor: "#0f172a",
    colorScheme: "light",
    outline: "none",
    background: "#ffffff",
  },
  selectLabel: {
    display: "grid",
    gap: 6,
    color: "#1e3a8a",
    fontSize: 12,
    fontWeight: 900,
  },
  select: {
    width: "100%",
    border: "1px solid #bfdbfe",
    borderRadius: 12,
    padding: "11px 12px",
    fontSize: 14,
    fontWeight: 800,
    color: "#0f172a",
    WebkitTextFillColor: "#0f172a",
    colorScheme: "light",
    outline: "none",
    background: "#ffffff",
  },
  option: {
    color: "#0f172a",
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
  editButton: {
    border: "1px solid #bfdbfe",
    borderRadius: 10,
    padding: "7px 10px",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontWeight: 900,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "grid",
    placeItems: "center",
    padding: 20,
    background: "rgba(15, 23, 42, 0.58)",
  },
  modalCard: {
    width: "min(760px, 100%)",
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#ffffff",
    borderRadius: 20,
    padding: 20,
    boxShadow: "0 24px 70px rgba(15, 23, 42, 0.3)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-start",
    marginBottom: 18,
  },
  modalTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: 22,
  },
  closeButton: {
    border: "none",
    background: "transparent",
    color: "#475569",
    fontSize: 30,
    lineHeight: 1,
    cursor: "pointer",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 14,
  },
  formLabel: {
    display: "grid",
    gap: 7,
    color: "#334155",
    fontSize: 13,
    fontWeight: 900,
  },
  formInput: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #cbd5e1",
    borderRadius: 11,
    padding: "10px 12px",
    background: "#ffffff",
    color: "#0f172a",
    WebkitTextFillColor: "#0f172a",
    colorScheme: "light",
    fontSize: 14,
    outline: "none",
  },
  booleanGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 18,
    marginTop: 18,
    padding: 14,
    borderRadius: 12,
    background: "#f8fafc",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
} as const;
