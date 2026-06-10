"use client";

import { useMemo, useState, type CSSProperties } from "react";

type AccountType = "Ակտիվ" | "Պասիվ" | "Ակտիվ-պասիվ" | "Եկամուտ" | "Ծախս" | "Արտահաշվեկշռային";

type ChartAccount = {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  parentId: string | null;
  requiresPartner: boolean;
  isOffBalance: boolean;
  requiresCurrency: boolean;
  currencies?: string[];
  isActive: boolean;
  description: string;
};

const initialAccounts: ChartAccount[] = [
  {
    id: "11-12",
    code: "11-12",
    name: "Ոչ ընթացիկ նյութական ակտիվներ",
    type: "Ակտիվ",
    parentId: null,
    requiresPartner: false,
    isOffBalance: false,
    requiresCurrency: false,
    isActive: true,
    description: "Խմբային հաշիվ հիմնական միջոցների և այլ ոչ ընթացիկ ակտիվների համար։",
  },
  {
    id: "111",
    code: "111",
    name: "Մաշվող հիմնական միջոցներ",
    type: "Ակտիվ",
    parentId: "11-12",
    requiresPartner: false,
    isOffBalance: false,
    requiresCurrency: false,
    isActive: true,
    description: "Հիմնական միջոցների խումբ։",
  },
  {
    id: "1111",
    code: "1111",
    name: "Շենքեր",
    type: "Ակտիվ",
    parentId: "111",
    requiresPartner: false,
    isOffBalance: false,
    requiresCurrency: false,
    isActive: true,
    description: "Շենքերի հաշվառում։",
  },
  {
    id: "1112",
    code: "1112",
    name: "Կառուցվածքներ",
    type: "Ակտիվ",
    parentId: "111",
    requiresPartner: false,
    isOffBalance: false,
    requiresCurrency: false,
    isActive: true,
    description: "Կառուցվածքների հաշվառում։",
  },
  {
    id: "221",
    code: "221",
    name: "Դեբիտորական պարտքեր գնորդներից",
    type: "Ակտիվ",
    parentId: null,
    requiresPartner: true,
    isOffBalance: false,
    requiresCurrency: false,
    isActive: true,
    description: "Գործընկերներով հաշվառում պահանջող հաշիվ։ Ձևակերպման ժամանակ գործընկերը պարտադիր է։",
  },
  {
    id: "252",
    code: "252",
    name: "Դրամարկղ",
    type: "Ակտիվ",
    parentId: null,
    requiresPartner: false,
    isOffBalance: false,
    requiresCurrency: false,
    isActive: true,
    description: "Կանխիկ դրամի հաշվառում։ Գործընկեր դաշտը պետք է փակ լինի, եթե այս հաշիվն է ընտրված։",
  },
  {
    id: "521",
    code: "521",
    name: "Կրեդիտորական պարտքեր մատակարարներին",
    type: "Պասիվ",
    parentId: null,
    requiresPartner: true,
    isOffBalance: false,
    requiresCurrency: false,
    isActive: true,
    description: "Մատակարարների պարտքերի հաշիվ։ Գործընկերը պարտադիր է։",
  },
];

const baseCurrency = { code: "AMD", name: "Հայկական դրամ" };

const availableCurrencies = [
  { code: "USD", name: "ԱՄՆ դոլար" },
  { code: "EUR", name: "Եվրո" },
  { code: "RUB", name: "Ռուսական ռուբլի" },
  { code: "GBP", name: "Բրիտանական ֆունտ" },
  { code: "CHF", name: "Շվեյցարական ֆրանկ" },
  { code: "CNY", name: "Չինական յուան" },
  { code: "GEL", name: "Վրացական լարի" },
  { code: "AED", name: "ԱՄԷ դիրհամ" },
];

const pageStyle: CSSProperties = {
  display: "grid",
  gap: 18,
};

const toolbarStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  alignItems: "center",
  justifyContent: "space-between",
  border: "1px solid rgba(214, 202, 182, 0.9)",
  borderRadius: 22,
  background: "#fffaf2",
  padding: 16,
  boxShadow: "0 16px 45px rgba(45, 35, 20, 0.06)",
};

const buttonStyle: CSSProperties = {
  border: "1px solid rgba(148, 134, 112, 0.35)",
  borderRadius: 14,
  background: "#ffffff",
  padding: "10px 14px",
  color: "#172033",
  fontSize: 13,
  fontWeight: 850,
  cursor: "pointer",
};

