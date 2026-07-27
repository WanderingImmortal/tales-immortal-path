# Agent notes (Wandering Immortal)

Project rules live in [`.cursor/rules/`](.cursor/rules/) and **apply to local and cloud agents**.

| Rule | Purpose |
|------|---------|
| `agent-organization.mdc` | Chat titles `[L·WIP]` / `[C·PR#N]`, one branch per agent, status script |
| `github-branch-workflow.mdc` | `cursor/*` branches, push, **open PRs** (mandatory for cloud) |
| `pre-pr-safety-checks.mdc` | Run recursion audits before PRs; fix in-scope loops |
| `work-tracking.mdc` | Park designs in `docs/ideas/`; queue builds as GitHub Issues; keep `docs/NOW.md` short |
| `progressive-action-hide.mdc` | Late-realm buttons: **hide-by-default** (Dao/Forbidden lesson, PR #83) |

## Work tracking

| Layer | Location |
|-------|----------|
| Current focus | [`docs/NOW.md`](docs/NOW.md) |
| Parked designs | [`docs/ideas/`](docs/ideas/) — **mortal life sim cluster:** [`mortal-life-sim-cluster.md`](docs/ideas/mortal-life-sim-cluster.md) |
| Build queue | GitHub Issues |
| Shipped | Merged PRs |

Quick status:

```powershell
.\scripts\agent-status.ps1
```

Chat title format: `[<L|C>·<WIP|PR#N|MERGED>] <topic> — <branch-or-PR>`
