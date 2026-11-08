# Property alchemy — developer laboratory (PR #193)

| Field | Value |
|-------|-------|
| **Status** | `building` (reachable via Dev tools) |
| **Blocked on** | Author review after hands-on lab use |
| **Issue** | none yet |
| **Code** | [`sandbox/alchemy/`](../../sandbox/alchemy/) · sim [`prototype/property-alchemy/`](../../prototype/property-alchemy/) |
| **Updated** | 2026-11-08 |

## Readability (feedback layer)

Dev lab presentation helpers in `prototype/property-alchemy/lab-explain.js` (no chemistry changes):

- Ingredient inspect panel (defs + derived thermal activation/tolerance) with **knowledge-state scaffolding** (`unknown` / `reported` / `observed` / `established`) — lab always shows established.
- Plain-language refinement summary that separates **process completion** from **product usefulness**.
- Proportional spirit bar (released / bound / degraded) aligned with the material ledger.
- Comparison interpretation notes (magnitudes + multi-input caveats; no automatic “better” ranking).

## Open from the main game

Playtest → **Dev tools** → **🧪 Property alchemy lab** → `/sandbox/alchemy/`

Same pattern as the combat reaction sandbox: static files + committed bundle; no second server or manual ingredient gathering required. Use **← Main game** to return.

## Launch locally (optional dedicated server)

1. From repo root, rebuild the browser bundle after sim edits:

   ```bash
   node scripts/bundle-alchemy-lab.js
   ```

2. Serve static files (optional — any static host with repo root works):

   ```bash
   node scripts/serve-alchemy-lab.js
   ```

3. Open:

   **http://127.0.0.1:4173/sandbox/alchemy/**

Legacy path `prototype/property-alchemy/lab/` redirects to `/sandbox/alchemy/`.

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

**No changes** to playable alchemy files (`alchemy.js`, `alchemy-chamber.js`, saves, etc.). Dev tools only link the isolated lab.
