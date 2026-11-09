# Body path — refinement philosophy & realm ceilings

| Field | Value |
|-------|-------|
| **Status** | **Owner-approved design direction** — mechanics and numerical tuning pending |
| **Blocked on** | Implementation Issues for recipe model, save shape, regional combat (see Open questions) |
| **Issue** | none yet |
| **Chat / PR** | Design-lock PR 2026-11-09 (body refinement philosophy) |
| **Updated** | 2026-11-09 |

## Intent

Lock how **body cultivation** is supposed to work in Wandering Immortal: **transformation through refinement**, not a reskinned qi loop. Realms rename milestones and **change what refinement can do**; they are **not** generic RPG level gates that cap every stat.

This doc **clarifies and extends** the nine-realm body ladder — it does **not** replace [`nine-realm-ladder.md`](nine-realm-ladder.md) § Body path names (owner lock 2026-10-12) or the mortal dig in [`body-path-refining-rewrite.md`](body-path-refining-rewrite.md).

**Read first:** [`body-cultivation-design-implementation-audit.md`](../body-cultivation-design-implementation-audit.md) (code vs design gap, 2026-11-09).

---

## Related documents (do not duplicate here)

| Doc | Role |
|-----|------|
| [`nine-realm-ladder.md`](nine-realm-ladder.md) | Canonical **realm names**, idx 4–8 identity, **Inner Source X/Y/Z** |
| [`body-path-refining-rewrite.md`](body-path-refining-rewrite.md) | Mortal dig, soak fantasy, vessel physique, manuals |
| [`body-external-tempering-baseline.md`](body-external-tempering-baseline.md) | Idx 0 playable slice spec |
| [`body-external-tempering-depth.md`](body-external-tempering-depth.md) | Post-v1 external depth (strain, regions, methods) |
| [`body-stat-layers-additive.md`](body-stat-layers-additive.md) | **Target** additive regional terms — **not** final combat model |
| [`body-path-no-meridians.md`](body-path-no-meridians.md) | Meridians qi-only |
| [`body-dao-design.md`](body-dao-design.md) | Cosmology stub (idea) |
| [`body-path-sect.md`](body-path-sect.md) | Saint / Da Chi fiction |
| [`body-martial-intent.md`](body-martial-intent.md) | 武意 — separate from refinement |
| [`body-realm-journey-and-vital-essence.md`](body-realm-journey-and-vital-essence.md) | Idx **0–5** journey, Vital Essence, Pearl nexus, foundational runes |
| [`body-runeforging-and-vessel-rules.md`](body-runeforging-and-vessel-rules.md) | Body Rune, four foundational runes, Rules, Da Chi |
| [`cultivation-capabilities-stat-architecture-audit.md`](../cultivation-capabilities-stat-architecture-audit.md) | Cross-path stat audit |

---

## 1. Core philosophy — refinement-driven body cultivation

### 1.1 Transformation through refinement (owner lock)

Unlike qi cultivation, body path progression **does not need** to revolve around conventional cultivation **techniques** (typed arts with qi costs).

Central progression = **physically refining the cultivator** via:

- Medicinal treatments and baths
- Physical conditioning and tempering
- **Refinement recipes and procedures** (gather → brew → apply → recover)
- Specialised cultivation **environments** (yards, formations, natural sites)
- Rare materials and substances
- **Destructive tempering** followed by controlled recovery
- Eventually, more sophisticated **internal** refinement (late realms — timing **open**)

**Separate but compatible:** combat techniques, **Martial Intent** (武意), **Vessel Rules** — see [`body-martial-intent.md`](body-martial-intent.md), [`vessel-rules-design.md`](vessel-rules-design.md). Body refinement recipes are **not** qi techniques with different labels.

### 1.2 Potency vs specialised properties (owner lock)

| Concept | Meaning |
|---------|---------|
| **Ordinary medicinal potency** | How effectively a treatment **refines** tissue — stronger bath → more refinement **if** the body can tolerate and absorb it |
| **Specialised properties** | Distinct physiological traits (examples only: lightning-aspected skin, venom tolerance, venomous blood, hyper-dense bone, unusual regeneration) |

**Rules:**

- Higher potency **does not automatically** grant exotic properties.
- Extraordinary traits typically need **appropriate materials, environment, method, or circumstance** — rare materials are **one** route, not the only route.
- Listed examples are **illustrative**, not guaranteed recipe outputs or confirmed shipped traits.

