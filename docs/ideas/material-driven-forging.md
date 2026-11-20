# Unified material registry and material-driven forging

**Status:** idea — living design document, not implementation specification.
**Intent:** Make materials, equipment and crafting choices meaningful to players across professions. Build on the existing Mundane forge compose slice rather than replacing it wholesale.

## Agreed direction

- One shared registry of substances in the world. Alchemy, forging, formations and other systems can exploit different properties of the same substance. Profession-specific processing and recipes remain distinct.
- Materials have ranks, including Mundane materials. Higher ranks represent greater overall potential or deeper capabilities; within a rank, materials have distinct uses and trade-offs. See the later checkpoint for terminology and unresolved boundaries. Preserve the existing equipment tier/grade design unless explicitly revised.
- Material properties have inherent sources. Processing may preserve, expose, amplify, suppress or destroy properties. Do not invent unrelated properties through arbitrary recipe combinations. Ordinary properties may be enhanced beyond the raw constituents' values where their interaction explains the outcome. A peculiar effect must have an underlying source.
- A material can have multiple potentials, accessible through different processes, including mutually exclusive processing routes within one profession. Processes may consume the substance or sacrifice other potentials. Cross-profession processing chains are desirable where they make sense.
- Start with moulds/patterns, material selection, forging and quenching. Produce a usable sword or other item without requiring component assembly. Add handles, guards, linings and other components later if the core loop is satisfying.
- Equipment should have meaningful physical and spiritual characteristics, not just flat damage/defence. Knowledge of opponents' equipment should matter to combat preparation, especially an assassin playstyle. Dangerous uncertainty should make cultivators wary of unnecessary lethal fights.

## Material families (provisional)

Non-exclusive tags: metals, minerals/ores, crystals, woods, fibres/fabrics, hides, skeletal materials (bone, horn, shell, scales), botanicals, liquids, resins, essences. Powder is a physical form, not a family. Beast-derived is an additional origin tag rather than necessarily a separate physical family. A liquid metal can belong to both families.

Structural, additive and treatment are possible usage roles, not exclusive families. Not every material should be melted into a mould. Treatments may alter an item without becoming part of it.

Expand the mundane metal selection. Familiar iron provides a reference point; fictional mundane metals can offer distinct physical characteristics without real-world expectations or supernatural effects. Copper/tin/bronze are possible, not required. No specific new metal names or stats locked.

## Existing content to reconcile

Prior discussion identified iron ore, leather scrap, heartwood splint, spirit crystal, silk thread and spirit herb in forge composition, and other crafting inventory materials such as celestial silk, jade inlay, glacial shard, demon core, beast blood, rare herb, frost essence and phoenix ash. Verify against live registries before migration; names and counts are not a definitive audit. Rare Herb is intentionally retained; see the later botanical checkpoint.

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


## Subsequent decisions: material roster and advancement

Start with roughly 3–5 materials per family, then refine properties, occurrence, rarity, purity, quality and variants. Different tiers may have entirely different rosters; gaps are acceptable. Not every lineage needs higher-tier variants or every intermediate tier. Overall tier reflects broad potential, not universal superiority in each property: a mundane specialist may outperform higher-tier materials in a narrow application. Reconcile this with existing equipment tier rules before implementation.

Spiritual saturation can itself define a higher-tier variant without requiring a fundamental transformation. Illustrative iron example: at 20% saturation it is classified as Spirit Iron, at 40% it is low-quality Spirit Iron, and at 100% it is fully saturated. Thresholds are not settled. Distinguish saturation from compositional purity and broader quality; properties need not jump at classification boundaries. Natural spiritual exposure and artificial infusion/formation processing are possible routes. Material-specific capacity, retention, effects of saturation and whether further advancement is possible remain open. Forging may affect saturation (proposal). Age and growth conditions can improve living resources; harvested wood does not automatically improve merely by aging. Beast cultivation and maturity can influence hides, bones and sinews.

### Initial mundane metals (accepted roster; details provisional)

| Metal | Defining niche | Applications | Possible occurrence |
|---|---|---|---|
| Iron | Balanced strength and workability | General weapons, armour, tools, construction | Widespread rocky deposits |
| Copper | Conductivity and malleability | Formation channels, alloys, intricate components | Mineral-rich hills, hydrothermal deposits |
| Blackiron | Hardness and density, brittle and difficult to work | Heavy weapons, rigid armour, industrial tools | Deep mountain deposits |
| Silversteel | High resilience and toughness, lightweight, lower hardness | Soft swords, bow limbs, flexible armour, springs, institutional siege equipment | Mineral-rich rock; exact conditions open |
| Redvein | Heat absorption and retention | Cauldrons, furnaces, thermal storage | Geothermal and volcanic regions |

Check Redvein against existing alchemical ingredients before defining its identity. All numerical properties and spawn conditions remain provisional. Resilience (recoverable elastic energy) is distinct from stiffness, hardness and toughness.

### Initial mundane woods (accepted roster; details provisional)

| Wood | Defining niche | Applications | Possible habitat |
|---|---|---|---|
| Ironwood | Dense, hard, durable; heavy and difficult to carve | Shafts, shields, tools, construction | Mature forests |
| Springwood | Resilience and flexibility; relatively soft | Bows, flexible shafts, mechanisms | Temperate forests |
| Cloudwood | Very light, porous, absorbent; weak against concentrated force | Arrows, boats, lightweight equipment, treatment substrates | Warm humid regions |
| Incensewood | Aromatic oils and resins; chemical rather than structural value | Alchemy, incense, medicinal extracts | Tropical forests |
| Stillwood | Dimensional stability; relatively brittle and slow-growing | Formation plates, precision instruments, containers | Mountain forests |

Tree age at harvest and growing conditions may affect quality. Artificial infusion of harvested timber is a separate possible route. Forestry can provide renewable resources and long replenishment cycles; resin harvesting may not require felling.

### Cross-family and economic implications

Include plant fibres, animal fibres and sinews in the fibre family. Dragon sinew bowstring is a desired illustrative high-tier application, not a defined item yet. Bow limbs and strings have different material requirements.

Record institutional uses alongside individual uses. Cities, sects, armies and workshops may consume far more of a resource than individual cultivators. Silversteel is an example: specialist personal weapons may have limited demand while large military projects and machinery generate substantial demand. Regional supply, resource concentration, trade, stockpiling, construction and conflict can influence prices. Demand profiles are a possible abstraction rather than simulating every purchase. Separate kingdoms are a deferred worldbuilding topic, not a prerequisite.


## Material family checkpoint — November 2026

This section supersedes earlier provisional family and terminology statements. Rosters are agreed starting points unless marked provisional; exact stats, habitats, scarcity, processing and implementation remain open.

### Rank and classification

Use **Material Rank**, **Equipment Tier**, and **Equipment Grade** (craftsmanship within a tier). Material ranks correspond broadly to the nine realm bands: Mundane, Tempered, Treasure, Spiritual, Celestial, Silent, Dao, Law, Immortal. Mundane includes the entire first realm (Qi Condensation and equivalents), not just non-spiritual mortal substances. Rank is independent of rarity, purity, saturation, quality, danger and handling/refinement difficulty. A specialist lower-rank material may outperform a higher-rank one in a narrow property. Rank is not a universal stat multiplier or automatic handling gate. Existing equipment tier/grade rules still require reconciliation.

Powder is a physical form, not a family: grinding iron, herbs or bones changes form and accessible properties, not underlying identity. Naturally granular minerals remain minerals. Ash is a byproduct. Retain nonexclusive family and origin tags.

### Fibres (initial Rank 1 roster)

| Material | Niche |
|---|---|
| Hemp | General strong coarse fibre; rope, cloth, sacks, linings |
| Silk | Fine lightweight tensile fibre; robes, soft armour, precision threads |
| Beast Sinew | High tensile strength and toughness; bowstrings, bindings; generic rank variants |
| Cloudfloss | Soft compressible padding and insulation; weak in tension |
| Veinthread | Capillary transport and treatment retention; wicks, dressings, formation threads; possible natural Qi transport |

Hemp fields, silk husbandry, animal harvesting, seed fibres and wetland plants are possible sources respectively. Exact properties and habitats provisional. Layered silk, cloudfloss and hemp armour illustrates distinct functions.

### Hides and skeletal materials

One generic mundane hide, processed into leather; higher beast ranks provide generic rank-based hides rather than one item per species. Species-specific exceptions for peculiar properties. Same principle for sinew, blood and skeletal materials. Beast rank names and nonuniform body-part ranks remain open.

| Skeletal family | Niche |
|---|---|
| Bone | Rigid lightweight structural material, handles, alchemy |
| Horn | Tough resilient material, composite bows |
| Shell | Hard rigid plates, shields, containers |
| Scale | Overlapping armour, alchemy |

