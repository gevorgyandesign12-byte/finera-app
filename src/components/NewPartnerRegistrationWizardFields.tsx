"use client";

import { useState, type CSSProperties } from "react";
import {
  countryOptions,
  createEmptyNewPartnerRegistrationDraft,
  defaultActivityTypeOptions,
  founderTypeOptions,
  legalFormOptions,
  newPartnerRegistrationTabs,
  normalizeStateRegistryNumber,
  residencyStatusOptions,
  resolveCountryByResidencyStatus,
  type NewPartnerRegistrationDraft,
  type NewPartnerRegistrationTab,
} from "../lib/new-partner-registration";

type FieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

const cardStyle: CSSProperties = {
  border: "1px solid rgba(214, 202, 182, 0.9)",
  borderRadius: 22,
  background: "#fffaf2",
  padding: 22,
  boxShadow: "0 16px 45px rgba(45, 35, 20, 0.08)",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: 16,
};

const labelStyle: CSSProperties = {
  display: "grid",
  gap: 7,
  color: "#172033",
  fontSize: 13,
  fontWeight: 800,
};

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid rgba(148, 134, 112, 0.42)",
  borderRadius: 13,
  background: "#ffffff",
  padding: "11px 12px",
  color: "#111827",
  fontSize: 14,
  outline: "none",
};

const smallButtonStyle: CSSProperties = {
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
  border: 0,
  borderRadius: 15,
  background: "#142033",
  padding: "12px 16px",
  color: "#ffffff",
  fontSize: 14,
  fontWeight: 900,
  cursor: "pointer",
};

