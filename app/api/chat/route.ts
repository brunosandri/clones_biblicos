import { NextResponse } from "next/server";
import { getCharacterById } from "@/lib/characters";
import { loadKnowledgeDocuments, loadMasterPrompt, selectKnowledgeDocuments } from "@/lib/knowledge-loader";
import { createOpenAIClient } from "@/lib/openai";
import { buildChatPrompt } from "@/lib/prompt-builder";
import { CHAT_SECURITY_INSTRUCTIONS, validateUserMessage } from "@/lib/prompt-security";
import { buildSourcePolicyPrompt, needsExternalSources } from "@/lib/source-policy";
import type { ChatRequest } from "@/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ChatRequest>;

    const userMessage = validateUserMessage(body.message);

    if (!body.characterId || !userMessage.ok) {
      return NextResponse.json(
        { error: !body.characterId ? "characterId e obrigatorio." : userMessage.error },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY nao configurada." }, { status: 500 });
    }

    const character = getCharacterById(body.characterId);

    if (!character) {
      return NextResponse.json({ error: "Personagem nao encontrado." }, { status: 404 });
    }

    const [masterPrompt, knowledgeDocuments] = await Promise.all([
      loadMasterPrompt(character),
      loadKnowledgeDocuments()
    ]);
    const shouldUseExternalSources = needsExternalSources(userMessage.message);

    const prompt = buildChatPrompt({
      masterPrompt,
      character,
      knowledgeDocuments: selectKnowledgeDocuments({
        documents: knowledgeDocuments,
        character,
        userMessage: userMessage.message
      }),
      userMessage: userMessage.message,
      sourcePolicyPrompt: buildSourcePolicyPrompt(shouldUseExternalSources),
      hasPromptInjectionPattern: userMessage.hasPromptInjectionPattern
    });

    const openai = createOpenAIClient();

    if (shouldUseExternalSources) {
      const response = await openai.responses.create({
        model: process.env.OPENAI_WEB_MODEL ?? process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        tools: [
          {
            type: "web_search",
            search_context_size: "low"
          }
        ],
        tool_choice: "auto",
        include: ["web_search_call.action.sources"],
        instructions: [
          "Voce e um assistente de estudo biblico protestante. Use fontes externas somente para contexto verificavel e cite URLs. Nao substitui aconselhamento pastoral local.",
          CHAT_SECURITY_INSTRUCTIONS
        ].join("\n\n"),
        input: prompt
      });

      return NextResponse.json({
        answer: response.output_text ?? "Nao foi possivel gerar uma resposta com fontes externas."
      });
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: [
            "Voce e um assistente de estudo biblico protestante. Nao substitui aconselhamento pastoral local.",
            CHAT_SECURITY_INSTRUCTIONS
          ].join("\n\n")
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
