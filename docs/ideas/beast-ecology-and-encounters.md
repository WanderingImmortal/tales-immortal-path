# Beast ecology and regional encounters

**Status:** idea — design checkpoint, no implementation.
**Intent:** Replace the mixed enemy pool with geographically predictable wildlife and meaningful hunting/material sources, without simulating every animal's life.
**Related:** [Unified materials](material-driven-forging.md), [field gathering](explore-field-gathering.md), [Dustbone starter gameplay](dustbone-starter-gameplay.md), [wilderness regeneration](resource-sources-wilderness-regen.md).

## Agreed direction

- Beast is an umbrella creature classification, not a biological species or family. Ordinary beasts are unranked; Rank 1 is Ferocious Beast; Rank 2 begins Demon Beast. Species, bloodline, rank and peculiar abilities are separate.
- Rank 1 ferocious beasts primarily resemble External Tempering cultivators in physical development, rather than Qi Condensation cultivators in conscious Qi manipulation. A typical one should be a good challenge for an average, decently equipped Qi Condensation cultivator of comparable progression. Species, bloodline and special abilities can create substantial exceptions. Rank is not a standardized combat rating.
- Rank 2 brings greater spiritual attunement and some increased intelligence beyond instinct; not necessarily human intelligence. Exact spiritual abilities and later realm identities remain open.
- Beasts generally grow faster than humans when adequately fed, with species-specific rates and natural ceilings. A fast-growing species might cap at Rank 2 while a slower one reaches Rank 4; no required inverse relationship. Exceptional ceiling-breaking is a proposal, not a locked rule.
- Early breakthroughs (roughly the first four realms) may primarily be a matter of accumulation. This is provisional; do not design a full beast cultivation system yet.
- Avoid human-style talent as a default concept. Innate potential (proposed terminology), constitution, spiritual affinity, bloodline and environmental conditions can explain individual variation without implying conscious cultivation.
- Species should have identifiable food sources, including other beasts and vegetation where appropriate. Players can infer likely predators from prey and vice versa. No origin-of-life explanation or full food-chain simulation required.

## Initial Dustbone species (accepted sketches, details provisional)

| Species | Habitat | Combat identity | Diet and behaviour | Materials |
|---|---|---|---|---|
| Ironscale Lizard | Rocky outcrops, Ironscar Quarry | Heavy mineral-like scales, strong jaws and tail, slow and resilient; cutting resistance, possible blunt vulnerability | Carnivore; solitary, territorial, limited pursuit | Scales, bones, blood, sinew |
| Ashfang Wolf | Scrublands, open plains | Lean ash-grey predator, fast, mobile, biting and laceration, less resilient | Carnivore; roaming, possible pack behaviour later | Hide, bones, blood, sinew |

Exact prey, spawn sites, age ranges, rank ceilings, stats and loot rates are not settled. Dust Hares and scrubland grazers were illustrative prey placeholders, not approved additional species. Non-hostile wildlife, herbivores and scavengers should eventually exist. Earlier example of fast-growing Rank 2 wolf versus slower Rank 3 lizard is illustrative only.

## Encounter generation — proposed initial slice

Use local weighted encounter pools rather than a universal random enemy pool. Area definitions can include resident species, expected rank/stage distribution, encounter frequency and rare roaming encounters. A higher-rank wanderer can be an exceptional local threat, not a routine surprise in safe starter areas. Human enemies and other creature categories remain separate; do not remove existing content blindly.

Generate individuals on encounter (or combat start if no earlier persistent encounter exists). Age and strength should be correlated, not independent rolls. Proposed inputs: species development profile, age, individual innate variation and local conditions including food availability. Species profiles can eventually include diet, habitat, growth rate, rank ceiling and lifespan. No fixed age thresholds or growth equations approved. Age is not a guaranteed breakthrough; account for plausible lifespan and development. Preserve generated identity and stats for as long as the encounter/entity is tracked; fleeing and re-engaging the same beast should not reroll it.

Start with two species and predictable local pools. Reuse existing encounter, combat and loot infrastructure after auditing it. Do not require a new armour system, full beast cultivation path, or all nine ranks to ship this slice.

## Later population abstraction (proposal, not first-slice requirement)

Track regional counts by species and rank/stage, optionally age cohorts. Periodically update abstract reproduction, mortality, growth, food availability and migration. Generate individuals from those populations only when relevant. Hunting could reduce local counts and affect resource supply; persistent notable beasts may be tracked individually. Avoid per-beast meals, digestion or continuous individual cultivation. Integrate with existing wilderness regeneration and world clock rather than introduce competing simulations. Exact population model, persistence and performance budget open.

## Material connection

Generic rank-based beast materials remain the baseline, with peculiar species/bloodline exceptions later. Demon Core is a generic rank-indexed lineage; whether Rank 1 ferocious beasts actually possess cores remains unresolved (do not assume they drop them). See unified materials checkpoint. Internal organs, venom glands, elemental cores and special drops are deferred.

## Prerequisites and open questions

