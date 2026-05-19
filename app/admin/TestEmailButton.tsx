"use client";

import { useState } from "react";

type State = "idle" | "loading" | "ok" | "error";

export function TestEmailButton() {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function handleClick() {
    setState("loading");
    setMessage("");
    try {
      const res = await fetch("/api/admin/test-email", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        setState("ok");
        setMessage(`Email enviado para ${data.sentTo}`);
      } else {
        setState("error");
        setMessage(data.error ?? "Erro desconhecido.");
      }
    } catch {
      setState("error");
      setMessage("Falha na requisição.");
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleClick}
        disabled={state === "loading"}
        className={`rounded px-3 py-1.5 text-xs font-semibold transition ${
          state === "ok"
            ? "bg-green-500/20 text-green-300"
            : state === "error"
            ? "bg-red-500/20 text-red-300"
            : "border border-parchment/20 text-parchment/60 hover:border-gold hover:text-gold"
        }`}
      >
        {state === "loading" ? "Enviando…" : state === "ok" ? "✓ Resend ativo" : state === "error" ? "✗ Erro no Resend" : "Testar email"}
      </button>
      {message && <p className="text-xs text-parchment/50">{message}</p>}
    </div>
  );
}
