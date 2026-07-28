# Combat — damage depth (systems)

| Field | Value |
|-------|-------|
| **Status** | `designed` |
| **Blocked on** | none for design; build Issue not opened yet |
| **Issue** | none yet |
| **Chat / PR** | Combat damage depth planning — `[L·WIP] Combat damage depth docs` |
| **Updated** | 2026-07-28 |

## Intent

Fights should change based on **what you hurt**, not only how big the HP number is. Techniques need room to differ (slash vs crush vs meridian seal) without a body-part aim menu that makes arts feel arbitrarily locked to one limb (“this slash only hits legs”).

**One HP** stays the kill race. **Systems** under that HP change fight *shape* when stressed or broken. Inner vs outer is a label for systems and poisons — **not** a second life bar.

## Design notes

### One HP + four systems

| System | Layer | Role |
|--------|-------|------|
| **Flesh** | Outer | Bleed / staying power |
| **Structure** | Outer | Bone/sinew/carapace → limb or **frame** outcomes |
| **Circulation** | Inner | Meridians / flow → tech lock |
| **Core** | Inner | Dantian / beast core → cultivation duel collapse |

People and beasts share the same four tracks (flavor names only). Each hit: normal HP damage + **stress** to the system matching the technique’s **wound nature**.

**Player wounds:** out of scope for v1 (enemy-only). Later: mutual serious damage + morale.

### Wound natures (not limb targets)

Techniques declare *how* they wound. Defaults by path/category so the pool doesn’t need a full hand pass on day one. Basics inherit a mild default from weapon/path.

| Nature | Primary stress | Notes |
|--------|----------------|--------|
| Crush / slam | Structure | Bone/sinew; limb/frame outcomes |
| Slash / fang | Flesh | Bleed / attrition (+ light Structure splash in v1) |
| Needle / seal / thread | Circulation | Meridian / flow |
| Pierce / execute | Core (fallback Structure) | Finishers lean Core |
| Soul-cut | Circulation (Spirit tag later if needed) | Soul path |

No “this slash only hits the chest.” Slash hits the body and leans Flesh. Limb text is an **outcome**, not the aim point.

### Structure outcomes (`arm` · `leg` · `frame`)

Structure is **one** integrity pool — not four limb HP bars. When it crosses a break threshold, pick an outcome slot:

1. From available slots (humanoid: `arm`, `leg`, `frame`; beasts may remap `frame` → carapace/torso).
2. **Bias, don’t hard-lock**, from the tipping hit (sweeps → leg, arm-crush → arm, torso slam → frame; untagged → weighted random among remaining).
3. Cap **2 Structure outcomes per fight**; normal fights should rarely hit the cap.
4. Clears when combat ends (v1). Log in plain language.

**Frame** (was “stance”) = trunk / ribs / spine / root — their frame gives; guard fails.

**Broken vs severed (arm):**
- Structure-only on arm → **arm broken** (two-hand weapons/techniques disabled; one-hand / unarmed / some body arts OK).
- Flesh + Structure on that arm → **arm severed** (worse; full lasting stakes later; v1 may preview as harder in-fight lock).

Flesh breaks do **not** pick limbs. Flesh → bleed. Limbs/frame are Structure’s job.

### Debuffs (owner-locked)

**Flesh broken**
- Bleed DoT that helps kill until stopped by a **pill or technique** (status cleanse).
- Enemy regen suppressed while bleeding.

**Structure → arm broken**
- No two-handed weapons/techniques.

**Structure → arm severed**
- Arm gone for the fight (lasting later).

**Structure → leg**
- Harsh ground **speed** cut (pre-flight / if grounded).
- **Their** flee chance suffers (later: morale may still make them *try* to run).

**Structure → frame**
- Guard/defend-style effects much weaker; slight incoming damage up.

**Circulation broken**
- Qi/soul techniques unavailable or fail; foe leans on **body refinement / physical** only until fixed.
- Not an HP execute.