const primaryButtonStyle: CSSProperties = {
  ...buttonStyle,
  border: 0,
  background: "#142033",
  color: "#ffffff",
};

const cardStyle: CSSProperties = {
  border: "1px solid rgba(214, 202, 182, 0.9)",
  borderRadius: 22,
  background: "#fffaf2",
  padding: 18,
  boxShadow: "0 16px 45px rgba(45, 35, 20, 0.08)",
};

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid rgba(148, 134, 112, 0.42)",
  borderRadius: 13,
  background: "#ffffff",
  padding: "10px 12px",
  color: "#111827",
  fontSize: 14,
  outline: "none",
};

function getChildren(accounts: ChartAccount[], parentId: string | null) {
  return accounts
    .filter((account) => account.parentId === parentId)
    .sort((a, b) => a.code.localeCompare(b.code, "hy"));
}

function AccountTree({
  accounts,
  selectedId,
  parentId,
  level = 0,
  onSelect,
}: {
  accounts: ChartAccount[];
  selectedId: string;
  parentId: string | null;
  level?: number;
  onSelect: (id: string) => void;
}) {
  const children = getChildren(accounts, parentId);

  return (
    <div style={{ display: "grid", gap: 6 }}>
      {children.map((account) => {
        const isSelected = selectedId === account.id;
        const childCount = getChildren(accounts, account.id).length;

        return (
          <div key={account.id}>
            <button
              type="button"
              onClick={() => onSelect(account.id)}
              style={{
                width: "100%",
                border: isSelected ? "1px solid #142033" : "1px solid rgba(214, 202, 182, 0.72)",
                borderRadius: 14,
                background: isSelected ? "#142033" : "#fffdfa",
                padding: "9px 10px",
                paddingLeft: 10 + level * 18,
                color: isSelected ? "#ffffff" : "#172033",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <span style={{ fontWeight: 950 }}>{account.code}</span>
              <span style={{ marginLeft: 8, fontSize: 13 }}>{account.name}</span>
              {childCount > 0 ? (
                <span style={{ float: "right", opacity: 0.7, fontSize: 12 }}>
                  {childCount} ենթ.
                </span>
              ) : null}
            </button>

            <div style={{ marginTop: 6 }}>
              <AccountTree
                accounts={accounts}
                selectedId={selectedId}
                parentId={account.id}
                level={level + 1}
                onSelect={onSelect}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" }) {
  const background = tone === "good" ? "#dcfce7" : tone === "warn" ? "#ffedd5" : "#e2e8f0";
  const color = tone === "good" ? "#166534" : tone === "warn" ? "#9a3412" : "#334155";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        background,
        color,
        padding: "5px 9px",
        fontSize: 12,
        fontWeight: 900,
      }}
    >
      {children}
    </span>
  );
}

export function ChartOfAccountsPreview() {
  const [accounts, setAccounts] = useState<ChartAccount[]>(initialAccounts);
  const [selectedId, setSelectedId] = useState("111");
  const [search, setSearch] = useState("");
  const [isCurrencyDialogOpen, setIsCurrencyDialogOpen] = useState(false);
  const selected = accounts.find((account) => account.id === selectedId) ?? accounts[0];
  const selectedCurrencies = selected.currencies ?? [];
  const displayCurrencies = [baseCurrency.code, ...selectedCurrencies];

  const filteredAccounts = useMemo(() => {
    const trimmed = search.trim().toLowerCase();

    if (!trimmed) {
      return accounts;
    }

    return accounts.filter(
      (account) =>
        account.code.toLowerCase().includes(trimmed) ||
        account.name.toLowerCase().includes(trimmed),
    );
  }, [accounts, search]);

  function addRootAccount() {
    const nextNumber = accounts.length + 1;
    const newAccount: ChartAccount = {
      id: `new-${Date.now()}`,
      code: `Նոր-${nextNumber}`,
      name: "Նոր հաշիվ",
      type: "Ակտիվ",
      parentId: null,
      requiresPartner: false,
      isOffBalance: false,
      requiresCurrency: false,
      isActive: true,
      description: "Demo նոր հաշիվ։ Հետագայում կպահպանվի DB-ում։",
    };

    setAccounts((current) => [...current, newAccount]);
    setSelectedId(newAccount.id);
  }

  function addChildAccount() {
    const childCount = accounts.filter((account) => account.parentId === selected.id).length + 1;
    const newAccount: ChartAccount = {
      id: `child-${Date.now()}`,
      code: `${selected.code}.${childCount}`,
      name: "Նոր ենթահաշիվ",
      type: selected.type,
      parentId: selected.id,
      requiresPartner: selected.requiresPartner,
      isOffBalance: selected.isOffBalance,
      requiresCurrency: selected.requiresCurrency,
      isActive: true,
      description: "Demo ենթահաշիվ։ Ծնող հաշվի որոշ կանոններ ժառանգվում են որպես առաջարկ։",
    };

    setAccounts((current) => [...current, newAccount]);
    setSelectedId(newAccount.id);
  }

  function updateSelected(patch: Partial<ChartAccount>) {
    setAccounts((current) =>
      current.map((account) =>
        account.id === selected.id ? { ...account, ...patch } : account,
      ),
    );
  }

  function enableOrDisableCurrencyAccounting(checked: boolean) {
    if (checked) {
      updateSelected({ requiresCurrency: true });
      setIsCurrencyDialogOpen(true);
      return;
    }

    updateSelected({ requiresCurrency: false, currencies: [] });
    setIsCurrencyDialogOpen(false);
  }

  function toggleCurrency(code: string) {
    const currentCurrencies = selected.currencies ?? [];
    const nextCurrencies = currentCurrencies.includes(code)
      ? currentCurrencies.filter((currencyCode) => currencyCode !== code)
      : [...currentCurrencies, code];

    updateSelected({
      currencies: nextCurrencies,
      requiresCurrency: nextCurrencies.length > 0 || selected.requiresCurrency,
    });
  }

  function closeSelected() {
    updateSelected({ isActive: false });
  }

  function removeSelected() {
    const hasChildren = accounts.some((account) => account.parentId === selected.id);

    if (hasChildren) {
      alert("Այս հաշիվը ունի ենթահաշիվներ։ Նախ պետք է տեղափոխել կամ փակել ենթահաշիվները։");
      return;
    }

    if (selected.id === accounts[0].id) {
      return;
    }

    const remaining = accounts.filter((account) => account.id !== selected.id);
    setAccounts(remaining);
    setSelectedId(remaining[0]?.id ?? "");
  }

  const partnerRuleText = selected.requiresPartner
    ? "Այս հաշիվը ձևակերպման ժամանակ պարտադիր պահանջում է գործընկեր։"
    : "Այս հաշվի դեպքում ձևակերպման գործընկեր դաշտը պետք է փակ լինի։";

  return (
    <div style={pageStyle}>
      <div style={toolbarStyle}>
        <div>
          <p style={{ margin: 0, color: "#8a6a3e", fontSize: 12, fontWeight: 900, letterSpacing: "0.18em" }}>
            SAFE DEV / Հաշվապահական տարածք
          </p>
          <h1 style={{ margin: "6px 0 0", color: "#102033", fontSize: 32, fontWeight: 950 }}>
            Հաշվային պլան
          </h1>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button type="button" style={primaryButtonStyle} onClick={addRootAccount}>
            + Նոր հաշիվ
          </button>
          <button type="button" style={buttonStyle} onClick={addChildAccount}>
            + Ենթահաշիվ
          </button>
          <button type="button" style={buttonStyle} onClick={closeSelected}>
            Փակել հաշիվը
          </button>
          <button type="button" style={{ ...buttonStyle, color: "#b91c1c" }} onClick={removeSelected}>
            Հեռացնել demo-ում
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "330px minmax(0, 1fr) 330px",
          gap: 16,
          alignItems: "start",
        }}
      >
        <section style={cardStyle}>
          <h2 style={{ margin: "0 0 12px", color: "#102033", fontSize: 18, fontWeight: 950 }}>
            Հաշիվների ծառ
          </h2>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Որոնել կոդով կամ անվանումով"
            style={{ ...inputStyle, marginBottom: 14 }}
          />
          <AccountTree
            accounts={filteredAccounts}
            selectedId={selectedId}
            parentId={null}
            onSelect={setSelectedId}
          />
        </section>

        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
            <div>
              <h2 style={{ margin: 0, color: "#102033", fontSize: 24, fontWeight: 950 }}>
                {selected.code} — {selected.name}
              </h2>
              <p style={{ margin: "6px 0 0", color: "#475569", fontSize: 14, lineHeight: 1.6 }}>
                {partnerRuleText}
              </p>
            </div>
            <Badge tone={selected.isActive ? "good" : "warn"}>
              {selected.isActive ? "Ակտիվ" : "Փակված"}
            </Badge>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <label style={{ display: "grid", gap: 7, fontSize: 13, fontWeight: 850 }}>
              Հաշվի կոդ
              <input value={selected.code} onChange={(event) => updateSelected({ code: event.target.value })} style={inputStyle} />
            </label>

            <label style={{ display: "grid", gap: 7, fontSize: 13, fontWeight: 850 }}>
              Անվանում
              <input value={selected.name} onChange={(event) => updateSelected({ name: event.target.value })} style={inputStyle} />
            </label>

            <label style={{ display: "grid", gap: 7, fontSize: 13, fontWeight: 850 }}>
              Տեսակ
              <select value={selected.type} onChange={(event) => updateSelected({ type: event.target.value as AccountType })} style={inputStyle}>
                {["Ակտիվ", "Պասիվ", "Ակտիվ-պասիվ", "Եկամուտ", "Ծախս", "Արտահաշվեկշռային"].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>

            <label style={{ display: "grid", gap: 7, fontSize: 13, fontWeight: 850 }}>
              Ծնող հաշիվ
              <select
                value={selected.parentId ?? ""}
                onChange={(event) => updateSelected({ parentId: event.target.value || null })}
                style={inputStyle}
              >
                <option value="">Առանց ծնողի</option>
                {accounts
                  .filter((account) => account.id !== selected.id)
                  .map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.code} — {account.name}
                    </option>
                  ))}
              </select>
            </label>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18 }}>
            <label style={buttonStyle}>
              <input
                type="checkbox"
                checked={selected.requiresPartner}
                onChange={(event) => updateSelected({ requiresPartner: event.target.checked })}
                style={{ marginRight: 8 }}
              />
              Գործընկերներով հաշվառում
            </label>

            <label style={buttonStyle}>
              <input
                type="checkbox"
                checked={selected.isOffBalance}
                onChange={(event) => updateSelected({ isOffBalance: event.target.checked })}
                style={{ marginRight: 8 }}
              />
              Արտահաշվեկշռային
            </label>

            <label style={buttonStyle}>
              <input
                type="checkbox"
                checked={selected.requiresCurrency}
                onChange={(event) => enableOrDisableCurrencyAccounting(event.target.checked)}
                style={{ marginRight: 8 }}
              />
              Արժույթային հաշվառում
            </label>

            {selected.requiresCurrency ? (
              <button
                type="button"
                style={{
                  ...buttonStyle,
                  background: "#fff7ed",
                  borderColor: "rgba(180, 83, 9, 0.35)",
                  color: "#9a3412",
                }}
                onClick={() => setIsCurrencyDialogOpen(true)}
              >
                Ընտրել արժույթներ
                {` (${displayCurrencies.join(", ")})`}
              </button>
            ) : null}
          </div>

          <label style={{ display: "grid", gap: 7, marginTop: 16, fontSize: 13, fontWeight: 850 }}>
            Նկարագրություն
            <textarea
              value={selected.description}
              onChange={(event) => updateSelected({ description: event.target.value })}
              rows={4}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.55 }}
            />
          </label>
        </section>

        <aside style={cardStyle}>
          <h2 style={{ margin: "0 0 12px", color: "#102033", fontSize: 18, fontWeight: 950 }}>
            AI ստուգման կանոններ
          </h2>

          <div style={{ display: "grid", gap: 10 }}>
            <Badge tone={selected.requiresPartner ? "warn" : "neutral"}>
              {selected.requiresPartner ? "Գործընկերը պարտադիր է" : "Գործընկեր դաշտը փակ է"}
            </Badge>
            <Badge tone={selected.isOffBalance ? "warn" : "neutral"}>
              {selected.isOffBalance ? "Արտահաշվեկշռային հաշիվ" : "Հաշվեկշռային հաշիվ"}
            </Badge>
            <Badge tone={selected.requiresCurrency ? "warn" : "neutral"}>
              {selected.requiresCurrency
                ? `Արժույթային՝ ${displayCurrencies.join(", ")}`
                : "Հիմնական արժույթ՝ AMD"}
            </Badge>
          </div>

          <div
            style={{
              marginTop: 16,
              border: "1px solid rgba(180, 143, 79, 0.25)",
              borderRadius: 16,
              background: "#fff7ed",
              padding: 14,
              color: "#7c4a03",
              fontSize: 13,
              lineHeight: 1.65,
            }}
          >
            Հետագայում AI-ը այստեղ կստուգի՝ հաշվի տեսակը, ծնող հաշիվը, գործընկերով հաշվառման կանոնը
            և ձևակերպումների ժամանակ դաշտերի թույլատրելիությունը։
          </div>
        </aside>
      </div>

      {isCurrencyDialogOpen ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "grid",
            placeItems: "center",
            background: "rgba(15, 23, 42, 0.42)",
            padding: 20,
          }}
        >
          <div
            style={{
              width: "min(620px, 100%)",
              border: "1px solid rgba(214, 202, 182, 0.95)",
              borderRadius: 24,
              background: "#fffaf2",
              padding: 20,
              boxShadow: "0 28px 85px rgba(15, 23, 42, 0.28)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#8a6a3e",
                    fontSize: 12,
                    fontWeight: 900,
                    letterSpacing: "0.16em",
                  }}
                >
                  Արժույթային հաշվառում
                </p>
                <h3 style={{ margin: "6px 0 0", color: "#102033", fontSize: 24, fontWeight: 950 }}>
                  Ընտրել հաշվի արժույթները
                </h3>
              </div>

              <button
                type="button"
                style={buttonStyle}
                onClick={() => setIsCurrencyDialogOpen(false)}
              >
                Փակել
              </button>
            </div>

            <p style={{ margin: "0 0 14px", color: "#475569", fontSize: 14, lineHeight: 1.6 }}>
              ՀՀ դրամը մնում է հիմնական արժույթ։ Այստեղ ընտրում ենք այն արտարժույթները,
              որոնցով այս հաշիվը կարող է մասնակցել ձևակերպումներին։
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 10,
              }}
            >
              <label
                style={{
                  border: "1px solid #142033",
                  borderRadius: 16,
                  background: "#eef2ff",
                  padding: 12,
                  color: "#172033",
                  fontSize: 14,
                  fontWeight: 850,
                  cursor: "not-allowed",
                  opacity: 0.95,
                }}
              >
                <input
                  type="checkbox"
                  checked
                  disabled
                  style={{ marginRight: 8 }}
                />
                {baseCurrency.code}
                <span style={{ display: "block", marginTop: 4, color: "#475569", fontSize: 12, fontWeight: 750 }}>
                  {baseCurrency.name} · միշտ ակտիվ
                </span>
              </label>

              {availableCurrencies.map((currency) => (
                <label
                  key={currency.code}
                  style={{
                    border: selectedCurrencies.includes(currency.code)
                      ? "1px solid #142033"
                      : "1px solid rgba(214, 202, 182, 0.85)",
                    borderRadius: 16,
                    background: selectedCurrencies.includes(currency.code) ? "#eef2ff" : "#ffffff",
                    padding: 12,
                    color: "#172033",
                    fontSize: 14,
                    fontWeight: 850,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedCurrencies.includes(currency.code)}
                    onChange={() => toggleCurrency(currency.code)}
                    style={{ marginRight: 8 }}
                  />
                  {currency.code}
                  <span style={{ display: "block", marginTop: 4, color: "#64748b", fontSize: 12, fontWeight: 750 }}>
                    {currency.name}
                  </span>
                </label>
              ))}
            </div>

            {selected.requiresCurrency && selectedCurrencies.length === 0 ? (
              <div
                style={{
                  marginTop: 14,
                  border: "1px solid rgba(180, 143, 79, 0.25)",
                  borderRadius: 16,
                  background: "#fff7ed",
                  padding: 12,
                  color: "#7c4a03",
                  fontSize: 13,
                  fontWeight: 850,
                }}
              >
                AMD-ը միշտ ակտիվ է։ Եթե այս հաշիվը պետք է աշխատի արտարժույթով, ընտրիր նաև USD, EUR կամ այլ արտարժույթ։
              </div>
            ) : null}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
              <button
                type="button"
                style={buttonStyle}
                onClick={() => {
                  updateSelected({ requiresCurrency: false, currencies: [] });
                  setIsCurrencyDialogOpen(false);
                }}
              >
                Անջատել արժույթայինը
              </button>

              <button
                type="button"
                style={primaryButtonStyle}
                onClick={() => {
                  setIsCurrencyDialogOpen(false);
                }}
              >
                Պահպանել ընտրությունը
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