function Field({ label, value, placeholder, onChange }: FieldProps) {
  return (
    <label style={labelStyle}>
      <span>{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        style={inputStyle}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  disabled = false,
  onChange,
}: FieldProps & {
  options: readonly string[];
  disabled?: boolean;
}) {
  return (
    <label style={labelStyle}>
      <span>{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        style={{
          ...inputStyle,
          cursor: disabled ? "not-allowed" : "pointer",
          background: disabled ? "#f1f5f9" : "#ffffff",
          color: disabled ? "#64748b" : "#111827",
        }}
      >
        <option value="">Ընտրել</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section style={cardStyle}>
      <div style={{ marginBottom: 18 }}>
        <h2
          style={{
            margin: 0,
            color: "#102033",
            fontSize: 23,
            lineHeight: 1.2,
            fontWeight: 950,
          }}
        >
          {title}
        </h2>
        <p style={{ margin: "7px 0 0", color: "#475569", fontSize: 14, lineHeight: 1.65 }}>
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}

function InlineNote({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid rgba(180, 143, 79, 0.25)",
        borderRadius: 16,
        background: "#fff7ed",
        padding: "12px 14px",
        color: "#7c4a03",
        fontSize: 13,
        lineHeight: 1.6,
      }}
    >
      {children}
    </div>
  );
}

export function NewPartnerRegistrationWizardFields() {
  const [activeTab, setActiveTab] =
    useState<NewPartnerRegistrationTab>("Ռեկվիզիտներ");
  const [draft, setDraft] = useState<NewPartnerRegistrationDraft>(() =>
    createEmptyNewPartnerRegistrationDraft(),
  );

  function updateRequisites(
    key: keyof NewPartnerRegistrationDraft["requisites"],
    value: string,
  ) {
    setDraft((current) => ({
      ...current,
      requisites: { ...current.requisites, [key]: value },
    }));
  }

  function updateLegal(
    key: keyof NewPartnerRegistrationDraft["legal"],
    value: string,
  ) {
    setDraft((current) => ({
      ...current,
      legal: { ...current.legal, [key]: value },
    }));
  }

  function updateActivityItem(index: number, patch: Partial<{ activityType: string; activityCode: string; isMain: boolean }>) {
    setDraft((current) => ({
      ...current,
      activities: {
        ...current.activities,
        items: current.activities.items.map((item, itemIndex) =>
          itemIndex === index ? { ...item, ...patch } : item,
        ),
      },
    }));
  }

  function renderRequisitesTab() {
    return (
      <SectionCard
        title="Ռեկվիզիտներ"
        description="Գրանցման առաջին քայլը՝ կազմակերպության կամ ԱՁ-ի նույնականացնող տվյալները։"
      >
        <div style={gridStyle}>
          <Field
            label="Կազմակերպության / ԱՁ անվանում"
            value={draft.requisites.name}
            placeholder="օր․ Սոսե ՍՊԸ"
            onChange={(value) => updateRequisites("name", value)}
          />
          <Field
            label="ՀՎՀՀ"
            value={draft.requisites.taxNumber}
            placeholder="օր․ 01234567"
            onChange={(value) => updateRequisites("taxNumber", value)}
          />
          <Field
            label="Պետ․ ռեգիստրի համար"
            value={draft.requisites.stateRegistryNumber}
            placeholder="թվեր և կետեր, max 20 նիշ"
            onChange={(value) =>
              updateRequisites("stateRegistryNumber", normalizeStateRegistryNumber(value))
            }
          />
          <Field
            label="Փոստային ինդեքս"
            value={draft.requisites.postalIndex}
            placeholder="օր․ 0010"
            onChange={(value) => updateRequisites("postalIndex", value)}
          />
        </div>

        <div style={{ marginTop: 18 }}>
          <button
            type="button"
            style={primaryButtonStyle}
            onClick={() => setActiveTab("Իրավաբանական")}
          >
            Պահպանել և անցնել իրավաբանական բաժին
          </button>
        </div>
      </SectionCard>
    );
  }

  function renderLegalTab() {
    const isResident = draft.legal.residencyStatus === "ՀՀ ռեզիդենտ";

    return (
      <SectionCard
        title="Իրավաբանական"
        description="Իրավակազմակերպական տեսակը, ռեզիդենտությունը և իրավաբանական հասցեն։"
      >
        <div style={gridStyle}>
          <SelectField
            label="Իրավակազմակերպական տեսակ"
            value={draft.legal.legalForm}
            options={legalFormOptions}
            onChange={(value) => updateLegal("legalForm", value)}
          />
          <SelectField
            label="Ռեզիդենտություն"
            value={draft.legal.residencyStatus}
            options={residencyStatusOptions}
            onChange={(value) => {
              setDraft((current) => ({
                ...current,
                legal: {
                  ...current.legal,
                  residencyStatus: value,
                  country: resolveCountryByResidencyStatus(value, current.legal.country),
                },
              }));
            }}
          />
          <SelectField
            label="Երկիր"
            value={draft.legal.country}
            options={countryOptions}
            disabled={isResident}
            onChange={(value) => updateLegal("country", value)}
          />
          <Field
            label="Մարզ"
            value={draft.legal.region}
            placeholder="օր․ Երևան / Կոտայք"
            onChange={(value) => updateLegal("region", value)}
          />
          <Field
            label="Քաղաք / համայնք"
            value={draft.legal.city}
            placeholder="օր․ Երևան"
            onChange={(value) => updateLegal("city", value)}
          />
          <Field
            label="Փողոց"
            value={draft.legal.street}
            placeholder="օր․ Աբովյան"
            onChange={(value) => updateLegal("street", value)}
          />
          <SelectField
            label="Շենք / տուն"
            value={draft.legal.buildingType}
            options={["Շենք", "Տուն", "Տարածք", "Այլ"]}
            onChange={(value) => updateLegal("buildingType", value)}
          />
          <Field
            label="Համար"
            value={draft.legal.buildingNumber}
            placeholder="օր․ 12/3"
            onChange={(value) => updateLegal("buildingNumber", value)}
          />
        </div>
      </SectionCard>
    );
  }

  function renderActivityTab() {
    return (
      <SectionCard
        title="Գործունեություն"
        description="Գործունեության հասցե, տեսակներ և կոդեր։ Մեկ գործունեություն նշվում է որպես հիմնական։"
      >
        <div style={{ display: "grid", gap: 16 }}>
          <Field
            label="Գործունեության հասցե"
            value={draft.activities.activityAddress}
            placeholder="նշել իրական գործունեության հասցեն"
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                activities: { ...current.activities, activityAddress: value },
              }))
            }
          />

          {draft.activities.items.map((item, index) => (
            <div
              key={index}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(220px, 1fr) 150px 120px auto",
                gap: 12,
                alignItems: "end",
                border: "1px solid rgba(214, 202, 182, 0.7)",
                borderRadius: 18,
                background: "#fffdfa",
                padding: 14,
              }}
            >
              <SelectField
                label="Գործունեության տեսակ"
                value={item.activityType}
                options={defaultActivityTypeOptions}
                onChange={(value) => updateActivityItem(index, { activityType: value })}
              />
              <Field
                label="Կոդ"
                value={item.activityCode}
                placeholder="օր․ 41.20"
                onChange={(value) => updateActivityItem(index, { activityCode: value })}
              />
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  height: 41,
                  color: "#172033",
                  fontSize: 13,
                  fontWeight: 850,
                }}
              >
                <input
                  type="checkbox"
                  checked={item.isMain}
                  onChange={() =>
                    setDraft((current) => ({
                      ...current,
                      activities: {
                        ...current.activities,
                        items: current.activities.items.map((activity, activityIndex) => ({
                          ...activity,
                          isMain: activityIndex === index,
                        })),
                      },
                    }))
                  }
                />
                Հիմնական
              </label>
              <button
                type="button"
                style={{ ...smallButtonStyle, color: "#b91c1c" }}
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    activities: {
                      ...current.activities,
                      items: current.activities.items.filter((_, itemIndex) => itemIndex !== index),
                    },
                  }))
                }
              >
                Ջնջել
              </button>
            </div>
          ))}

          <button
            type="button"
            style={{ ...smallButtonStyle, width: "fit-content" }}
            onClick={() =>
              setDraft((current) => ({
                ...current,
                activities: {
                  ...current.activities,
                  items: [
                    ...current.activities.items,
                    {
                      activityType: "",
                      activityCode: "",
                      isMain: current.activities.items.length === 0,
                    },
                  ],
                },
              }))
            }
          >
            + Ավելացնել գործունեության տեսակ
          </button>
        </div>
      </SectionCard>
    );
  }

  function renderFoundersTab() {
    return (
      <SectionCard
        title="Հիմնադիրներ"
        description="Հիմնադիրը կարող է լինել ֆիզիկական կամ իրավաբանական անձ։"
      >
        <div style={{ display: "grid", gap: 14 }}>
          {draft.founders.map((founder, index) => {
            const isIndividual = founder.founderType === "Ֆիզիկական անձ";

            return (
              <div
                key={index}
                style={{
                  border: "1px solid rgba(214, 202, 182, 0.7)",
                  borderRadius: 18,
                  background: "#fffdfa",
                  padding: 14,
                }}
              >
                <div style={gridStyle}>
                  <SelectField
                    label="Հիմնադրի տեսակ"
                    value={founder.founderType}
                    options={founderTypeOptions}
                    onChange={(value) =>
                      setDraft((current) => ({
                        ...current,
                        founders: current.founders.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, founderType: value } : item,
                        ),
                      }))
                    }
                  />
                  <Field
                    label="Անուն / անվանում"
                    value={founder.name}
                    onChange={(value) =>
                      setDraft((current) => ({
                        ...current,
                        founders: current.founders.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, name: value } : item,
                        ),
                      }))
                    }
                  />
                  {isIndividual ? (
                    <>
                      <Field
                        label="ՀԾՀ"
                        value={founder.socialCardNumber}
                        onChange={(value) =>
                          setDraft((current) => ({
                            ...current,
                            founders: current.founders.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, socialCardNumber: value } : item,
                            ),
                          }))
                        }
                      />
                      <Field
                        label="Անձնագիր / ID համար"
                        value={founder.passportOrIdNumber}
                        onChange={(value) =>
                          setDraft((current) => ({
                            ...current,
                            founders: current.founders.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, passportOrIdNumber: value } : item,
                            ),
                          }))
                        }
                      />
                    </>
                  ) : (
                    <Field
                      label="ՀՎՀՀ"
                      value={founder.taxNumber}
                      onChange={(value) =>
                        setDraft((current) => ({
                          ...current,
                          founders: current.founders.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, taxNumber: value } : item,
                          ),
                        }))
                      }
                    />
                  )}
                  <Field
                    label="Բաժնեմաս %"
                    value={founder.sharePercent}
                    placeholder="օր․ 100"
                    onChange={(value) =>
                      setDraft((current) => ({
                        ...current,
                        founders: current.founders.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, sharePercent: value } : item,
                        ),
                      }))
                    }
                  />
                </div>
              </div>
            );
          })}

          <button
            type="button"
            style={{ ...smallButtonStyle, width: "fit-content" }}
            onClick={() =>
              setDraft((current) => ({
                ...current,
                founders: [
                  ...current.founders,
                  {
                    founderType: "Ֆիզիկական անձ",
                    name: "",
                    socialCardNumber: "",
                    passportOrIdNumber: "",
                    taxNumber: "",
                    sharePercent: "",
                  },
                ],
              }))
            }
          >
            + Ավելացնել հիմնադիր
          </button>
        </div>
      </SectionCard>
    );
  }

  function renderDepartmentsTab() {
    return (
      <SectionCard
        title="Կառուցվածքային ստորաբաժանումներ"
        description="Ստորաբաժանումները կազմակերպության կառուցվածքի մաս են։"
      >
        <div style={{ display: "grid", gap: 14 }}>
          {draft.departments.map((department, index) => (
            <div
              key={index}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(220px, 1fr) 140px auto",
                gap: 12,
                alignItems: "end",
                border: "1px solid rgba(214, 202, 182, 0.7)",
                borderRadius: 18,
                background: "#fffdfa",
                padding: 14,
              }}
            >
              <Field
                label="Ստորաբաժանում"
                value={department.name}
                onChange={(value) =>
                  setDraft((current) => ({
                    ...current,
                    departments: current.departments.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, name: value } : item,
                    ),
                  }))
                }
              />
              <Field
                label="Կոդ"
                value={department.code}
                onChange={(value) =>
                  setDraft((current) => ({
                    ...current,
                    departments: current.departments.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, code: value } : item,
                    ),
                  }))
                }
              />
              <button
                type="button"
                style={{ ...smallButtonStyle, color: "#b91c1c" }}
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    departments: current.departments.filter((_, itemIndex) => itemIndex !== index),
                  }))
                }
              >
                Ջնջել
              </button>
            </div>
          ))}

          <button
            type="button"
            style={{ ...smallButtonStyle, width: "fit-content" }}
            onClick={() =>
              setDraft((current) => ({
                ...current,
                departments: [...current.departments, { name: "", code: "" }],
              }))
            }
          >
            + Ավելացնել նոր ստորաբաժանում
          </button>
        </div>
      </SectionCard>
    );
  }

  function renderPlaceholderTab(title: string, description: string) {
    return (
      <SectionCard title={title} description={description}>
        <InlineNote>Այս բաժնի դաշտերը կմիացնենք հաջորդ փոքր քայլերով։</InlineNote>
      </SectionCard>
    );
  }

  function renderActiveTab() {
    if (activeTab === "Ռեկվիզիտներ") return renderRequisitesTab();
    if (activeTab === "Իրավաբանական") return renderLegalTab();
    if (activeTab === "Գործունեություն") return renderActivityTab();
    if (activeTab === "Հիմնադիրներ") return renderFoundersTab();
    if (activeTab === "Կառուցվածքային ստորաբաժանումներ") return renderDepartmentsTab();
    if (activeTab === "Սպասարկման նշանակում") {
      return renderPlaceholderTab(
        "Սպասարկման նշանակում",
        "Այստեղ կնշանակենք պատասխանատու հաշվապահներին և սպասարկման scope-երը։",
      );
    }

    return renderPlaceholderTab("Պայմանագիր", "Այստեղ կմիացնենք պայմանագրի և սակագնի դաշտերը։");
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <InlineNote>
        SAFE DEV preview է․ այս էջը դեռ չի պահպանում տվյալները DB-ում։
      </InlineNote>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          borderBottom: "1px solid rgba(214, 202, 182, 0.9)",
          paddingBottom: 10,
        }}
      >
        {newPartnerRegistrationTabs.map((tab) => {
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{
                border: isActive ? "1px solid #142033" : "1px solid rgba(148, 134, 112, 0.35)",
                borderRadius: 999,
                background: isActive ? "#142033" : "#fffaf2",
                padding: "9px 14px",
                color: isActive ? "#ffffff" : "#172033",
                fontSize: 13,
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {renderActiveTab()}
    </div>
  );
}
