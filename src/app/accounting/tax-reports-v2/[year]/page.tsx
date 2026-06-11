"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SimpleTabs, { TabItem } from "@/components/SimpleTabs";
import YearSelectModal from "@/components/YearSelectModal";

export default function ProfitTaxYearPage() {
  const router = useRouter();
  const params = useParams();
  const yearRaw = Array.isArray(params?.year) ? params.year[0] : (params?.year as string | undefined);
  const yearNum = Number(yearRaw);

  const [active, setActive] = useState("section-1");
  const [yearModal, setYearModal] = useState(false);

  const tabs: TabItem[] = useMemo(() => {
    return Array.from({ length: 11 }, (_, i) => {
      const n = i + 1;
      return {
        id: `section-${n}`,
        title: `Բաժին ${n}`,
        content: (
          <div>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>Բաժին {n}</div>
            <div style={{ opacity: 0.75 }}>Placeholder — հետո կլցնենք պաշտոնական ֆորմայի դաշտերով</div>
          </div>
        ),
      };
    });
  }, []);

  if (!Number.isFinite(yearNum)) return <div style={{ padding: 16 }}>Սխալ տարի</div>;

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <h2 style={{ margin: "8px 0 4px" }}>Շահութահարկ — {yearNum}</h2>
          <div style={{ fontSize: 12, opacity: 0.7 }}>SAFE preview — DB/API չկա</div>
        </div>

        <button
          onClick={() => setYearModal(true)}
          style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #111", background: "#111", color: "#fff", cursor: "pointer" }}
        >
          Փոխել տարին
        </button>
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
          router.push(`../${y}`);
        }}
      />
    </div>
  );
}
