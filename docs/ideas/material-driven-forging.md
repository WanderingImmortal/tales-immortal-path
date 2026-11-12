# Unified material registry and material-driven forging

**Status:** idea — living design document, not implementation specification.
**Intent:** Make materials, equipment and crafting choices meaningful to players across professions. Build on the existing Mundane forge compose slice rather than replacing it wholesale.

## Agreed direction

- One shared registry of substances in the world. Alchemy, forging, formations and other systems can exploit different properties of the same substance. Profession-specific processing and recipes remain distinct.
- Materials have tiers, including mundane materials. Higher tiers have objectively greater overall potential; within a tier, materials have distinct uses and trade-offs. Exact tier ladder, stat bounds and relationship to equipment tier remain open. Preserve the existing equipment tier/grade design unless explicitly revised.
- Material properties have inherent sources. Processing may preserve, expose, amplify, suppress or destroy properties. Do not invent unrelated properties through arbitrary recipe combinations. Ordinary properties may be enhanced beyond the raw constituents' values where their interaction explains the outcome. A peculiar effect must have an underlying source.
- A material can have multiple potentials, accessible through different processes, including mutually exclusive processing routes within one profession. Processes may consume the substance or sacrifice other potentials. Cross-profession processing chains are desirable where they make sense.
- Start with moulds/patterns, material selection, forging and quenching. Produce a usable sword or other item without requiring component assembly. Add handles, guards, linings and other components later if the core loop is satisfying.
- Equipment should have meaningful physical and spiritual characteristics, not just flat damage/defence. Knowledge of opponents' equipment should matter to combat preparation, especially an assassin playstyle. Dangerous uncertainty should make cultivators wary of unnecessary lethal fights.

## Material families (provisional)

Non-exclusive tags: metals, minerals/ores, crystals, woods, fibres/fabrics, hides, skeletal materials (bone, horn, shell, scales), botanicals, liquids, resins, powders, essences. Beast-derived is an additional origin tag rather than necessarily a separate physical family. A liquid metal can belong to both families.

Structural, additive and treatment are possible usage roles, not exclusive families. Not every material should be melted into a mould. Treatments may alter an item without becoming part of it.

Expand the mundane metal selection. Familiar iron provides a reference point; fictional mundane metals can offer distinct physical characteristics without real-world expectations or supernatural effects. Copper/tin/bronze are possible, not required. No specific new metal names or stats locked.

## Existing content to reconcile

Prior discussion identified iron ore, leather scrap, heartwood splint, spirit crystal, silk thread and spirit herb in forge composition, and other crafting inventory materials such as celestial silk, jade inlay, glacial shard, demon core, beast blood, rare herb, frost essence and phoenix ash. Verify against live registries before migration; names and counts are not a definitive audit. Generic placeholders such as Rare Herb deserve a naming pass.

Potential cross-profession candidates discussed: Ironscar Grit, Sun Stone, Redvein Chip, Bone Marrow Resin, Blood Crystal, Earth Marrow, Dawn Dew. Their forging applications are not canon. Preserve existing alchemy chemistry and ingredient behavior during any registry migration.

Related designs: [Mundane forge compose](forge-compose-mundane-slice.md), [equipment tiers and grades](forging-equipment-tiers.md), [forge temperaments](forge-temperaments-idea.md).

## Properties and processing

Candidate ordinary physical properties: hardness, toughness, density, elasticity, tensile strength, thermal resistance. Candidate spiritual properties: Qi conductivity, retention, resistance, stability. Peculiar properties may be discrete behaviors with strength and conditions, e.g. heat absorption, regeneration, concealment, shape retention. Exact schema and minimal initial property set remain open.

Distinguish raw inherent potential from accessible properties in a processed material. A process can change how much of a property is realized and what other potential survives. Knowledge of processing methods is valuable independently of material tier.

