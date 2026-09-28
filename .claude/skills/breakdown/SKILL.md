---
name: breakdown
description: Break a feature or a whole project into small, ordered, independently testable tasks and save them to a plan file in the repo, so work can proceed one iteration at a time with the `plan` skill. Use when the user says "break this down", "split this feature", "let's plan the project", "quebra essa feature", "divide em tarefas", or describes something too big for one change. Also use to update an existing plan file (re-slice, add, reorder tasks).
---

# Break down a feature or project

Turn a big, vague goal into a list of tasks where each one ships something that works and can be tested on its own. The output is a plan file the user and future sessions work from: `plan T1`, build, tick, `plan T2`…

The input is usually a few sentences, not a spec. Most of the value is in pinning down what v1 actually is and cutting everything else to *Later*.

## 1. Plan mode first

Call `EnterPlanMode` (`ToolSearch` with `select:EnterPlanMode,ExitPlanMode` if the schemas aren't loaded). Skip if already in plan mode. Nothing is written until the breakdown is approved.

## 2. Existing plan file?

Look in `docs/plans/`. If a file already covers this feature, this is an **update**: read it, keep checked tasks and their IDs untouched, and re-slice, add, reorder or move tasks to *Later* as needed. New tasks get the next free ID — never renumber.

## 3. Research

- Existing repo → read its `CLAUDE.md`, structure, test setup, and the areas the feature will touch. Note existing patterns the tasks should follow.
- Empty repo → the stack comes from the user's global `CLAUDE.md` defaults. Don't pick a different one without asking.
- Note what the tasks depend on outside the repo (API keys, third-party accounts, deploy target).

## 4. Pin down v1

Before slicing, get answers to these — from the code where possible, otherwise from the user:

- **Goal** — one sentence: who uses it and what they can do when it's done.
- **Core flow** — the one path that must work end to end.
- **Must-have vs later** — propose the split yourself; the user corrects it.
- **Constraints** — stack, where it runs, data that must persist, anything already decided.
- **Unknowns** — things nobody can answer without trying (a library's limits, an API's behavior). These become spike tasks, not questions.

Ask with `AskUserQuestion`: recommended option first, at most four questions per round, at most two rounds. Prefer proposing a concrete v1 and letting the user cut or add, over open-ended questions.

Handed off from `plan`? The research and answers from that conversation already count — reuse them and only ask what is still missing for the whole feature (usually must-have vs later).

## 5. Slice

Rules for every task:

- **Vertical, not horizontal.** Each task delivers behavior someone can observe — through the UI, an endpoint, a CLI command, or a test. "Create the DB schema" or "build all components" alone is a layer, not a task; fold it into the first task that needs it.
- **Testable.** *Done when* lists checks that pass or fail: a named test, a command and its expected output, or a specific manual step. If you can't write this, the task is too vague — split or sharpen it.
- **Small.** One focused session and one reviewable change. Rough ceiling: ~6 approach steps or a few hundred lines. Bigger → split.
- **Ordered.** A task depends only on earlier tasks. Anything that can be built and tested alone is its own task.

Ordering:

1. **Walking skeleton** — the thinnest end-to-end path that runs: project boots, one real flow touches every layer, one test passes, lint/test scripts work. Always T1 on a new project; for a feature in an existing app, T1 is the thinnest version of the core flow.
2. **Spikes** for unknowns that would change the design — timeboxed, output is a decision recorded in *Decisions*, not production code.
3. **Core happy path**, one slice at a time.
4. **Errors, edge cases, empty and loading states.**
5. **Polish** — only what's must-have; the rest goes to *Later*.

Aim for 3–10 tasks. More than ~10 → the scope is bigger than one plan; split into milestones (one file each) or push more to *Later*.

## 6. The plan file

Path: `docs/plans/<feature-slug>.md`. Write it in the user's language. No hard-wrapped prose: one paragraph or list item per line.

```markdown
# <Feature name>

**Goal:** <one sentence>
**Out of scope:** <what v1 deliberately skips>
**Updated:** YYYY-MM-DD

## Tasks

- [ ] **T1 — <short imperative title>**
  - Delivers: <observable behavior>
  - Done when: <tests / commands / manual checks>
  - Depends on: —
  - Notes: <files or areas likely touched, patterns to follow>
- [ ] **T2 — …**
  - Depends on: T1

## Later

- <ideas cut from v1>

## Decisions

- YYYY-MM-DD: <decision> — <reason>
```

*Notes* are hints, not a plan — the detailed approach is written per task by `plan`, with fresh code research, when the task starts.

## 7. Confirm, then write

- Present the breakdown in chat: goal, the task list (title + *Delivers* + *Done when*), *Later*, and any decisions made while scoping.
- Blocking questions left → one `AskUserQuestion` round before exiting.
- `ExitPlanMode` for approval, then write the file and record the scoping decisions under *Decisions*.
- End by pointing at the next step: `plan T1`.

## Iterating

The file is a living document. After a few tasks, reality will disagree with it — that's expected. Re-run this skill to re-slice: keep done tasks and IDs, update *Updated*, log why the plan changed under *Decisions*.
