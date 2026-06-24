"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

const profitTaxTabs = [
  {
    title: "1. Համախառն եկամուտներ",
    section: "Բաժին 1",
    rows: "տողեր 6–41",
    description:
      "Այստեղ կարտացոլվեն շահութահարկի հաշվարկի բոլոր եկամուտները՝ ապրանքների, արտադրանքի, աշխատանքների, ծառայությունների և այլ եկամուտների մասով։ 41-րդ տողը կլինի համախառն եկամտի ամփոփումը։",
  },
  {
    title: "2. Ծախսեր և նվազեցումներ",
    section: "Բաժին 1",
    rows: "տողեր 42–84",
    description:
      "Այստեղ կարտացոլվեն ծախսերը, կորուստները և այլ նվազեցումները։ 84-րդ տողը կլինի ընդհանուր նվազեցումների ամփոփումը։",
  },
  {
    title: "3. Հարկվող շահույթ և շահութահարկ",
    section: "Բաժին 1",
    rows: "տողեր 85–107",
    description:
      "Այստեղ կձևավորվի հարկվող շահույթը կամ հարկային վնասը, հաշվարկված շահութահարկը, կանխավճարները և վճարման կամ փոխհատուցման ենթակա վերջնական արդյունքը։",
  },
  {
    title: "4. Բաժին 2․ Ոչ ռեզիդենտի եկամուտներ",
    section: "Բաժին 2",
    rows: "ոչ ռեզիդենտի հատուկ եկամուտներ",
    description:
      "Այստեղ կլրացվեն մշտական հաստատության միջոցով ՀՀ-ում գործունեություն իրականացնող ոչ ռեզիդենտ շահութահարկ վճարողի՝ մշտական հաստատությանը չվերագրվող եկամուտները և դրանց գծով հաշվարկված շահութահարկը։",
  },
  {
    title: "5. Բաժին 3․ Դեբիտորական/կրեդիտորական պարտքեր",
    section: "Բաժին 3",
    rows: "պարտքերի ամփոփում",
    description:
      "Այստեղ կերևան դեբիտորական և կրեդիտորական պարտքերի պահուստների, պահուստաֆոնդի և դուրսգրված անհուսալի պարտքերի ամփոփ ցուցանիշները։",
  },
  {
    title: "6. Բաժին 4․ Անհուսալի պարտքեր",
    section: "Բաժին 4",
    rows: "անհուսալի ճանաչված պարտքերի բացվածք",
    description:
      "Այստեղ կլինի տողային աղյուսակ՝ անհուսալի դեբիտորական և կրեդիտորական պարտքերի համար՝ գումար, դուրսգրման ամսաթիվ, դատարանի վճիռ և մյուս անձի տվյալներ։",
  },
  {
    title: "7. Բաժին 5․ ՀՄ ամորտիզացիոն ժամկետներ",
    section: "Բաժին 5",
    rows: "հիմնական միջոցների հարկային ամորտիզացիա",
    description:
      "Այստեղ կլրացվեն հարկման նպատակով հիմնական միջոցների ամորտիզացիոն ժամկետները՝ նախորդ և հաշվետու տարվա տվյալներով։",
  },
  {
    title: "8. Բաժին 6․ ՈՆԱ ամորտիզացիոն ժամկետներ",
    section: "Բաժին 6",
    rows: "ոչ նյութական ակտիվների հարկային ամորտիզացիա",
    description:
      "Այստեղ կլրացվեն հարկման նպատակով ոչ նյութական ակտիվների ամորտիզացիոն ժամկետները։",
  },
  {
    title: "9. Բաժին 7․ Հաշվապահական քաղաքականություն",
    section: "Բաժին 7",
    rows: "հաշվապահական քաղաքականության բացահայտումներ",
    description:
      "Այստեղ կտեղադրվեն հաշվապահական հաշվառման քաղաքականությանը վերաբերող բացահայտումները։ Սա երկրորդային բաժին է, բայց պահում ենք պաշտոնական ձևի տրամաբանությամբ։",
  },
  {
    title: "10. Բաժին 8․ Հաշվեկշռային արժեքներ և հարկային բազա",
    section: "Բաժին 8",
    rows: "ակտիվներ, պարտավորություններ, հաշվապահական արժեքներ և հարկային բազաներ",
    description:
      "Սա շատ կարևոր և լայն բաժին է։ Այստեղ պետք է լինեն ակտիվների և պարտավորությունների հաշվապահական հաշվեկշռային արժեքները և հարկային բազաները։ Հետագայում այս բաժնի համար կկառուցենք wide-table viewer։",
  },
  {
    title: "11. Բաժին 9․ Եկամուտներ ըստ գործունեության տեսակների",
    section: "Բաժին 9",
    rows: "գործունեության կոդեր և տեսակարար կշիռներ",
    description:
      "Այստեղ կերևան եկամուտները ըստ գործունեության տեսակների՝ բաժին, հատված, խումբ, դաս, ենթադաս և տեսակարար կշիռ տոկոսով։",
  },
  {
    title: "12. Բաժին 10․ Հատուկ ծրագրեր",
    section: "Բաժին 10",
    rows: "կառավարության հավանությանն արժանացած ծրագրեր",
    description:
      "Այստեղ կլրացվեն կառավարության հավանությանն արժանացած ծրագրեր իրականացնող ռեզիդենտ հարկ վճարողների վերաբերյալ տեղեկությունները։",
  },
  {
    title: "13. Բաժին 11․ Շինարարության/շինմոնտաժային հատուկ ծրագիր",
    section: "Բաժին 11",
    rows: "ՀՀ տարածքից դուրս շինարարության կամ շինմոնտաժային գործունեություն",
    description:
      "Այստեղ կլրացվեն հատուկ տվյալները այն դեպքերի համար, երբ ծրագիրը վերաբերում է բացառապես ՀՀ տարածքից դուրս շինարարության կամ շինմոնտաժային ոլորտում գործունեությանը։",
  },
];

