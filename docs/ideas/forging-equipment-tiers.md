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
| **Attunement** (soft) | **Martial stats** scale with realm gap | Core Formation wielding a Nascent Soul blade — still a real sword, somewhat muted |
| **Power requirement** (hard) | **Dao interface** off — no channeling, no inscribed techniques | Dao Seeker’s blade without dao — you’re **just swinging** priceless metal |

Low–mid tier gear is mostly **martial only**. High tier adds a **dao layer** (techniques, inscriptions, elemental channels) on top of the metal.

### Three layers on a weapon (owner lock 2026-07-23)

```text
┌─────────────────────────────────────────┐
│  Dao layer — techniques, inscriptions   │  ← power-gated (dao, FI, realm claim)
├─────────────────────────────────────────┤
│  Martial layer — damage, pen, durability │  ← tier + grade + attunement
├─────────────────────────────────────────┤
│  Material tier — T7 steel is T7 steel    │  ← why a dao blade beats a GC blade bare
└─────────────────────────────────────────┘
```

**Key owner beat:** A tier-7 dao blade is forged from **priceless tier-7 materials**. Without dao power you do **not** get dao attacks — you cannot run your dao through the channels — but you are **not** holding a tier-3 sword. You are swinging **tier-7 metal** with basic attacks only. It should still **outperform a Golden Core-era blade** on martial stats; you simply lack the scary part.

| Mode | What you get | What you don’t |
|------|----------------|----------------|
| **Martial only** (under dao power) | Tier-7 physical weapon quality; normal swings / weapon skills | Dao techniques, inscription procs, “run dao through the blade” attacks |
| **Full interface** (power met) | Martial + dao layer | — |

**Not OP at QC:** extreme attunement on martial layer + zero dao layer means you’re still a kid waving something you can barely lift — bragging rights, not a raid weapon. The balance is **material tier vs attunement** for martial, **power gate** for dao — not “dao blade becomes trash metal.”

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

| Item profile | Martial layer (always if equipped) | Dao layer (power required) |
|--------------|-------------------------------------|----------------------------|
| **Plain forged** (early tiers) | Full martial (attunement if under-tier) | — |
| **Inscribed** (mid tiers) | Full martial (attunement if under-tier) | Inscription procs, elemental channels |
| **Dao-bound** (high tiers, e.g. tier 7+) | **Tier material stats** — still beats lower-tier weapons | Dao techniques, law resonance, “run dao through blade” attacks |

**Owner example:** **Nascent Soul** blade on Core Formation — martial works, attunement applies. **Dao Seeker’s blade** without dao comprehension — **still a tier-7 weapon** when you swing it; you just cannot invoke its dao attacks. Compare to your old Golden Core blade: the dao blade wins the arm-wrestle, loses the fireworks until you grow.

### Data shape (draft)

```javascript
// On gear def or instance
martialStats: { dmgPct, … },           // tier + grade + attunement

powerRequirements: {                   // dao LAYER only — martial unaffected
  minRealmIdx: 6,                      // optional; some inscriptions need realm
  daoBranch: 'phase_fire',             // run fire dao through the blade
  formationInsight: 40,
  claim: 'law_wear'
},
daoTechniques: ['flaming_sever', …],   // unavailable when power unmet
inscriptions: [{ id: 'crimson_furnace', … }]
```

**Combat/UI:**

- Martial: normal attack button uses weapon martial stats.
- Dao: technique slots / inscribed attacks greyed — *“Dao channels sealed — swing as a mundane blade.”*
- Appraisal reveals what dao layer **would** add.

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

## Terminology (don’t mix these up)

| Term | What it is | Example |
|------|------------|---------|
| **Gear tier** | Which cultivation realm the item is for | Tier 7 dao-seeking blade |
| **Gear grade** | Quality within that tier | 上品 Superior |
| **Smith rank** | Your craft level **and** your public title | Apprentice → Forge Saint |

**Owner lean (2026-07-23):** **No separate reputation track.** Alchemy uses skill + rep because pills are consumable and the market is abstract. Forging — your **rank is on the work**. A 神匠’s signature on steel speaks for itself; grinding a second “fame” bar is redundant.

