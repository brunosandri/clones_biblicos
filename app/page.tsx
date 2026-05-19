import Image from "next/image";
import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  GraduationCap,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  UsersRound
} from "lucide-react";
import { characters } from "@/lib/characters";

export const dynamic = "force-dynamic";

const outcomes = [
  "Um plano simples para sair da leitura solta e estudar a Bíblia em ordem cronológica.",
  "Perguntas livres respondidas por mentores bíblicos com voz, contexto e fidelidade às Escrituras.",
  "Criação, aliança, lei, reino, sabedoria, evangelhos e igreja conectados numa mesma história.",
  "Base protestante histórica, com separação clara entre texto bíblico, teologia e inferência."
];

const offerStack = [
  "Converse com 8 mentores bíblicos.",
  "Receba respostas com contexto e referências.",
  "Siga uma trilha cronológica de estudo."
];

const mechanisms = [
  {
    icon: MessageSquareText,
    title: "Pergunte como perguntaria a um professor",
    text: "Você não precisa saber por onde começar. Escreva sua dúvida e receba uma resposta guiada pelo personagem escolhido."
  },
  {
    icon: Clock3,
    title: "Pare de estudar a Bíblia em pedaços soltos",
    text: "Cada mentor fica ligado ao seu período, ajudando você a enxergar criação, queda, alianças, reino, Cristo e igreja como uma linha contínua."
  },
  {
    icon: ShieldCheck,
    title: "Sem misticismo e sem resposta genérica",
    text: "As respostas seguem a autoridade das Escrituras e deixam claro quando algo é texto bíblico, inferência ou aplicação."
  }
];

const proofPoints = [
  {
    icon: UsersRound,
    title: "Feito para cristãos comuns",
    text: "Pais, jovens, líderes, professores e novos convertidos que querem estudar com mais ordem."
  },
  {
    icon: GraduationCap,
    title: "Serve para rotina real",
    text: "Use em devocional, discipulado, escola bíblica, preparação de aula ou dúvidas do dia a dia."
  },
  {
    icon: BookOpen,
    title: "A Bíblia continua no centro",
    text: "A tecnologia organiza o estudo, mas não substitui as Escrituras, a igreja local nem aconselhamento pastoral."
  }
];

