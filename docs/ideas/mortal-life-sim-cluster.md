# Mortal life sim — design cluster (hub)

| Field | Value |
|-------|-------|
| **Status** | `idea` — **index only**; detail in linked docs |
| **Blocked on** | varies per child doc |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent brainstorm, 2026-07-20 – 2026-07-21; **parked to repo** 2026-07-25 |
| **Updated** | 2026-07-26 |

## Intent

**Local agents:** start here for the **mortal-layer life sim** brainstorm (work, housing, commerce, Dustbone lore, economy) — not scattered chat history.

**Owner direction:** xianxia **lifespan sim**, not only road-to-power. QC years funded by **jobs + selling goods**, not RNG explore stones. **Sect** = institutional path; **personal estate** = individual anchor. **Dustbone** = Law of Dust + three fallen dynasties + **Redwell** spawn + **Threshold** capital ([`dustbone-living-board.md`](dustbone-living-board.md)).

**QC depth:** [`qi-condensation-depth.md`](qi-condensation-depth.md). **Starter town:** [`redwell-starter-city.md`](redwell-starter-city.md). **Dustbone hub:** [`dustbone-starter-gameplay.md`](dustbone-starter-gameplay.md). **Alchemy:** [`dustbone-qc-alchemy.md`](dustbone-qc-alchemy.md). **Surroundings later:** [`dustbone-surroundings-later.md`](dustbone-surroundings-later.md).
**Not in this cluster:** chaos endgame path detail → [`chaos-cultivation-path.md`](chaos-cultivation-path.md); realm ladder → [`cultivation-realm-depth-pass.md`](cultivation-realm-depth-pass.md).

---

## Doc map (read order for implementers)

| Doc | What it holds |
|-----|----------------|
| [`dustbone-dynasties-entropy-lore.md`](dustbone-dynasties-entropy-lore.md) | **Cosmology:** Law of Dust, Pinwright, cascades, Threshold City, tribes, Registry |
| [`dustbone-living-board.md`](dustbone-living-board.md) | **Zone vision:** three cities, board weight, geopolitics, seats |
| [`redwell-starter-city.md`](redwell-starter-city.md) | **P0 spawn town** — bazaar, Inn, courtyard, jobs, seats |
| [`settlement-lore.md`](settlement-lore.md) | Threshold + Redwell stubs; other cities |
| [`qi-condensation-depth.md`](qi-condensation-depth.md) | QC bands + starter-life cut line |
| [`city-tiers.md`](city-tiers.md) | Imperial / 1st–4th civic ladder |
| [`explore-field-gathering.md`](explore-field-gathering.md) | Explore = materials, not stone lottery |
| [`economy-framework.md`](economy-framework.md) | Stone tiers, leagues A–D, faucets/sinks, rollout |
| [`work-and-professions.md`](work-and-professions.md) | Job ladder, labor vs craft professions |
| [`commerce-and-markets.md`](commerce-and-markets.md) | Sell at stalls, cargo/robbery, explore rework, disciple duties, trade dividends |
| [`personal-residence.md`](personal-residence.md) | Rent → buy → hire; `G.dwelling` |
| [`world-standing-and-property.md`](world-standing-and-property.md) | City gates, visibility, guards, estate on death |
| [`sect-vs-personal-anchor.md`](sect-vs-personal-anchor.md) | **Vision:** sect ≠ only home; nomad/hermit/urban paths; reclaim tiers |

---

## One-line design rules (cluster)

1. **If it turns into stones, something carried it through the jianghu.** ([`commerce-and-markets.md`](commerce-and-markets.md))
2. **Money = concentrated order** in Dustbone — hoarding has consequences. ([`world-standing-and-property.md`](world-standing-and-property.md))
3. **Cascades are active** — order density trips Dissolution Events; present day is post-Third equilibrium. ([`dustbone-dynasties-entropy-lore.md`](dustbone-dynasties-entropy-lore.md))
4. **Reverence, not worship** — **Law of Dust** is law, not a god; Return-to-Dust is speech/rites. ([`dustbone-dynasties-entropy-lore.md`](dustbone-dynasties-entropy-lore.md))
5. **QC porter in league A is a valid run** — spirit well is league D. ([`economy-framework.md`](economy-framework.md))

---

## Suggested build order (economy + Dustbone)

**QC v1 cut (ship first):** **Redwell** market + hub jobs + Inn rent + FE courtyard — see [`redwell-starter-city.md`](redwell-starter-city.md), [`qi-condensation-depth.md`](qi-condensation-depth.md).

Full cluster later:

1. Stone tiers + display  
2. Monthly tick (rent, wages)  
3. Jobs v1 at Threshold City  
4. Market stall sell (remove chamber teleport sell)  
5. Dustbone Registry bazaar  
6. Cargo / robbery on market runs  
7. Explore: materials only ([`explore-field-gathering.md`](explore-field-gathering.md))  
8. Disciple duties; trade route caravan dividends  
9. Full property ladder + standing/visibility  
10. Dustbone surroundings ([`dustbone-surroundings-later.md`](dustbone-surroundings-later.md))

---

## Pinwright ↔ Chaos path

First-era **Pinwright** (pre-peak chaos, legislated **Law of Dust**) lives in [`dustbone-dynasties-entropy-lore.md`](dustbone-dynasties-entropy-lore.md). Full **Chaos cultivation endgame** → [`chaos-cultivation-path.md`](chaos-cultivation-path.md) — keep separate; link only.

---

## Open cluster questions

- [ ] Merge Pinwright beat into `chaos-cultivation-path.md` sidebar?
- [ ] Single GitHub epic Issue when first slice is actionable?
- [ ] `docs/NOW.md` focus line when life sim becomes active?
