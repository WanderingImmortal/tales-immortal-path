# Spiritual roots — taxonomy v2

| Field | Value |
|-------|-------|
| **Status** | `building` |
| **Blocked on** | — |
| **Issue** | none yet (PR in progress) |
| **Chat / PR** | Cloud agent planning chat, 2026-07-18 |
| **Updated** | 2026-07-18 (mixed-root philosophy, deviant variants, basin tiers, reincarnation creation) |

## Intent

Roots are the **fate axis** — they flow into lifespan pacing, watershed ceilings, cultivation speed, tribulation odds, breathing technique fit, and foundation variants. Design roots **before** deepening individual realms.

## Innate Height — clear ceiling table (owner request)

Players need one obvious answer: **“How high can this root go without heaven-defying rites?”**  
Reincarnation then unlocks **better starting roots** (more CP → higher innate height on the next life).

### The rule (simple)

```
innateCeilingRealmIdx = compositionBase only
grade affects speed / trib / breakthrough — NOT ceiling (owner preference)
```

**Tier authority:** composition (and later basin rites) sets **how high heaven allows you**. Grade sets **how well you climb within that allowance**. Superior/heavenly must not step over the composition ceiling — or tier feels meaningless.

| Composition | Innate ceiling (all grades) | Height label |
|-------------|----------------------------|--------------|
| **Pentamixed** (4–5 elements) | **1** — Foundation Establishment | **Foundation Shore** |
| **Mixed** (3 elements) | **2** — Golden Core | **Golden Core Gate** |
| **Dual** (2 elements) | **3** — Nascent Soul | **Nascent Soul Bridge** |
| **Single** (1 element) | **4** — Void Refinement | **Void Horizon** |

| Grade | Ceiling | Also does |
|-------|---------|-----------|
| **Inferior** | unchanged | Slow; worse trib/breakthrough |
| **Common** | unchanged | Standard speed |
| **Superior** | unchanged | Fast; better trib/breakthrough |
| **Heavenly** | unchanged | Fastest; best odds — **still same Height label as same composition** |

**To raise ceiling in-run:** basin ascension formation (+1), composition rite (+1 composition row), harmonisation / deviant rites — not grade.

### Creation preview (one line each)

- **Innate Height:** *Golden Core Gate* — fixed by composition (mixed)  
- **Grade:** Superior — 115% cultivation, +breakthrough (does **not** open Nascent Soul)  
- **Oracle:** *“You may nurture a golden core — the soul bridge lies beyond unless heaven’s verdict changes.”*

### Ascension rites vs innate height

| Rite track | Effect on ceiling |
|------------|-------------------|
| **Grade ascension pill** | **No ceiling change** — speed / trib / breakthrough only |
| **Basin ascension formation** | **+1 ceiling** (one watershed step; rare per life) |
| **Composition rite** | +1 composition row (pentamixed→mixed, etc.); max 1 step per life |

### Full ceiling matrix (reference) — composition only

| Composition | Innate ceiling (realm index) | Height label |
|-------------|------------------------------|--------------|
| Pentamixed | 1 | Foundation Shore |
| Mixed | 2 | Golden Core Gate |
| Dual | 3 | Nascent Soul Bridge |
| Single | 4 | Void Horizon |

Grade column removed from ceiling — superior single and inferior single both **Void Horizon**; heavenly single cultivates faster toward Void, not Dao.

**Dao / Immortal** without rites: requires **composition rite** (e.g. dual→single) + **basin formation(s)** stacking from lower bases, or future legendary constitutions — not heavenly grade alone.

### Reincarnation meta (clear run arc)

| Run | Typical start | Innate Height | Notes |
|-----|---------------|---------------|-------|
| 1 | Pentamixed inferior | Foundation Shore | Slow; learn basin rite |
| 2 | Mixed common (unlock) | Golden Core Gate | Same height as mixed heavenly — grade = speed only |
| 3+ | Dual + superior CP | Nascent Soul Bridge | Heavenly unlock = faster, not taller |

