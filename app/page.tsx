import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { characters } from "@/lib/characters";

export const dynamic = "force-dynamic";

const mentorSummaries: Record<string, string> = {
  adao: "O primeiro homem. Ensina criação, imagem de Deus, queda e promessa inicial.",
  noe: "Viu o juízo e a graça preservadora. Ensina obediência, aliança e recomeço.",
  abraao: "Pai da fé e peregrino da promessa. Ensina confiança, aliança e justificação pela fé.",
  moises: "Mediador da Lei e guia do êxodo. Ensina libertação, santidade e presença de Deus.",
  davi: "Pastor, rei e salmista. Ensina adoração, arrependimento e esperança messiânica.",
  salomao: "Rei sábio e construtor do templo. Ensina temor do Senhor, sabedoria e propósito.",
  jesus: "O Cristo prometido. Ensina Reino, cruz, ressurreição e cumprimento das Escrituras.",
  paulo: "Apóstolo aos gentios. Ensina graça, justificação, igreja e missão."
};

const mentorStages: Record<string, string> = {
  adao: "Origens",
  noe: "Antediluviano",
  abraao: "Patriarcas",
  moises: "Êxodo",
  davi: "Reino unido",
  salomao: "Sabedoria",
  jesus: "Encarnação",
  paulo: "Igreja primitiva"
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#171a1f] text-parchment">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(183,137,55,0.24),transparent_58%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gold/40" />

      <section className="relative mx-auto max-w-4xl px-6 pb-16 pt-16 text-center md:pt-24">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          Estudo bíblico com mentores temporais
        </p>
        <h1 className="font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-parchment sm:text-7xl">
          Aprenda as Escrituras
          <br />
          <span className="italic text-gold">com quem viveu nelas.</span>
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-base leading-8 text-parchment/62 sm:text-lg">
          Converse com oito mentores bíblicos. Cada resposta é ancorada em texto, contexto histórico
          e aplicação fiel.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/personagens"
            className="inline-flex items-center justify-center gap-2 rounded bg-gold px-5 py-3 text-sm font-semibold text-ink transition hover:bg-parchment"
          >
            Escolher mentor
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link
            href="/trilha"
            className="inline-flex items-center justify-center rounded border border-parchment/14 px-5 py-3 text-sm font-semibold text-parchment/82 transition hover:border-gold/50 hover:text-gold"
          >
            Ver sistema progressivo
          </Link>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-parchment/48">
            Escolha seu mentor
          </h2>
          <span className="hidden text-xs text-parchment/42 sm:block">Sola Scriptura</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {characters.map((character) => (
            <Link
              key={character.id}
              href={`/chat?character=${character.id}`}
              className="group flex min-h-64 flex-col justify-between rounded-lg border border-white/10 bg-[linear-gradient(145deg,rgba(39,43,50,0.92),rgba(27,30,36,0.76))] p-6 shadow-[0_20px_60px_-24px_rgba(183,137,55,0.24)] transition duration-300 hover:-translate-y-1 hover:border-gold/45"
            >
              <div>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                    {mentorStages[character.id]}
                  </span>
                  <span className="text-xs text-parchment/42">{character.themes.length} temas</span>
                </div>
                <h3 className="font-serif text-3xl font-semibold text-parchment">{character.name}</h3>
                <p className="mt-1 text-sm italic text-parchment/48">{character.period}</p>
                <p className="mt-4 text-sm leading-7 text-parchment/65">
                  {mentorSummaries[character.id]}
                </p>
              </div>
              <div className="mt-6 border-t border-white/10 pt-4">
                <div className="flex flex-wrap gap-1.5">
                  {character.themes.slice(0, 2).map((theme) => (
                    <span
                      key={theme}
                      className="rounded-full bg-white/7 px-2.5 py-1 text-[10px] font-medium text-parchment/70"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
                <span className="mt-4 inline-flex text-sm font-medium text-gold opacity-0 transition-opacity group-hover:opacity-100">
                  Conversar →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative border-t border-white/10 px-6 py-12">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_22rem]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
              Sistema progressivo de Estudo
            </p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-parchment">
              A revelação bíblica em ordem cronológica
            </h2>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-parchment/65">
              {characters.map((character, index) => (
                <span key={character.id} className="inline-flex items-center gap-2">
                  <span>{character.name}</span>
                  {index < characters.length - 1 ? <span className="text-gold/70">↓</span> : null}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-5">
            <p className="text-sm leading-7 text-parchment/68">
              Cada clone funciona como um mentor do seu tempo, um intérprete do seu contexto e um guia
              para dúvidas daquele período.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
