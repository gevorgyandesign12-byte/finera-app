"use client";

import React from "react";

export type TabItem = {
  id: string;
  title: string;
  content: React.ReactNode;
};

type Props = {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
};

export default function SimpleTabs({ items, activeId, onChange }: Props) {
  return (
    <div>
      <div style={styles.tabBar}>
        {items.map((t) => {
          const active = t.id === activeId;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              style={{ ...styles.tabBtn, ...(active ? styles.tabBtnActive : {}) }}
            >
              {t.title}
            </button>
          );
        })}
      </div>

      <div style={styles.panel}>
        {items.find((t) => t.id === activeId)?.content}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  tabBar: { display: "flex", gap: 8, flexWrap: "wrap", padding: 8, border: "1px solid #eee", borderRadius: 12, background: "#fafafa" },
  tabBtn: { padding: "8px 10px", borderRadius: 10, border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontSize: 13 },
  tabBtnActive: { border: "1px solid #111", background: "#111", color: "#fff" },
  panel: { marginTop: 12, border: "1px solid #eee", borderRadius: 12, padding: 12 },
};