**Core broken**
- Not an instant kill chunk. Immediate **morale** hit (later flee-or-stand).
- **Mop-up depends on foe:** dual cultivator / body-refined can still fight on tempered flesh; qi/soul-leaning collapse harder. Finish is earned.

### Pacing

Keep current fight length. Usually **0–1** meaningful system breaks per normal Fight; second break uncommon. Stakes come from **debuff weight**, not constant limb loss. Do not lengthen fights to show off systems.

### Modes

All combat-overlay modes share system/stress + break rules (Fight, explore, NPC duels, trials, etc.).

**Tribulation exception on damage *source*:** sky lightning / omen pressure uses a trib-specific stress table (often Circulation / Core / Flesh), not a normal slash-crush kit. Same break debuffs when something gives.

### UI / fog of war

By default the player sees **obvious outer damage only** (dangling arm, ruined leg, heavy bleed, frame visibly broken) via log + status chips.

Full system integrity (esp. Circulation / Core) is a **read** gated by **spiritual sense**, prior intel, or a mid-fight probe — see [`spiritual-sense-cultivation-reading.md`](spiritual-sense-cultivation-reading.md). Not free HUD on every trash fight.

### Inner / outer (poisons later)

Inner vs outer tags systems and effects for later poisons / battle coats (outer flesh toxins vs meridian toxins) without a second HP bar. See also battle coats in [`forging-equipment-tiers.md`](forging-equipment-tiers.md).

### Later: penetration / hardness

**Fantasy:** slash opens skin → bleed, but tempered bone stops severing. Crush hammers Structure. Needle slips toward Circulation.

**Cultivation coherence:** early flesh temper raises Flesh hardness / bleed resist; bone temper raises **Structure hardness** (the real wall against cripple/sever). End state: bones tougher; flesh can still bleed without limbs coming off.

Shared ladder (forge instinct — tier band wins, grade polishes): attack **penetration** vs **Flesh hardness** then **Structure hardness**. Exact tier table is Phase B+.

### Later: mutual stakes + morale

v1: enemy breaks are **in-fight only**. Later: both parties can take serious lasting damage; injured foes may **flee** or **stay** by morale (guardians/fanatics/trials stay). Player lasting injuries stay rare enough not to tax normal Fight.

## Prerequisites

- [ ] Build Issue for first slice (data model + stress + breaks + logs)
- [ ] Optional: spiritual sense combat read (can ship UI fog without full sense system)

## Open questions

Defaults locked for parking; revisit when building:

- Mid-fight: bleed stoppable by pill/tech; full Structure/Circulation/Core repair mid-fight = **no** in v1
- Weird anatomies (ghosts, puppets): missing systems absent/immune
- Player Defend protecting a system: not v1
- Fifth Spirit system: Circulation covers soul-cut for now
- Exact pen/hardness numbers: Phase B+

## Implementation crumbs

| Area | Likely touch |
|------|----------------|
| Engine | `combat.js` — hit resolve, stress, breaks, bleed, victory still HP-gated |
| Data | `data.js` — `TECHNIQUE_POOL` wound natures; enemy system kits; trib stress table |
| UI | `ui.js` / `index.html` combat overlay — visible wound chips; gated full read |
| Related | `intent.js`, `gear.js`, bleed/poison plumbing already in combat; forge tiers for later pen |
| Ideas | [`spiritual-sense-cultivation-reading.md`](spiritual-sense-cultivation-reading.md), [`forging-equipment-tiers.md`](forging-equipment-tiers.md), [`tribulation-system-rework.md`](tribulation-system-rework.md), [`world-clock-continuous.md`](world-clock-continuous.md) (parked fight redesign note) |

## Build phases (Issues later)

1. Data model + stress on hit + break effects + log lines
2. Default natures on techniques + weapon basics
3. Outer/inner poisons & battle coats
4. Enemy resists (thick shell, sealed meridians)
5. Penetration / hardness gates
6. Player-side + mutual lasting wounds; heal/time/pill
7. Enemy morale / flee-or-stand
8. Optional body-path temper fiction tweak; exact pen tier table
