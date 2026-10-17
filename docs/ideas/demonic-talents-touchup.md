# Demonic Talents — later touch-up

| Field | Value |
|-------|-------|
| **Status** | `idea` (parked — fine as shipped) |
| **Blocked on** | none for play. A redesign waits until someone wants the dynamic pass. Personal fortune is a neighbor, not a prerequisite. |
| **Issue** | none yet |
| **Chat / PR** | Noted 2026-09-28 — [PR #139](https://github.com/WanderingImmortal/tales-immortal-path/pull/139) |
| **Updated** | 2026-09-28 |

## Intent

Demonic Talents can stay as they are. The owner wants a **more dynamic** system eventually: a life that moves, rather than a flag with a climbing threat number and one bargain. No redesign in this note. Do not fold them into personal fortune or into fortune knots. They defy procedure. A knot is a balance that caught. Different problems.

## What is rigid today

Shipped in `NPC_ROLES.demonic_talent`, `world.js`, `quests.js`, `story-arcs.js`.

- Rare spawn: 0.1% on world-NPC generation, a flat emergence about every 10 years, or a 4% chance when a sect elder dies in combat.
- One growth rate (2.0) and a 55% breakthrough check. Ceiling is the player's realm + 2.
- Threat starts at 5, caps at 24, and mostly climbs. It does not have a way to fall except a bargain.
- One menu once you have met them: fight, or pay Will and stones to ally. Kill shifts Dao alignment down. Bargain shifts it further down.
- The ally path is a single escort, then redeem (flag off, they become a disciple) or exploit (Demon Seal, they stay hostile).
- Combat is a thicker rival: about nine hits to kill, damage scaling a little with threat. No separate life, patronage, or change of mind after the quest.

That is enough for now. A later pass should make them respond — to time, to the player, to a sect, to failure — instead of occupying one quest shape until they die or convert.

## Open questions

- What "dynamic" should mean first: a shifting relationship, a life that cultivates off-screen toward its own ends, or both.
- Whether a future talent can burn or hunt personal fortune. Allowed as a hook. Not a reason to merge the two systems.

## Implementation crumbs

- `isDemonicTalent`, `demonicThreat`, `npcDemonicBargain`, `startDemonicRedemptionArc`.
- `spawnVengeanceDemonicTalent` — corpse follow-up for elders, not for fortune knots.
