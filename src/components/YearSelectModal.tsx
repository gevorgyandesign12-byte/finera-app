"use client";

import React, { useEffect, useMemo, useState } from "react";

type Props = {
  open: boolean;
  title?: string;
  defaultYear?: number;
  onCancel: () => void;
  onConfirm: (year: number) => void;
};

function getYearOptions(): number[] {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = currentYear; y >= currentYear - 15; y--) years.push(y);
  return years;
}

export default function YearSelectModal({
  open,
  title = "Ընտրեք հաշվետու տարին",
  defaultYear,
  onCancel,
  onConfirm,
}: Props) {
  const options = useMemo(() => getYearOptions(), []);
  const initial = defaultYear ?? (new Date().getFullYear() - 1);
  const [year, setYear] = useState<number>(initial);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm(year);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel, onConfirm, year]);

  if (!open) return null;

  return (
    <>
      <div className="ft-backdrop" onMouseDown={onCancel}>
        <div className="ft-modal" onMouseDown={(e) => e.stopPropagation()}>
          <div className="ft-title">{title}</div>

          <div className="ft-field">
            <label className="ft-label">Հաշվետու տարի *</label>
            <select
              className="ft-select"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {options.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="ft-actions">
            <button className="ft-btn ft-cancel" onClick={onCancel}>
              Չեղարկել
            </button>
            <button className="ft-btn ft-confirm" onClick={() => onConfirm(year)}>
              Շարունակել
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ft-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          z-index: 100000;
        }
        .ft-modal {
          width: min(440px, 100%);
          background: #fff;
          color: #111;
          border-radius: 14px;
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.35);
          padding: 18px;
        }
        .ft-title {
          font-weight: 900;
          font-size: 18px;
          margin-bottom: 12px;
        }
        .ft-label {
          display: block;
          font-size: 12px;
          opacity: 0.85;
          margin-bottom: 6px;
        }
        .ft-select {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #ddd;
          background: #fff;
          color: #111;
          font-size: 14px;
        }
        .ft-actions {
          margin-top: 16px;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        .ft-btn {
          height: 46px;
          min-width: 120px;
          padding: 0 18px;
          border-radius: 14px;
          cursor: pointer;
          font-weight: 900;
          font-size: 14px;
          transition: transform 140ms ease, box-shadow 140ms ease, background 140ms ease,
            border-color 140ms ease, color 140ms ease, font-size 140ms ease;
        }
        .ft-cancel {
          border: 1px solid #d1d5db;
          background: #fff;
          color: #111;
        }
        .ft-cancel:hover {
          background: #ef4444;
          border-color: #ef4444;
          color: #fff;
          transform: translateY(-2px) scale(1.08);
          font-size: 16px;
          box-shadow: 0 16px 30px rgba(239, 68, 68, 0.4);
        }
        .ft-confirm {
          border: 1px solid #111;
          background: #111;
          color: #fff;
        }
        .ft-confirm:hover {
          background: #16a34a;
          border-color: #16a34a;
          transform: translateY(-2px) scale(1.08);
          font-size: 16px;
          box-shadow: 0 18px 34px rgba(22, 163, 74, 0.45);
        }
      `}</style>
    </>
  );
}
