"use client";

import type { CSSProperties, FormEvent } from "react";
import { useMemo, useState } from "react";
import { legalOrganizationTypes } from "@/lib/demo-master-reference-data";

type LegalTypeRow = {
  code: string;
  label: string;
  description: string;
  isActive: boolean;
};

type LegalOrganizationTypesManagerProps = {
  standalone?: boolean;
};

const emptyForm: LegalTypeRow = {
  code: "",
  label: "",
  description: "",
  isActive: true,
};

export function LegalOrganizationTypesManager({
  standalone = false,
}: LegalOrganizationTypesManagerProps) {
  const [rows, setRows] = useState<LegalTypeRow[]>(
    legalOrganizationTypes.map((type) => ({ ...type })),
  );
  const [query, setQuery] = useState("");
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [form, setForm] = useState<LegalTypeRow>(emptyForm);
  const [message, setMessage] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return rows;
    }

    return rows.filter((row) =>
      [row.code, row.label, row.description]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [query, rows]);

  function resetForm() {
    setEditingCode(null);
    setForm(emptyForm);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const next = {
      ...form,
      code: form.code.trim(),
      label: form.label.trim(),
      description: form.description.trim(),
    };

    if (!next.code || !next.label) {
      setMessage("Կոդը և անվանումը պարտադիր են։");
      return;
    }

    const duplicate = rows.some((row) => row.code === next.code && row.code !== editingCode);

    if (duplicate) {
      setMessage("Այս կոդով տեսակ արդեն կա։ Ընտրիր այլ կոդ։");
      return;
    }

    if (editingCode) {
      setRows((current) => current.map((row) => (row.code === editingCode ? next : row)));
      setMessage("Իրավակազմակերպական տեսակը խմբագրվեց demo ռեժիմում։");
      resetForm();
      return;
    }

    setRows((current) => [...current, next]);
    setMessage("Նոր իրավակազմակերպական տեսակ ավելացվեց demo ռեժիմում։");
    resetForm();
  }

  function startEdit(row: LegalTypeRow) {
    setEditingCode(row.code);
    setForm(row);
    setMessage("Խմբագրման ռեժիմ․ փոփոխիր դաշտերը և սեղմիր «Պահպանել»։");
  }

  function removeRow(code: string) {
    const target = rows.find((row) => row.code === code);

    if (!target) {
      return;
    }

    const confirmed = window.confirm(`Հեռացնե՞լ «${target.label}» տեսակը demo ցուցակից։`);

    if (!confirmed) {
      return;
    }

    setRows((current) => current.filter((row) => row.code !== code));

    if (editingCode === code) {
      resetForm();
    }

    setMessage("Տեսակը հեռացվեց demo ցուցակից։ Իրական Master DB-ում սա ավելի ճիշտ է անել ապաակտիվացման միջոցով։");
  }

  return (
    <section style={standalone ? styles.standalonePage : styles.embeddedPage}>
      <div style={styles.headerCard}>
        <p style={styles.kicker}>Կառավարում · Գլխավոր բազա</p>
        <h1 style={styles.title}>Իրավակազմակերպական տեսակներ</h1>
        <p style={styles.text}>
          Սա Master DB demo տեղեկատու է։ Նոր գործընկեր գրանցելիս իրավակազմակերպական
          տեսակը պետք է ընտրվի այս ընդհանուր տեղեկատուից։
        </p>
      </div>

      <form style={styles.formCard} onSubmit={handleSubmit}>
        <div style={styles.formHeader}>
          <h2 style={styles.cardTitle}>{editingCode ? "Խմբագրել տեսակ" : "Ավելացնել նոր տեսակ"}</h2>
          {message ? <p style={styles.message}>{message}</p> : null}
        </div>

        <label style={styles.label}>
          Կոդ
          <input
            style={styles.input}
            value={form.code}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                code: event.target.value,
              }))
            }
            placeholder="Օրինակ՝ cooperative"
          />
        </label>

        <label style={styles.label}>
          Անվանում
          <input
            style={styles.input}
            value={form.label}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                label: event.target.value,
              }))
            }
            placeholder="Օրինակ՝ Կոոպերատիվ"
          />
        </label>

        <label style={styles.label}>
          Կարգավիճակ
          <select
            style={styles.input}
            value={form.isActive ? "active" : "inactive"}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                isActive: event.target.value === "active",
              }))
            }
          >
            <option value="active">Ակտիվ</option>
            <option value="inactive">Ոչ ակտիվ</option>
          </select>
        </label>

        <label style={{ ...styles.label, gridColumn: "1 / -1" }}>
          Նկարագրություն
          <textarea
            style={{ ...styles.input, minHeight: 78, resize: "vertical" }}
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            placeholder="Կարճ բացատրություն"
          />
        </label>

        <div style={styles.actions}>
          <button style={styles.primaryButton} type="submit">
            {editingCode ? "Պահպանել" : "Ավելացնել"}
          </button>
          <button style={styles.secondaryButton} type="button" onClick={resetForm}>
            Մաքրել
          </button>
        </div>
      </form>

      <section style={styles.listCard}>
        <div style={styles.listHeader}>
          <div>
            <h2 style={styles.cardTitle}>Տեսակների ցանկ</h2>
            <p style={styles.smallText}>
              Ցուցադրվում է {filteredRows.length} / {rows.length} տեսակ
            </p>
          </div>

          <input
            style={styles.searchInput}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Որոնել..."
          />
        </div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Կոդ</th>
                <th style={styles.th}>Անվանում</th>
                <th style={styles.th}>Նկարագրություն</th>
                <th style={styles.th}>Կարգավիճակ</th>
                <th style={styles.th}>Գործողություն</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.code}>
                  <td style={styles.td}>{row.code}</td>
                  <td style={styles.td}>
                    <strong>{row.label}</strong>
                  </td>
                  <td style={styles.td}>{row.description}</td>
                  <td style={styles.td}>{row.isActive ? "Ակտիվ" : "Ոչ ակտիվ"}</td>
                  <td style={styles.td}>
                    <div style={styles.rowActions}>
                      <button style={styles.smallButton} type="button" onClick={() => startEdit(row)}>
                        Խմբագրել
                      </button>
                      <button style={styles.dangerButton} type="button" onClick={() => removeRow(row.code)}>
                        Հեռացնել
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

