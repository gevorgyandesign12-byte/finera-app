"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import YearSelectModal from "../../components/YearSelectModal";

export default function TaxReportsPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: 16 }}>
      <h2 style={{ margin: "8px 0 16px" }}>Հարկային հաշվետվություններ</h2>

      <div style={{ border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
        <button
          onClick={() => setOpen(true)}
          style={{
            width: "100%",
            textAlign: "left",
            padding: 14,
            border: "none",
            background: "#fff",
            cursor: "pointer",
            borderBottom: "1px solid #eee",
          }}
        >
          <div style={{ fontWeight: 700 }}>Շահութահարկ</div>
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>240 — Շահութահարկի հաշվարկ</div>
        </button>
      </div>

      <YearSelectModal
        open={open}
        defaultYear={new Date().getFullYear() - 1}
        onCancel={() => setOpen(false)}
        onConfirm={(year) => {
          setOpen(false);
          router.push(`/tax-reports/profit-tax/${year}`);
        }}
      />
    </div>
  );
}
