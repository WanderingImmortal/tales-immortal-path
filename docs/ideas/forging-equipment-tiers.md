# Forging — equipment tiers & grades

| Field | Value |
|-------|-------|
| **Status** | `designed` (brainstorm — owner direction 2026-07-23) |
| **Blocked on** | Nine-realm ladder in code (7 → 9); forging profession loop (guild, economy) |
| **Issue** | none yet |
| **Chat / PR** | Forge profession chat 2026-07-23; interim gating [PR #70](https://github.com/WanderingImmortal/tales-immortal-path/pull/70) |
| **Updated** | 2026-07-23 |

## Intent

Forged gear should read like **cultivation gear**: one **tier** per mortal realm (9 tiers when the realm ladder ships), and **grades** for how good a piece is *within* that tier.

**Hard rule:** tier always wins over grade. Tier 2 low grade is still stronger than tier 1 peak grade. Grade is polish inside a realm band, not a shortcut past the next realm.

This doc is the north star for forging content and stats. [PR #70](https://github.com/WanderingImmortal/tales-immortal-path/pull/70) is a small interim step (4 tiers, skill + realm gates on today’s 7-realm ladder).

## Two axes (plain language)

| Axis | What it means | Player question |
|------|----------------|-----------------|
| **Tier** (1–9) | Which **realm** this gear is made for | “Am I far enough in cultivation to wear / benefit from this?” |
| **Grade** (low → peak) | How **well** it was forged inside that tier | “Is this a slap-dash piece or a masterwork?” |

```text
Power ──────────────────────────────────────────────►

  T1 Low ── T1 Std ── T1 Fine ── T1 Peak ── T2 Low ── … ── T9 Peak
  └──────── tier 1 band ────────┘ └─ tier 2 ─┘
```

## Tier ↔ realm (target: 9 realms)

Gear tier **N** is keyed to cultivation **realm index N − 1** (0-based). Same index on qi, body, and soul paths — different **names**, same gate.

| Tier | Qi path (target 9-realm ladder) | Body path | Soul path |
|------|----------------------------------|-----------|-----------|
| 1 | Qi Condensation | Bronze Skin | Awakened Spirit |
| 2 | Foundation Establishment | Iron Bones | Manifestation |
| 3 | Core Formation | Jade Marrow | Spirit Confluence |
| 4 | Nascent Soul | Diamond Body | Soul Integration |
| 5 | Deity Transformation *(new)* | *(parallel name TBD)* | *(parallel name TBD)* |
| 6 | Void Refinement | Sage Flesh | Transcendence |
| 7 | Dao Seeking | War God Physique | Dao Heart |
| 8 | Dao Manifestation *(new)* | *(parallel name TBD)* | *(parallel name TBD)* |
| 9 | Immortal Ascension | Indestructible Vajra | Eternal Spirit |

Until the nine-realm migration lands ([`nine-realm-ladder.md`](nine-realm-ladder.md)), **ship content against the live ladder** and extend when indices shift.

**Wearing / crafting gate:** you need **realm index ≥ tier − 1** on your path. Optional: soft penalty if under-tier (stats scaled down) vs hard block — **lean hard block for crafted gear**, soft for found junk.

## Grades within a tier

### Owner lean (2026-07-23)

Four grades per tier — easy to read in UI, enough spread for forge skill to matter:

| Grade | Label | Fantasy |
|-------|-------|---------|
| 1 | **Low** | Barely qualifies; slag inclusions, thin qi channel |
| 2 | **Standard** | Guild-acceptable work; what most NPC smiths sell |
| 3 | **Fine** | Skilled smith; clean channels, stable affixes |
| 4 | **Peak** | Masterwork for that realm; rare commissions, exam proofs |

**Tier boundary rule (non-negotiable):**

```text
minStats(tier T, grade Peak)  <  minStats(tier T+1, grade Low)
```

Use separate stat curves per slot if needed, but never violate the rule on primary combat stats (damage, defense, HP, qi pool).

### What grade affects

| Knob | Tier sets… | Grade sets… |
|------|------------|-------------|
| Base stats | Floor / ceiling band | Position inside band |
| Affix count / quality | Max affix slots at tier | Roll weights toward better affixes |
| Durability | Base durability band | Bonus % inside band |
| Sell price | Market tier | Multiplier inside tier |
| Forge difficulty | Material tier, time | Success rate, grade roll on success |

**Affixes** stay — they’re the “personality” on top of tier + grade. Peak grade + lucky affix = chase item; low grade + great affix still loses to next tier low on raw stats.

### How grade is decided at forge time

On successful craft:

1. Roll **target grade** from smith skill, anvil, materials quality, optional sect bonuses.
2. Apply stats from `tier + grade` table.
3. Roll affixes within tier limits (current `GEAR_AFFIX_ROLL` pattern, extended).

Failure modes (later PRs): **flawed** outcome one grade down; **masterwork** crit one grade up (capped at Peak).

## Item families (path flavor — TBD)

All tiers share the **same tier index gate**. Path-specific **lines** are optional recipe families, not different tier math:

| Line | Lean | Example slots |
|------|------|----------------|
| **Qi** | Blades, robes, qi jewelry | weapon, chest, amulet, ring |
| **Body** | Plates, girdles, tempered guards | chest, helm, boots, belt |
| **Soul** | Cowls, prayer beads, focus artifacts | helm, amulet, ring |

A body cultivator can still wear a qi-tier-3 sword; it just won’t resonate as hard. Path lines are **craft specialization**, not a second tier ladder.

**Open:** one shared recipe per slot per tier vs three path variants per tier (3× content cost).

## Smith progression (how it maps)

Separate from gear tier — **forge skill** is the profession rank:

| Smith rank | Unlocks |
|------------|---------|
| Apprentice | Tier 1 recipes; mostly Low–Standard rolls |
| Journeyman | Tier 2 recipes; Fine possible |
| Artisan | Tier 3 recipes; reliable Fine |
| Master | Tier 4+ recipes in current build; at full 9-tier design, masters work **up to tier 6–7** with guild exam |
| Grand Smith *(future)* | High tiers, peak rolls, legendary frameworks |

Guild exams ([`creation-path-guilds.md`](creation-path-guilds.md)) later raise the **ceiling** of what you can *attempt*, not your cultivation tier gate.

## Content scope (9 tiers × 4 grades)

Don’t hand-author 36 variants per slot. **Data-driven:**

- One **base template** per `(slot, tier, pathLine?)` recipe.
- `grade` multipliers on a small stat table.
- Instance stores `{ defId, tier, grade, affixes[], … }`.

**MVP content target per tier (later):** 1 weapon, 1 chest, 1 accessory minimum = ~27 base recipes at 9 tiers before path splits.

Today’s game has **4 tiers, ~9 recipes, no grade field** — migrate toward this schema incrementally.

## Phased build (suggested)

| Phase | What | Notes |
|-------|------|-------|
| **A** ✅ (in flight) | Skill + realm recipe gates on 4 tiers | [PR #70](https://github.com/WanderingImmortal/tales-immortal-path/pull/70) |
| **B** | Add `grade` to gear instances + stat scaling + UI label | No new tiers yet |
| **C** | Grade roll on forge success; smith skill shifts roll table | Makes profession feel tangible |
| **D** | Expand to tiers 5–9 as realms land | Blocked on nine-realm migration |
| **E** | Path lines (qi / body / soul), blueprints, guild exams | [`creation-path-guilds.md`](creation-path-guilds.md) |

## Prerequisites

- [x] Owner direction: 9 tiers, 4 grades, tier beats grade ([`nine-realm-ladder.md`](nine-realm-ladder.md) alignment)
- [ ] Confirm grade labels (Low / Standard / Fine / Peak vs 下品-style)
- [ ] Confirm path lines: shared recipes vs per-path variants
- [ ] Stat formula for `minStats(T, Peak) < minStats(T+1, Low)`
- [ ] Nine-realm migration plan (or interim: tiers 5–9 dormant until realms exist)

## Open questions

- Hard-block under-tier gear, or wear with reduced stats?
- Does **found** loot use the same tier + grade, or simplified “tier only” for drops?
- Merchant gear: fixed Standard grade only?
- Legendary / named gear: separate **framework** tier, or Peak + unique affix set?
- Body/soul parallel realm names at idx 4 and 7 when nine-realm ships

## Implementation crumbs

- Gear instances: `gear.js` — add `grade`; scale stats in `getGearInstanceStats` (or equivalent)
- Recipes: `GEAR_CRAFT_RECIPES`, `GEAR_ITEMS` in `data.js`
- Forge gates: `crafting.js`, `forge-data.js` (`FORGE_TIER_REALM_INDEX` → extend to 9)
- UI: `forge-chamber.js` — show tier, grade roll preview, realm name
- Realm ladder: `PATHS.*.realms`, `nine-realm-ladder.md` migration checklist

## Links

- [`creation-path-guilds.md`](creation-path-guilds.md) — Forgers Guild, exams, commissions
- [`nine-realm-ladder.md`](nine-realm-ladder.md) — 7 → 9 realm indices
- [`imperial-city-tianjing.md`](imperial-city-tianjing.md) — Forgers Guild branch
