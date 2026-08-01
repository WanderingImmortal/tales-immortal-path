# Combat — damage depth (systems)

| Field | Value |
|-------|-------|
| **Status** | `designed` |
| **Blocked on** | none for design; build Issue not opened yet |
| **Issue** | none yet |
| **Chat / PR** | Combat damage depth planning — [PR #91](https://github.com/WanderingImmortal/tales-immortal-path/pull/91) |
| **Updated** | 2026-08-01 |
| **Design focus** | **Intent wielding** (this pass) — dao + full stress pipeline parked in same doc |

## Intent

Fights should change based on **what you hurt**, not only how big the HP number is. Techniques need room to differ (slash vs crush vs meridian seal) without a body-part aim menu that makes arts feel arbitrarily locked to one limb (“this slash only hits legs”).

**One HP** stays the kill race. **Systems** under that HP change fight *shape* when stressed or broken. Inner vs outer is a label for systems and poisons — **not** a second life bar.

> **Planning only** — no build queue yet. Intent wielding below is the active design thread.

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

---

### Unified hit pipeline (extensibility spine)

Today damage is scattered: basics add flat intent bonus + per-art hooks in `applyIntentArtsOnBasicAttack`; techniques roll HP in `calcCombatTechniqueDamage` then bolt on dao procs in `rollTrueDaoCombatEffects`. Intent match is a **dmg/cost mult**; dao is **bonus dmg + CC**. None of that knows about systems/stress yet.

**Goal:** every damaging action resolves through one function with an **attack profile** — basics, techniques, intent arts, dao riders, trib bolts, poisons, traps, enemy actions all share it.

```text
source (basic | technique | intentArt | daoRider | trib | poison | …)
  → buildAttackProfile(source, wielder context)
  → applyWieldingModifiers(profile)     // intent expression + dao bias
  → resolveHit(profile, target)         // HP dmg, stress, status, break checks
  → log + UI chips
```

#### Attack profile (data shape)

Minimal v1 object — extend later without rewriting callers:

| Field | Role |
|-------|------|
| `hp` | Raw HP damage before target mitigation |
| `stress` | `{ flesh, structure, circulation, core }` — fractional weights, sum ≈ 1.0 |
| `nature` | Primary wound nature (drives defaults + log flavor) |
| `delivery` | `melee` · `projectile` · `aura` · `domain` · `soul` · `trib` · `environment` |
| `tags` | e.g. `outer`, `inner`, `twoHand`, `sweep`, `execute`, `ignoresGuard` |
| `pen` | Optional penetration vs hardness (Phase B+) |
| `intentExpr` | How active intent tints this hit (see below) |
| `daoRiders` | Optional proc ids / stress biases from comprehended dao |

**Stress weights** derive from `nature` by default; techniques can override (`stress: { circulation: 0.7, flesh: 0.3 }`). One slash can still splash Structure lightly.

**New attack types** = new profiles, not new combat branches. Examples:

| Attack type | nature | stress skew | delivery | notes |
|-------------|--------|-------------|----------|-------|
| Mountain Crash | crush | Structure-heavy | melee | existing body slam |
| Storm Needle | needle | Circulation | projectile | meridian seal at range |
| Slaughter Aura tick | slash | Flesh | aura | intent art → profile, not flat dmg |
| Soul Search probe | soul-cut | Circulation | soul | weak HP, high Circulation stress |
| Celestial Judgment | pierce | Core + Circulation | trib | uses trib stress table |
| Butcher's follow-up | slash | Flesh + Structure | melee | sever bias when Flesh already broken |

Pool authors add rows; engine stays generic.

#### Where profiles are built

| Source | Builder | Today |
|--------|---------|-------|
| Basic attack | weapon/path default + intent arts | flat dmg + art hooks |
| Technique | `TECHNIQUE_POOL` template + scaling | `baseDamage` only |
| Intent expand art | `INTENT_EXPAND_ARTS` | basics only, bespoke |
| Dao proc | `DAO_TAXONOMY` combat riders | `rollTrueDaoCombatEffects` |
| Trib / environment | script tables | ad hoc |

**Refactor target:** `buildAttackProfileFromTechnique(tech)`, `buildAttackProfileFromBasic()`, `mergeIntentArtModifiers(profile, intent)`, `mergeDaoRiders(profile, tech)` → `resolveCombatHit(profile, enemy)`.

---

### Intent wielding — the fantasy

**Weapon intent is not “which button you pressed.”** It is how you *carry* force through the world.

A sword cultivator among their peers might still throw a palm strike — but at high intent it does not read as a shove. Their fingers are the blade. The qi lines up like an edge. The wound is a **cut**, not a bruise. Same art, different expression.

A spear cultivator’s fist does not have to be a haymaker. It can drive **through** guard like a thrust — piercing, linear, finding the gap.

That is the design goal: **your dominant intent shapes how any physical art lands**, especially when the art’s “native” weapon doesn’t match. Low intent = the art looks like what it is on paper (palm pushes, fist crushes). Deep intent = the art starts to look like *your* path.

This rewards long investment in one intent without hard-locking every technique to one weapon type. It also gives NPC and player fiction a clear read: *“He has no sword, but every strike opens like one.”*

---

### Two questions (not one)

Today the game mostly asks: **“Is your intent the right weapon?”** Wrong answer → big damage cut on fancy arts.

Split that into two separate questions:

| Question | Meaning | Stays strict? |
|----------|---------|---------------|
| **Can you use this art at all?** | Path, realm, soul mass, story gates | **Yes** — body arts still need body cultivation; soul arts stay soul |
| **How does your intent express through it?** | What the hit *feels* like and what it stresses | **No hard fail** — always some expression; quality scales with intent depth |

Wrong-weapon arts should feel **awkward or costly**, not “grayed out unusable.” A shallow sword intent throwing a fist palm is still a push. A **Perfection**-tier sword intent throwing the same palm is the finger-blade cut.

---

### Expression strength (intent depth)

How far intent rewrites a mismatched art should scale with **how deep that intent is** — uses, tier, deepen picks, domain arts.

| Intent depth | Cross-wield feel (example: Sword intent + palm art) |
|--------------|-----------------------------------------------------|
| **Sprout / shallow** | Art mostly as written. Small flavor line. Maybe +5% cut-leaning stress. |
| **Minor / Major Success** | Clear shift — palm reads as chop or edge-slap; bleed weight rises. |
| **Perfection** | Strong rewrite — *“Your fingers carry sword intent; the palm lands as a cut.”* Mechanical shift toward slash / flesh stress. |
| **Intent Domain** | Signature — unarmed basics can default to sword expression; expand arts (Returning Edge, etc.) tint **techniques** too. |

**Perfect match** (Sword intent + sword art) stays the cleanest line: full synergy, lowest cost, authored stress profile unchanged.

**Weapon match, shallow stage** — same family, not enough depth: warn in UI, reduced efficiency, but not the old 45% damage cliff.

---

### Cross-wield expression table (draft)

Each intent has a **home expression** — what it wants to do to the world. When you cross-wield, the art bends toward that home without erasing what the art is.

| Your intent | Home expression | Fist / palm art becomes… | Sword / blade art becomes… | Staff / qi art becomes… |
|-------------|-----------------|--------------------------|----------------------------|-------------------------|
| **Sword** | Soft line, adaptable cut | Chop, finger-blade, **cut not push** | Light edge — find the seam | Deflecting channel, drawn line |
| **Blade** | Heavy slash, bleed, slaughter | Tearing rake, knuckle rend | Native — cleaving weight | Wide arc, blood-weight |
| **Spear** | Thrust, pierce, line | **Piercing fist**, spear-hand, penetrating palm | Short thrust, tip-work | Bolt-like channel |
| **Fist** | Crush, shock, rhythm | Native — concussive | Hilt strikes, blunt edge, guard break | Staff bash, ward pulse |
| **Staff** | Ward, circulation, reach *(draft)* | Meridian push, circulating palm | Deflecting cut, turning parry | Native — ward and channel |

**Owner beat (locked):** Sword-at-Perfection + Heavenly Palm = cut, not push. Spear-at-depth + Mountain Crash = still heavy, but stress and log read **piercing** — *“You drive the slam through a single penetrating line.”*

Soul arts and spirit damage **do not** get rewritten into sword cuts — intent may add flavor text only, or bias secondary stress, but soul-cut stays soul-cut.

---

### Sword vs Blade — same family, different temperament (owner 2026-08-01)

Both are edge weapons. In xianxia they often split on **weight and temperament**, not “big sword vs small sword.”

| | **Sword intent** | **Blade intent** |
|---|------------------|------------------|
| **Fantasy** | Light, adaptable, **follows the opening** — the line appears where the gap is | Heavy, committed, **cleaving** — the strike decides before it lands |
| **Temperament** | Softness, change, precision | Heaviness, slaughter, finishing wounded prey |
| **Home wound shape** | Clean cut, line, edge | Wide slash, rend, **bleed** — meat, not geometry |
| **Cross-wield on palm** | Finger-blade, **cut not push** | Palm rake, tearing knuckle-slash, blood-weight |
| **Cross-wield on the other’s art** | Sword art with Blade intent: heavier, slower, more bleed, less nimble | Blade art with Sword intent: lighter line, less rend, more “find the seam” |
| **Domain fantasy** | Phantom forms, returning edge — **the line never ends** | Slaughter aura, butcher domain — **the wounded don’t get away** |

**Design rule:** Sword and Blade are **neighbors**, not duplicates. If both express as “slash,” Blade leans **flesh / bleed / committed**; Sword leans **line / adapt / precise**. Playtest should make them *feel* different even when the log word is “cut.”

**Open:** Can a cultivator awaken both? Probably yes over a long career, but **one active expression per fight** — switching is the out-of-combat intent-switch action. Dual Sword+Blade expression on one swing = not v1.

---

### Staff intent — rethink (owner open to rewrite, 2026-08-01)

Staff is the awkward one. Existing expand arts (Circulating Guard, Ward Pulse, Sanctuary Domain) are **all defensive** — but staff techniques in the pool include **Celestial Judgment** (lightning blast), **Root-Vein Surge** (vein draw), **Staff Shatter** (body smash). Pure “tank intent” doesn’t match that spread.

#### Does pure defensive suit xianxia?

**Partly.** Monk staff, ward-circulation, turning force aside — all real. But in fiction staff cultivators also **sweep legions**, **command lightning**, **claim ground**. A staff intent that only says “I defend better” feels more like an MMO tank talent than a cultivation path. Fine as a *facet*, weak as the **whole identity**.

#### Recommended reframe: **Circle intent** (working name: Staff)

Staff intent = **you define the circle you fight in.**

| Facet | Fantasy | In combat |
|-------|---------|-----------|
| **Reach** | The staff is longer than their reach — you strike from *your* distance | Sweeps, channels, punishing entry |
| **Hold** | What enters your circle is yours to judge | Ward, deflect, circulating guard *(keep or rewrite expand arts)* |
| **Conduct** | The staff is a **conduit** — heaven, veins, earth answer the call | Celestial Judgment, Root-Vein flavor; cross-wield = arts feel *channelled* not raw |

**Cross-wield examples:**
- Staff intent + palm → not a bash — qi **pushed through** them, meridian stumble
- Staff intent + sword art → deflecting line, strike that **turns** their guard
- Staff intent + fist → shockwave at **range**, ring of force (cousin to fist but spatial)

**Offensive home:** sweep, channel, ring — not cut (sword), not cleave (blade), not thrust (spear), not crush (fist).

**Defensive home:** strongest here — but it’s one leg of the stool, not the whole chair.

#### Alternative if Circle feels too vague: **Conduct intent**

Staff = the **conduit** intent. Lightning, vein qi, array-flavored strikes. Cross-wield makes physical arts look “conducted” through a medium. Weaker on “sweep the courtyard” monk fantasy; stronger on scholar / heavenly-strike fantasy. Pairs well with Celestial Judgment already gating on Staff intent.

#### What we’d rewrite (if Circle wins)

| Today | Possible change |
|-------|-----------------|
| Staff expand arts all defensive | Reframe as **Hold** leg of Circle — keep Sanctuary loop or replace one pick with a **Reach** or **Conduct** art |
| `INTENT_DOMAIN_MANIFESTATIONS.Staff` | “An arcane ward circulates” → something like *“Your circle answers to you — reach, hold, conduct.”* |
| Staff vs Spear | Spear = **line through** one point; Staff = **ring / volume** around you |

**Owner call still open.** Lean **Circle** over pure defensive; **Conduct** if staff-main should feel like vein/lightning scholar first.

#### Parked options (if Circle + Conduct both feel wrong)

1. **Ward / circulation only** — simple, matches current arts; risk: passive staff mains  
2. **Reach / separation** — distance control only  
3. **Scholar channel** — subset of Conduct; lightning + vein focus

### Worked examples (fiction → mechanics)

| Situation | Log flavor | Mechanical tilt (when stress system exists) |
|-----------|------------|-----------------------------------------------|
| Perfection Sword intent, no weapon, basic attack | *“Sword intent manifests — your hand falls like a blade.”* | Default nature **slash**; flesh stress; may inherit Returning Edge |
| Major Success Sword intent, Scorching Palm | *“Flame rides the edge of your palm, not the heel of your hand.”* | Fire + slash-leaning flesh stress (not crush) |
| Perfection Spear intent, Crushing Fist | *“A single penetrating knuckle finds the seam in their guard.”* | Pierce-leaning; circulation splash; penetrating_line bias |
| Shallow Fist intent, Wind Blade Strike | *“The wind-blade forms, but your fist intent drags it blunt.”* | Weakened slash; more structure than authored |
| Intent Domain Blade, enemy below half HP | *“Butcher Domain — every touch opens a wound.”* | Slaughter aura threshold; bleed break pressure |
| Perfection Sword intent, same palm — Blade cultivator comparison | *“His palm cuts; yours rends.”* | Sword: precise flesh line; Blade: heavier bleed weight |
| Major Staff intent, Heavenly Palm | *“Qi circulates through the palm — their meridians stumble.”* | Circulation stress; not a cut or push — **flow disruption** |

These are **log + stress tilt + tag bias** — not a second damage formula per combo.

---

### Room to grow (parked beats)

Intent expression is a **platform**, not a closed list. Later beats that fit the same rules:

- **NPC identity** — “The Palm Sovereign” is terrifying because every open-hand art expresses as a different intent than the manual says.
- **Sect manuals** — same art taught two ways; expression table differs by lineage (Lotus softens, Sword sect sharpens).
- **Trials / bosses** — read your active intent and counter-express (anti-line, anti-thrust).
- **Unarmed specialists** — no weapon slot; intent *is* the weapon for basics and cross-wield.
- **Dual expression (late)** — two awakened intents, switch mid-fight (months out of combat); never two on one swing in v1.
- **Intent vs intent** — high Spear intent attacking high Staff ward: fiction of thrust vs circulating deflect (tag interaction, not rock-paper-scissors chart).

Add rows to the cross-wield table as new weapons or paths appear. No new combat branch per row.

---

### What stays gated (on purpose)

| Still hard-gated | Why |
|------------------|-----|
| Body / soul / qi **path** | You cannot body-temper a qi-only character into Mountain Crash |
| **Realm** and technique requirements | Arts you haven’t earned don’t appear |
| **High art cost** when cross-wielding | Expression is allowed; efficiency is not free |
| Soul damage type | Intent colors; does not turn Soul Rend into a physical slash |

Softened (design intent): **weapon type on high-quality arts** — usable with expression shift instead of ~45% damage brick.

---

### Intent arts beyond basics

Expand arts (Returning Edge, Pierce Domain, Slaughter Aura, …) should eventually tint **techniques**, not only basic attacks — at least at Intent Domain tier, earlier for some arts.

Shape (planning only):

```js
// example — not shipped
{ id: 'returning_edge', expression: { natureBias: 'slash', onHit: { extraSwing: 0.45 } } }
{ id: 'pierce_domain', expression: { tags: ['ignoresGuard'], stressBias: { circulation: 0.15 } } }
```

At Domain tier, Sword intent + any physical technique may roll Returning Edge at reduced strength — the “everything is a sword” endgame.

#### Multiple intents (future)

Several intents awakened; one **active** for expression. Mid-fight switch costs a turn or breath. One expression per swing.

---

### Dao layer (parked — not current focus)

*Intent wielding is the active design thread. Dao hooks below stay valid but wait for a later pass.*

Today: `rollTrueDaoCombatEffects` — element-aligned **greater phase** dao adds bonus HP + freeze/root/slow. `getDaoIntentSynergyMult` — +8% element, +7% more if intent matched. Fine for HP race; doesn’t interact with systems.

**Dao rides the same profile pipeline:**

| Layer | Role |
|-------|------|
| **Element phase** (Fire, Water, …) | Stress **bias** on aligned hits + proc riders |
| **Five Phases** | Broad bias on all elemental stress |
| **Branch / fundamental** (later) | Rewrite rider table — e.g. Death dao adds Core stress on finishers |

#### Phase dao → stress bias (draft)

On a hit whose technique element matches a comprehended **phase** dao, add to `stress` before resolve (normalized):

| Phase | Bias | Proc rider (keep or move from today) |
|-------|------|--------------------------------------|
| Fire | +Flesh (ignite opens bleed) | ignite bonus HP |
| Water / ice | +Circulation | skip/slow (frozen meridians) |
| Lightning | +Circulation, splash Core | skip turn |
| Wind | +Flesh, tempo | slow |
| Earth | +Structure | root / guard break |
| Metal | +Structure, +pierce pen | armor pen (later) |

**Intent + dao stack:** `getDaoIntentSynergyMult` becomes part of `applyWieldingModifiers` — when **both** element dao and intent expression align, apply stress **efficiency** (+15% stress dealt) in addition to dmg mult. Rewards building coherent kits without hard-locking arts.

#### Dao riders (composable)

Move hardcoded `rollTrueDaoCombatEffects` branches into `DAO_TAXONOMY` entries:

```js
combatRiders: [{ id: 'phase_fire_ignite', chance: 0.25, profile: { hp: '5%maxHp', stress: { flesh: 1 }, tags: ['ignite'] } }]
```

Techniques with `daoAffinity: ['fire', 'destruction']` pick eligible riders. New dao = new riders, not new `combat.js` elseif chains.

**Greater / fundamental daos (later phases):** riders that change `nature` on proc (*Judgment dao turns slash → pierce once per fight*) or add a second resolve pass (*Cycle dao: split stress across two systems*).

---

### Migration from today (no big-bang)

| Step | Ship |
|------|------|
| A | `resolveCombatHit` + enemy stress pools + breaks (systems doc above) |
| B | Default `nature` / `stress` on `TECHNIQUE_POOL`; basics from weapon |
| C | Intent **expression** merge; soften high-art weapon hard-fail |
| D | Port intent arts to profile modifiers; techniques call merge |
| E | Port `rollTrueDaoCombatEffects` → dao riders + stress bias |
| F | Pen/hardness, poisons, player wounds, morale |

Each step keeps fights playable; A+B can ship without C if needed.

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
- Cross-wield table: tune per playtest — should feel different, not strictly better
- High-art `noMatchMult` removal: confirm no degenerate “always Spear intent + every art” meta
- **Expression at Sprout:** how much rewrite is too much too early?
- **Soul + intent:** flavor-only vs light stress bias — owner call
- Sword palm / spear fist examples: locked as signature beats; add more via table rows not bespoke code
- **Sword vs Blade:** temperament locked (soft/adapt vs heavy/bleed); tune numbers so they don’t play identically
- **Staff intent:** lean **Circle** (reach + hold + conduct) over pure defensive; existing ward expand arts may be rewritten; **Conduct** alt if scholar/lightning is the spine

## Implementation crumbs

| Area | Likely touch |
|------|----------------|
| Engine | `combat.js` — `resolveCombatHit`, stress, breaks; thin wrappers for basic/tech |
| Data | `data.js` — `TECHNIQUE_POOL` attack profiles; `INTENT_EXPAND_ARTS` modifiers; trib stress table |
| Intent | `intent.js` — `mergeIntentCombatModifiers`, expression / cross-wield tables |
| Dao | `dao-taxonomy.js` — `combatRiders`, stress bias; retire bespoke `rollTrueDaoCombatEffects` branches |
| Techniques | `techniques.js` — `getTechniqueIntentMatch` → requirement vs expression split |
| UI | `ui.js` / `index.html` combat overlay — visible wound chips; gated full read |
| Related | `core.js` (`calcCombatTechniqueDamage`), `gear.js`, bleed/poison plumbing; forge tiers for pen |
| Ideas | [`spiritual-sense-cultivation-reading.md`](spiritual-sense-cultivation-reading.md), [`forging-equipment-tiers.md`](forging-equipment-tiers.md), [`tribulation-system-rework.md`](tribulation-system-rework.md), [`world-clock-continuous.md`](world-clock-continuous.md) (parked fight redesign note) |

## Build phases (Issues later)

1. **`resolveCombatHit` + enemy stress pools** — breaks, bleed, logs (HP victory unchanged)
2. **Attack profiles on pool** — default `nature` / `stress` on techniques + weapon basics
3. **Intent expression** — cross-wield shift; soften high-art weapon hard-fail; port expand arts to profile modifiers
4. **Dao riders** — stress bias + move phase procs into `DAO_TAXONOMY`
5. Outer/inner poisons & battle coats
6. Enemy resists (thick shell, sealed meridians)
7. Penetration / hardness gates
8. Player-side + mutual lasting wounds; heal/time/pill
9. Enemy morale / flee-or-stand
10. Greater/fundamental dao riders; optional body-path temper fiction
