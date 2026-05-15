import Link from "next/link";
import { LockKeyhole } from "lucide-react";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    next?: string;
    sent?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params?.next && params.next.startsWith("/") ? params.next : "/chat";
  const hasInvalidLink = params?.error === "link";
  const linkSent = params?.sent === "1";

  return (
    <main className="min-h-[calc(100vh-57px)] bg-ink px-4 py-12 text-parchment">
      <section className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_24rem] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">Área de membros</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-tight">
            Entre para acessar os clones bíblicos.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-parchment/70">
            Use seu acesso para conversar com os mentores, seguir a trilha cronológica e estudar com a
            base interna dos personagens.
          </p>
        </div>

        <form action="/api/auth/magic-link/request" method="post" className="rounded-lg border border-parchment/10 bg-white/10 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
          <input type="hidden" name="next" value={nextPath} />
          <div className="mb-6 flex h-11 w-11 items-center justify-center rounded bg-gold text-ink">
            <LockKeyhole size={22} aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-semibold">Login</h2>
          <p className="mt-2 text-sm leading-6 text-parchment/65">
            Informe o e-mail da compra para receber um link seguro de acesso.
          </p>

          {linkSent ? (
            <div className="mt-5 rounded border border-gold/30 bg-gold/12 p-3 text-sm text-parchment">
              Se este e-mail tiver acesso ativo, enviamos um link para entrar.
            </div>
          ) : null}

          {hasInvalidLink ? (
            <div className="mt-5 rounded border border-red-300/30 bg-red-500/12 p-3 text-sm text-red-100">
              Link inválido ou expirado. Peça um novo acesso.
            </div>
          ) : null}

          <label className="mt-6 block text-sm font-medium text-parchment/80" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-2 w-full rounded border border-parchment/15 bg-ink px-3 py-3 text-parchment outline-none transition focus:border-gold"
          />

          <button
            type="submit"
            className="mt-6 w-full rounded bg-gold px-5 py-3 text-sm font-semibold text-ink transition hover:bg-parchment"
          >
            Enviar link mágico
          </button>

          <p className="mt-5 text-center text-xs leading-5 text-parchment/55">
            Ainda não tem acesso?{" "}
            <Link href="/#planos" className="font-semibold text-gold hover:text-parchment">
              Ver planos
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
