# Nine-realm mortal ladder

| Field | Value |
|-------|-------|
| **Status** | `designed` (partial — names, lifespan numbers, half-step peak TBD) |
| **Blocked on** | Watershed pacing pass; roots v2 basin labels; full `reqRealm` audit |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chats, 2026-07-19–20 |
| **Updated** | 2026-07-20 |

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
| 4 | **TBD** — not “Soul Transformation” | See naming below — 化神-equivalent without stealing soul-path vocabulary |
| 5 | Void Refinement | Existing — shift index from `4` → `5` |
| 6 | Dao Seeking | Existing — comprehend / pursue dao **before** manifestation |
| 7 | Dao Manifestation | **New** — dao is worn / embodied, not merely studied |
| 8 | Immortal Ascension | Mortal capstone; heavenly ceiling / chaos revelation |

### Why not “Soul Transformation” for idx 4?

Soul path is its own refinement (`PATHS.soul`). Qi-path idx 4 is the **dantian / nascent** line stepping into deity-scale presence — use a name that doesn’t collide:

| Candidate | Flavor |
|-----------|--------|
| **Spirit Transformation** (化神) | Standard xianxia; “spirit” not “soul track” |
| **Deity Transformation** | Strong watershed feel |
| **Divine Manifestation** | External god-presence; distinct from idx 7 “Dao Manifestation” |
| **Transcendent Form** | Neutral |

**Owner pick:** `???` (fill when decided)

### Dao order (owner confirmed)

```text
… → Void → Dao Seeking → Dao Manifestation → Immortal
```

- **Seeking** = comprehend, hunt fragments, read laws  
- **Manifestation** = embody a law; local imposition; bridge to immortal politics  

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

**Goal:** Roughly **similar calendar cost** to peak each basin — comparable to QC → FE — not explosive jumps (`80 → 120 → 200 → 400 → 800`).

### Grade vs tier (basin cap)

| Axis | What it does | Pacing impact |
|------|----------------|---------------|
| **Tier / basin cap** (spirit root composition + ceiling) | Highest **realm index** you can ever reach without aid | Tragedy ending: stuck at peak FE, etc. |
| **Grade** (inferior → heavenly) | **Speed** within each basin; breakthrough odds | Same basins, faster or slower climb — not shorter basins |

**Owner note:** All grades are “equivalent” across tiers in the sense that **time-to-peak a basin** should feel in the same ballpark for whoever can enter that basin; grade changes how fast you move, not how many months the basin inherently costs.

Inferior root that caps at Peak FE still spends ~a lifetime in QC+FE; heavenly root reaches higher basins but each basin still costs **meaningful years**.

### Draft lifespan **caps** (gentle steps — tune in watershed doc)

Linear-ish +40y steps after FE, not doubling:

| Idx | Realm | Cap (draft years) | Δ from prev |
|-----|-------|-------------------|-------------|
| 0 | QC | 80 | — |
| 1 | FE | 120 | +40 |
| 2 | Core | 160 | +40 |
| 3 | NS | 200 | +40 |
| 4 | TBD | 240 | +40 |
| 5 | Void | 280 | +40 |
| 6 | Dao Seeking | 320 | +40 |
| 7 | Dao Manifestation | 360 | +40 |
| 8 | Immortal | 99999 (or “unbound”) | — |

**Implication:** reaching idx 8 still takes **many** breakthroughs; each extension buys time for the **next** climb, but no single jump dominates the calendar. Watershed doc should re-anchor inferior FE @ 80–90 against **+40** steps, not ×2 jumps.

## Realm claims (draft — 9 tiers)

| Idx | Claim | Travel / world hook |
|-----|-------|---------------------|
| 0 | Perception | Sense qi |
| 1 | Anchor | Intent, probe sealed sites |
| 2 | Domain | Light body (local), sect / forbidden |
| 3 | Sovereignty | Sky travel (zones), soul sense |
| 4 | **TBD** | Regional deity-presence (not soul-path) |
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
- [`chaos-cultivation-path.md`](chaos-cultivation-path.md) — revelation at immortal endgame  

## Open questions

- [ ] Final name for idx 4  
- [ ] Half-Step model A vs B  
- [ ] Exact +40 lifespan table or different step size  
- [ ] Does idx 7 Dao Manifestation gate immortal-layer legislation preview?  
- [ ] Upper celestial nine names — mirror this list or fresh set?
