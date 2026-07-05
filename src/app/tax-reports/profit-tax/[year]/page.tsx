"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import YearSelectModal from "../../../../components/YearSelectModal";
import SimpleTabs, { TabItem } from "../../../../components/SimpleTabs";

export default function ProfitTaxPage() {
  const router = useRouter();
  const params = useParams<{ year: string }>();
  const yearNum = Number(params.year);

  const [yearModal, setYearModal] = useState(false);
  const [active, setActive] = useState("section-1");

  const tabs: TabItem[] = useMemo(() => {
    const items: TabItem[] = [];
    for (let i = 1; i <= 11; i++) {
      items.push({
        id: `section-${i}`,
        title: `Բաժին ${i}`,
        content: <div style={{ opacity: 0.75 }}>Placeholder — Բաժին {i}</div>,
      });
    }
    return items;
  }, []);

  if (!Number.isFinite(yearNum)) {
    return <div style={{ padding: 16 }}>Սխալ տարի</div>;
  }

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <h2 style={{ margin: "8px 0 4px" }}>Շահութահարկ — {yearNum}</h2>
          <div style={{ fontSize: 12, opacity: 0.7 }}>SAFE preview — դեռ չկա save / DB / API</div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}
            onClick={() => router.push("/tax-reports")}
          >
            Վերադառնալ
          </button>
          <button
            style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #111", background: "#111", color: "#fff", cursor: "pointer" }}
            onClick={() => setYearModal(true)}
          >
            Փոխել տարին
          </button>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <SimpleTabs items={tabs} activeId={active} onChange={setActive} />
      </div>

      <YearSelectModal
        open={yearModal}
        defaultYear={yearNum}
        onCancel={() => setYearModal(false)}
        onConfirm={(y) => {
          setYearModal(false);
          router.push(`/tax-reports/profit-tax/${y}`);
        }}
      />
    </div>
  );
}
