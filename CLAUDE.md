# nice-to-haves

Personal scaffolding repo: a grab bag of configs and Claude Code skills for starting new projects. It is **not** a project itself — nothing here is built or run. When starting a project, an agent reads this repo and copies only the pieces the new project needs.

## What's here

| Path | What it is | Copy when |
| --- | --- | --- |
| `.claude/skills/breakdown/` | Split a feature/project into small, testable tasks in `docs/plans/` | Always |
| `.claude/skills/plan/` | Plan one task before coding: interview, approach, assumptions, edge cases | Always |
| `.claude/skills/review/` | Code review with acceptance criteria, fix list, verdict, confidence | Always |
| `.claude/skills/prep/` | Lint, tests, conventional commit message, short PR description | Always |
| `.claude/skills/caveman/` | Terse reply mode (EN + PT-BR) | If the user wants it |
| `.vscode/settings.json` | Format on save with Prettier, oxc fix-all on save | Always; drop the oxc line for ESLint projects |
| `.prettierrc` | Double quotes, semicolons, no trailing commas, 80 columns | Always |
| `.oxlintrc.json` | oxlint: import sort, `no-explicit-any`, `no-floating-promises` (type-aware) | Node/backend (e.g. NestJS) |
| `eslint.config.mjs` | ESLint: typescript-eslint, React Hooks, TanStack Query, Prettier, import sort | React/Vite |
| `templates/CLAUDE.template.md` | Template for the new project's `CLAUDE.md` | Always — filled in, never copied as-is |

Pick **one** linter per project, never both.

## Bootstrapping a new project

1. Ask what the project is and its stack, unless the user already said.
2. Copy the pieces from the table that fit. Don't copy this file.
3. Adjust copied configs to the stack. For example, drop the TanStack Query plugin from the ESLint config if the project doesn't use it, and set `globals` to node for a backend.
4. Write the new project's `CLAUDE.md` from `templates/CLAUDE.template.md`:
   - Fill every placeholder.
   - Keep only the lines for what was actually copied.
   - Delete all template comments.
   - The result must describe **the new project only**. No mention of this repo, of the template, or of options that weren't chosen.
5. List the devDependencies and `package.json` scripts the copied configs need, and ask before installing them.

## Maintaining this repo

- Adding, removing, or changing a config or skill → update the table above **and** the template, so the two stay in sync.
- Rules that apply to every project (git conventions, workflow) live in the template. Facts about this repo live here.
- No `package.json` on purpose: configs here are never installed or run in place.
