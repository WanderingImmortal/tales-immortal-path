# Property alchemy — developer laboratory (PR #193)

| Field | Value |
|-------|-------|
| **Status** | `building` |
| **Blocked on** | Author review after hands-on lab use |
| **Issue** | none yet |
| **Updated** | 2026-11-03 |

## Launch locally

1. From repo root, build the browser bundle (if missing):

   ```bash
   node scripts/bundle-alchemy-lab.js
   ```

2. Serve static files:

   ```bash
   node scripts/serve-alchemy-lab.js
   ```

3. Open in a browser:

   **http://127.0.0.1:4173/prototype/property-alchemy/lab/index.html**

Alternatively use any static server with repo root as document root (paths must resolve to `prototype/property-alchemy/dist/lab-bundle.js`).

## Using the lab

| Area | Action |
|------|--------|
| **Presets** | Load #192 scenarios (grit activation, dew degradation, conflict, sequential heat, useful failure) |
| **Ingredients** | Add/remove reagents, set qty, pick introduction order |
| **Heat** | Single heat per phase, or **sequential heat stages** (chips — order matters) |
| **Run / Repeat / Reset** | Deterministic sim; Repeat re-runs last inputs |
| **Results** | Process outcome, material pools, plain-language explanation from trace |
| **Ledger** | Spirit accounting table + conservation delta |
| **History** | Session-only list; click two runs or use dropdowns to compare |

## Multi-stage heating

When **Sequential heat stages** is selected, each introduction **phase** runs every stage in order on that phase’s reagents (see PR #192 `heatStages` in `simulate.js`).

Example preset: **grit yang-first: fierce then gentle** — activates mineral on first stage before delicate yin phase receives gentle passes.

## Tests

```bash
node scripts/test-alchemy-lab.js
node scripts/bundle-alchemy-lab.js   # implied by test
```

## Known limitations

- Session history is in-memory only (lost on refresh).
- Not connected to `G.alchemy`, inventory, or live chamber UI.
- Bundle must be rebuilt after prototype sim changes (`node scripts/bundle-alchemy-lab.js`).
- Degraded material does not “heal” on gentle stages without a defined transform rule (by design).

## Live game

**No changes** to playable alchemy files (`alchemy.js`, `alchemy-chamber.js`, saves, etc.).
