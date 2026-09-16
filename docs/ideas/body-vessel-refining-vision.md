# Body path — vessel refining vision (design hub)

| Field | Value |
|-------|-------|
| **Status** | `designed` (workshop — owner 2026-09-16; **no implementation until owner says**) |
| **Blocked on** | Combat damage pass ([`combat-damage-depth.md`](combat-damage-depth.md)); anatomy P2 polish |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chats 2026-09-16 (stats/body granularity → vessel state → harmonize → co-refine → novel alignment) |
| **Updated** | 2026-09-16 |

## Intent

Body cultivation should feel like **refining a living vessel** — limb by limb, material by material, with **endless variation** in the xianxia novel sense: legendary methods, impossible materials, asymmetric bodies, clash and mastery — **without** recipe-locked physiques or a wiki build guide.

The player **is** a **vessel state** (a map of what they built). Named physiques and jianghu titles are **what the world calls you**, not achievements unlocked by checklist.

**Planning only** until owner greenlights implementation.

---

## For agents (read before iterating)

This doc is the **source of truth** for the body-refining redesign workshop. Related docs add combat spine, visuals, sect fiction — link here instead of re-deriving from chat.

### Do not “iterate on top” by default

When something feels limiting, **check whether the foundation needs to change** before adding another layer:

| Symptom | Prefer |
|---------|--------|
| Another global `+X%` bonus | Regional imprint + expression |
| New physique as unlockable SKU | Vessel state + optional world name |
| Clash = only debuff | Harmonize → tension → spend / co-refine |
| Recipe table for builds | Principles, pair recognition, emergent fingerprint |
| One word for multiple processes | Use vocabulary below (imprint / harmonize / co-refine) |

