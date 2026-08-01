# Cultivation sites & claims (residence, hall, sect)

| Field | Value |
|-------|-------|
| **Status** | `designed` (owner brainstorm) |
| **Blocked on** | [`player-organization-paths.md`](player-organization-paths.md) HQ anchor; local map nodes |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent planning, 2026-08-01 |
| **Updated** | 2026-08-01 |

## Intent

Define **what ground exists**, who can claim it, how **A/B/C/D tiers** differ, and what **benefits** higher sites grant. One vocabulary for residence, hall (city), hermit fortify, and sect HQ.

Cross-links: [`player-organization-paths.md`](player-organization-paths.md) (S4 site pick), [`personal-residence.md`](personal-residence.md), [`city-tiers.md`](city-tiers.md), [`procedural-zone-sect-ecology.md`](procedural-zone-sect-ecology.md), [`realm-claims.md`](realm-claims.md).

---

## Two kinds of place (don't mix them)

| Kind | Examples | Cultivation value | Who claims |
|------|----------|-------------------|------------|
| **Civic space** | Inn room, leased courtyard, city shop | None (rest bonus only) | Residence, **hall** |
| **Cultivation ground** | Spirit vein, spring, peak, ruin, lode | **Site tier + bonuses** | Residence (GC fortify), **sect** |

**Hard rule (owner):** A **sect** must sit on **cultivation ground**. A **hall** sits in **civic space** only — teaches from pamphlets, not a vein. You can rent a Redwell courtyard forever; you cannot call it a mountain sect.

---

## What a site looks like (types)

Sites attach to **local map nodes** (`headquartersNodeId` / `siteId`). Flavor + mechanics via `siteKind`:

| `siteKind` | Looks like | Typical zone | Notes |
|------------|------------|--------------|-------|
| **`peak`** | Mountain top, sword-cut plateau | All wilderness | Defensible; wind; classic sect image |
| **`valley`** | Hidden gulch, bamboo sea | Jade, Emberwild | Easier to hide; weaker defense |
| **`spring`** | Spirit spring, hot pool, wellhead | Dustbone fringe, Frostbite | Water/ice lean; herb gather |
| **`vein`** | Exposed qi node, cracked stone | Any | Raw cultivate bonus |
| **`cave`** | Cliff grotto, underground hall | Dustbone, Frostbite | Hermit default; low disciple cap |
| **`ruin`** | Fallen sect court, broken array | Any | Pre-built stubs; repair cost; grudge risk |
| **`ore`** | Mine mouth, spirit-stone lode | Dustbone, Emberwild | Wealth lean; weaker cultivate |
| **`unique`** | Owner-defined later | Rare | **Not** “+20% qi” — special law/hook |

**City:** no `vein`/`peak` inside tier 1–2 **city seat** — only **civic** nodes. Fringe **outskirts** nodes (attached to tier 3–4 settlements) may have weak **B-tier** cave/spring only.

---

## Claim tiers A / B / C / D (quality ladder)

Same letters as [`player-organization-paths.md`](player-organization-paths.md) site selection — **quality**, not a different system.

| Tier | Name | Fiction | How obtained | Typical holder |
|------|------|---------|--------------|----------------|
| **A** | **Contested** | Named peak, major vein, ancestral spring | Fight, negotiate, inherit | Procedural minor sect, great-power fringe claim |
| **B** | **Open** | Decent hill, minor spring, usable cave | Visible on map; claim | Empty or weak hall expelled |
| **C** | **Hidden** | Good ground mortals missed | Rumor + survey (+ sense for odd qi) | Often unclaimed until discovered |
| **D** | **Legendary** | Pre-heaven ruin, law-touched ground | Story arc / unseal only | Authored; never procedural RNG |

**C+ / `unique`:** inside C or D — requires **spiritual sense** to confirm before survey ([`player-organization-paths.md`](player-organization-paths.md)).

### Tier comparison (benefits)

Benefits stack as **site profile** — data-driven (`SITE_TIER_PROFILES`). Numbers tune at implementation; **relative** shape is locked.

