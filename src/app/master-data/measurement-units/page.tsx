"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type UnitType =
  | "կշիռ"
  | "հեղուկ"
  | "ծավալ"
  | "երկարություն"
  | "մակերես"
  | "քանակ"
  | "փաթեթավորում"
  | "ժամանակ"
  | "էներգիա"
  | "ծառայություն"
  | "այլ";

type MeasurementUnit = {
  id: string;
  code: string;
  nameHy: string;
  symbolHy: string;
  unitType: UnitType;
  decimalPlaces: number;
  isActive: boolean;
  note: string;
};

const demoUnits: MeasurementUnit[] = [
  { id: "unit-1001", code: "1001", nameHy: "միլիգրամ", symbolHy: "մգ", unitType: "կշիռ", decimalPlaces: 3, isActive: true, note: "Կշիռ · շատ փոքր քաշերի համար" },
  { id: "unit-1002", code: "1002", nameHy: "գրամ", symbolHy: "գ", unitType: "կշիռ", decimalPlaces: 3, isActive: true, note: "Կշիռ · ոսկերչություն, արտադրություն, պահեստ" },
  { id: "unit-1003", code: "1003", nameHy: "կիլոգրամ", symbolHy: "կգ", unitType: "կշիռ", decimalPlaces: 3, isActive: true, note: "Կշիռ · 1 կգ = 1000 գ" },
  { id: "unit-1004", code: "1004", nameHy: "ցենտներ", symbolHy: "ց", unitType: "կշիռ", decimalPlaces: 3, isActive: true, note: "Կշիռ · մեծաքանակ ապրանքների համար" },
  { id: "unit-1005", code: "1005", nameHy: "տոննա", symbolHy: "տ", unitType: "կշիռ", decimalPlaces: 3, isActive: true, note: "Կշիռ · մեծաքանակ նյութեր" },
  { id: "unit-1006", code: "1006", nameHy: "կարատ", symbolHy: "ct", unitType: "կշիռ", decimalPlaces: 3, isActive: true, note: "Կշիռ · թանկարժեք քարերի համար" },
  { id: "unit-1007", code: "1007", nameHy: "ունցիա", symbolHy: "oz", unitType: "կշիռ", decimalPlaces: 3, isActive: true, note: "Կշիռ · ներմուծման/արտահանման փաստաթղթերում կարող է հանդիպել" },
  { id: "unit-1008", code: "1008", nameHy: "ֆունտ", symbolHy: "lb", unitType: "կշիռ", decimalPlaces: 3, isActive: true, note: "Կշիռ · ներմուծման փաստաթղթերի համար" },

  { id: "unit-2001", code: "2001", nameHy: "միլիլիտր", symbolHy: "մլ", unitType: "հեղուկ", decimalPlaces: 3, isActive: true, note: "Հեղուկների չափում" },
  { id: "unit-2002", code: "2002", nameHy: "լիտր", symbolHy: "լ", unitType: "հեղուկ", decimalPlaces: 3, isActive: true, note: "Հեղուկների հիմնական չափում" },
  { id: "unit-2003", code: "2003", nameHy: "դեկալիտր", symbolHy: "դալ", unitType: "հեղուկ", decimalPlaces: 3, isActive: true, note: "Հեղուկ · 1 դալ = 10 լ" },
  { id: "unit-2004", code: "2004", nameHy: "հեկտոլիտր", symbolHy: "հլ", unitType: "հեղուկ", decimalPlaces: 3, isActive: true, note: "Հեղուկ · մեծ ծավալների համար" },
  { id: "unit-2005", code: "2005", nameHy: "գալոն", symbolHy: "gal", unitType: "հեղուկ", decimalPlaces: 3, isActive: true, note: "Հեղուկ · ներմուծման փաստաթղթերում կարող է հանդիպել" },
  { id: "unit-2006", code: "2006", nameHy: "բարել", symbolHy: "bbl", unitType: "հեղուկ", decimalPlaces: 3, isActive: true, note: "Հեղուկ · նավթամթերք և հատուկ ապրանքներ" },

  { id: "unit-3001", code: "3001", nameHy: "խորանարդ միլիմետր", symbolHy: "մմ³", unitType: "ծավալ", decimalPlaces: 3, isActive: true, note: "Ծավալային չափում" },
  { id: "unit-3002", code: "3002", nameHy: "խորանարդ սանտիմետր", symbolHy: "սմ³", unitType: "ծավալ", decimalPlaces: 3, isActive: true, note: "Ծավալային չափում" },
  { id: "unit-3003", code: "3003", nameHy: "խորանարդ դեցիմետր", symbolHy: "դմ³", unitType: "ծավալ", decimalPlaces: 3, isActive: true, note: "Ծավալային չափում" },
  { id: "unit-3004", code: "3004", nameHy: "խորանարդ մետր", symbolHy: "մ³", unitType: "ծավալ", decimalPlaces: 3, isActive: true, note: "Ծավալ · շինանյութ, փայտանյութ, պահեստ" },

  { id: "unit-4001", code: "4001", nameHy: "միլիմետր", symbolHy: "մմ", unitType: "երկարություն", decimalPlaces: 3, isActive: true, note: "Երկարություն" },
  { id: "unit-4002", code: "4002", nameHy: "սանտիմետր", symbolHy: "սմ", unitType: "երկարություն", decimalPlaces: 3, isActive: true, note: "Երկարություն" },
  { id: "unit-4003", code: "4003", nameHy: "դեցիմետր", symbolHy: "դմ", unitType: "երկարություն", decimalPlaces: 3, isActive: true, note: "Երկարություն" },
  { id: "unit-4004", code: "4004", nameHy: "մետր", symbolHy: "մ", unitType: "երկարություն", decimalPlaces: 3, isActive: true, note: "Երկարություն · 1 մ = 100 սմ" },
  { id: "unit-4005", code: "4005", nameHy: "կիլոմետր", symbolHy: "կմ", unitType: "երկարություն", decimalPlaces: 3, isActive: true, note: "Երկարություն" },
  { id: "unit-4006", code: "4006", nameHy: "դյույմ", symbolHy: "in", unitType: "երկարություն", decimalPlaces: 3, isActive: true, note: "Երկարություն · ներմուծման փաստաթղթերում կարող է հանդիպել" },
  { id: "unit-4007", code: "4007", nameHy: "ֆուտ", symbolHy: "ft", unitType: "երկարություն", decimalPlaces: 3, isActive: true, note: "Երկարություն · ներմուծման փաստաթղթերում կարող է հանդիպել" },

  { id: "unit-5001", code: "5001", nameHy: "քառակուսի միլիմետր", symbolHy: "մմ²", unitType: "մակերես", decimalPlaces: 3, isActive: true, note: "Մակերես" },
  { id: "unit-5002", code: "5002", nameHy: "քառակուսի սանտիմետր", symbolHy: "սմ²", unitType: "մակերես", decimalPlaces: 3, isActive: true, note: "Մակերես" },
  { id: "unit-5003", code: "5003", nameHy: "քառակուսի դեցիմետր", symbolHy: "դմ²", unitType: "մակերես", decimalPlaces: 3, isActive: true, note: "Մակերես · կաշվի արտադրության համար կարևոր" },
  { id: "unit-5004", code: "5004", nameHy: "քառակուսի մետր", symbolHy: "մ²", unitType: "մակերես", decimalPlaces: 3, isActive: true, note: "Մակերես · 1 մ² = 100 դմ²" },
  { id: "unit-5005", code: "5005", nameHy: "ար", symbolHy: "ա", unitType: "մակերես", decimalPlaces: 3, isActive: true, note: "Մակերես · հողամասերի համար" },
  { id: "unit-5006", code: "5006", nameHy: "հեկտար", symbolHy: "հա", unitType: "մակերես", decimalPlaces: 3, isActive: true, note: "Մակերես · հողամասերի համար" },

  { id: "unit-6001", code: "6001", nameHy: "հատ", symbolHy: "հատ", unitType: "քանակ", decimalPlaces: 0, isActive: true, note: "Քանակ · հիմնական հատային հաշվառում" },
  { id: "unit-6002", code: "6002", nameHy: "զույգ", symbolHy: "զույգ", unitType: "քանակ", decimalPlaces: 0, isActive: true, note: "Քանակ · կոշիկ, ձեռնոց և նման ապրանքներ" },
  { id: "unit-6003", code: "6003", nameHy: "կոմպլեկտ", symbolHy: "կոմպլ.", unitType: "քանակ", decimalPlaces: 0, isActive: true, note: "Քանակ · հավաքածու" },
  { id: "unit-6004", code: "6004", nameHy: "լրակազմ", symbolHy: "լրակազմ", unitType: "քանակ", decimalPlaces: 0, isActive: true, note: "Քանակ · ապրանքային լրակազմ" },
  { id: "unit-6005", code: "6005", nameHy: "պայմանական միավոր", symbolHy: "պմ", unitType: "քանակ", decimalPlaces: 3, isActive: true, note: "Քանակ · երբ հաշվառումը պայմանական է" },

  { id: "unit-6101", code: "6101", nameHy: "փաթեթ", symbolHy: "փաթ.", unitType: "փաթեթավորում", decimalPlaces: 0, isActive: true, note: "Փաթեթավորում · փոխարկումը ապրանքի քարտում" },
  { id: "unit-6102", code: "6102", nameHy: "տուփ", symbolHy: "տուփ", unitType: "փաթեթավորում", decimalPlaces: 0, isActive: true, note: "Փաթեթավորում · օրինակ 1 տուփ = 12 հատ՝ ապրանքի քարտում" },
  { id: "unit-6103", code: "6103", nameHy: "պարկ", symbolHy: "պարկ", unitType: "փաթեթավորում", decimalPlaces: 0, isActive: true, note: "Փաթեթավորում · օրինակ 1 պարկ = 25 կգ՝ ապրանքի քարտում" },
  { id: "unit-6104", code: "6104", nameHy: "շիշ", symbolHy: "շիշ", unitType: "փաթեթավորում", decimalPlaces: 0, isActive: true, note: "Փաթեթավորում" },
  { id: "unit-6105", code: "6105", nameHy: "բանկա", symbolHy: "բանկա", unitType: "փաթեթավորում", decimalPlaces: 0, isActive: true, note: "Փաթեթավորում" },
  { id: "unit-6106", code: "6106", nameHy: "գլան", symbolHy: "գլան", unitType: "փաթեթավորում", decimalPlaces: 0, isActive: true, note: "Փաթեթավորում · թուղթ, կտոր, կաշի և այլն" },
  { id: "unit-6107", code: "6107", nameHy: "թերթ", symbolHy: "թերթ", unitType: "փաթեթավորում", decimalPlaces: 0, isActive: true, note: "Փաթեթավորում / քանակ" },
  { id: "unit-6108", code: "6108", nameHy: "կապոց", symbolHy: "կապոց", unitType: "փաթեթավորում", decimalPlaces: 0, isActive: true, note: "Փաթեթավորում" },

  { id: "unit-7001", code: "7001", nameHy: "րոպե", symbolHy: "ր", unitType: "ժամանակ", decimalPlaces: 2, isActive: true, note: "Ժամանակ" },
  { id: "unit-7002", code: "7002", nameHy: "ժամ", symbolHy: "ժ", unitType: "ժամանակ", decimalPlaces: 2, isActive: true, note: "Ժամանակ / ծառայության չափում" },
  { id: "unit-7003", code: "7003", nameHy: "օր", symbolHy: "օր", unitType: "ժամանակ", decimalPlaces: 2, isActive: true, note: "Ժամանակ" },
  { id: "unit-7004", code: "7004", nameHy: "ամիս", symbolHy: "ամիս", unitType: "ժամանակ", decimalPlaces: 2, isActive: true, note: "Ժամանակ" },
  { id: "unit-7005", code: "7005", nameHy: "տարի", symbolHy: "տարի", unitType: "ժամանակ", decimalPlaces: 2, isActive: true, note: "Ժամանակ" },
  { id: "unit-7006", code: "7006", nameHy: "մարդ-ժամ", symbolHy: "մարդ-ժամ", unitType: "ժամանակ", decimalPlaces: 2, isActive: true, note: "Աշխատանքային ծախս / արտադրություն" },
  { id: "unit-7007", code: "7007", nameHy: "մեքենա-ժամ", symbolHy: "մեքենա-ժամ", unitType: "ժամանակ", decimalPlaces: 2, isActive: true, note: "Արտադրական սարքավորումների աշխատանք" },

  { id: "unit-8001", code: "8001", nameHy: "կիլովատ-ժամ", symbolHy: "կՎտժ", unitType: "էներգիա", decimalPlaces: 3, isActive: true, note: "Էլեկտրաէներգիա" },
  { id: "unit-8002", code: "8002", nameHy: "կիլովատ", symbolHy: "կՎտ", unitType: "էներգիա", decimalPlaces: 3, isActive: true, note: "Հզորություն" },
  { id: "unit-8003", code: "8003", nameHy: "մեգավատ-ժամ", symbolHy: "ՄՎտժ", unitType: "էներգիա", decimalPlaces: 3, isActive: true, note: "Էներգիա · մեծ սպառում" },
  { id: "unit-8004", code: "8004", nameHy: "գիգակալորիա", symbolHy: "Գկալ", unitType: "էներգիա", decimalPlaces: 3, isActive: true, note: "Ջերմային էներգիա" },

  { id: "unit-9001", code: "9001", nameHy: "ծառայություն", symbolHy: "ծառ.", unitType: "ծառայություն", decimalPlaces: 0, isActive: true, note: "Ծառայությունների փաստաթղթերի համար" },
  { id: "unit-9002", code: "9002", nameHy: "աշխատանք", symbolHy: "աշխ.", unitType: "ծառայություն", decimalPlaces: 0, isActive: true, note: "Աշխատանքների կատարման փաստաթղթերի համար" },
  { id: "unit-9003", code: "9003", nameHy: "տոկոս", symbolHy: "%", unitType: "այլ", decimalPlaces: 2, isActive: true, note: "Տոկոսային ցուցանիշների համար, ոչ պահեստային հիմնական միավոր" },
  { id: "unit-9004", code: "9004", nameHy: "պրոմիլ", symbolHy: "‰", unitType: "այլ", decimalPlaces: 3, isActive: true, note: "Հատուկ հաշվարկների համար" },
];

