# Commerce & markets (sell in person, cargo risk)

| Field | Value |
|-------|-------|
| **Status** | `idea` |
| **Blocked on** | [`economy-framework.md`](economy-framework.md) |
| **Issue** | none yet |
| **Chat / PR** | parked 2026-07-25 |
| **Updated** | 2026-07-25 |

**Hub:** [`mortal-life-sim-cluster.md`](mortal-life-sim-cluster.md)

## Intent

Markets are **places you go to sell** bulk staples (qi pills, healing pellets, herbs). **No** instant sell from alchemy chamber. **Cargo risk** on the road; guards matter.

## Loop

Craft at home/lab → load travel kit/wagon → travel to market → stall sell → stones (± robbery).

## Bulk SKUs (~10–15)

Staple pills, herbs, common ore — per-`marketKey` **supply/demand** (copy `alchemy.js` pill supply model).

## Remove

`sellAlchemyPills()` teleport cash — chamber **craft only**.

## Markets (draft)

| Location | marketKey | Sell |
|----------|-----------|------|
| Celestial Market | heartlands | Full supply |
| Tide Harbor | jade | Full supply |
| Redwell bazaar | dustbone (starter) | Finite stock; monthly consumables; QC manual **pool draw** — [`redwell-starter-city.md`](redwell-starter-city.md) |
| Threshold / Bone Crossroads bazaar | dustbone (capital) | Later denser shelf; not QC spawn market |

## Robbery

`robRisk = f(cargoValue, zone, distance, visibility)` — mitigated by guards, realm, disciple escort, Dune charter.

## Explore rework

**Remove** pity stone roll on empty explore (`world.js`). Keep clues, arcs, combat.

Add **Survey** (near city, predictable materials) vs **Delve** (wild risk). QC income = jobs + sell goods.

## Disciples

Replace **+stones per cultivate** with **duties**: gather, guard caravan, man stall, tithe run. Treasury **stores** collected tithe.

## Trade routes

Replace **+stones per cultivate** with **caravan returns** on schedule + completion bonus (`SECT_DIPLOMACY_ACTIONS.trade_route`).

## Implementation crumbs

`alchemy.js`, `alchemy-chamber.js`, `world.js` `actionExplore`, `locations.js`, `sect.js`, `travel-kit.js`
