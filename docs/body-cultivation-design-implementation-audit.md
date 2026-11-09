# Body Cultivation — Design & Implementation Audit

| Field | Value |
|-------|-------|
| **Type** | Read-only audit (body path focus) |
| **Date** | 2026-11-09 |
| **Evidence tags** | **Implemented** · **Documented** · **Inferred** · **Unresolved** |

Companion: [`cultivation-capabilities-stat-architecture-audit.md`](cultivation-capabilities-stat-architecture-audit.md) (cross-path stats/combat). **Design locks (post-audit):** [`ideas/body-refinement-philosophy-and-ceilings.md`](ideas/body-refinement-philosophy-and-ceilings.md), [`ideas/body-realm-journey-and-vital-essence.md`](ideas/body-realm-journey-and-vital-essence.md).

**Authority rule:** For *lore intent*, prefer **owner-locked design docs** (`nine-realm-ladder.md` 2026-10-12, `body-path-refining-rewrite.md`). For *playable behaviour*, prefer **current code**. Where they disagree, both are listed — **not reconciled**.

---

## A. Executive Summary

### Settled (high confidence)

| Topic | Status | Where |
|-------|--------|-------|
| **Nine body realm names** idx 0–8 | **Implemented** (labels) | `data.js` `PATHS.body.realms`, titles `PATHS.body.titles` |
| **Mortal dig** = vessel idx **0–3** with chamber layer spine | **Documented** (locked); **partially implemented** | `nine-realm-ladder.md`, `BODY_VESSEL_REALM_SPINE` `data.js:6830` |
| **External Tempering @ idx 0** (skin+flesh, salve loop) | **Implemented** (playtest slice) | `body-chamber.js`, `BODY_EXTERNAL_TEMpering_BALANCE` |
| **Upper body realms idx 4–8** (PT, runes, furnace, inner source, saint) | **Documented** (idx 4–8 locked 2026-10-12); **not implemented** as gameplay | `nine-realm-ladder.md` § Body; `cultivation.js:437` stub log |
| **Essence Pearl → Inner Source continuity** (X engine) | **Documented** (owner lock 2026-10-12) | `nine-realm-ladder.md` § Inner Source composition |
| **Saint / Saintly Flesh** vs Immortal | **Documented** (generic capstone) | `body-path-sect.md`, `nine-realm-ladder.md` |
| **Meridians qi-only on body path** | **Documented** (design lock 2026-10-15); **partial code** | `body-path-no-meridians.md`; meridian tab hidden on body path (`body-chamber.js:549`) but layer data/actions remain |
| **Vessel Rules** (Blood, Unnamed) | **Implemented** (two rules, combat hooks) | `vessel-rules.js`, `VESSEL_RULES` `data.js:6804` |

### Partially implemented

- **Idx 1–3** use the **same seven-layer chamber** (skin→nerves) with **global** `layerProgress` / `actionCounts` / `bonuses` — not soak vats, pearl object, or recipe-locked vessel physique (`body-chamber.js`).
- **Breakthrough / seal / consolidation** work on **vessel track** via shared breakthrough pipeline (`cultivation.js`, `cultivation-chamber-steps.js`, `consolidation.js`).
- **Physique projects** (`TRAINABLE_PHYSIQUES`, `physique-cultivation.js`) — **separate** from designed **vessel physique** locked at Nascent Physique.
- **Anatomy silhouette** — visualization + regional tooltips; **not** regional capability storage (`body-chamber.js` `BODY_SILHOUETTE_REGIONS`).

### Missing / not established in code

- Essence Pearl as **saved object**; Inner Source **X/Y/Z** refinement; Runeforging; Source Furnace; Physique Transformation line/budget.
- **Inner soaking** manual loop from `body-path-refining-rewrite.md` (idx 1+).
- **Birth marrow / physique seed** (creation).
- **Martial Intent** body track (`body-martial-intent.md` — designed, not implemented).
- **Body Dao** as mechanic — cosmology **stub only** (`body-dao-design.md` — `idea`).
- **Sanctification** connecting inner source to Body Dao avatar expression — **proposed**, **not established** as canonical lore (see §6).

