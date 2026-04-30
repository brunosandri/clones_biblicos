import Link from "next/link";
import { ArrowRight, ScrollText } from "lucide-react";
import { characters } from "@/lib/characters";
import type { StudyTrailStep } from "@/types";

type StudyTrailCardProps = {
  step: StudyTrailStep;
  index: number;
};

export function StudyTrailCard({ step, index }: StudyTrailCardProps) {
  const mentor = characters.find((character) => character.id === step.mentorId);

  return (
    <article className="grid gap-5 border-b border-ink/10 py-6 md:grid-cols-[7rem_1fr_auto] md:items-start">
      <div className="flex items-center gap-3 text-olive">
        <span className="grid h-10 w-10 place-items-center rounded bg-olive text-sm font-bold text-white">
          {String(index + 1).padStart(2, "0")}
        </span>
        <ScrollText size={20} aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-clay">{step.period}</p>
        <h2 className="mt-1 text-2xl font-semibold text-ink">{step.title}</h2>
        <p className="mt-2 max-w-2xl leading-7 text-ink/72">{step.summary}</p>
        <p className="mt-3 text-sm text-ink/65">
          Mentor: <span className="font-semibold text-ink">{mentor?.name}</span>
        </p>
        <p className="mt-2 text-sm text-ink/65">Leituras: {step.readings.join("; ")}</p>
      </div>
      <Link
        href={`/chat?character=${step.mentorId}`}
        className="inline-flex items-center justify-center gap-2 rounded border border-ink/20 px-4 py-2 text-sm font-semibold text-ink transition hover:bg-ink hover:text-parchment md:mt-7"
      >
        Estudar
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}
