import { promises as fs } from "fs";
import path from "path";

export type KnowledgeDocument = {
  fileName: string;
  relativePath: string;
  content: string;
};

const KNOWLEDGE_DIR = path.join(process.cwd(), "knowledge");

async function findMarkdownFiles(directory: string): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return findMarkdownFiles(fullPath);
      }

      if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
        return [fullPath];
      }

      return [];
    })
  );

  return files.flat();
}

function isMasterPrompt(filePath: string) {
  return path.basename(filePath).toLowerCase().includes("master");
}

export async function loadKnowledgeDocuments(): Promise<KnowledgeDocument[]> {
  const markdownFiles = (await findMarkdownFiles(KNOWLEDGE_DIR))
    .filter((filePath) => !isMasterPrompt(filePath))
    .sort();

  return Promise.all(
    markdownFiles.map(async (filePath) => ({
      fileName: path.basename(filePath),
      relativePath: path.relative(KNOWLEDGE_DIR, filePath).replaceAll(path.sep, "/"),
      content: await fs.readFile(filePath, "utf8")
    }))
  );
}

export function selectKnowledgeDocuments({
  documents,
  characterName,
  userMessage
}: {
  documents: KnowledgeDocument[];
  characterName: string;
  userMessage: string;
}) {
  const selectedPaths = new Set<string>();
  const normalizedCharacterName = normalize(characterName);
  const normalizedMessage = normalize(userMessage);

  const include = (match: (document: KnowledgeDocument, normalizedPath: string) => boolean) => {
    documents.forEach((document) => {
      const normalizedPath = normalize(document.relativePath);

      if (match(document, normalizedPath)) {
        selectedPaths.add(document.relativePath);
      }
    });
  };

  // Base mínima para todas as respostas.
  include((_, pathName) => pathName.includes("personagens/0. instrucoes gerais"));
  include((_, pathName) => pathName.includes("personagens/00. padrao de identidade geral"));
  include((_, pathName) => pathName.includes("sistema de perguntas e respostas padrao"));
  include((_, pathName) => pathName.includes("regras teologicas"));
  include((_, pathName) => pathName.includes("fontes protestantes"));

  // Documento específico do mentor ativo.
  include((_, pathName) => pathName.includes("personagens/") && pathName.includes(normalizedCharacterName));

  // Documentos de roteamento e segurança quando a pergunta cruza períodos/personagens.
  if (mentionsAny(normalizedMessage, ["quem deve responder", "personagem", "mentor", "periodo", "periodo biblico"])) {
    include((_, pathName) => pathName.includes("motor de decisao do personagem"));
    include((_, pathName) => pathName.includes("classificador de perguntas"));
  }

  if (mentionsAny(normalizedMessage, ["cronologia", "ordem", "linha do tempo", "quando", "antes", "depois"])) {
    include((_, pathName) => pathName.includes("cronologia biblica"));
    include((_, pathName) => pathName.includes("trilha completa"));
  }

  if (
    mentionsAny(normalizedMessage, [
      "tema",
      "doutrina",
      "pecado",
      "salvacao",
      "alianca",
      "lei",
      "reino",
      "sabedoria",
      "igreja",
      "espirito",
      "missao",
      "criacao",
      "origem",
      "mundo",
      "terra",
      "universo",
      "vida",
      "animal",
      "animais",
      "dinossauro",
      "dinossauros"
    ])
  ) {
    include((_, pathName) => pathName.includes("matriz de temas biblicos"));
  }

  if (mentionsAny(normalizedMessage, ["revelacao", "progressiva", "cumpre", "cumprimento", "cristo", "jesus", "messias", "promessa"])) {
    include((_, pathName) => pathName.includes("mapa de revelacao progressiva"));
  }

  if (mentionsAny(normalizedMessage, ["pergunta", "faq", "resposta padrao", "como responder"])) {
    include((_, pathName) => pathName.includes("banco de perguntas"));
  }

  const selectedDocuments = documents.filter((document) => selectedPaths.has(document.relativePath));
  return orderSelectedDocuments(selectedDocuments, characterName).slice(0, 9);
}

export async function loadMasterPrompt() {
  const masterPromptPath = (await findMarkdownFiles(KNOWLEDGE_DIR)).find(isMasterPrompt);

  if (!masterPromptPath) {
    throw new Error("Master Prompt nao encontrado na pasta knowledge.");
  }

  return fs.readFile(masterPromptPath, "utf8");
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function mentionsAny(value: string, keywords: string[]) {
  return keywords.some((keyword) => value.includes(normalize(keyword)));
}

function orderSelectedDocuments(documents: KnowledgeDocument[], characterName: string) {
  const normalizedCharacterName = normalize(characterName);

  return [...documents].sort((first, second) => {
    const firstScore = getPriority(first, normalizedCharacterName);
    const secondScore = getPriority(second, normalizedCharacterName);

    if (firstScore !== secondScore) {
      return firstScore - secondScore;
    }

    return first.relativePath.localeCompare(second.relativePath);
  });
}

function getPriority(document: KnowledgeDocument, normalizedCharacterName: string) {
  const normalizedPath = normalize(document.relativePath);

  if (normalizedPath.includes("personagens/") && normalizedPath.includes(normalizedCharacterName)) {
    return 0;
  }

  if (normalizedPath.includes("instrucoes gerais") || normalizedPath.includes("padrao de identidade")) {
    return 1;
  }

  if (normalizedPath.includes("sistema de perguntas e respostas padrao")) {
    return 2;
  }

  if (normalizedPath.includes("regras teologicas") || normalizedPath.includes("fontes protestantes")) {
    return 3;
  }

  if (normalizedPath.includes("cronologia") || normalizedPath.includes("matriz") || normalizedPath.includes("mapa")) {
    return 4;
  }

  return 5;
}
