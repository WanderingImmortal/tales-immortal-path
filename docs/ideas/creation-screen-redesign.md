# Creation screen redesign

| Field | Value |
|-------|-------|
| **Status** | `idea` — **stubbed**; do not implement until prerequisites land |
| **Blocked on** | See **Prerequisites** — roots v2, breathing techniques, economy/debt hooks, event systems |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent planning chat, 2026-07-18 |
| **Updated** | 2026-07-18 |

## Intent

Creation is the start of a **life** — choices should echo for decades. Origins and drawbacks today are too small; CP has little to spend on after roots.

**Parked for now:** ideas below depend on other systems (roots taxonomy, breathing manuals, debts, duty cycles, bounty events, etc.). Keep as design reference; implement after those hooks exist.

Tie creation to roots, breathing techniques, starting position, and reincarnation unlocks when ready.

## Current state (audit)

### Origins — mostly cosmetic

| Origin | Effect | Problem |
|--------|--------|---------|
| Village Orphan | None | Fine default |
| Merchant Heir | +40 stones, −5% cultivate | Stones irrelevant late; −5% barely felt |
| Sect Reject | 1 random common tech, −10 fame | One technique; fame minor |
| Fallen Noble | +15 fame, −20 stones | Same |

No starting **location**, **NPC**, **debt**, **sect relation**, **manual tier**, or **story flags**.

### Drawbacks — wired but weak

| Drawback | CP refund | Effect | Wired? |
|----------|-----------|--------|--------|
| Sworn Enemy | 2 | +5% damage taken | Yes (`combat.js`) |
| Frail Body | 1 | −10% max HP | Yes (`gear.js`) |
| Hunted | 2 | −15 starting fame | Start only |
| Poor Memory | 1 | −10% dao speed | Yes (`main.js`) |

+2 CP for 5% damage over hundreds of fights is poor trade in a **lifespan** game. No drawback touches cultivation speed, lifespan, tribulation, or story pressure.

### Traits — best of the bunch

8 traits at 2 CP; many bonuses wired (breakthrough, dao, explore, tribulation). Forgotten Heir opens quest chain. Still only 1–2 slots.

### CP budget today

10 base + legacy − root (0–7) − traits − origins + drawback refunds = **often 5–7 CP idle**.

---

## New CP sinks (aligned with roots)

| Sink | CP | Notes |
|------|-----|-------|
| **Composition** | pentamixed free → single costly | Sets Innate Height |
| **Grade** | inferior refund → heavenly 7+ | Speed only, not height |
| **Element choice** | +1–2 | Roll free vs pick fire |
| **Breathing technique tier** | 1–4 | Poor / sect / elder / fragment — gates gather & foundation variant |
| **Starting manual** | 1–3 | **Grade** (crude → superior) on qi-gathering method; essence fragments rare |
| **Origin** | 0–3 | See below — **run-long**, not +40 stones |
| **Traits** | 2 each | Keep; maybe 3 with deep legacy |
| **Drawbacks** | refund 1–3 | Must hurt for **lifespan-scale** |

---

## Origins — make them lives, not stat stickers

Each origin = **starting situation** + **ongoing hook** (flag checked by systems).

| Origin idea | CP | Start | Ongoing |
|-------------|-----|-------|---------|
| **Village Orphan** | 0 | Dustbone, nothing | Neutral |
| **Merchant Debt** | 1 | +60 stones, **debt 100** — tithe 10 stones/year or +enemy event | Market discount in Jade; creditors in Heartlands |
| **Sect Outer Disciple** | 2 | Manual: **common** qi cycling, **+1 sect rep** with one faction, must pay **12 mo/yr** duty or −rep | Sect quests available earlier |
| **Fallen Noble** | 2 | +Fame, **bounty event chain**, nobles cold in Heartlands | Unlock renown purchases |
| **Hermit’s Foundling** | 1 | Start **outer zone**, +1 rare herb, −NPC trust in cities | +explore reward, slower market access |
| **Lightning Survivor** | 3 (unlock) | Scar, +lightning resist, **tribulation +15% likelihood** | Thunder deviant rite recipe hinted |
| **Alchemist’s Apprentice** | 2 | Crude cauldron, 3 herb stacks, **−1 alchemy recipe** until find manual | Alchemy rep head start |

**Pattern:** origin sets **where**, **who wants something from you**, and **what unlocks early** — not flat +40 stones.

---

## Drawbacks — worth the CP refund

Must bite in a 80–120 year run. Suggested **+2 CP = meaningful**, **+3 CP = severe**.

| Drawback | Refund | Effect (lifespan-scale) |
|----------|--------|-------------------------|
| **Sworn Enemy** | 2 | +8% damage taken + **ambush event** every ~40 months |
| **Frail Body** | 2 | −15% max HP + **+10% recuperate months** |
| **Poor Memory** | 2 | −15% dao + **manual comprehend +1 mo** |
| **Hunted** | 2 | −20 fame + **bounty hunter** in mid zones |
| **Heaven’s Grudge** | 3 | +12% tribulation severity, −10% trib resist |
| **Short Life** | 3 | **−10% lifespan cap** (mortal tragedy) |
| **Impure Dantian** | 2 | −12% cultivate speed (stacks with inferior root — brutal) |
| **Karmic Debt** | 2 | +10% market prices, −10% explore stones until paid event |

**Rule:** drawback refund should ≈ cost of **one grade step** or **one trait** — player trades long-term pain for build budget.

---

## Other creation knobs

| Knob | Purpose |
|------|---------|
| **Starting zone** | 1 CP to pick Dustbone vs Jade (not Heartlands) |
| **Starting age** | 16 default; 20 = −2 CP but +1 pillar stability |
| **Carry perk** (reincarnation) | Existing `LEGACY_CARRY_PERKS` — expand |
| **Sect reclaim** (reincarnation) | Prior-life world choice: start as heir with **arrays intact** + archive manual — see [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md) |
| **Echo memory** | Chronicle unlocks flavour + one free recipe known |

---

## UI

Wizard: **Root (composition + grade)** → **Cultivation method (grade)** → **Origin** → **Traits** → **Drawbacks** → **Preview** (Innate Height, speed, oracle, debts/flags).

Reincarnation unlocks appear greyed with “Unlocked after …” — gives reason to run again.

## Prerequisites (implement in rough order)

1. [ ] [`spiritual-roots-taxonomy-v2.md`](spiritual-roots-taxonomy-v2.md) — composition, grade, Innate Height on creation UI
2. [ ] [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md) — starting method tier at minimum
3. [ ] Root ascension / economy stubs — stones matter, material grind (for debt/tithe origins)
4. [ ] Event / story flag plumbing — `G.originFlags`, ambush/bounty/duty timers
5. [ ] Sect duty or faction rep hooks — for outer-disciple origin
6. [ ] Reincarnation unlock catalog wired to greyed creation options
7. [ ] Then: rebalance drawbacks + replace origin `startEffect` one-shots with ongoing hooks

Until then: **keep current creation screen**; no partial origin/debt work that dead-ends.

## Implementation crumbs

- `data.js` — `ORIGINS`, `CREATION_DRAWBACKS`, `TRAITS`
- `main.js` — `applyOriginEffects`, creation UI
- `talent.js` — `getDrawback*`, `getOriginCultivateSpeedMult`
- `legacy.js` — unlock catalog for origins / manuals / compositions