A peculiar core bone is a possible future beast-system concept, not established content. Cinderscale Flake is an existing prototype example of a species-specific skeletal reagent.

### Minerals and crystals

| Mineral | Niche |
|---|---|
| Granite | Durable bulk stone, foundations, walls, grinding and formation platforms |
| Fireclay | Mouldable then refractory fired material, furnace linings and vessels |
| Jade | Tough fine-carvable material, slips, formation plates, jewellery; possible Qi retention |
| Hollowstone | Porous lightweight absorption, filtration and insulation; weak and contamination-prone |
| Limestone | Construction, mortar, plaster and flux |

Jade is not intrinsically expensive; prices should emerge from supply and demand. Luxury demand from wealthy households and institutions can matter alongside crafting demand.

| Crystal | Niche |
|---|---|
| Clear Quartz | Optical clarity, predictable transmission, calibration and precision |
| Echo Crystal | Vibration resonance, communication and detection |
| Sun Crystal | Light absorption and gradual heat release |
| Dusk Crystal | Qi attenuation/dissipation, concealment and isolation |
| Spirit Stone | Spiritual energy accumulation and retention, consumable energy and currency |

Crystal roster is specialized; exact properties and occurrences provisional. Existing Sun Stone may overlap Sun Crystal; reconcile rather than duplicate automatically. Spirit Stones are physical materials with noncurrency uses (including impractical luxury construction or armour), not just money. Existing Blood Crystal is an additional reagent.

### Botanicals

| Material | Defining identity | Rank direction |
|---|---|---|
| Dust Root | Qi nourishment, earthy binder | 1 |
| Saltbrush Tip | Purification, stability and wound stabilisation | 1 |
| Marrow Thistle | Bone restoration and marrow nourishment | 1 |
| Glowcap | Yin-associated nourishment and tissue recovery | 1 |
| Clot Moss | Wound stabilisation, distinct from healing | 1 |
| Silvervein Leaf | Tissue restoration; proposed rename of Skinmend Leaf | 1 |
| Silent Bell | Qi suppression | 1 |
| Bloodthorn | Blood degradation | 1 |
| Ghostcap | Perception/concentration interference | 1 |
| Foundation Root | Stable spiritual essence, growth-dependent advancement | 1+ |
| Amber Lily | Spiritual nourishment of living tissue | 2 provisional |
| Rare Herb | Property undefined | Higher rank, TBD |

Clot Moss can be chewed by soldiers in emergencies without pills; prepared dressings and refined medicine exploit the same underlying property. Raw uses should exist where appropriate. Rare Herb retains its name: an ancient Immortal alchemist's rough notes described a plant as a rare herb, and later scholars inadvertently adopted that description as its formal name. Keep the alchemist anonymous for now; exact rank, property and journal wording are not settled. Foundation Root is not exclusive to Foundation Establishment; age and conditions may raise rank. Amber Lily is provisionally above mundane natural recovery rather than weakening its identity.

Bloodthorn's lethality and poison mechanics are deferred. Bloodline interactions may depend on individual bloodline properties, not a universal vulnerability or immunity. A separate vitality-draining botanical is parked for later. Poison, Gu and assassin applications are future systems; internal organ/damage simulation is not specified here. The same property can recur at higher ranks with greater potency or depth.

### Existing alchemy reconciliation

Prior inspection of main's alchemy-data.js, docs/ideas/dustbone-qc-alchemy.md and prototype/property-alchemy/reagents.js established:
- Dustbone ten: Dust Root, Saltbrush Tip, Dawn Dew, Marrow Thistle, Ironscar Grit, Sun Stone, Redvein Chip, Seep Dew, Glowcap, Bone Marrow Resin.
- Live additional alchemy materials: Spirit Dew, Earth Marrow, Blood Crystal, Soul Mist, Foundation Root. Existing recipes also reference Spirit Herb, Rare Herb and Jade Inlay. Spirit Herb's distinct identity remains unresolved.
- Prototype includes Amber Lily, Cinderscale Flake, Clot Moss and Skinmend Leaf; preserve existing prototype behaviour until a deliberate migration. Blood Crystal has blood restoration; Sun Stone is a volatile yang/heat catalyst; Soul Mist dense yin; Ironscar Grit mineral weight and stubborn impurities. Redvein Chip's relation to Redvein remains to reconcile.
- Legacy common/uncommon/rare tiers are scarcity labels, not new material ranks. Do not silently change IDs, recipe access or balance. Full craft registry audit remains outstanding.

### Liquids (accepted initial roster)

| Liquid | Niche |
|---|---|
| Water | Ordinary solvent, cooling, washing, quenching |
| Dawn Dew | Gentle stable carrier |
| Seep Dew | Dense essence carrier, possible mineral contamination |
| Spirit Dew | Generic spiritually saturated water (proposed identity) |
| Beast Blood | Generic rank-based biological/vital material, species exceptions |
| Flowing Silver | Liquid metallic Qi conductor, requires containment |
| Frostspring Water | Thermal absorption, cooling and preservation |

Golden Oil dropped; ordinary oils and species-specific oils can emerge as needed. Manufactured solutions are processed products. Flowing Silver rank and Frostspring capacity remain open. Redvein heat retention and Frostspring cooling illustrate complementary furnace materials.

### Resins (accepted initial roster)

| Resin | Niche |
|---|---|
| Wood Resin | Adhesion and sealing |
| Incensewood Resin | Aromatic and medicinal properties |
| Bone Marrow Resin | Dense essence retention and packing |
| Spiritseal Resin | Spiritual insulation when hardened; seals containers and isolates channels |

Resins are supporting materials, not required to be equally prominent. Preservation, composite equipment and formation isolation are possible applications; exact mechanics and ranks open.

### Essences — direction agreed, roster and rank boundaries provisional

Essences are concentrated manifestations of spiritual nature, distinct from physical matter containing spiritual properties or Spirit Stones storing energy. Naturally formed and extracted essences are possible; extracted material properties need not become separate base materials.

- Body path: premium refinement route, rare/expensive, progression and specialized physiques.
- Qi path: assimilation may influence Qi characteristics and cultivation direction, not just speed; does not automatically grant Dao comprehension.
- Soul path: compatible essences may affect soul cohesion, perception or resistance; exact mechanics open.
- Forging, formations and alchemy can exploit the same essence. A Rank 3 flame may be a wealthy alchemist's cauldron heat source rather than consumed in cultivation. Other illustrative applications: forge heat, preservation chamber, defensive anchor, soul cultivation chamber, artefact power. Persistent use versus consumption and sustaining costs open.
- Specialization should not require wealth exclusively; cumulative incorporation, compatibility and conventional alternatives are proposals.

Candidate low-rank essences (not locked roster): Fire Essence, Frost Essence, Earth Marrow, Soul Mist, concentrated Vital Essence (distinguish from body cultivation resource). Low-rank essences can be rare and valuable: life-changing for a first-realm cultivator, worth seeking for a second-realm cultivator, less remarkable for a third-realm one. High-rank discoveries need not be immediately usable; containment, access, compatibility and partial use are open.

**Current conceptual framework:** element (fire, frost, dark etc.), property (what it does), potency (strength of effect), depth (what level of existence it interacts with). A flame may burn physical matter, Qi, soul, void or karmic connections; frost may absorb heat, slow Qi, preserve against decay or arrest time. These are illustrative, not new roster entries. Both greater potency within the same domain and deeper interaction can justify higher rank. A gentle Dao-level essence is not low rank merely because it is harmless. Interaction with its underlying domain may be necessary to grasp or refine it; a karmic flame is not automatically wieldable by a first-realm cultivator. Reject resistance/control difficulty as a universal rank test.

**Next design discussion:** clarify qualitative realm transitions across all three cultivation paths, then revisit material/essence rank demarcations. No nine-rank essence ladder is settled; especially middle ranks remain hazy. Realm-equivalent capability is a working direction, not a finalized classification algorithm. Do not implement numerical thresholds or assume Dao/void/karma access gates until the realm review.


### Essence follow-up — provisional rank framework (November 2026)

This supersedes the earlier potency/depth-based classification proposal. Material rank has a shared realm-equivalent meaning, not a universal advancement mechanism across families. Metals, crystals, living resources and essences may qualify for the same rank for different reasons. Purity can affect rank in a particular material lineage with a finite ceiling (illustrative only); purity is not equipment grade, and no universal purity-to-rank rule is intended.

For essences specifically, rank describes the sophistication of their spiritual existence. Element and properties describe their nature and applications. New capabilities may follow from rank rather than being arbitrary prerequisites for it. Do not require essences to imitate cultivator anatomy or breakthroughs (e.g. a miniature Golden Core).