### 1.3 Method matters as much as medium (owner lock)

The **same environment** can support different **intentions**:

| Approach | Example (lightning formation) |
|----------|-------------------------------|
| **Aspected refinement** | Deliberately incorporate or adapt to lightning’s properties |
| **Destructive tempering** | Use lightning to **break down** tissue, then medicines to **rebuild stronger** |
| **Hybrid** | Combine both — may need greater control, materials, or a dedicated procedure |

**Do not** grant automatic elemental traits from exposure alone. The **procedure** (and player/agency choices where applicable) selects outcomes.

Applies by analogy to other environments (waterfalls, poison vats, iron sand, etc.) — see [`body-external-tempering-depth.md`](body-external-tempering-depth.md).

### 1.4 Persistent refinement outcomes (owner lock)

Refinement should eventually produce **meaningful, persistent** physiological changes — per **region**, tissue, organ, or whole body.

**Refinement history matters** for later cultivation — consistent with **Essence Pearl** condensing accumulated work into a **recipe-preserving kernel** ([`nine-realm-ladder.md`](nine-realm-ladder.md) § Inner Source composition).

**Explicit non-goals in this doc:** save schema, combat formulas, UI layout.

### 1.5 Compatibility (owner lock)

Refinements may:

- **Reinforce** one another
- **Coexist** with little interaction
- **Conflict** or interfere
- Be **deliberately fused** into a new transformation

Incompatible combinations should generally need **extra effort, comprehension, method, or resources**. Successful fusion may be extraordinary — **not** a free stack of tags.

**Not locked:** universal incompatibility tables or mandatory trade-off matrices — owner approval required before hard rules.

---

## 2. Ceiling philosophy — realms are not stat caps

### 2.1 No arbitrary realm-based stat caps (owner lock)

**Avoid** design patterns such as:

- “Skin refinement cannot exceed value X until idx 2”
- “Cannot develop property Y because `realmIdx` too low”
- “On breakthrough, **all** existing refinements increase automatically”

Realms are **milestones and state changes**, not conventional RPG level gates. Power **comparison** still uses realm index for world/NPC parity — refinement **quality** is separate.

**Implementation note (audit):** Today’s code uses **global** `bodyChamber.bonuses` % capped by `BODY_CHAMBER_BONUS_CAPS` and **shared** breakthrough stat grants — **legacy shim**, not this philosophy’s target. See [`cultivation-capabilities-stat-architecture-audit.md`](../cultivation-capabilities-stat-architecture-audit.md).

### 2.2 Mortal body limits & diminishing returns (owner lock)

Before **Nascent Physique** and **Physique Transformation**, the cultivator refines a **human body**.

- There is a **meaningful natural limit** to reasonable improvement.
- Approaching the limit → **severe diminishing returns**; repeat treatments on the same grain **adapt / saturate**.
- Stronger treatments may push further but raise **potency, danger, and cost** beyond what a mortal frame tolerates easily.
- Exceptional resources, methods, and circumstances may push further still.

**Unresolved:** whether a mortal ceiling is **absolutely uncrossable** or only **practically prohibitive** (see §5).

**Consistency:** [`body-path-refining-rewrite.md`](body-path-refining-rewrite.md) § Inner Tempering saturation describes **Late / Peak** mortal bands — this doc adopts that **spirit** without fixing formulas.

### 2.3 Extreme low-realm refinement (owner lock)

In theory, a determined, wealthy, talented, or fortunate **low-realm** cultivator might approach **qualities** associated with higher realms — e.g. external work nearing **nascent-grade** density.

- Expected to be **extraordinarily** inefficient, costly, and slow.
- **Lifespan** is a major practical constraint.
- They **do not** automatically gain higher realm **structural capabilities** or **state of existence** (e.g. no substitute for **hatching** vessel physique @ idx 3, **PT line** @ idx 4, **runes** @ idx 5, **inner source** @ idx 7).

Unusual feats remain **possible** without making advancement meaningless.

### 2.4 How realms change refinement potential (owner lock)

Breakthroughs change **underlying state** — opening more effective or **fundamentally different** refinement modes — **not** “+20% to all layers.”

