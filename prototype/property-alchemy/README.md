# Property-based alchemy (isolated prototype)

Experimental emergent alchemy model — **not wired into the live game**.

| Module | Role |
|--------|------|
| `reagents.js` | 10 test reagents and intrinsic properties |
| `simulate.js` | Deterministic refinement / reaction rules |
| `journal.js` | Experiment log, discoveries, saved formulas |
| `harness.js` | Demonstration scenarios (emergent behaviour) |
| `index.js` | Single export surface |

**Run tests:** `node scripts/test-property-alchemy.js` · `node scripts/test-property-alchemy-thermal.js` · `node scripts/test-property-alchemy-audit.js`

**Stress audit:** `node scripts/stress-test-property-alchemy.js` · trace: `node scripts/explain-property-alchemy-refinement.js '<json>'`

**Compare models:** `node scripts/compare-thermal-model.js`

**Dev laboratory (browser):** `node scripts/serve-alchemy-lab.js` → http://127.0.0.1:4173/prototype/property-alchemy/lab/index.html · [`docs/ideas/property-alchemy-dev-laboratory.md`](../../docs/ideas/property-alchemy-dev-laboratory.md)

**Design doc:** [`docs/ideas/property-based-alchemy-prototype.md`](../../docs/ideas/property-based-alchemy-prototype.md) · [`docs/ideas/property-based-alchemy-stress-audit.md`](../../docs/ideas/property-based-alchemy-stress-audit.md) · [`docs/ideas/property-based-alchemy-thermal-activation.md`](../../docs/ideas/property-based-alchemy-thermal-activation.md)