| Rank | Working intrinsic distinction |
|---|---|
| 1 — Mundane (Qi Condensation equivalent) | Condensed spiritual energy expresses a coherent identity; sufficiently dispersing or depleting it destroys that identity. Compatible energy can sustain it. |
| 2 — Tempered (Foundation Establishment equivalent) | Identity has an established structure that can survive severe energy depletion and recover under suitable conditions. It is not indestructible. |
| 3 — Treasure (Golden Core equivalent) | Identity begins imposing its nature beyond itself, actively influencing surrounding spiritual energy rather than merely producing incidental physical effects. Conversion of ambient Qi is a candidate mechanism, not unlimited growth. |
| 4 — Spiritual (Nascent Soul equivalent) | Increasingly integrated identity exhibits autonomous, lifelike responses or spiritual instinct, without necessarily being alive, conscious or possessing a soul. |
| 5–8 | Undetermined; revisit alongside cultivation realm definitions. |
| 9 — Immortal | Heavenly tribulation on ascension or birth; possible emergence of genuine spiritual life and a soul. Exact outcomes and universality unresolved. |

Rank 3 environmental influence can be substantial: an uncontained flame might noticeably warm a town and scorch objects within a few metres, without setting the whole town ablaze. Distances are illustrative, not balance targets. Distinguish ordinary heat emitted by any flame from active imposition of its nature upon ambient Qi. Non-destructive essences can likewise influence environments. An essence may originate in a suitable environment and later sustain a spiritual ecosystem; removal could gradually change local resources and conditions. Sects may value leaving one in place. Dao-level influence may eventually affect underlying principles, but no specific rank gate is locked.

Rank 4 instinct might manifest as attraction to compatible energy, avoidance of threats, resistance to containment or familiar responses to an owner's Qi. These are examples of consequences, not mandatory abilities. Life could emerge unintentionally as a byproduct of increasing spiritual integration, rather than through deliberate cultivation. Do not equate rank with intelligence.

#### Initial example roster (working designs)

| Essence | Rank | Element / property | Applications and occurrence |
|---|---|---|---|
| Emberheart Flame | 1 | Fire / sustained heat | Concentrated Yang Qi and persistent heat; absorbs compatible spiritual energy rather than physical fuel. Fire-aligned Qi, thermal tempering, cauldron and forge heat. |
| Earth Marrow | 1 | Earth / physical reinforcement | Dense viscous spiritual concentration, deep earth-aligned deposits under pressure. Reinforcement techniques, bone/tissue refinement, structural and formation materials. |
| Soul Mist | 1 | Soul affinity (element classification provisional) / spiritual nourishment | Cohesive mist in undisturbed compatible spiritual energy. Soul nourishment, spiritual recovery, pills and formations. Does not itself possess a soul. |
| Everfrost Essence | 2 | Frost / heat absorption | Persistent cold and concentrated Yin Qi. Frost-aligned Qi, cold tempering, cooling, preservation and quenching. Can retain identity when severely depleted and recover. |

Earth Marrow and Soul Mist reuse existing alchemy names; reconcile proposed identities with live/prototype behaviour before implementation. Emberheart and Everfrost are proposed new identities; reconcile existing Frost Essence rather than automatically duplicate it. Rank 1 frost could have exactly the same property as Everfrost; the distinction is persistence of identity, not a new ability. Rank 1 components risk permanent exhaustion, while Rank 2 components may be rechargeable. Exact depletion, consumption, containment and replenishment mechanics remain open.

#### Properties, effectiveness and knowledge

Drop universal potency as an essence characteristic or rank criterion. Effectiveness is application-specific: temperature, heat output, efficiency, reinforcement, affected volume, soul injury, etc. Candidate descriptors are rank, element, properties, energy capacity and saturation (filled fraction). Higher rank generally permits greater scope of expression, but not superiority in every property. A gentle higher-rank flame need not be hotter than a lower-rank combat flame. Interaction with a property domain may still be required for handling/refinement; exact gates remain open.

Separate actual rank and properties from identified characteristics. A cultivator may mistake a soul-burning flame for a mediocre thermal flame because they cannot perceive soul damage; a specialist may recognize its value. A depleted Rank 2 essence might be mistaken for Rank 1. Appraisal depends on knowledge, perception, specialization and cultivation; it need not reveal everything. Misidentification can create economic opportunities and mistakes for NPCs and players alike. Do not infer rank solely from an exotic property or apparent damage. Soul-burning flame is hypothetical, not a new roster entry or a settled low-rank access rule.

#### Immortal essence / awakened life — parked lore opportunity

An Immortal essence might become an independent living being, potentially a unique character who was never a mortal cultivator or demon beast. A long-existing essence could be newly conscious. Ascension of the essence and birth of a soul may be separate or simultaneous. Heavenly tribulation is the working direction, analogous to immortal ascension and high treasures/pills; whether every Immortal essence awakens, only some do, or one unprecedented example exists is unresolved. Possible outcomes include destruction, regression, successful material ascension and awakening. A soul emerging during tribulation and a first conscious desire to survive are illustrative possibilities only.

Open: when consciousness first becomes possible; whether a soul is generated, bestowed or catalysed; what happens if ascension succeeds but soul formation fails; whether awakened essences cultivate, reincarnate or fall under immortal usage restrictions; how refinement affects essence identity; whether human form is possible. No new species, character, cultivation path or cosmology rule is canonized here. Defer ranks 5–8 and these questions until realm/soul/cosmology review. No implementation authorized.

### Demon cores — material roster completion

Use a generic Demon Core lineage indexed by beast rank (1–9 supported conceptually), with elemental, species-specific and bloodline variants deferred. Core rank corresponds to the source beast's realm; concentrated spiritual energy is the proposed baseline use across cultivation, alchemy, formations and artefacts. Exact display names, energy properties and core anatomy remain open. **Rank 1 core eligibility is unresolved:** subsequent beast discussion establishes Rank 1 Ferocious Beasts and Rank 2+ Demon Beasts, so do not assume ferocious beasts possess or drop cores. Preserve the generic lineage without requiring every rank to be obtainable. Reconcile the existing Demon Core ID before migration. Other internal organs and special drops deferred. See [Beast ecology and regional encounters](beast-ecology-and-encounters.md).

Initial material-family roster pass is complete. Next material-specific design work is the shared property vocabulary and existing registry audit; no implementation or balance changes approved by this checkpoint.


## Beast material and combat follow-up

See [beast ecology and regional encounters](beast-ecology-and-encounters.md) for the latest development and encounter checkpoint. Species develop uniformly across tissues; inherent species physiology determines relative properties, rank determines baseline material rank. This supersedes earlier nonuniform tissue-rank speculation. Core formation tentatively deferred to Rank 3; generic Demon Core lineage does not imply Rank 1 or 2 drops. Exact core anatomy and eligibility remain open.

Shared physical properties should support forged equipment, natural armour and body refinement. Distinguish intrinsic material properties from effective protection of constructed objects, abstracting geometry through patterns where useful. Hardness, toughness, strength, stiffness and density remain candidates; no numerical scale or formula approved. Avoid precise penetration depth, anatomical trajectories or a combat overhaul as prerequisites. Successful penetration should be meaningful even against large beasts. Deflection, penetration and blunt force transfer are candidate outcomes, with armour damage where appropriate. Preserve existing combat architecture; the [reaction sandbox](combat-reaction-sandbox-prototype.md) is isolated and not a required migration. Persistent encounters belong to world simulation rather than material resolution.


## November follow-up — material values, cultivator benchmarks and accessible forging

Latest owner discussion supersedes earlier generic beast loot and exhaustive universal property proposals. Design only; no implementation or balance changes.

### Material identity and reference scale
- Prefer species-specific beast loot now that hunting individual species is meaningful rather than mob farming. Species properties and geographic availability should survive harvesting; travel, hunting, acquisition time and lifespan create meaningful crafting/refinement opportunity costs. Exact roster, stacking and migration open. See beast ecology document.
- Ordinary iron is the physical reference: 10 in each baseline physical property, not a maximum or percentage. Numerical values on a common cross-rank scale should make comparisons intelligible. Initial mundane roster generally should not exceed Rank 2 counterparts; exceptional narrow overlaps remain possible, not required. Material rank means realm-equivalent usefulness/capability, not a universal transformation mechanism. Spirit Iron saturation is one lineage's advancement route.
- Experimental six-property examples (NOT approved balance): hardness/toughness/strength/stiffness/density/resilience respectively Iron 10/10/10/10/10/10; Blackiron 17/5/14/15/16/5; Silversteel 7/18/12/7/6/20; Ironscale scales 15/12/14/12/8/8. These predate simplification; do not implement the six-stat table or infer a rank multiplier. Next discussion assigns actual material values using reduced schema.
- Sharpness belongs to finished weapon, not raw material; hardness contributes to edge potential/retention. Penetration depends on weapon, attack and wielder, not sharpness alone.

