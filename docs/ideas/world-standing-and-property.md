# World standing & property consequences

| Field | Value |
|-------|-------|
| **Status** | `idea` |
| **Blocked on** | [`personal-residence.md`](personal-residence.md) buy; [`settlement-lore.md`](settlement-lore.md) |
| **Issue** | none yet |
| **Chat / PR** | parked 2026-07-25 |
| **Updated** | 2026-07-25 |

**Hub:** [`mortal-life-sim-cluster.md`](mortal-life-sim-cluster.md)

## Intent

**Standing × Wealth × Visibility** — who may buy prime plots, who robs you, who protects your estate when you die. Complements housing; not required for rent v1.

## City property gates (per settlement)

| Type | Rule |
|------|------|
| Merit | Realm + contribution |
| Money | Auction / stones |
| Blood | Fame, letters |
| Mixed | Stones + standing (Bone Crossroads draft) |

## Visibility → targeting

Big purchases, luxury gear, market hauls raise **knownWealth** → bandit raid, burglary, assassination attempt, deed contest.

## Standing → protection

| Profile | Guards | After death |
|---------|--------|-------------|
| Righteous / respected | May escort free/discount; recruit path | Estate held; killer hunted (stretch) |
| Reviled | Mercs only; staff theft | Estate plundered |

**Reverence not worship** — law of consequences.

## Fair employer / contribution

Jobs paid fairly → merit gates and guard offers.

## Phases

P0 city gate enum → P1 visibility events → P2 paid guards → P3 voluntary guards → P4 estate fate / legacy flags → P5 reincarnation reclaim tiers (personal vs sect — see [`sect-vs-personal-anchor.md`](sect-vs-personal-anchor.md))

## Landlord / flipper (stretch)

Multiple properties, rent-out, settlement price index — **economy P7**; not residence v1. [`economy-framework.md`](economy-framework.md)

## Implementation crumbs

`alignment.js`, `SECT_REPUTATION_*`, `story-arcs.js` NPC bonds, `factions.js`
