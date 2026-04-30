import Link from "next/link";
import { BookOpen } from "lucide-react";

const navItems = [
  { href: "/personagens", label: "Personagens" },
  { href: "/chat", label: "Chat" },
  { href: "/trilha", label: "Trilha" }
];

export function LayoutHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-ink/10 bg-parchment/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-ink">
          <span className="grid h-9 w-9 place-items-center rounded bg-ink text-parchment">
            <BookOpen size={19} aria-hidden="true" />
          </span>
          <span>Clones da Bíblia</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium text-ink/75">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-3 py-2 transition hover:bg-ink/10 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