**Player sentence:** *“Run 1 Foundation Shore. Run 2 I unlock mixed — Golden Core Gate from birth. Heavenly on run 3 makes me fast, not taller — I still need a formation to open the Soul Bridge.”*

### Lore labels map (for UI)

| Index | Realm | Height label |
|-------|-------|----------------|
| 1 | Foundation Establishment | Foundation Shore |
| 2 | Golden Core | Golden Core Gate |
| 3 | Nascent Soul | Nascent Soul Bridge |
| 4 | Void Refinement | Void Horizon |
| 5 | Dao Seeking | Dao Threshold |
| 6 | Immortal Ascension | Immortal Firmament |

Below Foundation Shore (stuck in QC): **Condensation Pool** (index 0) — rootless / worst pentamixed penalty case.

---

## Concrete root schema (v2 proposal)

What a spirit root **is** in data — four fields at creation:

```
SpiritRoot {
  composition:  'pentamixed' | 'mixed' | 'dual' | 'single'   // how many classical elements
  elements:     ['fire','water',...]   // 1–5 classical; rolled or chosen
  grade:        'inferior' | 'common' | 'superior' | 'heavenly'
  deviant:      null | 'thunder' | 'blood' | ...   // usually null until rite/event
}
→ derived: basinTier (0–6), cultivateSpeedMult, breakthroughBonus, oracleLine
```

### Composition ladder (creation — not a full grind chain)

| Composition | Fiction | Typical starting profile |
|-------------|---------|---------------------------|
| **Pentamixed** | 4–5 elements, chaotic | Default mortal / CP-refund; slowest; lowest basin |
| **Mixed** | 3 elements | Still poor; most “unlucky” cultivators |
| **Dual** | 2 elements | Middle path; flexible techniques |
| **Single** | 1 element | Focused; best classical ceiling potential |

**Heavenly / superior** almost always **single** or **dual** at creation — not pentamixed with hidden S-tier.

Creation CP: pentamixed/mixed cheap or free · dual costs · single costs more · grade stacks on top.

### Grade (quality within your composition)

| Grade | Speed | Breakthrough/trib | CP cost |
|-------|-------|-------------------|---------|
| Inferior | 0.70–0.85× | penalty | 0–1 |
| Common | 1.0× | neutral | 2–3 |
| Superior | 1.15–1.25× | bonus | 4–5 |
| Heavenly | 1.35×+ | strong bonus | 7+ / legacy |

Grade upgrades **do not remove elements** — they make the root you *have* purer and faster.

### Basin tier (derived cap — watershed)

Use **Innate Height** — ceiling from **composition only**; grade does not add realms.

### Deviants (orthogonal)

Thunder, blood, ice, etc. — **not** on creation until unlocked. Applied as `deviant` field + rule overrides. Does not mean “fire + lightning buff.”

---

## Three upgrade tracks (rites) — **do not merge into one ladder**

Player confusion if every formation “removes an element” until single. Split rites:

| Track | What changes | Repeatable? | Example |
|-------|----------------|-------------|---------|
| **A. Grade ascension** (pill) | inferior → common → superior | **Yes, capped** (e.g. max 2 grade steps per life) | Marrow Cleansing Elixir |
| **B. Basin ascension** (formation) | basin tier +1 (fate gate opens) | **Rare** (1 per life, or 1 ever) | Seven-Day Heaven-Defying Array |
| **C. Composition ascension** (pill or formation) | pentamixed → mixed → dual → single | **No step-by-step** — see below |

### Composition rites — avoid “remove one element” spam

**Problem:** stabilise / eliminate-one formation repeatable → checklist to single → same end for everyone.

**Options (pick one — owner):**

1. **No composition rites (simplest)** — composition fixed at birth. Rites only move **grade** and **basin tier**. A mixed inferior stays mixed; they can still **tier-up** to attempt GC if they earn the heaven-defying array. Purification fantasy = grade pills (“stabilise” = faster, not fewer elements).

