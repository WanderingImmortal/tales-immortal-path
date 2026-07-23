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
| [Root rite formations](root-rite-formations.md) | `designed` | Chronicle fate-rite project; formation tiers | — |
| [Formations & arrays](formations-and-arrays.md) | `building` (F2b on PR) | Array Disciple; Trace optional | [#61](https://github.com/WanderingImmortal/tales-immortal-path/pull/61) |
| [Forging — equipment tiers & grades](forging-equipment-tiers.md) | `designed` (Phases B–H) | Implement B next; nine-realm for G | — |
| [Forge — affix temperaments (parked)](forge-temperaments-idea.md) | `idea` | Quench shipped; owner call | — |
| [Creation-path guilds](creation-path-guilds.md) | `designed` (parked) | HQ city; branch exam max (4 vs 5) | — |
| [Cultivation manuals framework](cultivation-manuals-framework.md) | `building` (P2 designed) | Essence infra (P3+) | [#52](https://github.com/WanderingImmortal/tales-immortal-path/issues/52) |
| [Burning Breath — layers](burning-breath-layers.md) | `shipped` (policy A — no layers) | — | [#64](https://github.com/WanderingImmortal/tales-immortal-path/pull/64) |
| [Technique-driven cultivation & foundation variants](technique-driven-cultivation.md) | `building` (P2) | — | [#54](https://github.com/WanderingImmortal/tales-immortal-path/issues/54) |
| [Qi path — Foundation Establishment redesign](qi-foundation-establishment-redesign.md) | `idea` | Owner FE design pass | — |
| [Golden Core — cultivation journey (substages & core quality)](golden-core-cultivation-journey.md) | `designed` (brainstorm) | FE redesign; tribulation limbo | — |
| [Domain — realm claim & qi pressure](domain-system.md) | `designed` (brainstorm) | GC journey; realm claims | — |
| [Sect power pyramid, schools & food chain](sect-power-pyramid-and-schools.md) | `designed` (brainstorm) | World power map (owner) | — |
| [Celestial Sword Sect](celestial-sword-sect.md) | `designed` (v2) | Lineage manual; Longcheng NPC | — |
| [Jade Lotus Sect](jade-lotus-sect.md) | `designed` (v2 — lineage sketch) | `jlc_*` manual pool; Matriarch reveal | — |
| [Void Temple](void-temple-sect.md) | `designed` (v1) | Lineage stub; gate travel; Little Heaven beats | — |
| [Golden Phoenix Sect](golden-phoenix-sect.md) | `designed` (v1) | Lineage stub; Gambit immortal veto | — |
| [Sect & faction identities](sect-faction-identities.md) | `designed` | Merge peer sect PRs | — |
| [Imperial clan — Tian Clan](imperial-clan.md) | `designed` (core lore) | City detail → [`imperial-city-tianjing.md`](imperial-city-tianjing.md) | — |
| [Imperial city — Longcheng + Tianjing](imperial-city-tianjing.md) | `idea` (workshop) | Noble clans; phase-1 map nodes | — |
| [Golden Core — peak condense (maximisation)](golden-core-condense-peak.md) | `idea` | FE redesign + owner GC design | — |
| [Soul-into-body refining](soul-body-refining.md) | `idea` (stub) | Body path rewrite | — |
| [Alignment, sacrilege & corruption](alignment-sacrilege-corruption.md) | `designed` | Tribulation v1 (partial) | — |
| [Tribulation system rework](tribulation-system-rework.md) | `shipped` (v1) + v2 QC→FE building | Higher gates — see per-gate backlog | [#63](https://github.com/WanderingImmortal/tales-immortal-path/pull/63) |
| [Tribulation — per-gate backlog](tribulation-per-gate-backlog.md) | `idea` (QC→FE `building`) | Owner design per watershed | [#63](https://github.com/WanderingImmortal/tales-immortal-path/pull/63) |
| [Tribulation — per-realm identity & limbo states](tribulation-per-realm-limbo.md) | `idea` | See tribulation-per-gate-backlog | — |
| [Broken Core cultivators](broken-core-cultivators.md) | `idea` | Tribulation outcomes; NPC tier | — |
| [Spiritual sense & reading cultivation](spiritual-sense-cultivation-reading.md) | `idea` | Sense unlock realm; world rules | — |
| [Chronicle, projects & time playback](chronicle-and-projects.md) | `building` (P1) | — | [#59](https://github.com/WanderingImmortal/tales-immortal-path/pull/59) |
| [Watershed realms & lifespan pacing](watershed-realms-lifespan-pacing.md) | `designed` | Chamber pacing tune pass | — |
| [Spiritual roots — taxonomy v2](spiritual-roots-taxonomy-v2.md) | `building` | — | PR in progress |
| [Creation screen redesign](creation-screen-redesign.md) | `idea` (stubbed) | Roots v2, cultivation manuals framework, event hooks | — |
| [Cultivation realm depth pass](cultivation-realm-depth-pass.md) | `idea` | Owner design pass; may follow roots / manuals | — |
| [Chaos cultivation path (endgame)](chaos-cultivation-path.md) | `idea` (**parked**) | Realm depth pass; Immortal Ascension beat | — |
| [Post-immortal cosmology (upper / Court / Chaos)](post-immortal-cosmology.md) | `idea` (**parked**) | Realm depth pass; Immortal climax | — |
| [Nine-realm mortal ladder](nine-realm-ladder.md) | `designed` (partial) | Watershed pacing; half-step peak | — |
| [Realm claims](realm-claims.md) | `designed` | Nine-realm ladder (indices) | — |
| [World scale & travel](world-scale-and-travel.md) | `designed` | Local map; realm claims | — |
| [Local & world map split](local-world-map-split.md) | `building` (1–3) | — | [#56](https://github.com/WanderingImmortal/tales-immortal-path/pull/56) |
| [Sect map unification](sect-map-unification.md) | `building` | — | [#57](https://github.com/WanderingImmortal/tales-immortal-path/pull/57) |
| [Immortal world layer](immortal-world-layer.md) | `designed` (partial) | Mortal immortal ascension; Court stub | — |
| [Upper celestial nine](upper-celestial-nine.md) | `idea` | Mortal nine + immortal Court MVP | — |
