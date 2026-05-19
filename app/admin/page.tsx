import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminStats } from "@/lib/access-store";
import { SESSION_COOKIE_NAME, getAdminEmails, verifySessionToken } from "@/lib/auth";
import { UsersTable } from "./UsersTable";

export const dynamic = "force-dynamic";

function formatTokens(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

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

        <UsersTable users={users} />
      </div>
    </main>
  );
}