### Genuinely unresolved (owner)

- Inner Source install recipe details; Vessel Rule swear gate **idx 2 (code) vs 5–6 (design lean)**; whether Saintly Flesh = embodied Body Dao; per-region additive stats vs global %; tribulation on every body milestone; Nascent re-face vs PT re-face for weave evolution.

---

## B. Nine-Realm Body Ladder

**Canonical names (Implemented):** `PATHS.body.realms` in `data.js:36`.

**Lifespan on vessel breakthrough:** uses shared `LIFESPAN_BY_REALM[realmIdx]` via `extendLifespanOnBreakthrough` — **same table as qi** (`data.js:3749`, `cultivation.js:419`). **Documented** body idx 0 cap 80 years in external baseline; table gives 80 @ idx 0 globally.

For each realm: **D** = Documented primary source; **C** = Code behaviour.

---

### Idx 0 — External Tempering

| # | Field | Content |
|---|--------|---------|
| 1 | Name | **External Tempering** (C: `PATHS.body.realms[0]`) |
| 2 | Purpose | Harden **exterior shell** (skin+flesh) before interior work (D: `nine-realm-ladder.md:255`, `body-external-tempering-baseline.md`) |
| 3 | What changes | Surface durability, fatigue tolerance; strongest honest mortal (D) |
| 4 | Cultivated | Salve batches, layer % on skin/flesh, exterior fatigue (C: `G.bodyChamber.salveDoses`, `externalFatigue`, `layerProgress`) |
| 5 | Methods / materials | Mix salve (hide scrap, beast blood, spirit herb as grit); apply; drills (C: `runMixExternalSalve`, `runApplyExternalSalve`, `BODY_EXTERNAL_TEMpering_BALANCE`) |
| 6 | Breakthrough | Seal shell → consolidate → **Brace the Frame** → shared breakthrough roll (C: `BODY_VESSEL_REALM_CHAMBER_ACTIONS[0]`, `canVesselTrackBreakthrough`) |
| 7 | New capabilities | Global `bodyChamber.bonuses` %; vitality/HP on break (generic track break) |
| 8 | Capability changes | Unlocks interior layers after idx 1 (C: `isExternalTemperingVesselRealm()` gates layers) |
| 9 | Activities | Body chamber @ idx 0 only skin/flesh tabs (C: `isBodyLayerUnlocked`) |
| 10 | Carries forward | Layer progress and bonuses persist (C) |
| 11 | Code | **Implemented** for external slice; playtest free materials (`freeMixMaterials: true`) |
| 12 | Gaps | QC-style Early/Mid/Late **bands** not shipped (D: baseline § Open); limb targeting, grain tags (D: `body-external-tempering-depth.md` — not v1) |

---

### Idx 1 — Inner Tempering

| # | Field | Content |
|---|--------|---------|
| 1 | Name | **Inner Tempering** |
| 2 | Purpose | **Interior soak / steep** under braced shell; bones + organs work (D: `nine-realm-ladder.md:256`, mortal dig verb table `body-path-refining-rewrite.md:238`) |
| 3 | What changes | Structural interior braced for deeper refinement (D) |
| 4 | Cultivated | Bones, organs layer progress (C: spine `layers: ['flesh','bones']` for idx 1 — **note:** flesh still in spine @1) |
| 5 | Methods | **Documented:** vats, brews, soak solutions — **Not established** as distinct code loop (still generic `BODY_CHAMBER_ACTIONS`) |
| 6 | Breakthrough | Peak spine layers → seal → break (C: `BODY_VESSEL_REALM_SPINE[1]`) |
| 7 | Capabilities | More bonus stacks; opens organs path in dig |
| 8 | Changes | “Vessel Establishment” **retired as realm name**; lives in brace flavor (D: `body-external-tempering-baseline.md:133`) |
| 9 | Activities | Same chamber; non-external layers unlock (C) |
| 10 | Carries forward | All prior layer % + bonuses |
| 11 | Code | **Partial** — progression gates only; **not** inner-soak fantasy |
| 12 | Gaps | Soak vat UX, saturation model (D: `body-path-refining-rewrite.md` § Inner Tempering — **designed**, next slice) |

