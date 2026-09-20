# Body path — vessel refining vision (design hub)

| Field | Value |
|-------|-------|
| **Status** | `designed` (workshop — owner; **no implementation until owner says**) |
| **Blocked on** | Combat damage pass ([`combat-damage-depth.md`](combat-damage-depth.md)); anatomy P2 polish |
| **Issue** | none yet |
| **Chat / PR** | Design chats 2026-09-16 – 2026-09-20 (granularity → vessel state → progression spine → methods → balance → qi/body framing) · prior [PR #119](https://github.com/WanderingImmortal/tales-immortal-path/pull/119) |
| **Updated** | 2026-09-20 |

## Intent

Body cultivation should feel like **refining a living vessel** — limb by limb, material by material, with **endless variation** in the xianxia novel sense: legendary methods, impossible materials, asymmetric bodies, clash and mastery — **without** recipe-locked physiques or a wiki build guide.

The player **is** a **vessel state** (a map of what they built). Named physiques and jianghu titles are **what the world calls you**, not achievements unlocked by checklist.

**Planning only** until owner greenlights implementation.

**North star (game):** Freedom to **explore a working cultivation system in depth** inside a detailed xianxia world — paths differ (qi configure / body inscribe), but each should support **real build identity**, material loops, and readable power fantasy.

**Hub sentence:** Qi and body share a **realm-grade spine**; qi specializes variance in **how power is expressed**; body in **what the vessel is made of**.

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
| Realm name = requirement (Iron Bone) | Neutral **grade** + method realm + **epithet** |
| One word for multiple processes | Vocabulary below (imprint / harmonize / co-refine) |

The [**Novel alignment guide**](#novel-alignment-guide-not-rules) is a **feel checklist**, not a locked spec.

### Supersedes / extends

- Extends [`body-path-refining-rewrite.md`](body-path-refining-rewrite.md) (ACS lean; milestones reframed below).
- Combat: [`combat-damage-depth.md`](combat-damage-depth.md) (four systems — **not** limb HP bars).
- Visuals: [`body-chamber-anatomy-rebuild.md`](body-chamber-anatomy-rebuild.md).
- Qi methods pattern: [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md) — body branch **deferred**; see [Body refining methods](#body-refining-methods).
- Forbidden: [`soul-body-refining.md`](soul-body-refining.md). Sect: [`body-path-sect.md`](body-path-sect.md). Rules: [`vessel-rules-design.md`](vessel-rules-design.md).

---

## Qi vs body — expression vs substrate

**Do not** frame qi as “linear / no variance” and body as “the only varied path.” Qi has arts, intent, dao, method, foundation — real spread at the same idx.

| | **Qi path** | **Body path** |
|--|-------------|---------------|
| **Vertical spine** | Realm ladder + dantian | Vessel **grade** + forge projects |
| **Horizontal depth** | Arts, intent, dao, cultivation method | Map regions, materials, harmonize, apertures, refining manual |
| **Variance character** | **Configure** — how you *deploy* power | **Inscribe** — what you *are* (persistent vessel state) |
| **Persistence** | Loadout can shift (costs apply) | Build is **sticky** — remold is saga-tier |
| **Collateral body** | **Overflow** on qi breakthrough (shallow) | Active refinement only |

**Linear** = one **idx** ruler + breakthrough rhythm (trib, travel, enemies) — **both** paths.  
**Lateral** = **between** grade jumps, body work is spatial/compositional (which tile next), not layer-tab itinerary.

### Parallel horizontal systems

| Qi | Body parallel |
|----|----------------|
| Weapon / martial intent | Martial intent + vessel rules |
| Dao phases / laws | Harmonize, imprint phases, co-refine alloys |
| Technique pool | Aperture arts, body techniques |
| Cultivation method | **Refining manual** (Dragon, Poison, Vajra, …) |
| Foundation at seal | Grade **snapshot** + epithet at breakthrough |

### Qi overflow (leakage)

| Property | Direction |
|----------|-----------|
| **When** | Qi breakthroughs / major consolidation — not every cultivate tick |
| **What** | Shallow global flesh progress — **untagged**, no tension play |
| **Ceiling** | Hard cap vs body-main at same idx (~30–40% effective) |
| **Combat** | Baseline Flesh hardness only |

---

## Progression spine (four pillars)

Separates **clean breakthrough** from **lateral map work**.

```text
LATERAL VESSEL MAP (always)     regions, materials, eyes, poison — personal
        │
        ▼
SUB-REALM + PROJECT             method revolutions + gate package
        │
        ▼
BOTTLENECK + KEY                ready to attempt?
        │
        ▼
BREAKTHROUGH                    grade idx +1 — discrete phenomenon
        │
        ▼
SNAPSHOT + EPITHET              fingerprint — not homogenized
```

| # | Pillar | Job |
|---|--------|-----|
| 1 | **Clean breakthrough** | **Grade index** moves only here — ordeal, log, new ceiling |
| 2 | **Sub-realms** | Named progress **within** grade (method revolutions — not anatomy `%`) |
| 3 | **Project** | Chronicle-tracked gate package for **this** transition (nine breaths, twelve seeds, …) |
| 4 | **Bottleneck + key** | Why attempt blocked; material, chapter, floor, ordeal |

**Between breakthroughs:** map work does **not** silently tick realm idx. It feeds sub-realm, project slots, readiness, epithet.

**Current game gap:** layer `%` + realm idx tied to tab order feels qi-like. Target: **grade attempt** when project + keys satisfied; layers are **work types on the map**.

---

## Grade naming: power vs identity

**Problem:** names like Iron Bone telegraph requirements and homogenize (“everyone at idx 1 is Iron Bone”).

| Layer | Purpose | Example |
|-------|---------|---------|
| **Grade index** | Parity with qi, trib, travel | idx 0, 1, 2… |
| **Neutral UI name** | No anatomy track | Unrefined Vessel → **First Temper** → **Second Forge** → … |
| **Method realm name** | Art-specific | Hidden Dragon Vessel (潜龙体), Poison Seed Vessel (毒原体) |
| **Epithet** | Emergent from fingerprint | Scale-Marked Sleeper, Green-veined Skin |
| **Registry (optional)** | Bureaucracy | “Indexed First Temper — dragon-class expression” |

Legacy names (Bronze Skin, Iron Bones) may exist in sect lore as **equivalents**, not player-facing track.

**Unlocking work:** **manual chapters** unlock *can do* (marrow, eye aperture, fingers). **Grade breakthrough** raises *how deep* refinement can go (purity cap, co-refine ceiling) — not “bone tab unlocks.”

---

## Three layers of identity (variance)

```text
MODEL         Refining manual — project shape, curve, bottlenecks
COMPOSITION   Map + imprints + alloys + apertures — endless physiques
GRADE         Neutral idx — world permissions + parity band
```

- **Models** = designed paths (Nine Dragons, Thousand Poisons, Vajra, crude).
- **Composition** = combinatorial tags + trait/epithet clusters — **feels** endless.
- **Endless** in game = tag combinations + chronicle names, not infinite handcrafted skills.

### Optional apex — “one true vessel” (lore)

Novel trope: perfect / primal body. **Do not** collapse all builds into one meta.

| Use | Avoid |
|-----|--------|
| Cosmology, Saint fiction, completionist ordeal | Mandatory best stats |
| Optional title / trib flavor at whole-vessel harmonize | Only viable endgame body |

Most players: their “true” body = **model + composition**, not server-wide true physique.

---

## Vocabulary (use consistently)

| Term | Meaning |
|------|---------|
| **Vessel state** | Whole-body map — always true |
| **Region** | ~6 parts: head, torso, arms, legs (extend later) |
| **Layer** | skin → flesh → bones → organs → blood → meridians → nerves |
| **Work type** | skin temper, **aperture** (eyes), marrow, … — on region, not global organ `%` |
| **Imprint** | Element / essence / poison in a region |
| **Link** | Meridian quality between neighbors |
| **Tension** | Clash energy on a **link** |
| **Harmonize** | Wield both imprints; spend tension — **no overwrite** |
| **Co-refine** | Second pass → **alloy** on layer |
| **Physique name** | Jianghu label — not power source |

---

## Core object: region imprint

Per **region**: `depth`, `imprint`, `purity`, `link`, optional `alloy`.

- **Regions** → local hardness, on-hit bias, break vulnerability.
- **Globals** → derived speed, circulation, strain (capped aggregation).
- **Eyes / apertures** → head region + aperture track — **not** `organs layerProgress +=`.

### Lateral work (piece-by-piece)

- **Not** an itinerary: player may jump tiles (arm → eye → leg).
- **Soft gates:** early eye = low purity, unstable; manuals **advise** outward→inward for **efficiency**.
- **Breakthrough** uses **method project** + holistic **floor** (frame), not “organs 50%.”
- **UI:** silhouette-first; tabs = filters, not the spine.

---

## Five-step refine pipeline

```text
① FIRST REFINE → ② CIRCULATE → ③ TENSION → ④ HARMONIZE → ⑤ CO-REFINE
```

Harmonize = harness; co-refine = alloy material. See prior workshop detail in git history / PR #119 body.

---

## Body refining methods

Extends [Novel guide §1](#guide-1--legendary-methods-not-just-materials). **Not** recipe physiques.

### Pyramid (like qi cultivation methods)

| Tier | Who | Effect |
|------|-----|--------|
| **Crude / common** | Everyone — `basic_flesh_temper` analog | Refinement works; shallow; generic sub-realms |
| **Lineage** | Sect, stolen scroll | Named revolutions, material rules, failure flavor |
| **Legendary / legacy** | Plot, ruin | Higher ceiling, nine-gate spine, unique bottlenecks |

**Muddling** = no / crude manual only — viable, capped purity, no fine chapters.

**Legendary** = **unlock depth**, not **permission** to body cultivate. Same idx floor; higher extent + clarity.

### One primary refining scripture

Mirror qi: one `bodyRefiningMethod.primaryId`; fragments upgrade **grade** within lineage; **remold rite** to change (harsher than meridian-wash).

### Broad vs specific parts

| Access | Scope |
|--------|--------|
| Crude / no chapter | **Broad** regions only (arm, leg, head, torso) |
| Manual chapters | **Fine** (eyes, fingers, ear, single meridian) |

**Coarse → fine** on **same** region = zoom, not side quest. Milestones read **whole vessel** quality, not one tab.

### Method defines

Revolution names, compatibility, project templates, failure tables, harmonize hints — **not** which physique ID you unlock.

---

## Reference manuals — grade I (playtest wedge)

Common **grade I** = **First Temper** (idx 0→1). Two legendaries + crude for triangle.

### Nine Dragons Body Forging (九龙锻体诀)

| | |
|--|--|
| **Legendary because** | Full nine-dragon cycle; dragon-material protocol; yang sovereign apex toward dragon-vessel |
| **Method realm I** | **Hidden Dragon Vessel** (潜龙体) — first of nine |
| **First temper** | **Skin + blood** (wake sleeping dragon lineage — not bone first) |
| **Project** | **Nine Breaths, Hidden Dragon** (九息潜龙) — nine skin–blood circuits |
| **Bottleneck** | Dragon-touched material + ninth breath ordeal; soft torso/frame floor |
| **Sub-realms** | Named breaths 1–9 |
| **Traits I** | Yang blood, scale-skin, dragon pressure; weak to yin/cold poison |
| **Curve** | Under qi at I; spikes II–III (frame dragons) |

### Thousand Poisons Body Forging (千毒锻体诀)

| | |
|--|--|
| **Legendary because** | Poison as fuel; graduated canon; apex Thousand Poisons miasma |
| **Method realm I** | **Poison Seed Vessel** (毒原体) |
| **First temper** | **Skin** — twelve weak poisons in order; **no antidote** during seed phase |
| **Project** | **Twelve Poison Seeds** (十二毒种) |
| **Bottleneck** | Twelfth seed; liver support advised; stain / social hooks |
| **Traits I** | Resist stack, seed backlash, healer wariness |
| **Curve** | Niche-strong attrition/toxin; weak burst; spikes mid–late |

### Crude (no legendary)

| | |
|--|--|
| **Project** | Broad skin + flesh temper |
| **Bottleneck** | Aggregate readiness |
| **Epithet** | Rough Vessel, Militia Bone |
| **Same idx** | Lowest purity ceiling |

**Same idx on success — different snapshot, epithet, fight script.**

### Grade II (Second Forge) — sketch

Same **idx** for all; different project and fight identity. See workshop chat 2026-09-20.

| | **Baseline** | **Nine Dragons** | **Thousand Poisons** |
|--|--------------|------------------|----------------------|
| **Method name** | Settled frame | **Frame Dragon** (2nd of nine) | **Venom Marrow** |
| **Work** | Broad bones + torso | Dragon yang **spine/ribs** project | Poison into **marrow** |
| **Fight feel** | Solid brawler | Tank, structure; art **starts to pay off** | Attrition, toxin; **melee hurts them** |
| **vs qi (baseline)** | ~even on ground | Often **ahead** in grind melee | **Ahead** long/poison; **behind** burst |

---

## Balance & variance

### Three kinds of power

| Kind | Balance job |
|------|-------------|
| **Grade idx** | Qi parity — trib, travel, enemy bands |
| **Combat expression** | Art + map — fight feel |
| **Niche spike** | Strong in lane — bounded, not higher idx |

### Body vs body (same idx)

Intentional spread: model curve, composition, specialization, harmonize, crude vs legendary ceiling. **Profiles** not one DPS number.

### Body vs qi (same idx)

| | Lean |
|--|------|
| Neutral content | ~0.85–1.15 fair |
| Early idx | Qi **ahead** |
| Mid | Parity band |
| Late body commit | Body **ahead** in physical niche; qi in technique/domain |
| Matchups | Poison long fight, dragon sustain, qi burst/range — **content favors** |

### Tools

- **Frame multiplier** — weak spine caps regional expression.
- **Diminishing returns** — over-specialize one region before grade → purity/traits, not idx.
- **Smaller realm jumps** — power in sub-realms + map; breakthrough = **ceiling** bump.
- **Delayed spikes per art** — document in manual flavor.

### Admit early niche power

Poison I / Dragon I can **beat** qi in **their** lane at same idx; **lose** elsewhere. **Not** higher idx.

**Principle:** Same grade index, same world permissions; different models and maps = different fighters.

---

## Economy & material pacing (body balance lever)

Body combat edge is **paid for** in supply chains — not free with the path. Qi is what the **world’s economy is built around**; body is **bespoke**.

| | **Qi (dominant)** | **Body (minority)** |
|--|-------------------|---------------------|
| **Floor progress** | Cultivate from **ambient qi** (slow, always possible) | Crude broad temper with **common** stuff; real depth wants **rare** inputs |
| **Pills & market** | Alchemy mainstream — cheap QC pills, decent pills appear often | Body-support pills **rarer**, pricier, fewer recipes |
| **Who crafts** | Sect alchemy halls everywhere | Often **body-literate** alchemist (frequently dual-path experience) |
| **Breakthrough rhythm** | Can **grind** months; materials **soft-accelerate** | Often **hard-waits** on key material, then **survive** the refine rite |
| **Risk** | Failed pill dose | Failed poison bath, fever, scar, stain |

**Two gates:** **method** (how to use materials without wasting) + **materials** (whether the next project / breakthrough is **possible**).

### Body pills (player-facing lean)

| Tier | Use |
|------|-----|
| **Generic body pills** | Default shop/sect — marrow support, toxin buffer; ~full efficiency not required |
| **Element-tagged** | Matches imprint lean (fire marrow aid, etc.) |
| **Personalised** | **Optional** — late game, rich, sect service; bonus purity / flavor; **not** campaign-critical |

Raw materials + chamber refine remain the **main** body loop; pills are **shortcuts**, not the only path.

**Cross-links:** [`economy-framework.md`](economy-framework.md), [`dustbone-qc-alchemy.md`](dustbone-qc-alchemy.md) (qi pill abundance vs body niche TBD).

**One line:** Qi progresses on **air and a pill economy the world already has**; body on **manuals, rare materials, and surviving refines**.

---

## Combat identity, range & realm claims

Design before more refining detail: fights must respect **distance** and **flight** at higher idx.

### No flight (body) — parallel claims

Per [`realm-claims.md`](realm-claims.md): qi gets **Sky Travel** (NS); body gets **leap / bound crossing** — not hovering. Below NS, fights are **ground game** anyway.

| Idx band | Qi fight edge | Body fight edge |
|----------|---------------|-----------------|
| Early | Techniques at range | **Must close** — wins in the trade |
| GC (2) | Light Body (travel); kiting | **Shockwave / intimidation** claim — reach without flight |
| NS (3)+ | Air mobility | **Leaps** + learned **range skills** |

### Baseline vs baseline (same idx)

**Target fantasy:** Average qi cultivator **fears** average body cultivator in an open **ground** brawl — **speed + durability**; without methods, restraints, terrain, or elite arts, qi **struggles to finish** the fight. **Not** auto-win: smart qi controls distance; **elites** on either side break the baseline band.

| Baseline body | Baseline qi |
|---------------|-------------|
| **Faster** close speed on ground (refinement **shapes** how fast: legs vs heavy frame vs poison fog) | Better **tools at range** |
| **Tougher** in melee | **Glassier** if caught |

**Elites** prove they are not average — intent, method, gear, flight (qi NS+), dragon breath, poison fog, arrays.

### Range (not ignored)

Default body delivery = **melee**. Range is **learned**:

| Source | Examples |
|--------|----------|
| Path / method | Dragon **breath**; poison **fog / miasma** |
| Techniques / claims | Palm wind, GC **shockwave** stomp |
| Gear | Weapons, thrown talismans |
| Late | **Bloody qi** / life-force flung — body flavor, not second dantian |

Attack profile `delivery` (melee · projectile · aura · …) in [`combat-damage-depth.md`](combat-damage-depth.md) should tag body arts explicitly.

### Content mix

Some encounters favor qi (flyer, cliff); some favor body (arena, cave). Idx still gates world power; **matchup** is path + build.

**Open:** Full “fight by idx” table (qi / body / dragon / poison); combat integration pass after damage spine.

---

## Imperfection, knowledge, harmonize, co-refine

(Unchanged core — see sections above in PR #119 / earlier revision.)

**Completeness** = coherence (monotone, cycle, duel-body, chimera, scattered) — not recipe.

**Knowledge** = principles, journal, tension insight — not build wiki.

**Harmonize** = tension spend; **co-refine** = alloy; clash is fuel.

---

## Element on region (expression sketch)

| Imprint | Arm | Leg | Torso | Head |
|---------|-----|-----|-------|------|
| Fire | ignite, speed | burst mobility | guard break | will |
| Water | flow, circ. stress | evasion | regen | sense read |
| Earth | weight | stability | frame hardness | trib stubbornness |
| Poison | venom | toxic trail | internalize | stain, predator sense |

---

## Novel alignment guide (NOT rules)

Workshop items — **one pass each**; foundational changes allowed.

**Target sentence:** *He cultivated **[method]**, fed **[material]**, survived **[nth revolution]**, **[part]** carries **[ability]** — jianghu calls him **[title]**.*

| § | Topic | Status |
|---|--------|--------|
| 1 | [Methods](#body-refining-methods) | **Expanded** in this doc |
| 2 | Named sub-stages / revolutions | Tied to progression spine |
| 3 | Constitution seed | Open |
| 4 | Site / trial tempering | Open |
| 5 | Legendary traits | Open |
| 6 | Aperture abilities | Open — broad vs fine parts |
| 7 | Lineage scarcity | Open |
| 8 | Battle remold | Open |
| 9 | Jianghu recognition | Open |
| 10 | Pacing weight classes | Open |

### Guide 1 — Legendary methods (summary)

Scarce **refining scriptures** change **protocol** (revolutions, materials, failure). Two disciples, same manual, different composition → different vessels. **Not** physique SKU unlock.

---

## Work queue (when owner says build)

1. [ ] Progression spine data (grade, sub-realm, project, bottleneck) — decouple from layer-tab `%`
2. [ ] Vessel state + regional imprints
3. [ ] Body refining method pool (crude + 2 legendaries for wedge)
4. [ ] Combat bridge (hardness, break bias)
5. [ ] Tension + harmonize + co-refine
6. [ ] Novel guides 2–10 as design passes
7. [ ] Economy hooks — body material sinks, pill tiers, specialist NPCs
8. [ ] Combat identity pass — baseline speeds, delivery tags, realm claims in fights

---

## Open questions (parked)

- Co-refine scope per project; tension decay; triple alloys; harmonize per pair vs global.
- Clash punishment soft vs hard scar.
- Grade II+ detail for Dragon / Poison; third model (e.g. Vajra frame).
- Power curve table idx 0–4 × (qi, dragon, poison, crude).
- Body method in `cultivation-manuals-framework.md` — separate save key from qi `primaryId`?
- Exact **close-speed** mult body vs qi baseline; NS flyer tuning.

---

## Implementation crumbs

| Area | Files / ideas |
|------|----------------|
| Chamber today | `body-chamber.js`, `BODY_CHAMBER_*` in `data.js` |
| Combat | `combat.js`, `combat-damage-depth.md` |
| Physique staging | `physique-cultivation.js` — likely rework |
| Qi methods pattern | `data.js` `CULTIVATION_METHODS`, `cultivation-manuals-framework.md` |
| Milestones | `PATHS.body` — reframe names vs idx |
| Realm claims | [`realm-claims.md`](realm-claims.md) — leap vs flight |
| Economy | [`economy-framework.md`](economy-framework.md), alchemy docs |

---

## Chat arc (preserved)

1. Granularity, limb hardness, damage pass; overflow vs composition.
2. Vessel state; harmonize + co-refine; no recipe physiques.
3. **Four pillars** progression; neutral grades + epithet; lateral map vs tab itinerary.
4. Methods: pyramid, chapters, broad/fine; Dragon + Poison grade I–II sketch.
5. Balance: idx parity, niche curves, delayed spikes; variance body–body and body–qi.
6. **Qi/body rewrite:** expression vs substrate; both have horizontal depth.
7. Models + composition + grade; optional true-vessel lore apex.
8. **Combat:** no body flight; baseline bc faster/tougher than baseline qc on ground; range via skills (breath, fog).
9. **Economy:** material + method gates; rare body pills; qi grinds on air + cheap pills.
10. **North star:** deep, explorable cultivation in a detailed xianxia world.
