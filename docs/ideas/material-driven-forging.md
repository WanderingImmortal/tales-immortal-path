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
