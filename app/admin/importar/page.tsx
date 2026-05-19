"use client";

import { useState } from "react";

type Row = { email: string; name: string; plan: "monthly" | "annual" };
type Result = { email: string; status: "ok" | "error"; detail?: string };

export default function ImportPage() {
  const [rows, setRows] = useState<Row[]>([{ email: "", name: "", plan: "monthly" }]);
  const [sendEmail, setSendEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[] | null>(null);

  function addRow() {
    setRows((prev) => [...prev, { email: "", name: "", plan: "monthly" }]);
  }

  function removeRow(i: number) {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateRow(i: number, field: keyof Row, value: string) {
    setRows((prev) => prev.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));
  }

  function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    e.preventDefault();
    const lines = e.clipboardData.getData("text").split(/\r?\n/).filter(Boolean);
    const parsed: Row[] = lines.map((line) => {
      const [email = "", name = "", plan = ""] = line.split(/[,;\t]/).map((s) => s.trim());
      return { email, name, plan: plan === "annual" ? "annual" : "monthly" };
    });
    if (parsed.length > 0) setRows(parsed);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const valid = rows.filter((r) => r.email.includes("@"));
    if (valid.length === 0) return;
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch("/api/admin/import-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ users: valid.map((r) => ({ ...r, sendEmail })) })
      });
      const data = await res.json();
      setResults(data.results ?? []);
    } finally {
      setLoading(false);
    }
  }

  const ok = results?.filter((r) => r.status === "ok").length ?? 0;
  const errors = results?.filter((r) => r.status === "error") ?? [];

  return (
    <main className="min-h-[calc(100vh-57px)] bg-ink px-4 py-10 text-parchment">
      <div className="mx-auto max-w-3xl">
        <a href="/admin" className="text-sm text-parchment/50 hover:text-gold">← Voltar ao painel</a>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-gold">Painel administrativo</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold">Importar usuários</h1>
        <p className="mt-2 text-sm text-parchment/55">
          Adicione clientes que já pagaram pelo Kiwify mas ainda não estão no sistema.
          Cole uma lista ou preencha linha por linha.
        </p>

        <div className="mt-6 rounded border border-parchment/10 bg-white/5 p-4 text-sm text-parchment/60">
          <p className="font-semibold text-parchment/80">Como colar do Excel / planilha:</p>
          <p className="mt-1">Selecione as colunas <strong>email, nome, plano</strong> (nessa ordem) e cole na primeira linha abaixo. O plano aceita <code>monthly</code> ou <code>annual</code>.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <div className="hidden">
            <textarea
              placeholder="Cole aqui (email, nome, plano)"
              className="w-full rounded border border-parchment/15 bg-ink px-3 py-2 text-sm text-parchment"
              rows={3}
              onPaste={handlePaste}
            />
          </div>

          <div className="overflow-x-auto rounded border border-parchment/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-parchment/10 bg-white/5 text-left text-xs font-semibold uppercase tracking-[0.14em] text-parchment/50">
                  <th className="px-3 py-2">Email *</th>
                  <th className="px-3 py-2">Nome</th>
                  <th className="px-3 py-2">Plano</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-parchment/5">
                {rows.map((row, i) => (
                  <tr key={i}>
                    <td className="px-2 py-1.5">
                      <input
                        type="email"
                        value={row.email}
                        required
                        onChange={(e) => updateRow(i, "email", e.target.value)}
                        onPaste={i === 0 ? handlePaste as unknown as React.ClipboardEventHandler<HTMLInputElement> : undefined}
                        placeholder="email@exemplo.com"
                        className="w-full rounded border border-parchment/15 bg-ink px-2 py-1.5 text-parchment outline-none focus:border-gold"
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <input
                        type="text"
                        value={row.name}
                        onChange={(e) => updateRow(i, "name", e.target.value)}
                        placeholder="Nome completo"
                        className="w-full rounded border border-parchment/15 bg-ink px-2 py-1.5 text-parchment outline-none focus:border-gold"
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <select
                        value={row.plan}
                        onChange={(e) => updateRow(i, "plan", e.target.value)}
                        className="rounded border border-parchment/15 bg-ink px-2 py-1.5 text-parchment outline-none focus:border-gold"
                      >
                        <option value="monthly">Mensal</option>
                        <option value="annual">Anual</option>
                      </select>
                    </td>
                    <td className="px-2 py-1.5 text-right">
                      {rows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRow(i)}
                          className="text-parchment/30 hover:text-red-400"
                        >
                          ✕
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={addRow}
            className="text-sm text-parchment/50 hover:text-gold"
          >
            + Adicionar linha
          </button>

          <div className="flex items-center gap-3 pt-2">
            <input
              id="sendEmail"
              type="checkbox"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              className="accent-gold"
            />
            <label htmlFor="sendEmail" className="text-sm text-parchment/70">
              Enviar link mágico de acesso por email para cada usuário
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded bg-gold px-6 py-3 text-sm font-semibold text-ink transition hover:bg-parchment disabled:opacity-50"
          >
            {loading ? "Importando…" : `Importar ${rows.filter((r) => r.email.includes("@")).length} usuário(s)`}
          </button>
        </form>

        {results && (
          <div className="mt-6 space-y-2">
            {ok > 0 && (
              <div className="rounded border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">
                {ok} usuário(s) importado(s) com sucesso.{sendEmail ? " Links mágicos enviados." : ""}
              </div>
            )}
            {errors.map((r) => (
              <div key={r.email} className="rounded border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-300">
                <strong>{r.email}</strong> — {r.detail ?? "Erro desconhecido."}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
