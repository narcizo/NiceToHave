<!--
Template for a new project's CLAUDE.md. See "Bootstrapping a new project" in the scaffolding repo's CLAUDE.md.
Fill every <placeholder>, keep only the lines for configs actually copied, and delete every comment block — including this one.
-->

# <Project name>

<One or two sentences: what this project is and who uses it.>

## Stack

- <e.g. React + Vite + TypeScript + styled-components + TanStack Query + Vitest>
- **Package manager:** npm.
- **Run locally:** `<command>`

## Tooling

<!-- Keep ONE lint line: the linter that was copied. -->
- **Lint:** oxlint (`.oxlintrc.json`) with `simple-import-sort` for imports and exports. `typescript/no-floating-promises` is an error: await or explicitly handle every promise. It only runs with `oxlint --type-aware` and the `oxlint-tsgolint` package installed.
- **Lint:** ESLint (`eslint.config.mjs`): `typescript-eslint` recommended, React Hooks rules, TanStack Query rules, `simple-import-sort`, and Prettier run as a lint rule.
- **`any` is a lint error.** Use a real type, `unknown` plus narrowing, or a generic. When `any` is truly unavoidable (untyped third-party code), disable the rule for that one line with a comment saying why.
- **Format:** Prettier (`.prettierrc`): double quotes, semicolons, no trailing commas, 80 columns. Don't hand-format; let Prettier decide.
<!-- Keep only if the bruno skill was copied. -->
- **API collection:** Bruno in `bruno/`, conventions in the `bruno` skill. Run with `bru run --env local` from `bruno/`, dev server up. Every endpoint added or changed gets a `.bru` request with tests.
- **Scripts** the skills rely on:
  - `lint` / `lint:fix`: `<oxlint --type-aware | eslint .>` / `<same> --fix`
  - `format`: `prettier --write .`
  - `typecheck`: `tsc --noEmit`
  - `test`: `vitest run`

## Git

- Hosted on GitHub. Changes go through a pull request, never straight to `main`.
- Branch: `<type>/<short-kebab-description>`, e.g. `feat/dark-mode-toggle`.
- Commit: `<type>: <emoji> <Subject>`, e.g. `feat: ✨ Add dark mode toggle`. Imperative subject, under ~50 characters, no trailing period. Types and emojis are listed in the `prep` skill.
- Commits and PRs are written in English.

## Workflow

<!-- Keep only if the skills in .claude/skills/ were copied. -->
Build iteratively, one small, tested task at a time:

1. `breakdown`: split a feature or project into tasks in `docs/plans/<feature>.md`.
2. `plan T1`: plan one task (interview, approach, edge cases) before writing code.
3. Implement, then report a confidence level.
4. `review`: acceptance criteria, fix list, verdict, confidence.
5. `prep`: lint, tests, commit message and PR description. The user stages, commits, and pushes.

`docs/plans/` is committed. It holds the task list and the *Decisions* log, which is the only record of why things were done.

## Project notes

<!-- Architecture, domain terms, gotchas. Grows with the project; start empty. -->
