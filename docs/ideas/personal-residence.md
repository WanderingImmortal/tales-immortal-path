# Personal residence (rent → buy → hire)

| Field | Value |
|-------|-------|
| **Status** | `building` (QC minimal home + owned courtyard formations) |
| **Blocked on** | Full ladder: [`economy-framework.md`](economy-framework.md), [`work-and-professions.md`](work-and-professions.md) |
| **Issue** | none yet |
| **Chat / PR** | QC playtest · independent formations `cursor/independent-formation-practice` |
| **Updated** | 2026-11-06 |

**Hub:** [`mortal-life-sim-cluster.md`](mortal-life-sim-cluster.md)  
**Vision split:** [`sect-vs-personal-anchor.md`](sect-vs-personal-anchor.md)  
**QC cut:** [`qi-condensation-depth.md`](qi-condensation-depth.md)

## Intent

**Personal anchor** without founding sect: **rent → buy → hire** guards/staff. `G.dwelling` separate from `G.sect`. Nomads stay travel-kit only. **Homes are local hubs** — not a worldwide “I own a house somewhere” shield.

## QC minimal home (shipping → retarget Redwell)

| Mode | What |
|------|------|
| **Rent** | **Redwell Inn** → home screen (fiction + rest bonus + Rest here). Monthly rent tick. |
| **Buy** | FE sand-brick courtyard + chest (`G.dwelling.stash`) + **1 formation slot** (`G.dwelling.formations`) — house itself adds no cultivate speed; running patterns do (while present) |
| **Homeless** | Inn opens rent/buy; rest penalty |

**Formation install permission (today):** owned dwelling + present at settlement. Ownership is the current gate, not an inherent formation rule — rental / sect lodging / commissions can plug into `getFormationSiteInstallPermission` later. Loss of ownership or settlement relocate **clears** installs (no teleport / silent dup).

Settlement: [`redwell-starter-city.md`](redwell-starter-city.md). Do **not** reuse sect Leader’s Quarters / `canAccessResidenceStash` for this.

## Full ladder (later)

**Rent:** Cot → room → suite → townhouse lease (zone multipliers). Monthly pay; eviction if broke.

**Buy:** Plot (build) → house → manor. Formation slots, hire slots, defences at owner tiers.

### Local home hubs (owner note 2026-07-27)

Owning / renting in **one** settlement must **not** count as housed everywhere. A home is a **hub**: protection, stash, and “safe cultivate” only apply **while you are there**. Building it up = dedication to that area for a while.

Today’s QC `G.dwelling` is a single global flag (Threshold stand-in → **retarget Redwell**) — **expand later** to per-settlement (or per-city) residences. Cultivate bandit interrupts already assume “not at a residence here ⇒ exposed.”

See also: bandit interrupt in [`qc-cultivate-excitement.md`](qc-cultivate-excitement.md).

## Hire (not disciples)

Porter, night watch, bodyguard, shop clerk, furnace tender — wages/month; slots by property tier.

## Eventually

Migrate off `G.sect.residence` / Leader's Quarters as **only** home; sect HQ = bonus layer.

## Related

[`world-standing-and-property.md`](world-standing-and-property.md), [`dustbone-dynasties-entropy-lore.md`](dustbone-dynasties-entropy-lore.md)

## Data sketch

```text
G.dwelling = {
  mode, settlementId, rentPaidThroughMonth,
  stash: { materials },
  formations: { slots: [], siteSettlementId }
}
```

## Implementation crumbs

`qc-depth.js` (Lodge popup / stash / formation mount), `formations.js` (`layPersonalDwellingFormation`, reconcile on ownership loss), `residence-stash.js`, `travel-kit.js`
