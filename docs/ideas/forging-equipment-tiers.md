# Forging — equipment tiers & grades

| Field | Value |
|-------|-------|
| **Status** | `designed` (brainstorm — owner direction 2026-07-23) |
| **Blocked on** | Nine-realm ladder in code (7 → 9); forging profession loop (guild, economy) |
| **Issue** | none yet |
| **Chat / PR** | Forge profession chat 2026-07-23; gating shipped [PR #70](https://github.com/WanderingImmortal/tales-immortal-path/pull/70) |
| **Updated** | 2026-07-23 (owner lock — grades, attunement + power gates, inscriptions) |

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

**Wearing gear uses two different gates** (owner lock 2026-07-23):

| Gate type | What it does | Example |
|-----------|--------------|---------|
| **Attunement** (soft) | Base stats scale with realm gap | Nascent Soul sword on a Core Formation cultivator — works, but weak |
| **Power requirement** (hard) | Special functions **do not activate** without the right cultivation power | Dao Seeker’s blade — equips, but is inert (or crude metal only) until you have dao-seeking-level comprehension |

Low–mid tier gear is mostly **attunement-only**. High tier increasingly adds **inscriptions, formations, dao channels** that need matching realm powers.

## Grades within a tier

### Grade names — **locked** (owner 2026-07-23)

Classic **pin** (品) ladder — four grades per tier. UI shows English + optional hanzi in tooltips.

| Idx | English UI | Hanzi | Pin reading | Fantasy |
|-----|------------|-------|-------------|---------|
| 1 | **Inferior** | 下品 | xià pǐn | Slag-heavy, thin channels; guild rejects or sells cheap |
| 2 | **Common** | 中品 | zhōng pǐn | Acceptable work; most merchant stock |
| 3 | **Superior** | 上品 | shàng pǐn | Clean qi flow; skilled smith output |
| 4 | **Supreme** | 极品 | jí pǐn | Masterwork; exam proofs, commissions, chase crafts |

**Why this set:** Matches what xianxia readers expect (“a superior-grade spirit sword”), avoids confusion with **tier** (realm band) vs **pill tiers** in alchemy (mortal/earth/heaven are different axis). Optional log flavor: *“You forged a superior-grade frostbite saber.”*

**Not using for mortal gear (reserved):** 灵品 / 仙品 / 神品 — save for immortal-layer or named frameworks later.

| Grade | Label | Fantasy |
|-------|-------|---------|
| 1 | **Inferior** *(下品)* | Barely qualifies; slag inclusions, thin qi channel |
| 2 | **Common** *(中品)* | Guild-acceptable work; what most NPC smiths sell |
| 3 | **Superior** *(上品)* | Skilled smith; clean channels, stable affixes |
| 4 | **Supreme** *(极品)* | Masterwork for that realm; rare commissions, exam proofs |

### Owner lean (2026-07-23) — superseded labels

~~Four grades table duplicated here — see locked names above.~~

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

## Under-tier gear — attunement (soft gate)

**Equip freely; base stats scale with cultivation.** No hard block on wearing a higher-tier **stat stick**, but **effective base stats** drop when you’re below the item’s tier.

### How you’d even have over-tier gear at QC

Rare but legitimate — not a daily power spike:

| Source | Example |
|--------|---------|
| **Inheritance / quest** | Sect elder’s sealed blade; heirloom with dormant power |
| **Loot from a kill** | You stumbled into a fight above your weight; the corpse had tier-6 gear |
| **Gift / debt** | NPC gives you something you “grow into” |
| **Theft / vault** | Story beat; item may carry karma or sect heat |
| **Merchant** | Sells it; expensive; you buy before you can use it (investment) |
| **Crafted by hire** | You paid a master smith; **you** still attune slowly |

So the fantasy is *“I hold a treasure I’m not ready for”* — not *“QC one-shots the map.”*

### Attunement formula (draft)

```text
gap = gearTier - 1 - playerRealmIdx   // 0 = in-band, 1 = one realm early, etc.

if gap <= 0:
  effectiveMult = 1.0                 // full power at or above tier
else:
  effectiveMult = max(0.15, 1 - gap * 0.22)   // tune constants
```

Example at **QC (realm 0)** with **tier 8** gear (`gap = 7`):

- `effectiveMult ≈ max(0.15, 1 - 1.54) → 0.15` → **15% of listed stats**
- Affixes scale the same (or only first affix applies — TBD)
- Optional **strain**: +qi/stamina cost per combat turn while `gap >= 2` (flavor: meridians burn)

At **Foundation (realm 1)** with **tier 3** gear (`gap = 1`): ~**78%** — feels like “almost there,” rewarding early find.

At **Foundation (realm 1)** with **tier 3** gear (`gap = 1`): ~**78%** — feels like “almost there,” rewarding early find.

### UI copy (attunement)

- Tooltip: *“Superior-grade · Tier 4 — **78% attuned** (Nascent Soul for full base stats)”*
- Log on equip: *“The blade hums in your grip. Your qi cannot fill its channels yet.”*

## Power gates — when gear “doesn’t function” (hard gate)

Separate from attunement. Some pieces carry **inscriptions, embedded formations, or dao channels** that only wake up when you have the matching **realm power**.

| Item profile | Below power | At / above power |
|--------------|-------------|------------------|
| **Plain forged** (early tiers) | Attunement only | Full base stats |
| **Inscribed** (mid tiers) | Base stats (attuned); **inscription dormant** | Inscription active (+element, proc, etc.) |
| **Dao-bound** (high tiers, e.g. tier 7+) | Equips; behaves like **dull metal** or minimal stat stick | Full weapon identity — techniques, law resonance, formation deploy |

**Owner example:** A **Nascent Soul** weapon — equipable earlier with attunement penalty; still “a sword.” A **Dao Seeker’s blade** — without dao-seeking-level power it **does not function** as that weapon (no dao techniques, inscription dead). Not OP at QC because the scary part is gated, not just scaled down.

### Data shape (draft)

```javascript
// On gear def or instance
powerRequirements: {
  minRealmIdx: 6,           // Dao Seeking (tier 7 gear)
  // optional extras — any unmet = dormant special effects
  daoBranch: 'phase_fire',  // needs fire-phase dao comprehension
  formationInsight: 40,     // needs FI to activate inscribed formation
  claim: 'law_wear'         // needs realm claim from realm-claims doc
}
```

**Combat/UI:** dormant inscriptions show as *“Sealed inscription (Dao Seeking required)”* — appraisal reveals what they *would* do.

## Crafting gates (owner lock 2026-07-23)

**Cannot craft far above your realm.** Two checks:

### 1. Tier ceiling (soft overreach)

| Your realm band | Max craft tier above your tier |
|-----------------|--------------------------------|
| Early (QC–FE, idx 0–1) | **+1** tier (maybe **+2** at QC only — tune) |
| Mid (Core–NS, idx 2–3) | **+1** tier |
| Late (Void+, idx 4+) | **+0** — craft at or below your tier only |

Smith skill raises **quality** (grade roll) and **recipe access**, not “skip three realms.”

### 2. Power requirement (hard)

Same `powerRequirements` as wear. You might **know** the recipe but cannot complete the forge until you have the power (dao fragment, formation rank, tribulation pass, etc.). UI: *“You lack the dao resonance to stabilize this inscription.”*

**Lean:** crafting gate ≥ wearing gate — if you can’t activate it, you probably can’t forge it. Exception: **commission** — NPC master forges for you; you still can’t wield the result until ready.

## Inscriptions & appraisal (later phase)

**Affixes** = rolled stat bonuses (sharp, flowing, etc.) — visible on inspect once identified.

**Inscriptions / embedded formations** = designed effects (fire damage channel, ward proc, spirit step charge) — the cool high-tier identity. Often **hidden until appraised**.

### Appraisal (owner lean)

- **Not** primarily “reveal affixes” — base affixes can stay visible or semi-visible.
- **Is** “discover what this sword *does*” — read inscriptions, formation nodes, dao coupling.
- Services: forge, Forgers Guild, senior appraiser NPC; smith skill perk later.
- Pre-appraisal copy: *“Spirit steel longsword (unread)”* → post: *“Superior-grade · Tier 6 · **Inscription: Crimson Furnace** (+fire damage, ignite on crit)”*

Ties to [`formations-and-arrays.md`](formations-and-arrays.md) equipment-formation mode (charges, wear) without combat-time inscription.

## Item families (path flavor — owner lean 2026-07-23)

**Qi path** — full traditional gear loop (weapons, armor, jewelry). Forging is a core profession.

**Body / soul paths** — don’t lean on external gear the same way. **Something special** instead of mirroring qi slot soup (TBD — park here):

| Path | Lean | Draft “special” direction |
|------|------|---------------------------|
| **Body** | Flesh is the armor | **Tempering auxiliaries** — girdles, bone pins, meridian plates that **buff body cultivation** or combat stances, not primary stat sticks. Fewer slots; higher tier = unlock body techniques, not +500 HP from chestplate |
| **Soul** | Mind/spirit is the weapon | **Focus treasures** — bound to soul space; meditation amps, ward charges, soul avatar skins. May use **charges** like formation gear, not permanent stat armor |

Qi crafters forge **gear**. Body/soul may use **different creation verbs** (temper / bind / inscribe) and different hubs — still under “creation path” family but not copy-paste forge recipes.

**Open:** whether body/soul items share tier+grade math or a parallel “refinement stage” ladder.

## Found loot — tier & grade (elaboration)

Found loot should use the **same tier + grade system** as crafted gear so players learn one language. Sources differ in **how much info you get up front**.

### Three drop patterns (hybrid lean)

| Drop type | Tier | Grade | When |
|-----------|------|-------|------|
| **Trash / mob** | Rolled from zone + enemy tier | **Fixed Common (中品)** | 95% of drops — simple tables |
| **Elite / chest / boss** | Rolled | **Full grade roll** (weighted toward Inferior–Superior) | Exciting without every goblin dropping Supreme |
| **Ancient / legendary find** | Fixed by hand | Often **degraded** (high tier + Inferior grade) *or* Supreme + unique affix | *“Nascent Soul blade, but the channels are cracked.”* |

### Why not “tier only” everywhere?

- **Pros of tier-only:** simpler loot tables, less data on every corpse.
- **Cons:** forge profession feels pointless on loot — “why smith when dungeons drop the same thing?”
- **Hybrid fix:** mobs drop **predictable Common**; **grade variance** is the smith’s value (reliably hit Superior/Supreme) and boss chase drops.

### Unidentified loot & appraisal (later)

- Pick up: *“Heavy iron blade (unread)”*
- **Appraise** → tier, grade, and **inscriptions / formation effects** (not just affix list)
- Affixes may stay visible or partial; **inscriptions** are the appraisal payoff

### Merchant stock

**Lean:** NPC gear is always **Common grade** at listed tier — Superior costs more from named smiths later (commission system).

### Attunement + power gates on found loot

- **Attunement** applies to base stats on any drop.
- **Power-gated inscriptions** stay dormant until you qualify — finding a dao blade early is a long-term quest, not a power spike.
- Hybrid loot pool **confirmed** (mobs Common; elites/bosses roll grade).

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
| **A** ✅ shipped | Skill + realm recipe gates on 4 tiers | [PR #70](https://github.com/WanderingImmortal/tales-immortal-path/pull/70) |
| **B** | Add `grade` (下中上极品) to instances + stat scaling + UI | |
| **C** | Attunement mult on equip; grade roll on forge | |
| **D** | `powerRequirements` + dormant inscriptions | Dao Seeker blade pattern |
| **E** | Appraisal for inscriptions; hybrid loot tables | |
| **F** | Expand tiers 5–9; path specials; guild exams | Nine-realm migration |

## Prerequisites

- [x] Owner direction: 9 tiers, 4 grades, tier beats grade
- [x] Grade labels locked — **下品 / 中品 / 上品 / 极品**
- [x] Under-tier — **attunement** on base stats
- [x] High-tier — **power gates** (dao / realm / formation); item can equip but not **function**
- [x] Crafting — tier ceiling (+1 early, stricter late) + power requirements
- [x] Found loot — hybrid pool confirmed
- [x] Appraisal — later; reveals **inscriptions/formations**, not affix discovery
- [ ] Body/soul special creation path (not mirrored qi gear)
- [ ] Attunement constants tune pass
- [ ] Nine-realm migration plan

## Open questions

- [ ] Early-realm +2 craft overreach — QC only, or never?
- [ ] Dormant dao blade: zero special effects, or crude stat stick from attunement?
- [ ] Inscription pool per tier — hand-authored vs procedural?
- [ ] Body/soul: shared tier index with different item types, or separate refinement ladder?
- [ ] Body/soul parallel realm names at idx 4 and 7 when nine-realm ships

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
