import { NextResponse } from "next/server";
import { getCharacterById } from "@/lib/characters";
import { loadKnowledgeDocuments, loadMasterPrompt } from "@/lib/knowledge-loader";
import { createOpenAIClient } from "@/lib/openai";
import { buildChatPrompt } from "@/lib/prompt-builder";
import type { ChatRequest } from "@/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ChatRequest>;

    if (!body.characterId || !body.message) {
      return NextResponse.json({ error: "characterId e message sao obrigatorios." }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY nao configurada." }, { status: 500 });
    }

    const character = getCharacterById(body.characterId);

    if (!character) {
      return NextResponse.json({ error: "Personagem nao encontrado." }, { status: 404 });
    }

    const [masterPrompt, knowledgeDocuments] = await Promise.all([
      loadMasterPrompt(),
      loadKnowledgeDocuments()
    ]);

    const prompt = buildChatPrompt({
      masterPrompt,
      character,
      knowledgeDocuments,
      userMessage: body.message
    });

    const openai = createOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            "Voce e um assistente de estudo biblico protestante. Nao substitui aconselhamento pastoral local."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    return NextResponse.json({
      answer: completion.choices[0]?.message?.content ?? "Nao foi possivel gerar uma resposta."
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao processar a pergunta." }, { status: 500 });
  }
}
