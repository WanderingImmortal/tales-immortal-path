# Frostbite — yin great sect (Frostpeak pivot)

| Field | Value |
|-------|-------|
| **Status** | `idea` (owner direction — 2026-08-02) |
| **Blocked on** | Owner name + lore pass; replaces thin Frostpeak ascetic stub |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chat, 2026-08-02 |
| **Updated** | 2026-08-02 (off the Scar — owner) |

Related: [`outer-zone-great-powers.md`](outer-zone-great-powers.md). Peer: [`body-path-sect.md`](body-path-sect.md) (Vajra Ridge). Scar: [`frostbite-origin.md`](frostbite-origin.md).

## Intent

**Repurpose Frostpeak Monastery** into a **yin-aligned, female-only great sect** — **not on the Sunless Scar**. The Scar is **too grand to control** and **kills even yin-aligned** cultivators who push into the apex.

The sect sits on **Moonfract Peak** — the **last habitable crown** before the Scar margin — and **wards the Bleed** so it doesn’t creep south. They **observe, arbitrate, and hold the line** — they do **not** own the Mirror.

## Geography (locked)

```text
Frost Gate → Vajra Ridge → Moonfract Palace (THIS SECT) → Scar margin → Scar apex (NOBODY)
```

| | Moonfract Palace | Sunless Scar apex |
|--|------------------|-------------------|
| **Habitable?** | Yes — arrays, disciples, halls | No — delve only |
| **Yin cultivators** | Train, thrive (within limits) | Die if careless |
| **Sect role** | Ward line, tribulation witness **from safety** | Forbidden ground / story delve |

Code location `frostpeak_monastery` maps to **Moonfract** — high ice, **below** the uninhabitable Scar band.

## What exists in code today (to replace in fiction)

| Piece | Today |
|-------|-------|
| Faction | `frostpeak_monastery` — ascetic, cold resist perks |
| Location | `frostpeak_monastery` — stone steps, cloud, killing wind |
| NPC | Warden Yun — gatekeeper |
| Pact | Ice-Witness Covenant — frost tribulation witness |
| Lore hook | `frost_sun_never_rises` ancient clue |

Mechanics map forward: cold resist, tribulation witness — identity becomes **yin palace at the ward line**, not generic monastery **on** the Scar.

## Working sketch — **Moonfract Palace** (月碎宫) *(name TBD)*

| | |
|--|--|
| **Vibe** | Pale silence on the **last safe ice** — moonlight that does not warm; disciples who outlast the wind **but do not walk into the Scar** |
| **Path** | **Qi-primary**; **Yin Dao** curriculum — not body path |
| **Entry** | **Female-only** inner court; outer gate may employ male servants who never enter inner peaks |
| **Cultivation identity** | *Stub* — Moon Severing Canon (月断典) or Frost Yin Scripture |
| **Homeland** | **Moonfract Peak** (月碎峰) — habitable crown; Scar visible in distance |
| **Founder myth** | *Stub* — Moon Empress endured a **margin flare** and read the Scar **from the ward line** — not “lives on the Mirror” |
| **Public leader** | *Stub* — Matriarch / Palace Mistress at Void Refinement |
| **Player-facing NPC** | Gate Warden (Warden Yun pivot) — tests patience |
| **Primary lean** | **Northern ward** — arrays hold the Bleed; imperial isolation bargain |
| **Also has hands in** | Frost reagents, tribulation arbitration **at safe distance**, silence oaths |
| **What they teach** | Yin frost arts, stillness, concealment · **Refuse:** yang flame paths, male inner disciples |
| **What they refuse to claim** | **Control of the Scar** — “the Scar is not ours” |

## Player-facing words

Say **Sunless Scar**, **the Bleed**, **absolute yin**, **yin runs supreme** — not “yin law” (see [`frostbite-origin.md`](frostbite-origin.md)). Yin Dao = what they **teach**; Scar = **geography** next door.

## Why female-only fits the zone

- Scar Bleed = extreme yin **environment**; palace teaches **Yin Dao** **beside** it, not inside it
- Pairs with Vajra Ridge: moon on the last peak, iron on the lower spine

## Player hooks (design)

| Player | Hook |
|--------|------|
| **Female cultivator** | Join palace; Scar delves as **optional lethal content** |
| **Male cultivator** | Outer court, escort contracts, “you will not see inner peaks” |
| **Any** | Tribulation witness pact — palace watches from **ward arrays**, not Scar floor |

## Relationships (sketch)

| Power | Relationship |
|-------|--------------|
| **Vajra Ridge** | Joint ward of the north; escorts to margin |
| **Sunless Scar** | **Not allied** — respected horror next door |
| **Heartlands four** | Distant; charter envoys rare |

## Open questions

- [ ] Final name — keep Frostpeak hanzi or Moonfract only?
- [ ] How close can inner-court training get to Scar margin before casualties?
- [ ] Matriarch vault asset — ever entered Scar once, never twice?

## Prerequisites

- [ ] [`frostbite-origin.md`](frostbite-origin.md) — Scar vs habitable band locked
- [ ] Identity v1 before `data.js` NPC / location text
