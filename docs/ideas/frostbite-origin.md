# Frostbite — why the North is frozen

| Field | Value |
|-------|-------|
| **Status** | `idea` (owner direction — 2026-08-02) |
| **Blocked on** | Owner picks variant; yin sect + zone lore pass |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chat, 2026-08-02 |
| **Updated** | 2026-08-02 (player terms; yin sect off scar — owner) |

**Replaces:** `ZONES.frostbite.lore` line about an immortal’s tribulation freezing the land for ten thousand years — **timeline awkward** and **same skin as Dustbone** (“strong person broke the region”).

Related: [`dustbone-dynasties-entropy-lore.md`](dustbone-dynasties-entropy-lore.md) (contrast), [`frostbite-yin-sect.md`](frostbite-yin-sect.md), [`void-temple-sect.md`](void-temple-sect.md) (pre-heaven containment), [`outer-zone-great-powers.md`](outer-zone-great-powers.md).

## Design sentence

> Dustbone is the **receipt for concentrated order**. Frostbite is the **Sunless Scar** — far north where **yin runs supreme**, yang **inverts or fails**, and the **bleed** reshaped the land. Not battle ice — **absolute yin** (绝阴).

## Player-facing words (owner lock — don’t overload “law”)

Players should **not** need the [`law-taxonomy.md`](law-taxonomy.md) stack. Use **place + phenomenon** language in UI, chronicle, NPC greets.

| Use in game | Avoid for Scar |
|-------------|----------------|
| **Sunless Scar** | “yin law,” “axis law,” “jurisdiction” |
| **the Bleed** | explaining cosmology in a tooltip |
| **absolute yin** (绝阴) | “primordial lane” |
| **yin inversion** — yang collapses into yin | “law reigns supreme” |
| **yin runs supreme** (plain) | “yin dao controls the region” |
| **the Mirror** (scholars) | conflating with Yin Dao curriculum |

**Writer/agent docs** can keep taxonomy for Dustbone vs Scar vs worn dao — **players** hear: *“Don’t cross the Scar line. Even yin cultivators die there if they’re stupid.”*

## The Sunless Scar (owner lock — 2026-08-02)

### What the word is — **yin inversion** (转阴 / 阳极归阴)

At the scar’s heart, **yin runs supreme** — yang doesn’t “lose a duel”; it **stops working** or **inverts** (转阴 / 阳极归阴):

| In the band | Yang behavior |
|-------------|----------------|
| **Southern edge** (zone margin) | Normal yang still works; air is **slightly chilly** — closer to Heartlands than tundra |
| **Mid band** | Yang **weakens**; cold is environmental |
| **Scar apex** (far far north) | Yang **ceases to function** as yang — or **inverts**: extreme yang input **collapses into yin** (classic 物极必反 / 阳极生阴). No warmth to harvest; fire arts sputter; daylight **ends** |

Not meteorological cold alone — **absolute yin** (绝阴): stillness, lightlessness, form settling toward void — deeper than temperature.

### Geography — gradient north + **nobody lives on the Scar**

The zone is a **slope into the Scar**, not one biome. The Scar itself is **too grand to hold** — not controlled by any sect; **lethal even for yin-aligned** cultivators who overstay or push inward.

```text
Heartlands margin
    └── Frost Gate (chilly edge — habitable)
    └── Vajra Ridge (body-refining monks — granite spine, **south**)
    └── Yin Maiden Palace (yin sect — LAST habitable high peak; arrays at the ward line)
    └── Scar margin (killing band — trials, escorts, delves; no permanent halls)
    └── Sunless Scar apex (Mirror, absolute yin — uninhabitable; Frozen Abyss sink)
```

| Band | Who lives here |
|------|----------------|
| **South → Moonfract** | Mortals, sects, caravans — **life** |
| **Scar margin** | Short missions — witness tribulation, gather sunless mats, **retreat** |
| **Scar apex** | **Nobody** — delvers only; yin palace **observes and wards**, does not **own** |

