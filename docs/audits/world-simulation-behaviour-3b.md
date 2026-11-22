# World simulation behaviour audit

## Executive summary

The idle world sustains a small autonomous lodge economy and advances individual cultivators. Over 64 years, each tested world added six demonic arrivals, recorded one to five NPC deaths, dispatched travelling-collector events, and processed at least three lodge situation beats. In two detailed traces, Wei Shun gathered herbs, undertook lodge duties, attempted theft, and prompted responses when loss or misconduct became known. Redwell's offices aged and changed hands, and its market restocked. The lodge incidents had local consequences. The audit found no production mechanism for those consequences to change town-wide public order or government-versus-outlaw influence.

One correctness discrepancy was isolated. For the same already-capped demonic NPC, one 12-month production growth tick raised threat from 9 to 11, while twelve one-month ticks left it at 9. Both aged the actor by 12 months. The threat rule floors each span independently. General settlement decline, static faction reputation, and the absence of sect missions in an unaffiliated run provide no comparable evidence of a defect.

Baseline was merged `main` at `c9d8246`, containing PR #256. The local checkout had the same tree. The audit did not edit production code. [Merge commit](https://github.com/WanderingImmortal/tales-immortal-path/commit/c9d8246d47b70744f2afa74dc5528ee7f1df5893) · [PR #256](https://github.com/WanderingImmortal/tales-immortal-path/pull/256)

## Simulation matrix

Each cell shows **actual elapsed months / runner seconds** from one Node 24.22.1 run. Times include VM initialization and reporting work. The first four columns completed. The 1,200-month request is a ceiling used to reach the natural stop, and all five runs reported `interrupted` at calendar month **960**, or **768 months elapsed** from month 192. The production attention message was “Your leadership or journey has ended.” The scenario had no founded sect and reached the default lifespan without a breakthrough. It never continued into another life.

| Seed | 12 months | 120 months | 360 months | 600 months | 1,200 requested |
|---|---:|---:|---:|---:|---:|
| 42 | 12 / 0.35 | 120 / 1.11 | 360 / 2.76 | 600 / 4.63 | 768 / 5.82 |
| 123 | 12 / 0.24 | 120 / 1.00 | 360 / 2.65 | 600 / 4.48 | 768 / 5.98 |
| 777 | 12 / 0.23 | 120 / 0.98 | 360 / 2.72 | 600 / 4.41 | 768 / 6.35 |
| 2026 | 12 / 0.27 | 120 / 1.31 | 360 / 3.73 | 600 / 5.91 | 768 / 5.46 |
| 9001 | 12 / 0.23 | 120 / 1.11 | 360 / 2.61 | 600 / 4.57 | 768 / 7.29 |

All 20 shorter-run final hashes matched the corresponding checkpoint in their seed's longer run. All 25 runs reported zero harness errors, including no duplicate live UIDs, duplicate dispatch violations, or scheduler quarantines. This checks prefix consistency under one-month requests. It leaves larger or smaller time partitions untested apart from the targeted growth probe below.

```sh
out=$(mktemp -d)
for seed in 42 123 777 2026 9001; do
  for months in 12 120 360 600 1200; do
    npm run --silent simulate:world -- --seed "$seed" --months "$months" --checkpoint 12 \
      > "$out/$seed-$months.json"
  done
done
```

