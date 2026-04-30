import { Suspense } from "react";
import { ChatBox } from "@/components/ChatBox";

export default function ChatPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-olive">Perguntas e respostas</p>
        <h1 className="mt-3 text-4xl font-bold text-ink">Converse com um mentor</h1>
        <p className="mt-3 leading-7 text-ink/70">
          Selecione um personagem, faça sua pergunta e receba uma resposta estruturada com contexto,
          Escritura, explicação, teologia, aplicação e fontes.
        </p>
      </div>
      <Suspense fallback={<div className="rounded bg-white/70 p-6">Carregando chat...</div>}>
        <ChatBox />
      </Suspense>
    </main>
  );
}
