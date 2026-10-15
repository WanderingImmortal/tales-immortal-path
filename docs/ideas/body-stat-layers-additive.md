# Body path — additive stat layers (External → Inner)

| Field | Value |
|-------|-------|
| **Status** | `designed` (principle — tune formulas at implement) |
| **Blocked on** | External v1; combat stat derivation |
| **Issue** | none yet |
| **Chat / PR** | Carry-forward without multiplication — 2026-10-15 |
| **Updated** | 2026-10-15 (weave evolution chain) |

## Intent

Body cultivation **excavates** different **physical layers** over time. Gains are mostly **additive** (+skin + flesh + bone + … per region/axis), not **multipliers** stacked on one number (qi path *may* use mult-style foundation — body lean is different). Effort **carries over**; idx 1 **adds new terms** to the same palm (or torso), it does not rewrite the old term.

Related: [`body-external-tempering-depth.md`](body-external-tempering-depth.md) § Excavation, [`nine-realm-ladder.md`](nine-realm-ladder.md) idx 0–1.

## Layer stack (lean)

Each **region** (e.g. palm, forearm, torso) accumulates contributions from **layers** unlocked by realm idx:

| Layer | Unlocked @ | Trained by (baseline) | Contributes (examples) |
|-------|------------|----------------------|-------------------------|
| **Skin** | External (0) | Paste, drills, environment | Cut resist, surface hardness |
| **Flesh** | External (0) | Paste, load, impact | Strike mass, shock soak |
| **Bone** | Inner (1) | Soak, setting, load | Rigidity, weight behind blow |
| **Organ** | Inner (1) | Interior soak, breath | **Regulation** — see below |

**Palm strike (example formula lean):**

```text
palm_strike = f( skin_palm, flesh_palm, bone_palm, organ_terms… )
```

Each term is its **own** grind with its **own** mountain tail. Inner palm work = **bone_palm** climbing from 0 — **+1 +1** next to existing skin/flesh, not `1.2 × (skin+flesh)`.

**Qi contrast (non-gospel):** dantian density / foundation might **scale** outputs; body **adds limbs and layers** to the hoard.

## Organs — not limbs (lean)

Organs are **weirder**: not a map pin like “palm bone.” Treat as **whole-body regulators** (small set: heart/lung, liver/gut, kidney/core — names TBD, not anatomy sim).

| Organ role | Mechanic lean | Not |
|------------|---------------|-----|
| **Heart / lung** | Recovery rate, fatigue clear, “second wind” | +1 sword damage |
| **Liver / gut** | Poison/toxin ceiling, salve toxicity tolerance | Regional strike |
| **Kidney / core** (metaphor) | Stress budget, soak duration | Duplicate flesh bar |

**Coefficients (narrow use):** organs may **multiply recovery or tolerance** (1.0 → 1.15), not strike damage — keeps “palms are additive, guts are chemistry.”

Optional: organ **gates** bone efficiency (“without lung soak, bone_palm gains at 50%”) — prerequisite, not hidden mult on damage.

## Why Inner can refine skin/flesh **past** External (not “because breakthrough”)

Players may not read this paragraph; they **will** notice if tier-II paste works with **no** explanation. One rule should drive **rejection @ External**, **brace flavor**, and **tier-II unlock @ Inner**.

**Lean (owner 2026-10-15):**

| @ External | @ Inner (after brace + break) |
|------------|-------------------------------|
| Essence **deposited** in skin/flesh like **dye in cloth** — holds tier-I grain, **leaks or sloughs** tier-II | **Interior frame online**: bone lattice + organ regulators **anchor** exterior grain; essence can **circulate and bind** |
| Harsh inputs **reject** (fever, shedding, scar) — body has no **metabolism** for them | Organs **process** fierce baths; waste routes exist |
| Mortal **weave** — material compatibility table tier-I only | **Vessel weave** — same palms, **different biology**; tier-II table unlocks |

The breakthrough is not a **+1 level** button — it is **mini-evolution**: lifespan band, interior economy, compatibility. You are not the same being; you are the same **person** with a **deeper hold**.

**Pedantic one-liner for UI/tooltips:** *“Tier-II salves require an anchored frame — temper the interior first, or the flesh sheds what it cannot keep.”*

**Cheap answers to avoid:** “realm idx incremented”; “game said so”; multiplier on stats.

**Qi rhyme (non-gospel):** QC stores qi in a **mortal basin**; FE is a **different kind of hold**. Body rhyme: External is **deposit**; Inner is **deposit + circulation under brace**.

## Mountain tail **shifts** — tier access, not “more same skin”

Problem: training **more skin during Inner** feels wrong if it’s the same hide-grit loop.

**Lean: two axes per exterior layer**

| Axis | Meaning |
|------|---------|
| **Adaptation %** | How trained this layer/region is (0–100 within **current material tier**) |
| **Material tier** | What grain the body can **hold** without rejection |

@ **External Late**, you hit **tier-I ceiling** on adaptation (mountain tail on hide/salve).