### Cultivator benchmarks (working lore, not combat formulas)
- Average peak QC can punch through an ordinary brick wall with active Qi reinforcement; unlikely with flesh alone. Can substantially dent ordinary iron armour with a reinforced punch, but not punch through it. Blunt injury through armour remains possible. Ordinary mortal weapons/armour remain relevant. Peak QC can be swamped/exhausted by militia and cannot defeat a mortal army alone; numbers, preparation and attrition matter.
- Early FE may punch through a brick wall using passively reinforced physique alone. Ordinary mortal sword swung by mortal generally cannot cut unguarded early FE flesh; mid QC with Qi-reinforced sword probably can. Early QC uncertain. Late/peak QC severity and FE iron-armour penetration not settled. Do not turn examples into guaranteed hits or exact damage thresholds.
- Body path inherent physical properties are always present: no guarded/unguarded multiplier on intrinsic durability, no attention or energy required. Active techniques can add protection. Qi path passive defence is a fraction of active potential (owner illustrative 20–30%, not universal formula). Sleeping/exhausted body cultivator retains inherent tissue properties. Peak External Tempering brick-wall feat and comparison to early FE durability were proposed, not locked.
- QC externalisation not explicitly settled in reviewed QC/FE/manual docs. Proposed limited QC coating/release, FE controlled circulation/projection; FE meridian wiring already established. Exact unlocks open.
- Stage terminology reconsideration: existing QC doc has optional Peak and Late breakthrough eligibility. Owner considering ordinary reachable Peak and exceptional beyond-ceiling Extremity instead of optional talented Peak; Late breakthrough availability and requirements remain open. No stage-system change authorized.

### Simplified property model and forging experience
- Distinguish underlying world principles, mechanical representation and player-facing information. Not every lore phenomenon needs a simulated variable, and not every variable needs display.
- Starting universal property candidates: hardness (cutting potential/resistance), toughness (damage/fracture resistance), density (weight/impact), Qi affinity (spiritual reinforcement effectiveness). Strength, stiffness, resilience and detailed conductivity/capacity/retention/stability remain explanatory or specialized where useful, not mandatory universal stats. Elasticity, heat retention, Qi storage and other distinctive properties can be material-specific. Exact schema and values pending.
- Basic forging should be accessible and produce roughly the intended result; optional deep optimization through composition, processing, purity, inscriptions, sourcing and cross-profession work. Diminishing returns toward perfection proposed, no percentages locked. Optimize for wielder/purpose, not universal best weapon. Avoid mandatory micromanagement or class-locked weapon scaling.
- Weapon performance emerges from material, construction/pattern, craftsmanship and wielder. Strength relative to weight affects handling; physical force/speed, mass and striking characteristics affect contact; Qi output and affinity affect spiritual performance. Strength can aid acceleration and speed can aid impact. No arbitrary weapon-type strength/agility multipliers or class weapons. Show useful performance in the player's hands where practical.
- Do not introduce a separate structural-integrity scaling cap that makes strong body cultivators break weapons merely by swinging them. Toughness can govern physical damage on contact. Low-rank weapons become less effective against durable opponents but remain useful against weaker ones; no forced symmetry between paths.

### Qi reinforcement and spiritual limits
- Most materials receive external Qi coating; naturally conductive/peculiar materials or inscriptions can support internal circulation. Inscriptions can act like artificial pathways. Internal circulation can improve structural durability and support coating efficiency/stability; exact effects unresolved. Prefer efficiency/usable reinforcement rather than multiple exposed multipliers. Preserve inherent material identity; no automatic increase to every physical property.
- Abstract ordinary equipment interaction primarily into Qi affinity plus safe reinforcement limit (derived rather than necessarily separate displayed material stat). Specialized storage/transmission/resistance can exist when relevant. No mandatory four-stat spiritual engineering simulation.
- Saturation can be gentle infusion over time, distinct from rapid active Qi supply. A high-rank cultivator can control output to use a lower-rank weapon safely; default reinforcement capped by equipment's ability to accommodate it, not accidental destruction. Lower rank restricts effective output. No universal rank multiplier or exact cap formula settled.
- Deliberate spiritual overload/self-detonation is a parked artefact idea, not default equipment behavior. Ordinary weapon destruction need not yield meaningful explosive attack; spiritual treasures and purpose-built artefacts may differ. Contact/remote activation, risk, damage and mechanics unresolved; defer to artefact/inscription pass.

Next: assign experimental physical and Qi affinity values for starting materials using iron reference and these benchmarks; test meaningful differences before expanding scope. Reconcile existing equipment tier/grade and registries before implementation. No code changes authorized.


## November 19 checkpoint — mundane metals, penetration and basic Qi reinforcement

Owner-approved design direction and initial testing values; not production balance or implementation authorization. This section supersedes earlier experimental six-property tables and unresolved basic reinforcement proposals. Numerical combat outcomes remain targets, not calculated results.

### Rank 1 (Mundane) metals — initial test roster

| Material | Hardness | Toughness | Density | Qi affinity |
|---|---:|---:|---:|---:|
| Iron | 10 | 10 | 10 | 10 |
| Copper | 4 | 12 | 11.4 | 15 |
| Blackiron | 22 | 8 | 16 | 8 |
| Silversteel | 7 | 18 | 6 | 10 |
| Redvein | 8 | 10 | 12 | 12 |

- Iron is the reference across all four properties, abundant, cheap, reliable and versatile. Scale is not a percentage or necessarily a linear combat multiplier.
- Copper: common, malleable, good Qi conduction/affinity; artefacts, formation inlays and support components rather than primary cutting weapons. Same volume weighs about 14% more than iron.
- Blackiron: naturally hard, dense and relatively brittle, not a product of Qi or inscriptions. Semi-rare/uncommon, moderately pricey, a meaningful upgrade with downsides, not wealthy-exclusive. Aspirational for ordinary mortals, accessible to established QC; full armour costs more material than a sword. Raw 3–5x iron price was suggested, not approved. Average passive peak QC should not routinely break a Blackiron sword; exceptional stress can.
- Silversteel: light (60% iron mass for equal volume), tough, elastic, softer edge; flexible armour, bows, springs, machinery and siege engines. Uncommon with strong institutional demand from smaller cities and mortal/low-rank armies; may cost more than Blackiron. No fixed price.
- Redvein: exceptional heat absorption, retention AND resistance to heat-induced deformation; furnace and cauldron metal. Relatively rare, likely rarest of these five, premium demand from alchemists/smiths makes ordinary weapons economically unattractive, not forbidden. Fire-aligned weapon applications possible, not established. Reconcile existing Redvein Chip. Thermal values deferred.
- Processing difficulty is explicitly parked: later a common raw material could be extremely difficult to work, causing large raw-to-finished price differences (specialist smith, equipment, treatment). No current processing premium, recipes, prices or rarity rates approved.

### Physical resolution and equipment condition

Hardness resists indentation/local deformation and supports edge retention; toughness resists fracture/tearing; density determines mass given geometry, not direct damage. Strength relative to mass affects acceleration, handling and recovery; momentum/impact depend on motion and contact. Elasticity and thermal properties are specialized, not new universal stats. Finished object construction, thickness, geometry and processing matter; material properties are not object combat stats.

Player-facing vocabulary: Pierce Power, Cut Power, Impact Power and corresponding Pierce Resist, Cut Resist, Impact Resist. Use relevant attack channel; stopped penetration may transfer residual blunt impact. Armour can remain intact while wearer suffers blunt injury. Hardness alone is not impact resistance. Skin/scales and flesh/internal resilience can be abstracted as layers; no precise organ trajectories required.

Penetration depends on physical attack intensity, point/edge geometry, ability to maintain that geometry and target resistance (hardness, toughness, thickness/construction). Weapon hardness gives diminishing benefits once sufficiently hard relative to target; no raw hardness multiplier to damage against soft flesh. Soft armour can resist cutting/penetration through tough fibres, stretching and resistance to tearing. Hard plate is legitimately excellent direct physical protection; do not artificially weaken it against cuts. Soft armour offers flexibility, coverage, low weight, padding where present and material-specific spiritual properties. Inner garments under outer armour are desirable as a possible layering model; built-in linings contribute to armour impact protection. Sequential vs combined resistance, slots and coverage mechanics remain open. High-rank silk may outperform lower-rank plate. Extremely dense high-rank metals may make heavy armour practical chiefly for body cultivators; no class restrictions, density does not automatically imply durability. Availability, strength, mobility, Qi expenditure and peculiar properties determine choices.

