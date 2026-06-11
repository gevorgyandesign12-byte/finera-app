"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import YearSelectModal from "../../../../components/YearSelectModal";

export default function ProfitTaxV2Landing() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  return (
    <YearSelectModal
      open={open}
      defaultYear={new Date().getFullYear() - 1}
      onCancel={() => {
        setOpen(false);
        router.push("/accounting/tax-reports-v2");
      }}
      onConfirm={(year) => {
        setOpen(false);
        router.push(`/accounting/tax-reports-v2/profit-tax/${year}`);
      }}
    />
  );
}