| Idx | Realm | Refinement ceiling / potential (design) |
|-----|--------|----------------------------------------|
| **0** | External Tempering | Exterior shell; mortal human constraints; saturation on skin/flesh |
| **1** | Inner Tempering | Interior soak; bones/organs; still **mortal vessel** |
| **2** | Essence Pearl | Condense accumulated recipe toward **kernel**; blood/nerve work |
| **3** | **Nascent Physique** | Recipe **hatches** → **vessel physique**; **substantial** expansion of potential; no longer constrained **as an ordinary human body**; chamber mortal dig **ends** |
| **4** | **Physique Transformation** | **Fundamental** vessel category change; **line**, forge budget, rune affinities; refinement range/depth **dramatically** expanded — **qualitative**, not a simple multiplier |
| **5** | Runeforging | Permanent runic capabilities (per [`nine-realm-ladder.md`](nine-realm-ladder.md)) |
| **6** | Source Furnace | Prepare inner hearth for install |
| **7** | Inner Source | Install/refine generative core (X/Y/Z) |
| **8** | Saintly Flesh | Sanctify source; Saint capstone |

**Preserve without redefinition:** idx **5–8** identities per [`nine-realm-ladder.md`](nine-realm-ladder.md) owner lock 2026-10-12. Do not invent extra “ceiling expansions” beyond what those realms already mean.

### 2.5 Breakthrough does not auto-perfect the body (owner lock)

New realm → **new potential**, not automatic completion of every tissue.

- Prior refinements **persist** unless a transformation or **conflict resolution** explicitly alters them.
- A **heavily refined** lower-realm cultivator may exceed a **newly advanced** higher-realm cultivator in **specific** physical qualities.
- They still lack the higher realm’s **distinct capabilities** (runes, inner source, etc.).

### 2.6 Advancement vs brute-forcing (owner lock)

**Qualitative principle:** transformations that are **prohibitively** expensive, dangerous, or slow at idx *n* often become **practical** at idx *n+1*.

Example shape: decades and vast resources at External Tempering to approach one outcome that Inner Tempering or Nascent makes **routine** — **not** a fixed numerical formula.

### 2.7 Extreme investment within a realm (owner lock)

A Physique Transformation cultivator may spend **centuries** refining every region — subject to lifespan, materials, risk — **without** artificial caps solely to force breakthrough.

They might reach extraordinary **physical** qualities while still lacking **Source Furnace / Inner Source** capabilities.

---

## 3. Nine-realm ladder — preserved identities

**Do not rename, reorder, or merge.** Canonical table lives in [`nine-realm-ladder.md`](nine-realm-ladder.md) § Body path names.

| Idx | Body realm | Design identity (summary) |
|-----|------------|---------------------------|
| 0 | External Tempering | Refine the **exterior** vessel |
| 1 | Inner Tempering | Deeper tissues — **soaking** and related interior methods |
| 2 | Essence Pearl | Condense refinement into **recipe-preserving kernel** |
| 3 | Nascent Physique | **Hatch** distinctive **vessel physique** |
| 4 | Physique Transformation | **Fundamentally transform** vessel; establish **line** |
| 5 | Runeforging | Forge permanent **runic** capabilities |
| 6 | Source Furnace | Prepare **inner furnace** for source installation |
| 7 | Inner Source | **Install and cultivate** generative source |
| 8 | Saintly Flesh | **Sanctify** vessel and source |

### Essence Pearl → Inner Source continuity (owner lock 2026-10-12)

**Preserved from** [`nine-realm-ladder.md`](nine-realm-ladder.md) § Inner Source composition — do not alter:

| Layer | From journey | Role |
|-------|--------------|------|
| **X — Engine** | Essence Pearl (recipe, consolidation) | Output rhythm, depth curve, recovery under load |
| **Y — Expression** | Physique Transformation **line** | Element / presence / how power **shows** |
| **Z — Affordances** | Major **runes** (modules); minors tune | Source-backed **verbs** |

- **Inner Source** = Essence Pearl in **engine phase** (same object lineage, new job).
- **Runes stay on the body** — they do **not** merge into the source.

---

## 4. Internal refinement progression (owner lock)

| Phase | Control model |
|-------|----------------|
| **Early (mortal dig, ~idx 0–2)** | Cultivator controls **external conditions** — medicines, baths, exposure, conditioning, recovery |
| **Middle (~idx 3–4+)** | Sophisticated **vessel state** may permit more **deliberate** internal steering — **details open** |
| **Late (idx 6–7)** | Source Furnace → Inner Source = **fundamentally different** internal capabilities |

