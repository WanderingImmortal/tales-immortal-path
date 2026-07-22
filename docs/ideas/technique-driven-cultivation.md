# Technique-driven cultivation & foundation variants

| Field | Value |
|-------|-------|
| **Status** | `designed` (P2 slice); later-realm method deepening still sketch |
| **Blocked on** | P0/P1 merged helpful but not required to start P2 code |
| **Issue** | [#54](https://github.com/WanderingImmortal/tales-immortal-path/issues/54) |
| **Chat / PR** | [PR #55](https://github.com/WanderingImmortal/tales-immortal-path/pull/55) |
| **Updated** | 2026-07-22 (owner lock-in: axes, seal stamp, shared natures, effects, ship on current seal) |

## Intent

Cultivation runs **through** one primary **cultivation method**. At Foundation Establishment **Seal / Consolidate**, that method stamps a foundation **nature** (what kind of foundation you forged) and **locks** the path. Method **grade** (crude → peerless) is how well the road was taught — it owns **cultivate speed**, not a second hard realm cap (roots already hard-cap innate height).

**Framework** (pools, shelf, grade ladder): [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md). **FE journey rename** (gather → stabilise → seal → Initial Core Formation): [`qi-foundation-establishment-redesign.md`](qi-foundation-establishment-redesign.md) — P2 does **not** wait on that; stamp hooks today’s seal and moves with the redesign later.

---

## Two axes (do not conflate)

| Axis | Meaning | Examples | When set |
|------|---------|----------|----------|
| Foundation **quality / state** | How solid the foundation is | Crude → Peerless; fiction “barely scraped by” / hasty | Grind + seal quality |
| Foundation **nature** (variant) | *What kind* of foundation you sealed | Plain/balanced, five-phase aspect, thunder-tempered, sword-inclined, blood-fiend | **Stamped at FE Seal / Consolidate** |

Old sketch ids like `hasty_meditation` as a “variant” were wrong — hasty belongs on **quality/state**, not nature.

---

## Shared natures + method grade (Q5)

- Natures are a **shared catalog**. Many manuals can stamp the **same** nature.
- Two lightning scriptures from different authors can both stamp e.g. `thunder_tempered`; the peerless one is a better road (speed, stability, **stronger signature magnitude**), not a different element.
- Methods need not share family to share a nature stamp.

**Data sketch:**

```js
// Shared set (grows over time)
FOUNDATION_NATURES = {
  plain_balanced: { /* signature… */ },
  fire_aspected: { … },
  thunder_tempered: { … },
  sword_inclined: { … },  // affinity — not full Intent
  blood_fiend: { … }
};

// On each cultivation method
method.stampsNature = 'thunder_tempered';  // was wrongly called foundationVariant: 'hasty_*'
```

Player save (extends `G.cultivationMethod` / foundation state):

```js
G.foundationNatureId = 'thunder_tempered'; // set at seal
G.cultivationMethod.primaryLocked = true;  // at seal
G.cultivationMethod.foundationLineage = '…'; // optional flavor id
```

---

## Stamp + lock (Q4, Q7)

- **When:** FE Seal / Consolidate (UI may say Seal today; consolidate-vs-seal naming is a parked cleanup).
- **What:** Stamp nature from active primary method’s `stampsNature`; set `primaryLocked`.
- **After:** path change only via rare **meridian-wash** (framework v1 compromise).
- **Ship:** Hook **current** seal action now. FE redesign later calls the same stamp helper — one system, not two.

---

## Roots vs method (synergy)

| Piece | Role |
|-------|------|
| Spirit **root** | Innate aptitude (composition, grade, optional deviant) |
| Sealed **nature** | What you forged with your cultivation path |
| **Match** | Synergy — fuller rating / small bonus |
| **Mismatch** | Legal but leaky (`rootFit`) |
| Deviant manuals | Stamp natures roots alone don’t give (thunder, sword-inclined, blood-fiend) |

---

## Affinity natures (sword, etc.) — not Intent gates

- Stamp **affinity** (sword-*inclined*), not “Intent already awakened.”
- Do **not** hard-gate FE methods behind the Intent system.
- Later (optional): matching affinity makes corresponding Intent **easier to comprehend**.
- Blood kill-harvest loops: **park** for evil-playthrough slice; v1 can use alignment-flavored method + nature tag.

---

## What natures *do* (Q6)

**Goal:** Defining path trait — sealing and choosing your method should matter. Not OP; not a forgotten label.

**Nature is not cultivate speed.** Method **grade** owns speed.

**Effect palette** (each nature picks **one signature**, optional tiny secondary):

| Family | Examples |
|--------|----------|
| Combat offense | Attack power; defense penetration (sword-ish) |
| Combat support | Aligned techniques cost a bit less / easier to practice |
| Social / aura | Fiend nature → intimidation vs weaker NPCs (may stub tag first) |
| World / risk | Tribulation tint, how the world reads you |

**Grade** scales signature magnitude. **Nature** picks which fantasy.

**v1 code lean:** small shared list (plain + a few); one signature each; modest numbers; expand catalog later.

---

## Later realms — method deepening (sister sketch, not P2 code)

A forever gather-mult + one FE stamp is **not enough** fantasy by Nascent Soul / Immortal. This game will **not** hard-block ascent on realm-tiered manuals.

Parked direction — *one path; the path deepens*:

- Same lineage, rising **grade** (fragment → complete → annotation)
- Same scripture, **realm chapters** (soft expectation, not hard wall)
- Method unlocks **new cultivate actions** per realm (best long-term fix)

Stamped **nature** carries forward as identity + soft bonuses. Method **progression** supplies the climb. See also manuals framework P2+ notes.

---

## Technique sacrifice

Prefer stones / time / materials / pills / breathing-method upgrades over burning random combat techniques unless lore requires it. (Unchanged owner preference.)

---

## Prerequisites

- [x] Owner P2 lock-in (axes, soft ceiling, seal lock, shared natures, effect intent, ship on current seal) — 2026-07-22
- [x] [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md) P0–P1 in flight
- [ ] Implement stamp + lock on current FE seal
- [ ] Small `FOUNDATION_NATURES` catalog + method `stampsNature` remap
- [ ] FE redesign integrates same stamp helper when journey rewrite lands

## Open questions (post-P2)

- Meridian-wash frequency/cost — ship v1, playtest
- Exact v1 nature list + signature numbers (balance pass)
- When Intent-ease and intimidation aura get full wiring
- Method realm-chapter / deepening design pass

## Implementation crumbs

- `consolidation.js` / FE Seal Dantian — call stamp + `primaryLocked`
- `cultivation-methods.js` — nature helpers; lock already sketched
- `data.js` — `FOUNDATION_NATURES`; remap method `stampsNature`
- `foundation.js` — expose nature label beside quality grade
- `chamber.js` / inventory path UI — show sealed nature after stamp
- Combat / NPC — consume nature tags modestly (v1)
