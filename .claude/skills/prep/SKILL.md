---
name: prep
description: Prepare a change for commit and PR in a personal project — sync with the base branch, run lint and tests, check the branch name, and draft a conventional commit message plus a short PR description. Use when the user is about to commit or open a GitHub pull request ("prep", "prep the PR", "ready to commit", "write the commit message", "is this ready to push", "prepara o PR", "bora commitar"). Stops before staging, committing, or pushing — the user does those.
---

# Prep for commit and PR

Get a change ready so the user can stage, commit, and push without surprises.

**Hard boundary: never stage, commit, or push.** The user does those. Your job is everything *before* that, plus the text they'll paste in.

## Commit types

Same list for commit messages and branch prefixes. Pick from what the diff does, not from the branch name.

| Type | Emoji | Use for |
| --- | --- | --- |
| `feat` | ✨ | New user-visible behavior |
| `fix` | 🐛 | Bug fix |
| `refactor` | 💡 | Code change with no behavior change |
| `perf` | ⚡ | Performance improvement |
| `test` | 🚨 | Adding or fixing tests only |
| `style` | 💄 | Formatting, whitespace, CSS-only visual tweaks with no logic change |
| `docs` | 📚 | Documentation only |
| `build` | 📦 | Dependencies, bundler, package scripts |
| `ci` | 🎡 | CI configuration |
| `chore` | 🛠️ | Maintenance that fits nothing above |
| `revert` | ⏪ | Reverting an earlier commit |

## 1. Identify the change

- Base branch: `main` or `master`, whichever the remote uses (`git symbolic-ref refs/remotes/origin/HEAD`; no remote → whichever exists locally).
- Read the actual diff — staged, unstaged, and untracked — so the message describes what changed. On a branch, `git diff origin/<base>...HEAD` (**three dots** — merge-base diff; two dots shows the base's newer work as spurious deletions), plus `git status --short` and `git diff HEAD` for uncommitted work.
- Task context: if a breakdown file in `docs/plans/` has a task matching this work, read its *Delivers* and *Done when*. That's the "why" for the PR.

## 2. Check the branch

- Name must be `<type>/<short-kebab-description>` (`feat/dark-mode-toggle`). Wrong type for the work, or no prefix → say so and give the corrected name.
- **On the base branch with uncommitted work** → the change needs a branch. Put `git switch -c <type>/<desc>` first in the hand-off. Don't create it yourself.
- **Behind the remote base** (`git fetch origin`, then `git rev-list --left-right --count origin/<base>...HEAD`; left = behind) → rebase: `git rebase origin/<base>`. Only ever on the user's own feature branch — never rebase the base branch itself.
  - Dirty tree → `git stash push -m "prep pre-rebase"` first, `git stash pop --index` after. Untracked files alone don't block a rebase.
  - Conflict you can resolve with confidence → resolve, `git add`, `git rebase --continue`. Ambiguous → stop, leave the rebase in progress, and ask.
  - Report what landed from the base and whether anything conflicted.
- No remote → skip the sync.

## 3. Lint and tests

Run from `package.json` scripts (or what the repo's `CLAUDE.md` names):

1. **Lint with autofix** if a fix script exists (`lint:fix`, `lint -- --fix`), otherwise plain lint. Then `git status --short`: report any file the autofix changed **outside this change**, so the user can decide. Never stage them.
2. **Typecheck** if there's a script for it.
3. **Tests.** Run the full suite. If it's slow and the project uses Vitest, run only what the branch touched: `npx vitest run --changed $(git merge-base origin/<base> HEAD)`.

Report failures with the actual output. **Do not draft a commit message for a red branch** — surface or fix the failures first. Missing script → say it's missing; don't report a pass you didn't see.

## 4. Draft the commit message

Format: `<type>: <emoji> <Subject>` — e.g. `feat: ✨ Add dark mode toggle`.

- **Subject**: imperative, capitalized, no trailing period, under ~50 characters. Describe the effect, not the files touched.
- **Body**: usually none. One or two lines only when the *why* isn't obvious from the subject.
- **One commit, one type.** If the diff mixes types (a feature plus an unrelated fix), say so and propose splitting it into separate commits, with which files go in each.
- If the repo has its own convention — commitizen/git-cz config (`.czrc`, `changelog.config.js`), commitlint, or a clear pattern in `git log` — follow that instead. With git-cz, give one answer per prompt and leave the emoji out (git-cz adds it).
- Language: follow the repo's history. No history → English.

## 5. Draft the PR description

**The description must be shorter than the diff.** A reviewer reads it in under a minute. Tiny change → a few lines. Omit anything with nothing to say.

```markdown
## Why

<What problem this solves, in one or two sentences. Link the plan task if there is one.>

## What changed

- <The smallest useful description of the change, in user-visible terms.>
- <Anything intentionally left unchanged, if a reviewer would wonder.>

**Key files**

- `path/to/file.ts` — <what changed there, one line>

## Validation and proof

- [x] Focused tests pass — <which ones>
- [x] Existing behavior still covered
- [ ] UI proof attached
- [ ] Reviewed with `/review`
```

- **Key files**: the 3–6 files a reviewer should open first — where the logic lives, not lockfiles, snapshots, or generated code. Fewer if the change is small.
- **Checkboxes are claims.** Tick only what actually happened in this session. Tests → only if step 3 passed. UI proof → drop the line for non-UI changes; for UI changes leave it unticked and remind the user to attach a screenshot. Review → tick only if `/review` returned *Approve* on this diff; otherwise leave unticked and offer to run it.
- Title: same as the commit subject line, or the dominant one if there are several commits.
- Same language rule as the commit.

## 6. Hand off

End with the exact commands the user runs next, **in order**, filled in with real paths and names:

```bash
git switch -c <type>/<desc>         # only if still on the base branch
git add <files or .>
git commit -m "<type>: <emoji> <Subject>"
git push -u origin HEAD             # after a rebase of an already-pushed branch: git push --force-with-lease origin HEAD
```

- List specific paths in `git add` when anything in the tree must **not** be staged; use `.` only when the whole tree belongs in the commit.
- `-u origin HEAD` pushes to a same-named remote branch and sets the upstream in one go.
- Already-pushed branch that was rebased → `--force-with-lease`, never bare `--force`.
- Call out anything left in the tree that shouldn't be committed: scratch files, unrelated autofixes, `.env` files.
