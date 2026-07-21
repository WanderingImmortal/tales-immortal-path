# Watershed realms & lifespan pacing

| Field | Value |
|-------|-------|
| **Status** | `idea` |
| **Blocked on** | [`spiritual-roots-taxonomy-v2.md`](spiritual-roots-taxonomy-v2.md) (roots before realm pacing); breathing-technique system |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent planning chat, 2026-07-18 |
| **Updated** | 2026-07-18 |

> **Nine realms:** Mortal ladder expanded to 9 indices — see [`nine-realm-ladder.md`](nine-realm-ladder.md). Lifespan table and anchors in this doc need a pass (+40y gentle steps, not ×2 jumps).

## Intent

Cultivation is **fighting fate**: each realm's granted lifespan should be **mostly consumed** reaching that realm's peak. Advancing is rare — talent, time, pills, formations, and luck. Most cultivators **plateau at peak** and die unable to cross the watershed. The player journey is long and costly, not button-spam.

**Target anchor (owner):** with an **inferior root**, reach **Peak Foundation Establishment around age 80–90** (from age 16 start).

## Design notes

### What was built vs what was tuned

FE received **depth** (qi chamber, pillars, seal tiers, gather/expand/refine) but **not lifespan pacing**. `CHAMBER_BALANCE` explicitly makes Gather ≈**6× faster** than legacy Cultivate (1 week vs 6 months on density). More systems, **less** calendar time — opposite of the vision.

### World rule: watershed realms

Each major realm is a **basin**:

```
Enter realm (lifespan extends) → grind toward peak → seal / stabilise
        → few cross to next realm (tribulation + aptitude + aid)
        → many stuck at peak until lifespan runs out
```

- **Peak without advance** is a valid, common end state (NPC flavour, player tragedy runs).
- **Lifespan extension** from breakthrough is the reward that buys time for the *next* basin — if you peaked late, you may have **no time left** to attempt the crossing (regret ending).
- Not everyone in a realm is climbing; most are mid-realm or peak-stuck.

### Pacing model (draft math)

| Milestone | Inferior root target age | Notes |
|-----------|--------------------------|-------|
| Start | 16 | `STARTING_AGE_YEARS` |
| Peak Qi Condensation + BT | TBD (e.g. 35–50) | Uses most of **80y** mortal cap window |
| Peak Foundation Establishment | **80–90** | Owner anchor |
| Lifespan at FE tier | **120y** cap | Only **30–40 years left** if peak FE at 80–90 |
| Golden Core crossing | Rare without aid | May require pills/formations/talent; many die stuck at FE peak |

**Implication:** hitting FE peak at 90 with 120y cap gives ~30 years to attempt GC — aligns with "most can't advance" and "cultivation against fate."

Superior / mutant roots: peak FE earlier → more GC runway → protagonists and sect geniuses.

### Root taxonomy — expand for flexibility

Current 6 grades are coarse; `naturalRealmCap: 2` lets inferior roots reach Golden Core too easily.

**Dimensions to mix (sketch):**

| Axis | Examples |
|------|----------|
| **Grade** | inferior / common / superior / mutant / heavenly |
| **Composition** | single-element / dual / mixed / mutated |
| **Ceiling** | max realm index without aid (cap at FE peak, GC, NS, …) |
| **Speed** | cultivate mult, breakthrough bonus |
| **Feasibility** | can attempt next watershed without bypass? |

**Example profiles (not final):**

- *Mixed inferior fire/water* — slow, cap **stuck at Peak FE** unless pill bypass
- *Single superior wood* — standard sect disciple, can reach GC with discipline
- *False spirit root* — fast early, hard cap at QC
- *Consumptive root* — normal speed, lifespan mult 0.9

Tie roots to **creation CP** and optional **breathing technique** unlock (`technique-driven-cultivation.md`).

### Aid that changes fate (not cheating — the genre)

- Pills, formations, sect arrays → `talentCapBypassed`, speed, tribulation odds
- Better breathing manual → gather speed + foundation variant
- Events, forbidden grounds, legacy meta

Without aid, inferior root = **respect the clock**.

### NPC / world expression

- Peak elders, broken cores, sect masters who "stopped" centuries ago
- Rumours: "reached Foundation peak at ninety, died at one-twenty never forming the core"
- Age shown in NPC cards where relevant

### Tuning levers (when implementing)

- Chamber action **weeks → months** at higher tiers; gather density gains ÷10 or worse for inferior roots
- **Peak requirement curves** much steeper; pillar caps gate progress
- **Seal / breakthrough** costs in years
- **Lifespan mult** per root grade
- Remove or heavily nerf **shortcuts** (condense-at-FE, 24mo→1mo skips) until redesigned
- **Explore / combat / sect** compete for same months — journey not pure cultivate

## Prerequisites

- [ ] Long-activity UX — [`chronicle-and-projects.md`](chronicle-and-projects.md) (diary + tick playback + projects)
- [ ] Owner sets per-realm age anchors (FE 80–90 inferior; QC and GC TBD)
- [ ] Root taxonomy v2 (`TALENT_GRADES` overhaul)
- [ ] `talentCapBypassed` wired to pills/formations/events
- [ ] FE chamber redesign (`qi-foundation-establishment-redesign.md`)

## Open questions

- Does QC also take "most of mortal lifespan" before first extension, or can geniuses BT young?
- Stuck-at-peak game over, or free play until lifespan death with legacy?
- How many root variants at creation vs discovered in-world?
- Body/soul paths: same watershed calendar or different lifespans?

## Implementation crumbs

- `LIFESPAN_BY_REALM`, `CHAMBER_BALANCE`, `TALENT_GRADES`, `REALM_PROGRESS_TIERS`
- `CONSOLIDATION_BY_REALM` — seal months and peak requirements
- `talent.js` — `naturalRealmCap`, `getTalentCultivateMult`
- `ACTION_MONTHS.breakthrough` (24)
