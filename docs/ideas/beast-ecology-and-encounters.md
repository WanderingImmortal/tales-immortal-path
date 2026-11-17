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
