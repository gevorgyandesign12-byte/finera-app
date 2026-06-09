"use client";

import { useMemo, useState } from "react";

const months = [
  "Հունվար", "Փետրվար", "Մարտ", "Ապրիլ", "Մայիս", "Հունիս",
  "Հուլիս", "Օգոստոս", "Սեպտեմբեր", "Հոկտեմբեր", "Նոյեմբեր", "Դեկտեմբեր",
];

const weekDays = ["Երկ", "Երք", "Չրք", "Հնգ", "Ուրբ", "Շբթ", "Կիր"];

function toInputDate(date: Date) {
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

function parseInputDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return new Date();
  return new Date(year, month - 1, day);
}

export function CalendarDateField({ defaultValue }: { defaultValue: string }) {
  const initialValue = defaultValue || toInputDate(new Date());
  const [value, setValue] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);

  const initialDate = parseInputDate(initialValue);
  const [visibleYear, setVisibleYear] = useState(initialDate.getFullYear());
  const [visibleMonth, setVisibleMonth] = useState(initialDate.getMonth());

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 31 }, (_, index) => currentYear - 10 + index);
  }, []);

  const daysInMonth = new Date(visibleYear, visibleMonth + 1, 0).getDate();
  const firstDay = new Date(visibleYear, visibleMonth, 1).getDay();
  const leadingEmptyDays = (firstDay + 6) % 7;
  const todayValue = toInputDate(new Date());

  function selectDate(day: number) {
    setValue(toInputDate(new Date(visibleYear, visibleMonth, day)));
    setIsOpen(false);
  }

  return (
    <div style={styles.wrap}>
      <button type="button" style={styles.inputButton} onClick={() => setIsOpen((current) => !current)}>
        {value}
        <span style={styles.icon}>📅</span>
      </button>

      {isOpen ? (
        <div style={styles.popup}>
          <div style={styles.header}>
            <select
              style={styles.select}
              value={visibleMonth}
              onChange={(event) => setVisibleMonth(Number(event.target.value))}
            >
              {months.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>

            <select
              style={styles.select}
              value={visibleYear}
              onChange={(event) => setVisibleYear(Number(event.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.grid}>
            {weekDays.map((dayName) => (
              <span key={dayName} style={styles.weekDay}>
                {dayName}
              </span>
            ))}

            {Array.from({ length: leadingEmptyDays }).map((_, index) => (
              <span key={`empty-${index}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dayValue = toInputDate(new Date(visibleYear, visibleMonth, day));
              const isToday = dayValue === todayValue;
              const isSelected = dayValue === value;

              return (
                <button
                  key={day}
                  type="button"
                  style={{
                    ...styles.day,
                    ...(isToday ? styles.today : {}),
                    ...(isSelected ? styles.selected : {}),
                  }}
                  onClick={() => selectDate(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div style={styles.footer}>
            <button
              type="button"
              style={styles.footerButton}
              onClick={() => {
                const today = new Date();
                setVisibleYear(today.getFullYear());
                setVisibleMonth(today.getMonth());
                setValue(toInputDate(today));
                setIsOpen(false);
              }}
            >
              Այսօր
            </button>

            <button type="button" style={styles.footerButton} onClick={() => setIsOpen(false)}>
              Փակել
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const styles = {
  wrap: {
    position: "relative" as const,
    width: "100%",
    marginTop: "8px",
  },
  inputButton: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#d5c7b5",
    background: "#fffaf2",
    color: "#172033",
    fontSize: "15px",
    boxSizing: "border-box" as const,
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    opacity: 0.8,
  },
  popup: {
    position: "absolute" as const,
    zIndex: 9999,
    top: "48px",
    left: 0,
    width: "320px",
    padding: "14px",
    borderRadius: "16px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#d5c7b5",
    background: "#fffaf2",
    boxShadow: "0 18px 45px rgba(0,0,0,0.22)",
  },
  header: {
    display: "grid",
    gridTemplateColumns: "1fr 90px",
    gap: "8px",
    marginBottom: "12px",
  },
  select: {
    padding: "10px",
    borderRadius: "10px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#d5c7b5",
    background: "#f7f3ea",
    color: "#172033",
    fontWeight: 700,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "6px",
  },
  weekDay: {
    textAlign: "center" as const,
    fontSize: "12px",
    color: "#7a6a55",
    fontWeight: 700,
    padding: "4px 0",
  },
  day: {
    height: "34px",
    borderRadius: "10px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#e3d8c7",
    background: "#f7f3ea",
    color: "#172033",
    cursor: "pointer",
    fontWeight: 700,
  },
  today: {
    borderColor: "#27a9d8",
    background: "#e8f7fc",
  },
  selected: {
    borderColor: "#172033",
    background: "#172033",
    color: "#fffaf2",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    marginTop: "12px",
  },
  footerButton: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#d5c7b5",
    background: "#f7f3ea",
    color: "#172033",
    borderRadius: "10px",
    padding: "8px 10px",
    cursor: "pointer",
    fontWeight: 700,
  },
};
