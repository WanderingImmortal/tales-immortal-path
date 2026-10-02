# Dao combat — target spine (shape · sectors · space · tempo)

| Field | Value |
|-------|-------|
| **Status** | `designed` |
| **Blocked on** | [`combat-damage-depth.md`](combat-damage-depth.md) unified pipeline; owner ATB commit |
| **Issue** | none yet |
| **Chat / PR** | [`dao-combat-and-manifestation-redesign-hub.md`](dao-combat-and-manifestation-redesign-hub.md) |
| **Updated** | 2026-10-02 |

## Intent

Define the **combat sim worth designing daos for** — xianxia depth, still fun. Dao fights are often **indirect** (domain, tempo, geometry), not alternating identical strikes. This doc is the **target**; current `combat.js` is **F0** (HP + resource + few CC flags). Design daos against this spine first; implementation catches up.

## Core model: shape + fill

| Part | Meaning | Cost |
|------|---------|------|
| **Shape (dao shell)** | Which **rule** the attack invokes — severance, illumination, fold, consumption | No separate dao meter |
| **Fill (qi / resource)** | How hard reality bends **this beat** — HP damage, duration, area | Normal technique + combat resource |

**Channel strain (optional):** forcing shape through wrong art or over-fill → deviation / backlash — not “3 domain casts per fight.”

## Hit resolution (target)

Align with [`combat-damage-depth.md`](combat-damage-depth.md):

```text
buildAttackProfile(source, wielder)
  → applyWieldingModifiers (intent expression, dao shape)
  → resolveHit(profile, target, context: range, domain tags, LOS)
       → HP damage
       → sector stress (Flesh / Structure / Circulation / Core)
       → status tags (illuminated, blind stack, …)
       → break checks (pace: 0–1 per normal fight)
```

**Dao shape** selects **sector mix** and **interaction tags**, not a parallel damage type enum.

### Sectors (player-facing vs writer)

| Sector | Role |
|--------|------|
| **Flesh** | Bleed, surface, staying power |
| **Structure** | Frame / limbs / guard integrity |
| **Circulation** | Meridians, technique flow, qi costs |
| **Core** | Dantian pressure — finishers, collapse setup |

## Interaction tags (not RPS)

Small vocabulary on effects; counters are **specific answers**, not `daoBeats[][]`:

- **Sever** — links (buff share, clone, range tether)
- **Anchor** — denies sever / forced reposition
- **Illuminate** — marks for sunfire riders; anti-conceal in volume
- **Dampen** — reduces domain tick / blind stack rate
- **Peel** — strip layers (when buff system exists)
- **Consume** — regen / renewal denial

## Fight geometry

### Range bands (minimum v1)

**Melee · Mid · Far · Out of engagement** — per attacker–target pair.

**Movement actions:** Advance, Withdraw, Hold ground, Blink (VR+), Contest domain edge.

Dao domains occupy **volume** (cells or radius). **Inside / edge / outside** changes which rules apply.

### Why geometry matters for domains

If domain = only resist stat, fights are unfair. **Avoid** = leave volume; **resist** = fight inside without collapsing; **contest** = spend fill to shrink or suppress tick.

## Tempo: ATB lean

**Action bar / ATB:** actors fill readiness at rate from speed (realm, body, injuries, effects). Heavy techniques delay next action (windup).

**Domain / DoT ticks** on **global time slices** while bars fill — so repositioning between ticks matters.

Alternative initiative-round is possible but domains feel like **weather**; owner lean from chat: **ATB**.

## Group combat

- Multiple combatants with positions.
- Focus domain **holder** — collapse field when holder breaks or runs dry.
- Ally **pull from volume**; **body block** line of effect.
- Enemy **split** — half inside to rush holder, half kite outside.

## Domain object (law field)

Not GC qi Domain ([`domain-system.md`](domain-system.md)) — **law legislation** at DM:

| Property | Behavior |
|----------|----------|
| **Holder** | Usually embodied primary; qi drain to hold/expand |
| **Volume** | Rules apply inside (see per-dao doc) |
| **Tick** | Periodic sector/status effects |
| **Contest** | Peer law, array anchor, dampen — interaction tags |
| **Move** | Optional slow drift with holder (high mastery) |

## Foundation tiers (implementation staging)

| Tier | Combat has | Dao design allowed |
|------|------------|-------------------|
| **F0** | HP, resource, defend, skip/slow/root, element weak | Thin riders only |
| **F1** | + blind stack, marks, enemy traits (`dark`) | Way daos with 1–2 techniques |
| **F2** | + sector stress + breaks | Full shape → sector routing |
| **F3** | + domains, movement, ATB, groups | Embodiment + Court fields |

**Target sim** = F3; **Sunfire reference** assumes F3.

## Gap list (from Sunfire stress-test)

1. Unified attack profile + sector stress
2. Status: Illuminated, Blind (stack not hard stunlock), domain membership
3. Spatial layer (bands or grid)
4. Movement as first-class action
5. ATB + domain time ticks
6. Multi-combatant
7. Domain contest hook (generic + peer law later)
8. Defend as Structure interaction
9. Content flags: must-flee vs must-stand fights

## Dao content pattern (per law)

1. **Rule sentence** (one line)
2. **Early shape** — sector lean + aligned arts
3. **Manifest techniques** (3–5) with profiles
4. **Hold / flare** (qi drain)
5. **Embodied domain** — legislation plain language
6. **Weak when** — matchup **shape**, not element chart

## Open questions

- [ ] Grid vs bands for v1
- [ ] Blind: miss chance vs fill delay vs both
- [ ] Player wounds / mutual breaks timing
- [ ] How tribulation combat uses same spine ([`combat-damage-depth.md`](combat-damage-depth.md) exception table)

## Implementation crumbs

- `combat.js` — `G.enemy.defending`, `skipTurns`, `combatResource`
- `core.js` — `rollTrueDaoCombatEffects` → replace with shape-aware rider
- [`weapon-intent-cultivation.md`](weapon-intent-cultivation.md) — expression before dao shape in pipeline
