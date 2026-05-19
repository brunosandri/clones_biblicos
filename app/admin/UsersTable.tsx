"use client";

import { useState } from "react";

type User = {
  email: string;
  name: string;
  status: string;
  plan: string | null;
  access_expires_at: Date | null;
  created_at: Date;
  last_event: string | null;
  message_count: number;
  total_tokens: number;
  prompt_tokens: number;
  completion_tokens: number;
  last_active: Date | null;
};

const planLabel: Record<string, string> = { annual: "Anual", monthly: "Mensal" };
const statusLabel: Record<string, string> = { active: "Ativo", inactive: "Inativo" };

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(date));
}

function formatTokens(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function ResendButton({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function handleClick() {
    setState("loading");
    try {
      const res = await fetch("/api/admin/resend-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      setState(res.ok ? "ok" : "error");
    } catch {
      setState("error");
    }
    setTimeout(() => setState("idle"), 3000);
  }

  return (
    <button
      onClick={handleClick}
      disabled={state === "loading"}
      className={`rounded px-2 py-1 text-xs font-semibold transition ${
        state === "ok"
          ? "bg-green-500/20 text-green-300"
          : state === "error"
          ? "bg-red-500/20 text-red-300"
          : "bg-gold/15 text-gold hover:bg-gold/30"
      }`}
    >
      {state === "loading" ? "…" : state === "ok" ? "Enviado ✓" : state === "error" ? "Erro ✗" : "Reenviar acesso"}
    </button>
  );
}

export function UsersTable({ users }: { users: User[] }) {
  return (
    <div className="mt-8 overflow-x-auto rounded-lg border border-parchment/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-parchment/10 bg-white/5 text-left text-xs font-semibold uppercase tracking-[0.14em] text-parchment/50">
            <th className="px-4 py-3">Usuário</th>
            <th className="px-4 py-3">Plano</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Acesso até</th>
            <th className="px-4 py-3">Membro desde</th>
            <th className="px-4 py-3 text-right">Msgs</th>
            <th className="px-4 py-3 text-right">Tokens</th>
            <th className="px-4 py-3 text-right">Input</th>
            <th className="px-4 py-3 text-right">Output</th>
            <th className="px-4 py-3">Último uso</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-parchment/5">
          {users.map((user) => {
            const isExpired = user.access_expires_at && new Date(user.access_expires_at) < new Date();
            return (
              <tr key={user.email} className="transition hover:bg-white/5">
                <td className="px-4 py-3">
                  <p className="font-medium text-parchment">{user.name}</p>
                  <p className="mt-0.5 text-xs text-parchment/45">{user.email}</p>
                </td>
                <td className="px-4 py-3 text-parchment/70">
                  {user.plan ? (planLabel[user.plan] ?? user.plan) : "—"}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${
                    user.status === "active" && !isExpired
                      ? "bg-green-500/20 text-green-300"
                      : "bg-red-500/20 text-red-300"
                  }`}>
                    {isExpired ? "Expirado" : (statusLabel[user.status] ?? user.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-parchment/70">{formatDate(user.access_expires_at)}</td>
                <td className="px-4 py-3 text-parchment/70">{formatDate(user.created_at)}</td>
                <td className="px-4 py-3 text-right font-mono text-parchment/80">
                  {user.message_count.toLocaleString("pt-BR")}
                </td>
                <td className="px-4 py-3 text-right font-mono text-gold">{formatTokens(user.total_tokens)}</td>
                <td className="px-4 py-3 text-right font-mono text-parchment/50">{formatTokens(user.prompt_tokens)}</td>
                <td className="px-4 py-3 text-right font-mono text-parchment/50">{formatTokens(user.completion_tokens)}</td>
                <td className="px-4 py-3 text-parchment/70">{formatDate(user.last_active)}</td>
                <td className="px-4 py-3">
                  {user.status === "active" && !isExpired && <ResendButton email={user.email} />}
                </td>
              </tr>
            );
          })}
          {users.length === 0 && (
            <tr>
              <td colSpan={11} className="px-4 py-10 text-center text-parchment/40">
                Nenhum usuário encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