Illustrative example (not a new canon material): Veiniron can be hot-forged for hardness at the expense of natural Qi channels, or worked at lower temperature to preserve conductivity at the expense of hardness. Alchemical extraction could instead isolate its heat-retaining constituent and consume the metal. An alchemical pretreatment might permit a smith to preserve channels otherwise lost during forging; a formation specialist could then exploit them.

Illustrative bone: heating a naturally regenerative beast bone may destroy regeneration; an alternative treatment preserves it, and an inscription can amplify it using Qi. Regeneration does not originate from an arbitrary forging recipe.

Alloy example: combining two metals may enhance hardness beyond either constituent through structural interaction, while trading off toughness or density. Combining a Qi-absorbing material with a Qi-retaining one may enable storage. Neither example licenses unrelated supernatural effects.

## Equipment and artefacts

Material supplies inherent properties; construction determines how they are used; inscriptions direct or enhance available effects. Artefacts can be distinctive and reproducible, not necessarily unique world items. Examples (illustrative only): Qi-absorbing blade, vibration-transmitting hammer, concealment fabric, Qi reservoir pendant, heat-retaining furnace component. A shape-retaining liquid that can be reshaped with Qi could eventually support unusual weapons or armour. Do not implement these examples as content yet.

Existing design separates material/martial characteristics from power-gated supernatural interfaces. A dormant treasure still consists of its actual material. Reconcile attunement, handling and passive protection rather than automatically weakening all inherent properties.

## Combat and armour direction

Explore primary physical damage categories: blunt, piercing, lacerating (inspired by the user's description of Quasimorph). Exact damage representation is not locked. Attacks may carry penetration capability and impact separately; a stopped cut or thrust can still transmit blunt force. Avoid counting the same impact twice.

Armour changes the outcome of a hit rather than simply subtracting a flat defence number. Candidate properties: penetration resistance, impact absorption, force distribution, coverage, durability, encumbrance. Hard outer armour resists penetration and spreads concentrated loads; soft padding cushions residual impact. Flexible spiritual silk might resist cutting but transmit substantial impact. Rigid armour can deform or break under excessive force. Layered construction is a future extension, not a requirement for the first slice.

Conceptual resolution: spiritual ward (if applicable) → covered armour layers → body tissues → injury. Body refinement changes how residual force affects the wearer; a body cultivator and Qi cultivator wearing the same armour can experience different injuries. Exact ordering for special effects and integration with existing combat/injury code require inspection.

Equipment reconnaissance should matter: visible gear may reveal likely strengths, while unknown inscriptions or treasures preserve uncertainty. A victory can still be costly through injuries or equipment loss. This is a design goal, not a new NPC AI specification.

## Implementation approach (proposed)

1. Audit current material, alchemy, forge compose/quench, gear and combat data and existing tests.
2. Define minimal shared material identity and properties, preserving legacy IDs and saves; decide migration strategy before touching code.
3. Test mundane mould-based forging with a small selection of distinct metals and material-derived outcomes. Build on existing core/aux patterns and quench mechanics where practical.
4. Prototype a single physical armour layer and penetration/impact resolution integrated with existing injuries. Validate that differences are meaningful and understandable.
5. Expand only after playtesting: layered armour, assembly, spiritual properties, inscriptions and cross-profession processing.

No physics simulation required; consistent abstract rules are preferred. No numerical balancing, new recipes, registry migration or combat rewrite authorized by this document alone.

## Open decisions

- Minimal property vocabulary, units, tier scaling, raw vs processed state, stack identity and save migration.
- Material combinations and process constraints, how to represent mutually exclusive potentials, how knowledge is acquired and displayed.
- Mould compatibility, heat/quench mechanics and how much player interaction is enjoyable.
- Exact attack representation, armour coverage, residual force, durability and body injury integration.
- Relationship of material tier, equipment tier, grade and attunement; reconcile existing tier boundary rules with specialization.
- How to expose equipment intelligence and uncertainty to the player without overwhelming the UI.

Keep updating this document as decisions are made. Examples and proposed implementation order are not settled canon.
