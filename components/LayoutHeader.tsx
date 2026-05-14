import Link from "next/link";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";

const navItems = [
  { href: "/personagens", label: "Personagens" },
  { href: "/chat", label: "Chat" },
  { href: "/trilha", label: "Trilha" }
];

export async function LayoutHeader() {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/95 text-parchment backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-gold shadow-[0_0_22px_rgba(183,137,55,0.75)]" />
          <span className="text-sm font-semibold uppercase tracking-[0.28em] text-parchment/75">
            Clones da Bíblia
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium text-parchment/70">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-3 py-2 transition hover:bg-white/10 hover:text-parchment"
            >
              {item.label}
            </Link>
          ))}
          {session ? (
            <form action="/api/auth/logout" method="post">
              <button className="rounded px-3 py-2 transition hover:bg-white/10 hover:text-parchment" type="submit">
                Sair
              </button>
            </form>
          ) : (
            <Link className="rounded px-3 py-2 transition hover:bg-white/10 hover:text-parchment" href="/login">
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
