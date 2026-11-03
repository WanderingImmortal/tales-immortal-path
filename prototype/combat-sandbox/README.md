# Combat reaction sandbox (experimental)

Isolated prototype for **continuous-position, reaction-based** tactical combat. Not connected to production `combat.js`, saves, or cultivation stats.

| Module | Role |
|--------|------|
| `simulation.js` | Deterministic fixed-timestep sim (attacks, reactions, commitment) |
| `constants.js` | Attack/reaction templates and sandbox parameters |
| `geometry.js` | Reach/arc checks (no tile grid) |
| `ai.js` | Simple opponent (same rules as player) |
| `presets.js` | Matchup presets |
| `lab/` | Browser arena UI (render + controls only) |

**Run tests:** `node scripts/test-combat-sandbox.js`

**Dev laboratory (browser):**

```bash
node scripts/serve-combat-sandbox-lab.js
```

Open: http://127.0.0.1:4174/prototype/combat-sandbox/lab/index.html

(Rebuild bundle after sim changes: `node scripts/bundle-combat-sandbox-lab.js`)

**Design notes:** [`docs/ideas/combat-reaction-sandbox-prototype.md`](../../docs/ideas/combat-reaction-sandbox-prototype.md)
