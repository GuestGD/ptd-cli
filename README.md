# ptd-cli

Convert a project folder into a single text document — one `.txt` with the entire source tree inlined, ready to paste into an AI assistant's context window.

Walks a directory tree, filters by file extension, skips binary files and common build folders (`node_modules`, `dist`, `.git`, `_legacy`, etc.), and writes each file into one output with a `FILE: /path` header.

## Install

```bash
npm i -D github:GuestGD/ptd-cli
```

Pin a specific version:

```bash
npm i -D github:GuestGD/ptd-cli#v1.0.0
```

## Usage

Add a script to `package.json`:

```json
{
  "scripts": {
    "ptd": "ptd src src.txt"
  }
}
```

Run:

```bash
npm run ptd
```

Or without a script:

```bash
npx ptd src src.txt
```

Both arguments are optional. Defaults: `src` for input folder, `src.txt` for output file. From a project root:

```bash
npx ptd
```

## Arguments

| Position | Name          | Default   | Description                          |
| -------- | ------------- | --------- | ------------------------------------ |
| 1        | `INPUT_DIR`   | `src`     | Folder to walk, relative to the CWD. |
| 2        | `OUTPUT_FILE` | `src.txt` | Where to write the document.         |

## Output format

```
Project Document: my-project
================================================================================

================================================================================
FILE: /main.tsx
================================================================================

<contents of src/main.tsx>

================================================================================
FILE: /game/CompositionRoot.ts
================================================================================

<contents of src/game/CompositionRoot.ts>
...

================================================================================
END OF DOCUMENT
================================================================================
```

Paths are relative to `INPUT_DIR` — `src/main.tsx` becomes `FILE: /main.tsx`. The output file is never included in its own scan.

## Included extensions

```
.ts .tsx .js .jsx .py .java .cpp .c .h .cs .go .rs .rb .php .swift .kt
.scala .html .css .scss .sass .less .json .xml .yaml .yml .md .sql .sh
.bash .ps1 .vue .svelte .astro .prisma
```

Plus `Dockerfile` and `Makefile`.

## Skipped

Directories:

```
node_modules  .git  dist  build  .next  out  coverage
__pycache__  .venv  venv  vendor  _legacy
```

Also skipped: dotfiles, binary files (first 1 KB contains `\0`), and the output file itself.

## License

MIT
