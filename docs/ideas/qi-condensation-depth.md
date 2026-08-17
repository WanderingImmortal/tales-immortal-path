# Qi Condensation depth

| Field | Value |
|-------|-------|
| **Status** | `building` |
| **Blocked on** | Band pacing playtest (inferior Late ~40–44); Dustbone surroundings later |
| **Issue** | none yet |
| **Chat / PR** | Playtest fixes `cursor/qc-playtest-fixes` (2026-07-27) |
| **Updated** | 2026-07-27 |

## Intent

Qi Condensation is **awaken to qi, then gather and store** through hard Early → Mid → Late bands (optional Peak). It is **not** mist→liquid condensation — that fantasy belongs at Foundation Establishment. QC should feel like becoming a cultivator in **Threshold City** (Dustbone), funded by jobs and selling, not explore stone lotteries.

Sister docs: [`mortal-life-sim-cluster.md`](mortal-life-sim-cluster.md), [`dustbone-dynasties-entropy-lore.md`](dustbone-dynasties-entropy-lore.md), [`city-tiers.md`](city-tiers.md), [`qi-foundation-establishment-redesign.md`](qi-foundation-establishment-redesign.md), [`realm-claims.md`](realm-claims.md), [`watershed-realms-lifespan-pacing.md`](watershed-realms-lifespan-pacing.md).

## Design notes

### Fantasy

| Beat | Feel |
|------|------|
| **Awaken** | Qi-feel claim — dantian notices qi; left the mortal world |
| **Early** | First draws; thin store |
| **Mid** | Reliable reserve |
| **Late** | Full basin — may attempt Foundation |
| **Peak** (optional) | More realm stats/power; slightly stronger trib when crossing |

Handoff: **QC** “I can sense and hold qi.” → **FE** “I condense and seal a foundation.”

### Bands & exit

- One fill axis: **Gather Qi only**. No Expand, no Refine at QC.
- **Capacity** rises on **automatic band mini-breakthroughs** (no trib, no button) — bigger skills / more uses.
- **No Seal** at QC. From **Late+** → player **Break Through** → `qc_to_fe` trib.
- Peak ≠ better break odds — more power + slightly harder trib. Keep gathering after Late to enter Peak.
- Meridians stay **FE wiring**. Nature stamp stays **FE seal**.
- 9 layers later optional (3× Early/Mid/Late); not required for v1.

### Qi-feel (Perception / Qi Sense)

Feelings, not labels. Mortal vs has-qi; *heavier than yours* / even / lighter; optional vague element. Compare **effective qi power** (realm + band/peak + foundation quality), not realm name alone. Not soul-track spiritual sense ([`spiritual-sense-cultivation-reading.md`](spiritual-sense-cultivation-reading.md)).

### Pacing (inferior root, start 16)

| Beat | Target age |
|------|------------|
| Late (BT unlocks) | ~40–44 |
| Peak QC | ~45–50 |
| Peak FE | 80–90 (watershed doc) |

Faster root grades → earlier Peak/BT ([`spiritual-roots-taxonomy-v2.md`](spiritual-roots-taxonomy-v2.md)).

### Progressive action UI

Hide locks **2+ realms ahead**. Soft-show **next horizon**. Never hide QC loop. Soft-show Break near Late. Unlock fanfare when something appears.

### Travel

No hard `minRealm` zone locks. Warn: above your station is a good way to die. Soft danger + first-entry confirm.

### Explore

**Scrap** pity-stone lottery. Explore = hunt **herbs/ores/reagents** for alchemy/forging/formations. Stones from **jobs + sell**.

### Starter life (QC v1 slice) — **Redwell**, not Threshold

**Retarget 2026-07-28:** hub life = **Redwell** (4th-tier). Threshold = capital visit. Full inventory: [`redwell-starter-city.md`](redwell-starter-city.md) · zone vision: [`dustbone-living-board.md`](dustbone-living-board.md).

