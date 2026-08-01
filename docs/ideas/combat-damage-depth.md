# Combat — damage depth (systems)

| Field | Value |
|-------|-------|
| **Status** | `designed` |
| **Blocked on** | none for design; build Issue not opened yet |
| **Issue** | none yet |
| **Chat / PR** | Combat damage depth planning — [PR #91](https://github.com/WanderingImmortal/tales-immortal-path/pull/91) |
| **Updated** | 2026-08-01 |

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

### Intent wielding (flexibility without gutting gates)

Current intent model (`getTechniqueIntentMatch`): **weapon + stage** gate high arts (45% dmg if wrong weapon on `high` quality). Intent expand arts only touch **basics**. That’s good for “this is a Sword art” but too rigid for “I wield everything through my killing intent.”

**Split two concerns:**

| Concern | Question | v1 behavior |
|---------|----------|-------------|
| **Requirement** | Can you *form* this art at all? | Keep path gates (body/soul). Soften **weapon** hard-fail on `high` → always *usable*, worse expression. |
| **Expression** | *How* does your active intent wield it? | Active intent **tints** the attack profile — stress mix, delivery tag, small bonuses. |

#### Expression (active intent tints the hit)

When you throw a technique (or basic) with an active intent, merge an **expression layer**:

| Match | Expression |
|-------|------------|
| **Perfect** — weapon + stage met | Template stress + nature as authored; `intentExpr.bonus` on primary stress; synergy dmg/cost as today |
| **Weapon match, shallow stage** | Same nature, −stress efficiency; warn as today |
| **Cross-wield** — wrong weapon, art still forms | **Shift** primary nature toward intent’s “home” nature (see table); never flip path (soul art stays soul-cut) |
| **No intent awakened** | Template defaults only; no expression bonus |

**Cross-wield nature shift (draft)** — intent re-angles the wound, doesn’t rewrite the art:

| Active intent | Home nature | Cross-wield effect on mismatched physical art |
|---------------|-------------|-----------------------------------------------|
| Sword | slash | +slash / Flesh splash; techniques read as “intent-carried” |
| Blade | slash | +bleed weight on Flesh breaks |
| Spear | pierce | +Circulation splash; guard-pierce tags more likely |
| Fist | crush | +Structure weight; slow/concussive tags |
| Staff | needle | +Circulation / ward-flavored stress on hybrids |

Example: **Mountain Crash** (Fist, crush) wielded with **Spear intent** → still crush HP, but stress shifts `{ structure: 0.5, circulation: 0.3, flesh: 0.2 }` and may inherit `penetrating_line`-style guard interaction if Spear arts unlocked. Log: *“You drive the slam through a piercing line.”*

**High-quality arts:** replace hard `noMatchMult: 0.45` **block-feel** with **usable + ugly expression** — higher cost, lower stress efficiency, cross-wield shift. Reserve true `usable: false` for **path** mismatch (body art on qi path), not wrong weapon.

#### Intent arts beyond basics

Expand arts should attach **profile modifiers**, not only basic-attack branches:

```js
// example shape — not shipped API
{ id: 'returning_edge', onHit: { extraProfile: { hp: 0.45, nature: 'slash', delivery: 'melee' } } }
{ id: 'pierce_domain', onHit: { tags: ['ignoresGuard'], stressBias: { circulation: 0.15 } } }
```

`applyIntentArtsOnBasicAttack` becomes `mergeIntentCombatModifiers(profile, intent, context)` shared by basics **and** techniques when expression matches.

#### Multiple intents (future, not v1)

Player may awaken several intents; one **active** for expression. Switching mid-fight costs a turn or breath (existing `intentSwitch` months out of combat). No dual-wielding two expressions on one swing in v1.

---

### Dao layer (stress + riders, not only bonus dmg)

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
- Cross-wield shift table: tune per playtest — should feel different, not strictly better
- High-art `noMatchMult` removal: confirm no degenerate “always Spear intent + every art” meta
- Dao riders on basics: yes for phase bias; full rider procs on basics only if art-tier intent

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
