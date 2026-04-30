import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const standaloneDir = join(process.cwd(), ".next", "standalone");

if (!existsSync(standaloneDir)) {
  process.exit(0);
}

const staticSource = join(process.cwd(), ".next", "static");
const staticTarget = join(standaloneDir, ".next", "static");
const publicSource = join(process.cwd(), "public");
const publicTarget = join(standaloneDir, "public");

mkdirSync(join(standaloneDir, ".next"), { recursive: true });

if (existsSync(staticSource)) {
  cpSync(staticSource, staticTarget, { recursive: true });
}

if (existsSync(publicSource)) {
  cpSync(publicSource, publicTarget, { recursive: true });
}