## Smith ranks — 7 levels (skill = standing)

One XP track (`forge.skillXp`). Rank is both **what you can make** and **what buyers pay**. Expand from today’s 4 ranks toward **7** as gear tiers grow.

| # | English | Hanzi | Skill XP (draft) | Sell mult | Unlocks |
|---|---------|-------|------------------|-----------|---------|
| 1 | **Apprentice** | 学徒 | 0 | 0.80× | Tier 1 recipes; pawn / scrap sales |
| 2 | **Journeyman** | 行匠 | 12 | 0.90× | Tier 2 |
| 3 | **Artisan** | 匠师 | 35 | 1.00× | Tier 3; market sales |
| 4 | **Master Smith** | 炉火大师 | 80 | 1.15× | Tier 4 / legendary |
| 5 | **Renowned Smith** | 名匠 | 160 | 1.30× | Tier 5–6 recipes |
| 6 | **Divine Smith** | 神匠 | 300 | 1.45× | Tier 7–8; high commissions |
| 7 | **Forge Saint** | 铸圣 | 500 | 1.60× | Tier 9 frameworks; peak guild charter |

Log on rank-up: *“🔨 The trade whispers your name — you are now a 名匠 (Renowned Smith).”*

### Skill XP sources

| Source | Skill XP | Notes |
|--------|----------|-------|
| **Successful forge** | +2 base · +tier bonus | Main grind |
| **Supreme-grade (极品) craft** | +5 bonus | Rewards peak rolls |
| **Sell forged gear** | small drip `+1 per tier` | Work circulating teaches market sense — optional, tune low |
| **Commission complete** | hand-tuned lump | Later |
| **Guild exam pass** | lump | Later — formal promotion |

**No `forge.reputationXp`.** Buyers read your **rank title** on the sale UI: *“Sold to market as work of a 匠师 (Artisan).”*

### Sell UI (profession loop — no rep)

- Forge Chamber **Sell** panel (mirror alchemy layout)
- Price = `baseMarket(tier, slot) × gradeMult × affixMult × **skillRank.sellMult** × supplyFactor`
- Optional `forge.gearSupply` decay — flooding one item type soft-lowers price
- Low ranks: pawn/scrap only until **Artisan (匠师)** unlocks proper market — gates early spam without a rep grind

### Perks by rank (same track)

| Rank | Perk |
|------|------|
| Apprentice | Craft + pawn sales |
| Artisan | Full market access |
| Master Smith | Legendary recipes; tier-4 commissions |
| Renowned Smith | Commission board (mid tier) |
| Divine Smith | Longcheng consign; appraise inscriptions |
| Forge Saint | Peak commissions; chronicle callouts |

Guild exams ([`creation-path-guilds.md`](creation-path-guilds.md)) gate **charter upgrades** by **smith rank + cultivation**, not a second XP bar.

## Smith progression (summary)

**One ladder:** forge more → rank up → better recipes, grade rolls, and sell prices. Your level *is* your name.

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
| **E** | **Sell panel** + expand smith ranks to 7 | Prices scale with rank — no rep track |
| **F** | Appraisal for inscriptions; hybrid loot tables | |
| **G** | Expand tiers 5–9; path specials; guild exams | Nine-realm migration |

## Prerequisites

- [x] Owner direction: 9 tiers, 4 grades, tier beats grade
- [x] Grade labels locked — **下品 / 中品 / 上品 / 极品**
- [x] Under-tier — **attunement** on base stats
- [x] Dao-bound gear — **martial layer always material-tier**; dao layer power-gated (“just swinging”)
- [x] Crafting — tier ceiling (+1 early, stricter late) + power requirements
- [x] **No separate reputation** — smith rank = public standing; sell mult on rank
- [x] Appraisal — later; reveals **inscriptions/formations**, not affix discovery
- [ ] Body/soul special creation path (not mirrored qi gear)
- [ ] Attunement constants tune pass
- [ ] Nine-realm migration plan

## Open questions

- [ ] Early-realm +2 craft overreach — QC only, or never?
- [ ] Martial attunement curve vs material-tier floor — tune so T7 martial > T3 supreme when gap is small, still punishing at QC+T7
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
