import type { Character } from "@/types";
import type { KnowledgeDocument } from "@/lib/knowledge-loader";

type BuildPromptInput = {
  masterPrompt: string;
  character: Character;
  knowledgeDocuments: KnowledgeDocument[];
  userMessage: string;
  sourcePolicyPrompt?: string;
};

export function buildChatPrompt({
  masterPrompt,
  character,
  knowledgeDocuments,
  userMessage,
  sourcePolicyPrompt
}: BuildPromptInput) {
  const orderedDocuments = orderKnowledgeDocuments(knowledgeDocuments, character.name);
  const knowledgeBlock = orderedDocuments
    .map((document) => `# Documento: ${document.relativePath}\n\n${document.content}`)
    .join("\n\n---\n\n");

  return `
${masterPrompt}

## Personagem selecionado
- ID: ${character.id}
- Nome: ${character.name}
- Periodo: ${character.period}
- Livros principais: ${character.books.join(", ")}
- Temas principais: ${character.themes.join(", ")}
- Tom: ${character.tone}
- Enquadramento do mentor: ${character.mentorFrame}

## Base interna de conhecimento
${knowledgeBlock}

## Politica de uso da base
A base enviada foi selecionada para reduzir tokens. Use apenas estes documentos, os dados do personagem ativo e referencias biblicas seguras. Se algum detalhe nao estiver na base enviada, responda com prudencia e indique que a Biblia nao revela diretamente.

${sourcePolicyPrompt ?? ""}

## Regra de resposta direta
Responda diretamente a pergunta do usuario antes de expandir o tema. Nao substitua a pergunta por uma apresentacao generica dos temas do personagem.

Se a pergunta mencionar um assunto que a Biblia nao nomeia diretamente, como termos modernos, especies cientificas ou detalhes historicos nao revelados:
- diga claramente que a Biblia nao usa esse termo ou nao revela esse detalhe;
- responda o que pode ser afirmado a partir dos textos biblicos relacionados;
- se for inferencia, rotule como inferencia;
- mantenha o formato oficial de resposta.

## Pergunta do usuario
${userMessage}

## Instrucao final
Responda em portugues do Brasil. Mantenha fidelidade biblica protestante historica, diferencie texto biblico de inferencia teologica, e use obrigatoriamente o formato oficial dos documentos internos:

Contexto
Texto Bíblico
Explicação
Significado Teológico
Aplicação
Conexão Bíblica
Fontes recomendadas
`.trim();
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function orderKnowledgeDocuments(documents: KnowledgeDocument[], characterName: string) {
  const normalizedCharacterName = normalize(characterName);

  return [...documents].sort((first, second) => {
    const firstScore = getDocumentPriority(first, normalizedCharacterName);
    const secondScore = getDocumentPriority(second, normalizedCharacterName);

    if (firstScore !== secondScore) {
      return firstScore - secondScore;
    }

    return first.relativePath.localeCompare(second.relativePath);
  });
}

function getDocumentPriority(document: KnowledgeDocument, normalizedCharacterName: string) {
  const normalizedPath = normalize(document.relativePath);

  if (normalizedPath.includes(`personagens/`) && normalizedPath.includes(normalizedCharacterName)) {
    return 0;
  }

  if (normalizedPath.includes("padrao de identidade") || normalizedPath.includes("instrucoes gerais")) {
    return 1;
  }

  if (normalizedPath.includes("sistema/core") || normalizedPath.includes("regras operacionais")) {
    return 2;
  }

  if (normalizedPath.includes("documentos/")) {
    return 3;
  }

  if (normalizedPath.includes("personagens/")) {
    return 4;
  }

  return 5;
}