2. **One supreme purification per life (recommended)** — single rite jumps **one composition step** (pentamixed→mixed, or mixed→dual, or dual→single). Player chooses **which step** when they craft it; **max 1–2 composition ascensions per life**. Never pentamixed→single in one go.

3. **“Sever one element” rite — once only** — eliminates weakest element, small grade bump; **once per lifetime**. Pentamixed might need dual+single rites across **multiple reincarnations**, not one life.

4. **Harmonise, don’t sever** (five-element path) — separate endgame rite for **pentamixed only**: does not become single; adds **legendary constitution** flag (harmonised mixed) with its own basin rules — the “balance all elements” fantasy without erasing identity.

**Recommendation:** **2 + 4**. Classical cultivators: 1–2 composition steps per life max. Pentamixed endgame: harmonisation rite chain, not “grind to single.”

### How stabilise formations fit

“Element stabilising array” = **Track A (grade)** or partial **Track B (basin)** — *purifies qi flow in existing elements*, not “delete fire.” Flavour: *“The five elements still war within you, but they no longer tear your meridians.”* → mixed inferior → mixed common, same element count.

“Element severing” = **Track C** — rare, capped, big material cost.

---

## What creation shows (example)

**Pentamixed inferior (fire lean)**  
*Innate Height:* **Foundation Shore**  
*Speed:* 49% · *Oracle:* “Five elements clash — your road likely ends at a sealed foundation unless heaven’s verdict changes.”

**Single common fire**  
*Innate Height:* **Void Horizon** (single)  
*Grade:* Common — 100% speed · *Oracle:* “One flame, one road — the void horizon is your allotted height; beyond it, only rites may argue with heaven.”

After **basin ascension formation:**  
*Oracle updates:* “The gate stirs — a golden core may yet form. Whether you fill it is yours to prove.”

---

## Design axes (proposal + pushback)

### Recommended split: three orthogonal axes

| Axis | Answers | Examples | **Not** the same as |
|------|---------|----------|---------------------|
| **Grade** | How *well* you cultivate (speed, stability, breakthrough/trib odds within your ceiling) | inferior · common · superior · heavenly | Element |
| **Composition** | How many elements / how "pure" the root is | single · dual · triple · mixed · mutant | Grade (mixed can be superior or inferior) |
| **Affinity** | *Which* element(s) | fire, water, wood, metal, earth, lightning, … | A separate paid "variant" layered on anything |

**Pushback on tier + grade both meaning "quality":**  
If **tier** = "highest watershed you can ever cross without aid" and **grade** = "how fast/ cleanly you move *within* each basin", they stay distinct:

- *Tier* → `naturalRealmCap` / watershed (Peak FE only · Golden Core · Nascent Soul · …)
- *Grade* → `cultivateSpeedMult`, breakthrough bonus, lifespan efficiency

Example: **Tier 2 (GC basin) + Grade inferior** = might reach Golden Core in theory but so slowly you die at Peak FE anyway — matches "talent + time" tragedy.

If tier and grade both just mean good/bad, **collapse to grade + composition** and derive ceiling from a table.

### Mixed roots — worse by default; “balance all elements” is earned

**Genre default:** mixed / impure roots (杂灵根) are **slow, leaky, low ceiling** — most cultivators. Single pure root = focused, faster, higher ceiling on that path.

**“Balancing the five elements” as a supreme path** in xianxia is usually **not** “I rolled mixed root at birth.” It is:

- A **dao** or **manual** pursued over lifetimes (Five Elements Cycle, mutual generation / restraint)
- A **legendary constitution** unlocked late (Five Elements Body, Chaos Physique) — rare **deviant variant**, not standard mixed composition
- Sometimes a **heavenly mutant** who harmonises what others cannot

**Design rule:** mixed composition = weak baseline. Five-element mastery = **achievement** (technique, pill, forbidden ground, reincarnation unlock) that can **raise ceiling or bypass** a low basin tier — fate shifting, not creation min-max.

