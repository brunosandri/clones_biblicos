import { promises as fs } from "fs";
import path from "path";
import type { Character } from "@/types";

export type KnowledgeMetadata = {
  doc_id?: string;
  doc_type?: string;
  scope?: string;
  character_id?: string;
  character_name?: string;
  priority?: number;
  include_in_rag?: boolean;
  ai_usage?: string;
};

export type KnowledgeDocument = {
  fileName: string;
  relativePath: string;
  content: string;
  metadata: KnowledgeMetadata;
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

  const documents = await Promise.all(
    markdownFiles.map(async (filePath) => {
      const content = await fs.readFile(filePath, "utf8");

      return {
        fileName: path.basename(filePath),
        relativePath: path.relative(KNOWLEDGE_DIR, filePath).replaceAll(path.sep, "/"),
        content: extractAiContent(content),
        metadata: parseFrontmatter(content)
      };
    })
  );

  return documents.filter((document) => document.metadata.include_in_rag !== false);
}

export function selectKnowledgeDocuments({
  documents,
  character,
  userMessage
}: {
  documents: KnowledgeDocument[];
  character: Character;
  userMessage: string;
}) {
  const selectedPaths = new Set<string>();
  const normalizedCharacterName = normalize(character.name);
  const normalizedMessage = normalize(userMessage);

  const include = (match: (document: KnowledgeDocument, normalizedPath: string) => boolean) => {
    documents.forEach((document) => {
      const normalizedPath = normalize(document.relativePath);

      if (match(document, normalizedPath)) {
        selectedPaths.add(document.relativePath);
      }
    });
  };

  const includeByType = (...docTypes: string[]) => {
    include((document) => docTypes.includes(document.metadata.doc_type ?? ""));
  };

  // Base minima para todas as respostas.
  includeByType("character_global_rules", "theology_rules", "source_policy", "progressive_revelation_rules");

  // Documentos especificos do mentor ativo.
  include(
    (document, pathName) =>
      document.metadata.character_id === character.id ||
      (pathName.includes("personagens/") && pathName.includes(normalizedCharacterName))
  );

  // Documentos de roteamento e seguranca quando a pergunta cruza periodos/personagens.
  if (mentionsAny(normalizedMessage, ["quem deve responder", "personagem", "mentor", "periodo", "periodo biblico"])) {
    include((_, pathName) => pathName.includes("motor de decisao do personagem"));
    include((_, pathName) => pathName.includes("classificador de perguntas"));
  }

  if (mentionsAny(normalizedMessage, ["cronologia", "ordem", "linha do tempo", "quando", "antes", "depois"])) {
    includeByType("chronology", "study_trail");
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
    includeByType("theme_matrix");
  }

  if (mentionsAny(normalizedMessage, ["revelacao", "progressiva", "cumpre", "cumprimento", "cristo", "jesus", "messias", "promessa"])) {
    includeByType("progressive_revelation_rules");
  }

  if (mentionsAny(normalizedMessage, ["pergunta", "faq", "resposta padrao", "como responder"])) {
    includeByType("question_bank");
  }

  const selectedDocuments = documents.filter((document) => selectedPaths.has(document.relativePath));
  return orderSelectedDocuments(selectedDocuments, character).slice(0, 9);
}

export async function loadMasterPrompt(character: Character) {
  const masterPromptPath = path.join(KNOWLEDGE_DIR, ...character.masterPromptPath.split("/"));

  try {
    return extractAiContent(await fs.readFile(masterPromptPath, "utf8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(`Master Prompt nao encontrado para o personagem: ${character.id}.`);
    }

    throw error;
  }
}

function extractAiContent(content: string) {
  const compactMatch = content.match(/## AI_COMPACT\s+([\s\S]*?)(?=\r?\n## FULL_CONTENT|\r?\n# |$)/);

  if (compactMatch?.[1]) {
    return compactMatch[1].trim();
  }

  return stripFrontmatter(content).trim();
}

function stripFrontmatter(content: string) {
  if (!content.startsWith("---")) {
    return content;
  }

  const endIndex = content.indexOf("\n---", 3);

  if (endIndex === -1) {
    return content;
  }

  return content.slice(endIndex + 4);
}

function parseFrontmatter(content: string): KnowledgeMetadata {
  if (!content.startsWith("---")) {
    return {};
  }

  const endIndex = content.indexOf("\n---", 3);

  if (endIndex === -1) {
    return {};
  }

  return content
    .slice(3, endIndex)
    .split(/\r?\n/)
    .reduce<KnowledgeMetadata>((metadata, line) => {
      const separatorIndex = line.indexOf(":");

      if (separatorIndex === -1) {
        return metadata;
      }

      const key = line.slice(0, separatorIndex).trim() as keyof KnowledgeMetadata;
      const value = line.slice(separatorIndex + 1).trim();

      if (key === "priority") {
        metadata.priority = Number(value);
      } else if (key === "include_in_rag") {
        metadata.include_in_rag = value.toLowerCase() === "true";
      } else {
        metadata[key] = value as never;
      }

      return metadata;
    }, {});
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

function orderSelectedDocuments(documents: KnowledgeDocument[], character: Character) {
  const normalizedCharacterName = normalize(character.name);

  return [...documents].sort((first, second) => {
    const firstScore = getPriority(first, character.id, normalizedCharacterName);
    const secondScore = getPriority(second, character.id, normalizedCharacterName);

    if (firstScore !== secondScore) {
      return firstScore - secondScore;
    }

    return first.relativePath.localeCompare(second.relativePath);
  });
}

function getPriority(document: KnowledgeDocument, characterId: string, normalizedCharacterName: string) {
  const normalizedPath = normalize(document.relativePath);

  if (
    document.metadata.character_id === characterId ||
    (normalizedPath.includes("personagens/") && normalizedPath.includes(normalizedCharacterName))
  ) {
    return 0;
  }

  return document.metadata.priority ?? 50;
}
