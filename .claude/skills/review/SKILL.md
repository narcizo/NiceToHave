---
name: review
description: Review the current changes for correctness, conventions, and task scope in a personal project. Use when the user asks for a code review, PR feedback, "is this ready", "revisa isso", or "tá pronto?". Defaults to medium effort, checks acceptance criteria from the breakdown/plan when there is one, and ends with an explicit approve/don't-approve verdict and an exact fix list.
---

# Code review

Review at **medium effort by default**; use a different level only if the user names one.

| Level | What it covers |
| --- | --- |
| **low** | Changed lines only. Correctness bugs and obvious convention breaks. No test run. |
| **medium** | Changed lines plus the code they call and are called by. Correctness, conventions, missing tests. Run the project's checks. |
| **high** | Medium, plus the surrounding modules, simplification and efficiency, and edge cases the change doesn't handle. |
| **xhigh** | High, plus re-verify every finding against the code before reporting it, and trace each changed value to its real source. |

## 1. Task context

There is no ticket. Look for acceptance criteria in this order and use the first that exists:

1. **Breakdown file** — `docs/plans/*.md`. The task under review is the one the user names, or the one matching the branch name or recent commits, or else the first unchecked task whose dependencies are checked. Its *Done when* are the acceptance criteria; its *Decisions* section is context.
2. **Plan in this conversation** — the acceptance criteria from an approved `plan`.
3. **The user's message** — whatever they said the change should do.
4. **Nothing** — infer the intent from commit messages and the diff, state it in one line, and skip the acceptance criteria table. Don't invent criteria.

## 2. Scope: what to review

- Base branch: `main` or `master`, whichever exists (check `git symbolic-ref refs/remotes/origin/HEAD` first).
- On a feature branch → `git diff <base>...HEAD` (three dots — merge-base diff; two dots shows the base's newer work as spurious deletions), plus staged/unstaged/untracked work (`git status --short`, `git diff HEAD`).
- On the base branch itself (common in personal projects) → review uncommitted work only. If there is none, ask which commits to review instead of guessing.
- Not a git repo → ask which files to review.

## 3. Run the checks (medium and above)

Run the project's own scripts if they exist — typecheck, lint, tests (see `package.json` scripts or the repo's `CLAUDE.md`). A failing check is a finding. If a script is missing or too slow to run, say so; don't report a pass you didn't see.

## 4. Acceptance criteria check (before findings)

Give each criterion a verdict — **Met / Not met / Unclear** — tied to the diff or to a check you ran. A scope miss is a finding, not a footnote. Work that goes beyond the task is worth one line too: it belongs in its own task.

## 5. Findings

Hunt for correctness bugs first, then convention violations (the repo's `CLAUDE.md`, its lint config, and the patterns already in the codebase), then simplification/efficiency at high and above. Report via the ReportFindings tool when available, most severe first.

Common traps to check:

- **Tests** — new behavior without a test, tests that can't fail, leftover `.only` / `.skip`.
- **Types** — new `any`, `as` casts, and non-null `!` that hide a real case instead of handling it.
- **Errors and states** — unhandled promise rejections, missing loading / error / empty states, errors swallowed by an empty `catch`.
- **React** — missing or wrong hook dependencies, unstable `key`s, state that should be derived, effects that should be event handlers.
- **Leftovers** — `console.log`, commented-out code, TODOs without context, debug flags.
- **Secrets** — keys, tokens, or `.env` files in the diff. Always blocking.
- **Data** — schema or migration changes that aren't reversible or break existing data.

Every finding must point to a line in the diff and name a concrete failure (input or state → wrong result). No failure scenario → not a finding.

## 6. Output (in this order)

1. **Acceptance criteria table** with per-criterion verdicts (skipped if step 1 found none).
2. **Findings**, most severe first.
3. **Fix list** — a numbered list of *exactly* what needs fixing to reach approval: `file:line — what to change`. Concrete edits only; no "consider"s. If nothing needs fixing, say so.
4. **Verdict** — one line: **Approve** or **Don't approve**, and why.
5. **Confidence** — **High / Medium / Low** that the change works as intended, with a one-line reason naming what was and wasn't verified.

Approve only when the fix list is empty: every criterion met, checks passing, no blocking finding. Non-blocking suggestions can appear under findings but never in the fix list and never block the verdict.

Confidence is about evidence, not about how the code looks:

- **High** — every acceptance criterion is backed by a test or check that ran and passed in this review, and no changed path is left unexercised.
- **Medium** — checks pass, but some behavior is verified only by reading code (a UI flow not clicked through, an error path with no test, a criterion marked *Unclear*).
- **Low** — checks didn't run or failed, key behavior is untested, or the review depended on assumptions it couldn't verify.

Verdict and confidence are independent: an *Approve* with *Medium* confidence is normal, and the reason line tells the user what to check by hand before merging.
