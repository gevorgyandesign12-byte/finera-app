"use client";

import { useState, type CSSProperties } from "react";

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

const floatingButtonStyle: CSSProperties = {
  position: "fixed",
  right: 24,
  bottom: 24,
  zIndex: 80,
  border: "1px solid rgba(226, 232, 240, 0.9)",
  borderRadius: 999,
  padding: "12px 18px",
  background: "#111827",
  color: "#ffffff",
  fontSize: 14,
  fontWeight: 900,
  boxShadow: "0 18px 45px rgba(15, 23, 42, 0.22)",
  cursor: "pointer",
};

const panelStyle: CSSProperties = {
  position: "fixed",
  right: 24,
  bottom: 24,
  zIndex: 80,
  width: 360,
  maxWidth: "calc(100vw - 32px)",
  maxHeight: "78vh",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  border: "1px solid rgba(226, 232, 240, 0.95)",
  borderRadius: 24,
  background: "#ffffff",
  boxShadow: "0 24px 70px rgba(15, 23, 42, 0.28)",
};

const assistantMessageStyle: CSSProperties = {
  borderRadius: 16,
  padding: "10px 12px",
  background: "#f1f5f9",
  color: "#334155",
  fontSize: 13,
  lineHeight: 1.55,
};

const userMessageStyle: CSSProperties = {
  borderRadius: 16,
  padding: "10px 12px",
  background: "#111827",
  color: "#ffffff",
  fontSize: 13,
  lineHeight: 1.55,
};

export function AIAssistantPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text:
        "Demo ռեժիմ է։ Հետագայում այստեղ կստուգեմ բաց թողած դաշտերը, կասկածելի տվյալները և քայլի պատրաստ լինելը։",
    },
  ]);
  const [draftMessage, setDraftMessage] = useState("");

  function sendMessage() {
    const trimmed = draftMessage.trim();

    if (!trimmed) {
      return;
    }

    setMessages((current) => [
      ...current,
      { role: "user", text: trimmed },
      {
        role: "assistant",
        text:
          "Իրական AI կապը դեռ միացված չէ։ Այս պատուհանը հիմա պահում ենք որպես ապագա սխալների կանխարգելման օգնականի տեղ։",
      },
    ]);
    setDraftMessage("");
  }

  if (!isOpen) {
    return (
      <button type="button" onClick={() => setIsOpen(true)} style={floatingButtonStyle}>
        AI օգնական
      </button>
    );
  }

  return (
    <aside style={panelStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          borderBottom: "1px solid #e2e8f0",
          padding: 16,
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              color: "#94a3b8",
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            Finera AI
          </p>
          <h2 style={{ margin: "4px 0 0", color: "#0f172a", fontSize: 17, fontWeight: 900 }}>
            Աշխատանքային օգնական
          </h2>
          <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 12, lineHeight: 1.5 }}>
            Օգնում է չսխալվել ծրագրի մեջ։
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(false)}
          style={{
            height: 30,
            border: "1px solid #e2e8f0",
            borderRadius: 999,
            padding: "0 12px",
            background: "#ffffff",
            color: "#475569",
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Փակել
        </button>
      </div>

      <div style={{ display: "grid", gap: 8, borderBottom: "1px solid #e2e8f0", padding: 12 }}>
        {["Ստուգել այս քայլը", "Բաց թողած դաշտեր", "Գրանցման ամփոփում"].map((label) => (
          <button
            key={label}
            type="button"
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: 16,
              padding: "10px 12px",
              background: "#f8fafc",
              color: "#1e293b",
              textAlign: "left",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: 12 }}>
        <div style={{ display: "grid", gap: 8 }}>
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              style={message.role === "assistant" ? assistantMessageStyle : userMessageStyle}
            >
              {message.text}
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: "1px solid #e2e8f0", padding: 12 }}>
        <textarea
          value={draftMessage}
          onChange={(event) => setDraftMessage(event.target.value)}
          placeholder="Գրել հարցը..."
          rows={2}
          style={{
            width: "100%",
            resize: "none",
            border: "1px solid #cbd5e1",
            borderRadius: 16,
            padding: "10px 12px",
            color: "#0f172a",
            fontSize: 13,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        <button
          type="button"
          onClick={sendMessage}
          style={{
            width: "100%",
            marginTop: 8,
            border: 0,
            borderRadius: 16,
            padding: "10px 12px",
            background: "#111827",
            color: "#ffffff",
            fontSize: 13,
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          Ուղարկել
        </button>
      </div>
    </aside>
  );
}