**Unresolved:** first realm at which **limited direct internal** refinement is possible — **do not assume** a specific idx.

**Locks:**

- **Do not** move Inner Source installation **before idx 7**.
- External materials and environments may remain **relevant** even for advanced cultivators.

---

## 5. Anatomy & combat (design direction only)

**Intention** — cultivated properties can be **anatomically meaningful** (not permission to implement regional injury in this PR):

- Hardened **skin** does not imply equivalent **organ** durability.
- Lightning-resistant **skin** does not imply safe lightning in **blood** or **nerves**.
- Regional refinement → **asymmetric** physiques.

**Design target:** avoid reducing all refinement to **single global % bonuses** — see [`body-stat-layers-additive.md`](body-stat-layers-additive.md). Current code global buckets are **implementation debt**, not north star.

---

## 6. Conflicts & superseded statements

| Topic | Older / code-adjacent | This direction |
|-------|----------------------|----------------|
| **Realm = layer index** | Early chamber treated “realm as deepest layer” | Realms **0–3** = dig milestones; layers are **not** realms ([`body-path-refining-rewrite.md`](body-path-refining-rewrite.md) — **aligned**) |
| **Global % combat bonuses** | `BODY_CHAMBER_BONUS_CAPS`, audit | **Superseded as design target** — refinement should persist as **properties/recipe**, not only capped % |
| **Vessel Rule swear gate** | Code @ vessel idx **2** (`data.js`) | Design **lean** idx **5–6** when runeforging ships — **unresolved** (§7 #8) |
| **Mortal saturation** | “Late = cannot soak more” in rewrite | Compatible with **diminishing returns**; **absolute** hard ceiling **not** settled here |
| **Trainable physiques** | `TRAINABLE_PHYSIQUES` in code | Parallel to **vessel physique** @ Nascent — relationship **open** (§7 #7) |

Historical docs (Bronze Skin ladder, Vessel Establishment as realm name) remain in git history — **superseded** by nine-realm names in [`nine-realm-ladder.md`](nine-realm-ladder.md).

---

## 7. Open questions (explicit — do not settle here)

1. Mortal ceiling: **absolute** vs **practical** only.
2. Mathematical model: diminishing returns, saturation, material potency curves.
3. **Per-realm** internal-refinement capabilities (what unlocks when).
4. Save representation of refinement properties and recipe.
5. How **Essence Pearl** records and preserves the refinement recipe (data model).
6. Incompatible refinement **fusion** procedures.
7. **Vessel physique** vs **trainable/legendary** `G.physique` projects.
8. Final **Vessel Rule** swear gate (idx 2 code vs idx 5–6 lean).
9. **Body Dao** embodiment and **sanctification** mechanics @ Saintly Flesh.
10. Regional refinements in **combat and injury**.
11. Representing **methods and environments** in gameplay (formations, sites, manuals).
12. **Ordinary training** developing unusual properties without rare materials.

---

## 8. Implementation crumbs (for later Issues only)

Not in scope for this design lock:

- `body-chamber.js`, `data.js` `BODY_VESSEL_REALM_SPINE`, `physique-cultivation.js`, `vessel-rules.js`
- [`stats-to-meters-rework.md`](stats-to-meters-rework.md) vessel meter facade

When implementing, tag Issues with **this doc** + [`nine-realm-ladder.md`](nine-realm-ladder.md).

---

## Acceptance checklist (design reader)

After reading this doc + ladder cross-links, a developer should understand:

1. Body cultivation is **refinement-driven**, not reskinned qi techniques.
2. **Methods, materials, and environments** determine pursued transformations.
3. **Potency** and **extraordinary properties** are distinct.
4. Human body has **natural limits** and **severe diminishing returns**.
5. **Extraordinary low-realm** refinement remains theoretically possible.
6. **Nascent Physique** expands refinement potential substantially.
7. **Physique Transformation** expands it dramatically (qualitative).
8. Realm advancement **opens possibilities**, does not auto-perfect the body.
9. **Extreme within-realm** investment remains valid.
10. **Essence Pearl → vessel physique → Inner Source (X/Y/Z)** continuity is preserved.
