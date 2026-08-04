# Gu cultivation system (symbiotic)

| Field | Value |
|-------|-------|
| **Status** | `idea` (parked) |
| **Blocked on** | Owner research pass on gu in xianxia; mechanics design before any gu great sect ships |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chat — Jade Archipelago gu sect, 2026-08-02 |
| **Updated** | 2026-08-04 |

## Intent

Support **true gu cultivation** — symbiotic relationship where the gu is raised, refined, and fights *with* the cultivator — not just poison/debuff flavor on a normal qi build.

Prerequisite for: [`jade-archipelago-gu-sect.md`](jade-archipelago-gu-sect.md) (parked great sect).

## Why parked

A gu great sect in the Jade Tide Archipelago was brainstormed as the **unorthodox** counterweight to Storm Dragon (see [`storm-dragon-sect.md`](storm-dragon-sect.md)). Owner wants gu to be **real symbiosis**, not a reskin of existing poison techniques — but does not yet know gu deeply enough to spec mechanics.

**Not in scope for v0 stub:** full breeding sim, jar management UI, gu evolution trees — discover during research.

## Design direction (from chat)

| Topic | Lean |
|-------|------|
| **Evil sect?** | **No** — unorthodox, shudder-inducing, licensed charter power; binding/medicine/containment, not slaughter creed |
| **vs poison guild** | Longcheng **Poison Guild** is commercial branch fiction ([`imperial-city-tianjing.md`](imperial-city-tianjing.md)) — gu sect is **lineage + dao**, not the shopfront |
| **vs soul sect** | Deprioritized — overlaps Frostbite yin, Tidal Lotus “drowned,” and [`soul-body-refining.md`](soul-body-refining.md) forbidden lane |
| **Minimum viable later** | Tier 1 lore-only faction → Tier 2 one **heir gu** slot / companion → Tier 3 full gu path (expensive) |

## Open questions (research)

- [ ] What gu *is* in target fiction — insect types, ranks, life cycle, “gu mother,” aperture/dantian hosting
- [ ] Combat model: gu as weapon vs gu as second body vs gu as qi storage/refinement engine
- [ ] Symbiosis costs — feeding, backlash, gu rebellion, lifespan tradeoffs
- [ ] How gu interacts with **nine-realm ladder** — same breakthroughs with gu assist, or gu-specific gates?
- [ ] Breeding / inheritance — sect lineage gu vs caught wild gu
- [ ] Player onboarding — can outer court use gu talismans without full symbiosis?

## Prerequisites

- [ ] Owner gu research pass (novels / reference notes)
- [ ] Mechanics sketch: heir gu, feeding, combat deploy, failure modes
- [ ] Decide overlap with existing **poison** combat hooks (`combat.js` dots) vs new systems

## Related

- [`jade-archipelago-gu-sect.md`](jade-archipelago-gu-sect.md) — parked faction shell
- [`storm-dragon-sect.md`](storm-dragon-sect.md) — orthodox archipelago peer
- [`sect-faction-identities.md`](sect-faction-identities.md) — identity template when unblocked
- [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md) — lineage layer when gu path exists

## Implementation crumbs (later)

- `combat.js` — poison/bind debuffs (possible gu expression layer)
- `spiritual-roots-taxonomy-v2.md` — poison mutant root exists
- No `gu` systems in repo today