export default function ProfitTaxYearReportPage() {
  const router = useRouter();
  const params = useParams<{ year: string }>();
  const year = params.year;
  const [activeTabTitle, setActiveTabTitle] = useState(profitTaxTabs[0].title);

  const activeTab = profitTaxTabs.find((tab) => tab.title === activeTabTitle) ?? profitTaxTabs[0];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: 24,
        color: "#0f172a",
      }}
    >
      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          display: "grid",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                color: "#64748b",
                fontSize: 13,
                fontWeight: 800,
                marginBottom: 6,
              }}
            >
              Հարկային հաշվետվություններ / Շահութահարկ
            </div>
            <h1 style={{ margin: 0, fontSize: 28 }}>Շահութահարկի հաշվարկ — {year}</h1>
            <p style={{ margin: "8px 0 0", color: "#475569", lineHeight: 1.6 }}>
              Demo skeleton է․ այս փուլում կառուցում ենք շահութահարկի պաշտոնական ձևի բաժինները։
              Իրական հաշվարկներ, ՊԵԿ ուղարկում կամ տվյալների պահպանում դեռ չենք կատարում։
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/accounting/tax-reports-v2/profit-tax")}
            style={{
              border: "1px solid #93c5fd",
              borderRadius: 12,
              background: "#eff6ff",
              color: "#1d4ed8",
              padding: "10px 14px",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Փոխել տարին
          </button>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: 4,
            overflowX: "auto",
            padding: "10px 10px 0",
            border: "1px solid #bfdbfe",
            borderBottom: "3px solid #2563eb",
            borderRadius: "14px 14px 0 0",
            background: "#e0f2fe",
          }}
        >
          {profitTaxTabs.map((tab) => {
            const isSelected = tab.title === activeTab.title;

            return (
              <button
                key={tab.title}
                type="button"
                onClick={() => setActiveTabTitle(tab.title)}
                style={{
                  minWidth: 180,
                  maxWidth: 240,
                  padding: "10px 12px",
                  border: "1px solid #93c5fd",
                  borderBottom: isSelected ? "3px solid #2563eb" : "1px solid #93c5fd",
                  borderRadius: "12px 12px 0 0",
                  background: isSelected ? "#bfdbfe" : "#f8fbff",
                  color: isSelected ? "#0f172a" : "#1e3a8a",
                  fontSize: 12,
                  fontWeight: 900,
                  lineHeight: 1.25,
                  cursor: "pointer",
                  boxShadow: isSelected ? "0 -1px 0 #2563eb inset" : "none",
                  whiteSpace: "normal",
                }}
              >
                {tab.title}
              </button>
            );
          })}
        </div>

        <div
          style={{
            padding: "18px 20px",
            border: "1px solid #bfdbfe",
            borderTop: "none",
            borderRadius: "0 0 14px 14px",
            background: "#ffffff",
            color: "#0f172a",
            display: "grid",
            gap: 14,
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 10px",
                borderRadius: 999,
                background: "#eff6ff",
                color: "#1d4ed8",
                fontSize: 12,
                fontWeight: 900,
                marginBottom: 10,
              }}
            >
              {activeTab.section} · {activeTab.rows}
            </div>

            <h2 style={{ margin: 0, fontSize: 20 }}>{activeTab.title}</h2>
            <p style={{ margin: "8px 0 0", color: "#475569", lineHeight: 1.6 }}>
              {activeTab.description}
            </p>
          </div>

          <div
            style={{
              border: "1px dashed #93c5fd",
              borderRadius: 14,
              background: "#f8fbff",
              padding: 16,
              color: "#475569",
              lineHeight: 1.6,
            }}
          >
            Այստեղ հաջորդ SAFE քայլերով կավելացնենք այս tab-ի իրական տողերը, աղյուսակները,
            հաշվարկային կապերը և ստուգման կանոնները։ Առաջին հերթին կսկսենք
            «Համախառն եկամուտներ» tab-ից՝ տողեր 6–41։
          </div>
        </div>
      </section>
    </main>
  );
}
