# Ideas (parked designs)

Fleshed-out designs that are **not fully shipped** yet. Markdown holds the vision; GitHub Issues hold the build queue.

## How to use

1. Copy `_template.md` → `<short-kebab-topic>.md`
2. Fill **Status**, **Intent**, **Design notes**, **Prerequisites**
3. When ready to build (or build a prerequisite): open a GitHub Issue, link it in the table, set status to `building`
4. When shipped: set status to `shipped` (or delete / archive if you prefer a lean index)

## Status meanings

| Status | Meaning |
|--------|---------|
| `idea` | Sketch — not ready to implement |
| `designed` | Solid enough to build once prerequisites exist |
| `building` | Active Issue / branch exists |
| `shipped` | In the game (merged) |
| `dropped` | Won't do (keep a one-line why) |

## Index

| Idea | Status | Blocked on | Issue |
|------|--------|------------|-------|
| [Formations & arrays](formations-and-arrays.md) | `designed` | Cultivation methods P0–P2; upkeep tuning | — |
| [Cultivation manuals framework](cultivation-manuals-framework.md) | `building` (P2 designed) | Essence infra (P3+) | [#52](https://github.com/WanderingImmortal/tales-immortal-path/issues/52) |
| [Technique-driven cultivation & foundation variants](technique-driven-cultivation.md) | `building` (P2) | — | [#54](https://github.com/WanderingImmortal/tales-immortal-path/issues/54) |
| [Qi path — Foundation Establishment redesign](qi-foundation-establishment-redesign.md) | `idea` | Owner FE design pass | — |
| [Golden Core — cultivation journey (substages & core quality)](golden-core-cultivation-journey.md) | `designed` (brainstorm) | FE redesign; tribulation limbo | — |
| [Domain — realm claim & qi pressure](domain-system.md) | `designed` (brainstorm) | GC journey; realm claims | — |
| [Sect power pyramid, schools & food chain](sect-power-pyramid-and-schools.md) | `designed` (brainstorm) | World power map (owner) | — |
| [Golden Core — peak condense (maximisation)](golden-core-condense-peak.md) | `idea` | FE redesign + owner GC design | — |
| [Tribulation — per-realm identity & limbo states](tribulation-per-realm-limbo.md) | `idea` | Realm naming; FE breakthrough | — |
| [Broken Core cultivators](broken-core-cultivators.md) | `idea` | Tribulation outcomes; NPC tier | — |
| [Spiritual sense & reading cultivation](spiritual-sense-cultivation-reading.md) | `idea` | Sense unlock realm; world rules | — |
| [Chronicle, projects & time playback](chronicle-and-projects.md) | `building` (diary v0) | — | branch `cursor/chronicle-diary-reader` |
| [Watershed realms & lifespan pacing](watershed-realms-lifespan-pacing.md) | `idea` | Root taxonomy v2; per-realm age anchors | — |
| [Spiritual roots — taxonomy v2](spiritual-roots-taxonomy-v2.md) | `building` | — | PR in progress |
| [Creation screen redesign](creation-screen-redesign.md) | `idea` (stubbed) | Roots v2, cultivation manuals framework, event hooks | — |
| [Chaos cultivation path](chaos-cultivation-path.md) | `designed` (partial) | Immortal endgame fork; legacy meta; recover PC notes (realms, grotto masters) | — |
| [Nine-realm mortal ladder](nine-realm-ladder.md) | `designed` (partial) | Watershed pacing; half-step peak | — |
| [Realm claims](realm-claims.md) | `designed` | Nine-realm ladder (indices) | — |
| [World scale & travel](world-scale-and-travel.md) | `designed` | Local map; realm claims | — |
| [Local & world map split](local-world-map-split.md) | `building` (1–3) | — | [#56](https://github.com/WanderingImmortal/tales-immortal-path/pull/56) |
| [Sect map unification](sect-map-unification.md) | `building` | — | [#57](https://github.com/WanderingImmortal/tales-immortal-path/pull/57) |
| [Immortal world layer](immortal-world-layer.md) | `designed` (partial) | Mortal immortal ascension; Court stub | — |
| [Upper celestial nine](upper-celestial-nine.md) | `idea` | Mortal nine + immortal Court MVP | — |