const styles: Record<string, CSSProperties> = {
  standalonePage: {
    minHeight: "100vh",
    padding: 32,
    background: "#f7f2ea",
    color: "#1f2937",
    fontFamily: "Arial, sans-serif",
  },
  embeddedPage: {
    display: "grid",
    gap: 18,
    color: "#1f2937",
  },
  headerCard: {
    padding: 22,
    border: "1px solid #e5d8c6",
    borderRadius: 20,
    background: "#fffaf2",
  },
  kicker: {
    margin: "0 0 8px",
    color: "#8a6d3b",
    fontWeight: 700,
  },
  title: {
    margin: "0 0 12px",
    fontSize: 30,
  },
  text: {
    margin: 0,
    maxWidth: 850,
    color: "#4b5563",
    lineHeight: 1.6,
  },
  formCard: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 14,
    padding: 18,
    border: "1px solid #e5d8c6",
    borderRadius: 20,
    background: "#ffffff",
    boxShadow: "0 12px 30px rgba(31, 41, 55, 0.06)",
  },
  formHeader: {
    gridColumn: "1 / -1",
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "start",
  },
  cardTitle: {
    margin: 0,
    fontSize: 20,
  },
  label: {
    display: "grid",
    gap: 6,
    fontWeight: 700,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #d1d5db",
    borderRadius: 12,
    padding: "11px 12px",
    fontSize: 14,
    background: "#ffffff",
  },
  actions: {
    gridColumn: "1 / -1",
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  primaryButton: {
    border: "none",
    borderRadius: 12,
    padding: "11px 16px",
    background: "#111827",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 700,
  },
  secondaryButton: {
    border: "1px solid #d1d5db",
    borderRadius: 12,
    padding: "11px 16px",
    background: "#ffffff",
    cursor: "pointer",
    fontWeight: 700,
  },
  message: {
    margin: 0,
    color: "#166534",
    lineHeight: 1.5,
  },
  listCard: {
    padding: 18,
    border: "1px solid #e5d8c6",
    borderRadius: 20,
    background: "#ffffff",
    boxShadow: "0 12px 30px rgba(31, 41, 55, 0.06)",
  },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    alignItems: "start",
    marginBottom: 14,
  },
  smallText: {
    margin: "6px 0 0",
    color: "#6b7280",
    fontSize: 13,
  },
  searchInput: {
    minWidth: 220,
    border: "1px solid #d1d5db",
    borderRadius: 12,
    padding: "10px 12px",
  },
  tableWrap: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 760,
  },
  th: {
    textAlign: "left",
    padding: "12px 10px",
    borderBottom: "1px solid #e5e7eb",
    color: "#6b7280",
    fontSize: 13,
  },
  td: {
    padding: "12px 10px",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "top",
  },
  rowActions: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  smallButton: {
    border: "1px solid #d1d5db",
    borderRadius: 10,
    padding: "8px 10px",
    background: "#ffffff",
    cursor: "pointer",
  },
  dangerButton: {
    border: "1px solid #fecaca",
    borderRadius: 10,
    padding: "8px 10px",
    background: "#fff1f2",
    color: "#991b1b",
    cursor: "pointer",
  },
};
