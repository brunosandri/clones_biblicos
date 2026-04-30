import { CharacterCard } from "@/components/CharacterCard";
import { characters } from "@/lib/characters";

export default function CharactersPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-olive">Mentores temporais</p>
        <h1 className="mt-3 text-4xl font-bold text-ink">Escolha um personagem bíblico</h1>
        <p className="mt-3 leading-7 text-ink/70">
          Cada mentor responde a partir do seu período na história bíblica, mantendo a resposta ancorada no
          cânon e no desenvolvimento progressivo da revelação.
        </p>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {characters.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>
    </main>
  );
}
