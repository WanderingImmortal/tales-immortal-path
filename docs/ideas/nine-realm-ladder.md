# Nine-realm mortal ladder

| Field | Value |
|-------|-------|
| **Status** | `designed` (partial — body/soul names and half-step powers still open) |
| **Blocked on** | Body/soul names for the two new slots; half-step powers. Roots: index bump only — expansion is later. |
| **Issue** | none yet |
| **Chat / PR** | Owner leans 2026-09-25 — Seeking entry 10k; half-step is not a realm |
| **Updated** | 2026-09-25 |

## Intent

Expand the mortal qi ladder from **7 → 9 realms** (indices `0–8`). Early block **unchanged** (QC → FE → Golden Core). New realms slot **after Nascent Soul** because that band is the most flexible — not because NS is special for pacing.

**Upper celestial nine** is a separate ladder later (mirror structure, different plane).

**Half-Step Immortal** is a **peak / consolidation state** before true Immortal Ascension — not necessarily its own realm index (stub below).

## Mortal ladder (draft)

| Idx | Realm | Notes |
|-----|-------|-------|
| 0 | Qi Condensation | Unchanged |
| 1 | Foundation Establishment | Unchanged |
| 2 | Core Formation (Golden Core) | Unchanged — “major realm” watershed |
| 3 | Nascent Soul | Unchanged — qi-path soul externalized; distinct from **soul refinement track** |
| 4 | **Deity Transformation** (owner lean) | 化神-equivalent; see naming note below — not soul-path vocabulary |
| 5 | Void Refinement | Existing — shift index from `4` → `5` |
| 6 | Dao Seeking | Existing — comprehend / pursue dao **before** manifestation |
| 7 | Dao Manifestation | **New** — dao is worn / embodied, not merely studied |
| 8 | Immortal Ascension | Mortal capstone; heavenly ceiling / chaos revelation |

### Idx 4 — Deity Transformation (owner lean)

Soul path is its own refinement (`PATHS.soul`). Qi-path idx 4 is the **dantian / nascent** line stepping into deity-scale presence — not “Soul Transformation.”

**Preferred name:** **Deity Transformation** (化神). Owner note: can feel *too grand* for UI — that may be fine (it’s xianxia); use shorter copy where needed.

| Use | Label |
|-----|-------|
| Formal realm name | Deity Transformation |
| Short / sidebar | Deity Form · Spirit Form · 化神 |
| Oracle / breakthrough | *“The mortal shell no longer contains you. You have become something the jianghu names with fear.”* |
| NPC rumor | *“A deity-transcended cultivator passed through Dustbone.”* |

**Alternates if tone shifts:** Spirit Transformation, Transcendent Form.

### Dao order (owner confirmed)

```text
… → Void → Dao Seeking → Dao Manifestation → Immortal
```

- **Seeking** = comprehend laws, witness signs, open pursuit threads  
- **Manifestation** = embody a law; local imposition; bridge to immortal politics  

**Deep doc:** [`dao-seeking-and-manifestation.md`](dao-seeking-and-manifestation.md) — Lesser vs Greater, library/merge/wear, Manifestation depth, sword example.

## Half-Step Immortal (pseudo-state — not a realm)

**Owner lean (2026-09-25):** Half-Step is a step above ordinary peak. It is not its own realm. Do not add a tenth index. What it grants is still open — leave it until that feels obvious.

It sits on **Dao Manifestation** (the last realm before ascension): past that realm’s normal peak, short of the Immortal Ascension breakthrough. Same family as Peak Golden Core — a condition on the character, not a new row on the ladder. While you are Half-Step, you are still a Manifestation cultivator. Immortal Ascension is the breakthrough that comes after.

**Rejected:** a separate realm index. That would be ten mortal realms.

**Can hang here later, without deciding them now:** the final tribulation, the court, the chaos revelation ([`chaos-cultivation-path.md`](chaos-cultivation-path.md)). Upper celestial nine still starts after mortal Immortal, not at Half-Step.

