"use client";

import { useState } from "react";
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

function Field({ label, value, placeholder, onChange }: FieldProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      <span>{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500"
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
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      <span>{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 disabled:bg-slate-100 disabled:text-slate-500"
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
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>
      {children}
    </section>
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
      requisites: {
        ...current.requisites,
        [key]: value,
      },
    }));
  }

  function updateLegal(
    key: keyof NewPartnerRegistrationDraft["legal"],
    value: string,
  ) {
    setDraft((current) => ({
      ...current,
      legal: {
        ...current.legal,
        [key]: value,
      },
    }));
  }

  function renderRequisitesTab() {
    return (
      <SectionCard
        title="Ռեկվիզիտներ"
        description="Այստեղ պահում ենք գործընկերոջ հիմնական գրանցման տվյալները։ ՀՎՀՀ-ն կազմակերպության կամ ԱՁ-ի տվյալ է։"
      >
        <div className="grid gap-4 md:grid-cols-2">
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
            placeholder="թույլատրված են թվեր և կետեր, max 20 նիշ"
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
      </SectionCard>
    );
  }

  function renderLegalTab() {
    const isResident = draft.legal.residencyStatus === "ՀՀ ռեզիդենտ";

    return (
      <SectionCard
        title="Իրավաբանական"
        description="Այստեղ նշում ենք իրավակազմակերպական տեսակը, ռեզիդենտությունը և իրավաբանական հասցեն։"
      >
        <div className="grid gap-4 md:grid-cols-2">
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
        description="Գործընկերը կարող է ունենալ մի քանի գործունեության տեսակ, որոնցից մեկը նշվում է որպես հիմնական։"
      >
        <div className="grid gap-4">
          <Field
            label="Գործունեության հասցե"
            value={draft.activities.activityAddress}
            placeholder="նշել գործունեության իրական հասցեն"
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                activities: {
                  ...current.activities,
                  activityAddress: value,
                },
              }))
            }
          />

          <div className="grid gap-3">
            {draft.activities.items.map((item, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_160px_140px_auto]"
              >
                <SelectField
                  label="Գործունեության տեսակ"
                  value={item.activityType}
                  options={defaultActivityTypeOptions}
                  onChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      activities: {
                        ...current.activities,
                        items: current.activities.items.map((activity, activityIndex) =>
                          activityIndex === index
                            ? { ...activity, activityType: value }
                            : activity,
                        ),
                      },
                    }))
                  }
                />
                <Field
                  label="Կոդ"
                  value={item.activityCode}
                  placeholder="օր․ 41.20"
                  onChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      activities: {
                        ...current.activities,
                        items: current.activities.items.map((activity, activityIndex) =>
                          activityIndex === index
                            ? { ...activity, activityCode: value }
                            : activity,
                        ),
                      },
                    }))
                  }
                />
                <label className="flex items-center gap-2 pt-7 text-sm font-semibold text-slate-700">
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
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      activities: {
                        ...current.activities,
                        items: current.activities.items.filter(
                          (_, activityIndex) => activityIndex !== index,
                        ),
                      },
                    }))
                  }
                  className="mt-6 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                >
                  Ջնջել
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
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
            className="w-fit rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700"
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
        description="Հիմնադիրը կարող է լինել ֆիզիկական կամ իրավաբանական անձ։ Ֆիզ․ անձի համար օգտագործում ենք ՀԾՀ և անձնագրային / ID տվյալներ, ոչ թե ՀՎՀՀ։"
      >
        <div className="grid gap-3">
          {draft.founders.map((founder, index) => {
            const isIndividual = founder.founderType === "Ֆիզիկական անձ";

            return (
              <div
                key={index}
                className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2"
              >
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
                            itemIndex === index
                              ? { ...item, socialCardNumber: value }
                              : item,
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
                            itemIndex === index
                              ? { ...item, passportOrIdNumber: value }
                              : item,
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
            );
          })}

          <button
            type="button"
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
            className="w-fit rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700"
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
        description="Ստորաբաժանումները կազմակերպության կառուցվածքի մաս են, ոչ թե աշխատակցի պարզ text field։"
      >
        <div className="grid gap-3">
          {draft.departments.map((department, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_160px_auto]"
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
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    departments: current.departments.filter(
                      (_, departmentIndex) => departmentIndex !== index,
                    ),
                  }))
                }
                className="mt-6 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
              >
                Ջնջել
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setDraft((current) => ({
                ...current,
                departments: [
                  ...current.departments,
                  {
                    name: "",
                    code: "",
                  },
                ],
              }))
            }
            className="w-fit rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700"
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
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
          Այս թաբի դաշտերը կմիացնենք հաջորդ փոքր քայլերով։
        </div>
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
        "Այստեղ հետո կնշանակենք պատասխանատու հաշվապահներին, բաժինները և սպասարկման scope-երը։",
      );
    }

    return renderPlaceholderTab(
      "Պայմանագիր",
      "Այստեղ հետո կմիացնենք պայմանագրի և սակագնի դաշտերը։",
    );
  }

  return (
    <div className="grid gap-5">
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        SAFE DEV preview է․ այս էջը դեռ չի պահպանում տվյալները DB-ում։
      </div>

      <div className="flex flex-wrap gap-2">
        {newPartnerRegistrationTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              activeTab === tab
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {renderActiveTab()}
    </div>
  );
}
