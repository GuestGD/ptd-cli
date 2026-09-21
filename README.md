# ptd-cli

Convert a project folder into a single text document — one `.txt` with the
entire source tree inlined, ready to paste into an AI assistant's context
window.

Walks the directory tree, filters by file extension, skips binary files and
common build/dependency folders (`node_modules`, `dist`, `.git`, etc.), and
writes each surviving file into a single output with a `FILE: /path` header.

## Install

### From GitHub (recommended if npm registry publish is blocked)

```bash
npm i -D github:GuestGD/ptd-cli
```

Pin to a specific tag or commit:

```bash
npm i -D github:GuestGD/ptd-cli#v1.0.0
```

npm clones the repo, reads `package.json` → `bin`, and drops the `ptd`
executable into `node_modules/.bin/`. No registry account, no 2FA, no
publishing step.

### From the npm registry

```bash
npm i -D ptd-cli
```

Or run it once without adding it to your project:

```bash
npx ptd-cli src src.txt
```

### From a local tarball

For offline use or while iterating on ptd itself:

```bash
npm i -D /path/to/ptd-cli-1.0.0.tgz
```

## Usage

If you installed as a dependency, add a script to your `package.json`:

```json
{
  "scripts": {
    "ptd": "ptd src src.txt"
  }
}
```

Then run:

```bash
npm run ptd
```

Without a script, invoke the binary directly:

```bash
npx ptd src src.txt
```

Both arguments are optional. Defaults are `src` for the input folder and
`src.txt` for the output file, so from a project root this just works:

```bash
npx ptd
```

## Arguments

| Position | Name          | Default   | Description                                                            |
| -------- | ------------- | --------- | ---------------------------------------------------------------------- |
| 1        | `INPUT_DIR`   | `src`     | Folder to walk. Relative to the current working directory.             |
| 2        | `OUTPUT_FILE` | `src.txt` | Where to write the document. Parent folders are created automatically. |

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

Paths are relative to `INPUT_DIR`, so `src/main.tsx` becomes `FILE: /main.tsx`.
The output file itself is never included in its own scan.

## What gets included

Files whose extension is in:

```
.ts .tsx .js .jsx .py .java .cpp .c .h .cs .go .rs .rb .php .swift .kt
.scala .html .css .scss .sass .less .json .xml .yaml .yml .md .sql .sh
.bash .ps1 .vue .svelte .astro .prisma
```

Plus `Dockerfile` and `Makefile` (no extension).

## What gets skipped

Directories:

```
node_modules  .git  dist  build  .next  out  coverage
__pycache__  .venv  venv  vendor  _legacy
```

Also skipped:

- anything starting with `.` (dotfiles, hidden folders)
- files whose first 1 KB contains a `\0` byte (crude binary detection)
- the output file itself

## Why GitHub install

npm has been tightening its 2FA policy: as of 2026, publishing with a
standard OTP flow is increasingly restricted, and tokens that bypass 2FA are
being phased out. Installing a CLI directly from GitHub sidesteps the
registry entirely — npm just clones the repo and wires up `bin`. Works the
same as a registry install from the consumer's side.

## License

MIT