Dual classical (e.g. fire + water) sits between: viable, flexible, rarely top-tier without story.

### Deviant variants — non-classical roots (owner direction)

Use **variant** for roots **outside the five elements**, not elemental buff stickers:

| Type | Examples | Fiction | Typical cost |
|------|----------|---------|--------------|
| **Classical composition** | single fire, dual wood-water, mixed | Normal spiritual roots | Grade + composition CP |
| **Deviant / mutant** | thunder, blood, ice, poison, yin-spectre, sword | Heaven-defying mutation; often replaces or overlays one classical slot | High CP + legacy unlock |
| **Legendary constitution** | five-elements body, chaos, void root | Endgame reincarnation unlock; may break normal basin rules | Meta unlock only |

Thunder/lightning: often **mutant offshoot** of metal or heaven’s favour — not “fire variant +2.”  
Blood root: overlaps **body path** flavour — can skew vessel synergies or forbidden techniques.

Deviants still have **grade** (speed) and **basin tier** (cap). A thunder root isn’t auto-heavenly; it’s **weird + rules**.

### Basin tier (cap) vs grade (speed) — one tier per watershed?

**Tier** maps to **highest realm gate passable without aid** (aligns with seven qi realms / watersheds).

**Player-facing copy — flavour, not spreadsheet labels:**

Avoid dry gates like *“Gated at Foundation Establishment.”* Use **oracle / appraisal** lines that match tone:

| Basin (internal) | Example preview line |
|------------------|----------------------|
| Peak Foundation only | *“Your road settles at a sealed foundation — to birth a golden core demands luck, fate, or defying both.”* |
| Golden Core basin | *“Heaven may permit a golden core — whether you survive to fill it is another matter.”* |
| Nascent Soul basin | *“A soul may yet emerge from the core — if the tribulation fire does not consume you first.”* |

Always pair with a softer **“fate may shift”** hint when bypass exists (pills, formations, dao, rare events): *“…unless heaven’s verdict changes.”*

**Knowing limits at creation** is fine (sect root tests). Drama = fighting the oracle, not pretending you don’t know.

### Basin tier model — **hybrid** (owner confirmed)

| Phase | How cap works |
|-------|----------------|
| **Creation** | **Derived** — grade + composition (+ classical affinity) → lookup table → starting `naturalRealmCap` + oracle flavour line |
| **During run** | **Forced upgrades** — rare **single-use** pills or formations the player **crafts/assembles** from gathered materials, then expends to **permanently raise grade or basin tier** (or awaken a deviant). Major investment milestone — not a passive buff. |
| **Reincarnation** | Meta catalog — deviants / upgrades discovered in prior lives may unlock recipes or creation options |

**Layman:** sect tests your root at birth (derived). You can **defy that verdict** by spending a lifetime gathering ingredients and burning them in one heaven-defying rite.

### Root ascension rites — pills & formations (owner direction)

**Core fantasy:** player does the work (explore, alchemise, sect grind, forbidden grounds) → crafts **one-shot** root-refinement → expends it → **grade up** and/or **tier up** (basin cap raised). Journey toward immortality, not shop buff.

| Type | Examples | Typical effect |
|------|----------|----------------|
| **Root-refining pill** | Marrow Cleansing Elixir, Heaven Defying Root Pill | +1 **grade** (inferior→common) or narrow grade efficiency; maybe failure/backlash |
| **Breakthrough formation** | Seven-Day Root Ascension Array, Sect Foundation Rite | +1 **basin tier** (Foundation cap → Golden Core cap); must sit array full duration |
| **Induced deviant** | Thunder Tribulation Consolidation Pill, Blood Pool Transmutation | Adds deviant layer **or** converts classical → deviant (single use, high risk) |

**Design rules:**

