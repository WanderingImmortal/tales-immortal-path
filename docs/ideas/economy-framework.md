# Economy framework (currency, leagues, faucets & sinks)

| Field | Value |
|-------|-------|
| **Status** | `idea` |
| **Blocked on** | stone tier UI; monthly tick |
| **Issue** | none yet |
| **Chat / PR** | parked 2026-07-25 |
| **Updated** | 2026-07-25 |

**Hub:** [`mortal-life-sim-cluster.md`](mortal-life-sim-cluster.md)

## Intent

Tiered spirit stones, **four faucet shapes**, **sinks**, **leagues A–D** — no global NPC economy sim.

**Rule:** If it turns into stones, something carried it through the jianghu.

## Stone tiers (draft)

| Tier | Ratio | Use |
|------|-------|-----|
| Low | 1 | Rent, wages, bulk staples |
| Mid | 100 low | Gear, manuals, house |
| High | 100 mid | Arrays, major property |
| Superior | 100 high | Dynasty tier |

Display: `1.2M low`, `45 mid`. Store as low-equivalent or multi-wallet + exchange.

## Faucets (four shapes only)

| Shape | Examples |
|-------|----------|
| Labor | Porter, clerk — [`work-and-professions.md`](work-and-professions.md) |
| Risk | Delve, escort, combat loot |
| Craft margin | Sell at market — [`commerce-and-markets.md`](commerce-and-markets.md) |
| Capital | Route dividend, tithe **collection**, rent |

## Leagues (low-equiv draft)

| League | Band | Lifestyle |
|--------|------|-----------|
| A Survive | 0 – ~50k | Cot, menial job |
| B Cultivate | ~50k – ~5M | House, pills |
| C Establish | ~5M – ~500M | Manor, shop |
| D Dynasty | 500M+ | Spirit well, regional |

Menial wages **never** fund league C alone in one QC life.

## Sinks

Rent, upkeep, cultivation, travel, repairs, taxes, debt, hiring — recurring + breakthrough spikes.

## Entropy tie-in

Concentrated wealth ↔ visibility / cascade risk — [`world-standing-and-property.md`](world-standing-and-property.md), [`dustbone-dynasties-entropy-lore.md`](dustbone-dynasties-entropy-lore.md).

## Phased rollout

P0 tiers → P1 monthly tick → P2 jobs → P3 market sell → P4 cargo → P5 explore/disciple/trade rework → P7 property index (optional).

## Implementation crumbs

`G.stones`, `alchemy.js` supply pricing, `actions.js` cultivate income, `MERCHANT_CATALOG`, `SECT_DIPLOMACY_ACTIONS.trade_route`
