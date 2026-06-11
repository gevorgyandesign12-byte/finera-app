"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import YearSelectModal from "@/components/YearSelectModal";

export default function ProfitTaxLandingWithYear() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  return (
    <div style={{ padding: 16 }}>
      <YearSelectModal
        open={open}
        defaultYear={new Date().getFullYear() - 1}
        onCancel={() => {
          setOpen(false);
          router.back();
        }}
        onConfirm={(year) => {
          setOpen(false);
          router.push(`${pathname}/${year}`);
        }}
      />
    </div>
  );
}
