# Project conventions

Personal project scaffolding: a grab bag of configs and skills. When starting a project, copy only what it needs — this file, `.claude/`, `.vscode/`, `.prettierrc`, and **one** linter config (see *Tooling*) — then fill in the *Project* section and delete the lines that don't apply.

## Project

- **What it is:** <one sentence>
- **Stack:** <e.g. Next.js + TypeScript + styled-components + Vitest>
- **Run locally:** <command>

## Tooling

- **Lint:** pick one per project. Both enforce `simple-import-sort` for imports and exports.
  - **oxlint** (`.oxlintrc.json`) for Node/backend (e.g. NestJS). `typescript/no-floating-promises` is an error: await or explicitly handle every promise.
  - **ESLint** (`eslint.config.mjs`) for React/Vite. `typescript-eslint` recommended, React Hooks rules, TanStack Query rules, and Prettier run as a lint rule.
  - `any` is a lint error in both. Use a real type, `unknown` plus narrowing, or a generic. When `any` is truly unavoidable (untyped third-party code), disable the rule for that one line with a comment saying why.
- **Format:** Prettier (`.prettierrc`): double quotes, semicolons, no trailing commas, 80 columns. Don't hand-format; let Prettier decide.
- **Package manager:** npm.
- **Scripts** the skills rely on. Keep these names in `package.json`:
  - `lint`: `oxlint` or `eslint .`
  - `lint:fix`: `oxlint --fix` or `eslint . --fix`
  - `format`: `prettier --write .`
  - `typecheck`: `tsc --noEmit`
  - `test`: `vitest run`

## Git

- Hosted on GitHub. Changes go through a pull request, never straight to `main`.
- Branch: `<type>/<short-kebab-description>`, e.g. `feat/dark-mode-toggle`.
- Commit: `<type>: <emoji> <Subject>`, e.g. `feat: ✨ Add dark mode toggle`. Imperative subject, under ~50 characters, no trailing period.
- Types and emojis are listed in the `prep` skill: `feat`, `fix`, `refactor`, `perf`, `test`, `style`, `docs`, `build`, `ci`, `chore`, `revert`.
- Commits and PRs are written in English.

## Workflow

Build iteratively, one small, tested task at a time:

1. `breakdown`: split a feature or project into tasks in `docs/plans/<feature>.md`.
2. `plan T1`: plan one task (interview, approach, edge cases) before writing code.
3. Implement, then report a confidence level.
4. `review`: acceptance criteria, fix list, verdict, confidence.
5. `prep`: lint, tests, commit message and PR description. The user stages, commits, and pushes.

`docs/plans/` is committed. It holds the task list and the *Decisions* log, which is the only record of why things were done.
