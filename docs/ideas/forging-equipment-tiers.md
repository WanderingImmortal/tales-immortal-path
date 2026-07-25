# Forging — equipment tiers & grades

| Field | Value |
|-------|-------|
| **Status** | `designed` (brainstorm — owner direction 2026-07-23) |
| **Blocked on** | Nine-realm ladder in code (7 → 9); forging profession loop (guild, economy) |
| **Issue** | none yet |
| **Chat / PR** | Forge profession chat 2026-07-23; gating shipped [PR #70](https://github.com/WanderingImmortal/tales-immortal-path/pull/70) |
| **Updated** | 2026-07-23 (Phases B–H designed; quench + furnace lock; A shipped) |

## Intent

Forged gear should read like **cultivation gear**: one **tier** per mortal realm (9 tiers when the realm ladder ships), and **grades** for how good a piece is *within* that tier.

**Hard rule:** tier always wins over grade. Tier 2 low grade is still stronger than tier 1 peak grade. Grade is polish inside a realm band, not a shortcut past the next realm.

This doc is the north star for forging content and stats. [PR #70](https://github.com/WanderingImmortal/tales-immortal-path/pull/70) is a small interim step (4 tiers, skill + realm gates on today’s 7-realm ladder).

## Player-facing language (owner lock 2026-07-23)

**English is always primary.** Hanzi stays for xianxia flavor but is **secondary** — you and friends who play don’t read Chinese, and the UI should not require it.

| Surface | Rule | Example |
|---------|------|---------|
| Chips, buttons, list rows, status line | **English only** | chip: `Superior` · rank: `Dao Smith` |
| Tooltips, inspect, recipe detail | English + hanzi in **brackets** | `Superior (上品)` · `Dao Smith (求道匠)` |
| Game log | English + hanzi in **brackets** | `Forged Superior (上品) frostbite saber!` |
| Data / code | Keep `hanzi` on defs | `GEAR_GRADES.superior.hanzi` — format via helpers, never show hanzi alone in UI |

**Formatting helpers** (ship with Phase B / E):

| Helper | Returns |
|--------|---------|
| `formatGearGradeLabel(inst, 'chip')` | `"Superior"` |
| `formatGearGradeLabel(inst, 'full')` | `"Superior (上品)"` |
| `formatForgeSkillLabel(skill)` | `"Dao Smith (求道匠)"` |
| `formatInscriptionLabel(insc)` | `"Crimson Furnace (赤炉纹)"` |

**Avoid:** leading with hanzi (`上品 Superior`), chips that are hanzi-only (`上品`), compact odds without English (`下 22%`).

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

Classic **pin** (品) ladder — four grades per tier. Player UI: **English primary**; hanzi in brackets on tooltips and logs (see [Player-facing language](#player-facing-language-owner-lock-2026-07-23)).

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
| **Trash / mob** | Rolled from zone + enemy tier | **Fixed Common** *(中品 in data)* | 95% of drops — simple tables |
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
| **Gear grade** | Quality within that tier | Superior (上品) |
| **Smith rank** | Your craft level **and** your public title | Apprentice → Forge Saint |

**Owner lean (2026-07-23):** **No separate reputation track.** Alchemy uses skill + rep because pills are consumable and the market is abstract. Forging — your **rank is on the work**. A 神匠’s signature on steel speaks for itself; grinding a second “fame” bar is redundant.

## Smith ranks — **9 levels** (1 per gear tier / realm)

**Owner lock (2026-07-23):** **9 smith ranks for 9 realms** — same index as gear tier and cultivation realm. Rank N unlocks tier N recipes (plus grade/sell scaling). No separate reputation track.

One XP track (`forge.skillXp`). Your rank **is** your public title.

| Rank | Gear tier | Qi realm (idx) | Smith title (EN) | Hanzi | Sell mult (draft) |
|------|-----------|----------------|------------------|-------|-------------------|
| 1 | 1 | Qi Condensation (0) | **Apprentice Smith** | 学徒 | 0.78× |
| 2 | 2 | Foundation Establishment (1) | **Journeyman** | 行匠 | 0.86× |
| 3 | 3 | Core Formation (2) | **Artisan** | 匠师 | 0.94× |
| 4 | 4 | Nascent Soul (3) | **Master Smith** | 炉火大师 | 1.04× |
| 5 | 5 | Deity Transformation (4) | **Spirit Smith** | 化神匠 | 1.14× |
| 6 | 6 | Void Refinement (5) | **Void Smith** | 虚空匠 | 1.24× |
| 7 | 7 | Dao Seeking (6) | **Dao Smith** | 求道匠 | 1.36× |
| 8 | 8 | Dao Manifestation (7) | **Law Smith** | 显道匠 | 1.48× |
| 9 | 9 | Immortal Ascension (8) | **Forge Saint** | 铸圣 | 1.62× |

**Rule:** `smithRank === gearTier` for recipe unlock (same as today’s skill→tier gating, expanded to 9). Cultivation realm still gates **craft/wear** per attunement + power rules.

Skill XP thresholds (draft — tune in playtest):

`0 · 10 · 28 · 55 · 95 · 150 · 225 · 320 · 450`

Today’s code has 4 ranks — migrate IDs: keep `apprentice` / `journeyman` / `artisan` / `master`, add `spirit_smith` … `forge_saint` when tiers 5–9 land.

Log on rank-up: *“🔨 Rank ascends — you are now a Dao Smith (求道匠), smith of the seventh tier.”*

### Skill XP sources

| Source | Skill XP | Notes |
|--------|----------|-------|
| **Successful forge** | +2 base · +tier bonus | Main grind |
| **Supreme-grade (极品) craft** | +5 bonus | Rewards peak rolls |
| **Sell forged gear** | small drip `+1 per tier` | Work circulating teaches market sense — optional, tune low |
| **Commission complete** | hand-tuned lump | Later |
| **Guild exam pass** | lump | Later — formal promotion |

**No `forge.reputationXp`.** Buyers read your **rank title** on the sale UI: *“Sold to market as work of an Artisan (匠师).”*

### Sell UI (profession loop — no rep)

- Forge Chamber **Sell** panel (mirror alchemy layout)
- Price = `baseMarket(tier, slot) × gradeMult × affixMult × **skillRank.sellMult** × supplyFactor`
- Optional `forge.gearSupply` decay — flooding one item type soft-lowers price
- Low ranks: pawn/scrap only until **Artisan (匠师)** unlocks proper market — gates early spam without a rep grind

### Perks by rank (milestones)

| Rank | Perk |
|------|------|
| 1 Apprentice | Craft tier 1; pawn / scrap sales |
| 3 Artisan | Full market sales |
| 4 Master Smith | Legendary / tier-4 line |
| 5 Spirit Smith | Inscription recipes |
| 7 Dao Smith | Dao-bound weapon commissions |
| 8 Law Smith | Longcheng consign; inscription appraisal |
| 9 Forge Saint | Peak guild charter; chronicle callouts |

Guild exams ([`creation-path-guilds.md`](creation-path-guilds.md)) gate **charter upgrades** by **smith rank + cultivation**, not a second XP bar.

## Smith progression (summary)

**One ladder, nine rungs:** forge tier N gear → climb to rank N → unlock tier N+1 recipes, better sell prices, guild trust. Mirrors the cultivation ladder without duplicating realm names on the player sheet.

## Content scope (9 tiers × 4 grades)

Don’t hand-author 36 variants per slot. **Data-driven:**

- One **base template** per `(slot, tier, pathLine?)` recipe.
- `grade` multipliers on a small stat table.
- Instance stores `{ defId, tier, grade, affixes[], … }`.

**MVP content target per tier (later):** 1 weapon, 1 chest, 1 accessory minimum = ~27 base recipes at 9 tiers before path splits.

Today’s game has **4 tiers, ~9 recipes, no grade field** — migrate toward this schema incrementally.

## Phase B — grades on gear (`designed` — not built)

**Status:** Ready to implement after planning pass. **Depends on:** nothing (first craft-quality slice after A).

**Goal:** Every gear **instance** has a **grade** (下品 → 极品). Grade changes **martial stats** and **durability**; shows in UI. **No grade roll on forge yet** (Phase C) — forged gear defaults to **中品 Common** until then.

**Out of scope for B:** attunement, dao layer, sell panel, loot grade rolls, smith rank expansion, inscription appraisal.

### Data (`forge-data.js` or `data.js`)

```javascript
const GEAR_GRADES = {
    inferior: { id: 'inferior', index: 1, name: 'Inferior', hanzi: '下品', statMult: 0.72, durMult: 0.88, sellMult: 0.60, color: '#8a8478' },
    common:   { id: 'common',   index: 2, name: 'Common',   hanzi: '中品', statMult: 1.00, durMult: 1.00, sellMult: 1.00, color: '#9a9a8a' },
    superior: { id: 'superior', index: 3, name: 'Superior', hanzi: '上品', statMult: 1.28, durMult: 1.10, sellMult: 1.40, color: '#6a9aba' },
    supreme:  { id: 'supreme',  index: 4, name: 'Supreme',  hanzi: '极品', statMult: 1.55, durMult: 1.18, sellMult: 1.85, color: '#c4a040' }
};
```

**Owner tune (2026-07-23):** wider spread so **上品 / 极品** are worth chasing — Common is the baseline; Inferior is noticeably weak; Supreme is a real prize.

| Grade | Stat vs Common | Feel |
|-------|----------------|------|
| 下品 | 0.72× (−28%) | Slag work — sell or reforge |
| 中品 | 1.00× | Guild standard |
| 上品 | 1.28× (+28%) | Skilled smith — clearly better |
| 极品 | 1.55× (+55%) | Chase craft / boss drop hype |

**Tier boundary check (example):** Rusty Qi Blade (T1, 6% dmg) at 极品 → 9.3% · Frostbite Saber (T2, 10% dmg) at 下品 → 7.2% — **fails** with current bases. **Phase B includes a tier base-stat pass:** bump T2+ `GEAR_ITEMS` stats so `minStats(T, supreme) < minStats(T+1, inferior)` on primary combat stats per slot. Owner OK to widen tier gaps (2026-07-23).

Helpers in `gear.js`:

| Function | Purpose |
|----------|---------|
| `getGearGradeDef(gradeId)` | Lookup; default `common` |
| `getGearGradeMult(inst)` | `statMult` for `sumInstanceStats` |
| `getGearGradeDurMult(inst)` | Applied when computing / creating `maxDurability` |
| `formatGearGradeLabel(inst, style)` | `'chip'` → `"Superior"` · `'full'` → `"Superior (上品)"` (logs, tooltips) |
| `getDefaultGearGrade(source)` | `common` for merchant/starter/migrate; hook for loot later |

**Tier boundary audit (ship with B):** after multipliers land, spot-check that `GEAR_ITEMS` base stats satisfy `minStats(T, supreme) < minStats(T+1, inferior)` on primary combat stats per slot. Adjust tier bases if a tier-1 极品 edges tier-2 下品.

### Instance shape

```javascript
// gear instance (add field)
{
  uid, defId, grade: 'common',  // NEW — id from GEAR_GRADES
  affixes: [], durability, maxDurability
}
```

- `createGearInstance(defId, { grade, … })` — default `grade: 'common'` if omitted.
- `maxDurability` = `floor(getGearMaxDurability(def) * gradeDurMult)` at creation (smith durability bonus in `applyForgeInstanceBonuses` stacks **after** grade base).

### Stat pipeline (single choke point)

In `sumInstanceStats(inst)`:

```text
effectiveStats = baseStats(def) × gradeMult × durabilityMult × (attunementMult later)
```

- Apply **grade mult** to `def.stats` and **affix stats** (affixes are part of the forged piece).
- **Resonance** (`def.resonance[path]`): **no grade mult** in B — resonance is path fit, not metal quality. Revisit if it feels wrong.

Sets (`getActiveGearSetBonuses`) unchanged — set bonuses are worn-piece count, not instance grade.

### Defaults by source (Phase B)

| Source | Grade assigned |
|--------|----------------|
| **Forge** (until Phase C) | `common` always |
| **Merchant buy** | `common` |
| **Starter gear** | `common` |
| **Legacy save migrate** | `common` on any instance missing `grade` |
| **Loot / explore** | `common` for now (hybrid table = Phase F) |

### Migration

On load (`ensureGearState` or `migrateGearGradesForExistingSave` called from `core.js`):

1. Every instance in `G.gearInstances` without `grade` → `'common'`.
2. Recompute `maxDurability` only if we stored max at creation without grade — **safer:** store grade at creation; for migrate, set grade + optionally scale current `durability`/`maxDurability` proportionally if max was pre-grade (or leave as-is for grandfathered items).

**Lean:** migrate sets `grade: 'common'` only; do **not** rescale existing durability numbers (avoids save surprises).

### Tier base-stat pass (ship with B)

Widen `GEAR_ITEMS` stats on **tier 2+** so grade spread (0.72–1.55×) never lets tier *N* 极品 beat tier *N+1* 下品 on primary stats (weapon `dmgPct`, armor `defenseBonus` / `maxHpBonus`, etc.). Tune per slot — weapons often need the biggest jump between T1→T2.

### UI surfaces

| Location | Change |
|----------|--------|
| **Inventory / travel kit** | Grade chip next to name — e.g. `<span class="gear-grade-chip grade-superior" title="Superior (上品)">Superior</span>` |
| **`formatInstanceName`** | Include grade when not Common: `"Superior Rusty Qi Blade (Sharp)"` |
| **Gear slot panel** | Grade on equipped row (English chip; full label in tooltip) |
| **Compare tooltip** | Grade-aware stat lines (already uses `sumInstanceStats`); header uses `formatGearGradeLabel(..., 'full')` |
| **Forge Chamber — recipe detail** | Show expected grade at craft: *"Grade: Common (中品) — grade rolls in smith mastery (later)"* |
| **Forge Chamber — recipe list** | Optional tier+grade hint on meta line |
| **Forge success log** | `"Forged Superior (上品) frostbite saber!"` when not common |
| **Merchant rows** | `"Common"` label on stock gear; tooltip `Common (中品)` |

CSS: `.gear-grade-chip` per grade color from `GEAR_GRADES.color`; **English in chip**, `title` or tooltip with hanzi in brackets.

### Files to touch

| File | Work |
|------|------|
| `forge-data.js` | `GEAR_GRADES` constants |
| `gear.js` | grade helpers, `createGearInstance`, `sumInstanceStats`, `formatInstanceName`, migrate |
| `crafting.js` | pass `grade: 'common'` on forge; log uses `formatGearGradeLabel` |
| `forge-chamber.js` | detail panel grade line |
| `ui.js` | inventory / equipment grade chips |
| `style.css` | grade chip styles |
| `core.js` | call `migrateGearGradesForExistingSave` on load |

**No changes** to combat formulas beyond `getGearBonuses()` picking up graded `sumInstanceStats`.

### Test plan (manual)

- [ ] New game: starter gear shows Common chip; tooltip `Common (中品)`; stats unchanged vs today (common = 1.0×).
- [ ] Dev/console: spawn instance with `grade: 'supreme'` — stats ~1.55×, UI shows Supreme chip + Supreme (极品) in tooltip.
- [ ] Equip / compare / forge / merchant buy — no errors; grade visible.
- [ ] Old save loads; missing grade → common; no stat cliff.
- [ ] Tier boundary spot-check: T1 supreme &lt; T2 inferior on weapon `dmgPct` (adjust bases if fail).

### Acceptance criteria

1. `grade` persisted on every gear instance.
2. Grade affects martial stats (and durability at creation) via one mult table.
3. Player can see grade in inventory, equipment, and forge detail.
4. Forged gear = Common until Phase C.
5. Recursion audits pass (`bash scripts/pre-pr-check.sh`).

### What Phase C adds (build in C, not B)

See **Phase C** below.

## Phase C — grade rolls + attunement (`designed` — not built)

**Status:** Planned. **Depends on:** Phase B (`grade` on instances + `sumInstanceStats` pipeline).

**Goal:** Forging **rolls 下品–极品** on success; wearing over-tier gear **scales martial stats** via attunement. Still **no** dao-layer power gates (Phase D), sell panel (E), or loot grade tables (F).

### Part 1 — Grade roll on forge

Replace Phase B’s “always Common” with a weighted roll at `createGearInstance` time.

**Inputs to roll:**

| Factor | Effect |
|--------|--------|
| **Smith rank** | Main weight shift — higher rank = fewer 下品, more 上品/极品 |
| **Anvil tier** | Small nudge toward higher grades |
| **Sect armory** | Optional +affix-style nudge (reuse `armoryForgeAffixPct` or dedicated `gradeBonus`) |
| **Recipe tier** | No change to weights — tier 4 is harder to *attempt*, not harsher grade table |

**Draft weights by smith rank** (4 ranks today; extend rows when ranks 5–9 land):

| Smith rank | 下品 | 中品 | 上品 | 极品 |
|------------|------|------|------|------|
| Apprentice | 38% | 48% | 13% | 1% |
| Journeyman | 22% | 50% | 24% | 4% |
| Artisan | 10% | 42% | 38% | 10% |
| Master | 4% | 32% | 46% | 18% |

+2% shift toward 上品 per anvil tier above iron (cap +6%). Roll once; map to `GEAR_GRADES` id.

**Functions (`crafting.js` / `forge-data.js`):**

- `getForgeGradeRollWeights()` — merge rank + anvil + sect
- `rollForgeGrade()` — returns grade id
- `craftGear` → `createGearInstance(defId, { grade: rollForgeGrade() })`

**UX:**

- Forge Chamber detail: *“Grade odds: Inferior 22% · Common 50% · Superior 24% · Supreme 4%”* (live from current bonuses; tooltip may show hanzi per grade)
- Success log: always show grade — *“Forged Superior (上品) frostbite saber!”*
- **Supreme:** extra log line + `grantForgeSkillXp(+5)` bonus (one-time per craft)

**Out of scope for C:** forge **failure** / forced 下品 on fail (legendary fail stays as today). Optional **masterwork crit** (+1 grade, cap 极品) = tune pass later.

### Part 2 — Attunement (martial layer only)

Apply when **equipped** stats are computed — not when item is created.

```text
gap = gearTier - 1 - G.realmIdx

attunementMult = gap <= 0 ? 1.0 : max(0.15, 1 - gap * 0.22)
effectiveMartial = baseStats × gradeMult × attunementMult × durabilityMult
```

- **Material-tier floor (owner lean):** attunement applies to the **grade-adjusted** stat bundle, but tier-7 metal still reads as tier-7 in tooltips; extreme gaps (QC + T8) land near the 15% floor. Tune `0.22` / `0.15` in playtest.
- **Affixes:** scale with attunement (same as base martial).
- **Resonance:** no attunement mult (unchanged from B).
- **Dao layer:** not in C — Phase D.

**Functions (`gear.js`):**

- `getGearTier(inst)` — from `GEAR_ITEMS[defId].tier`
- `getGearAttunementMult(inst)` — uses `G.realmIdx`
- Wire into `sumInstanceStats` after grade mult

**UX:**

- Equipped / inspect tooltip: *“Superior (上品) · Tier 4 — **78% attuned** (Nascent Soul for full power)”*
- First equip over-tier (once per item): log *“Your qi cannot fill its channels yet.”*
- Optional later: combat strain when `gap >= 2` — **not required for C acceptance**

### Files to touch

| File | Work |
|------|------|
| `forge-data.js` | `FORGE_GRADE_ROLL_BY_SKILL`, anvil nudge constants |
| `crafting.js` | `rollForgeGrade`, wire into `craftGear`, supreme XP bonus |
| `gear.js` | `getGearAttunementMult`, apply in `sumInstanceStats` |
| `forge-chamber.js` | grade odds display, attunement hint on detail if under-tier |
| `ui.js` | attunement % on equipped gear when `gap > 0` |

### Test plan

- [ ] Apprentice forge: mostly Inferior/Common; Master: visible Supreme streaks over many crafts
- [ ] Supreme craft grants bonus XP + distinct log
- [ ] Core Formation + T4 gear: 100% attunement; QC + T4: ~15% martial
- [ ] Compare/equip updates when `realmIdx` changes (breakthrough)
- [ ] Audits pass

### Acceptance criteria

1. Forged gear rolls grade from table; not hardcoded Common.
2. Attunement mult visible and applied to equipped martial stats.
3. Grade odds shown in Forge Chamber before craft.
4. No dao/inscription power gates yet.

## Phase D — power gates + dormant inscriptions (`designed` — not built)

**Status:** Planned. **Depends on:** Phase B (grades + stat pipeline), Phase C (attunement in `sumInstanceStats`).

**Goal:** High-tier gear can carry **inscriptions** and **dao channels** that stay **dormant** until the player meets `powerRequirements`. **Martial stats always apply** (grade + attunement) — you’re “just swinging” until the dao layer wakes. **Not** full appraisal UI (Phase F) or sell panel (E).

### Gear profiles (by content tier)

| Profile | Typical gear tier | Martial layer | Dao / inscription layer |
|---------|-------------------|---------------|------------------------|
| **Plain** | T1–2 | `def.stats` + affixes | — |
| **Inscribed** | T3+ | Same | Fixed inscription bonuses / procs when power met |
| **Dao-bound** | T5+ *(T4 legendaries as MVP stand-in today)* | Tier material always | Requires realm + dao comprehension; techniques greyed until met |

Most early recipes stay **plain**. Phase D ships the **system** + **1–2 example items** on existing tier 3–4 content — not a full tier 5–9 catalog (that’s Phase G).

### Data — inscriptions catalog (`data.js` or `forge-data.js`)

```javascript
const GEAR_INSCRIPTIONS = {
    qi_stabilizer: {
        id: 'qi_stabilizer',
        name: 'Qi Stabilizer',
        hanzi: '稳气纹',
        desc: 'Smooths qi flow through the blade.',
        powerRequirements: { minRealmIdx: 2 },  // Core Formation+
        stats: { qiDensityBonus: 0.06, maxQiBonus: 4 }
    },
    crimson_furnace: {
        id: 'crimson_furnace',
        name: 'Crimson Furnace',
        hanzi: '赤炉纹',
        desc: 'Fire dao channel — bonus damage; ignite pressure.',
        powerRequirements: { minRealmIdx: 2, daoId: 'phase_fire' },
        stats: { dmgPct: 5 }
        // combat proc (ignite) = later hook when technique system lands
    },
    nascent_channel: {
        id: 'nascent_channel',
        name: 'Nascent Channel',
        hanzi: '婴纹',
        desc: 'Externalized soul resonance in the steel.',
        powerRequirements: { minRealmIdx: 3 },  // Nascent Soul+
        stats: { spirit: 2, will: 1 }
    }
};
```

**On `GEAR_ITEMS` def (static) or instance (rolled):**

```javascript
// def-level (fixed recipe output)
inscriptions: ['crimson_furnace'],
powerRequirements: { minRealmIdx: 3, daoId: 'phase_fire' },  // dao-bound whole item

// instance-level (optional — random inscription roll later)
inscriptions: ['qi_stabilizer'],
```

**MVP item targets (today’s 4-tier build):**

| Item | Profile | Change |
|------|---------|--------|
| `dao_insight_amulet` | Inscribed | Add `inscriptions: ['qi_stabilizer']` |
| `phoenix_plume_cloak` (legendary) | Dao-bound lite | `powerRequirements: { minRealmIdx: 3 }` + optional inscription |
| `glacial_crown` | Inscribed | `inscriptions: ['nascent_channel']` — dormant until NS |

### Power check (`gear.js`)

```javascript
function meetsGearPowerRequirements(requirements) {
    if (!requirements) return true;
    if (requirements.minRealmIdx != null && (G.realmIdx || 0) < requirements.minRealmIdx)
        return false;
    if (requirements.daoId && !G.daoState?.comprehended?.includes(requirements.daoId))
        return false;
    if (requirements.formationInsight != null &&
        getFormationMasterInsight() < requirements.formationInsight)
        return false;
    // claim: 'law_wear' etc. — hook when realm-claims ship
    return true;
}

function getInscriptionDef(id) { return GEAR_INSCRIPTIONS[id]; }

function getActiveInscriptions(inst) {
    const def = getInstanceDef(inst);
    const ids = inst.inscriptions || def.inscriptions || [];
    return ids.filter(id => meetsGearPowerRequirements(getInscriptionDef(id)?.powerRequirements));
}

function isDaoLayerActive(inst) {
    const def = getInstanceDef(inst);
    return meetsGearPowerRequirements(def.powerRequirements);
}
```

### Stat pipeline (extends B/C)

```text
martialStats = def.stats × gradeMult × attunementMult × durabilityMult
               + affixes (same mults)

inscriptionStats = Σ inscription.stats (active inscriptions only)
daoLayerActive = meetsGearPowerRequirements(def.powerRequirements)

getGearBonuses() = martial + active inscription stats
// dao techniques / procs: separate combat hook when layer active
```

**Rule:** inscription stats **never** apply when power unmet — not partial. UI shows them greyed: *“Crimson Furnace (赤炉纹) — sealed (need Phase of Fire dao)”*.

### Crafting gate

Extend `canCraftGear`:

- After realm check, if recipe/`GEAR_ITEMS` has `powerRequirements`, block craft with plain reason: *“You lack the dao resonance to stabilize this inscription.”*
- Same helper as wear — **cannot forge what you cannot activate** (owner lock). Commission NPC bypass = later.

### Combat / techniques (minimal in D)

- **No new combat buttons required for acceptance** if dao techniques don’t exist yet.
- Ship `isDaoLayerActive(weaponInst)` helper for future technique system.
- Weapon tooltip when dao-bound + inactive: *“Dao channels sealed — swing as a mundane blade.”*
- When active: *“Dao channels open.”* + inscription stats in bonus panel.

### UI (no full appraisal — that’s F)

| Surface | D behavior |
|---------|----------------|
| Inventory / equip | List inscriptions; **active** = normal color, **dormant** = muted + requirement text |
| Gear bonus panel | Split: “Martial” vs “Inscriptions (active)” vs “Inscriptions (sealed)” |
| Forge Chamber | Block craft if `powerRequirements` unmet; show requirement line on recipe |
| Equip log | If dao-bound + inactive: *“The blade is heavy with promise. Your dao does not answer yet.”* |

**Phase F adds:** unread items, appraise to reveal inscription **names/effects** on drops. Phase D can show inscription names on **crafted** gear immediately; **found** gear with hidden inscriptions waits for F.

### Files to touch

| File | Work |
|------|------|
| `forge-data.js` / `data.js` | `GEAR_INSCRIPTIONS`, example items |
| `gear.js` | power helpers, `getActiveInscriptions`, extend `sumInstanceStats` / bonus panel |
| `crafting.js` | craft power gate |
| `forge-chamber.js` | requirement display, craft block reason |
| `ui.js` | sealed vs active inscription display |
| `style.css` | `.inscription-sealed`, `.inscription-active` |

### Test plan

- [ ] Plain T1 gear unchanged — no inscriptions, no regressions
- [ ] `dao_insight_amulet` at Core: stabilizer inscription **active**; at QC: martial only
- [ ] Fire dao not comprehended: `crimson_furnace` sealed; after comprehend: active
- [ ] Cannot craft dao-bound recipe without meeting `powerRequirements`
- [ ] Equipped bonus panel shows sealed vs active sections
- [ ] Audits pass

### Acceptance criteria

1. `powerRequirements` + `inscriptions` data model exists.
2. Martial stats ignore power gates; inscription stats require power.
3. Craft blocked when player lacks power to stabilize inscription.
4. At least one inscribed + one dao-bound-lite example on live tier 3–4 items.
5. No appraisal minigame yet (F).

### Out of scope for D

- Appraisal / unread loot (F)
- Dao **technique** buttons in combat (hook only)
- Tier 5–9 gear content (G)
- `claim: 'law_wear'` until realm-claims ship

## Phase E — sell panel + 9 smith ranks (`designed` — not built)

**Status:** Planned. **Depends on:** Phase B (`grade` + `GEAR_GRADES.sellMult`). Works without C/D but richer with grades on gear.

**Goal:** Forging pays — **sell surplus gear** from the Forge Chamber. **One ladder:** expand smith skill to **9 ranks** (1 per realm/tier); rank sets sell prices and public title. **No** separate reputation XP.

### Part 1 — Nine smith ranks (`forge-data.js`)

Replace 4-rank `FORGE_SKILL_LEVELS` with full ladder. Each row: craft bonuses (existing), `recipeUnlocks: [tier]`, `sellMult`, `hanzi`, `marketAccess`.

| id | Hanzi | EN | xpRequired | sellMult | market |
|----|-------|-----|------------|----------|--------|
| `apprentice` | 学徒 | Apprentice Smith | 0 | 0.78× | pawn only |
| `journeyman` | 行匠 | Journeyman | 10 | 0.86× | pawn only |
| `artisan` | 匠师 | Artisan | 28 | 0.94× | **market** |
| `master` | 炉火大师 | Master Smith | 55 | 1.04× | market |
| `spirit_smith` | 化神匠 | Spirit Smith | 95 | 1.14× | market |
| `void_smith` | 虚空匠 | Void Smith | 150 | 1.24× | market |
| `dao_smith` | 求道匠 | Dao Smith | 225 | 1.36× | market |
| `law_smith` | 显道匠 | Law Smith | 320 | 1.48× | market |
| `forge_saint` | 铸圣 | Forge Saint | 450 | 1.62× | market + consign *(later)* |

- **Ranks 5–9** exist in data immediately; recipes for tiers 5–9 unlock when Phase G adds content (no empty UI rows).
- Rank-up log: *“🔨 Rank ascends — Dao Smith (求道匠), smith of the seventh tier.”*
- Status panel shows: rank **English title** + sell mult + progress bar to next rank (tooltip: full `formatForgeSkillLabel` with hanzi).
- `unlockForgeRecipesForSkill` unchanged — only unlocks recipes that exist in `GEAR_CRAFT_RECIPES`.

**Skill XP** (unchanged from design): forge success + tier bonus; +5 on Supreme (极品) craft (Phase C); optional `+1 per tier` on sell (tune low).

### Part 2 — Sell price formula

```javascript
// forge-data.js
const GEAR_MARKET_BASE = {
    // per slot × tier — draft; tune from merchant buy prices
    weapon:     { 1: 14, 2: 42, 3: 85, 4: 160 },
    chestplate: { 1: 12, 2: 38, 3: 78, 4: 145 },
    helm:       { 1: 8,  2: 28, 3: 55, 4: 100 },
    amulet:     { 1: 16, 2: 48, 3: 95, 4: 175 },
    ring:       { 1: 10, 2: 32, 3: 65, 4: 120 },
    boots:      { 1: 9,  2: 26, 3: 50, 4: 90  }
};

const FORGE_BALANCE = {
    // …existing…
    pawnMult: 0.55,           // apprentice/journeyman outlet
    supplyPriceFactor: 0.08,  // mirror alchemy softness
    supplyDecayPerMonth: 0.15,
    skillXpPerSell: 1         // optional per tier handled in sell fn
};
```

```text
base     = GEAR_MARKET_BASE[slot][tier]
gradeMult = GEAR_GRADES[inst.grade].sellMult
affixMult = 1 + (inst.affixes.length * 0.08)   // tune
rankMult  = getForgeSkillLevel().sellMult
supplyMult = 1 / (1 + forge.gearSupply[defId] * supplyPriceFactor)
durMult   = inst.durability / inst.maxDurability  // worn gear worth less

price = floor(base × gradeMult × affixMult × rankMult × supplyMult × durMult)
```

**Pawn vs market:**

| Rank | Channel | Mult |
|------|---------|------|
| Apprentice, Journeyman | Pawn / scrap | `price × pawnMult` (0.55×) |
| Artisan+ | Market | full `price` |

UI label: *“Pawn offer”* vs *“Market price”* so players see why ranking up matters.

### Part 3 — Supply tracking (soft anti-flood)

```javascript
G.forge.gearSupply = { rusty_qi_blade: 2.5, … }  // defId → float
```

- On sell: `gearSupply[defId] += qty` (weight by tier).
- Monthly tick (hook `tickForgeSupplyDecay` from time advance, mirror alchemy): decay toward 0.
- Flooding one item type soft-lowers price — encourages variety.

### Part 4 — Sell flow (`crafting.js`)

```javascript
function getGearSellPrice(uid) { … }
function canSellGear(uid) { … }  // in bag, not equipped, not quest-locked
function sellGearInstance(uid, qty) { … }  // qty always 1 per instance
```

**Rules:**

- Sell **instances** from `gearBag` only — one UID = one sale.
- Cannot sell **equipped** gear (must unequip first).
- Cannot sell **starter path gear** if flagged `noSell` on def *(optional)*.
- Stones credited; instance removed from bag + `gearInstances`.
- Log: *“🔨 Sold Superior (上品) frostbite saber — work of a Journeyman (行匠) — for 52 Spirit Stones.”*
- Grant `grantForgeSkillXp(tier)` optional drip.

### Part 5 — Forge Chamber UI

Mirror alchemy sell panel (`index.html` + `forge-chamber.js`):

```html
<div class="forge-sell-section">
  <h3 class="forge-section-title">Sell Gear</h3>
  <div id="forgeSellPanel"></div>
</div>
```

**`renderForgeSellPanel()`:**

- List bag instances grouped or flat: emoji, name, grade chip, price, Sell button.
- Show current rank + channel (pawn/market).
- Empty state: *“No gear to sell. Forge surplus equipment for stones.”*
- Sort: tier desc, grade desc, price desc.

**Status panel** update: smith rank (English line), sell mult, XP bar (already partially there — extend for 9 ranks; hanzi in tooltip via `formatForgeSkillLabel`).

### Part 6 — Migration

- Existing saves: `migrateForgeSkillLevel()` picks correct rank from `skillXp` against new 9-row table.
- Add `G.forge.gearSupply = {}` in `ensureForgeState`.
- No rep fields — do **not** add `reputationXp`.

### Files to touch

| File | Work |
|------|------|
| `forge-data.js` | 9 ranks, `GEAR_MARKET_BASE`, balance constants |
| `crafting.js` | price, sell, supply tick |
| `gear.js` | `canSellGear`, tier/slot helpers for pricing |
| `forge-chamber.js` | sell panel, status rank display |
| `index.html` | `#forgeSellPanel` + section |
| `style.css` | `.forge-sell-row`, pawn vs market styling |
| `time-playback.js` or month tick | `tickForgeSupplyDecay` |

### Test plan

- [ ] Apprentice: pawn price ≈ 55% of artisan market on same item
- [ ] Artisan+: market price uses grade + rank mult
- [ ] Selling removes instance; equipped item blocked
- [ ] Rank-up at xp thresholds 10/28/55…; log shows English title with hanzi in brackets
- [ ] Supply: sell 5 of same def → 6th sale lower; decay after months
- [ ] Rank 5+ achievable via tier-4 grind (sell mult improves even without tier-5 recipes)
- [ ] Audits pass

### Acceptance criteria

1. `FORGE_SKILL_LEVELS` has 9 ranks with sell mult + hanzi.
2. Forge Chamber sell panel functional (alchemy parity).
3. Price reflects grade, tier, rank, durability, supply.
4. Pawn-only until Artisan; market from Artisan up.
5. No `forge.reputationXp`.

### Out of scope for E

- Commissions / guild consign (rank 8+ perk — stub text OK)
- Appraisal (F)
- Buying gear from market (sell only)
- NPC buyer haggling

## Phase F — appraisal + hybrid loot (`designed` — not built)

**Status:** Planned. **Depends on:** Phase B (`grade` on instances), Phase D (`inscriptions` + power gates). **Benefits from:** Phase C (grade rolls on forge for contrast), Phase E (sell panel — unread gear sell rules). Can ship **loot tables without full unread UI** as a thin slice, but appraisal payoff needs D.

**Goal:** Found gear uses the **same tier + grade language** as forging. **Hybrid loot** — mobs drop predictable Common junk; elites and bosses roll grade. **Appraisal** reveals what a piece *is* (tier, grade, inscriptions) on **found** gear; crafted gear from your forge is identified immediately (Phase D).

**Out of scope for F:** combat loot from every enemy type on day one (start with explore + 1–2 zones); appraisal minigame / skill check; body/soul loot; tier 5–9 drop tables (Phase G content).

### Part 1 — Instance identification (`gear.js`)

Add `appraised` to gear instances. Controls **display** and **sell quoting** — not whether martial stats apply (equipping unread gear still works; you just don’t see grade/inscriptions until appraised).

```javascript
// gear instance (extends B)
{
  uid, defId, grade: 'common',
  affixes: [], durability, maxDurability,
  appraised: true,           // NEW — false = unread found loot
  lootProfile: null          // optional — 'mob' | 'elite' | 'boss' | 'ancient' (analytics / log flavor)
}
```

| Source | `appraised` default | Notes |
|--------|---------------------|-------|
| **Forge** | `true` | You made it — full detail in Forge Chamber |
| **Merchant / starter** | `true` | NPC stock is labeled |
| **Mob trash drop** | `true` | Always Common — no mystery grind on goblin swords |
| **Elite / chest** | `false` if tier ≥ 3 **or** has inscriptions; else `true` | Mid-tier finds worth a trip to the forge |
| **Boss / ancient** | `false` always | Appraisal is the reward beat |

**Helpers:**

| Function | Purpose |
|----------|---------|
| `isGearAppraised(inst)` | Default `true` if field missing (migrate) |
| `needsAppraisal(inst)` | `!appraised` and not plain T1–2 without inscriptions |
| `getUnreadGearLabel(inst)` | Generic English + `(unread)` — e.g. `"Heavy iron blade (unread)"` |
| `formatInstanceName(inst)` | If unread → `getUnreadGearLabel`; else existing name + grade |
| `getAppraisalCost(inst)` | Stones + months from tier + inscription count |
| `appraiseGearInstance(uid)` | Set `appraised: true`; log reveal lines |

**Unread display rules** (English-first):

| Surface | Unread behavior |
|---------|-----------------|
| Inventory row | Generic label + `(unread)` badge; **no** grade chip |
| Tooltip | Slot + rough tier band if known (*"Feels like Foundation-era metal"*) — **no** exact stats line for inscriptions |
| Equip | Allowed — martial stats apply; player may not know grade until appraised |
| Compare / bonus panel | Grade line: `Unknown grade (appraise)` · inscriptions: `Sealed (unread)` |
| Sell panel (E) | Pawn/market **blocked** or **lowball quote** until appraised — lean **block** with *"Appraise before selling."* |

**Post-appraisal log:**

```text
Appraised Superior (上品) frostbite saber — Tier 2 weapon.
Inscription: Crimson Furnace (赤炉纹) — sealed (need Phase of Fire dao).
```

Plain gear with no inscriptions: one line only.

### Part 2 — Hybrid loot profiles (`forge-data.js`)

Three drop **profiles** — same grade ids as `GEAR_GRADES`:

| Profile | Grade | `appraised` | When |
|---------|-------|-------------|------|
| **`mob`** | Fixed **Common** | `true` | 95% of combat/explore gear drops |
| **`elite`** | Weighted roll | `false` if tier ≥ 3 or inscribed | Chests, elite kills, rare explore |
| **`boss`** | Weighted roll (better top end) | `false` | Zone bosses, dungeon clears |
| **`ancient`** | Hand-tuned per drop | `false` | Scripted finds — degraded **or** chase |

**Draft grade weights** (elite / boss — tune in playtest):

| Profile | Inferior | Common | Superior | Supreme |
|---------|----------|--------|----------|---------|
| `elite` | 22% | 48% | 26% | 4% |
| `boss` | 8% | 32% | 44% | 16% |

**Ancient pattern** (pick one per hand-authored drop):

| Pattern | Example |
|---------|---------|
| **Degraded** | Tier 4 weapon, **Inferior** grade — *"Nascent Soul blade, but the channels are cracked."* |
| **Chase** | Tier 3, **Supreme** + fixed affix — boss trophy |
| **Unread legendary** | Tier 4 dao-bound, inscriptions hidden until appraise |

```javascript
const LOOT_GEAR_PROFILES = {
    mob:    { gradeRoll: null, gradeFixed: 'common', appraised: true },
    elite:  { gradeRoll: 'elite', appraised: 'auto' },   // auto = false if inscribed or tier>=3
    boss:   { gradeRoll: 'boss', appraised: false },
    ancient: { gradeRoll: null, appraised: false }       // grade set per table row
};

const LOOT_GRADE_WEIGHTS = {
    elite: { inferior: 22, common: 48, superior: 26, supreme: 4 },
    boss:  { inferior: 8,  common: 32, superior: 44, supreme: 16 }
};
```

**Tier selection:** `rollLootGearTier(zone, profile)` — clamp to `zone.maxGearTier` and `floor(playerRealmIdx) + overreach` (same +1 early-realm lean as craft). No tier 4 from bamboo forest mobs.

**Affixes on loot:** use existing `rollGearAffixes(tier)` — affixes may show as **partial** on unread (*"Something sharp about the edge (unread)"*) or stay hidden until appraise. **Lean for MVP:** affixes hidden when `appraised: false`; appraisal reveals affix line + grade + inscriptions together.

### Part 3 — Loot tables & grant path

**New data** (`forge-data.js` or `loot-gear-data.js`):

```javascript
const ZONE_GEAR_LOOT = {
    starter_village: {
        mob:    [{ defId: 'rusty_qi_blade', weight: 3 }, { defId: 'cloth_robe', weight: 2 }],
        elite:  [{ defId: 'qi_focus_amulet', weight: 1 }],
        boss:   []
    },
    frostbite_wastes: {
        mob:    [{ defId: 'frostbite_saber', weight: 2, tierOverride: 2 }],
        elite:  [{ defId: 'glacial_crown', weight: 1 }],
        boss:   [{ defId: 'phoenix_plume_cloak', weight: 1, profile: 'ancient', grade: 'inferior' }]
    }
    // extend per zone as content lands
};
```

**Grant function** (`gear.js` or `world.js`):

```javascript
function grantLootGear(zoneId, profile, options) {
    const entry = pickWeighted(ZONE_GEAR_LOOT[zoneId]?.[profile]);
    if (!entry) return null;
    const grade = entry.grade || rollLootGrade(profile);
    const appraised = resolveAppraised(profile, entry, def);
    const uid = createGearInstance(entry.defId, {
        grade,
        appraised,
        lootProfile: profile,
        affixes: options?.affixes,
        skipBag: false
    });
    const label = appraised ? formatInstanceName(G.gearInstances[uid])
                            : getUnreadGearLabel(G.gearInstances[uid]);
    addLog(`🎁 Found ${label}.`);
    return uid;
}
```

**Hook points (MVP — pick at least two):**

| Hook | Profile |
|------|---------|
| Explore ultra/rare roll (`world.js` `applyExploreLoot`) | `elite` |
| Zone boss / scripted event reward | `boss` or `ancient` |
| Combat victory loot *(when combat drops gear)* | `mob` default |
| Merchant | unchanged — always Common, appraised |

**No gear in explore loot today** — F adds `type: 'gear'` branch next to techniques/materials in `applyExploreLoot`.

### Part 4 — Appraisal services

| Location | Cost (draft) | Unlocks |
|----------|--------------|---------|
| **Forge Chamber — Appraise panel** | `2 + tier` Spirit Stones · 0 months | Tier, grade, affixes, inscription **names** (effects still power-gated per D) |
| **Forge Chamber** (inscription read) | `+3 stones` per inscription | Full inscription stat text when power met; sealed text when not |
| **Law Smith rank (8)** | Free inscription read at forge | Perk from Phase E ladder |
| **Forgers Guild / Longcheng NPC** *(later)* | Higher tier read | Stub OK in F |

```javascript
const APPRAISAL_BALANCE = {
    baseStones: 2,
    stonesPerTier: 1,
    stonesPerInscription: 3,
    lawSmithFreeInscriptionRead: true
};
```

**`appraiseGearInstance(uid)` flow:**

1. Validate: in bag, not equipped, `needsAppraisal`
2. Deduct stones (waive inscription fee if Law Smith+)
3. `inst.appraised = true`
4. Log reveal (English + hanzi in brackets)
5. Optional: `grantForgeSkillXp(1)` on first appraise of tier ≥ 3 *(tune low)*

**Forge Chamber UI** — mirror sell panel layout (Phase E):

```html
<div class="forge-appraise-section">
  <h3 class="forge-section-title">Appraise Gear</h3>
  <div id="forgeAppraisePanel"></div>
</div>
```

- List unread bag instances: generic label, cost, Appraise button
- Empty: *"No unidentified gear. Elite drops and boss trophies often need a smith's eye."*
- Identified gear: hidden from list

### Part 5 — UI surfaces

| Location | Change |
|----------|--------|
| **Inventory / travel kit** | `(unread)` badge; Appraise shortcut if stones OK |
| **`formatInstanceName`** | Branch on `isGearAppraised` |
| **Gear tooltip** | Unread: muted stat block + *"Appraise at the forge to learn grade and inscriptions"* |
| **Forge Chamber** | `#forgeAppraisePanel` + status line: *"Law Smith — inscription reads are free"* when rank ≥ 8 |
| **Explore / combat log** | `Found Heavy iron blade (unread).` vs `Found Superior (上品) frostbite saber.` |
| **Sell panel (E)** | Block sell until appraised |

CSS: `.gear-unread-badge`, `.gear-appraise-row` (reuse sell row spacing).

### Part 6 — Migration

On load (`migrateGearAppraisalForExistingSave`):

1. Missing `appraised` → `true` (all legacy / crafted gear treated as known).
2. Do **not** retroactively unread old saves.

### Files to touch

| File | Work |
|------|------|
| `forge-data.js` | `LOOT_GEAR_PROFILES`, `LOOT_GRADE_WEIGHTS`, `ZONE_GEAR_LOOT`, `APPRAISAL_BALANCE` |
| `gear.js` | `appraised` field, unread labels, `rollLootGrade`, `grantLootGear`, `appraiseGearInstance` |
| `world.js` | `applyExploreLoot` gear branch; zone hooks |
| `forge-chamber.js` | appraise panel, cost display |
| `crafting.js` | ensure forge creates `appraised: true` |
| `ui.js` | unread badge, tooltip gating, appraise button in bag |
| `index.html` | `#forgeAppraisePanel` section |
| `style.css` | unread + appraise styles |
| `core.js` | migration on load |
| `data.js` | optional `unreadLabel` per `GEAR_ITEMS` def for flavor |

**Combat module** *(when it drops gear)*: call `grantLootGear(zone, 'mob')` on victory — optional same PR or immediate follow-up.

### Test plan

- [ ] Mob drop: Common, appraised, correct stats, no unread badge
- [ ] Elite T3+ drop: unread, generic name, equip works, grade hidden until appraise
- [ ] Appraise deducts stones; log shows `Superior (上品)` + inscription lines
- [ ] Law Smith: inscription read cost waived
- [ ] Cannot sell unread gear (or lowball — match implementation choice)
- [ ] Boss table can force `ancient` degraded Inferior on high-tier def
- [ ] Explore loot `type: 'gear'` grants instance into bag
- [ ] Legacy save: all existing instances `appraised: true`
- [ ] Audits pass

### Acceptance criteria

1. `appraised` persisted; migrate defaults to `true`.
2. Hybrid profiles: mob = Common only; elite/boss roll grades per table.
3. At least **one zone** has mob + elite entries in `ZONE_GEAR_LOOT`.
4. Forge Chamber appraise panel functional for unread bag gear.
5. Appraisal reveals grade + affixes + inscription **names**; power gates unchanged from D.
6. English-primary copy; hanzi only in brackets on reveal logs.
7. No separate reputation / appraisal XP track.

### Out of scope for F

- Appraisal minigame (spirit sense skill check — later)
- Bulk appraise all / auto-appraise on pickup
- Tier 5–9 zone tables (ship with G)
- Buying unidentified gear from NPCs
- Appraisal forgery / counterfeit gear

## Phase H — furnace + quench (`designed` — not built)

**Status:** Planned. **Depends on:** Phase B (`grade` on instances). **Best with:** Phase C (grade roll at craft — quench chosen same moment). **Independent of:** D/E/F (inscriptions and appraisal unchanged).

**Goal:** Workshop upgrades and **quench** give the forge its identity choice without a third tier gate or a separate flame system. **Furnace includes the flame** (one object). **Anvil** stays a minor comfort upgrade.

### Design locks (owner 2026-07-23)

| Topic | Decision |
|-------|----------|
| **Furnace + flame** | **One system** — furnace tier *is* the heat source (charcoal hearth → spirit-fired forge → …) |
| **Furnace job** | **Max recipe tier** you can heat/work + optional material-efficiency / high-tier months reduction |
| **Anvil job** | **Minor only** — −% forge months, +% output durability; **no** second tier cap if furnace gates tier |
| **Quench job** | **Element alignment** at final forge step — synergizes with matching **techniques**, not elemental damage on basic swings |
| **Inscriptions** | **Aggression layer** — fire/ice procs, dao channels, ignite on crit; **not** the poison lane |
| **Poison on weapons** | **Battle coats** (consumable, any weapon, wears off) = default; **poison quench** = optional niche later (permanent, gives up other alignment) — **not** required for poison play |
| **Affix / temperament reframe** | Parked idea — see [`forge-temperaments-idea.md`](forge-temperaments-idea.md) stub; not required for H |

**One-line rules:**

- *Quench harmonizes; inscriptions aggress (elemental procs, dao arts).*
- *Poison tonight = coat the blade; poison forever = specialist poison quench (optional, later).*

### Part 1 — Furnace (includes flame)

Replace separate flame picker. `G.forge.furnace` id; migrate from today’s anvil-forges-required pattern or parallel track.

```javascript
const FORGE_FURNACES = [
    { id: 'charcoal',   name: 'Charcoal Hearth',   emoji: '🪵', maxRecipeTier: 2, materialEfficiencyPct: 0,  highTierMonthsReductionPct: 0,  forgesRequired: 0 },
    { id: 'spirit',     name: 'Spirit-Fired Forge', emoji: '🔥', maxRecipeTier: 3, materialEfficiencyPct: 5,  highTierMonthsReductionPct: 3,  forgesRequired: 12 },
    { id: 'moonwell',   name: 'Moonwell Crucible', emoji: '🌙', maxRecipeTier: 4, materialEfficiencyPct: 10, highTierMonthsReductionPct: 6,  forgesRequired: 35, discoverId: 'moonwell_blueprint' },
    // tiers 5–9 stubs when Phase G lands
];
```

| Furnace | Flame fantasy (flavor only) | Gates |
|---------|----------------------------|-------|
| Charcoal hearth | Mortal fire | Tier 1–2 recipes |
| Spirit-fired forge | Spirit flame | Tier 3 |
| Moonwell crucible | Yin/cold flame | Tier 4 + refined yin quench media |
| … | Sect / caldera flames | Tier 5+ (G) |

`canCraftGear`: `recipe.tier <= getForgeFurnaceDef().maxRecipeTier` (replaces or precedes anvil tier checks).

**Not in scope:** separate smelt minigame (ore→ingot) unless a later PR adds optional “refine materials” action on the furnace.

### Part 2 — Anvil (simple upgrade)

Keep `FORGE_ANVILS` but **strip tier gating** if furnace owns it. Anvil only:

- `monthsReductionPct` (existing)
- `durabilityBonusPct` on new instances (rename from vague `affixBonus` over time)
- Unlock via `successfulForges` (existing)

Forge Chamber status: **Furnace** (tier cap) + **Anvil** (comfort) as two lines.

### Part 3 — Quench (alignment at craft)

**When:** final step on successful `craftGear` — player picks quench medium from inventory or **None (neutral)**.

```javascript
// instance (extends B)
{
  uid, defId, grade, affixes, durability, maxDurability,
  quench: null | { mediumId: 'yin_essence', alignment: 'moon' }
}
```

**Alignment quenches (ship first)** — martial swings stay martial; bonus applies when using **matching techniques**:

| Medium | Alignment | Synergy (draft) |
|--------|-----------|-----------------|
| *(none)* | neutral | — |
| Yin essence / moon dew | `moon` | Moon & shadow techniques: +dmg or −qi cost |
| Phoenix ash | `fire` | Fire-path techniques |
| Frost condensate | `ice` | Ice/water techniques |
| Void mote | `void` | Void/dao techniques |
| Spirit herb wash | `wood` / `life` | Wood/heal techniques |

Higher-tier media (refined moon essence, celestial yin bead) = stronger synergy band — same alignment, not a new element.

**Helpers (`gear.js` / `forge-data.js`):**

| Function | Purpose |
|----------|---------|
| `GEAR_QUENCH_MEDIA` | medium defs: `alignment`, `synergyPct`, `tier`, `consumes` |
| `getQuenchAlignment(inst)` | for combat technique matcher |
| `getQuenchTechniqueSynergyMult(technique, weaponInst)` | called from technique damage / cost |
| `formatQuenchLabel(inst)` | `Moon-aligned (yin essence)` — English + hanzi in tooltip |

**Craft UX:** recipe detail → quench dropdown (grey out missing media) → forge → log: `Forged Superior frostbite saber — moon-quenched (yin essence).`

**Loot:** mob drops usually `quench: null`. Hand-authored boss drops may include quench.

### Part 4 — Poison (two lanes — owner lock)

| Lane | System | Duration | Weapon |
|------|--------|----------|--------|
| **Battle coat** | Consumable (`venom_vial`, `serpent_bile`) applied pre-combat | One fight or N hits | **Any** equipped weapon — no reforge |
| **Poison quench** *(optional, later)* | Forge step | Permanent | **That instance only** — gives up moon/fire/void alignment |

**Ship battle coats with combat/consumables**, not Phase H core — but document here so forge design stays coherent.

```javascript
// G.gearBattleCoat = { alignment: 'poison', hitsRemaining: 8, potency: 1 } — on G, not instance
function applyBladeCoat(itemId) { … }
function getWeaponPoisonOnHit(inst) { … } // coat only unless poison-quenched (later)
```

Poison quench **deferred** — if added later: light permanent on-hit poison + poison technique synergy; opportunity cost vs other alignments.

### Part 5 — Files to touch

| File | Work |
|------|------|
| `forge-data.js` | `FORGE_FURNACES`, `GEAR_QUENCH_MEDIA`; trim anvil to comfort stats |
| `crafting.js` | furnace tier gate; pass `quenchMediumId` into `createGearInstance` |
| `gear.js` | `quench` on instance; synergy helper for techniques |
| `forge-chamber.js` | furnace status; quench picker on detail panel |
| `combat.js` | technique ↔ quench synergy hook; battle coat poison on hit |
| `data.js` | quench media as materials or consumables |
| `core.js` | migrate `G.forge.furnace`; legacy anvil → furnace mapping |

### Test plan

- [ ] Tier 3 recipe blocked on charcoal hearth; works on spirit forge
- [ ] Quench consumes medium; neutral craft unchanged
- [ ] Moon quench + moon technique &gt; neutral; basic attack unchanged either way
- [ ] Battle coat on found legendary applies poison for one fight; quench not required
- [ ] Anvil upgrade still reduces months without gating tier

### Acceptance criteria

1. One furnace track gates recipe tier; flame is not a separate UI picker.
2. Anvil is comfort-only (no duplicate tier cap).
3. Quench alignment stored on instance; technique synergy works.
4. Basic attacks do not deal elemental damage from quench alone.
5. Battle coat consumable documented and implementable without reforge.

### Out of scope for H

- Poison quench (optional follow-up)
- Smelt/refine ore sub-loop
- Reforge / change quench on existing item
- Temperament / affix reframe

## Functioning forger path — what’s left

Checklist for a **complete qi-path smith loop** (playable profession, not guild endgame). ✅ = in game today · 📋 = designed · ⬜ = not designed / missing.

### Core loop (must ship)

| Piece | Status | Phase / notes |
|-------|--------|----------------|
| Forge Chamber hub (craft, repair, legendary tab) | ✅ | Sect, inventory, header button |
| Materials from explore / drops | ✅ | `G.materials`; zone loot |
| Recipes + skill unlocks | ✅ | 4 ranks · 9 recipes · realm gate [PR #70](https://github.com/WanderingImmortal/tales-immortal-path/pull/70) |
| Craft → instance → equip → combat | ✅ | `gear.js`, durability |
| Repair worn gear | ✅ | Forge repair tab |
| **Grades (品)** on gear | 📋 | **B** — quality axis |
| **Grade roll on forge** | 📋 | **C** — why smith &gt; mob loot |
| **Attunement** (wear over-tier) | 📋 | **C** |
| **Sell surplus gear** | 📋 | **E** — economic payoff |
| **Smith rank → sell price** | 📋 | **E** — no separate rep |
| **Furnace tier gate** | 📋 | **H** |
| **Quench (alignment choice)** | 📋 | **H** — forge identity |

### Depth (should ship for “real” profession)

| Piece | Status | Phase / notes |
|-------|--------|----------------|
| **Inscriptions** (dao procs, fire/ice on techniques) | 📋 | **D** |
| **9 smith ranks** | 📋 | **E** |
| **Hybrid loot + appraisal** | 📋 | **F** — found gear speaks same language |
| **Battle poison coats** | 📋 | Consumables — any weapon; see Phase H §4 |
| Anvil comfort upgrades | ✅ | Demote when H ships; keep time/durability |
| Legendary forge line | ✅ | Success rate · materials |
| Sect armory bonus | ✅ | Time + affix nudge |

### Progression & discovery

| Piece | Status | Notes |
|-------|--------|-------|
| Skill XP from forging | ✅ | Tier bonus in design |
| Recipe learn on rank-up | ✅ | |
| Recipe from quests / manuals | ⬜ | Only skill unlocks today — add event `learnForgeRecipe` beats |
| Furnace blueprint discovery | 📋 | H — moonwell etc. |
| Quench media sources | 📋 | Explore, merchants, zone bosses |
| Tier 5–9 recipes & materials | ⬜ | **G** + nine-realm migration |

### Economy & sinks

| Piece | Status | Notes |
|-------|--------|-------|
| Material sink (craft) | ✅ | |
| Stone sink (craft + repair) | ✅ | |
| Gear sink (durability) | ✅ | |
| **Sell income** | 📋 | E |
| **Supply-softened sell prices** | 📋 | E — anti-flood |
| Buy materials from merchants | ⬜ | Optional — explore may be enough early |

### Guild & social (endgame — not required for v1)

| Piece | Status | Notes |
|-------|--------|-------|
| Forgers Guild charter | ⬜ | [`creation-path-guilds.md`](creation-path-guilds.md) |
| Commissions | ⬜ | Rank 7+ perk stub in E |
| NPC master forge for you | ⬜ | Story / commission |
| Market buy gear | ⬜ | Explicitly out of E scope |

### UX & onboarding

| Piece | Status | Notes |
|-------|--------|-------|
| English-first labels | 📋 | Locked in doc; implement with B |
| Grade / quench visible on gear | 📋 | B + H |
| “Why can’t I craft this?” reasons | ✅ | Realm, skill, materials |
| First-visit forge hint | ⬜ | Short tutorial line or NOW quest |
| Compare quench before commit | 📋 | H recipe detail |

### Parked / not required for functioning path

| Piece | Notes |
|-------|-------|
| Affix → temperament reframe | Optional flavor later |
| Poison quench | Niche; coats first |
| Body/soul forge verbs | Different creation path |
| Appraisal minigame | F is reveal UI only |
| Commissions / consign | Post–rank 8 |

### Suggested implementation order (minimum viable smith)

```text
A ✅ → B (grades) → H (furnace + quench) → C (grade roll + attunement) → E (sell + ranks)
→ D (inscriptions) → F (loot + appraisal) → G (content + tiers 5–9)
```

**Battle poison coats** can slot alongside **H** or **D** (combat hook) — small consumable PR.

**“Functioning” bar:** after **B + H + C + E**, a player can gather ore, rank up smith, pick quench, chase grades, sell surplus, and feel why forging beats buying. **D + F** make high-tier and found gear interesting; **G** scales to nine realms.

## Phased build (suggested)

| Phase | What | Notes |
|-------|------|-------|
| **A** ✅ **shipped** | Skill + realm recipe gates | [PR #70](https://github.com/WanderingImmortal/tales-immortal-path/pull/70) — **in game** |
| **B** 📋 **designed** | Grades on instances + stat scaling + UI + tier base pass | [Phase B](#phase-b--grades-on-gear-designed--not-built) |
| **C** 📋 **designed** | Grade roll on forge + attunement | [Phase C](#phase-c--grade-rolls--attunement-designed--not-built) |
| **D** 📋 **designed** | Power gates + dormant inscriptions | [Phase D](#phase-d--power-gates--dormant-inscriptions-designed--not-built) |
| **E** 📋 **designed** | Sell panel + 9 smith ranks | [Phase E](#phase-e--sell-panel--9-smith-ranks-designed--not-built) |
| **F** 📋 **designed** | Appraisal + hybrid loot tables | [Phase F](#phase-f--appraisal--hybrid-loot-designed--not-built) |
| **G** | Tiers 5–9 gear + guild + path specials | Nine-realm migration |
| **H** 📋 **designed** | Furnace (incl. flame) + quench alignment | [Phase H](#phase-h--furnace--quench-designed--not-built) |

## Prerequisites

- [x] Owner direction: 9 tiers, 4 grades, tier beats grade
- [x] Player-facing copy — **English primary**; hanzi in brackets (logs, tooltips)
- [x] Grade labels locked — Inferior / Common / Superior / Supreme *(下品 / 中品 / 上品 / 极品 in data)*
- [x] Under-tier — **attunement** on base stats
- [x] Dao-bound gear — **martial layer always material-tier**; dao layer power-gated (“just swinging”)
- [x] Crafting — tier ceiling (+1 early, stricter late) + power requirements
- [x] Smith ranks — **9 ranks for 9 realms**; no separate reputation
- [x] Appraisal — later; reveals **inscriptions/formations**, not affix discovery
- [ ] Body/soul special creation path (not mirrored qi gear)
- [x] Phase B designed — grades, mults, tier base pass, UI map
- [x] Phase C designed — grade roll table, attunement on equip
- [x] Phase D designed — inscriptions, powerRequirements, martial vs dao layer
- [x] Phase E designed — sell panel, 9 smith ranks, pawn vs market
- [x] Phase F designed — hybrid loot profiles, unread/appraised, appraise panel
- [x] Phase H designed — furnace+flame merged, quench alignment, anvil comfort-only
- [x] Quench vs inscription split — harmonize vs aggress; poison via battle coats
- [ ] Poison quench (optional niche) — deferred
- [ ] Battle coat consumables — spec in H; implement with combat
- [ ] Attunement constants tune pass (in playtest when C ships)
- [ ] Nine-realm migration plan

## Open questions

- [ ] Early-realm +2 craft overreach — QC only, or never?
- [ ] Martial attunement curve vs material-tier floor — tune so T7 martial > T3 supreme when gap is small, still punishing at QC+T7
- [ ] Inscription pool per tier — hand-authored vs procedural?
- [ ] Unread affixes — hide until appraise (F lean) vs show partial hints
- [ ] Sell unread gear — hard block vs lowball pawn (F leans **block**)
- [ ] Body/soul: shared tier index with different item types, or separate refinement ladder?
- [ ] Body/soul parallel realm names at idx 4 and 7 when nine-realm ships

## Implementation crumbs

- Gear instances: `gear.js` — add `grade`, `appraised`; scale stats in `sumInstanceStats`
- Loot: `ZONE_GEAR_LOOT`, `grantLootGear`, explore `type: 'gear'` in `world.js`
- Appraisal: `appraiseGearInstance`, `#forgeAppraisePanel` in `forge-chamber.js`
- Furnace + quench: `FORGE_FURNACES`, `GEAR_QUENCH_MEDIA`, craft picker in `forge-chamber.js`
- Battle coats: `applyBladeCoat`, poison on hit in `combat.js` (consumables in `data.js`)
- Recipes: `GEAR_CRAFT_RECIPES`, `GEAR_ITEMS` in `data.js`
- Forge gates: `crafting.js`, `forge-data.js` (`FORGE_TIER_REALM_INDEX` → extend to 9)
- UI: `forge-chamber.js` — show tier, grade roll preview, realm name
- Realm ladder: `PATHS.*.realms`, `nine-realm-ladder.md` migration checklist

## Links

- [`creation-path-guilds.md`](creation-path-guilds.md) — Forgers Guild, exams, commissions
- [`nine-realm-ladder.md`](nine-realm-ladder.md) — 7 → 9 realm indices
- [`imperial-city-tianjing.md`](imperial-city-tianjing.md) — Forgers Guild branch