The VM loads scripts in page order, creates and reloads the ordinary character using in-memory storage, seeds randomness, and holds timer callbacks. It requests a quiet `advanceSharedWorldTime()` span each month. The scheduler still subdivides at event and calendar boundaries, and player accounting still runs. No player commands, trips, dialogue choices, or developer scenarios were injected into the matrix. Two extra runs, seeds 42 and 123 through lifespan, inspected raw fields after every request and wrapped selected functions to record calls and results without making extra gameplay calls. Both traced final hashes matched their stock runs. [Harness](../../scripts/lib/headless-world.js#L9) · [Shared time](../../advance-time-rules.js#L98) · [Scheduler](../../world-scheduler.js#L316)

## World activity scorecard

| Subsystem | Classification and confidence | Observation |
|---|---|---|
| Roster, lifespan, cultivation | Active and observable · high | All runs started with 37 records. Six scheduled arrivals per seed grew the roster to 43, including dead records. Both deep traces recorded old-age deaths and advances on existing actors' focus tracks. [NPC growth and lifespan](../../world.js#L1420) · [Emergence](../../world.js#L1572) |
| Encounter-driven ambient life and retirement cap | Conditionally inactive · high for the two traced seeds | No ambient records, ambient spawn or promotion calls, or cap-triggering encounter sequence was present. Persistent count changes include normalization of existing records. [Ambient caps](../../ambient-npcs.js#L185) · [Encounter spawning](../../ambient-npcs.js#L329) |
| Travel and local activities | Active and observable · high for traced actors | Seeds 42 and 123 recorded 18 and 10 detailed journeys respectively, all completed. Coarse regional wandering and the scripted collector schedule are separate paths. [Detailed travel](../../npc-travel.js#L532) · [Coarse wandering](../../world.js#L1516) · [Collector schedule](../../npc.js#L71) |
| Ambitions, incidents, situations | Active and observable · high for Well-Ring | Both deep traces recorded 46 Wei Shun goal attempts, with different mixes of gathering, duty, and theft. Across the five seeds the scheduler dispatched 3, 10, 4, 4, and 3 situation beats respectively. [Natural ambitions](../../npc-ambitions.js#L1502) · [Situation ticks](../../npc-situations.js#L1108) |
| Relationships | Active but quiet · medium | The scheduled player-relationship decay path requires prior contact. In the deep traces, initial zero-value normalization accounted for the observed impression/trust field changes, and the one recorded civic tie stayed stable. Conversations and actor beliefs did change. Wider ties and durable social effects remain incompletely measured. [Relationship decay](../../npc-converse.js#L108) · [NPC ties](../../npc-ties.js#L49) |
| Redwell offices | Active and observable · high for traced seeds | Five office replacements in each trace, with the city lord remaining in office. This reflects aging and replacement under authored office rules. [Civic seats](../../civic-seats.js#L264) |
| Town-wide stability and organized outlaw pressure | Not implemented as a town simulation · high for inspected paths | The town has civic profiles, graft flavour, and player-facing interactions. The audit found no autonomous government-versus-outlaw, public-order, or fictional-population state driving a settlement trajectory. [Redwell design and shipped slice](../ideas/redwell-starter-city.md) · [Civic profiles](../../civic-seats.js#L78) |
| Market, field stock, procurement | Active and observable · high | Market offer composition changed, consumable stock returned to authored quantities, and gathering and replenishment changed field and lodge herb stock. [Redwell market](../../qc-depth.js#L508) · [Resource regeneration](../../resource-sources.js#L156) · [Procurement](../../resource-sources.js#L430) |
| Faction clocks and player-sect systems | Active but quiet for faction initialization and deadline scans. Conditionally inactive for quests, wars, sect economy, missions, and rivalry growth · high | No faction changes in the two traces, no war dispatches in the matrix, no player sect, and no activated mission or study queue. [Faction tick](../../factions-expand.js#L1049) · [Faction deadlines](../../factions.js#L719) · [Sect tick](../../sect.js#L2009) |
| Demonic time-at-cap threat | Suspected defect · high for the discrepancy, medium for intended semantics | Equal spans produced different threat gains on the same eligible actor. See reproduction below. [Growth tick](../../world.js#L1438) |

## Redwell case study

Civic maintenance runs through `applySharedCalendarObligations()`, which calls `tickDwellingRent()`. Its `ensureQcDepthState()` call refreshes markets and ensures seats before checking whether the player actually rents. That production call chain explains why office aging and shop rotation occur while the player idles. In seed 42, the jobs holder changed from Qiao to Lian at month 660 and the warden from Yue to Jun at month 852. The inn changed occupants at months 480 and 900. The first replacement also rolled the name Rook, so comparing names alone would have missed it. The city lord's profile forces the graft lean. Turnover in another office does not by itself affect that rule, tax levels, or town-wide order. [Calendar obligations](../../core.js#L1032) · [Rent](../../qc-depth.js#L908) · [Town initialization](../../qc-depth.js#L167) · [Profile](../../civic-seats.js#L78)

Well-Ring is a concrete local institution. Its storehouse can lose herbs, receive outside deliveries, and prompt a hall-master response. Those effects do not presently propagate to an aggregate Redwell condition. The data supports a shabby town with stable authored conditions, intermittent office turnover, and changing lodge business. It cannot establish whether a shabby condition arises from economic decline or political pressure. The character remains in Redwell throughout the matrix, with no active intervention. Physical player absence from the town is a separate condition and was not tested.

## NPC lifecycle findings

| Seed | Roster at lifespan | Alive | Dead | Collector dispatches | Demonic arrivals |
|---|---:|---:|---:|---:|---:|
| 42 | 43 | 42 | 1 | 28 | 6 |
| 123 | 43 | 39 | 4 | 29 | 6 |
| 777 | 43 | 38 | 5 | 27 | 6 |
| 2026 | 43 | 40 | 3 | 28 | 6 |
| 9001 | 43 | 41 | 2 | 27 | 6 |

- **Population and identity.** Every initial snapshot counted 10 explicit persistent records out of 37. In both deep traces the other 27 already had UIDs and acquired explicit `persistent` state at the first monthly request. No actual ambient promotion was recorded. All six added identities per trace came through demonic emergence, and dead records were retained. The cap targets a narrower set of previously met, promoted records, with actor and claim protections. Total roster size is neither that cap's denominator nor the town census. [Initial population](../../world.js#L1255) · [Cap predicate](../../ambient-npcs.js#L185)
- **Cultivation and deaths.** Traces showed focus realm index increases on 28 distinct actors for seed 42 and 24 for seed 123. The player remained at dantian realm index 0 despite 3,072 weeks of passive circulation. NPC growth limits depend on role, with some NPCs capped relative to the player's realm. The death at calendar month 912 in seed 42 passed through `killWorldNpc(..., 'old age')`. These observations show real life progression. They do not establish that all NPC categories age or progress under every circumstance. The growth tick explicitly skips ambient records while the ambient tick refreshes their activities when present. [Growth ceilings](../../world.js#L1393) · [Growth tick](../../world.js#L1438) · [Ambient activities](../../ambient-npcs.js#L358)
- **Mobility and occupation.** All traced detailed journeys belonged to Wei Shun, and none remained open at the endpoint. For seed 42 there were also 23 recorded zone changes by one roaming actor. The 28 `wei_wander` dispatches refer to the separate Wei the Collector schedule, so they cannot be added to Wei Shun's trips as the same metric. Both lodge duty and gathering appeared among natural goal attempts. No broad job market, generalized ambition execution across the roster, sect succession, or Hall activity was exercised. [Wandering](../../world.js#L1516) · [Collector](../../npc.js#L71) · [Ambition tick](../../npc-ambitions.js#L1521)

## Economy and organization findings

- **Redwell offers refresh.** All five seeds kept pills at three Qi restores and two blood recoveries at sampled checkpoints. The staple restock also uses authored counts. In seed 42 the monthly trace contained 196 distinct ordered method lists and 76 ordered manual lists. This is seasonal selection from authored pools, adjusted for already-owned entries. The inspected prices derive from authored offers and player-relative faction discounts or flags. The matrix had no player purchases or changed faction standing and cannot establish a geographic price response to scarcity. [Market](../../qc-depth.js#L508) · [Price modifiers](../../factions.js#L187)
- **Herbs have a physical local loop and an abstract institutional one.** Dewcatch Scrub stock ranged from 6 to 10 in seed 42. Its acquisition ledger recorded 19 transactions by the endpoint, consistent with 19 successful field-gathering attempts. Lodge stock ranged from 22 to 24 in both traces. Seed 42 received three positive deliveries for six herbs and seed 123 received ten for twenty herbs, counted by distinct delivery keys across monthly history. The four-month channel replenishes from `abstract_external_supply`, has no physical source or cost, and caps lodge stock at 24. It is inventory feedback, with a provisional supply source. The field figures and lodge figures are different ledgers. No negative recorded source stock appeared at the matrix checkpoints. [Procurement definition](../../resource-sources.js#L86) · [Regeneration](../../resource-sources.js#L156) · [Delivery](../../resource-sources.js#L430)
- **Organizations are represented at different layers.** Eleven faction reputation entries stayed at zero in both traces, with no active quests or independent strategic changes observed. Four generated lesser sect records in `G.world.lesserSects.sects` were present and unchanged in both traces. NPC members still age and cultivate. The harness's separate `organizations.worldSects` count reads `G.sect.worldSects`, which was zero. The growth function for that roster is explicitly gated by founding a player sect and uses player power and renown ceilings. The audit found no autonomous strategic contest or leadership replacement among the observed lesser sects. That says little about rival, mission, or faction scenarios after their prerequisites are met. [Procedural sects](../../procedural-lesser-sects.js) · [World sect growth](../../sect.js#L1331) · [Sect calendar](../../sect.js#L2009)

## Causality and consistency

**Detected theft, seed 42.** At month 209, lodge stock fell 24 → 22. Objective incident `inc_209_1` records Wei Shun as the culprit. Liang's records contain a secondhand night-watch report with confidence 0.4 and a separate missing-stock report without a culprit. His decision at month 210 carried an unconfirmed report as its primary claim and produced a private inquiry with no formal lodge-board mark. The report source is a mechanical label. The trace does not establish a simulated witness journey or an independent rumour network. [Discovery and misconduct](../../npc-situations.js#L643) · [Decision context](../../npc-situations.js#L729) · [Knowledge snapshot](../../npc-decisions.js#L344)

**Undetected loss, same seed.** Stock fell again at month 433. The loss stayed undiscovered through month 435, then a routine storehouse inspection recorded discovery at month 436. At month 437 Liang's decision snapshot contained a loss belief and no named accused. He deferred. This matches the intended distinction between a stock shortfall and evidence against a person. For the detected case, the belief rows carried a source label but empty `sourceObservationIds`. The matching incident and observation rows support the sequence, while exact belief-to-observation references remain an observability gap. The audit cannot generalize from these cases to knowledge boundaries in all systems. [Storehouse inspection](../../well-ring-lodge.js#L832) · [Observation records](../../npc-incidents.js#L277) · [Known incident view](../../npc-incidents.js#L565)

**Demonic threat discrepancy.** The non-growing, unmet demonic path calculates `Math.floor(effectiveMonths / 12)` separately for every tick. The monthly matrix still showed some threat gains on breakthroughs, because those use a separate rule. The targeted seed-42 probe at month 792 isolated existing NPC `wn_loyw3v28_7p7hs` using cloned state. A 12-month tick yielded age 768 and threat 11 from age 756 and threat 9. Twelve one-month ticks yielded age 768 and threat 9. Neither trial reached the cap or lifespan. This reproduces partition dependence in the threat accumulator without changing the ordinary-start run. Confirm that elapsed time should govern this gain before fixing it in a separate PR. [Threat formula](../../world.js#L1460) · [Breakthrough threat](../../world.js#L1494)

<details>
<summary>Reproduce the targeted threat probe</summary>

```sh
node <<'JS'
const { simulateWorld } = require('./scripts/lib/headless-world');
let evaluate;
const result = simulateWorld({ seed: 42, months: 600 }, run => { evaluate = run; });
if (result.status !== 'completed') throw new Error(result.status);
console.log(evaluate(`JSON.stringify((() => {
  const world = G;
  const actor = G.worldNpcs.find(n => n.alive && n.isDemonicTalent && !n.demonicMet
    && !canWorldNpcGrow(n) && n.demonicThreat + 2 <= getWorldNpcThreatCap()
    && n.ageMonths + 12 < getWorldNpcLifespanMonths(n));
  const trial = spans => {
    const npc = JSON.parse(JSON.stringify(actor));
    G = { ...world, worldNpcs: [npc] };
    for (const span of spans) {
      G.ageMonths += span;
      tickWorldNpcGrowth(span);
    }
    return { age: npc.ageMonths, threat: npc.demonicThreat };
  };
  try {
    return { id: actor.uid, at: world.ageMonths, yearly: trial([12]), monthly: trial(Array(12).fill(1)) };
  } finally { G = world; }
})())`));
JS
```

</details>

<details>
<summary>Inspect the representative lodge records without writes</summary>

```sh
node <<'JS'
const { simulateWorld } = require('./scripts/lib/headless-world');
let evaluate;
const result = simulateWorld({ seed: 42, months: 246 }, run => { evaluate = run; });
if (result.status !== 'completed') throw new Error(result.status);
console.log(evaluate(`JSON.stringify({
  losses: G.wellRing.storehouse.lossesById,
  observations: G.npcObservations.byId,
  beliefs: G.npcBeliefs.byId,
  detectedDecision: G.npcDecisions.byId.dec_210_3,
  undetectedDecision: G.npcDecisions.byId.dec_437_16
}, null, 2)`));
JS
```

</details>

## Coverage gaps and recommended next steps

**Technical priorities**

1. **Correctness.** Confirm and regression-test demonic threat under equal elapsed time partitioned into weeks, months, and one bulk span. Preserve lifespan clipping, breakthrough gains, and threat caps. The existing prefix hashes only compare repeated one-month requests.
2. **Observability.** Add optional bounded traces keyed by actor, office, and occurrence ID. Capture presence before and after a journey, the cause of actor death or retirement, conditional tick results, actual stock debits and credits, and evidence links between incident, observation, belief, and decision. Expose generated lesser sects alongside the player-facing roster and distinguish unclassified life-cycle state from true ambient promotion. Endpoint counts and bounded histories miss transitions and can obscure initially absent fields.
3. **Dormant production paths.** Build later scenarios around existing actions and explicit prerequisites. Use a player-away Redwell scenario, a real ambient promotion at the cap, and a founded sect with an assignment or accepted faction quest. A different start state or player policy should have its own scenario and expected stop reasons. Keep long runs opt-in.

**Design questions for the author**

4. **Emergent consequences.** Decide which established lodge or civic outcomes should affect wider Redwell, which aspects of its shabby condition are authored baseline, and whether any developments should occur independently of the player. Decide whether procedural organizations should make strategic moves separately from player-relative rivals. Retain the distinction between objective events and reported knowledge. The present audit supplies no evidence for inventing broad market dynamics, a town census, or a universal rumour network.
