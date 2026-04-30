import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { characters } from "@/lib/characters";

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-[1fr_24rem]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-olive">Estudo bíblico cronológico</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-tight text-ink md:text-6xl">
            Clones da Bíblia
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-ink/72">
            Estude a Bíblia em ordem cronológica com mentores bíblicos temporais.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/trilha"
              className="inline-flex items-center justify-center gap-2 rounded bg-ink px-5 py-3 font-semibold text-parchment transition hover:bg-cedar"
            >
              Começar estudo
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              href="/chat"
              className="inline-flex items-center justify-center gap-2 rounded border border-ink/20 px-5 py-3 font-semibold text-ink transition hover:bg-white/70"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Conversar com um mentor
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-ink/10 bg-white/70 p-6 shadow-soft">
          <div className="relative h-96 overflow-hidden rounded bg-ink">
            <div className="absolute inset-x-8 top-10 h-px bg-gold" />
            {characters.map((character, index) => (
              <div
                key={character.id}
                className="absolute left-8 right-8 flex items-center gap-3"
                style={{ top: `${42 + index * 35}px` }}
              >
                <span className="h-3 w-3 rounded-full bg-gold" />
                <span className="rounded bg-parchment px-3 py-1 text-sm font-semibold text-ink">
                  {character.name}
                </span>
              </div>
            ))}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink via-ink/80 to-transparent p-6 pt-20">
              <p className="text-sm font-semibold uppercase tracking-wide text-gold">Linha do tempo</p>
              <p className="mt-2 text-2xl font-semibold text-parchment">Mentores para cada período bíblico</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