No routine durability tax or hidden wear accumulation below tolerance. Exceptional contact stress can cause edge/tip damage (reduces cut/pierce effectiveness), deformation (handling), structural cracks (reduced tolerance), or breakage (unusable). Severity abstraction, direct severe damage possible; no tracking exact bend angles, repeated loss of same tip or accidental straightening. Repair/reforge details deferred. Copper tends to deform, Blackiron chip/fracture, Silversteel resist fracture but softer edge. No ordinary rust/age wear planned. Contact stress depends on attack power, contact type, target resistance/support/displacement; successful penetration may relieve stress. Hard target gently poked does not automatically break weapon. Separate deformation and fracture tolerance candidates; no formula or thresholds beyond reference below. No dedicated sword-clash system required; potential reaction sandbox contact later.

### Physical reference tests (working targets)

Reference A: healthy mortal full-strength swing with ordinary iron sword against rigidly supported iron plate: contact stress 5, sword damage threshold 10. Passive peak QC same reference stress 15–20 (3–4x contact stress, not direct strength multiplier). No active Qi. Exact plate thickness, geometry, thresholds and active values unresolved. Earlier illustrative material-specific deformation/fracture numbers are superseded; penetration changes contact stress, so resolve penetration before calibrating equipment damage.

Reference B: identical competent sword patterns, centre thrust against rigidly supported ordinary iron plate armour, no active Qi. Different test from A.

| Attacker | Iron sword | Blackiron sword |
|---|---|---|
| Mortal | Scratches | Scratches/minor dent, no penetration |
| Early QC | Minor dent | Significant dent |
| Mid QC | Significant dent | Partial penetration possible |
| Late QC | Partial penetration | Likely full penetration |
| Peak QC | Partial penetration, full possible | Reliable full penetration |

Owner anchors: mortal Blackiron cannot pierce ordinary iron armour; exhausted mid QC with Blackiron should still harm a mortal in iron armour; passive peak QC Blackiron reliably penetrates iron armour. Peak QC iron may penetrate if point survives, not reliably. Intermediate rows are proposed tuning targets. Partial breach may wound with reduced residual power; stopped attack can cause blunt trauma. No fixed Pierce Power/Resist formula or numbers approved. Earlier illustrative power/efficiency tables are not final.

Passive peak QC with unreinforced Blackiron also provisionally breaches basic density-1 Qi armour, with reduced remaining power. Same sword against unreinforced Blackiron armour: significant local damage/possible cracking, not reliable penetration (working target accepted for now). Internally reinforced iron sword in mortal hands still cannot reliably puncture iron armour; reinforcement alone does not supply physical force. Passive peak QC with reinforced iron should reliably penetrate iron armour (proposed). Against Blackiron armour, reinforced iron or ordinary Blackiron partial penetration possible, reinforced Blackiron full penetration possible; these are illustrative, not guaranteed or calculated. Armour can itself be internally reinforced.

### Qi foundations and cultivation progression

Ordinary unaligned Qi can exert physical force, but is not inherently sharp. Quantity/reserves, density, purity, control and cultivation structure are distinct. QC is accumulation: equal density/purity and equivalent applied coating/infusion give equal immediate protection, regardless of Early vs Peak reservoir size. Peak has more Qi to sustain use; passive physique, deliberate refinement of Qi, control, techniques, experience, equipment and wealth can create a large actual power gap. Do not make peak merely marginally stronger socially or mechanically; even poorly equipped peak should be formidable. No automatic large per-unit Qi strength increase just from QC stage. Baseline density 1, ordinary/low-average purity (exact purity scale open). FE meridian/foundation structure permits much better circulation/externalisation without requiring drastically different Qi. QC externalisation limited, FE easier; exact unlocks/output limits unresolved. Basic bodily reinforcement acceptable; limited inefficient physical augmentation more toward peak QC, not a generic large offensive multiplier. Qi can supplement muscular force; sophisticated augmentation generally technique-based. Techniques are refined skills exploiting underlying principles, not arbitrary new magic.

Qi nature vs manipulation: inherently sharp Sword Qi could make simple coating cutting; ordinary Qi requires a technique to concentrate/shape a cutting edge. Sword cultivators can still benefit from those techniques. Not exclusive access to sword techniques. Thick ordinary coating may blunt effective edge; exact geometry and offensive effects open. Reconcile inherent nature acquisition with existing FE nature stamp/manual lore; no new QC nature unlock approved.

External basic Qi armour resists direct contact/penetration but momentum can transfer (knockback/impact); defensive techniques can absorb, distribute or redirect kinetic force. Ordinary mortal iron weapons reliably stopped by basic active density-1 coating even at early QC; mortal Blackiron likely stopped too (proposed), passive early QC thrust stopped (proposed), passive peak QC Blackiron can breach (accepted provisional). Equivalent coating strength at equal applied Qi quality, not equal endurance. Early QC can exhaust quickly; militia attrition remains meaningful. Exact coating strength, coverage, activation, cost, output and impact transfer unresolved.

### Internal reinforcement — agreed baseline

Qi permeating compatible material resists deformation/displacement of the space it occupies (hydraulic-like analogy, not literal outward pressure simulation). It supplements structural resistance; material remains contact surface. Basic reinforcement adds equally to effective hardness and toughness, does not change density, intrinsic composition, sharpness or directly add attack power. Better point retention may improve actual penetration under stress. No direct damage bonus against soft targets where weapon already maintains geometry.

Initial test value: **+10 effective hardness and +10 effective toughness** for full ordinary density-1 baseline reinforcement at average purity, assuming compatible material and equivalent achieved reinforcement. Iron 20/20, Copper 14/22, Blackiron 32/18, Silversteel 17/28, Redvein 18/20 if equally reinforced. Not a universal guarantee that every material can accept this amount; capacity/compatibility and exact scaling remain open. Additive baseline chosen for simplicity; inscriptions may improve organization/efficiency or produce multiplicative/specialized effects later. No inscription formula approved.

Qi affinity primarily determines ease/efficiency of infusion and cost of equivalent reinforcement. Capacity/safe reinforcement limit constrains instantaneous strength; retention governs dissipation. Keep affinity universal, capacity/retention derived or special where useful, not mandatory exposed stats. Large dantian reserve cannot make a small weapon pool withstand arbitrary single impact. Qi flows from dantian into weapon, like pool to kiddy pool. Qi is consumed when doing work resisting physical stress; negligible consumption for easy contacts, more for demanding ones, reinforcement can be overwhelmed. Automatically replenish while connected, no manual topping-up combat chore; enable/disable is candidate UI. Exhaustion prevents replenishment. Slow natural dissipation when disconnected accepted; ordinary combat should not require micromanagement. Exceptional retention can last centuries/millennia. Distinguish temporary reinforcement from permanent material saturation/advancement; exact relation open.

Lore opportunity (owner suggested): ancient sword in Celestial Sword Sect slowly leaking ancient Sword Qi for young disciples to comprehend. Exceptional retention and dense stored Qi explain persistence; finite inheritance, replenishing with another cultivator's Qi may not reproduce original qualities. Exact sword, owner, age, access, comprehension mechanics and danger not canonized.

### Practical next steps

Five mundane metals now have initial test values. Next roster pass: Ironwood, Springwood, Cloudwood, Incensewood, Stillwood. Prefer simple values and distinct identities; do not reopen exhaustive theory for each material. Small isolated material-combat sandbox suggested to test reference outcomes before committing formulas or production migration; not yet authorized to implement. Resolve penetration, then contact stress/tolerance and Qi effects against reference tests; tune numbers rather than overdesign. Preserve existing combat architecture, audit registry/equipment tier/grade and cultivation lore before implementation. No gameplay code, price changes, schema migration or merge authorized by this checkpoint.


## 2026-11-19 checkpoint — mundane woods, fibres, hides and bones

All numbers are initial playtest targets, not production balance. Columns H/T/D/Q are hardness, toughness, density and Qi affinity, iron remains 10/10/10/10. Density compares equal-volume mass, not finished equipment weight. No forced weaknesses or unique niches: later materials may overlap substantially; local availability, production, price and processing matter. This is a starting roster, not an exhaustive catalogue.

### Woods — ordinary mature Rank 1 specimens

| Material | H | T | D | Q |
|---|---:|---:|---:|---:|
| Ironwood | 10 | 9 | 3 | 8 |
| Springwood | 3 | 14 | 1.5 | 8 |
| Cloudwood | 1 | 3 | 0.4 | 12 |
| Incensewood | 2 | 4 | 1.2 | 10 |
| Stillwood | 6 | 3 | 2 | 10 |

