# Agent notes (Wandering Immortal)

Project rules live in [`.cursor/rules/`](.cursor/rules/) and **apply to local and cloud agents**.

| Rule | Purpose |
|------|---------|
| `agent-organization.mdc` | Chat titles `[L·WIP]` / `[C·PR#N]`, one branch per agent, status script |
| `github-branch-workflow.mdc` | `cursor/*` branches, push, **open PRs** (mandatory for cloud) |
| `pre-pr-safety-checks.mdc` | Run recursion audits before PRs; fix in-scope loops |

Quick status:

```powershell
.\scripts\agent-status.ps1
```

Chat title format: `[<L|C>·<WIP|PR#N|MERGED>] <topic> — <branch-or-PR>`
