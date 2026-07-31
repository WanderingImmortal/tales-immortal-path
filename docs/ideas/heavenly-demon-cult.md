# Heavenly Demon Cult (天魔教)

| Field | Value |
|-------|-------|
| **Status** | `designed` (v1 — cult + intent hook) |
| **Blocked on** | [`devouring-intent.md`](devouring-intent.md); lineage manual pass |
| **Issue** | none yet |
| **Chat / PR** | Planning chat 2026-07-31 · [`cursor/intent-awakening-devouring-c0d4`](../../) |
| **Updated** | 2026-07-31 |

## Intent

A **hidden orthodox heresy** — not "random evil bandits." The Heavenly Demon Cult teaches that **heaven is a glutton** and the strong **devour** what the weak cannot hold. Their crown art is **Devouring Intent**: consumption as cultivation, not sword-shaped will.

**Continental standing (owner lock 2026-07-31):** **Apex demonic cult** — not a roadside blood sect. Their canon is **refined and perfected** over generations. The cost of the path is **what you do** and **how the world treats you**, not a leaky beginner manual.

**Not the same as:** Chaos Path's *Devourer* (Lu Feng — forced Chaos, cautionary tale). **Not the same as:** walking the Wicked Path (attitude). Cult membership is **doctrine + initiation**, not a corruption slider.

Sister: [`alignment-sacrilege-corruption.md`](alignment-sacrilege-corruption.md) (massacres stain; being blood-aligned ≠ crime), [`technique-driven-cultivation.md`](technique-driven-cultivation.md) (`blood_fiend` nature).

## Design notes

### One-line identity

| Field | Lock |
|-------|------|
| **Display** | Heavenly Demon Cult |
| **Data id** | `heavenly_demon_cult` (suggested) |
| **Standing** | **Apex demonic cult** (continent) — cells are tendrils, gorge is the heart |
| **Dao** | **Devouring Dao** — intake, refinement, hunger without end |
| **Public face** | Rumors, cells, forged merchants; no mountain on the map (v1) |
| **Sacred art** | **Heavenly Demon Canon** (天魔典) — breathing + intent curriculum |
| **Crown intent** | **Devouring Intent** — see [`devouring-intent.md`](devouring-intent.md) |
| **Crown law** | **Devouring Law** — see [`devouring-law.md`](devouring-law.md) |
| **Life ladder** | [`heavenly-demon-cult-life.md`](heavenly-demon-cult-life.md) — template for other sects |

### Doctrine (three sentences players might hear)

1. *Heaven eats the world every epoch — why shouldn't you?*
2. *Qi that enters you and does not become **you** is wasted.*
3. *The blade is a straw. The cultivator is the mouth.*

### What they teach (outer band)

| Benefit | Content |
|---------|---------|
| Layer 1 | Hunger Scripture — breath + outer combat |
| Shelter | Barracks (main) / safehouse bunk (branch, tithe-gated) |
| Pills | Quarterly blood pill pool — **merit winners only** |
| Rivalry | Sanctioned spars + hunt merit — see life ladder doc |

| Layer (inner) | Content |
|-------|---------|
| Initiate | Blood-fiend seal encouraged; Layer 2 |
| Inner demon hall | Devouring Intent awakening rites; tempered relics |
| Apex | Intent Domain as **Bottomless Maw** |

### What they refuse

- Orthodox "harmony" seals presented as weakness
- Sword-only pride (they'll use any tool that feeds the maw)
- Soul-refining that **breaks reincarnation** without cult sanction (that's corruption the ledger cares about — see alignment doc)

### Relationship to existing systems

| System | Cult angle |
|--------|------------|
| `blood_fiend` foundation | **Common** cult seal at FE — identity (killing aura), not a manual defect |
| Blood Refining Art | Outer technique — life steal; not the intent itself |
| Rebellious alignment | Overlaps; cult recruits lean rebellious; not automatic membership |
| Corruption / sacrilege | **Feeding on villages** stains; studying devouring breath in a cell does not |
| Four Heartlands sects | Hunted in public; bounties at friendly rep; Lotus might broker silence for a price |

### Where they live

| Site | Role | Player (v1) |
|------|------|-------------|
| **Gullet Gorge** (咽谷) | **Main cult** — hidden HQ, outer barracks, inner halls, canon archive | Later zone; QC life **better** but still outer |
| **Branch cells** | Redwell, Heartlands safehouses, forged merchants | **v1 contact** — envoy, pamphlet, cell tasks |
| **Field** | Maw-Womb Shard ultra-rare | Spark treasure |

Branches **feed** the gorge (tithes, recruits, eyes). Gorge **does not** protect every branch disciple by name.

### Branch vs main (summary)

- **Same ranks, same Layer 1 canon** — different posting and treatment.
- **Main QC:** drills, barracks, real copy, visible promotion path.
- **Branch QC:** alone in town, expendable, deny-by-default if exposed.
- Both: **no intent**, no inner business, firmly outer until FE.

### NPC sketch (one)

**Envoy of the Third Hunger** — polite, offers a pamphlet that is not in any legal market. Greet: *"You look… unfed. The heavens eat stars. We only ask you eat back."*

## Prerequisites

- [ ] [`devouring-intent.md`](devouring-intent.md) tier + expand table
- [ ] [`weapon-intent-awakening.md`](weapon-intent-awakening.md) deviant spark rules
- [ ] One cult manual id in `CULTIVATION_METHOD_POOL` (forbidden tier)
- [ ] Faction or story `fate: demon_cell` hook (optional v1)

## Open questions

- Map node vs story-only cells for first contact
- Sect join flow vs "found a forbidden manual and fell in"
- Name lock: **Devouring Intent** vs **Blood Devouring Intent** (see devouring doc)

## Implementation crumbs

- `data.js` — factions, forbidden manuals, `FOUNDATION_NATURES.blood_fiend`
- `intent.js` — deviant track (future)
- `alignment-sacrilege-corruption.md` — massacre vs study distinction