- Ironwood: mature mundane wood as hard as iron, lighter, less suited to mass-dependent heavy hits; no additional toughness penalty needed before tests. Older specimens can become much harder.
- Spiritual environment/nourishment determines attainable lifespan of trees; growth beyond ordinary lifespan requires sufficient spiritual resources. Age is a useful quality indicator rather than a separate independent spiritual exposure progression. Exact age bands, ceilings, growth rates and higher-rank values deferred.
- Springwood: exceptional elasticity, relatively common compared with Silversteel, typical QC archer bow material; flexible shafts, springs and mechanisms. Other woods and metals may overlap these applications.
- Cloudwood: light, porous, absorbent; candidate treatment/infusion medium, lightweight artefact components. Absorption is not automatically Qi retention. Highly provisional, potentially substantial changes once actual treatments, artefacts and absorption uses exist.
- Incensewood: aromatic oils/resins, incense, alchemy, fragrant furnishings; calming/concentration aid proposed, not a fixed cultivation bonus. Rebalance after alchemy/meditation/cultivation aids mature.
- Stillwood: exceptional dimensional stability (resists warping/swelling), relatively brittle; candidate formation plates and precision components. Revisit once formation mechanics establish what it actually contributes; no automatic Qi affinity bonus.

### Fibres — initial targets

| Material | H | T | D | Q | Tensile strength (qualitative) |
|---|---:|---:|---:|---:|---|
| Hemp | 0.5 | 8 | 1.9 | 3 | Moderate |
| Silk | 0.5 | 12 | 1.7 | 10 | High |
| Cloudfloss | 0.1 | 2 | 0.8 | 5 | Low |
| Veinthread | 0.5 | 6 | 1.5 | 18 | Moderate |
| Ironscale Sinew | 1 | 18 | 1.8 | 5 | Very high |
| Ashfang Sinew | 0.5 | 16 | 1.5 | 10 | High |

- Hemp cheap abundant general clothing, rope, bindings. Silk baseline mundane silkworm product, smoother, stronger, better Qi affinity; limited production and price justify advantages. Spiritual species and higher ranks later.
- Cloudfloss common fluffy plant fibre, compressibility/recovery, padding and insulation, impact cushioning under hard armour rather than primary woven protection.
- Veinthread efficiently transports Qi along its length; embroidery, flexible inscriptions/formation connections and reinforcement pathways, analogous to conductive copper inlay. Uncommon, small quantities potentially sufficient. Natural vascular fibre versus processed/manufactured thread origin undecided. Revisit with formations/inscriptions.
- Species-specific sinews replace generic Beast Sinew as actual loot/material identity. Ironscale transmits large muscular forces, very high tensile strength, moderate elasticity; Ashfang suited to agile repeated loading, high elasticity, higher Qi affinity. Revised values are working proposals, exact bow performance deferred. No need for every beast part to have a supernatural property. Anatomy/lifestyle can make a physically weaker beast superior in a particular application.
- Supplementary elasticity abstracts stretch, recovery and useful elastic recoil/energy return for game purposes; do not add separate extensibility/resilience stats merely for terminology. Tensile strength is supplementary for now, not a fifth mandatory universal stat; numerical scale deferred.

### Construction and intuitive crafting

Keep material properties separate from finished equipment performance. A fibre, rope, woven robe and layered armour exploit the same material differently. Hardness resists local deformation; toughness covers material failure/energy absorption including tearing; tensile strength resists pulling stress. Tensile strength contributes to slash resistance through load sharing and resisting rupture, but cannot by itself prevent a sharp edge severing fibres. Weave/construction controls load distribution and separation, layering/thickness and geometry. No per-fibre or thread-count simulation required.

Direction of influence, not coefficients: woven armour hardness minor, toughness major, tensile strength significant; plate hardness/toughness major, tensile minor; bowstring tensile major, toughness moderate, hardness negligible. Density affects mass. Earlier illustrative 10/50/40 slash weighting is NOT approved; a simple weighted sum may overvalue tensile strength when fibres sever easily. Derive/tune construction-specific mappings from outcomes in sandbox; no final formula. Keep same combat principles across families, no artificial damage-type weaknesses.

Owner anchors: mortal iron sword cuts ordinary hemp robe and even Rank 1 spiritual silk robe; higher-rank fibres may stop mortal iron sword. Purpose-built layered armour can outperform a thin robe of same material. Multilayer hemp significant resistance but possibly breached; Rank 1 spiritual silk armour potentially stops blade are proposed tests, not settled outcomes. Stopped blade may still transfer blunt force. Ordinary silk is not automatically spiritual silk armour.

Crafting UI should teach through hands-on selection, intuitive material descriptions and finished-equipment previews (cut/pierce/impact resistance etc.), not lengthy compulsory tutorials or requiring material science knowledge. Experienced players can learn property interactions and optimize. No fixed preview values/UI implementation approved.

### Hides — agreed initial targets

| Material | H | T | D | Q |
|---|---:|---:|---:|---:|
| Ordinary Hide | 2 | 10 | 1.3 | 5 |
| Ashfang Hide | 3 | 16 | 1.5 | 10 |
| Ironscale Hide | 4 | 18 | 2 | 5 |

Ordinary hide cheap and versatile; tanning/treatment distinguishes soft leather and hardened armour. Ashfang flexible tough spiritually receptive, desirable mobile QC equipment. Mortal iron sword can cut Ashfang hide; deeper muscle/bone and active hostile beast still matter. Ironscale has skin under its mineral-like protective scales; values exclude scales. Candidate processing routes separate scales and hide, or preserve scales intact for naturally armoured leather. Exact harvesting yields, anatomy and processing mechanics open.

### Bones — working targets

| Material | H | T | D | Q |
|---|---:|---:|---:|---:|
| Ordinary Bone | 5 | 4 | 2.5 | 5 |
| Ashfang Bone | 8 | 8 | 3 | 10 |
| Ironscale Bone | 14 | 12 | 5 | 5 |

Ordinary bone relatively brittle, handles/tools/decorative uses. Ashfang lightweight more durable and spiritually receptive. Ironscale supports heavy scales/powerful muscles; harder and tougher than iron at half equal-volume mass is acceptable as working target, limited by harvesting, irregular geometry, processing and price. Bone daggers possible. No assumption all Ironscale tissues must outperform Ashfang. Lone Ironscale considerably more threatening than lone Ashfang; pack cooperation is Ashfang's strength. See beast ecology checkpoint. Price/yield comparisons not fixed.

Next: scales, then remaining skeletal candidates (horn/shell as appropriate), continue roster. Exact resistance equations, numerical tensile/elasticity, higher-rank values, processing, economy and gameplay implementation remain deferred. No code or merge authorized.

## 2026-11-20 checkpoint — crystals, botanicals and Dustbone ecology (design only)

This records owner-reviewed conversation direction, **not implemented gameplay, fixed recipes, economics, ecology or formulas**. The four universal material stats H/T/D/Q remain an initial playtest scale (iron = 10/10/10/10). Botanical medicinal properties need not receive arbitrary hardness/tensile balance. One useful harvestable material/part per botanical for now; flavourful other plant anatomy does not generate separate inventory items.

### Material-rank terminology and lineage

Replace provisional material rank 8 **Law** with **Empyrean** and rank 9 **Immortal** with **Transcendent**. Full path-neutral material ladder: Mundane, Tempered, Treasure, Spiritual, Celestial, Silent, Dao, Empyrean, Transcendent. Rank is not necessarily in a material's name. Material lineage/variety, rank, rarity, origin and advancement potential are distinct. Baseline jade varieties can exist across ranks without implying any individual mundane jade specimen can simply be cultivated to Rank 9. Some materials have low natural ceilings or originate at higher ranks. Do not require nine variants of every material.

### Additional Rank 1 mineral and scale targets

| Material | H | T | D | Q | Identity |
|---|---:|---:|---:|---:|---|
| Ironscale Scale | 18 | 14 | 6 | 5 | Tough hard lightweight natural armour; harvested shape/coverage limits |
| Granite | 14 | 3 | 3.5 | 3 | Abundant hard brittle construction stone, mortars/grinding, basic formation supports |
| Fireclay (fired) | 5 | 2 | 2.8 | 5 | Raw malleable, fired heat-resistant/insulating furnace/crucible/cauldron lining |
| Jade | 12 | 9 | 4 | 15 | Tough spiritually receptive carvings, slips, tokens, plates, artefacts |
| Hollowstone | 8 | 4 | 0.8 | 5 | Porous lightweight vibration damping, insulation/housings; assassin boot lining candidate |
| Limestone | 4 | 2 | 3 | 2 | Cheap abundant bulk building, mortar/plaster/flux and other processing possibilities |

Ironscale scales can stop a mortal iron sword and a passive peak-QC swing with an unreinforced iron sword; the weapon may deform, blunt or fail under sufficient force. This is a benchmark, not a universal penetration formula. Armour coverage and gaps are equipment-level abstractions deferred to combat/equipment. Horn/shell material families wait for species that actually have them. Fireclay thermal and Redvein heat-absorption/retention distinction remains qualitative. Hollowstone industrial and equipment roles are provisional. Jade is reasonably accessible, not inherently a rare luxury.

