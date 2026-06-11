"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import YearSelectModal from "../../../components/YearSelectModal";

export default function ProfitTaxLandingPage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  return (
    <YearSelectModal
      open={open}
      defaultYear={new Date().getFullYear() - 1}
      onCancel={() => {
        setOpen(false);
        router.push("/tax-reports");
      }}
      onConfirm={(year) => {
        setOpen(false);
        router.push(`/tax-reports/profit-tax/${year}`);
      }}
    />
  );
}