- **Single use per rite** — consumed on success (pill eaten, formation burned out). Not spammable.
- **High material cost** — ties economy, alchemy, explore, sect treasury into one goal.
- **Player chooses when** — save for tier jump vs grade polish; wrong timing = wasted lifespan in array.
- **Grade vs tier** — separate recipes; tier rites rarer and more expensive (crossing watershed fate vs cultivating faster).
- Optional **failure** on tier rites (shattered dantian, broken root) keeps stakes — aligns with tribulation tone.
- Oracle preview updates after success: *“Heaven’s gate shifts — a golden core may yet form.”*

**Not:** passive `talentCapBypassed` flag from a cheap consumable. **Is:** permanent patch to `G.talent` / root profile until reincarnation.

Induced **variation** from these rites = deviant unlock or conversion, not classical element DLC.

Mixed is never hidden best. Five-element harmony remains late earned content (likely its own supreme-tier rite chain).

### Deviant roots — unlock during the run (owner direction)

Deviants (thunder, blood, ice, …) are **not** on the creation screen until earned:

- **In-run:** tribulation survival, forbidden ground, story arc, mutation event, pill catastrophe, **formation rite** — root awakens, enhances, or transmutes mid-life
- **Meta / reincarnation:** catalog unlock so future *lives* can start with that deviant at creation (optional second layer)

Mixed is **never** hidden best. Five-element supremacy remains earned via dao / constitution / late unlock — not default mixed.

### Derived vs independent basin tier (design choice)

**Derived (recommended):** game **calculates** your ceiling from grade + composition (+ deviant modifiers). Player picks “mixed inferior” → system sets Foundation basin. No separate “pick your tier” step.

**Independent:** player (or build) **assigns** basin tier directly, or buys tier with CP separate from grade. More control, easier to break with min-max unless costs are strict.

See “Layman’s explanation” section in chat / below in doc notes.

### Basin tier display — poetic gate (not FE acronym)

### Creation screen + reincarnation

Creation is **the start of a life** — should feel weighty. Crowding is a **UI problem**, not a content problem:

- **Run 1:** mixed inferior (default), few traits, locked origins/deviants
- **Later lives:** +bonus CP, heavenly grade unlock, mutant/thunder/blood variants, second trait slot, fallen noble origin, element choice, better breathing manual tier

Existing hooks: `LEGACY_BONUS_CP`, `heavenlyRoot`, `mutantRoot`, `secondTraitSlot`, `fallenNoble` unlocks.

**Layout sketch:** Step 1 grade → Step 2 composition (+ classical element roll/choose) → Step 3 optional deviant (if unlocked) → Step 4 traits/drawbacks/origin → Preview panel (speed, **basin gate**, feasibility line).

Reincarnation that only adds +1 CP is weak; reincarnation that **unlocks thunder root or raises basin** makes new lives different.

### Element "variants" — superseded for classical elements

Classical five: use **composition + affinity**, not separate variant.  
**Deviants** cover thunder, blood, ice, etc. (see above).

**Alternative B** still applies for classical: roll element free, pay to choose.

### What roots must drive (so realms tune against it)

| Output | Used by |
|--------|---------|
| `cultivateSpeedMult` | Chamber gather, breathing technique stack |
| `naturalRealmCap` / watershed tier | Block next realm; raised by **tier ascension rites** |
| `rootGrade` (or derived from talent def) | Cultivate speed / odds; raised by **grade ascension pills** |
| `rootAscensions[]` | Log of spent rites this life (pill/formation id, month, outcome) — prevents double-dip |
| `deviantId` | Awakened via rite or rare event |
| `breakthroughBonus` / trib mods | Crossing attempts |
| `lifespanMult` or per-realm efficiency | Watershed pacing |
| `elementAffinities[]` | Techniques, pills, formations, tribulation flavor |
| `foundationVariantSkew` | FE outcome when technique system lands |
| `coreFeasibility` copy | Creation preview / NPC expectations |
| CP cost | Creation budget |

### CP economy (fix redundancy)

Current: pick grade, traits eat leftovers, **stats identical**.

**Target:**