### Rank 1 crystals — working values

| Material | H | T | D | Q | Defining identity |
|---|---:|---:|---:|---:|---|
| Clear Quartz | 15 | 2 | 3.4 | 12 | Cheap predictable Qi transmission; reliable formation node, brittle |
| Echo Crystal | 10 | 3 | 3 | 15 | Selective Qi-pattern/signature resonance, sensing, identification, signalling and relay |
| Sun Crystal | 12 | 3 | 3.5 | 10 | Absorbs **light-aspected Qi**, converting spiritual energy to heat; not extraordinary ordinary-light absorption |
| Dusk Crystal | 10 | 3 | 3.8 | 8 | Obstructs **spiritual perception**, not necessarily ordinary Qi passage or ordinary eyesight |
| Spirit Stone (saturated) | 8 | 3 | 3 | 20 | High-Qi-storage currency/cultivation/formation/artefact energy resource |

Echo Crystal relay possibilities: passive resonance with propagation/response delay and losses; powered relays reproduce a detected signal using local Qi, not free amplification. Exact Qi-wave physics, inscription dependency, timing and range deferred. Clear Quartz transmission versus copper conduction requires later formation design.

Sun Crystal does not consume ambient visible light or make ordinary objects dark. Light-aspected Qi supply is a dependency; heat utility and relation to existing **Sun Stone** alchemical reagent need later reconciliation. Higher-rank optical effects are only a possibility, not canon.

Dusk Crystal spiritual opacity is separate from Qi affinity/transmission and does not necessarily hide its own presence. Its obstruction can be noticed as a blind spot and potentially overcome by powerful spiritual senses; exact perception mechanics deferred. **Dusk Crystal deposits may be difficult to find precisely because spiritual searching fails**, affecting discoverability/market supply independently of geological abundance. Concealment cloak or formation combining Dusk Crystal and Glowcap-derived Yin ink/treatment is a **speculative example, not a recipe**; powdered-crystal efficacy, concealment inscriptions, and visual invisibility not established.

Spirit Stone's **crystalline integrity depends on contained Qi**. As Qi is depleted, its structure weakens and ultimately crumbles into spiritually inert dust; completely spent stones cannot be simply recharged as intact empty batteries. Partial recharge, depletion curves, purity and production mechanics unresolved. Initial H/T/D/Q apply to saturated stone; physical properties can degrade with depletion.

### Botanical philosophy

Botanicals have inherent properties rather than fixed one-to-one pill recipes. Most have some mild raw effect when eaten/used, varying by species and dosage; processing can extract, concentrate, refine, stabilize or combine properties, and can also damage/destroy delicate properties. Some future botanicals may be toxic raw but valuable after correct processing. Raw consumption can be useful yet inefficient compared with competent alchemy (not fixed percentages). Overlapping properties between plants are normal. Distinguish actual properties from what characters/alchemists know how to exploit; discovery and experimentation matter. One harvested item/part per botanical for now. No per-leaf wound calculations, herb cellular biology or guaranteed rank-based medicinal multipliers.

| Botanical | Working rank / supply | One harvested part | Identity and applications |
|---|---|---|---|
| Dust Root | Rank 1, common | Deep root | Modest, somewhat impure Qi nourishment and alchemical binder; hardy Dustbone dust adaptation |
| Saltbrush Tip | Rank 1, common | Young shoot/tip | Mild purification, clears muddy Qi and moderates mineral impurities; living shrubs subtly freshen nearby air |
| Marrow Thistle | Rank 1 typically, uncommon | Thistles from thorny bush | **Bone and marrow nourishment**, secondary inefficient bone repair; ground/processed |
| Glowcap | Rank 1, uncommon | Mushroom cap | Mild **stable Yin-aspected Qi**, suitable alchemical stabilizer/Yin reagent; minor bodily stabilization side effect, possible talisman/formation ink |
| Clot Moss | Rank 1, regionally common | Moss | Mild blood clotting and replenishment; raw may help small cuts, not life-threatening sword wounds |
| Skinmend Leaf | Rank 1, provisionally common | Leaf | Noticeably speeds natural flesh/soft-tissue healing with sustained sufficient treatment; not instantaneous regeneration |
| Foundation Root | Rank 1, rare; likely Rank 2 natural ceiling | Root | Considerable quantity of **clean, readily assimilated Qi**, released steadily so cultivator can organize intake; valuable raw but inefficient compared with alchemical refinement |
| Amber Lily | Rank 1, rarity/ceiling open | Flower | Freshwater **water lily**; flesh nourishment, body-cultivation support and mild Qi/recovery side effects, distinct emphasis from wound-repair Skinmend |

Dust Root: deep roots reach buried viable soil/moisture through accumulated dust. Dustbone is **not inherently a conventional desert**: the land is blanketed by dust from past civilizations, with potentially varied depths and three established dust layers of as-yet-undefined properties. Its current aridity and scattered habitable pockets are consequences of this history. Oases/settlements may arise through shallow deposits, excavation, deep wells and continuing maintenance; **all explanations provisional** pending three dynasties' scale, chronology, dust mechanics and geography. Preserve core image of a continent blanketed by its past without asserting geological details. Vegetation likely concentrated in habitable pockets and surviving patches; Dust Root may occur outside cultivated areas.

Saltbrush's mild freshening effect is an incidental nicety, **not** major quality-of-life infrastructure, miraculous environmental cleansing or a luxury industry. Avoid inventing a dangerous impurity-storage mechanic. Its main value is alchemical.

Marrow Thistle is a thorny perennial bush with somewhat stricter growing conditions, repeatedly harvestable thistles; overharvesting stresses/damages it and can kill it. Most remain Rank 1, likely low natural ceiling. Certain beasts may graze it: an Ironscale Lizard eating an entire bush is a plausible ecology example, not a prescribed encounter or feeding simulator. It primarily nourishes bones, and using it to heal fractures wastes much of its medicinal potential.

Glowcap in Bonehollow Caverns or comparable damp sheltered caverns. Its Yin character should **not** imply rapid Yang-like regeneration; earlier prototype tissue-restoration emphasis is superseded by stable Yin and alchemical usefulness. Minor bodily stabilization is incidental; not universally stabilizing every reaction. Its glow's physical/spiritual cause unresolved.

Clot Moss grows near but not submerged in freshwater, damp banks and shaded ground. Relatively little grows naturally in Dustbone, but **ordinary urban supply can be plentiful and reasonably priced** through bulk imports, city cultivation and scattered wild pockets, with a modest trade premium rather than extreme scarcity. Regional abundance differs from market availability; other materials may follow similar supply patterns. Emberwild as possible botanical exporter only; continental trade networks not designed.

Skinmend Leaf example: a moderate cut that might recover in ~2 days naturally could recover in ~1 day with sufficient **ongoing treatment**, not one leaf or one dose; this is a loose illustration **not** a fixed 50% healing modifier or real-world medical assertion. Severe injury limitations remain. Habitat open.

Foundation Root may be defended by Yao-Qi-leaning beasts. Rank 1 beasts can recognize valuable food/territory without understanding plant maturation or breakthrough theory; more deliberate Rank 2 guarding/harvest timing is possible, not mandatory intelligence or behaviour. Rank 2 Foundation Root may provide substantial useful Qi to an FE cultivator but does **not** intrinsically grant FE breakthrough success. Root's stability is about controlled release, not automatically organizing the user's Qi.

Amber Lily grows in freshwater ponds/lakes/sheltered waterways; one flower harvested. Nourishes **healthy flesh and physical refinement** (especially body cultivators), rather than specifically closing wounds; overlap with other medicinal herbs allowed. Raw effects mild, proper processing can improve usefulness. No fixed farming, scarcity or upper rank.

### Remaining boundaries

Existing Dustbone QC book includes ten reagents (Dust Root, Saltbrush Tip, Dawn Dew, Marrow Thistle, Ironscar Grit, Sun Stone, Redvein Chip, Seep Dew, Glowcap, Bone Marrow Resin). Clot Moss, Skinmend Leaf, Amber Lily and Foundation Root appear in experimental alchemy contexts, not automatically live Dustbone QC additions; preserve its closed-book doctrine until explicit review. Exact botanical spawn tables, cultivation/harvest rates, pricing, recipes, Qi potency, spiritual perception, formations, talismans and economy are deferred. Do not auto-merge this draft PR or implement gameplay.


## 2026-11-21 checkpoint — remaining alchemical materials and Ashcoil Python (design only)

This checkpoint records provisional owner decisions after the 2026-11-20 checkpoint. **No gameplay, recipes, registries, numerical combat formulas, or alchemy prototype have been changed.** Where this section contradicts older provisional examples, use this newer direction. Material H/T/D/Q values are preliminary playtest proposals, not balance approval.