---

### Idx 2 — Essence Pearl

| # | Field | Content |
|---|--------|---------|
| 1 | Name | **Essence Pearl** |
| 2 | Purpose | Condense blood + nerve work into **one kernel** — “recipe memory” for future engine (D: `nine-realm-ladder.md:257`) |
| 3 | What changes | Mixed essences **condense**; pearl **remembers recipe** (D: `body-path-refining-rewrite.md:154`) — **metaphor + future object** |
| 4 | Cultivated | Organs + blood layers; nerve capstone optional extra (D); blood chamber actions feed Vessel Rule progression (C) |
| 5 | Materials | Tier-III blood/pearl inputs (D: `body-stat-layers-additive.md:131`) — **Not established** as recipe tables in code |
| 6 | Breakthrough | Peak organs+blood (C: `BODY_VESSEL_REALM_SPINE[2]`) |
| 7 | Capabilities | Vessel Rule swear gate @ **idx 2, 50% blood/bones** (C: `VESSEL_RULES.*.swearGate`) — **contradicts** design lean idx 5–6 (F §) |
| 8 | Changes | Approaches Nascent Physique hatch |
| 9 | Activities | Chamber organs/blood/nerves tabs |
| 10 | Carries forward | Pearl **intended** to become Inner Source **X** (D) — **no** `G.pearl` field (C) |
| 11 | Code | **Partial** — layer grind only |
| 12 | Gaps | Literal pearl structure, condense minigame, recipe persistence |

---

### Idx 3 — Nascent Physique

| # | Field | Content |
|---|--------|---------|
| 1 | Name | **Nascent Physique** |
| 2 | Purpose | **Hatch** vessel physique — lock **recipe**; **mortal chamber dig ends** (D: `nine-realm-ladder.md:258`, `body-path-refining-rewrite.md:50`) |
| 3 | What changes | Named **vessel physique** born; two cultivators diverge (D) |
| 4 | Cultivated | Nerve Sea once-refine required (C: `requireNervesRefined`, `isBodyNervesRefined`) |
| 5 | Methods | Integrate/lock recipe — **Not established** in code |
| 6 | Breakthrough | Nerves refined + spine peak → break; log stub for idx 4+ (C: `cultivation.js:436-438`) |
| 7 | Capabilities | Soul embryo can awaken from any track @ idx 3 (cross-path C: `SOUL_EMBRYO_REALM_IDX`) |
| 8 | Changes | Chamber **should** end; code **does not** remove chamber |
| 9 | Activities | Nerves capstone action; consolidation |
| 10 | Carries forward | Designed: recipe → PT line, runes (D) — **not saved** |
| 11 | Code | **Partial** — nerve gate + break message only |
| 12 | Gaps | `vesselPhysique` save shape, birth marrow, hatch UI, meridian removal debt |

---

### Idx 4 — Physique Transformation

| # | Field | Content |
|---|--------|---------|
| 1 | Name | **Physique Transformation** |
| 2 | Purpose | **Metamorphosis** — forge-grade body; sets **line** (ice/poison/steel…), rune budget, affinities (D: `nine-realm-ladder.md:259`) |
| 3 | What changes | Category change of flesh; optional **re-face all layers** at new material tier (D: `body-stat-layers-additive.md:133`) |
| 4 | Cultivated | Not established |
| 5 | Materials | Forge-grade reagents (D) — not in code |
| 6 | Breakthrough | **Documented:** leaves layer screen. **Code:** `getBodyVesselRealmProgressPct` idx>3 returns stub 80–100% from consolidation/peak boost (`body-chamber.js:449-455`) |
| 7 | Capabilities | Y expression prep (D: Inner Source table) |
| 8 | Changes | Work **not** in mortal chamber (D) |
| 9 | Activities | **None** dedicated |
| 10 | Carries forward | Line, budget → runeforging |
| 11 | Code | **Placeholder** only |
| 12 | Gaps | Entire realm loop; distinction from generic `G.physique` projects |

