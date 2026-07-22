# Creation-path guilds (alchemy · forging · formations)

| Field | Value |
|-------|-------|
| **Status** | `idea` |
| **Blocked on** | Profession ladders that need a social exam authority (formations F2b already ships a local proof exam) |
| **Issue** | none yet |
| **Chat / PR** | Formations F2b lean 2026-07-22 — [PR #61](https://github.com/WanderingImmortal/tales-immortal-path/pull/61) |
| **Updated** | 2026-07-22 |

## Intent

Each **creation path** (alchemists, forgers, formation masters, …) typically has a **large guild** — concentrated hub of learning, standards, and rank recognition. The game does not have these yet, so Adept+ “exams” currently feel like a lonely sand-table in your own courtyard. This idea parks **who administers ranks** and whether a **top-tier specialist sect** is also needed.

## Design notes

### Owner lean (2026-07-22)

- **Adept is the real gate** for formations: anyone can learn the moves (decipher / Inscriber); becoming an Adept is where you learn **the art**. See [`formations-and-arrays.md`](formations-and-arrays.md).
- Exam *mechanics* for F2b can stay as local proof-lay + FI for now.
- Open fiction: **who is doing the exams?** A formation guild feels natural. A **formation-specialist top sect** might also be cool — unclear whether both are needed.

### Agent lean (parked — not decided)

| Option | Role | When it pays off |
|--------|------|------------------|
| **Guild only** | Rank exams, manuals market, hire masters, reputation | Thin: one world hub / faction per craft path |
| **Specialist sect only** | Rival / ally power that *is* the school | Heavier: needs map presence, politics, recruitment |
| **Guild + specialist sect** | Guild = standards & exams; sect = rare patterns, elders, rivalry | Richer world; more content debt |

**Lean for v1 fiction:** **Guild first.** Exams and “you are recognized as Adept” want a **profession body**, not a peer sect. A formation-specialist great sect is optional later as a *destination* (pilgrimage, hire, unique blueprints) — not required to make Adept feel earned.

Alchemy / forging can share the same template when those ladders get exams.

### Sketch (not for build yet)

- World map node or city district: **Formation Guild** (and siblings).
- Services: attempt rank exam, buy unread diagrams, hire lay/maintain, post standing for wandering masters.
- Reputation / membership tiers separate from master grade (guest → member → elder) — keep thin until needed.
- Player sect can still host a **local proof** (current F2b) as “practice for the guild hall” or as a temporary stand-in until the hub exists.

### Cross-links

- Formations exams / FI: [`formations-and-arrays.md`](formations-and-arrays.md)
- Domain / schools food chain may eventually sit next to specialist sects: [`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md)

## Prerequisites

- [ ] Owner pick: guild only vs guild + specialist sect (formations first)
- [ ] Name / place for first Formation Guild hub
- [ ] Whether F2b local proof is retconned into “guild exam travel” or kept as home practice

## Open questions

- One mega “Artisan Guild” with wings, or separate alchemy / forge / formation guilds?
- Do exams *require* travel to the guild, or can a guild examiner visit / use a talisman seal?
- Specialist formation sect: peer rival on the power pyramid, or off-map legendary school?
- Does guild membership gate hire pricing / rare SKUs?
- Mirror for alchemy and forging when those get Adept-equivalent ranks?

## Implementation crumbs

- Current Adept exam UI lives on the formation shelf (`formations.js`, `FORMATION_F2B`) — local, no world hub.
- World / city map hooks likely near market / travel destinations when a hub ships.
- Do **not** block merge of PR #61 on this fiction.