### Silent Bell (previously discussed, not in prior checkpoint)

- Rank 1 flower in deep dark forests/jungles and occasionally caves; harvest the flower as one item.
- Briefly **suppresses or interrupts Qi circulation**; it does not destroy Qi, damage meridians, drain the dantian or inflict spiritual taint. Strong for its rank against QC but naturally **short-lived**.
- External contact (e.g. flowers thrown at a QC face) can briefly disturb circulation; prepared solution delivered into a wound, such as a coated sword, has a more consequential internal effect. Qi techniques/reinforcement may temporarily fail. FE can generally better resist or expel Rank 1 effects; exact mechanics unresolved.
- Alchemy might extend duration with other ingredients without increasing suppressive strength. Detoxification/bloodletting and distribution through blood remain open; do not implement a new spiritual contamination mechanism.

### Sun Stone and higher-ranked Yang Stone

- **Sun Stone is distinct from Sun Crystal.** Sun Crystal converts supplied **light-aspected Qi** into heat; Sun Stone already holds concentrated, somewhat volatile **Yang Qi**. It is a faintly luminous golden-orange mineral, warm to touch; heat/refinement may trigger rapid Yang release. Not intrinsically a sunlight-fed rock.
- Working origin: lower-rank Sun Stones develop near deposits of **higher-ranked Yang Stone**, including underground. Yang Stone's own origin, rank, mechanism (emission versus ambient accumulation) and properties are intentionally deferred. Sun Stone occurrence can hint at deeper Yang Stone deposits, not guarantee accessible ore.
- Retain uncommon local Dustbone/Ironscar alchemy occurrence provisionally; danger/volatility is not itself proof of exceptional rarity. Existing Sunscar Burst Pill is not redesigned.
- **Proposed Rank 1 physical targets:** H12 / T4 / D3.5 / Q12. Distinctive Yang behaviour is not reduced to generic Q.

### Blood Crystal — manufactured rank-dependent material family

- Predominantly **manufactured** by concentrating and purifying **large quantities of blood**; naturally formed crystals are possible only in unusual, non-ordinary circumstances. Source blood quality/rank primarily sets potential; processing and losses matter. Manufacturers usually avoid mixing widely different source ranks to obtain predictable outcomes. Mere volume of low-rank blood should not substitute without limit for high-rank blood.
- Active crystals contain concentrated **blood-related nourishment** for physical/body refinement and healing, plus spiritual energy useful for cultivation. Not just generic red Spirit Stones. Higher-rank Blood Crystal can become a formidable **structural/weapon material**, with physical strength rising markedly, not a universal rank multiplier for all materials.
- **Proposed illustrative H/T/D/Q:** R1 8/3/3/16; R2 18/14/4/20; R3 35/32/5/25. These are conversation proposals only, especially R2/R3.
- Depletion makes a crystal **inert**, removing usable stored energy/active spiritual function but **preserving its inherent physical properties**. Unlike exhausted Spirit Stones, it does not crumble. Ordinary Qi recharging is not established and is provisionally disfavoured. An inert Rank 3 crystal remains a physically strong Rank 3 material.
- Heavenly Demon Cult may manufacture crystals at scale for cultivation, alchemy and formations, then recycle spent crystals into weapons, armour, buildings and infrastructure. This provides an accumulated construction stock without requiring every structure to be made from newly produced active crystals; mass blood extraction remains an intentionally grim feature of the faction. Heavenly Demon's weapon from exceptionally high-rank blood crystal is an evocative possibility, not a defined artefact. Blood essence versus harvested Vital Essence mechanism remains open.

### Spirit Mist (formerly prototype Soul Mist); Soul Mist deferred to ~Rank 4

- Rename low-rank **Soul Mist** to **Spirit Mist** in the future alchemy reconciliation. **Soul Mist** becomes a prospective approximately Rank 4 version, whose higher-rank capabilities are not yet designed. Do not silently rename existing IDs or rewrite recipes without migration review.
- Spirit Mist is **spirit energy condensed into a physically perceptible mist**, comparatively easy to absorb/refine. Its key use is developing the **Spirit Sea**, not an arbitrary 'Spirit-path-only' compatibility bonus. Useful throughout **Sea Opening** and potentially into middle/late **Sea Expansion**, but quantity needed rises enormously as the sea expands; no artificial efficiency cliff.
- Sea Opening establishes/stabilises the sea and early function; Sea Expansion grows it further (working interpretation only). Precise energy mechanics and terminology distinction between 'spirit' and 'spiritual' await Soul/Spirit-path review. Mist containment, dispersal, alchemy and formation uses remain open. Old fixed Yin-heavy identity is **not settled as universal**; aspect variants are possible.
- Earlier essence example roster calling Soul Mist Rank 1 is superseded by this naming/rank direction.

### Ironscar Grit — commercial processed dust

- A **relatively standardised, mineral-rich commercial concentrate** processed from Dustbone dust around Ironscar Quarry. It is a blend, not a unique mineral species. It caught on for cheap, predictable, versatile alchemical use; remains relatively impure and difficult to extract fully.
- Do **not** simulate each constituent, each historical dust layer, or per-batch composition. Region/depth lore may vary but is not a gameplay mandate. It is granular feedstock, so conventional solid-item H/T/D/Q need not be assigned unless a solid product is later created.

### Ashcoil Python, Cinderscale and Cinderscale Flake

- **Ashcoil Python** replaces 'Cinderscale Python' as the species name. It is an **apex Rank 1** massive snake, approximately **30 m long as an ordinary mature adult** (not a unique ancient boss); head may be raised around a standing 6-foot person's height. Naturally sparse population, long reproductive intervals and/or few surviving offspring; large territories. Exact mass, scale size, breeding biology and habitat not fixed.
- Formidable cunning predator: follows traces, stalks humans, chooses ambush opportunities, may withdraw and retry; not sluggish or stupid. Bite threatens through raw crushing/tearing force, alongside constriction, agility for size and tough flexible armour. Even an early FE cultivator with disastrously poor Qi reinforcement (density 1 example) can be in serious danger; do not impose guaranteed rank-vs-rank victories. Fire control or venom **not established**; natural heat resistance is sufficient.
- **Cinderscale** is an intact scale harvested from the python; **Cinderscale Flake** is a shaving/fragment from the same material, with the same intrinsic properties but smaller usable geometry. Both are physically difficult to work; intact scales may be used as protective plates and fitted equipment, flakes may be ground into composite coatings.
- **Proposed Rank 1 Cinderscale H16/T24/D5/Q8**, versus Ironscale Scale H18/T14/D6/Q5: slightly softer, substantially tougher/flexible, with **separate exceptional heat resistance**. Exact heat limits, processing and yield remain open. A mature python yields many scales, but hunting one is rare and extremely dangerous in lower-tier regions.
- **Important prototype correction needed later:** Remove Cinderscale Flake's current direct medicinal/bone-restoration effects and its status as a conventional pill ingredient. Its settled primary use is **heat-resistant crafting**, notably cauldron linings. Intact scales may be fitted as lining plates; flakes may be ground and bound/fired into a uniform ceramic/mineral coating. This is a lore/material process direction, **not yet a designed cauldron-upgrade mechanic**.
- A Cinderscale lining should help a vessel tolerate **higher operating temperatures and resist thermal deterioration**, **not** magically stabilise volatile reagents, reduce Yin–Yang clashes or boost pill purity. If a cauldron already handles the required temperature, flakes should confer no arbitrary alchemy bonus. Avoid inventing extra volatility axes just to justify their presence. Whether the live cauldron system needs higher-temperature equipment limits and how to integrate flakes is a deferred implementation question.
- Ashcoil Python **flesh, blood, bones, organs and other resources** may be harvestable with body-related uses, but are deliberately **not designed** here. No new loot list required.

### Unfinished materials — explicit revisit note

**Bone Marrow Resin, Redvein Chip and Seep Dew still need their own material-specific review.** Do not treat their existing prototype/book descriptions as fully settled. Bone Marrow Resin currently implies dense Qi/essence packing; Redvein Chip is a quarry reagent related to Redvein metal; Seep Dew is a dense carrier distinct from Dawn Dew. Determine actual identity, origin and cross-profession applications later. Keep the existing Dustbone QC book and recipe behaviour intact pending deliberate review.

### Scope and handoff

This is a **design checkpoint only**. Do not modify runtime alchemy, item IDs, save migrations, recipe balance, cauldron behaviour or beast spawns on this PR. Next owner-requested design topic: **a player-founded/personal sect**, as a meeting point of formations, alchemy, NPCs, techniques and construction. Sect design is not defined in this material checkpoint.
