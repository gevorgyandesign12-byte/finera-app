"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import YearSelectModal from "./YearSelectModal";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

export default function ProfitTaxNavItem({ className, style, children }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className={className} style={style} onClick={() => setOpen(true)}>
        {children}
      </button>

      <YearSelectModal
        open={open}
        defaultYear={new Date().getFullYear() - 1}
        onCancel={() => setOpen(false)}
        onConfirm={(year) => {
          setOpen(false);
          router.push(`/accounting/tax-reports-v2/profit-tax/${year}`);
        }}
      />
    </>
  );
}
