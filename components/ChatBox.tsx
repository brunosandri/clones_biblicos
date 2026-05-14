"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import { Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { characters } from "@/lib/characters";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatBoxProps = {
  initialCharacterId?: string;
};

export function ChatBox({ initialCharacterId = "jesus" }: ChatBoxProps) {
  const searchParams = useSearchParams();
  const requestedCharacter = searchParams.get("character") ?? initialCharacterId;
  const validInitialCharacter = characters.some((character) => character.id === requestedCharacter)
    ? requestedCharacter
    : initialCharacterId;
  const [characterId, setCharacterId] = useState(validInitialCharacter);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCharacter = useMemo(
    () => characters.find((character) => character.id === characterId) ?? characters[0],
    [characterId]
  );

  function handleCharacterChange(nextCharacterId: string) {
    setCharacterId(nextCharacterId);
    setMessages([]);
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isLoading) {
      return;
    }

    setError(null);
    setMessage("");
    setMessages((current) => [...current, { role: "user", content: trimmedMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId, message: trimmedMessage })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Nao foi possivel gerar a resposta.");
      }

      setMessages((current) => [...current, { role: "assistant", content: data.answer }]);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[20rem_1fr]">
      <aside className="rounded-lg border border-ink/10 bg-white/70 p-5 shadow-soft">
        <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded bg-ink">
          <Image
            src={selectedCharacter.imagePath}
            alt={`Retrato de ${selectedCharacter.name}`}
            fill
            sizes="20rem"
            className="object-cover"
            priority
          />
        </div>
        <label className="text-sm font-semibold text-ink" htmlFor="character">
          Mentor bíblico
        </label>
        <select
          id="character"
          value={characterId}
          onChange={(event) => handleCharacterChange(event.target.value)}
          className="mt-2 w-full rounded border border-ink/15 bg-white px-3 py-2 text-ink outline-none focus:border-gold"
        >
          {characters.map((character) => (
            <option key={character.id} value={character.id}>
              {character.name}
            </option>
          ))}
        </select>

        <div className="mt-6">
          <p className="text-sm font-semibold text-ink">{selectedCharacter.period}</p>
          <h2 className="mt-1 text-2xl font-semibold text-ink">{selectedCharacter.name}</h2>
          <p className="mt-3 text-sm leading-6 text-ink/70">{selectedCharacter.tone}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedCharacter.themes.map((theme) => (
              <span key={theme} className="rounded bg-olive/15 px-2.5 py-1 text-xs font-medium text-olive">
                {theme}
              </span>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex min-h-[34rem] flex-col rounded-lg border border-ink/10 bg-white/80 shadow-soft">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 ? (
            <div className="grid h-full min-h-80 place-items-center text-center">
              <div>
                <p className="text-lg font-semibold text-ink">Faça uma pergunta bíblica</p>
                <p className="mt-2 max-w-md text-sm leading-6 text-ink/65">
                  O mentor responderá com uma conversa natural, fiel à Bíblia e coerente com sua própria
                  voz, sem seguir um modelo fixo de seções.
                </p>
              </div>
            </div>
          ) : (
            messages.map((chatMessage, index) => (
              <div
                key={`${chatMessage.role}-${index}`}
                className={`rounded-lg p-4 ${
                  chatMessage.role === "user" ? "ml-auto max-w-2xl bg-ink text-parchment" : "bg-parchment text-ink"
                }`}
              >
                <pre className="whitespace-pre-wrap font-sans text-sm leading-6">{chatMessage.content}</pre>
              </div>
            ))
          )}

          {isLoading ? (
            <div className="rounded-lg bg-parchment p-4 text-sm text-ink/70">Preparando resposta...</div>
          ) : null}
          {error ? <div className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-ink/10 p-4">
          <div className="flex gap-3">
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Digite sua pergunta..."
              className="min-h-14 flex-1 resize-none rounded border border-ink/15 bg-white px-3 py-3 text-sm outline-none focus:border-gold"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded bg-ink text-parchment transition hover:bg-cedar disabled:cursor-not-allowed disabled:opacity-60"
              title="Enviar pergunta"
            >
              <Send size={19} aria-hidden="true" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
