# Creation-path guilds (alchemy · forging · formations)

| Field | Value |
|-------|-------|
| **Status** | `designed` (parked — owner returns after other builds) |
| **Blocked on** | HQ city on map; zone-hub branches; exact branch exam max (4 vs 5) |
| **Issue** | none yet |
| **Chat / PR** | Formations F2b lean 2026-07-22 — [PR #61](https://github.com/WanderingImmortal/tales-immortal-path/pull/61) |
| **Updated** | 2026-07-22 (parked — enough to resume later) |

## Intent

Each **creation path** (alchemists, forgers, formation masters, …) has a **guild** — standards, exams, hire, and craft trade. The game does not have these yet. This idea parks **where they live**, how **branches** work, and how a later **formation-leaning great sect** fits without blocking F2b.

## Design notes

### Owner lean (2026-07-22)

**Ranks / formations**

- **Adept = the art** — Inscriber is “learning the moves”; Adept is the first real exam gate. See [`formations-and-arrays.md`](formations-and-arrays.md).
- **Formations Guild is necessary** (name locked — simple, imposing). Specialist formation **sect can wait** — give an existing top-tier sect more backstory later rather than inventing a new power now.

**Formations Guild geography**

| Piece | Lean |
|-------|------|
| **Name** | **Formations Guild** |
| **Headquarters** | **Own city** (not imperial city) — room for their own Arrays, halls, and guild-scale infra |
| **Branches** | One per zone, at that zone’s **primary hub** (see map note below) |
| **Branch exams** | Higher than **Adept**, **not the peak** — only HQ has the skill to test the highest grades |
| **Branch services** | Exams (up to branch ceiling), hire formation masters, guild-inclined trade (e.g. sell rare formation finds) |

**Map note (as of 2026-07-22):** there is **no formal city-tier system** in data. Each zone has roughly **one primary hub** (`isDefault` city/market, or the obvious trade node):

| Zone | Primary hub today |
|------|-------------------|
| Dustbone | Bone Crossroads (`city`) |
| Frostbite | Frost Gate Outpost (`city`) |
| Jade | Tide Harbor (`market`) |
| Emberwild | Ashvein Village (`city`) |
| Heartlands | Celestial Market (`market`) — no classic “tier-1 city”; Outer Heartlands is wilderness default |

So “branch in each zone’s best city” ≈ **pin to that one hub** until/unless more cities are added. Heartlands may need a clearer civic pin later (market vs a true city).

**Sibling guilds (sketch)**

| Path | HQ lean | Why |
|------|---------|-----|
| **Formations Guild** | Own city | Arrays / guild-scale patterns need space and autonomy |
| **Alchemy** | **Imperial city** | Wealth and power accumulate there — alchemists are fish in water |
| **Forging** | **Deferred** — don’t lock HQ yet | Defense / military liberties still undecided |

Separate guilds per path (not one mega Artisan Guild) unless that changes later.

### Specialist sect (later)

- Not required for Adept exams.
- Prefer **backstory on a current top-tier sect** (formation-famous among the existing greats) over a brand-new map power.
- Role when it lands: rare patterns, elders, rivalry / pilgrimage — **Formations Guild** still owns **rank standards**.

### Exam ceiling (branch vs HQ)

Master ladder reminder: 3 Adept → 4 Array Disciple → 5 Formation Master → 6 Array Master → 7 Grand Formationist.

| Site | Can examine through (soft) |
|------|----------------------------|
| **Zone branch** | Above Adept; **not peak** — exact cutoff TBD (agent lean: through **Array Disciple (4)** or **Formation Master (5)**) |
| **HQ city** | Highest grades (Array Master / Grand Formationist) — only HQ has examiners of that skill |

Day-to-day Adept (and mid ranks) should not require a continent trek to HQ.

### Agent lean (aligned)

- Ship **Formations Guild + zone-hub branches** before specialist-sect fiction.
- F2b **local shelf proof** stays as stand-in / practice until branch halls exist; then Adept+ migrates to the zone hub branch.
- HQ city is a **later world beat** (grand arrays, deeper trade, peak exams).

### Player-facing services (per branch)

- Attempt rank exam (up to branch ceiling)
- Hire lay / maintain / decipher
- Buy unread diagrams; sell / consign rare formation finds
- (Later) membership standing that soft-gates prices / SKUs

### Cross-links

- Formations exams / FI: [`formations-and-arrays.md`](formations-and-arrays.md)
- Great sects / imperial: [`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md)
- Zone / city map: [`local-world-map-split.md`](local-world-map-split.md), [`world-scale-and-travel.md`](world-scale-and-travel.md)

## Prerequisites

- [x] Formations Guild necessary; name locked (owner 2026-07-22)
- [x] Specialist sect later via existing top-tier backstory (owner 2026-07-22)
- [x] HQ = own city; branches at each zone’s primary hub (owner 2026-07-22)
- [x] Branch exam ceiling > Adept, < peak; HQ only for highest grades (owner 2026-07-22)
- [x] Alchemy HQ lean = imperial city (owner 2026-07-22)
- [x] Forging HQ deferred (owner 2026-07-22)
- [ ] Name / place the Formations Guild **HQ city** (new place vs elevate existing)
- [ ] Exact branch exam max tier (4 vs 5)
- [ ] Heartlands branch pin: Celestial Market vs a future civic city
- [ ] Whether F2b local proof becomes practice-only or disappears when branches ship

## Open questions

- HQ city: brand-new place on the world/local map, or elevate an existing mid/outer city?
- Exact branch ceiling: Array Disciple (4) vs Formation Master (5)?
- Branch quality: same exam everywhere, or Heartlands branch richer SKUs?
- Rare-formation trade: open market stall, guild escrow, or reputation-gated consign?

## Implementation crumbs

- Current Adept exam UI: formation shelf (`formations.js`, `FORMATION_F2B`) — local, no world hub.
- Branch UI likely attaches to zone primary hubs in `WORLD_LOCATIONS` / `ZONE_LOCAL_LAYOUT`.
- Do **not** block merge of PR #61 on this fiction.