The [**Novel alignment guide**](#novel-alignment-guide-not-rules) below is a **feel checklist**, not a locked spec. Use it to widen the design when the sim feels thin — not as a mandatory feature list.

### Supersedes / extends

- Extends [`body-path-refining-rewrite.md`](body-path-refining-rewrite.md) (ACS lean, milestones as power ruler).
- Combat expression: [`combat-damage-depth.md`](combat-damage-depth.md) (four systems, structure outcomes — **not** limb HP bars).
- Visuals: [`body-chamber-anatomy-rebuild.md`](body-chamber-anatomy-rebuild.md).
- Parked anatomy damage note: [`combat-anatomy-damage.md`](combat-anatomy-damage.md) (superseded in spirit by damage-depth + this doc).
- Forbidden: [`soul-body-refining.md`](soul-body-refining.md). Sect: [`body-path-sect.md`](body-path-sect.md). Rules: [`vessel-rules-design.md`](vessel-rules-design.md).

---

## Path asymmetry (qi vs body)

| | **Qi path** | **Body path** |
|--|-------------|---------------|
| **Trains** | Dantian | Vessel (parts + layers) |
| **Body relationship** | Collateral — must survive tribulation | The project — body **is** the weapon |
| **Passive body growth** | **Overflow** on breakthrough (see below) | None — active refinement only |
| **Customization** | Low (overflow is shallow, untagged) | High (composition, methods, clash mastery) |
| **Poisons** | External (battle coats) | Internal (marrow, bone, Thousand Poisons arc) |

Qi mains being **worse at body expression** than body mains is **expected**, not a balance bug.

### Qi overflow (leakage)

When the dantian breaks open or consolidates, surplus qi **sloshes into flesh**.

| Property | Direction |
|----------|-----------|
| **When** | Breakthroughs, major consolidation (FE seal, GC condense, …) — not every cultivate tick |
| **What** | Passive progress on **global** shallow layers (skin/flesh) or small one-time bump |
| **Ceiling** | Hard cap per realm — e.g. never exceeds ~30–40% of a body-main at same idx without switching focus |
| **Combat** | Baseline **Flesh hardness** only — untagged, no imprint, no tension play |
| **Flavor** | “Impure overflow” — effective but shallow |

Optional: overflow quality tracks root purity (single root = clean bias; pentamixed = messy).

---

## Vocabulary (use consistently)

| Term | Meaning |
|------|---------|
| **Vessel state** | Whole-body map — always true, never “unlocked” |
| **Region** | Gameplay part (~6): head, torso, arm-l, arm-r, leg-l, leg-r (extend later) |
| **Layer** | skin → flesh → bones → organs → blood → meridians → nerves |
| **Imprint** | Element / essence / poison set in a region (first refinement) |
| **Depth** | How far a layer is pushed in that region |
| **Purity** | Clean settle vs rushed / clashed / scarred |
| **Link** | Meridian connection quality between neighbors |
| **Tension** | Stored clash energy on a **link** between opposing imprints |
| **Harmonize** | Comprehension — **wield** both imprints; spend tension — **does not overwrite** |
| **Co-refine** | **Second** material pass — dual-element **alloy** tissue; better regional stats |
| **Alloy** | Co-refine product on a layer (e.g. dual fire-water bone) |
| **Physique name** | Optional jianghu / chronicle label for dense fingerprint — **not** a power source |

Avoid one umbrella word **“synthesis”** — reserve for co-refine **products** if needed (“steam marrow synthesis”).

---

## Four stacked layers (novel model)

Novel body arcs stack; our systems should map to all four:

```text
① CONSTITUTION (seed)     Innate or awakened — what the vessel tolerates / leans toward
② METHOD (scripture)      Legendary art — *how* you refine (rules, revolutions, failure)
③ MATERIAL + PLACE        What you feed it / where you sit (essence, site, trial)
④ EXPRESSION              Traits, apertures, world names — what they see
```

**Today’s workshop depth:** strong on ③ + vessel state; **harmonize/co-refine** bridge ③→④; **thin on ①②** and legendary **texture** — see [Novel alignment guide](#novel-alignment-guide-not-rules).

---

## Core object: region imprint

Chamber already has limb-shaped bone actions (`hands`, `arms`, `legs`, …) but bonuses aggregate globally. Target: **what you fed each region** matters.

Per **region**:

| Field | Role |
|-------|------|
| `depth` | Layer progress here (skin → marrow …) |
| `imprint` | Dominant element / essence / poison / beast-blood |
| `purity` | Rushed, clashed, fever, scarred |
| `link` | How well meridians connect to neighbors |
| `alloy` | Optional — co-refined dual-element **material** on a layer |

### Stat aggregation (no explosion)

**Regions contribute identity; globals contribute caps.**

- **Local:** hardness (Flesh/Structure per slot), on-hit bias, break vulnerability
- **Whole body:** speed, circulation integrity, strain — derived from legs/spine/meridians
- **Dominant read:** top 1–2 imprints by depth × purity (“known for”)
- **Do not** sum six fire limbs into 600% fire

**UI:** silhouette heatmap as character sheet — not twenty detached `%` lines.

### Combat hook (damage pass)

- **No limb HP bars.** One HP kill race; [`combat-damage-depth.md`](combat-damage-depth.md) four systems.
- Structure break (`arm` / `leg` / `frame`) **biases** toward lowest regional hardness × purity.
- Harmonized tension **spend** tilts stress / nature on hits.
- Co-refined alloy raises regional hardness ceiling.

---

## Five-step pipeline (body path only)

```text
① FIRST REFINE     Set imprint on region + layer
        ↓
② CIRCULATE        Meridians link neighbors
        ↓
③ CLASH → TENSION  Opposing imprints store tension on links
        ↓
④ HARMONIZE        Comprehension — wield both; tension useful
        ↓
⑤ CO-REFINE        Second pass — dual-element alloy; better stats
```

| Step | Skippable? | Notes |
|------|----------|-------|
| First refine | No | Blind refining OK |
| Circulate | Partial | Weak link = more leak |
| Tension | Auto if clash | Fuel on link |
| Harmonize | Yes | Ignorant / scattered bodies viable |
| Co-refine | Yes | Harmonize-only builds exist; best regional stats need alloy |

**Harmonize** = harnessing both powers **within** you — fire still fire, water still water.  
**Co-refine** = re-temper tissue with both energies **together** — alloy at **material** layer; history preserved in chronicle + silhouette.

Co-refine without harmonize: lean **fail / injury / impure alloy**; genius fever may count as one-shot harmonize.

---

## Imperfection (not failure)

| Kind | What happened | Feel |
|------|---------------|------|
| **Gap** | Region never refined | Obvious weak point |
| **Clash** | Neighbor imprints fight | Fever, leak, wasted time — body still works |
| **Rush** | Low purity success | Shallow — breaks early |

**Completeness** = coherence, not a recipe:

| Coherent shape | Description |
|----------------|-------------|
| Monotone | One element deep everywhere |
| Cycle | Productive phase relation + bridges |
| Duel body | Opposite limbs **on purpose** + bridge work |
| Chimera | Beast + human + poison — high strain |
| Scattered | No bridges — friction-heavy, valid |

---

## Knowledge (principles, not recipes)

| Source | Gives |
|--------|--------|
| Manual / elder | “Poison in marrow before skin — invert, fever.” |
| Alchemist | Material nature vs your imprint |
| Journal | Your attempts, purity, friction delta |
| Insight | Highlights **tension** — not step 4 of a build |

Players refine how they want; second playthrough = wiser, not same checklist.

---

## Harmonize & tension (comprehension)

Clash is **potential**, not only punishment.

```text
IGNORANT → TOLERANT → HARMONIZED → (co-refine eligible)
  leak      cap strain    spend tension
```

**Tension** lives on the **link**: `[fire arm] ——tension: 62—— [water leg]`

**Comprehension sources:** Yin-Yang / Five Phases dao, **body insight** projects on *your* pair, teacher principles, tribulation fever, genius/talent (shortens road, doesn’t remove clash).

**Graded** — not on/off. Shallow dao shaves friction; deep dao flips tension to power.

### Co-refine (second refinement)

**Gate:** both imprints present, link quality, harmonize tier, tension banked, materials, time.

**Result:** `alloy` tag on region+layer (e.g. dual fire-water bone) — **better** regional stats; imprints still both present.

**Scope:** one region+layer per project (lean) — not whole skeleton in one button.

**Overwrite:** material layer only; harmonize still governs **wielding**.

---

## Element on region (expression sketch)

Same element, different region — different expression (not a recipe table):

| Imprint | Arm/hand | Leg/foot | Torso/spine | Head/skull |
|---------|----------|----------|-------------|------------|
| Fire | speed, ignite | burst mobility | guard break lean | will, fear |
| Water | flow, circulation stress | evasion | regen under hit | sense read |
| Earth | weighted strike | stability, leg-break resist | frame hardness | trib stubbornness |
| Poison | venom on hit | toxic trail | internalize toxin | predator sense, stain↑ |

Depth amplifies; purity scales efficiency; neighbor clash adds **strain** unless harmonized.

---

## Milestones (power ruler)

From [`body-path-refining-rewrite.md`](body-path-refining-rewrite.md) owner lean:

- **Refining = the loop.** Bronze Skin / Iron Bones / … = **milestone labels** at realm **index** parity with qi — not qi-copy breakthrough ritual.
- Milestone **names** can come from depth + revolutions (see novel guide §2) — TBD in implementation.

---

## Novel alignment guide (NOT rules)

Use this to recover **xianxia feel** when the sim feels like a spreadsheet. Items are **guides for future design passes** — go deep one-by-one; none are mandatory scope for v1.

**Novel sentence we want:**

> *He cultivated the **[legendary method]**, fed it **[impossible material]**, survived the **[nth revolution]**, and his **[part]** carries **[named ability]** — the jianghu calls him **[title]**.*

**Alignment scorecard (2026-09-16):** ~65% structure, ~40% legend texture.

---

### Guide 1 — Legendary **methods** (not just materials)

**Novel:** *Nine Revolutions Golden Body*, *Great Sun Scripture* flesh chapter — a **protocol** that changes rules.

**Gap:** Chamber actions are generic (`Temper Hand Bones` + flat `%`).

**Direction:**

- Scarce **body manuals** / inheritances: revolution count, compatible materials, failure flavor, lineage identity.
- Method changes **how** refinement runs — not just which essence you click.
- Freedom: two disciples, same manual, different materials/regions → different vessels.

**Not:** recipe physique unlock.

---

### Guide 2 — **Named sub-stages** inside each layer

**Novel:** *third revolution iron bone*, *jade bone ninth layer*.

**Gap:** Only 0–100% depth visible.

**Direction:**

- **Revolution** counters or named rungs per region+layer.
- UI: `Iron Bone · Third Revolution (left arm)` not `bone 34%`.
- Co-refine / aperture gates may key off revolution cap.

---

### Guide 3 — **Constitution** as seed

**Novel:** Born *Saint Yin Body*; ancient remnant roots a constitution.

**Gap:** Pure emergent fingerprint only — may lose innate punch.

**Direction:**

- **Vessel seed** (innate or one-time awakening): tolerances, method affinity, clash lean — **not** a destination build.
- **Vessel state** = journey on top.
- Legendary trial physiques (Thunder Soul, …) = **events**, not composition recipes.

---

### Guide 4 — **Environmental & trial** tempering

**Novel:** Lightning gorge nine days; dragon miasma bath; tribulation hammers bone.

**Gap:** Chamber-only weeks + items.

**Direction:**

- **Sites / ordeals** as refinement venues — same action, different **place** = different ceiling or imprint bias.
- Hooks: [`cultivation-sites-and-claims.md`](cultivation-sites-and-claims.md), tribulation rework.

---

### Guide 5 — **Specific legendary traits** (rule-breakers)

**Novel:** Needles cannot pierce; palm shatters treasures; pores as blades.

**Gap:** Hardness / stress only — generic.

**Direction:**

- Small set of **trait** unlocks from deep co-refine or revolution capstone — rule-bending passives tied to **what** you built.
- Example: steam alloy capstone → first hit ignores defend once per fight.

---

### Guide 6 — **Divine abilities from parts**

**Novel:** Evil Eye, Dao Bone, Heavenly Punishment Palm.

**Gap:** Eyes mentioned; organs are stat buckets.

**Direction:**

- **Aperture** unlocks — body techniques / passives gated by region depth + method + revolution.
- Harmonize = wield clash; aperture = **part becomes a move**.

---

### Guide 7 — **Manual scarcity & master lineages**

**Novel:** Cannot use dragon blood without the **art**; sect methods incompatible; stolen manual is plot.

**Gap:** Principles-only may lack lineage bite.

**Direction:**

- **Method exclusivity** — Vajra marrow art vs blood gorge corpse refining = different **rules**.
- Experimentation works at low purity; legendary outcomes want lineage or remnant.
- Balance: many materials, **few methods you truly understand**.

---

### Guide 8 — **Battle forging & remold**

**Novel:** Bone cracks in fight → re-refine stronger; crippled → remold physique.

**Gap:** Soft clash failure.

**Direction:**

- **Break → opportunity** — remold projects after structure break, near-death, trib scar.
- High stakes without bricking run if remold path exists.

---

### Guide 9 — **Jianghu recognition**

**Novel:** *"That's the Undying Vajra!"* — envy, assassination, recruitment.

**Gap:** Emergent names without world reaction.

**Direction:**

- Standing hooks when fingerprint crosses thresholds — rumors, sect interest, bounty, trade premium.
- Names are **social**, not private journal only.

---

### Guide 10 — **Scale & pacing fantasy**

**Novel:** Decades per bone layer; arc-long quest for one material.

**Gap:** 2-week chamber buttons.

**Direction:**

- **Weight classes** — same loop; legendary tier = **projects** (months/years, seclusion, chronicle chapters).
- Acknowledge time in fiction even if game compresses.

---

## Work queue (when owner says build)

Suggested order — **each guide can get its own workshop pass before Issues**:

1. [ ] Vessel state data model + regional imprints (replace global `%` chamber bonuses)
2. [ ] Bridge to combat damage pass (hardness, break bias)
3. [ ] Tension + harmonize (comprehension hooks)
4. [ ] Co-refine projects
5. [ ] Novel guides 1–10 — **one guide per design pass**, foundational changes allowed

---

## Open questions (parked — owner said hold)

- Co-refine scope: one limb per project vs matched sets?
- Tension decay when ignorant vs harmonized?
- Triple+ element alloys per region?
- Harmonize per clash pair vs one global balance score?
- Clash punishment: soft (friction) vs hard (permanent scar until cleanse)?

---

## Implementation crumbs

| Area | Files / ideas |
|------|----------------|
| Chamber today | `body-chamber.js`, `BODY_CHAMBER_*` in `data.js` |
| Combat | `combat.js` → `resolveCombatHit`, stress, breaks |
| Physique staging | `physique-cultivation.js`, `TRAINABLE_PHYSIQUES` — likely rework |
| Milestones | `PATHS.body`, `body-path-refining-rewrite.md` |
| Manuals | [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md) — body branch TBD |
| Sites | [`cultivation-sites-and-claims.md`](cultivation-sites-and-claims.md) |

---

## Chat arc preserved (summary)

1. Stats/body granularity — limb hardness vs flat defense; after damage redo.
2. Qi overflow vs body composition; materials clash/synergy; Thousand Poisons as emergent not recipe.
3. **Vessel state** — regional imprints; incomplete bodies OK; silhouette as build.
4. Harmonize — comprehension wields opposing elements; tension as fuel.
5. **Co-refine** — second pass; alloy; harmonize harnesses, co-refine upgrades material.
6. Novel alignment — four layers (constitution / method / material / expression); ten feel guides.
