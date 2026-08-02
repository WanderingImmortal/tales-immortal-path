# Yin Maiden Palace (玉女宫)

| Field | Value |
|-------|-------|
| **Status** | `idea` (owner direction — 2026-08-02) |
| **Blocked on** | Lineage manual; technique tier pass; replaces Frostpeak stub in code |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chat, 2026-08-02 |
| **Updated** | 2026-08-02 (Yin peak arts — not guardian sect) |

Former filename stub: `frostbite-yin-sect.md`. Related: [`outer-zone-great-powers.md`](outer-zone-great-powers.md), [`body-path-sect.md`](body-path-sect.md), [`frostbite-origin.md`](frostbite-origin.md). **Not** a Void Temple analogue — see [`void-temple-sect.md`](void-temple-sect.md).

## Intent

**Repurpose Frostpeak Monastery** into **Yin Maiden Palace** — an **all-female great sect** that pursues the **peak of Yin arts** (太阴极致), not a **guardian** institution. They sit in Frostbite because **absolute yin Bleed** is the best crucible on the continent — **geography serves the curriculum**, not a second “we guard the horror” sect beside Void Temple.

**Lower techniques** may still look **frost- and cold-flavored** (outer court, zone materials, survival in the north). **Supreme arts** are **true Yin** — stillness, severance, concealment, dissolution, moon — **not** “bigger ice.”

## Not another guardian sect

| | **Void Temple** | **Yin Maiden Palace** |
|--|-----------------|------------------------|
| **Core job** | Seal **Void Prison**; firmament / gate network | **Master Yin Dao** to its apex |
| **Why secluded** | Containment + pre-heaven risk | **Training crucible** + tradition |
| **Public face** | “Don’t test the lock” | “Don’t insult our maidens” |
| **Scar** | Irrelevant to identity | **Adjacent** — bleed sharpens yin, they **don’t own it** |
| **Arrays** | Prison, gates, continental lock | **Palace wards** — live comfortably near Bleed; **not** imperial northern guardian mandate |

Imperial **isolation bargain** can remain (leave them alone on their peak) — **not** because they ward the realm, because they’re **dangerous, ancient, and female-sovereign** on a mountain nobody else wants.

## Geography (locked)

**Not on the Sunless Scar apex** — Scar kills even yin masters who linger.

```text
Frost Gate → Vajra Ridge → Yin Maiden Palace (last habitable crown) → Scar margin → Scar apex
```

Code: `frostpeak_monastery` → palace on habitable peak; Scar = optional delve content **for the player**, not sect HQ.

## At a glance

| | |
|--|--|
| **Name** | **Yin Maiden Palace** (玉女宫) — *owner lean; hanzi lock optional* |
| **Vibe** | All-female lineage hall — pale moon discipline, silence as courtesy, cruelty as precision |
| **Path** | **Qi-primary**; **Yin Dao** to the peak — not ice path, not body path |
| **Entry** | **Female-only** inner court; outer servants / contractors male OK |
| **Homeland** | **Maiden Peak** (玉女峰) or retain **Moonfract** hanzi — high ice **below** Scar band |
| **Lineage** | **True Yin Scripture** (真阴经) — apex canon; outer court uses frost-flavored introductory manuals |
| **Primary lean** | **Yin technique supremacy** — manuals, duels of concealment, assassination contracts, moon reagents |
| **Also has hands in** | Frost mats (low-tier teaching), silence oaths, tribulation **observation** (side contract, not guardian duty) |
| **Refuse** | Yang flame paths; male inner disciples; being hired as “northern wardens” |

## Technique ladder — frost at the bottom, Yin at the top (owner lock)

**Design rule:** element tag **ice/frost** should **fade** as arts tier up. Supreme manuals are **yin** — stillness, severance, void-warding, moon — **not** glacier finishers.

| Tier | Player feel | Examples (fiction) |
|------|-------------|-------------------|
| **Outer / low** | Cold, frost, chill — **zone practical** | Ice-touch palm, frost concealment, breath that numbs; overlaps Frostbite explore loot |
| **Inner / mid** | Yin **without** ice cosplay | Shadow sever, qi drain, moonlit step, spirit concealment — cold is side effect |
| **Supreme / apex** | **Peak Yin** | Absolute stillness (动之极静), severing light (断阳), concealing fate from audit, form **dissolving** into moon-shadow — **no** “ultimate blizzard” |

**Why they're in the north:** outer court **needs** frost-flavored basics to survive the Bleed margin; inner court **transcends** “cold technique sect” into **Yin Maiden** proper — the sect Heartlands scholars argue is **the** yin reference, not Frostpeak ice monks.

**Contrast Phoenix:** Phoenix supreme = rebirth flame. Yin Maiden supreme = **not** rebirth ice — **extinction of yang presence**, concealment, severance.

## Founder myth (stub)

First **Yin Maiden** (玉女祖师) — not a warden. She **completed Yin Dao** where the Bleed made yang impossible, founded a palace so **women** could walk the peak without charter or marriage politics. Scar flare **tempered** her; she **did not** seal the Mirror.

## What exists in code today

| Piece | Pivot |
|-------|-------|
| `frostpeak_monastery` | → Yin Maiden Palace faction id *(rename later)* |
| Cold resist perk | Still fits — **outer court** survival |
| Ice-Witness Covenant | → optional **tribulation observe** pact — **service**, not guardian charter |
| Warden Yun | → Gate Mistress — tests **stillness**, not “state your purpose to the cold” |

## Player hooks

| Player | Hook |
|--------|------|
| **Female** | Join lineage; climb outer frost → inner yin → supreme non-ice arts |
| **Male** | Outer contracts only; romance / sworn-service arcs; never inner peaks |
| **Any** | Buy low-tier frost pamphlets at gate; supreme manuals **faction-locked** |

## Relationships (sketch)

| Power | Relationship |
|-------|--------------|
| **Void Temple** | Mutual respect — **different job**; no rivalry over “who guards what” |
| **Vajra Ridge** | Neighbors — escorts, not shared doctrine |
| **Golden Phoenix** | Natural opposition — yang flame vs yin peak |
| **Celestial Sword** | Distant — line vs moon |

## Open questions

- [ ] Final name: **玉女宫** locked or blend with Moonfract 月碎?
- [ ] Supreme art names — one **signature** non-ice ultimate for marketing
- [ ] Do males ever learn **outer frost** pamphlets only?
- [ ] Matriarch tier — VR public; vault ancestor?

## Prerequisites

- [ ] Technique pool: tag low `element: ice` / high `element: yin` or `soul`
- [ ] [`frostbite-origin.md`](frostbite-origin.md) — Scar as crucible, not sect property