**Open:**

- [ ] What Half-Step actually does (travel, law, or only a gate in the story)
- [ ] Can you fail and drop back to ordinary peak?
- [ ] What chronicles and NPCs call someone standing there

## Lifespan pacing philosophy (owner direction)

**Goal (2026-08-02):** **Xianxia time-scale** — each watershed grants enough years that high-realm figures are **fixtures on the world map**, not one-generation cameos. A 3rd-tier GC lord can still be ruling when you return centuries later; imperial ancients and sect patriarchs are names you hear across eras without needing bespoke story arcs.

**Basin rule unchanged:** lifespan extension buys calendar for the *next* climb; most cultivators peak late and die in-basin. Long caps at the top reward those who cross — they become the jianghu's long memory.

**QC / FE anchors stay:** inferior peak FE @ **80–90** with **120y** cap ([`watershed-realms-lifespan-pacing.md`](watershed-realms-lifespan-pacing.md)). Everything above FE scales up sharply.

### Acquisition realms (owner lock 2026-08-02)

**VR only:** breakthrough opens the void basin; power acquired inside (early VR ≈ DT Peak).

**Seeking:** breakthrough is **Glimpse + Rulebook Retaliation survived** — moderate power and board weight immediately. Lifespan rises **to 10,000** if you were below that, and does not go past a perfected Void cultivator until laws extend it. See [`void-cosmology-and-refinement.md`](void-cosmology-and-refinement.md).

**Manifestation:** first wield opens embodiment grind.

### Grade vs tier (basin cap)

| Axis | What it does | Pacing impact |
|------|----------------|---------------|
| **Tier / basin cap** (spirit root composition + ceiling) | Highest **realm index** you can ever reach without aid | Tragedy ending: stuck at peak FE, etc. |
| **Grade** (inferior → heavenly) | **Speed** within each basin; breakthrough odds | Same basins, faster or slower climb — not shorter basins |

Grade changes **how fast** you move, not the **ceiling years** at a given peak quality.

### Lifespan caps — nine realms (owner lean 2026-08-02)

**Breakthrough** = cap on entering the realm. **GC+** also use **in-basin milestones** (consolidate / competent peak / perfected peak) to extend within the band — matches substage grind ([`golden-core-cultivation-journey.md`](golden-core-cultivation-journey.md)).

| Idx | Realm | On breakthrough | Competent peak | Perfected peak | Δ (breakthrough) |
|-----|-------|-----------------|----------------|----------------|------------------|
| 0 | Qi Condensation | **80** | 80 | 80 | — |
| 1 | Foundation Establishment | **120** | 120 | 120 | +40 |
| 2 | Core Formation | **300** | **400** | **500** | +180 |
| 3 | Nascent Soul | **1,000** | **1,250** | **1,500** | +700 |
| 4 | Deity Transformation | **2,000** | **2,500** | **3,000** | +1,000 |
| 5 | Void Refinement | **5,000** | **7,500** | **10,000** | +3,000 |
| 6 | Dao Seeking | **10,000** | via laws (playtest) | via laws (playtest) | +0 if Void is already perfected |
| 7 | Dao Manifestation | **~45,000** | **50,000** | **50,000** | TBD |
| 8 | Immortal Ascension | **unbound** (99999) | unbound | unbound | — |

**Refinements from brainstorm:**

