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

export async function loadMasterPrompt() {
  const masterPromptPath = (await findMarkdownFiles(KNOWLEDGE_DIR)).find(isMasterPrompt);

  if (!masterPromptPath) {
    throw new Error("Master Prompt nao encontrado na pasta knowledge.");
  }

  return fs.readFile(masterPromptPath, "utf8");
}
