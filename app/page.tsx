import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  MessageSquareText,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { characters } from "@/lib/characters";

export const dynamic = "force-dynamic";

const outcomes = [
  "Entenda a Bíblia em ordem cronológica, sem ficar perdido entre livros, épocas e personagens.",
  "Faça perguntas livres e receba respostas na voz do mentor bíblico escolhido.",
  "Estude criação, aliança, lei, reino, sabedoria, evangelhos e igreja com contexto progressivo.",
  "Tenha uma base protestante histórica, com limites claros entre texto bíblico e inferência."
];

const mechanisms = [
  {
    icon: MessageSquareText,
    title: "Conversa natural",
    text: "Você pergunta como falaria com um professor. O clone responde sem roteiro engessado, mantendo a voz do personagem."
  },
  {
    icon: Clock3,
    title: "Linha do tempo bíblica",
    text: "Cada mentor fica ligado ao seu período, ajudando você a enxergar o desenvolvimento da revelação."
  },
  {
    icon: ShieldCheck,
    title: "Base teológica segura",
    text: "As respostas seguem a autoridade das Escrituras e distinguem Bíblia, teologia e aplicação."
  }
];

const objections = [
  {
    title: "Não é mais um resumo genérico",
    text: "A experiência foi pensada para estudo bíblico guiado por personagens, não para respostas soltas sem contexto."
  },
  {
    title: "Não exige conhecimento prévio",
    text: "Você pode começar com perguntas simples e aprofundar conforme entende cada período da história bíblica."
  },
  {
    title: "Não força um formato artificial",
    text: "Os clones respondem de forma natural, respeitando a pergunta e a voz do mentor selecionado."
  }
];

const faq = [
  {
    question: "O que está incluso no acesso?",
    answer: "Acesso aos clones bíblicos, chat com os mentores, trilha cronológica e base de conhecimento organizada por temas e períodos."
  },
  {
    question: "Posso estudar por personagem?",
    answer: "Sim. Você pode conversar com Adão, Noé, Abraão, Moisés, Davi, Salomão, Jesus e Paulo."
  },
  {
    question: "A assinatura anual tem desconto?",
    answer: "Sim. O anual sai por R$ 189,90, cerca de 20% abaixo do total pago mês a mês."
  }
];

