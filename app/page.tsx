import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Layers, MessageCircle, ScrollText } from "lucide-react";
import { characters } from "@/lib/characters";

export const dynamic = "force-dynamic";

const principles = [
  "um mentor do seu tempo",
  "um intérprete do seu contexto",
  "um guia para dúvidas daquele período"
];

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-ink/10 bg-ink text-parchment">
        <div className="absolute inset-0 opacity-35">
          <Image
            src="/cards/jesus.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_18%]"
          />
          <div className="absolute inset-0 bg-ink/80" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-[1fr_28rem]">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded border border-gold/40 bg-gold/10 px-3 py-1.5 text-sm font-semibold text-gold">
              <ScrollText size={16} aria-hidden="true" />
              Sistema progressivo de Estudo
            </p>
            <h1 className="mt-6 text-5xl font-bold leading-tight md:text-7xl">
              Aprenda as Escrituras <span className="text-gold">com quem viveu nelas.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-parchment/82 md:text-xl">
              Converse com oito mentores bíblicos. Cada resposta é ancorada em texto, contexto
              histórico e aplicação fiel.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/trilha"
                className="inline-flex items-center justify-center gap-2 rounded bg-gold px-5 py-3 font-semibold text-ink transition hover:bg-parchment"
              >
                Começar estudo
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-2 rounded border border-parchment/35 px-5 py-3 font-semibold text-parchment transition hover:bg-parchment/10"
              >
                <MessageCircle size={18} aria-hidden="true" />
                Conversar com um mentor
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
            {characters.slice(0, 4).map((character) => (
              <Link
                key={character.id}
                href={`/chat?character=${character.id}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-parchment/15 bg-parchment/10"
              >
                <Image
                  src={character.imagePath}
                  alt={`Retrato de ${character.name}`}
                  fill
                  sizes="(min-width: 1024px) 14rem, 50vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-sm font-semibold text-gold">{character.period}</p>
                  <p className="mt-1 text-2xl font-bold text-white">{character.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-parchment px-4 py-12">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_26rem]">
          <div>
            <div className="flex items-center gap-3 text-olive">
              <Layers size={22} aria-hidden="true" />
              <p className="text-sm font-semibold uppercase tracking-wide">Ordem cronológica</p>
            </div>
            <h2 className="mt-3 text-4xl font-bold text-ink">Um caminho de estudo por períodos bíblicos</h2>
            <div className="mt-8 grid gap-3 md:grid-cols-4">
              {characters.map((character, index) => (
                <Link
                  key={character.id}
                  href={`/chat?character=${character.id}`}
                  className="group rounded-lg border border-ink/10 bg-white/75 p-4 shadow-soft transition hover:-translate-y-1 hover:bg-white"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded bg-ink text-sm font-bold text-parchment">
                      {index + 1}
                    </span>
                    <ArrowRight
                      size={17}
                      aria-hidden="true"
                      className="text-ink/35 transition group-hover:text-gold"
                    />
                  </div>
                  <p className="mt-4 text-xl font-bold text-ink">{character.name}</p>
                  <p className="mt-1 text-sm leading-5 text-ink/62">{character.period}</p>
                </Link>
              ))}
            </div>
          </div>

          <aside className="rounded-lg bg-ink p-6 text-parchment shadow-soft">
            <div className="grid h-12 w-12 place-items-center rounded bg-gold text-ink">
              <BookOpen size={23} aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-3xl font-bold">Cada mentor funciona como:</h2>
            <div className="mt-6 space-y-3">
              {principles.map((principle) => (
                <div key={principle} className="rounded border border-parchment/12 bg-parchment/8 p-4">
                  <p className="font-semibold text-parchment">{principle}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm leading-6 text-parchment/70">
              A trilha acompanha a revelação progressiva: criação, queda, aliança, lei, reino,
              sabedoria, Cristo e igreja.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