- **Yin sect** sits on the **last peak before the Scar** — maintains **blizzard ward** so Bleed doesn’t creep south; **does not cultivate on the Mirror**
- **Player-facing south:** chilly border = **Bleed**, not weather
- **Deep Scar:** landscape **reshaped** — wrong ice, standing dead silence. Mirror didn’t blast; **Bleed propagated**

### Object — **Sunless Mirror** (无日镜) *(name TBD)*

Pre-heaven treasure at the **pole**. It doesn’t freeze by force — **yin runs supreme** there, and the **Bleed** leaked outward over ages.

| Piece | Sketch |
|-------|--------|
| **At apex** | Absolute yin; yang inverts — not a sect’s Yin Dao, **geography** |
| **Bleed** | Gradient — reshaped landscape = centuries of leak |
| **Frozen Abyss** | Sink where inverted yin pools; array rim still hums |
| **Frostbound Sage** | Victim in the field — not the author |

*Prisoner under abyss — still open; see Open questions.*

## Contrast table (avoid rehash)

| | **Dustbone** | **Frostbite** |
|--|--------------|---------------|
| **Cause type** | Completed **basin statute** (Law of Dust) + **human order density** | Pre-heaven **Mirror** + **Bleed** (writer: see [`law-taxonomy.md`](law-taxonomy.md)) |
| **Mechanism** | Threshold cascades when imposed order exceeds basin capacity | Yin runs supreme; yang inverts or fails; Bleed reshapes land |
| **Agency** | Dynasties **chose** density (Pinwright exception, walls, registry) | Nobody “won a fight” here — something **was placed or fell**, then **leaked** |
| **Timeline** | Three dynasties — mortal-scale history, still recent tribal memory | **Pre-sect, pre–Dao Wars** — continental ward era or treasure fall |
| **Feel** | Sand = discharge, entropy, receipt | Absolute yin, inverted yang, reshaped north |
| **Living with it** | Stay under threshold; mobile tribes; pin maintenance | Ward the Bleed; delve the Scar briefly — **no one rules the apex** |

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

## Origin variants (pick one or blend)

| Variant | Origin beat | Pros |
|---------|-------------|------|
| **A — Ward node** | Mirror placed to **balance** southern spiritual heat — leak = accidental | Ties Heartlands thermodynamics |
| **B — Fallen fragment** | Treasure **fell** in pre-heaven war — continent never dug it out | Delve fantasy |
| **C — Failed containment** | Built to **hold** something cold — mirror is the **lid** | Links Void Temple; Sage = collateral |

**Recommendation:** **A + C blend**.

## Timeline (fits immortal ladder)

```text
Pre-sect era → Mirror emplaced or fractured
     ↓
Dao Wars → northern powers bargain — **Vajra Ridge + Yin Maiden Palace** survive with homelands intact
     ↓
Now → Bleed still runs; sects **hold the line** — **nobody owns the Scar apex**
```

## Zone lore line (replacement draft)

> Far in the north the **Sunless Scar** still bleeds — where **yin runs supreme** and yang **inverts or dies**. The border is only chilly; the pole is **absolute yin**, and the land there was **reshaped by the Bleed**, not by war. Moonfract Palace wards the last safe peak; only fools and delvers cross into where the sun never rises.

## Map / content implication

| Band | Location (sketch) | Game tone |
|------|-------------------|-----------|
| **South** | `frost_gate` | Chilly margin |
| **Mid** | wastes | Hard explore |
| **Habitable crown** | Yin Maiden Palace (`frostpeak_monastery` id) | Yin sect — **not on Scar** |
| **Lower / south** | Vajra Ridge (new node) | **Body-refining monks** — gate corridor |
| **Scar** | `frozen_abyss`, apex delve | Lethal — **no sect HQ** |

`ZONES.frostbite.description` — **gradient into the Scar**, not uniform tundra.

## Yin sect + body ridge (fiction fit)

| Institution | Relationship to Scar |
|-------------|----------------------|
| **Moonfract / Yin Maiden Palace** | **Last habitable peak** — trains **peak Yin**; Scar is neighbor, not domain |
| **Vajra Ridge** | **Southern spine** — monk body refiners; escorts through margin; flesh endures Bleed edge |
| **Imperial bargain** | Don’t tamper with Mirror; **hold Bleed** from creeping south |

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
