import { LockKeyhole } from "lucide-react";

type Props = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const hasError = params?.error === "1";

  return (
    <main className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-ink px-4">
      <form
        action="/api/auth/admin-login"
        method="post"
        className="w-full max-w-sm rounded-lg border border-parchment/10 bg-white/5 p-7 shadow-[0_24px_70px_rgba(0,0,0,0.3)]"
      >
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded bg-gold text-ink">
          <LockKeyhole size={22} aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-semibold text-parchment">Admin</h1>
        <p className="mt-1 text-sm text-parchment/55">Digite a senha para acessar o painel.</p>

        {hasError && (
          <div className="mt-4 rounded border border-red-300/30 bg-red-500/12 p-3 text-sm text-red-100">
            Senha incorreta.
          </div>
        )}

        <label className="mt-5 block text-sm font-medium text-parchment/80" htmlFor="secret">
          Senha
        </label>
        <input
          id="secret"
          name="secret"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className="mt-2 w-full rounded border border-parchment/15 bg-ink px-3 py-3 text-parchment outline-none transition focus:border-gold"
        />

        <button
          type="submit"
          className="mt-5 w-full rounded bg-gold px-5 py-3 text-sm font-semibold text-ink transition hover:bg-parchment"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
