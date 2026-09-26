# Stats → meters rework (guards, damage natures, fifth system, per-track foundation)

| Field | Value |
|-------|-------|
| **Status** | `designed` (owner direction locked 2026-09-25; numbers open) |
| **Blocked on** | none — owner call: **change now**, not build on top |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chat, 2026-09-25 (`cursor/spirit-path-stats-design-docs-39a3`) |
| **Updated** | 2026-09-25 |

**Code today:** `getPlayerOffensivePower` / `estimateBasicAttackDamage` / `applyDamageToPlayer` in [`combat.js`](../../combat.js); `COMBAT_PATH_CONFIG` in [`data.js`](../../data.js); enemy defs (HP, dmg, `defending` flag only).

Related: [`combat-damage-depth.md`](combat-damage-depth.md) (four systems — this doc adds a fifth), [`spirit-path-full-design.md`](spirit-path-full-design.md) (first consumer), [`body-path-refining-rewrite.md`](body-path-refining-rewrite.md), [`vessel-rules-design.md`](vessel-rules-design.md).

---

## Intent

Replace the legacy four raw stats (Qi, Vitality, Spirit, Will) as **combat inputs** with the **cultivation meters the game already has**, so what the player cultivates is what combat reads. Make defence **visible and typed** (three guards) so "soul bypasses defence" is something the player can *see*, and make combat **technique-driven** so dual / tri cultivators work.

Owner: the stat system is a legacy from the first build; it feels arbitrary because stats are **fuel for hidden formulas**, not things a player owns. Nobody in xianxia has "Will 14."

---

## What the stats do today (diagnosis, keep)

- Four raw numbers; +1/+2 per breakthrough; ~70 other write sites (talents, traits, physiques, pills).
- One hidden formula per path turns them into damage:
  - qi: `qiDensity × 1.2 + will × 0.3`
  - body: `vitality × 1.5 + qiDensity × 0.5`
  - soul: `(will + spirit) / 2`
- **Enemies have no defence stat.** HP, dmg, and a `defending` flag (hit → 45%). "Soul bypasses defence" = on blocking turns soul hits keep 35% more, plus a flavour line 22% of the time. Invisible.
- Combat branches on `G.path` everywhere (`getPlayerOffensivePower`, basic attack, shield, regen) → **cannot express a dual cultivator**.
- Reference counts (reads + writes): `G.qi` 132, `G.hp` 122, `G.will` 69, `G.spirit` 67, `G.maxHp` 67, `G.vitality` 49. **Qi and HP stay** (already meters). Deletion targets = Vitality / Spirit / Will ≈ **185 references**. Medium refactor, not a rewrite.

---

## Design notes

### Principle

Combat reads the meters each path already owns. Raw stats stop growing.

| | Qi | Body | Spirit |
|--|----|------|--------|
| **Base** (how much) | Qi capacity | Vessel (tempered HP) | Spirit sea → Soul Mass |
| **Quality** (how refined) | Qi density | Physique / tempering grade | Soul maturity |
| **Reserve** (spent in fights) | Breath | Stamina | Focus |
| **Foundation** (how solid) | **per track** — see below | | |

Shared: realm index (power ruler), lifespan.

- **Vitality → vessel. Spirit → spirit sea. Will → foundation + soul maturity mix.** Their jobs are already taken.
- **HP stays**, derived from vessel track + realm — not a stat that levels beside you. Qi / soul cultivators: thin HP + a barrier in front. Body: thick HP, nothing else. (Already half how shields work.)

### Guards (mitigation — what stops damage landing)

Three, on **every** entity, **shown on the enemy card**:

| Guard | From | Stops |
|-------|------|-------|
| **Flesh guard** | physique / vessel tempering | physical |
| **Qi barrier** | qi capacity (the shield) | qi / elemental; some physical |
| **Soul guard** | Soul Mass + maturity | soul |

Every attack tests **one** guard. Soul strike vs Iron Bones brawler → flesh guard greyed (irrelevant), soul guard thin, big number, log: *"The strike passes through iron and finds the man inside."* Beast: huge flesh, no soul. Ghost: no flesh, deep soul. Qi cultivator: barrier that soul partially ignores.

**That is what bypass looks like** — the player sees which wall the attack hits and which it walks through. Parity via rock-paper-scissors, not matched numbers: soul counters body; body out-endures barriers / fast brawls; qi has range + elements.

Overlay effect: a qi cultivator who dabbled in the spirit track has *some* soul guard; one who didn't is opened by any soul cultivator at their realm → everyone has a reason to visit the Soul Palace.

### Systems (wounds — what landed damage stresses)

Guards ≠ systems. [`combat-damage-depth.md`](combat-damage-depth.md) has four: Flesh, Structure, Circulation, **Core** (= dantian / beast core — owner confirmed). Add a **fifth: Spirit** (sea of consciousness pre-birth, soul post-birth). Soul-cut lands past soul guard → stresses Spirit. Break = confusion, lost turns, at the extreme the mind goes before the body.