- **GC 300–500**, **NS 1k–1.5k**, **DT 2k–3k** — in-basin bands; **exact milestone bumps TBD** when consolidate/substage milestones are designed ([`golden-core-cultivation-journey.md`](golden-core-cultivation-journey.md)).
- **VR 5k–10k** — owner lock: **5,000** on breakthrough (clean half of 10k), **7,500** competent, **10,000** perfected.
- **Dao Seeking** — entry **10,000** (owner 2026-09-25). Years above that come from laws; the amounts are playtest. See [Dao Seeking lifespan](#dao-seeking-lifespan-owner-lean-2026-09-25).
- **Dao Manifestation** — first wield still the big jump (**~45,000–50,000**). Unchanged.
- **Immortal** — mortal-map lifespan display ends; Court / immortal layer owns time.

### Dao Seeking lifespan (owner lean 2026-09-25)

**Entry cap: 10,000 years.** Same clock as a perfected Void cultivator.

A fresh Seeker does not outlive a Void peak expert. That was the worry behind the old 12,000–15,000 lean: even a “modest” bump still let a brand-new Seeker bury someone who had finished Void. At 10,000 they tie.

If you already perfected Void, the breakthrough does not add years. The reward is the mandate: moderate power, board weight, and permission to earn more years from laws. If you cross earlier, you are raised **to** 10,000, not past it (Void’s 5,000 or 7,500 both become 10,000).

**Above 10,000 is playtest.** How much each law adds, and whether going deeper on a law adds more than picking up another one, needs testing. Do not lock that math in the first ladder change.

**Guardrail while testing:** a Seeker who never wields a law should stay under the Manifestation jump (~45,000–50,000 on first wield). The old ~30,000 “deep Seek” figure is a test target for that band, not a number to ship. If a library of laws can outlive a law-wearer, the 50,000-year legends stop meaning anything.

**Test depth before count.** A pile of shallow laws should not equal one law you have actually gone deep on. Seeking is a comprehension realm. Add a second dial only after the first one is readable in play.

| Beat | Lifespan | Why |
|------|----------|-----|
| Enter Dao Seeking | **10,000** | Ties perfected Void. Earlier Void is raised to this floor. |
| Laws / depth | **Playtest**, staying under the Manifestation jump | Years earned by what you understand |
| First **wield** → Manifestation | **~45,000–50,000** | Embodiment is a different contract from study |

**NPC implication:** a Seeker with no laws yet shares a clock with a hidden Void elder (10,000). Seekers who never wield live somewhere above that and below the law-wearers. True **~50,000** figures are still the ones who wear a law.

**Open:**

- [ ] Which beats grant years — depth of one law, number of laws, or both? (playtest; try depth first)
- [ ] Where the no-wield plateau sits inside the under-Manifestation band
- [ ] Manifestation perfected — stay 50,000 or allow 55,000 before Immortal?

**For implementers later:** one “years you can live” number per character. Breakthrough sets it to 10,000 if it was lower. Law milestones add on top later. No need to decide file names now.

### World-map presence (why the numbers matter)

Tie to [`city-tiers.md`](city-tiers.md) civic apex. Lifespan is how long **ambient power** can hold a seat without chronicle hand-waving.

| Figure | Typical realm / peak | Lifespan band | Player experience |
|--------|----------------------|---------------|-------------------|
| 4th-tier town lord (Redwell) | FE / strong QC | ~120y | May outlive a reckless QC run; generational turnover |
| 3rd-tier capital lord | GC competent–peak | **400–500y** | **Same name when you return** after decades of cultivation |
| 2nd-tier regional lord | NS | **1,000–1,500y** | Dynasty-scale; rumors and grudges span your whole GC climb |
| Great sect elder (retired peak) | GC perfected | ~500y | Roster fixture; not a quest NPC — still there |
| Sect patriarch / imperial minister | NS–DT | 1k–3k | Background power; chronicle entries, not mandatory scenes |
| 1st-tier vault elder | VR (hidden) | **7.5k–10k** | Mythic; name on laws and ruins |
| Fresh Seeker (no laws yet) | Seek | **10,000** | Same clock as a perfected Void elder |
| Deep Seeker (laws, no wield) | Seek | **above 10k, under ~45k** (playtest) | Ancient scholar; not yet law-on-skin |
| Dao-wearer legend | Manifest | **~50k** | Era-defining; mortal map treats them like weather |

**Design intent:** not every elder is a story character — **persistence** sells scale. Chronicle + living clock can reference “still Lord Chen” without bespoke scripting if lifespan and role data agree.

**Supersedes:** earlier draft +40y gentle steps (2026-07) — kept for history in git only.

## Realm claims (draft — 9 tiers)

| Idx | Claim | Travel / world hook |
|-----|-------|---------------------|
| 0 | Perception | Sense qi |
| 1 | Anchor | Intent, probe sealed sites |
| 2 | Domain | Light body (local), sect / forbidden |
| 3 | Sovereignty | Sky travel (zones), soul sense |
| 4 | Transformation | Deity-presence in a region (not soul-path) |
| 5 | Passage | Blink / void skip |
| 6 | Law (seek) | Dao panel, insight pursuit |
| 7 | Law (wear) | Embody law; local imposition |
| 8 | Transcendence | Above mortal map; immortal fork |

## Body path names (proposal — not locked, 2026-09-25)

The live list (Bronze Skin through Indestructible Vajra) ranks materials. It does not match the weight of the qi steps, and it has no room for the two new realms. Owner ask: rework all nine. Power is excavated from inside the body. **Saintly Flesh** stays the end (Saint, parallel to Immortal).

One dig, getting grander:

| Idx | Qi neighbor | Proposed body name | What the step is |
|-----|-------------|--------------------|------------------|
| 0 | Qi Condensation | **Inner Tempering** | What you’re doing. Start digging power out of your own flesh. |
| 1 | Foundation Establishment | **Vessel Establishment** | What you’re doing. Brace the body so the dig has something that can hold it. |
| 2 | Core Formation | **Essence Pearl** | What you’ve become. The dig condenses into one precious thing inside you. The watershed. Vessel Rules can be sworn around here; they are not required to enter the realm. |
| 3 | Nascent Soul | **Nascent Physique** | What you’re becoming. That pearl gives birth to a physique. A second body, not a soul. |
| 4 | Deity Transformation | **Physique Transformation** | What you’re becoming. The physique changes into something that is no longer the person who started. Owner lean 2026-09-25. |
| 5 | Void Refinement | **Hollow Refinement** | What you’re doing. Dig past the physique into the empty place under it. Opening it is the door; strength is refined inside. |
| 6 | Dao Seeking | **Origin Seeking** | What you’re doing. See play note below — the name can stay; the activity must not be a dao library. |
| 7 | Dao Manifestation | **Origin Manifestation** | What you’re becoming. The origin is the flesh people meet. Same play note as Seeking. |
| 8 | Immortal Ascension | **Saintly Flesh** | Locked. What you’ve become. Saint, not immortal. |

**Naming rule (owner 2026-09-25):** a body realm name is either the work (what you’re doing) or the change (what you’re becoming).

**Physique Transformation** is the lean at idx 4. Deity Physique still works as a title you hold; Transformation is the event, and it should feel like a new kind of body, the way Deity Transformation feels like a new kind of cultivator.

**Origin Seeking / Origin Manifestation** sound like Dao Seeking with the noun swapped. That is acceptable only if the play is obviously not a law library. Dao at this height is witnessing signs, collecting laws, merging them, and later wearing one. Body at this height is one excavated source in the flesh. A swearer finds that the source is their Vessel Rule: the body gets narrower and more terrifying at what the oath allows. Someone who never swore is still digging out the source, and does not get interior peak. Neither one is browsing a second dao panel.

**Vessel Rules are not a realm.** They already open around the Essence Pearl band (swear gate leans vessel idx 2), which is mid-path, and they are how a dedicated body cultivator specializes. Most temperers never swear. Interior peak and the road to Saint want the oath completed. Naming a realm after the rule would force that oath on everyone who wants the step. The divergence lives in the oath, not in the nine shared names.

**Swaps still on the table:** Essence Pearl → Marrow Pearl, or Inner Seed. Origin → Source, if origin sounds too cosmic. If the Seeking / Manifestation verbs still feel like a reskin after the play split, change the verbs and keep the journey: **Origin Tempering** (the work) and **Origin Flesh** (what you become).

**Indestructible Vajra** leaves the generic ladder. **Golden Body Arhat** stays a Vajra Ridge nickname for someone at Saintly Flesh, not a realm.

**Chamber (lean 2026-09-25):** the live body chamber is the mortal dig for realms 0–3 only, one screen, milestones along it. Later realms change the work on that finished body. They do not each inherit a layer. See [`body-path-refining-rewrite.md`](body-path-refining-rewrite.md).

**Inner Tempering** has a saturation limit (Late = full mortal frame). Diminishing returns only apply while filling it. Peak is optional and still mortal. Lifespan stays the 80-year cap. The physique you **build** is the vessel physique. Luck at birth is a **birth marrow** or, rarely, a physique seed. Spirit roots do not cap how far body refining can go. Manuals and materials do. See [`body-path-refining-rewrite.md`](body-path-refining-rewrite.md).

Soul names are a separate pass.

## Implementation migration (when building)

- `PATHS.*.realms` — add 2 names; shift indices 4+
- `LIFESPAN_BY_REALM` — 9 entries. Dao Seeking entry is **10,000**. Law bonuses are not part of this change.
- `DAO_SEEKING_REALM_IDX`: `5` → `6`
- Immortal is already “the last name on the list” in code. It stays correct if qi, body, and soul all grow to nine names together.
- Audit `reqRealm`, `minRealm`, tribulation tiers, enemies, market stock. Old saves store a realm number: anyone past Nascent Soul has to be shifted.
- **Body names:** proposal above is not locked. Top stays **Saintly Flesh** (圣体境); person shorthand **Saint** / **Saints** — **圣** lane, not 仙 immortal — see [`body-path-sect.md`](body-path-sect.md). **Golden Body Arhat** (金身罗汉) is **Vajra Ridge only**. Soul names still deferred. All three paths still need nine labels when the ladder ships.
- **Spirit roots (owner 2026-09-25):** bump existing ceiling numbers so they still mean the same realm (Void Horizon stays Void, which moves from index 4 to 5). Do not redesign roots in the ladder change. What a root is allowed to reach once Deity Transformation and Dao Manifestation exist is a later pass — see [`spiritual-roots-taxonomy-v2.md`](spiritual-roots-taxonomy-v2.md).

## Links

- [`watershed-realms-lifespan-pacing.md`](watershed-realms-lifespan-pacing.md) — basin grind vs lifespan (needs update for 9)
- [`spiritual-roots-taxonomy-v2.md`](spiritual-roots-taxonomy-v2.md) — index bump with the ladder; height expansion later
- [`realm-claims.md`](realm-claims.md) — per-realm abilities & travel
- [`chaos-cultivation-path.md`](chaos-cultivation-path.md) — revelation at immortal endgame

## Open questions

- [x] Idx 4 name — **Deity Transformation** (lean; UI copy may shorten)
- [x] Half-Step is not a realm — a step above peak Dao Manifestation. Powers still open (owner 2026-09-25)
- [x] Lifespan philosophy — **xianxia scale**, nine-realm table (owner 2026-08-02)
- [x] VR breakthrough floor — **5,000** (owner aesthetic: half of 10k)
- [x] Dao Seeking entry — **10,000**, tying perfected Void (owner 2026-09-25). Law amounts are playtest.
- [ ] GC+ in-basin milestone **+years** — when milestones exist
- [ ] Dao Seeking — which law beats add years (playtest; try depth before count)
- [ ] Does idx 7 Dao Manifestation gate immortal-layer legislation preview?  
- [ ] Upper celestial nine names — mirror this list or fresh set?