---

### Idx 5 — Runeforging

| # | Field | Content |
|---|--------|---------|
| 1 | Name | **Runeforging** |
| 2 | Purpose | Forge **runes** on body — majors from body-art recipes, minors from filings (D: `nine-realm-ladder.md:260`) |
| 3 | What changes | Permanent physical capabilities on transformed body (D) |
| 4–10 | (Design) | Cap by forge load / PT budget; Martial Intent feed-forward (D: `body-martial-intent.md:116`) |
| 11 | Code | **Not established** |
| 12 | Gaps | Rune seats, recipes, failure = scar not dead rune (D: open tune) |

---

### Idx 6 — Source Furnace

| # | Field | Content |
|---|--------|---------|
| 1 | Name | **Source Furnace** *(working)* |
| 2 | Purpose | **Preamble** — open inner hearth / smith’s cavity for installation (D: `nine-realm-ladder.md:261`) — **not qi void** vocabulary |
| 3–10 | (Design) | Qualify for Inner Source install |
| 11 | Code | **Not established** |
| 12 | Gaps | Furnace room, trib copy, relation to dao-seeking idx 6 |

---

### Idx 7 — Inner Source

| # | Field | Content |
|---|--------|---------|
| 1 | Name | **Inner Source** |
| 2 | Purpose | **Craft/install** generative core; refine **X/Y/Z** in basin (D: `nine-realm-ladder.md:262`, §282–291) |
| 3 | What changes | Same object as Essence Pearl in **engine phase** (D); runes stay on body, **do not merge** into source |
| 4 | X/Y/Z | **X** engine from pearl; **Y** expression from PT line; **Z** affordances from major runes (D — owner lock) |
| 5 | Install recipe | Pearl kernel + furnace seat + sovereign quench + PT template + keystones (D) |
| 6–10 | (Design) | Self-sustaining generative body **implied** post-install — **stage not specified in code** |
| 11 | Code | **Not established** (vision string only `data.js:55`) |
| 12 | Gaps | All mechanics; UI three headers |

---

### Idx 8 — Saintly Flesh

| # | Field | Content |
|---|--------|---------|
| 1 | Name | **Saintly Flesh** (圣体境) |
| 2 | Purpose | **Sanctify** installed source; mortal apex **Saint** (圣) not Immortal (仙) (D: `body-path-sect.md:120-129`) |
| 3 | What changes | Flesh sanctified; **Crowned** Vessel Rule adherence plausible (D: `body-dao-design.md:45`) |
| 4–9 | (Design) | Vajra Ridge: **Golden Body Arhat** honorific, **Da Chi** fiction (D: `body-path-sect.md`) |
| 10 | Carries forward | Post-mortal cosmology **parked** (`post-immortal-cosmology.md`) |
| 11 | Code | Name + title **Saint Vessel** (`PATHS.body.titles[8]`); **no** sanctify gameplay |
| 12 | Gaps | Sanctification ritual; Body Dao avatar question (§6); title still says **Vajra Immortal** in older doc table vs shipped titles |

---

## C. Core Concept Definitions

### Essence Pearl

| Aspect | Finding | Evidence |
|--------|---------|----------|
| Nature | **Documented** as condensing blood+nerve refinement into a **kernel** that **remembers the recipe** — seed for Inner Source **X** (engine). **Not** only metaphor — intended **literal** game object at install time. | `nine-realm-ladder.md:257`, `282-283` |
| Relation to Inner Source | **Same object, different phase** (owner lock 2026-10-12). Runes remain on body surface. | **Documented** |
| In code | **Unresolved** — no `G.essencePearl` or equivalent; idx 2 spine = organs+blood % only | **Implemented** spine only |
| Nascent Physique link | Pearl **hatches** into vessel physique @ idx 3 (D) | **Not implemented** |

