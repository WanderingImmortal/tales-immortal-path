# Property alchemy — developer laboratory (PR #193)

| Field | Value |
|-------|-------|
| **Status** | `building` (reachable via Dev tools) |
| **Blocked on** | Author review after hands-on lab use |
| **Issue** | none yet |
| **Code** | [`sandbox/alchemy/`](../../sandbox/alchemy/) · sim [`prototype/property-alchemy/`](../../prototype/property-alchemy/) |
| **Updated** | 2026-11-10 |

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
| **Furnace** | Start / pause / resume; set gentle · medium · fierce any time |
| **Ingredients** | Add to the furnace while refining (no fixed introduction order) |
| **Time** | Sim clock advances in fixed steps; playback speed only batches ticks |
| **Condense** | Player ends heating; product from accumulated furnace state (`furnace.js`) |
| **Results** | Process outcome, material pools, plain-language explanation |
| **Ledger** | Spirit accounting + technical inspection panel |
| **History** | Session chronicle per run; compare two condensed experiments |

## Time-based model (assumptions)

- Timestep `SIM_DT` (0.1 sim units); heat duration affects extraction/degradation rates derived from `thermalFractions()`.
- Released essence continues to respond to fierce heat (degradation).
- `simulateRefinement()` remains for regression tests, not the player-facing lab.

Example play: preheat **fierce**, add **Ironscar Grit**, wait for extraction, reduce to **gentle**, add **Dawn Dew**, condense when stable.

Thermal windows (2026 follow-up): **Foundation Root** needs gentle; **Amber Lily** rewards a short medium burst then gentle (avoid staying on medium); **Cinderscale** needs sustained medium. Overheat exposure accrues with duration — see `scripts/test-thermal-exposure.js`.

**Contamination & purity (PR #223):** Extracted essence lands in `released.spirit`; mixture **contamination** is `released.impurity` (soot from rough extraction, not degraded spirit). The prototype furnace passively expels contamination into `expelled` at a cauldron-limited rate (`separation.js`; harder on mineral-heavy loads). Pill **purity** is essence ÷ (essence + contamination) at condense — distinct from potency, grade, and process outcome. Validation: `node scripts/test-purity-separation.js`.

**Medicinal properties (PR #225):** Five property masses (`medicinal` on material slices) extract with spirit, degrade with overburn, and combine additively at condense into `product.medicinal` + `experimentalName`. Distinct from spirit and legacy affinities. Validation: `node scripts/test-medicinal-properties.js`.

**Stability diagnostics (PR #224):** Running instability only accrues strain while chemistry is active (extraction, degradation, separation); dormant mixtures relax toward neutral without erasing **peak** instability from earlier spikes. Ironscar Grit’s ~53% ceiling on the basic cauldron is mostly the separation **stuck floor** (`separationStuckMin` + proportional retain), not condensation scrub. Validation: `node scripts/test-furnace-stability.js`.

**Medicinal properties (PR #225):** Five property masses on material slices (`qiNourishment`, `woundStabilisation`, `tissueRestoration`, `boneRestoration`, `bloodRestoration`) travel with extraction/degradation like spirit; condense maps released ledger → `product.medicinal` and a profile-derived `experimentalName`. Distinct from spirit mass and legacy affinity scaling. Validation: `node scripts/test-medicinal-properties.js`.

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
