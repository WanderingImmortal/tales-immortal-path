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
| [Civic seats generator](civic-seats-generator.md) | `building` (v1 Redwell) | Other cities / capital kit later | `cursor/civic-seats-generator-design` |
| [Explore — field gathering](explore-field-gathering.md) | `designed` (field triangle) | Site tables; enemy pools | [#89](https://github.com/WanderingImmortal/tales-immortal-path/pull/89) |
| [Dustbone starter gameplay (hub)](dustbone-starter-gameplay.md) | `designed` (index) | Child slices | [#89](https://github.com/WanderingImmortal/tales-immortal-path/pull/89) · [#90](https://github.com/WanderingImmortal/tales-immortal-path/pull/90) |
| [Dustbone living board](dustbone-living-board.md) | `designed` | Redwell v1 | [#90](https://github.com/WanderingImmortal/tales-immortal-path/pull/90) |
| [Redwell starter city](redwell-starter-city.md) | `building` | Pamphlet pool; field loot polish | [#90](https://github.com/WanderingImmortal/tales-immortal-path/pull/90) |
| [QC technique pamphlet pool](qc-technique-pamphlet-pool.md) | `shipped` (v1) | Playtest redraw; rare slots later | `cursor/qc-pamphlet-pool` |
| [Dustbone QC alchemy](dustbone-qc-alchemy.md) | `designed` (names locked) | Field drops; cultivate buffs | [#89](https://github.com/WanderingImmortal/tales-immortal-path/pull/89) |
| [Dustbone surroundings (later)](dustbone-surroundings-later.md) | `idea` (parked) | Redwell starter slice | — || [Qi path — Foundation Establishment redesign](qi-foundation-establishment-redesign.md) | `idea` | Owner FE design pass | — |
| [Golden Core — cultivation journey (substages & core quality)](golden-core-cultivation-journey.md) | `designed` (brainstorm) | FE redesign; tribulation limbo | — |
| [Domain — realm claim & qi pressure](domain-system.md) | `designed` (brainstorm) | GC journey; realm claims | — |
| [Jianghu organization types](jianghu-organization-types.md) | `designed` (taxonomy) | Dustbone sect + tribe identities | — |
| [QC sect join ladder](qc-sect-join-ladder.md) | `idea` (v1 hall lean locked) | Hall name + graft spine | — |
| [Dustbone lesser sects](dustbone-lesser-sects.md) | `building` (Well-Ring v1) | Playtest; loyalty parked | — |
| [Sandveil Tribunal cultures](sandveil-tribunal-cultures.md) | `designed` (origins lock) | Tribe myth detail | [#94](https://github.com/WanderingImmortal/tales-immortal-path/pull/94) |
| [World events — layered battlefield](world-events-layered-battlefield.md) | `idea` | Mid city; org tiers | — |
| [Sect power pyramid, schools & food chain](sect-power-pyramid-and-schools.md) | `designed` (brainstorm) | World power map (owner) | — |
| [Procedural zone sect ecology](procedural-zone-sect-ecology.md) | `designed` (owner: hard line A) | Size taxonomy; zone density | — |
| [Player organization paths](player-organization-paths.md) | `designed` (hall at early FE) | Site selection; affiliation pilot | — |
| [Cultivation sites & claims](cultivation-sites-and-claims.md) | `designed` | Map nodes; `CULTIVATION_SITES` data | — |
| [Celestial Sword Sect](celestial-sword-sect.md) | `designed` (v2) | Lineage manual; Longcheng NPC | — |
| [Jade Lotus Sect](jade-lotus-sect.md) | `designed` (v2 — lineage sketch) | `jlc_*` manual pool; Matriarch reveal | — |
| [Void Temple](void-temple-sect.md) | `designed` (v1) | Lineage stub; gate travel; Little Heaven beats | — |
| [Void Prisoner](void-prisoner.md) | `designed` (origin) | Disciple pass (Sealed Ancients) | — |
| [Heartlands hunt scar](heartlands-hunt-scar.md) | `designed` | High-realm climb; FG rewrite Issue | — |
| [Golden Phoenix Sect](golden-phoenix-sect.md) | `designed` (v1) | Lineage stub; Gambit immortal veto | — |
| [Gu cultivation system (symbiotic)](gu-cultivation-system.md) | `idea` (**parked**) | Owner gu research; mechanics sketch | — |
| [Jade Archipelago — gu great sect](jade-archipelago-gu-sect.md) | `idea` (**parked**) | Gu cultivation system | — |
| [Storm Dragon Sect (archipelago)](storm-dragon-sect.md) | `idea` (shell) | Owner great-sect pass; zone spine | — |
| [Outer-zone great powers (hub)](outer-zone-great-powers.md) | `idea` | Owner per-zone passes | — |
| [Frostbite origin — Sunless Scar](frostbite-origin.md) | `idea` | Owner treasure variant | — |
| [Yin Maiden Palace (Frostbite)](frostbite-yin-sect.md) | `idea` | Lineage manual; Frostpeak pivot | — |
| [Silence-debt mid sects](silence-debt-mid-sects.md) | `idea` (parked) | Yin Maiden war role | — |
| [Dao Wars — outer zones](dao-wars-outer-zones.md) | `idea` | Timeline lock; mid sect debts | — |
| [Dao Wars — Capital Turn](dao-wars-capital-turn.md) | `designed` (v2) | Tianjing siege; chronicle | — |
| [Law taxonomy — primordial vs dao](law-taxonomy.md) | `idea` | Hanzi lock; cosmology pass | — |
| [Cosmology — ancients taxonomy](cosmology-ancients-taxonomy.md) | `designed` (v1) | Grotto vs prisoner vs sealed | — |
| [World timeline handoff](world-timeline-handoff.md) | `idea` | Dates for Seal, Dao Wars, mandate, now | — |
| [World timeline — author spine](world-timeline-author-spine.md) | `idea` | Eras, Warring States, sites; owner PC for prisoner | — |
| [Sect & faction identities](sect-faction-identities.md) | `designed` | Merge peer sect PRs | — |
| [Imperial clan — Tian Clan](imperial-clan.md) | `designed` (core lore) | City detail → [`imperial-city-tianjing.md`](imperial-city-tianjing.md) | — |
| [Imperial city — Longcheng + Tianjing](imperial-city-tianjing.md) | `idea` (workshop) | Noble clans; phase-1 map nodes | — |
| [Golden Core — peak condense (maximisation)](golden-core-condense-peak.md) | `idea` | FE redesign + owner GC design | — |
| [Soul-into-body refining](soul-body-refining.md) | `idea` (stub) | Body path rewrite | — |
| [Body chamber — silhouette rebuild & anatomy pass](body-chamber-anatomy-rebuild.md) | `building` (P2) | Playtest polish; Phase 3 parked | `cursor/body-silhouette-p2` |
| [Body path — refining rewrite (ACS lean)](body-path-refining-rewrite.md) | \idea\ (lean locked) | Anatomy P1–2; full design later | — |
| [Vessel Rules design](vessel-rules-design.md) | `idea` | More rule defs; Body Dao lock | — |
| [Body Dao cosmology (stub)](body-dao-design.md) | `idea` | Hanzi; Saint vs Manifestation | — |
| [Body Martial Intent (武意)](body-martial-intent.md) | `idea` | Body chamber; intent split | — |
| [Body-path great sect (Vajra Ridge)](body-path-sect.md) | `idea` | Body path depth; manuals | — |
| [Alignment, sacrilege & corruption](alignment-sacrilege-corruption.md) | `designed` | Tribulation v1 (partial) | — |
| **Mortal life sim cluster (hub)** | [`mortal-life-sim-cluster.md`](mortal-life-sim-cluster.md) | — | — |
| [Dustbone dynasties & Law of Dust](dustbone-dynasties-entropy-lore.md) | `designed` (Pinwright + strata lock) | Tribe myth detail | [#94](https://github.com/WanderingImmortal/tales-immortal-path/pull/94) |
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
| [Combat — damage depth (systems)](combat-damage-depth.md) | `designed` (parked) | Intent slice; Redwell first | — |
| [Combat — anatomy & damage types](combat-anatomy-damage.md) | `idea` (parked) | Owner damage pass | — |
| [Weapon Intent — cultivation loop](weapon-intent-cultivation.md) | `designed` (parked) | Redwell / starter slice | — |
| [Weapon Intent — awakening redesign](weapon-intent-awakening.md) | `designed` (stub) | First catalyst items; FE slice | — |
| [Intent track template](intent-track-template.md) | `designed` (parked) | Intent realms 1–2 build | — |
| [Intent apex — Self-Will path](intent-apex-self-will.md) | `designed` (parked) | Intent playable slice | — |
| [Devouring Intent](devouring-intent.md) | `designed` (v1) | Awakening redesign; cult content | — |
| [Devouring Law](devouring-law.md) | `designed` (v1) | Dao redo; cult fragments | — |
| [Heavenly Demon Cult](heavenly-demon-cult.md) | `designed` (v1) | Devouring Intent; lineage manual | — |
| [Heavenly Demon Cult — life ladder](heavenly-demon-cult-life.md) | `designed` (v1) | Template sect slice | — |
| [Heavenly Demon Cult — FE Initiate life](heavenly-demon-cult-fe-initiate.md) | `designed` (v1) | FE chamber; damage rework (combat) | — |
| [Heavenly Demon Cult — GC Reaver life](heavenly-demon-cult-gc-reaver.md) | `designed` (v1) | GC chamber; Taking intent; damage rework | — |
| [Heavenly Demon Cult — branch cells](heavenly-demon-cult-branch-cells.md) | `idea` (parked) | Merit ledger; multi-cell math | — |
| [Blood Sealing Gorge](blood-sealing-gorge.md) | `designed` (v1) | Cult HQ layout; hidden map | — |
| [Spiritual sense & reading cultivation](spiritual-sense-cultivation-reading.md) | `idea` | Sense unlock realm; world rules | — |
| [Chronicle, projects & time playback](chronicle-and-projects.md) | `building` (P1) | — | [#59](https://github.com/WanderingImmortal/tales-immortal-path/pull/59) |
| [Time model — lived journey + seclusion skips](time-model.md) | `designed` | Deferred priority; lived mode needs location/NPC density | — |
| [Living world clock (continuous)](world-clock-continuous.md) | `building` (Phase 2) | — | [#86](https://github.com/WanderingImmortal/tales-immortal-path/pull/86) |
| [QC cultivate on the living clock](qc-cultivate-excitement.md) | `designed` | Clock Phase 2 playtest | — |
| [Passive cultivation floor & focused sessions](passive-cultivation-floor.md) | `building` | Playtest tune (inferior bare → Peak QC) | — |
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