- **Grade** costs CP (inferior refunds, heavenly expensive / legacy-locked)
- **Composition** costs CP (single cheap, dual moderate, mixed refunds or free default)
- **Chosen affinity** (optional) costs CP on top of roll
- **Traits** stay minor; drawbacks refund CP
- Leftover CP → breathing technique tier at start? small pillar seed? — TBD

Most players should start **mixed or single inferior/common**, not superior.

### Ceiling table (sketch — owner tunes)

| Profile | Typical ceiling without aid | FE peak age (inferior anchor) |
|---------|----------------------------|-------------------------------|
| Mixed inferior | Peak FE, cannot cross GC | ~80–90 |
| Single inferior | GC attempt possible, tight clock | ~75–85 |
| Single common | GC viable with discipline | ~60–75 |
| Single superior | GC + NS path open | ~45–60 |
| Heavenly single | High realms with time | younger |
| False / spoiled root | Fast early, low ceiling trap | varies |

### Special root types (genre flavour, not just stats)

- **False spirit root** — looks good, caps early
- **Consumptive / deviant** — speed now, lifespan tax
- **Mutant** — one element, high ceiling, rare CP / legacy
- **Rootless** — needs external dao to cultivate at all; extreme bypass gameplay

## Open questions

- Basin preview: one oracle line + “fate may shift”, or also show cultivate speed %?
- Dual-root: player picks both classical elements or roll?
- In-run deviant awaken: permanent for that life only, or carry to meta catalog?
- Five-elements constitution: run unlock only, reincarnation only, or both?
- Body/soul paths: same root object or parallel constitution?
- **Derived vs independent basin** — owner confirm (see below)

### Derived vs independent basin (for owner)

| | **Derived** | **Independent** |
|---|-------------|-----------------|
| **Layman** | You pick *what kind of root* (mixed inferior fire-leaning). The world decides *how far heaven lets you go*. | You pick root quality **and** separately pick / buy how far you can go. |
| **Like** | Sect elder reads your root once: “You’ll struggle past foundation.” | Character creator slider: “Max realm: Golden Core” next to “Root: inferior.” |
| **Pros** | Can’t min-max mismatch; feels like fate; fewer creation choices | Fine control for designer; exotic roots with weird caps |
| **Cons** | Table must be balanced; less exotic one-offs | Players game the sliders; “independent tier” fights immersion |

**Recommendation:** **hybrid** — derived at creation; pills, formations, rare events apply **independent patches** mid-run (owner confirmed 2026-07-18).

## Reincarnation unlock ideas (creation meta)

| Unlock | Effect |
|--------|--------|
| +bonus CP | More build budget |
| `mutantRoot` | Deviant roots appear in creation |
| `heavenlyRoot` | Heavenly grade selectable |
| `secondTraitSlot` | More trait picks |
| `fallenNoble` / origins | Story + start effects |
| *(new)* `rootAscensionRecipes` | Tier/grade rite recipes unlock in meta after first successful craft or discovery |
| *(new)* in-run root awakening | Free rare events still possible; primary path = player-crafted single-use rites |
| *(new)* `basinTierBonus` | +1 watershed cap on new life (very rare meta) |
| *(new)* breathing manual tier | Start with better cultivation technique |

## Prerequisites

- [ ] Owner picks axis model (tier+grade vs grade+composition only)
- [ ] Owner picks element / affinity rule (A, B, or C above)
- [ ] Replace `TALENT_GRADES` in `data.js` + creation UI
- [ ] Root ascension recipes (alchemy + formation data) — grade vs tier split
- [ ] Wire permanent root upgrade on rite success; update oracle preview text

## Implementation crumbs

- `data.js` — `TALENT_GRADES`, `TALENT_ELEMENTS`, creation CP
- `talent.js` — caps, mults
- `main.js` — creation UI, preview (speed, cap, core feasibility)
- [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md) — method pool, essence, active method
- `technique-driven-cultivation.md` — foundation variant × method at seal
