import { StudyTrailCard } from "@/components/StudyTrailCard";
import { studyTrail } from "@/lib/characters";

export default function TrailPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-olive">Trilha cronológica</p>
        <h1 className="mt-3 text-4xl font-bold text-ink">Estude a Bíblia em ordem histórica</h1>
        <p className="mt-3 leading-7 text-ink/70">
          Uma trilha inicial para percorrer os grandes períodos da revelação bíblica, conectando leituras,
          temas e mentores.
        </p>
      </div>
      <section className="mt-8 rounded-lg border border-ink/10 bg-white/60 px-5 shadow-soft">
        {studyTrail.map((step, index) => (
          <StudyTrailCard key={step.id} step={step} index={index} />
        ))}
      </section>
    </main>
  );
}