const objections = [
  {
    title: "Não é um brinquedo de IA",
    text: "A experiência foi pensada para estudo bíblico guiado por personagens, com regras de fidelidade, contexto e prudência."
  },
  {
    title: "Não exige seminário",
    text: "Você pode começar com perguntas simples e aprofundar conforme entende cada período da história bíblica."
  },
  {
    title: "Não promete revelação secreta",
    text: "O objetivo é clareza, contexto e aplicação fiel, não substituir a leitura bíblica nem inventar doutrina."
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

const monthlyCheckoutUrl = process.env.NEXT_PUBLIC_MONTHLY_CHECKOUT_URL ?? "https://pay.kiwify.com.br/HjxToAF";
const annualCheckoutUrl = process.env.NEXT_PUBLIC_ANNUAL_CHECKOUT_URL ?? "https://pay.kiwify.com.br/zimm1D9";

export default function HomePage() {
  return (
    <main className="bg-parchment text-ink">
      <section className="relative min-h-[calc(100vh-57px)] overflow-hidden bg-ink text-parchment">
        <div className="absolute inset-0 bg-ink/82" />
        <div className="absolute inset-0 grid grid-cols-2 gap-2 p-2 opacity-40 sm:grid-cols-4 xl:opacity-45">
          {characters.map((character, index) => (
            <div
              key={character.id}
              className={`relative min-h-0 overflow-hidden border border-parchment/10 bg-white/5 ${
                index % 2 === 0 ? "translate-y-3" : "-translate-y-2"
              }`}
            >
              <Image
                src={character.imagePath}
                alt=""
                fill
                priority={index < 4}
                sizes="(min-width: 640px) 25vw, 50vw"
                className="object-cover grayscale"
              />
              <div className="absolute inset-0 bg-ink/35" />
              <span className="absolute bottom-3 left-3 rounded bg-ink/65 px-2 py-1 text-xs font-semibold text-parchment/85 backdrop-blur">
                {character.name}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/88 to-ink/58" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-ink/30" />

        <div className="relative mx-auto flex min-h-[calc(100vh-57px)] max-w-6xl flex-col justify-center px-5 py-16">
          <div className="max-w-2xl">
            <LogoMark className="mb-7 h-14 w-auto" />
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">
              Assinatura Clones da Bíblia
            </p>
            <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight text-parchment sm:text-5xl lg:text-6xl">
              Entenda a Bíblia conversando com quem viveu cada parte da história.
            </h1>
            <p className="mt-6 max-w-xl text-xl leading-8 text-parchment/82">
              Escolha um personagem, faça sua pergunta e receba uma resposta bíblica com contexto, ordem e aplicação.
            </p>
            <ul className="mt-7 grid max-w-xl gap-3 text-base leading-7 text-parchment/78">
              {offerStack.map((item) => (
                <li key={item} className="flex gap-2">
                  <Check size={19} className="mt-1 shrink-0 text-gold" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#planos"
                className="inline-flex items-center justify-center gap-2 rounded bg-gold px-7 py-4 text-base font-semibold text-ink transition hover:bg-parchment"
              >
                Quero acessar os clones
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded border border-parchment/20 px-7 py-4 text-base font-semibold text-parchment transition hover:border-gold hover:text-gold"
              >
                Já sou assinante
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-parchment/68">
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
                A partir de R$ 19,90
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

      <section className="bg-clay px-5 py-10 text-parchment">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 md:flex-row md:items-start">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-parchment text-clay">
            <AlertTriangle size={24} aria-hidden="true" />
          </div>
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-parchment/75">Atenção</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold">
              O problema não é falta de conteúdo bíblico. É falta de ordem para transformar conteúdo em entendimento.
            </h2>
            <p className="mt-4 text-base leading-8 text-parchment/80">
              Você pode assistir dezenas de aulas, salvar vídeos, abrir comentários e ainda terminar sem saber como Gênesis,
              Moisés, Davi, Jesus e Paulo se conectam. Os clones foram criados para colocar suas perguntas dentro da história
              bíblica, com contexto e direção.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-olive">O problema</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-ink">
              Você lê, entende algumas partes, mas sente que a história inteira ainda não fechou.
            </h2>
            <p className="mt-4 text-base leading-8 text-ink/70">
              Quem veio antes de Abraão? Por que a lei foi dada? Como os reis apontam para Cristo? Por que Paulo fala do jeito
              que fala? O estudo fragmentado cria dúvidas soltas. Os clones ajudam você a perguntar no ponto exato da história bíblica.
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

          <div className="mt-10 grid gap-5 border-y border-ink/10 py-8 md:grid-cols-3">
            {proofPoints.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-olive text-parchment">
                    <Icon size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-ink/70">{item.text}</p>
                  </div>
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
            <p className="text-sm leading-6 text-parchment/65 md:max-w-xs">
              Assine para conversar com cada mentor no chat exclusivo para membros.
            </p>
          </div>
          <div className="mt-9 grid grid-cols-2 gap-3 md:grid-cols-4">
            {characters.map((character) => (
              <div
                key={character.id}
                className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-parchment/10 bg-white/5"
              >
                <Image src={character.imagePath} alt="" fill sizes="25vw" className="object-cover transition duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-serif text-2xl font-semibold">{character.name}</h3>
                  <p className="mt-1 text-xs text-parchment/70">{character.period}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="planos" className="px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-olive">Planos</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-ink">
              Comece com um plano simples de estudo bíblico guiado.
            </h2>
            <p className="mt-4 text-base leading-8 text-ink/70">
              Não é uma promessa de conhecimento instantâneo. É uma ferramenta para criar constância, fazer perguntas melhores
              e enxergar a Bíblia com mais contexto ao longo da semana.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <div className="rounded-lg border border-ink/10 bg-white/75 p-7 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold text-ink">Mensal</h3>
                  <p className="mt-2 text-sm text-ink/60">Para testar o método e estudar no seu ritmo.</p>
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
                <li className="flex gap-2"><Check size={17} className="mt-0.5 text-olive" /> Respostas com contexto e referências</li>
              </ul>
              <Link
                href={monthlyCheckoutUrl}
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
                <p className="mt-2 text-sm text-parchment/70">Para criar uma rotina de estudo durante o ano inteiro.</p>
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
                <li className="flex gap-2"><Check size={17} className="mt-0.5 text-gold" /> Acesso renovado sem interromper sua trilha</li>
              </ul>
              <Link
                href={annualCheckoutUrl}
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
              <h2 className="font-serif text-3xl font-semibold">Abra a Bíblia com uma pergunta melhor hoje.</h2>
              <p className="mt-2 text-sm text-parchment/70">
                Assine, escolha um mentor e comece pela dúvida que está travando seu estudo agora.
              </p>
            </div>
            <Link
              href={monthlyCheckoutUrl}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded bg-gold px-5 py-3 text-sm font-semibold text-ink transition hover:bg-parchment md:mt-0"
            >
              Quero começar agora
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
