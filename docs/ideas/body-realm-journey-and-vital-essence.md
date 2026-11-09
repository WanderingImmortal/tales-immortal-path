# Body path — realm journey (idx 0–5), Vital Essence & Runeforging

| Field | Value |
|-------|-------|
| **Status** | **Owner-approved direction** (idx 0–6 journey, Vital Essence, Pearl nexus, foundational runes, combat parity) + **provisional** items clearly marked below |
| **Extends** | [`body-refinement-philosophy-and-ceilings.md`](body-refinement-philosophy-and-ceilings.md) — **does not replace** ceilings, potency vs properties, or X/Y/Z |
| **Blocked on** | Gameplay loops @ idx 1–5; Vital Essence terminology; rune implement; Vessel Rule swear gate migration |
| **Issue** | none yet |
| **Chat / PR** | Documentation PR 2026-11-09 (realm journey post–PR #228) |
| **Updated** | 2026-11-09 |

## Intent

Record a **continuous story** for the first six body realms — from exterior refinement through **Runeforging** — anchored in **universal Vital Essence** (working name) and a **physical Essence Pearl** nexus. Preserves [`nine-realm-ladder.md`](nine-realm-ladder.md) names and idx **6–8** as-is.

**Code today (audit):** idx **0** external slice shipped; idx **1–3** share one seven-layer chamber without soak vats, pearl object, or vessel physique; idx **4–8** stubs. See [`body-cultivation-design-implementation-audit.md`](../body-cultivation-design-implementation-audit.md).

---

## Legend — what is locked here

| Tag | Meaning |
|-----|---------|
| **Owner-approved** | Direction to implement against unless owner explicitly revises |
| **Provisional** | Promising; examples, timing, or mechanics **not** canonical |
| **Unresolved** | Explicitly open — do not ship as fact |

---

## Related documents

| Doc | Role |
|-----|------|
| [`body-refinement-philosophy-and-ceilings.md`](body-refinement-philosophy-and-ceilings.md) | Refinement loops, realm **ceilings**, open Qs — **parent** |
| [`nine-realm-ladder.md`](nine-realm-ladder.md) | Nine names, through-line, PT vs Nascent, Runeforging lean, **X/Y/Z** |
| [`body-path-refining-rewrite.md`](body-path-refining-rewrite.md) | Mortal dig, soak/saturation, chamber 0–3 |
| [`body-external-tempering-baseline.md`](body-external-tempering-baseline.md) | Idx **0** playable spec |
| [`body-stat-layers-additive.md`](body-stat-layers-additive.md) | Regional additive combat **target** |
| [`body-dao-design.md`](body-dao-design.md) | Body Dao cosmology **stub** |
| [`vessel-rules-design.md`](vessel-rules-design.md) | Oaths, swear gate **migration lean**, Blood / Unnamed |
| [`body-martial-intent.md`](body-martial-intent.md) | 武意 — combat mastery, **not** Vessel Rules |
| [`body-path-sect.md`](body-path-sect.md) | Saint / Vajra Ridge fiction |

---

## 1. Universal Vital Essence — **Owner-approved**

Every **living physical body** naturally possesses an underlying **Vital Essence** (*working name — not final terminology*).

| Aspect | Direction |
|--------|-----------|
| **What it is** | Something fundamental to **physical existence** — tied to flesh, blood, marrow, organs, and life-sustaining **processes** |
| **What it is not (design lock)** | **Not assumed** identical to **spiritual qi** stored in the dantian; **not** mandating a new generic **energy bar** or spendable combat resource |
| **Body cultivation** | Refines the physical body → **changes qualities expressed** through Vital Essence |
| **Specialised refinements** | May **colour** or **specialise** the character of that essence |

**Unresolved:** exact metaphysics, final hanzi/term, explicit coupling to qi path resources, save representation.

**Consistency:** Does **not** contradict blood + nerve **work focus** at Essence Pearl idx 2 in [`nine-realm-ladder.md`](nine-realm-ladder.md) — those layers are **where condensation gameplay leans**, not a claim that Vital Essence exists only in blood.

---

## 2. Essence Pearl — physical nexus — **Owner-approved**

The **Essence Pearl** is a **physical kernel** formed by cultivating and **centralising** the body’s natural Vital Essence.

| Principle | **Owner-approved** |
|-----------|-------------------|
| **Not extraction** | Does **not** strip refined qualities **out of** tissues leaving hollow meat |
| **Nexus** | A **central place** that **preserves and organises** qualities from earlier refinements |
| **Distributed body** | Tissues **keep** cultivated properties; Pearl stays **meaningfully connected** to distributed Vital Essence |
| **Not a dantian** | **Do not** redefine as miniature dantian or default qi-style **battery** |
| **Inner Source X** | Pearl lineage becomes **engine (X)** @ idx **7** — unchanged per ladder lock 2026-10-12 |
| **Anatomy** | **Unresolved** — no locked organ/site for the kernel |

### Potential gameplay directions — **Provisional** (not locked)

- Establishing and **stabilising** the kernel  
- **Progressively centralising** Vital Essence  
- **Reconciling** qualities of accumulated refinements  
- Strengthening **Pearl ↔ vessel** relationship  
- Coordinating **cultivated physical power** through the nexus  

**Unresolved:** Essence Pearl cultivator **combat** profile @ idx 2; whether idx 2 is **sustained loop** vs one breakthrough (direction: **needs sustained gameplay**, not condensation-only milestone — **Owner-approved lean**).

**Code gap:** No saved pearl object; nerve capstone is chamber click grind — audit § B.

---

## 3. First six realms — coherent journey — **Owner-approved**

Continuous through-line (extends philosophy doc §3 table):

```text
0 Exterior  →  1 Interior soak  →  2 Pearl nexus  →  3 Vessel born
    →  4 Metamorphosis  →  5 Runic Body Dao
```

### Realm 0 — External Tempering — **Owner-approved**

| | |
|--|--|
| **Purpose** | Refine the **exterior vessel** |
| **Focus** | **Skin + flesh** (not interior soak @ this idx) |
| **Gameplay** | Drills, salves, conditioning, medicinal apply, recovery — [`body-external-tempering-baseline.md`](body-external-tempering-baseline.md) |
| **Outcome** | Refined exterior supporting **deeper** cultivation |
| **Preserve** | Existing **playable** External Tempering design |

### Realm 1 — Inner Tempering — **Owner-approved**

| | |
|--|--|
| **Purpose** | Refine **deeper physical structures** |
| **Focus** | **Bones, blood, organs**, and other internal tissues — **not bones-only** |
| **Gameplay** | Medicinal baths, soaking, steeping, absorption, controlled internal conditioning — [`body-path-refining-rewrite.md`](body-path-refining-rewrite.md) § soak |
| **Outcome** | Internally refined frame that can sustain **extraordinary** later transformations |
| **Lock** | **No** conscious internal restructuring **without** external methods/procedures yet |

### Realm 2 — Essence Pearl — **Owner-approved**

| | |
|--|--|
| **Purpose** | **Physical nexus** for refined Vital Essence |
| **Focus** | Centralise, **stabilise**, **harmonise** accumulated qualities |
| **Gameplay** | Progressive **formation + cultivation** of Pearl; **bodily refinement remains relevant** |
| **Outcome** | Stable kernel carrying the body’s **refinement identity** (recipe toward X) |

### Realm 3 — Nascent Physique — **Owner-approved**

| | |
|--|--|
| **Purpose** | **Birth and nurture** a coherent **vessel physique** |
| **Focus** | Integrate Pearl’s recorded qualities with the **whole body** |
| **Gameplay** | **Provisional:** nurture physique, resolve integration issues, develop distinctive nature |
| **Outcome** | **Nascent vessel physique**; **expanded** refinement ceiling; mortal chamber **ends** |
| **Preserve** | Pearl **recipe → vessel physique** relationship [`nine-realm-ladder.md`](nine-realm-ladder.md) |

**Distinct from idx 4:** Nascent **integrates and nurtures** what soaks built; PT **changes category** of what the physique **can become**.

### Realm 4 — Physique Transformation — **Owner-approved**

| | |
|--|--|
| **Purpose** | **Fundamental** transformation of established physique |
| **Focus** | Metamorphosis beyond prior vessel limits |
| **Gameplay** | **Provisional:** forge-grade treatments, substantial reconstruction, transformative refinement |
| **Outcome** | Transformed physique; **dramatic** ceiling expansion; **PT line**, rune budget, **Y** prep |

**Preserve:** PT **line**, forge budget, Inner Source **Y** — owner lock 2026-10-12.

### Realm 5 — Runeforging — **Owner-approved** (purpose) + **Provisional** (foundational rune list)

| | |
|--|--|
| **Purpose** | Forge **principles associated with Body Dao** into the **transformed** vessel |
| **Focus** | Permanent **runic inscriptions** embodying **broad principles of physical existence** |
| **Gameplay** | **Provisional:** select, prepare, inscribe, refine runes within PT **budget** / forge load |
| **Outcome** | Body bearing runic principles → later **Inner Source Z** affordances |
| **Lock** | Runes stay **on/in body** — **do not merge** into Pearl or Inner Source |

**Organ placement** on/off body: **Provisional** — promising, **not mandatory**.

**Relation to ladder § Runeforging:** Materials + body-art majors + minors **remain valid implementation paths**; this doc adds **Body Dao principle** framing — **not** a replacement for recipe-based forging in [`nine-realm-ladder.md`](nine-realm-ladder.md).

---

## 4. Foundational runes — **Provisional** examples, **Owner-approved** principles

| **Owner-approved** | **Provisional** |
|-------------------|-----------------|
| **Small set** of **broadly accessible** foundational runes at appropriate stage + knowledge/resources | Illustrative only: **Strength, Endurance, Regeneration, Vitality** — **not** final canonical list |
| Express **aspects of physical cultivation**, not a fixed catalogue of unrelated combat techniques | Exact count, names, hanzi |
| **No requirement** to inscribe **every** foundational rune to advance | Mandatory subsets vs “sufficient subset” math |
| Ambition space: partial set, complete set, perfect one rune, discover **unique** runes | Slot count, tiers, combos, numeric bonuses — **do not implement in design lock** |
| Runes may grant capabilities **beyond** current physique; physique specialisation affects **expression** | Combat numbers |

A **perfect full set** is **not** the only viable route or universally optimal build — **Owner-approved**.

---

## 5. Vessel Rules & Body Dao — **Provisional** cosmology, **Owner-approved** non-mandatory rules

| Statement | Status |
|-----------|--------|
| Vessel Rules may embody **personal, physically rooted** relationship with **Body Dao** | **Provisional** (extends [`body-dao-design.md`](body-dao-design.md) stub) |
| Power partly from **that relationship**, not **only** arbitrary self-binding | **Provisional** |
| Runeforging may **deepen** or **physically express** that connection | **Provisional** |
| A Rule might yield a **distinctive rune** | **Provisional** |
| **Foundational runes do not require** Vessel Rules | **Owner-approved** |
| **Not all** unique runes from Rules | **Owner-approved** |
| Vessel Rules **optional** unless owner revises — **not mandatory for sanctification** | **Owner-approved** (contrast: [`vessel-rules-design.md`](vessel-rules-design.md) **interior peak** still expects oath for `hasVesselInteriorPeak` — **documented tension**, not reconciled) |
| **Do not** assume every rune = a Vessel Rule | **Owner-approved** |
| **Do not settle** swear gate idx (code **2** vs lean **5–6**) | **Unresolved** |
| **Preserve** Rule of Blood & Rule of the Unnamed pending review | **Owner-approved** |

### vs Martial Intent — **Owner-approved**

| | **Vessel Rules** | **Martial Intent** |
|--|------------------|-------------------|
| Domain | Relationship to **Body Dao** principles on flesh | **Combat mastery** — press, stagger, tempo ([`body-martial-intent.md`](body-martial-intent.md)) |
| Interaction | **Unresolved** — compatible, not identical |

---

## 6. Combat parity — **Owner-approved** design constraint

| Principle | Detail |
|-----------|--------|
| **Broad parity** | Each body realm should support **comparable combat effectiveness** to the **corresponding qi realm** under similar investment, foundation, resources, experience |
| **Not identical** | Different techniques, styles, win conditions — **not** guaranteed mirror matchups |
| **Body answers** | Mobility, range, control, extraordinary attacks — via refinement, physique, martial techniques, runes, other systems — **credible paths required** |
| **Variety** | Not every body cultivator gets the **same** combat kit |
| **Low beats high** | Exceptionally refined **lower-realm** challengers remain **possible** (see philosophy §2.3) |

**Do not** implement balance numbers in this doc.

**Code today:** Body bonuses feed global combat %; no rune/physique combat parity loop — audit § E.

---

## 7. Upper ladder (idx 6–8) — **Owner-approved** (unchanged)

**Do not redefine** in this PR:

| Idx | Realm | Role |
|-----|--------|------|
| 6 | **Source Furnace** | Inner hearth preamble — not qi void |
| 7 | **Inner Source** | Install/refine generative core |
| 8 | **Saintly Flesh** | Sanctify source; Saint capstone |

**Inner Source X/Y/Z** — preserved verbatim from [`nine-realm-ladder.md`](nine-realm-ladder.md):

- **X** — Engine from Essence Pearl  
- **Y** — Expression from Physique Transformation line  
- **Z** — Affordances from **major runes** (on body)  

**Unresolved:** Body Dao **avatar** @ sanctification; whether all Saints need a particular Body Dao connection.

---

## 8. Conflicts & superseded statements

| Topic | Existing material | This direction |
|-------|-------------------|----------------|
| **Pearl = blood layer only** | Chamber treats blood/nerve as layers | Pearl is **whole-body Vital Essence nexus**; blood+nerve = **condensation work focus** in ladder — **aligned** |
| **Runeforging = body-art recipes only** | Ladder § idx 5 | Adds **Body Dao principle** runes + foundational set; **recipes/materials remain** valid forge path |
| **Vessel Rules for interior peak** | `vessel-rules-design.md` mandatory for peak | **Optional** for general body play & **sanctification** per this doc; peak track **may** still want oath — **flag for owner** |
| **Realm 1 = bones in ladder table** | “Bones + organs” in ladder | Explicit: **blood, organs**, not bones-exclusive |
| **Idx 0–3 one chamber** | Code + rewrite | Journey doc affirms **continuous dig**; idx 2 needs **Pearl loop**, not click-only capstone — **design ahead of code** |

Historical **Bronze Skin → Iron Bones** progression list is **UI legacy** — nine-realm names in ladder supersede for design.

---

## 9. Unresolved questions (additive to philosophy doc §7)

1. Vital Essence — final term, metaphysics, qi coupling.  
2. Pearl **anatomical** site and sensation.  
3. Idx **2** sustained loop design (stabilise / harmonise / fight drift).  
4. Idx **3** nurture & integration mechanics vs `TRAINABLE_PHYSIQUES`.  
5. Foundational rune **canonical** list and forge UI.  
6. Rule-derived **unique runes** vs arts-derived majors.  
7. Combat parity — **per-realm capability kit** checklist vs qi neighbor.  
8. Organ rune placement rules.  
9. Sanctification without Vessel Rule — allowed paths?  
10. When first **conscious internal** refinement appears (still open from philosophy §4).

---

## 10. Acceptance checklist

A reader should understand:

1. Idx **0–5** form one **continuous** refinement → nexus → physique → metamorphosis → runes story.  
2. Essence Pearl is **physical**, from **universal** Vital Essence, **not** a loot box taken out of meat.  
3. Early refinement **history** feeds later physiques.  
4. **Nascent** nurtures; **PT** transforms category.  
5. **Runeforging** expresses **Body Dao** principles, not arbitrary magic stickers only.  
6. **Foundational runes** are broadly accessible; **full mastery not required**.  
7. **Vessel Rules** optional deeper Body Dao route — **not** universal requirement.  
8. **Combat parity** with qi realms is a **design goal**.  
9. Idx **6–8** + **X/Y/Z** **unchanged**.  
10. **No gameplay** changes in the PR that added this file.
