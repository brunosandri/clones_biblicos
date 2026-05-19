import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminStats } from "@/lib/access-store";
import { SESSION_COOKIE_NAME, getAdminEmails, verifySessionToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(date));
}

function formatTokens(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

const planLabel: Record<string, string> = {
  annual: "Anual",
  monthly: "Mensal"
};

const statusLabel: Record<string, string> = {
  active: "Ativo",
  inactive: "Inativo"
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  const adminEmails = getAdminEmails();

  if (!session || !adminEmails.includes(session.email)) {
    redirect("/admin/login");
  }

  const users = await getAdminStats();

  const activeUsers = users.filter((u) => u.status === "active");
  const totalTokens = users.reduce((sum, u) => sum + u.total_tokens, 0);
  const totalMessages = users.reduce((sum, u) => sum + u.message_count, 0);

  return (
    <main className="min-h-[calc(100vh-57px)] bg-ink px-4 py-10 text-parchment">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Painel administrativo</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold">Assinantes</h1>
          </div>
          <a
            href="/admin/importar"
            className="mt-3 rounded bg-gold px-4 py-2 text-sm font-semibold text-ink transition hover:bg-parchment"
          >
            Importar usuários
          </a>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-parchment/10 bg-white/5 p-5">
            <p className="text-sm text-parchment/60">Assinantes ativos</p>
            <p className="mt-1 text-3xl font-semibold text-gold">{activeUsers.length}</p>
          </div>
          <div className="rounded-lg border border-parchment/10 bg-white/5 p-5">
            <p className="text-sm text-parchment/60">Mensagens enviadas</p>
            <p className="mt-1 text-3xl font-semibold text-gold">{totalMessages.toLocaleString("pt-BR")}</p>
          </div>
          <div className="rounded-lg border border-parchment/10 bg-white/5 p-5">
            <p className="text-sm text-parchment/60">Tokens consumidos</p>
            <p className="mt-1 text-3xl font-semibold text-gold">{formatTokens(totalTokens)}</p>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto rounded-lg border border-parchment/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-parchment/10 bg-white/5 text-left text-xs font-semibold uppercase tracking-[0.14em] text-parchment/50">
                <th className="px-4 py-3">Usuário</th>
                <th className="px-4 py-3">Plano</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Acesso até</th>
                <th className="px-4 py-3">Membro desde</th>
                <th className="px-4 py-3 text-right">Mensagens</th>
                <th className="px-4 py-3 text-right">Tokens</th>
                <th className="px-4 py-3 text-right">Input</th>
                <th className="px-4 py-3 text-right">Output</th>
                <th className="px-4 py-3">Último uso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-parchment/5">
              {users.map((user) => {
                const isExpired =
                  user.access_expires_at && new Date(user.access_expires_at) < new Date();
                return (
                  <tr key={user.email} className="transition hover:bg-white/5">
                    <td className="px-4 py-3">
                      <p className="font-medium text-parchment">{user.name}</p>
                      <p className="mt-0.5 text-xs text-parchment/45">{user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-parchment/70">
                      {user.plan ? planLabel[user.plan] ?? user.plan : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${
                          user.status === "active" && !isExpired
                            ? "bg-green-500/20 text-green-300"
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {isExpired ? "Expirado" : statusLabel[user.status] ?? user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-parchment/70">{formatDate(user.access_expires_at)}</td>
                    <td className="px-4 py-3 text-parchment/70">{formatDate(user.created_at)}</td>
                    <td className="px-4 py-3 text-right font-mono text-parchment/80">
                      {user.message_count.toLocaleString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gold">
                      {formatTokens(user.total_tokens)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-parchment/50">
                      {formatTokens(user.prompt_tokens)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-parchment/50">
                      {formatTokens(user.completion_tokens)}
                    </td>
                    <td className="px-4 py-3 text-parchment/70">{formatDate(user.last_active)}</td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-parchment/40">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