export default function HomePage() {
  return (
    <main className="bg-parchment text-ink">
      <section className="relative min-h-[calc(100vh-57px)] overflow-hidden bg-ink text-parchment">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="/cards/jesus.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-ink/75" />
        <div className="absolute inset-y-0 right-0 hidden w-1/2 grid-cols-2 gap-3 p-6 opacity-70 lg:grid">
          {characters.slice(0, 6).map((character, index) => (
            <div
              key={character.id}
              className={`relative overflow-hidden border border-parchment/10 bg-white/5 ${
                index % 2 === 0 ? "translate-y-8" : "-translate-y-3"
              }`}
            >
              <Image
                src={character.imagePath}
                alt=""
                fill
                sizes="24vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-ink/25" />
              <span className="absolute bottom-3 left-3 text-sm font-semibold text-parchment">
                {character.name}
              </span>
            </div>
          ))}
        </div>

        <div className="relative mx-auto flex min-h-[calc(100vh-57px)] max-w-6xl flex-col justify-center px-5 py-14">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">
              Assinatura Clones da Bíblia
            </p>
            <h1 className="mt-5 font-serif text-5xl font-semibold leading-[1.03] text-parchment sm:text-6xl lg:text-7xl">
              Estude a Bíblia conversando com mentores bíblicos.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-parchment/80">
              Acesse clones de personagens bíblicos treinados para responder com contexto histórico,
              fidelidade às Escrituras e linguagem natural, como uma mentoria de estudo bíblico sempre disponível.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#planos"
                className="inline-flex items-center justify-center gap-2 rounded bg-gold px-6 py-3 text-sm font-semibold text-ink transition hover:bg-parchment"
              >
                Ver planos
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                href="/personagens"
                className="inline-flex items-center justify-center rounded border border-parchment/20 px-6 py-3 text-sm font-semibold text-parchment transition hover:border-gold hover:text-gold"
              >
                Conhecer os clones
              </Link>
            </div>
            <div className="mt-8 grid max-w-2xl gap-3 text-sm text-parchment/70 sm:grid-cols-3">
              <span className="inline-flex items-center gap-2">
                <Check size={16} className="text-gold" aria-hidden="true" />
                8 mentores bíblicos
              </span>
              <span className="inline-flex items-center gap-2">
                <Check size={16} className="text-gold" aria-hidden="true" />
                Trilha cronológica
              </span>
              <span className="inline-flex items-center gap-2">
                <Check size={16} className="text-gold" aria-hidden="true" />
                R$ 19,90/mês
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-white/55 px-5 py-10">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-4">
          {outcomes.map((outcome) => (
            <div key={outcome} className="border-l-2 border-gold pl-4 text-sm leading-6 text-ink/70">
              {outcome}
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-olive">O problema</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-ink">
              Muita gente lê a Bíblia, mas não consegue juntar período, contexto e aplicação.
            </h2>
            <p className="mt-4 text-base leading-8 text-ink/70">
              O resultado é estudo fragmentado: uma dúvida em Gênesis, outra em Romanos, outra nos Evangelhos,
              sem entender como tudo se conecta. Os clones ajudam você a fazer perguntas no ponto exato da história bíblica.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {mechanisms.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-lg border border-ink/10 bg-white/70 p-6 shadow-soft">
                  <Icon size={24} className="text-gold" aria-hidden="true" />
                  <h3 className="mt-5 text-xl font-semibold text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-ink/70">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-ink px-5 py-16 text-parchment">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
                Mentores incluídos
              </p>
              <h2 className="mt-3 font-serif text-4xl font-semibold">
                Oito vozes para acompanhar a história da redenção.
              </h2>
            </div>
            <Link
              href="/personagens"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold transition hover:text-parchment"
            >
              Ver todos
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-9 grid grid-cols-2 gap-3 md:grid-cols-4">
            {characters.map((character) => (
              <Link
                key={character.id}
                href={`/chat?character=${character.id}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-parchment/10 bg-white/5"
              >
                <Image src={character.imagePath} alt="" fill sizes="25vw" className="object-cover transition duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-serif text-2xl font-semibold">{character.name}</h3>
                  <p className="mt-1 text-xs text-parchment/70">{character.period}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="planos" className="px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-olive">Planos</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-ink">
              Escolha como quer acessar os clones.
            </h2>
            <p className="mt-4 text-base leading-8 text-ink/70">
              O anual foi criado para quem quer manter uma rotina de estudo bíblico ao longo do ano.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <div className="rounded-lg border border-ink/10 bg-white/75 p-7 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold text-ink">Mensal</h3>
                  <p className="mt-2 text-sm text-ink/60">Comece com baixo compromisso.</p>
                </div>
                <BookOpen className="text-gold" size={26} aria-hidden="true" />
              </div>
              <div className="mt-8 flex items-end gap-2">
                <span className="text-5xl font-semibold text-ink">R$ 19,90</span>
                <span className="pb-2 text-sm text-ink/60">/mês</span>
              </div>
              <ul className="mt-7 space-y-3 text-sm text-ink/70">
                <li className="flex gap-2"><Check size={17} className="mt-0.5 text-olive" /> Acesso aos 8 clones</li>
                <li className="flex gap-2"><Check size={17} className="mt-0.5 text-olive" /> Chat com mentores bíblicos</li>
                <li className="flex gap-2"><Check size={17} className="mt-0.5 text-olive" /> Trilha cronológica de estudo</li>
              </ul>
              <Link
                href="/chat"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded bg-ink px-5 py-3 text-sm font-semibold text-parchment transition hover:bg-cedar"
              >
                Começar mensal
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>

            <div className="relative rounded-lg border-2 border-gold bg-ink p-7 text-parchment shadow-[0_24px_70px_rgba(23,32,29,0.24)]">
              <div className="absolute right-5 top-5 rounded bg-gold px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-ink">
                Melhor escolha
              </div>
              <div className="pr-28">
                <h3 className="text-2xl font-semibold">Anual</h3>
                <p className="mt-2 text-sm text-parchment/70">Economize cerca de 20% e estude sem interrupção.</p>
              </div>
              <div className="mt-8 flex items-end gap-2">
                <span className="text-5xl font-semibold">R$ 189,90</span>
                <span className="pb-2 text-sm text-parchment/60">/ano</span>
              </div>
              <p className="mt-3 text-sm text-gold">Equivale a R$ 15,83 por mês.</p>
              <ul className="mt-7 space-y-3 text-sm text-parchment/75">
                <li className="flex gap-2"><Check size={17} className="mt-0.5 text-gold" /> Todos os benefícios do mensal</li>
                <li className="flex gap-2"><Check size={17} className="mt-0.5 text-gold" /> Melhor custo para estudo contínuo</li>
                <li className="flex gap-2"><Check size={17} className="mt-0.5 text-gold" /> Ideal para devocional, discipulado e escola bíblica</li>
              </ul>
              <Link
                href="/chat"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded bg-gold px-5 py-3 text-sm font-semibold text-ink transition hover:bg-parchment"
              >
                Assinar anual
                <Sparkles size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-white/55 px-5 py-16">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {objections.map((item) => (
            <div key={item.title}>
              <h3 className="text-xl font-semibold text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-ink/70">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-olive">Dúvidas comuns</p>
          <div className="mt-7 divide-y divide-ink/10 border-y border-ink/10">
            {faq.map((item) => (
              <div key={item.question} className="py-6">
                <h3 className="text-lg font-semibold text-ink">{item.question}</h3>
                <p className="mt-2 text-sm leading-7 text-ink/70">{item.answer}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 bg-ink px-6 py-8 text-parchment md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <h2 className="font-serif text-3xl font-semibold">Comece hoje por R$ 19,90.</h2>
              <p className="mt-2 text-sm text-parchment/70">
                Escolha um mentor, faça sua primeira pergunta e organize seu estudo bíblico.
              </p>
            </div>
            <Link
              href="#planos"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded bg-gold px-5 py-3 text-sm font-semibold text-ink transition hover:bg-parchment md:mt-0"
            >
              Escolher plano
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