**Seats (path differentiation without per-path systems):** all five systems on everyone; each path has one **seat** where its cultivation lives. Breaking a non-seat = wound; breaking the seat = cultivation-duel collapse.

| Path | Seat |
|------|------|
| Qi, beasts | Core |
| Body | Structure (bone / marrow) — *open: Flesh has a claim* |
| Spirit, ghosts | Spirit |
| Dual / tri | two seats — twice the strength, twice the collapse routes |

Body cultivator's Core is small and near-irrelevant; soul cultivator's Spirit is huge and is their weak point if reached. Soul cultivators **crack your cultivation**, not your arm.

### Attacks tagged by technique, not path (owner lock)

**The technique decides nature, cost pool, and scaling meter; your meters decide how well it lands.**

- Techniques already carry `school`, `element`, `costType`, `spiritDamage`, `weaponType` → make combat honour tags it already has instead of asking `G.path`.
- Untagged **basic attack** → nature from what you wield: sword = physical, bare palm qi = qi, soul press = soul.
- Tri-cultivator: soul technique costs Focus, tests soul guard, scales from Soul Mass; body art costs Stamina, tests flesh guard, scales from vessel. Thin Soul Mass makes the first weak — `getSoulCondensationPowerMult` already does this.
- **Focus track** = UI convenience (which breakthrough button is front), **not** a combat input. `G.path` branches in combat are the code that has to go.

### Foundation per track (owner lock: separate)

Dual cultivator with bedrock dantian + rushed vessel must have **different** breakthrough odds / tribulation severity per track. Per-track consolidation already exists in save shape (`G.cultivation[track].consolidation`) → per-track foundation drops in.

Cross-path readers of the single Foundation need a rule each:

| Reader | Rule |
|--------|------|
| World gates | highest track (already realm-based) |
| Lifespan | highest track, or weighted sum — *open* |
| Flee chance | highest track, or spirit-sea (perception) — *open* |
| Combat reserve size (`maxResource`) | the track that owns that reserve: Breath ← qi foundation, Stamina ← vessel, Focus ← spirit sea depth |

Screen names: dantian foundation · vessel tempering · spirit sea depth. Internal key can stay `foundation` per track.

---

## Migration — change now, without a big bang

Owner concern: building on top makes a mess; every new reader of Will/Spirit doubles later migration. **Decision: change now.** But not a rip-out.

1. **Stat facade** — `G.vitality` / `G.spirit` / `G.will` become **derived read-only** values computed from meters. All ~185 readers keep working; stats can no longer be written. Old saves convert stat values → starting meter points once.
2. **Per-track foundation** — split the single number; cross-path rules above.
3. **Enemy guards** — three guards on every enemy sheet; combat UI shows them. Nothing else changes. (Cheapest step; answers "what does it look like" alone.)
4. **Attack nature by technique** — resolve against the matching guard; basic attack nature from wielded thing.
5. **Player guards from meters** — flesh ← vessel/physique, barrier ← qi capacity, soul ← Soul Mass. Combat stops reading legacy stats.
6. **Fifth system (Spirit) + seats** — wire into the damage-depth systems when that ships.
7. **Hide raw stats** on the character sheet; show meter table.
8. **Delete stat writes** — remap each (+2 Vit pill → tempers vessel; +1 Will trait → nudges soul maturity / foundation).

**Rule from day one:** no new code reads legacy stats. Guards and the spirit path read meters from the first line.

## Prerequisites

- [ ] Meter definitions per path confirmed (base / quality / reserve table above)
- [ ] Legacy stat → meter conversion table for saves and for the ~70 write sites
- [ ] Enemy def schema gains `guards: { flesh, barrier, soul }` (or derived from enemy path / type)
- [ ] `combat-damage-depth.md` amended: Spirit fifth system, seats

## Open questions

- Body seat: Structure or Flesh?
- Lifespan / flee: which track's foundation (highest vs weighted)?
- Do enemies get explicit guard numbers per def, or derived from a `path` / `kind` tag + realm?
- Where does Will's "heart" component live long-term — foundation, soul maturity, or a Dao Heart meter?
- HP for a pure spirit cultivator with zero vessel investment: floor value?

## Implementation crumbs

- `combat.js` — `getPlayerOffensivePower`, `estimateBasicAttackDamage`, `applyDamageToPlayer` (~line 1876 shield block), `combatEndOfTurnRegen`, `getCombatFleeChance` — all branch on `G.path`
- `data.js` — `COMBAT_PATH_CONFIG` (`maxResource` / `regen` read `foundation`), enemy defs, technique tags (`costType`, `spiritDamage`, `school`)
- `soul-mass.js` — `applySoulDamageMitigation`, `applySpiritDamageToEnemy`, `isEnemyInteriorWeak` (proto soul guard)
- `body-chamber.js` — `getBodyChamberEffectiveVitality` (proto vessel meter)
- `cultivation-tracks.js` — per-track `consolidation` (shape for per-track foundation)
- `main.js:589`, `core.js:1143` — `maxHp` from path base
