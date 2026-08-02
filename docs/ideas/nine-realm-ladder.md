# Nine-realm mortal ladder

| Field | Value |
|-------|-------|
| **Status** | `designed` (partial — names, lifespan numbers, half-step peak TBD) |
| **Blocked on** | Watershed pacing pass; roots v2 basin labels; full `reqRealm` audit |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chats, 2026-07-19–20 |
| **Updated** | 2026-08-02 |

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

## Half-Step Immortal (stub — peak, not realm?)

**Intent:** Touch heaven’s threshold without completing ascension — peak state **within or immediately before** Immortal Ascension, analogous to Peak Golden Core / sealed dantian.

Possible shapes (pick one later):

| Model | How it works |
|-------|----------------|
| **A — Peak tier** | Realm 8 has sub-states: `approach` → **Half-Step** (peak) → breakthrough attempt → `Immortal Ascension` |
| **B — Named consolidation** | Player action at idx 8: “Step to Heaven’s Threshold” — must peak before final tribulation |
| **C — Separate idx** | Would require 10 mortal realms or demoting something — **not preferred** |

**Design notes (stub):**

- Half-Step = standing at the gate; tribulation / court / chaos revelation hooks here  
- True **Immortal Ascension** breakthrough may be the moment you learn the path is **flawed** (see `chaos-cultivation-path.md`)  
- Upper celestial nine starts **after** mortal Immortal, not at Half-Step  

**Open:**

- [ ] Half-Step mechanical benefits (travel? law? purely narrative gate?)  
- [ ] Can you fail and drop from Half-Step?  
- [ ] NPC / chronicle label for peak Half-Step cultivators  

## Lifespan pacing philosophy (owner direction)

**Goal (2026-08-02):** **Xianxia time-scale** — each watershed grants enough years that high-realm figures are **fixtures on the world map**, not one-generation cameos. A 3rd-tier GC lord can still be ruling when you return centuries later; imperial ancients and sect patriarchs are names you hear across eras without needing bespoke story arcs.

**Basin rule unchanged:** lifespan extension buys calendar for the *next* climb; most cultivators peak late and die in-basin. Long caps at the top reward those who cross — they become the jianghu's long memory.

**QC / FE anchors stay:** inferior peak FE @ **80–90** with **120y** cap ([`watershed-realms-lifespan-pacing.md`](watershed-realms-lifespan-pacing.md)). Everything above FE scales up sharply.

### Acquisition realms (owner lock 2026-08-02)

**VR only:** breakthrough opens the void basin; power acquired inside (early VR ≈ DT Peak).

**Seeking:** breakthrough is a **real jump** — lifespan, moderate power, board weight **immediately**; comprehension deepens over millennia. Peak VR tribulation phenomenon TBD — see [`dao-seeking-and-manifestation.md`](dao-seeking-and-manifestation.md).

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
| 6 | Dao Seeking | **see below** | **~30,000** (target) | TBD | TBD |
| 7 | Dao Manifestation | **~45,000** | **50,000** | **50,000** | TBD |
| 8 | Immortal Ascension | **unbound** (99999) | unbound | unbound | — |

**Refinements from brainstorm:**

- **GC 300–500**, **NS 1k–1.5k**, **DT 2k–3k** — in-basin bands; **exact milestone bumps TBD** when consolidate/substage milestones are designed ([`golden-core-cultivation-journey.md`](golden-core-cultivation-journey.md)).
- **VR 5k–10k** — owner lock: **5,000** on breakthrough (clean half of 10k), **7,500** competent, **10,000** perfected.
- **Dao Seeking / Manifestation** — **not settled**; see [Dao Seeking lifespan (open)](#dao-seeking-lifespan-open) below. Target **~30k** deep Seek, **~50k** Manifest — but *how* you earn years in Seeking needs design tied to comprehension ([`dao-seeking-and-manifestation.md`](dao-seeking-and-manifestation.md)).
- **Immortal** — mortal-map lifespan display ends; Court / immortal layer owns time.

### Dao Seeking lifespan (open)

**Problem (owner 2026-08-02):** A fresh Dao Seeking breakthrough should not hand out **+20,000 years** just for changing realm label. Seeking is a **comprehension** watershed — you hunt and understand laws; that is a different fantasy than “my body got another ten millennia.” A VR peak expert (10k cap) vs someone who *just* broke through Seeking should not feel like the latter instantly outlives the former by triple.

**Lean direction (needs dao milestone design):**

| Beat | Lifespan idea | Why |
|------|---------------|-----|
| Enter Dao Seeking | **Modest bump** over VR perfected — e.g. **12,000–15,000** (TBD) | Buys time to hunt; you are not yet “era immortal” |
| Comprehend / merge milestones | **Extensions toward ~30k band** | Time earned by **what you understand** — greater dao, fundamental merge, etc. (milestones not invented yet) |
| First **wield** → Manifestation | **Big jump ~45k–50k** | Embodiment contract — aligns with Manifestation gate in dao doc |

**NPC implication:** legendary Seekers who never wield stay in the **15k–30k** band (still ancient); true **50k** figures are law-wearers. Ambient “heard of for eras” can use comprehension depth, not just realm idx.

**Open:**

- [ ] Which comprehension beats grant years? (first Greater? first Fundamental merge? library size?)
- [ ] Flat ~30k at “deep Seek” without Manifestation — valid tragedy / plateau ending?
- [ ] Manifestation perfected — stay 50k or allow 55k before Immortal?

**For implementers later (plain language):** the game will need one “years you can live” number per character, plus rules for when breakthroughs and dao milestones extend it. No need to decide file names now.

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
| Deep Seeker (comprehension, no wield) | Seek | **15k–30k** (TBD) | Ancient scholar; not yet law-on-skin |
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
| 6 | Law (seek) | Dao panel, fragment hunt |
| 7 | Law (wear) | Embody law; local imposition |
| 8 | Transcendence | Above mortal map; immortal fork |

## Implementation migration (when building)

- `PATHS.*.realms` — add 2 names; shift indices 4+  
- `LIFESPAN_BY_REALM` — 9 entries  
- `DAO_SEEKING_REALM_IDX`: `5` → `6`  
- `isImmortal()`: `>= 6` → `>= 8`  
- Audit `reqRealm`, `minRealm`, tribulation tiers, enemies, market stock, height labels in roots doc  
- Soul / body paths: parallel realm **names** at each index (shared idx, different skin)  

## Links

- [`watershed-realms-lifespan-pacing.md`](watershed-realms-lifespan-pacing.md) — basin grind vs lifespan (needs update for 9)
- [`spiritual-roots-taxonomy-v2.md`](spiritual-roots-taxonomy-v2.md) — basin tier labels (+2 heights)
- [`realm-claims.md`](realm-claims.md) — per-realm abilities & travel
- [`chaos-cultivation-path.md`](chaos-cultivation-path.md) — revelation at immortal endgame

## Open questions

- [x] Idx 4 name — **Deity Transformation** (lean; UI copy may shorten)  
- [ ] Half-Step model A vs B  
- [x] Lifespan philosophy — **xianxia scale**, nine-realm table (owner 2026-08-02)
- [x] VR breakthrough floor — **5,000** (owner aesthetic: half of 10k)
- [ ] GC+ in-basin milestone **+years** — when milestones exist
- [ ] Dao Seeking — comprehension-linked extensions (see open section above)
- [ ] Does idx 7 Dao Manifestation gate immortal-layer legislation preview?  
- [ ] Upper celestial nine names — mirror this list or fresh set?
