"use client";

type CalendarDateFieldProps = {
  label?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export function CalendarDateField({
  label = "Ամսաթիվ",
  defaultValue,
  value,
  onChange,
}: CalendarDateFieldProps) {
  const dateValue = value ?? defaultValue ?? "";

  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      <span>{label}</span>
      <input
        type="date"
        value={dateValue}
        onChange={(event) => onChange?.(event.target.value)}
        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500"
      />
    </label>
  );
}