const unitTypes: Array<"բոլորը" | UnitType> = [
  "բոլորը",
  "կշիռ",
  "հեղուկ",
  "ծավալ",
  "երկարություն",
  "մակերես",
  "քանակ",
  "փաթեթավորում",
  "ժամանակ",
  "էներգիա",
  "ծառայություն",
  "այլ",
];

export default function MeasurementUnitsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<"բոլորը" | UnitType>("բոլորը");

  const filteredUnits = useMemo(() => {
    const q = search.trim().toLowerCase();
    const type = selectedType.trim();

    return demoUnits.filter((unit) => {
      const typeOk = type === "բոլորը" || unit.unitType === type;

      const text = [
        unit.code,
        unit.nameHy,
        unit.symbolHy,
        unit.unitType,
        unit.note,
      ]
        .join(" ")
        .toLowerCase();

      const searchOk = q === "" || text.includes(q);

      return typeOk && searchOk;
    });
  }, [search, selectedType]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: 24,
        color: "#0f172a",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gap: 18 }}>
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 18,
            padding: 20,
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ color: "#64748b", fontSize: 13, fontWeight: 900 }}>
                Master DB · Ընդհանուր տեղեկատու
              </div>
              <h1 style={{ margin: "6px 0 8px", fontSize: 28 }}>
                Չափման միավորներ
              </h1>
              <p style={{ margin: 0, color: "#475569", lineHeight: 1.6, maxWidth: 900 }}>
                Չափման միավորները պահվում են գլխավոր բազայում։ Կազմակերպության բազայում ապրանքի
                քարտ ստեղծելիս միավորը ընտրվում է այստեղից, իսկ փաստաթղթերում պահվում է նաև
                snapshot՝ պատմական ճշգրտության համար։
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/")}
              style={{
                height: 42,
                padding: "0 14px",
                borderRadius: 12,
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#334155",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              ← Գլխավոր
            </button>
          </div>
        </section>

        <section
          style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: 18,
            padding: 18,
            display: "grid",
            gap: 10,
          }}
        >
          <strong>Ճարտարապետական կանոն</strong>
          <div style={{ color: "#334155", lineHeight: 1.7 }}>
            Master DB-ում պահվում է չափման միավորների միասնական բառարանը։ Tenant DB-ում պահվում է
            ապրանքի քարտը՝ ընտրած Master unit ID-ով և snapshot դաշտերով՝ unit code, unit name,
            unit symbol։ Փաթեթավորման փոխարկումները, օրինակ՝ 1 տուփ = 12 հատ, պահվում են ապրանքի
            քարտում, որովհետև ապրանքից ապրանք կարող են տարբեր լինել։
          </div>
        </section>

        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 18,
            padding: 20,
            display: "grid",
            gap: 14,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(240px, 1fr) minmax(220px, 280px)",
              gap: 12,
            }}
          >
            <label style={{ display: "grid", gap: 6, fontWeight: 900 }}>
              Որոնում
              <input
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
                placeholder="օր․ 1003, կգ, գրամ, 5003, կարատ"
                style={{
                  padding: 11,
                  borderRadius: 12,
                  border: "1px solid #cbd5e1",
                }}
              />
            </label>

            <label style={{ display: "grid", gap: 6, fontWeight: 900 }}>
              Տեսակ
              <select
                value={selectedType}
                onChange={(event) => setSelectedType(event.currentTarget.value as "բոլորը" | UnitType)}
                onInput={(event) => setSelectedType(event.currentTarget.value as "բոլորը" | UnitType)}
                style={{
                  padding: 11,
                  borderRadius: 12,
                  border: "1px solid #cbd5e1",
                }}
              >
                {unitTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div style={{ color: "#64748b", fontSize: 13, fontWeight: 800 }}>
            Ցուցադրվում է {filteredUnits.length} / {demoUnits.length} չափման միավոր
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                minWidth: 1050,
                borderCollapse: "collapse",
                border: "1px solid #cbd5e1",
                fontSize: 13,
              }}
            >
              <thead>
                <tr>
                  {["Կոդ", "Անվանում", "Նշան", "Տեսակ", "Կլորացում", "Կարգավիճակ", "Նշում"].map((header) => (
                    <th
                      key={header}
                      style={{
                        padding: "10px 12px",
                        border: "1px solid #cbd5e1",
                        background: "#e2e8f0",
                        textAlign: header === "Կլորացում" ? "right" : "left",
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUnits.map((unit) => (
                  <tr key={unit.id}>
                    <td style={{ padding: "9px 12px", border: "1px solid #cbd5e1", fontWeight: 900, color: "#1d4ed8" }}>
                      {unit.code}
                    </td>
                    <td style={{ padding: "9px 12px", border: "1px solid #cbd5e1", fontWeight: 800 }}>
                      {unit.nameHy}
                    </td>
                    <td style={{ padding: "9px 12px", border: "1px solid #cbd5e1", fontWeight: 900 }}>
                      {unit.symbolHy}
                    </td>
                    <td style={{ padding: "9px 12px", border: "1px solid #cbd5e1" }}>
                      {unit.unitType}
                    </td>
                    <td style={{ padding: "9px 12px", border: "1px solid #cbd5e1", textAlign: "right" }}>
                      {unit.decimalPlaces}
                    </td>
                    <td style={{ padding: "9px 12px", border: "1px solid #cbd5e1" }}>
                      {unit.isActive ? "Ակտիվ" : "Պասիվ"}
                    </td>
                    <td style={{ padding: "9px 12px", border: "1px solid #cbd5e1", color: "#64748b" }}>
                      {unit.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>
            SAFE փուլում սա demo ցուցակ է։ Հաջորդ փուլում կավելացնենք «Նոր չափման միավոր» ձևը,
            հետո՝ ապրանքի քարտում այս տեղեկատուից ընտրություն։
          </div>
        </section>
      </div>
    </main>
  );
}