### Nascent Physique

| Aspect | Finding |
|--------|---------|
| Identity | **Vessel physique born** — locked **recipe** of what soaks built; chamber dig **ends** (D) |
| vs `G.physique` | **Trainable/legendary physiques** are instant stat packages (`TRAINABLE_PHYSIQUES`, `physique-cultivation.js`) — **different system** from designed vessel physique (F §) |
| In code | Nerve refinement gate + breakthrough log; **no recipe lock** |

### Inner Source

| Aspect | Finding |
|--------|---------|
| Origin | **Documented:** installed @ idx 7 from pearl kernel + furnace + quench + template — **not** created ex nihilo at idx 7 without idx 2 pearl journey |
| Self-sustaining | **Not established** — generative core implied in copy; **when** body becomes self-sustaining = **Unresolved** |
| Internal vs external refine | External idx 0; inner soak idx 1+; **internal refinement of source** post-install = idx 7 basin (D) — **not in code** |

### Physiques (trainable / legendary)

| Aspect | Finding |
|--------|---------|
| Status | **Implemented** staged projects + bonuses on `G` stats |
| Design role | **Orthogonal** to vessel physique — owner uses vessel physique for **path identity**, trainable physiques as **projects** (D: `body-path-refining-rewrite.md` still lists old phased physiques in code data) |

### Vessel Rules

| Aspect | Finding |
|--------|---------|
| Status | **Implemented** — Rule of Blood, Rule of Unnamed; progression %; interior peak for perfect cultivation (`hasVesselInteriorPeak`) |
| Design | Personal oath under **Body Dao purview** (D stub); swear gate migration to idx 5–6 **lean** vs **code idx 2** |

### Body Dao

| Aspect | Finding |
|--------|---------|
| Status | **`idea`** stub — **not** gameplay system (`body-dao-design.md`) |
| Claim | Great Dao path witnessing flesh oaths; **implicit purview** on all tempering (owner lean) |
| Saint connection | **Plausible fiction** — Crowned adherence at Saint; **Saintly Flesh = embodied Body Dao?** — **Unresolved** (open question in doc:156) |
| **Sanctification = avatar of Body Dao** | **Not established** as settled lore — **symmetry proposed** (qi wears law, body forges into flesh) without avatar mechanic |

### Sanctification / Saints / Da Chi

| Aspect | Finding |
|--------|---------|
| Saintly Flesh | **Documented** owner lock — generic body capstone; jianghu calls them **Saint** (圣) | `body-path-sect.md` |
| Da Chi | **Fiction** — Mad Arhat, Saint **after** war, Rule of Unnamed ceiling, **not founder** | `body-path-sect.md`, `body-martial-intent.md:65` |
| Sanctify source @ idx 8 | **Documented** one-line job (`nine-realm-ladder.md:263`) — **no** mechanics |
| Tribulation / resource costs for sanctification | **Not established** |
| Post-sanctification cultivation | **Parked** (`post-immortal-cosmology.md`) |

---

## D. Refinement System

### Implemented