| Piece | v1 |
|-------|-----|
| Market | Redwell basics bazaar (QC pamphlets from pool; monthly consumable restock) |
| Jobs | Well, grit/loader, escort, sweeper, letter copyist; fat jobs dry up; Su ≠ Redwell daily |
| Rent | **Redwell Inn** — room + rest / home screen |
| Buy | FE-only sand-brick courtyard + reagent chest (**no** cultivate speed — manuals + formations only) |
| Later | Mid city, Threshold weight, Miraj/tribe polish |

**Law of Dust** = formal basin law; Return-to-Dust = rites/speech.

### Playtest findings (2026-07-27)

1. **Dao / Forbidden still showing at QC** — distance hide was not enough; hard-hide in `applyQcProgressiveActionUi` (runs last after sync).
2. **Breakthrough at Late/Peak** — `resolveBreakthroughTransitionId` key mismatch broke `qc_to_fe`; popup Seal/Meridian copy; thin styles → QC postures Steady Settle / Force the Basin / Read the Audit.
3. **Combat Tech** — side drawer → panel under combat when in fight.
4. **Lodge after buy** — was economy flag only; minimal home screen + owned chest (not sect residence).

### Playtest findings (2026-08-17)

5. **Break Through stayed greyed at Late QC** — `applyQcProgressiveActionUi` locked the button at Mid but never cleared `disabled` when band advanced to Late/Peak (fixed in `cursor/playtest-breakthrough-escape-6077`). Mid still shows a locked Break preview until Late — intentional horizon UI.
6. **Break posture buttons felt like they only fail** — tribulation was deferred behind the first-tribulation tutorial modal; success path skipped `fullRender`; QC→FE trial math was harsh. Fixed: trib opens immediately, UI refreshes, first-watershed trib eased ([#111](https://github.com/WanderingImmortal/tales-immortal-path/pull/111)).
7. **Every breakthrough cost 2 years (Play or Pause)** — `advanceTime` only waived months when `isWorldClockLive()`; breakthrough popup hard-freezes the clock so Play still charged 24mo. Fixed: waive when Play is requested; QC seclusion 6mo when paused ([#111](https://github.com/WanderingImmortal/tales-immortal-path/pull/111)).

### Breakthrough feel (owner 2026-08-17)

Current loop = **break roll + trib phases + scars** reads roguelike. Parked direction (not shipped):

- **QC→FE** — breakthrough opens tribulation; **realm promotion** should feel earned by surviving audit (limbo / pseudo-realm), not a hidden second RNG gate after a hidden first roll.
- **FE+** — [`qi-foundation-establishment-redesign.md`](qi-foundation-establishment-redesign.md): seal foundation → **Initial Core Formation** → trib, not generic 24-month break + generic deck.
- **Per-gate scripts** — [`tribulation-per-gate-backlog.md`](tribulation-per-gate-backlog.md); avoid scar-risk click roulette as the main verb.
- **Interim** — tune first watershed trib so playtests can cross; redesign replaces double-RNG when owner locks FE journey.

### Break styles (QC→FE)

Keep ids `balanced` / `power` / `wisdom`. QC labels: Steady Settle · Force the Basin · Read the Audit. Tradeoffs: odds/trib severity/fail cracks/FE entry. Full style redesign for later gates parked.

## Prerequisites

- [x] Owner design lock (bands, no Seal, gather-only, qi-feel, explore, pacing, Threshold naming)
- [ ] Ship starter-life + band code
- [ ] Tune gather thresholds to pacing ages
- [ ] Cross-link watershed Peak QC row from TBD → 45–50

## Open questions

- Exact Gather thresholds per band (numbers)
- Peak as fourth stage vs perfected Late sub-state
- Body/spirit band skins
- Effective presence score formula for qi-feel v2

## Implementation crumbs

- `chamber.js` — Gather only at `realmIdx === 0`; hide Expand/Refine
- `consolidation.js` / `cultivation.js` — no QC Seal; Late+ breakthrough; band state on `G`
- `action-gates.js` — show policy hidden/locked/unlocked
- `world.js` — open travel + warnings; Threshold rename display
- `data.js` — marketKey dustbone, jobs table, dwelling
- Explore loot → material tables
