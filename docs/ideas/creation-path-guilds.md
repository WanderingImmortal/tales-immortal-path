# Creation-path guilds (alchemy · forging · formations)

| Field | Value |
|-------|-------|
| **Status** | `idea` |
| **Blocked on** | World geography (guild city / zone best-cities); profession ladders that need exam hubs |
| **Issue** | none yet |
| **Chat / PR** | Formations F2b lean 2026-07-22 — [PR #61](https://github.com/WanderingImmortal/tales-immortal-path/pull/61) |
| **Updated** | 2026-07-22 |

## Intent

Each **creation path** (alchemists, forgers, formation masters, …) has a **guild** — standards, exams, hire, and craft trade. The game does not have these yet. This idea parks **where they live**, how **branches** work, and how a later **formation-leaning great sect** fits without blocking F2b.

## Design notes

### Owner lean (2026-07-22)

**Ranks / formations**

- **Adept = the art** — Inscriber is “learning the moves”; Adept is the first real gate. See [`formations-and-arrays.md`](formations-and-arrays.md).
- **Formation guild is necessary.** Specialist formation **sect can wait** — give an existing top-tier sect more backstory later rather than inventing a new power now.

**Formation Guild geography**

| Piece | Lean |
|-------|------|
| **Headquarters** | **Own city** (not imperial city) — room for their own Arrays, halls, and guild-scale infra |
| **Branches** | In **each zone’s best city** — exams, hire formation masters, guild-inclined trade (e.g. sell rare formation finds) |
| **Exams** | Taken at a **zone branch** (travel to that city’s guild hall), not only at HQ |

Imperial city was considered for HQ; owner leans **away** so the guild isn’t swallowed by court wealth politics and can actually run arrays on home ground.

**Sibling guilds (sketch)**

| Path | HQ lean | Why |
|------|---------|-----|
| **Formation** | Own city | Arrays / guild-scale patterns need space and autonomy |
| **Alchemy** | **Imperial city** | Wealth and power accumulate there — alchemists are fish in water |
| **Forging** | Uncertain — maybe imperial, maybe not | Depends how much liberty forging gets around **defense / military** production; don’t lock until that fiction is clear |

Separate guilds per path (not one mega Artisan Guild) unless that changes later.

### Specialist sect (later)

- Not required for Adept exams.
- Prefer **backstory on a current top-tier sect** (formation-famous among the existing greats) over a brand-new map power.
- Role when it lands: rare patterns, elders, rivalry / pilgrimage — guild still owns **rank standards**.

### Agent lean (aligned)

- Ship **guild + zone branches** before specialist-sect fiction.
- F2b **local shelf proof** stays as stand-in / practice until branch halls exist; then Adept+ migrates to “travel to zone best-city guild branch.”
- HQ city is a **later world beat** (grand arrays, deeper trade, elder exams) — day-to-day Adept exam should not require crossing the continent to HQ.

### Player-facing services (per branch)

- Attempt rank exam (Adept+ when wired)
- Hire lay / maintain / decipher
- Buy unread diagrams; sell / consign rare formation finds
- (Later) membership standing that soft-gates prices / SKUs

### Cross-links

- Formations exams / FI: [`formations-and-arrays.md`](formations-and-arrays.md)
- Great sects / imperial: [`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md)
- Zone / city map: [`local-world-map-split.md`](local-world-map-split.md), [`world-scale-and-travel.md`](world-scale-and-travel.md)

## Prerequisites

- [x] Formation guild necessary; specialist sect later via existing top-tier backstory (owner 2026-07-22)
- [x] Formation HQ = own city (lean); branches in each zone’s best city (owner 2026-07-22)
- [x] Alchemy HQ lean = imperial city (owner 2026-07-22)
- [ ] Name the Formation Guild + HQ city (new place vs rename an existing city)
- [ ] Pick which city is “best” per zone for the branch pin
- [ ] Forging HQ: imperial vs elsewhere once forge defense liberties are clear
- [ ] Whether F2b local proof becomes practice-only or disappears when branches ship

## Open questions

- HQ city: brand-new place on the world/local map, or elevate an existing mid/outer city?
- Do all ranks examine at branches, or only Adept — with Array Disciple+ requiring HQ?
- Branch quality: same exam everywhere, or Heartlands branch stricter / richer SKUs?
- Rare-formation trade: open market stall, guild escrow, or reputation-gated consign?
- Forging: if they supply imperial / sect arms, does that force HQ into imperial orbit?

## Implementation crumbs

- Current Adept exam UI: formation shelf (`formations.js`, `FORMATION_F2B`) — local, no world hub.
- Branch UI likely attaches to zone **best-city** local-map nodes once those are tagged.
- Do **not** block merge of PR #61 on this fiction.