| Piece | Detail | Location |
|-------|--------|----------|
| **7 layers** | skin, flesh, bones, organs, blood, meridians, nerves | `BODY_CHAMBER_LAYER_ORDER` `data.js:6827` |
| **Global progress** | `G.bodyChamber.layerProgress[id]` 0–100 | `body-chamber.js:272` |
| **Action stacks** | `actionCounts['layer:actionId']` → `applyBodyChamberBonusDelta` | `body-chamber.js:567-577` |
| **Bonuses** | Capped % keys (`BODY_CHAMBER_BONUS_CAPS`) | `data.js:6897` |
| **Regions** | Silhouette regions, shared bone actions (both hands → `hands`) | `BODY_SILHOUETTE_REGIONS` `body-chamber.js:90` |
| **External idx 0** | Salve mix/apply/drill, fatigue | `body-chamber.js:1591+` |
| **Vessel realm spine** | Per-idx layer requirements 0–3 | `BODY_VESSEL_REALM_SPINE` |
| **Physique projects** | 4-stage trainable physiques | `physique-cultivation.js` |
| **Vessel rules** | Oath + combat/cultivation modifiers | `vessel-rules.js` |

### Documented but not implemented

| Piece | Source |
|-------|--------|
| **Per-region additive layers** (skin_palm + flesh_palm + …) | `body-stat-layers-additive.md` |
| **Soak vats / manual recipes** (idx 1+) | `body-path-refining-rewrite.md` |
| **Grain tags, lopsided builds** | `body-external-tempering-depth.md` |
| **Weave evolution / re-face at PT** | `body-stat-layers-additive.md` |
| **Lineage manuals** (dragons, poisons) | `body-external-tempering-baseline.md` |
| **Birth marrow / physique seed** | `body-path-refining-rewrite.md` § Birth marrow |
| **Soul-into-body forbidden refine** | `soul-body-refining.md` — stub |

### Refinement recipes

| Question | Answer |
|----------|--------|
| Formally specified? | **External salve** recipe **Implemented** (`mixCost` in balance). **Lineage / pearl / rune** recipes = **Documented only** (tables in ideas, not `data.js` craft defs for body path). |
| Regional vs whole-body | **Designed** for external depth; **Implemented** as whole-layer % only. |
| Compatibility / conflicts | **Designed** — two natures clash, harmonize later (`body-path-refining-rewrite.md:131`) — **Unresolved** |
| Injury / strain | **Partial** — `externalFatigue`, scar hooks in drill design; **no** regional injury persistence on player |
| Training vs cultivation | Chamber actions cost **months** (`advanceChamberWeeks`) — time-based cultivation; drills are not generic stat gym |

---

## E. Implementation Trace

### State fields (`G`)

| Field | Role |
|-------|------|
| `G.cultivation.vessel.realmIdx` | Vessel track tier |
| `G.cultivation.vessel.consolidation` | Per-realm seal quality |
| `G.bodyChamber` | `layerProgress`, `actionCounts`, `bonuses`, `salveDoses`, `externalFatigue`, `nervesRefined`, `subUnlocked` |
| `G.physique`, `G.physiqueCultivation` | Optional physique project |
| `G.vesselRule`, `G.vesselRuleCooldownUntilMonth` | Active oath |
| `G.vitality`, `G.maxHp`, … | Legacy stats still granted on vessel breakthrough |

### Key functions

| Function | File | Role |
|----------|------|------|
| `ensureBodyChamberState` | `body-chamber.js:272` | Init/migrate chamber |
| `getBodyVesselRealmProgressPct` | `body-chamber.js:445` | Realm meter; **stub idx>3** |
| `canVesselTrackBreakthrough` | `body-chamber.js:517` | Gates |
| `getVesselTrackBreakthroughBlockReason` | `body-chamber.js:489` | Player feedback |
| `runMixExternalSalve` / `runApplyExternalSalve` | `body-chamber.js:1591+` | External loop |
| `renderChamberTrackRealmSteps` | `cultivation-chamber-steps.js:119` | Seal/break UI |
| `attemptBreakthrough` (track-aware) | `cultivation.js` | Stats + `setTrackRealmIdx('vessel')` |
| `getRealmProgressPct` (body branch) | `consolidation.js:104` | Consolidation meter |
| `getPathCapstone` (body idx 0) | `consolidation.js:45` | Seal the Shell copy |
| `hasVesselInteriorPeak` | `vessel-rules.js:234` | Perfect cultivation gate |
| `getBodyChamberDefensePct` etc. | `body-chamber.js:2200+` | Combat aggregation |
| `getVesselRealm` | `cultivation-tracks.js:292` | Display name |