@ **Inner break**, the frame can **accept tier-II inputs** (jade-blood paste, marrow wash, etc.). You *may* continue **skin** training, but sessions consume **higher-tier** materials and advance **grade** (Iron Palm → Jade Palm **label**) or a separate **refinement grade** track — not infinite +1 from tier-I paste.

So the tail **shifts**: new curve, new asymptote, **gated by wealth + inner stability**, optional side investment vs rushing bone_palm on the same region.

**Player read:** “My palms were maxed for **mortal hide**; now I’m **re-facing** them with **inner-grade salve**” — not “I’m still grinding Bronze Skin bar.”

## Region + layer matrix (idx 1 palm example)

| | Skin | Flesh | Bone | Organ |
|--|------|-------|------|-------|
| **External** | ✓ train | ✓ train | locked | locked |
| **Inner** | tier-II optional | tier-II optional | ✓ **palm bone** train | whole-body soak |

Specialist: 60y external → high skin_palm + flesh_palm. Inner: 20y bone_palm + ignore tier-II skin → monster open-hand. Generalist: tier-II pass on all regions, lower bone peaks.

## Carry-forward (no waste)

| On break 0→1 | |
|--------------|--|
| **Keep** | All tier-I adaptation % and grains (skin_palm, flesh_palm, tags, scars) |
| **Unlock** | bone_*, organ regulators, tier-II **eligibility** |
| **Do not** | Reset skin to 0; multiply old into new |

**Dedicated years** remain in the **first addends**; new realm adds **new addends** (and optional **new tier** on exterior).

## When to break vs keep grinding (unchanged intent)

- **Break:** new addend families (bone, organ), lifespan, tier-II **access**, higher **idx** parity.
- **Stay @ External tail:** legendary mortal on tier-I only — valid PvP niche until rivals Inner.

## Weave evolution — same pattern, higher watersheds (owner lean 2026-10-15)

Shorthand (“next realm lets you refine skin again”) is **tacky in UI**; **weave evolution** is the real rule: each major break changes **what the body can hold and circulate**, which **reopens productive grind** on older layers at a **new material tier** — not a reset, not a hidden × stat.

**Template (every body watershed):**

1. **Diegetic change** — what new structure or economy exists after break?
2. **Compatibility bump** — which material tier / layer family unlocks?
3. **Optional re-face** — older layers may climb a **new tail** (wealth + time sink).
4. **New addends** — new layer or system (bone, pearl, meridian, rune budget, …).

| Break → | Weave name (flavor) | What’s **different** (one line) | Compatibility / re-face |
|---------|---------------------|----------------------------------|-------------------------|
| **0 → 1** External → Inner | **Vessel weave** | Interior anchor + organ metabolism | Tier-II on skin/flesh; **bone/organ** addends |
| **1 → 2** Inner → Essence Pearl | **Kernel weave** | Blood and nerve recipe **condense** toward one pearl | Tier-III inputs on blood/pearl track; optional re-face bone/flesh at pearl-grade |
| **2 → 3** Inner → **Nascent Physique** *(owner lean: maybe here)* | **Born physique** | Recipe **locks** into a named body; meridians **channel** the kernel | **Either:** last mortal-tier re-face pass **or** stop re-facing here — see below |
| **3 → 4** Nascent → **Physique Transformation** *(owner lean: or here)* | **Forge-grade stock** | **Category change** — body becomes medium for runes / line | **New material class** (forge reagents); re-open **all prior layers** at transformation-tier (optional side grind) |
| **4+** | Runeforging, Source, … | Rune seats, inner hearth, source install | Line-specific; not “skin bar again” unless line demands it |

**Owner split (pick one primary “full stack re-open” moment):**

| Option | Pros | Cons |
|--------|------|------|
| **Nascent Physique (3)** | Still on chamber figure; “hatch” feels like everything clicks into one body | Risk: overlaps pearl’s job |
| **Physique Transformation (4)** | Clear **metamorphosis**; mortal dig clearly ended | Later; long wait for “refine skin again” |

**Lean:** smaller **compatibility bumps** at **1 and 2** (targeted re-face + new addends); **big “prior layers may re-face at top material tier”** at **Physique Transformation (4)** — Nascent (3) focuses on **hatch + meridians**, not another full skin slog unless player chases perfect seal.

**Player-facing pattern (repeat forever):** *“This material demands a {pearl / forged / sourced} body — your current weave sheds it.”* Same muscle as tier-II @ Inner.

**Not every break must re-open everything** — avoids infinite mandatory back-grind. Optional **legendary** re-face at PT for min-maxers; main path = new layer only.

## Open questions

- Combat: expose full decomposition in UI or one “Palm: crushing” chip?
- Tier names: material (iron/jade) vs realm (External/Inner grade)?
- Pearl idx 2: does blood add another **addend** or **upgrade tier** on all prior?
- **Lock:** full-stack re-open @ Nascent (3) vs Physique Transformation (4) — table above leans **4**.

## Prerequisites

- [ ] Derive combat stats from layer map on `G.bodyChamber` (or physique object)
- [ ] Inner Tempering soak doc (idx 1 verbs)