Audit current enemy definitions, field encounter pools, loot tables, realm/stage representation, save persistence and resource regeneration before implementation. Establish initial habitat and encounter weights, combat tuning and age/development bands with owner review. Later: exact prey species, food scarcity effects, population recovery, beast lifespans, breakthroughs beyond early accumulation, intelligence progression, core anatomy and exceptional bloodlines. No origin-of-life lore, new cultivation path or high-rank beast metaphysics authorized.

## Suggested independent implementation slices

1. Regional encounter pool data and two species using existing combat.
2. Correlated age/rank generation and encounter persistence.
3. Generic rank-based loot integration once material IDs and core eligibility are resolved.
4. Optional aggregate ecology and population feedback later.

These are suggested work boundaries, not an approved implementation specification. Keep the initial slice small and preserve existing saves and content.


## November follow-up — development, abilities and encounter behaviour

This checkpoint supersedes earlier illustrative ceilings and encounter assumptions. It is design direction, not an implementation mandate.

### Natural development
- Species have independent tendencies toward physical refinement (Vital Essence) and spiritual development (Yao Qi). Neither excludes the other; no shared stat budget. Ironscale is physically inclined, Ashfang spiritually inclined. Yao Qi is the preferred term for nonhuman spiritual development, distinct from the human Heavenly Demon title. Authored awakened non-beast cases (e.g. ancient guardian trees) are possible; no procedural awakened objects yet.
- Natural food, water, breathing and spiritual environment support development; spiritual resources accelerate it. No per-meal simulation. Vital Essence is tied to living physical existence and refined tissues, not assumed to be a spendable bar or Qi substitute; see [body realm journey](body-realm-journey-and-vital-essence.md). Exact causal mechanics remain open.
- Species develop uniformly rather than choosing individual tissue specializations. Species physiology determines inherent strengths; rank determines baseline material rank across tissues. Condition and damage may affect quality (proposal). No universal stat budget or requirement that every species be equally strong.
- Growth to a natural species ceiling is principally time, resources and survival. Breakthroughs may involve secluded dormancy/hibernation and internal adaptation, raising the ceiling for subsequent growth rather than necessarily granting an enormous instant power spike. Exact duration, vulnerability and mechanics open. Size growth is species-dependent; exceptional condensation back to smaller form is a future metamorphosis idea.
- Working ceilings: Ashfang naturally Rank 3, relatively fast development; Ironscale naturally Rank 2, slower but particularly formidable within rank. Rank 4 Ashfang or Rank 3 Ironscale exceptional; ceiling-breaking mechanism open. Peak lower rank may exceed early higher rank in particular capabilities.
- Predatory beasts generally challenge or exceed average comparable single-path cultivators in direct combat; preparation, equipment, techniques and cooperation are human advantages. Not all beasts are combat specialists; do not balance around optimized multi-path builds.
- Rank 2 is a qualitative spiritual/physical and behavioural development, not necessarily core formation. Core formation is tentatively deferred to Rank 3; whether physical species form the same core and exact loot eligibility remain unresolved. No assumed Rank 1 or 2 core drops. Spirit and soul are distinct; true soul interaction is reserved for realm/rank 4 onward, consistent with the human spirit path.

### Abilities and intelligence
- Natural abilities extend biology (bite, tail, venom, senses); innate spiritual abilities usually develop from recognizable species functions (e.g. Ashfang howl). More abstract departures usually arise from variants or bloodlines. Acquired abilities and exceptional resources are future topics. No specific ability kit or numerical effects approved.
- Intelligence improves with rank in species-dependent ways, not as a universal human-equivalence threshold. Rank 1 Ashfang instinctive cooperation; Rank 2 deliberate retreat, observation and basic tactics; Rank 3 pack coordination, flanking, strategic retreat and tactical sacrifices. Rank 2 Ironscale can recognize combat threats but has less forethought. Ashfang may reach human-equivalent reasoning around Rank 4–5; exact threshold and later development open. Sapience need not imply human behaviour.
- Instincts/objectives, abilities and intelligence are distinct. Ordinary beasts can ambush instinctively; higher intelligence enables more sophisticated judgment, planning and adaptation. Hunger, territory, protecting offspring, fear and self-preservation can motivate different outcomes. Beasts need not fight to death.
- Species can trust their own strengths: Ironscale may present armoured scales or accept a hit to counter; Ashfang may evade and exploit recovery; hypothetical venomous snake may ambush, bite, disengage and stalk until prey weakens. These are behaviour examples, not new species or approved moves.