### Dependencies

- **Focus track** syncs `G.path` / `G.realmIdx` for combat and many gates (`cultivation-tracks.js`).
- **Meridians** `G.meridians` still openable from chamber actions when tab available — **non-body path** or legacy (`openBodyMeridian` pattern in `body-chamber.js`).
- **Tribulation** uses shared pipeline; body-flavored choice strings (`tribulation.js`).
- **Lifespan** shared table, not body-specific curve.
- **Talent cap** `isRealmBlockedByTalent` uses **`G.path`** realm names, **not vessel-only cap** (design: roots cap dantian only — **not implemented**, `body-path-refining-rewrite.md:198`).

---

## F. Design Contradictions

| # | Contradiction | A | B |
|---|---------------|---|---|
| 1 | **Vessel Rule swear gate** | Code: idx **2**, 50% blood/bones (`data.js:6810`) | Design lean: idx **5–6** (`vessel-rules-design.md:49`, `nine-realm-ladder.md:279`) |
| 2 | **Meridians on body path** | Design: **remove** from body (`body-path-no-meridians.md`) | Code: tab **hidden** on body path; **meridians layer + actions + `G.meridians`** remain |
| 3 | **Nascent spine layers** | Design table idx 3: hatch/integrate, nerves (`body-path-refining-rewrite.md:240`) | Code spine idx 3: **`nerves` only** (no meridians in `BODY_VESSEL_REALM_SPINE[3]`) — **aligns with recent data**; doc debt in `body-path-no-meridians.md` still mentions old meridian spine |
| 4 | **Physique identity** | Design: **vessel physique** recipe @ Nascent | Code: **`G.physique`** trainable legends unrelated to recipe |
| 5 | **Mortal dig end** | Design: chamber **ends** @ Nascent | Code: chamber **always available** for vessel track |
| 6 | **Essence Pearl** | Design: literal kernel / memory | Code: **organs+blood %** threshold only |
| 7 | **Inner Source origin** | Design: pearl → engine @ install | Code: **no objects** — cannot verify relationship in play |
| 8 | **Body tribulation / brace** | Design: brace is **idx 0→1** special act (`body-external-tempering-baseline.md`) | Code: **generic** `attemptBreakthrough` with flavor label “Brace the Frame” only for copy (`BODY_VESSEL_REALM_CHAMBER_ACTIONS`) — **Inferred:** no separate brace minigame |
| 9 | **Title @ cap** | `body-path-sect.md` notes old **Vajra Immortal** in titles | **Implemented** titles use **Saint Vessel** (`data.js:37`) — doc table stale |
| 10 | **Da Chi war realm** | Fiction: **Indestructible Vajra** during war | **Ladder names** no longer include Indestructible Vajra as realm — **lore remap** noted in `body-path-refining-rewrite.md:210` |

---

## G. Gameplay Depth Assessment

| Realm idx | Distinct cultivation experience? | Evidence |
|-----------|----------------------------------|----------|
| **0** | **Yes** — salve/drill/fatigue loop differs from later layers | **Implemented** |
| **1** | **Weak** — same click-grind actions, more tabs | **Partial** |
| **2** | **Weak** — organs/blood actions; no pearl fantasy | **Partial** |
| **3** | **Moderate** — nerve once-capstone; else numerical | **Partial** |
| **4–8** | **No** — consolidation/peak % stub; log defers PT | **Placeholder** |

**Numerical dominance:** Breakthrough still adds **vitality/maxHp** on vessel track (`cultivation.js` 409–415) like qi path, despite design lean toward milestone = ruler not stat dump (`body-path-refining-rewrite.md:31`).

---

## H. Missing Design Decisions (ranked)

