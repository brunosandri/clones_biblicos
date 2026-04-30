import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import type { Character } from "@/types";

type CharacterCardProps = {
  character: Character;
};

export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <article className="flex h-full overflow-hidden rounded-lg border border-ink/10 bg-white/70 shadow-soft">
      <div className="flex w-full flex-col">
        <div className="relative aspect-[4/3] w-full bg-ink">
          <Image
            src={character.imagePath}
            alt={`Retrato de ${character.name}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            priority={character.id === "jesus"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-sm font-medium uppercase tracking-wide text-gold">{character.period}</p>
            <h2 className="mt-1 text-3xl font-semibold text-white">{character.name}</h2>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex-1">
            <p className="text-sm leading-6 text-ink/70">{character.mentorFrame}</p>
            <div className="mt-5">
              <p className="text-sm font-semibold text-ink">Livros principais</p>
              <p className="mt-1 text-sm text-ink/70">{character.books.join(", ")}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {character.themes.map((theme) => (
                <span key={theme} className="rounded bg-gold/15 px-2.5 py-1 text-xs font-medium text-cedar">
                  {theme}
                </span>
              ))}
            </div>
          </div>
          <Link
            href={`/chat?character=${character.id}`}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded bg-ink px-4 py-2.5 text-sm font-semibold text-parchment transition hover:bg-cedar"
          >
            <MessageCircle size={17} aria-hidden="true" />
            Conversar
          </Link>
        </div>
      </div>
    </article>
  );
}