| Benefit | B — Open | C — Hidden | A — Contested | D — Legendary |
|---------|----------|------------|---------------|---------------|
| **Cultivate speed** | +0–5% | +5–12% | +12–20% | Special (not only %) |
| **Breakthrough / trib aid** | — | Small | Moderate | Arc-defined |
| **Disciple cap** | Low (10–20) | Medium | High | Varies |
| **Building / array slots** | 1–2 | 2–4 | 4–6 | Ruin template or unique |
| **Passive income** | Trickle herbs | Herbs + stones | Stones + vein share | Unique |
| **Defensibility** | Poor (raids) | Moderate | Strong (terrain) | Array remnants |
| **Zone face / renown** | Local | Regional whisper | Jianghu notice | Legend |

**Why fight for A:** faster cultivation, more disciples, harder to dislodge, better raid defense, recruitment quality bias — not a single “+50% qi” cheat.

**Why take B:** instant claim, no war; fine for hermit or first sect; upgrade later by conquering A or surveying C.

**Why hunt C:** better than B without fighting A holder — costs time and dead ends.

**D / unique:** campaign rewards — [`formations-and-arrays.md`](formations-and-arrays.md), tribulation, dao hooks — owner defines per site.

---

## Who can use what (eligibility)

| Player path | Min ground | Max tier (typical) | Civic OK? |
|-------------|------------|--------------------|-----------|
| **Residence** (rent/buy) | None | — | Yes — inn, courtyard |
| **Hall** (FE) | None | — | Yes only |
| **Hermit fortify** (GC) | **B** cave/fringe | B–C | Fringe cave only, not city seat |
| **Sect founding** (GC) | **B** minimum | B → D via play | No — must migrate to ground |
| **Join great sect** | Their mountain | Their tier | Player uses **their** HQ, not yours |

**Fortify → sect convert:** same node keeps tier; add sect buildings on top.

**Hall → sect ascend:** must **pick new ground** (cannot upgrade lease into vein).

---

## Site object (data sketch)

```javascript
{
  id: 'dustbone_whispering_spur',
  zoneId: 'dustbone',
  localNodeId: 'whispering_spur',
  siteKind: 'peak',
  tier: 'A',           // A | B | C | D
  veinGrade: 3,        // 1–5 within tier band
  uniqueId: null,      // if siteKind unique
  holderSectId: null,  // procedural or player
  defendBonus: 0.15,
  cultivateMult: 1.14,
  discipleCapBonus: 12,
  discovered: true,    // false for C until survey
  tags: ['wind', 'exposed']
}
```

**`veinGrade`:** fine grain inside tier — two A sites can differ without new tier letter.

---

## Procedural sects & sites

- Procedural **sects** hold **A or B** nodes in zone pool at seed ([`procedural-zone-sect-ecology.md`](procedural-zone-sect-ecology.md)).
- **C** nodes start `discovered: false` until player/NPC survey.
- Contested **A** = why player fights local minor sect for the peak.
- Hollow sect manual pair unrelated to site tier — site affects **cultivation infrastructure**, not signature art.

---

## Map & UI (player reads)

| Tier | Map pin | Inspect text |
|------|---------|--------------|
| B | Faint — “usable ground” | “A minor spring — unclaimed.” |
| A | Strong — named peak | “Iron Reed holds this spur (contested).” |
| C | Hidden until found | — |
| D | Authored icon | Quest-linked |

Residence in city: **no site tier chip** — only “Civic · Redwell courtyard.”

---

## Prerequisites

- [ ] Wire `CULTIVATION_SITES` (or extend `WORLD_LOCATIONS`) per zone
- [ ] Link S4 founding UI to eligible nodes by tier
- [ ] Separate civic lease from `siteId` in `G.dwelling` vs `G.sect.headquartersNodeId`

## Open questions

- [ ] **City outskirts** — weak B cave attached to Redwell: sect-legal or fortify-only?
- [ ] Can player **upgrade** tier in place (B→A) by array/vein deepening, or only by moving?
- [ ] **D** sites — one per zone max or hand-counted only?

## Links

- [`player-organization-paths.md`](player-organization-paths.md)
- [`personal-residence.md`](personal-residence.md)
- [`sect-map-unification.md`](sect-map-unification.md)
- [`domain-system.md`](domain-system.md)