1. **Inner Source install + X/Y/Z tuning** — blocks idx 6–8 implementation (depends on pearl + PT + runes).
2. **Physique Transformation** — line, budget, forge-grade stock (blocks idx 4–5).
3. **Vessel physique save model** vs trainable physiques (blocks Nascent identity).
4. **Inner Tempering soak loop** spec (blocks idx 1 depth).
5. **Vessel Rule swear gate** final index (blocks sect fiction vs early oath).
6. **Saintly Flesh = Body Dao embodiment?** Sanctification mechanics (blocks idx 8 + cosmology).
7. **Weave re-face @ Nascent (3) vs PT (4)** (`body-stat-layers-additive.md` — lean **4**).
8. **Tribulation per body milestone?** (`body-path-refining-rewrite.md` open).
9. **Talent/root cap** — vessel track exempt? (`body-path-refining-rewrite.md:198`).
10. **Martial Intent** implementation vs Weapon Intent split.

---

## I. Recommendations for Discussion (order only — no solutions)

1. Lock **vessel physique data model** (recipe, grains) before Nascent/PT docs diverge further.
2. Decide **Essence Pearl** representation (object fields, UI, condense verb) — prerequisite for Inner Source doc.
3. Scope **idx 1 Inner Tempering** playable slice (soak vs chamber actions) before idx 4+ fiction.
4. Resolve **Vessel Rule gate** migration vs keep idx 2 for playtest.
5. **Retire or repurpose** meridians in body chamber per `body-path-no-meridians.md`.
6. **Physique Transformation** minimal vertical slice (line pick only?) before Runeforging table.
7. **Saint / Body Dao / sanctification** — owner pass on whether avatar-of-Dao is canonical (currently **not** locked).
8. **Cross-path:** soul embryo @ any track idx 3 vs spirit-only soul birth — affects body Nascent pacing.

---

## Document Index (body-related)

| Doc | Status (per README / header) | Role |
|-----|------------------------------|------|
| `nine-realm-ladder.md` | designed; body idx 4–8 locked 2026-10-12 | **Primary ladder + Inner Source X/Y/Z** |
| `body-path-refining-rewrite.md` | designed; 0–3 spine shipped | Mortal dig, soak philosophy, Tuo Yan remap |
| `body-external-tempering-baseline.md` | designed; v1 locks 2026-10-16 | **External playable spec** |
| `body-external-tempering-depth.md` | designed; north star | Post-v1 external |
| `body-stat-layers-additive.md` | designed | Regional/additive combat target |
| `body-path-no-meridians.md` | designed lock | Qi-only meridians |
| `body-chamber-anatomy-rebuild.md` | shipped (polish) | Silhouette art |
| `vessel-rules-design.md` | idea | Oaths + Body Dao link |
| `body-dao-design.md` | idea | Cosmology stub |
| `body-martial-intent.md` | designed; not implemented | 武意 |
| `body-path-sect.md` | idea | Vajra Ridge, Da Chi, Saint titles |
| `soul-body-refining.md` | idea stub | Forbidden refine |
| `heavenly-demon-cult-body-ward.md` | designed | Antagonist body fiction |
| `docs/cultivation-capabilities-stat-architecture-audit.md` | audit | Cross-path stats |

**Archived / superseded references:** Old **Bronze Skin → Indestructible Vajra** seven-name list — superseded by nine-realm names in code (`body-path-refining-rewrite.md:25`). **Vessel Establishment** as realm name — **retired** (D).

---

## Missing evidence (explicit)

- No design file with **complete tribulation script** per body realm (reuses generic pipeline in code).
- No **codified** soak recipe table for idx 1 (only narrative in rewrite doc).
- No code or doc **proving** sanctification = Body Dao avatar — **user hypothesis not confirmed**.
- **Post-Saint** cultivation rules not written.
- **Implementation PR / issue** for upper body fat slice — referenced in `nine-realm-ladder.md:45` but **not found shipped** in code audit.

---

*Read-only audit. No gameplay changes. No implementation PR per task constraints.*
