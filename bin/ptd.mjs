#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const INPUT_DIR = process.argv[2] ?? "src";
const OUTPUT_FILE = process.argv[3] ?? "src.txt";

const CODE_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".py",
  ".java",
  ".cpp",
  ".c",
  ".h",
  ".cs",
  ".go",
  ".rs",
  ".rb",
  ".php",
  ".swift",
  ".kt",
  ".scala",
  ".html",
  ".css",
  ".scss",
  ".sass",
  ".less",
  ".json",
  ".xml",
  ".yaml",
  ".yml",
  ".md",
  ".sql",
  ".sh",
  ".bash",
  ".ps1",
  ".vue",
  ".svelte",
  ".astro",
  ".prisma",
]);

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "out",
  "coverage",
  "__pycache__",
  ".venv",
  "venv",
  "vendor",
  "_legacy",
]);

function isTextFile(filePath) {
  const fd = fs.openSync(filePath, "r");
  try {
    const buf = Buffer.alloc(1024);
    const bytes = fs.readSync(fd, buf, 0, 1024, 0);
    return !buf.subarray(0, bytes).includes(0);
  } finally {
    fs.closeSync(fd);
  }
}

function walk(dir, baseDir, out) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;
      walk(fullPath, baseDir, out);
      continue;
    }

    if (!entry.isFile()) continue;
    if (entry.name.startsWith(".")) continue;
    if (path.resolve(fullPath) === path.resolve(OUTPUT_FILE)) continue;

    const ext = path.extname(entry.name).toLowerCase();
    const isSpecial = entry.name === "Dockerfile" || entry.name === "Makefile";

    if (!CODE_EXTENSIONS.has(ext) && !isSpecial) continue;
    if (!isTextFile(fullPath)) continue;

    const content = fs.readFileSync(fullPath, "utf8");

    out.write(`\n${"=".repeat(80)}\n`);
    out.write(`FILE: /${relPath.replace(/\\/g, "/")}\n`);
    out.write(`${"=".repeat(80)}\n\n`);
    out.write(content);

    if (!content.endsWith("\n")) out.write("\n");
  }
}

if (!fs.existsSync(INPUT_DIR)) {
  console.error(`Input directory not found: ${INPUT_DIR}`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });

const out = fs.createWriteStream(OUTPUT_FILE, { encoding: "utf8" });

out.write(`Project Document: ${path.basename(process.cwd())}\n`);
out.write(`${"=".repeat(80)}\n\n`);

walk(INPUT_DIR, INPUT_DIR, out);

out.write(`\n${"=".repeat(80)}\n`);
out.write("END OF DOCUMENT\n");
out.write(`${"=".repeat(80)}\n`);

out.end(() => {
  console.log(`✅ Done: ${path.resolve(OUTPUT_FILE)}`);
  console.log(
    `📄 Size: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1)} KB`,
  );
});
