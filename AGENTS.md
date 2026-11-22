# Agent notes (Wandering Immortal)

Project rules live in [`.cursor/rules/`](.cursor/rules/) and **apply to local and cloud agents**.

| Rule | Purpose |
|------|---------|
| `agent-organization.mdc` | Chat titles `[L·WIP]` / `[C·PR#N]`, one branch per agent, status script |
| `github-branch-workflow.mdc` | `cursor/*` branches, push, **open PRs** (mandatory for cloud) |
| `pre-pr-safety-checks.mdc` | Run unified verification before PRs and fix in-scope failures |
| `work-tracking.mdc` | Park designs in `docs/ideas/`; queue builds as GitHub Issues; keep `docs/NOW.md` short |
| `client-migration-guardrails.mdc` | Warn before high migration-cost patterns; no extra doc reads unless combat/client task |

## Verification

Run `npm run verify` before opening or updating a code PR. It uses Node.js 24
and runs the same audits and regression suites as GitHub Actions. See the
[README](README.md#verification) for suite selection and exclusions.

Run `npm run test:browser` alongside Node verification for changes to production
script loading, UI controls, character creation, cultivation, or save/load flows.
The Node suite can pass even when the browser interface fails. See the
[README](README.md#browser-smoke-tests) for setup, coverage, and failure traces.

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
