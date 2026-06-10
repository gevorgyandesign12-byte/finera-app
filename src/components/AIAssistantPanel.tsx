"use client";

import { useState } from "react";

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
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
      {
        role: "user",
        text: trimmed,
      },
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
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-40 rounded-full border border-slate-300 bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-xl transition hover:bg-slate-800"
      >
        AI օգնական
      </button>
    );
  }

  return (
    <aside className="fixed bottom-5 right-5 z-40 flex max-h-[78vh] w-[360px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
      <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">
            Finera AI
          </p>
          <h2 className="mt-1 text-base font-black text-slate-950">
            Աշխատանքային օգնական
          </h2>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            Օգնում է չսխալվել ծրագրի մեջ, ոչ թե բացատրում է պարզ բաները։
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-full border border-slate-200 px-3 py-1 text-xs font-black text-slate-600 hover:bg-slate-100"
        >
          Փակել
        </button>
      </div>

      <div className="grid gap-2 border-b border-slate-200 p-3">
        <button
          type="button"
          className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100"
        >
          Ստուգել այս քայլը
        </button>
        <button
          type="button"
          className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100"
        >
          Բաց թողած դաշտեր
        </button>
        <button
          type="button"
          className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100"
        >
          Գրանցման ամփոփում
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`rounded-2xl px-3 py-2 text-xs leading-5 ${
                message.role === "assistant"
                  ? "bg-slate-100 text-slate-700"
                  : "bg-slate-950 text-white"
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200 p-3">
        <textarea
          value={draftMessage}
          onChange={(event) => setDraftMessage(event.target.value)}
          placeholder="Գրել հարցը..."
          rows={2}
          className="w-full resize-none rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none transition focus:border-slate-500"
        />
        <button
          type="button"
          onClick={sendMessage}
          className="mt-2 w-full rounded-2xl bg-slate-950 px-4 py-2 text-xs font-black text-white hover:bg-slate-800"
        >
          Ուղարկել
        </button>
      </div>
    </aside>
  );
}
