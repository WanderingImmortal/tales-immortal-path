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
| [Forging — equipment tiers & grades](forging-equipment-tiers.md) | `building` (Phase B) | Phase C rolls next; nine-realm for G | `cursor/forge-phase-b-grades` |
| [Forge — affix temperaments (parked)](forge-temperaments-idea.md) | `idea` | Quench shipped; owner call | — |
| [Creation-path guilds](creation-path-guilds.md) | `designed` (parked) | HQ city; branch exam max (4 vs 5) | — |
| [Cultivation manuals framework](cultivation-manuals-framework.md) | `building` (P2 designed) | Essence infra (P3+) | [#52](https://github.com/WanderingImmortal/tales-immortal-path/issues/52) |
| [Burning Breath — layers](burning-breath-layers.md) | `shipped` (policy A — no layers) | — | [#64](https://github.com/WanderingImmortal/tales-immortal-path/pull/64) |
| [Technique-driven cultivation & foundation variants](technique-driven-cultivation.md) | `building` (sword/blood manuals + aura) | — | [#54](https://github.com/WanderingImmortal/tales-immortal-path/issues/54) · [#74](https://github.com/WanderingImmortal/tales-immortal-path/pull/74) |
| [Qi Condensation depth](qi-condensation-depth.md) | `building` | Band pacing / Dustbone | `cursor/qc-playtest-fixes` |
| [City tiers](city-tiers.md) | `designed` | Settlement rename / profiles | — |
| [Explore — field gathering](explore-field-gathering.md) | `designed` (field triangle) | Site tables; enemy pools | [#89](https://github.com/WanderingImmortal/tales-immortal-path/pull/89) |
| [Dustbone starter gameplay (hub)](dustbone-starter-gameplay.md) | `designed` (index) | Child slices | [#89](https://github.com/WanderingImmortal/tales-immortal-path/pull/89) · [#90](https://github.com/WanderingImmortal/tales-immortal-path/pull/90) |
| [Dustbone living board](dustbone-living-board.md) | `designed` | Redwell v1 | [#90](https://github.com/WanderingImmortal/tales-immortal-path/pull/90) |
| [Redwell starter city](redwell-starter-city.md) | `building` | Pamphlet pool; field loot polish | [#90](https://github.com/WanderingImmortal/tales-immortal-path/pull/90) |
| [QC technique pamphlet pool](qc-technique-pamphlet-pool.md) | `idea` (content needed) | Manuals framework | — |
| [Dustbone QC alchemy](dustbone-qc-alchemy.md) | `designed` (names locked) | Field drops; cultivate buffs | [#89](https://github.com/WanderingImmortal/tales-immortal-path/pull/89) |
| [Dustbone surroundings (later)](dustbone-surroundings-later.md) | `idea` (parked) | Redwell starter slice | — || [Qi path — Foundation Establishment redesign](qi-foundation-establishment-redesign.md) | `idea` | Owner FE design pass | — |
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
| [Body chamber — silhouette rebuild & anatomy pass](body-chamber-anatomy-rebuild.md) | `designed` | Phase 1 gates 2–3 | — |
| [Alignment, sacrilege & corruption](alignment-sacrilege-corruption.md) | `designed` | Tribulation v1 (partial) | — |
| **Mortal life sim cluster (hub)** | [`mortal-life-sim-cluster.md`](mortal-life-sim-cluster.md) | — | — |
| [Dustbone dynasties & Law of Dust](dustbone-dynasties-entropy-lore.md) | `idea` (parked) | — | — |
| [Settlement lore](settlement-lore.md) | `idea` (parked) | Dustbone lore | — |
| [Economy framework](economy-framework.md) | `idea` (parked) | Stone tiers | — |
| [Commerce & markets](commerce-and-markets.md) | `idea` (parked) | Economy framework | — |
| [Work & professions](work-and-professions.md) | `idea` (parked) | Economy framework | — |
| [Personal residence](personal-residence.md) | `building` (QC minimal home) | Full ladder later | `cursor/qc-playtest-fixes` |
| [World standing & property](world-standing-and-property.md) | `idea` (parked) | Residence buy | — |
| [Sect vs personal anchor](sect-vs-personal-anchor.md) | `idea` (parked) | Residence | — |
| [Tribulation system rework](tribulation-system-rework.md) | `shipped` (v1) + v2 QC→FE building | Higher gates — see per-gate backlog | [#63](https://github.com/WanderingImmortal/tales-immortal-path/pull/63) |
| [Tribulation — per-gate backlog](tribulation-per-gate-backlog.md) | `idea` (QC→FE `building`) | Owner design per watershed | [#63](https://github.com/WanderingImmortal/tales-immortal-path/pull/63) |
| [Tribulation — per-realm identity & limbo states](tribulation-per-realm-limbo.md) | `idea` | See tribulation-per-gate-backlog | — |
| [Broken Core cultivators](broken-core-cultivators.md) | `idea` | Tribulation outcomes; NPC tier | — |
| [Spiritual sense & reading cultivation](spiritual-sense-cultivation-reading.md) | `idea` | Sense unlock realm; world rules | — |
| [Chronicle, projects & time playback](chronicle-and-projects.md) | `building` (P1) | — | [#59](https://github.com/WanderingImmortal/tales-immortal-path/pull/59) |
| [Living world clock (continuous)](world-clock-continuous.md) | `building` (Phase 2) | — | [#86](https://github.com/WanderingImmortal/tales-immortal-path/pull/86) |
| [QC cultivate on the living clock](qc-cultivate-excitement.md) | `designed` | Clock Phase 2 playtest | — |
| [Watershed realms & lifespan pacing](watershed-realms-lifespan-pacing.md) | `designed` | Chamber pacing tune pass | — |
| [Spiritual roots — taxonomy v2](spiritual-roots-taxonomy-v2.md) | `building` | — | PR in progress |
| [Creation screen redesign](creation-screen-redesign.md) | `idea` (stubbed) | Roots v2, cultivation manuals framework, event hooks | — |
| [Cultivation realm depth pass](cultivation-realm-depth-pass.md) | `idea` | QC designed — see qi-condensation-depth | — |
| [Chaos cultivation path (endgame)](chaos-cultivation-path.md) | `idea` (**parked**) | Realm depth pass; Immortal Ascension beat | — |
| [Post-immortal cosmology (upper / Court / Chaos)](post-immortal-cosmology.md) | `idea` (**parked**) | Realm depth pass; Immortal climax | — |
| [Upper ladder design hub](upper-ladder-design-hub.md) | `designed` (partial) | Nine-realm code; void qi; tribulation | — |
| [Nine-realm mortal ladder](nine-realm-ladder.md) | `designed` (partial) | Watershed pacing; half-step peak | — |
| [Realm claims](realm-claims.md) | `designed` (expanded) | Nine-realm ladder in code; owner tune idx 4/7 | — |
| [Dao Seeking & Manifestation](dao-seeking-and-manifestation.md) | `designed` | Nine-realm idx 6–7; sword taxonomy | — |
| [Void cosmology & Void Refinement](void-cosmology-and-refinement.md) | `designed` (partial) | Void qi / arts; VR→Seeking tribulation | — |
| [World scale & travel](world-scale-and-travel.md) | `designed` | Local map; realm claims | — |
| [Local & world map split](local-world-map-split.md) | `building` (1–3) | — | [#56](https://github.com/WanderingImmortal/tales-immortal-path/pull/56) |
| [Sect map unification](sect-map-unification.md) | `building` | — | [#57](https://github.com/WanderingImmortal/tales-immortal-path/pull/57) |
| [Immortal world layer](immortal-world-layer.md) | `designed` (partial) | Mortal immortal ascension; Court stub | — |
| [Upper celestial nine](upper-celestial-nine.md) | `idea` | Mortal nine + immortal Court MVP | — |
