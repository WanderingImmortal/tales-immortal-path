# Mortal life sim — design cluster (hub)

| Field | Value |
|-------|-------|
| **Status** | `idea` — **index only**; detail in linked docs |
| **Blocked on** | varies per child doc |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent brainstorm, 2026-07-20 – 2026-07-21; **parked to repo** 2026-07-25 |
| **Updated** | 2026-07-25 |

## Intent

**Local agents:** start here for the **mortal-layer life sim** brainstorm (work, housing, commerce, Dustbone lore, economy) — not scattered chat history.

**Owner direction:** xianxia **lifespan sim**, not only road-to-power. QC years funded by **jobs + selling goods**, not RNG explore stones. **Sect** = institutional path; **personal estate** = individual anchor. **Dustbone** = entropy sink + three fallen dynasties + Bone Crossroads starter city.

**Not in this cluster:** chaos endgame path detail → [`chaos-cultivation-path.md`](chaos-cultivation-path.md); realm ladder → [`cultivation-realm-depth-pass.md`](cultivation-realm-depth-pass.md).

---

## Doc map (read order for implementers)

| Doc | What it holds |
|-----|----------------|
| [`dustbone-dynasties-entropy-lore.md`](dustbone-dynasties-entropy-lore.md) | **Cosmology:** Return-to-Dust, Pinwright, cascades, sand, oasis, tribes, Registry |
| [`settlement-lore.md`](settlement-lore.md) | **Bone Crossroads P0** — power, gates, jobs flavor, market |
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
4. **Reverence, not worship** — Return-to-Dust is law, not a god. ([`dustbone-dynasties-entropy-lore.md`](dustbone-dynasties-entropy-lore.md))
5. **QC porter in league A is a valid run** — spirit well is league D. ([`economy-framework.md`](economy-framework.md))

---

## Suggested build order (economy + Dustbone)

1. Stone tiers + display  
2. Monthly tick (rent, wages)  
3. Jobs v1 at Bone Crossroads  
4. Market stall sell (remove chamber teleport sell)  
5. Dustbone Registry bazaar  
6. Cargo / robbery on market runs  
7. Explore: drop pity stones; add survey  
8. Disciple duties; trade route caravan dividends  
9. Property buy + standing/visibility events  

---

## Pinwright ↔ Chaos path

First-era **Pinwright** (pre-peak chaos, legislated Return-to-Dust) lives in [`dustbone-dynasties-entropy-lore.md`](dustbone-dynasties-entropy-lore.md). Full **Chaos cultivation endgame** → [`chaos-cultivation-path.md`](chaos-cultivation-path.md) — keep separate; link only.

---

## Open cluster questions

- [ ] Merge Pinwright beat into `chaos-cultivation-path.md` sidebar?
- [ ] Single GitHub epic Issue when first slice is actionable?
- [ ] `docs/NOW.md` focus line when life sim becomes active?