### Material interaction and combat boundaries
- Natural armour and refined tissues should use the shared physical material vocabulary where practical. Hardness, toughness, strength, stiffness and density are candidate distinct properties, not settled numerical schema. Material properties differ from effective protection of an object; pattern can abstract thickness/geometry/construction, with processing and inscriptions modifying properties.
- Do not require precise penetration depth, organ trajectories, full geometry or a combat overhaul for material-driven forging. Successful penetration should feel rewarding, not become a toothpick problem against large beasts. Size can influence existing combat characteristics rather than imposing a second anatomical gate. Candidate outcomes: deflection, penetration and blunt force transfer, including armour damage; exact formulas open.
- [Reaction sandbox](combat-reaction-sandbox-prototype.md) ([PR #195](https://github.com/WanderingImmortal/tales-immortal-path/pull/195)) is dev-only, continuous 2D with visual grid, prep/exec/recovery, detection/latency, evade/block/parry/counter. Species-specific reactions are desirable if adopted; accepting a hit or guarding with scales is a proposed behaviour, not a current named reaction. Material interaction can resolve contact after timing/position/reaction. Do not import sandbox constants or require sandbox migration for beasts; production remains separate.

### Proximity encounters and spotlight persistence
- Preserve separate world-map and combat instances. A conflict can persist across instances without seamless open-world combat: encounter -> enemy escapes -> map activity -> later ambush/re-engagement. Also allow first contact to be an ambush without prior visible encounter.
- Evolve local random encounter checks toward proximity encounters, not guaranteed fights. Generate a local individual and determine awareness (beast detects player, player detects beast, both or neither). Evaluate perceived danger, objectives, instincts and intelligence. Possible outcomes: avoid/flee/freeze, immediate engagement, observe, stalk or prepare ambush. No need to announce unseen checks.
- Promote a beast into lightweight spotlight simulation when it has a reason to remain relevant, including before the player ever sees it. Immediate avoidance need not persist. Observation, stalking, planned ambush, retreat with intent to return, recovery or gathering allies can justify persistence. Demotion when relevance ends is a proposal; preserve identity and injuries while tracked. Reuse human spotlight infrastructure where appropriate after audit, not full human schedules/economy for ordinary wildlife.
- Spotlight state candidates: identity/species/rank/stage, condition/injuries, abilities, area, objective, observed knowledge of player, behaviour and next decision. No continuous exact position required outside combat. World clock and activity interrupts should govern subsequent opportunities; exact cadence, save shape and performance limits open.
- Strength judgment is based on perceived evidence, not omniscient character stats: aura/spiritual presence, physical presence, observed combat, visible injuries/exhaustion, prior encounters. Concealment and perception matter. Rank 1 Ashfang may flee/freeze at overwhelming aura; Rank 2 may observe cautiously or wait in ambush; Rank 3 may coordinate or exploit a later vulnerability. Illustrative, not hard unlocks. Species-specific perception possible.
- Stalking is not automatically disclosed. Player may detect signs through perception or other appropriate means, or remain unaware until ambushed. A beast can harass a stronger opponent until a fairer fight, wait for another fight to weaken them, or abandon an unprofitable hunt. Do not make repeated attacks inevitable or intelligence synonymous with aggression. Player can likewise retreat, recover and track a persistent beast.
- Persistent conflict could later support human assassins/rivals too, but no human NPC rewrite authorized. Audit existing spotlight NPC, encounter generation, world clock, injury/status persistence and combat exit paths before implementation. Keep this independent of reaction sandbox migration and aggregate ecology.

No new code, stats, species, loot tables, or combat rewrite approved by this checkpoint.


## Latest loot direction
Owner now prefers species-specific beast loot over generic rank-only drops, superseding the earlier generic baseline. Challenging hunts, distinctive species properties and geographic scarcity make acquiring particular materials a meaningful time investment; a cultivator may choose to travel, trade, hunt or change crafting/refinement plans. Preserve species identity and rank in material design; exact item roster, stacking and legacy ID migration remain open. No loot implementation authorized. See [materials checkpoint](material-driven-forging.md) for simplified properties and QC/FE physical benchmarks.


## 2026-11-19 checkpoint — social strategies and material anatomy

Owner distinguishes predominantly solitary beasts that rely on individual strength from social beasts that rely on group cooperation. A lone Ironscale Lizard is a considerable threat and substantially more dangerous than a lone Ashfang Wolf at comparable development. Ashfang packs can threaten opponents individual wolves cannot. Exact encounter difficulty, group sizes and balance remain open; not a universal binary taxonomy or fixed combat rating.

Ironscales can reproduce without permanent packs. Owner suggested small groups/family units as possible exceptions to solitary adults. Candidate ecology: temporary mating encounters, nesting female guarding eggs/young, juvenile siblings remaining near birthplace before dispersing into individual territories. These are proposals, not fixed reproductive canon. Juvenile groups and protective nesting adults could create encounter variety. Breeding cycles, clutch size, parental behaviour, population density and simulation mechanics deferred to ecology pass.

Species-specific anatomy matters: Ironscale has skin beneath protective scales; separate hide and scale harvesting or intact scaled-hide processing are candidates. Ashfang hide can be cut by an ordinary mortal iron sword; muscle, bone, movement and active defence remain obstacles. Ironscale bone and sinew can be physically formidable, but Ashfang sinew may excel in elastic recoil due to agile movement. No requirement that physical-development tendency makes every Ironscale tissue superior. See [material checkpoint](material-driven-forging.md) for initial values and processing notes. Hunting yield and prices remain open. No implementation or merge authorized.
