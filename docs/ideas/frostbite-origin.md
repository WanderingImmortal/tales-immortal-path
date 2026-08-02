# Frostbite — why the North is frozen

| Field | Value |
|-------|-------|
| **Status** | `idea` (owner direction — 2026-08-02) |
| **Blocked on** | Owner picks variant; yin sect + zone lore pass |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chat, 2026-08-02 |
| **Updated** | 2026-08-02 |

**Replaces:** `ZONES.frostbite.lore` line about an immortal’s tribulation freezing the land for ten thousand years — **timeline awkward** and **same skin as Dustbone** (“strong person broke the region”).

Related: [`dustbone-dynasties-entropy-lore.md`](dustbone-dynasties-entropy-lore.md) (contrast), [`frostbite-yin-sect.md`](frostbite-yin-sect.md), [`void-temple-sect.md`](void-temple-sect.md) (pre-heaven containment), [`outer-zone-great-powers.md`](outer-zone-great-powers.md).

## Design sentence

> Dustbone is the **receipt for concentrated order**. Frostbite is the **scar where a pre-heaven cold field still leaks** — not a cultivator’s climax, a **heavenly treasure / containment wound** that never closed.

## Contrast table (avoid rehash)

| | **Dustbone** | **Frostbite** |
|--|--------------|---------------|
| **Cause type** | Completed **local dao** (Law of Dust) + **human order density** | **Pre-heaven object / array** distorting the land |
| **Mechanism** | Threshold cascades when imposed order exceeds basin capacity | Perpetual **yin cold field** — yang and daylight bleed away |
| **Agency** | Dynasties **chose** density (Pinwright exception, walls, registry) | Nobody “won a fight” here — something **was placed or fell**, then **leaked** |
| **Timeline** | Three dynasties — mortal-scale history, still recent tribal memory | **Pre-sect, pre–Dao Wars** — continental ward era or treasure fall |
| **Feel** | Sand = discharge, entropy, receipt | Ice = **unclosed seal**, lightless band, still humming |
| **Living with it** | Stay under threshold; mobile tribes; pin maintenance | Endure, ward the leak, mine the scar — don’t **concentrate yang** in the band |

## What already points this way (code + clues)

| Hook | Text / role |
|------|-------------|
| `frost_sun_never_rises` | “Place where the **sun never rises**” — something **breathes beneath the ice** |
| `frozen_abyss` | “**Sunlight dies**” — rim array still hums with **pre-heaven qi** |
| `Ninefold Frost Array` | Unseal barrier label — containment, not battle scar |
| `frostbound_sage` | Pre-heaven cultivator **frozen mid-enlightenment** — **victim** in the field, not the cause |
| `Pre-Heaven Frost Shard` | Shard of the **array that sealed** the Sage |
| `Sunless Pearl` | Formed in **absolute dark** |

Immortal tribulation as zone origin **fights** this kit — sunless field, array seal, pre-heaven leak.

## Owner direction — heavenly treasure / distortion

**Core:** the Wastes are not “someone tribulated.” A **pre-heaven cold treasure** (or treasure fragment) **distorts** yang, light, and warmth in a continental northern band. Life is scoured because the **rule of the object** still runs.

### Working name — **Sunless Mirror** (无日镜) *(TBD)*

| Piece | Sketch |
|-------|--------|
| **What it is** | Pre-heaven **yin mirror** or **void-lantern** — reflects daylight **out** of the basin, returns only cold echo |
| **Why here** | Continental **ward grid** — one node of a pre-imperial array chain (pairs with Root of World, Void Prison — different lane) |
| **Why still active** | Seal **partially failed** or was **deliberately cracked** to bleed pressure northward (away from Heartlands veins) |
| **Surface effect** | Permanent twilight band, killing wind, “ten thousand years” = **field age**, not one immortal’s lifespan |
| **Deep effect** | Frozen Abyss = **sink** where leaked cold pools; Sage sat in enlightenment when the mirror flared |

### Three variants (pick one or blend)

| Variant | Origin beat | Pros |
|---------|-------------|------|
| **A — Ward node** | Mirror placed to **balance** southern spiritual heat / Phoenix caldera line — leak = accidental | Ties Heartlands thermodynamics without another war story |
| **B — Fallen fragment** | Treasure **fell** in pre-heaven war (not Dao Wars) — continent never dug it out | Clean ancient timeline; explore/delve fantasy |
| **C — Failed containment** | Built to **hold** something else cold (echo of Void Prison problem) — mirror is the **lid**, not the prisoner | Links Void Temple lore; Sage = collateral |

**Recommendation:** **A + C blend** — ward node that became containment when something was sealed beneath; leak is **unclosed scar**, not punishment.

## Timeline (fits immortal ladder)

```text
Pre-sect era → mirror/node emplaced or fractured (no “immortal ascended here”)
     ↓
Dao Wars → northern powers **bargain to ward the leak** (future yin palace + body ridge)
     ↓
Now → field still runs; mortals live in the margin (Frost Gate); sects **maintain arrays**, not “own the cold”
```

Immortals today are **stewards** of the scar — not its authors.

## Zone lore line (replacement draft)

> The northern Wastes are not frozen by battle. A **pre-heaven mirror** in the deep still **drinks the sun’s path** — yang bleeds off the land, and only what endures cold can walk the band. Frost hermits call it the Sunless Scar; the Registry calls it a ward that never closed.

## Yin sect + body ridge (fiction fit)

| Institution | Relationship to scar |
|-------------|----------------------|
| **Yin palace** (ice crown) | Cultivates **in harmony with the leak** — moon cold, stillness; Matriarch myth = survived mirror flare |
| **Vajra Ridge** (body monks) | **Hammer flesh** to endure what qi cannot insulate — escort caravans through the band |
| **Imperial bargain** | Don’t tamper with the mirror; **hold the blizzard line** so leak doesn’t creep south |

## Gameplay hooks (later)

- Distortion meter vs Dustbone order-density meter — **different risk**
- Forbidden sites: mirror facet, array repair, steal fragment (stain)
- Materials: sunless pearl, pre-heaven frost shard — **object-derived**, not tribulation loot

## Open questions

- [ ] Treasure taxonomy — 先天灵宝 tier name; one mirror vs array of facets?
- [ ] Is there a **prisoner** under the abyss (like Void) or only **field physics**?
- [ ] Who cracked the ward — Pinwright echo, pre-imperial court, or natural drift?
- [ ] Emberwild volcanic heat — **south counter-node** on same grid? (pairs north cold / south fire without Phoenix causing north)

## Implementation crumbs (when lore locks)

- `world.js` — `ZONES.frostbite.lore`
- `docs/ideas/frostbite-yin-sect.md` — remove tribulation-as-origin for soil yin
- `data.js` — `frozen_abyss.lore`, clue flavor text if needed
