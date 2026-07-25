# Technique-driven cultivation & foundation variants

| Field | Value |
|-------|-------|
| **Status** | `building` (P2 plumbing shipped; nature manuals + sword aura slice) |
| **Blocked on** | — |
| **Issue** | [#54](https://github.com/WanderingImmortal/tales-immortal-path/issues/54) |
| **Chat / PR** | [PR #55](https://github.com/WanderingImmortal/tales-immortal-path/pull/55); follow-up `cursor/technique-nature-manuals` |
| **Updated** | 2026-07-25 (owner: test manuals for non-plain natures; sword sharper aura in NPC talk; skip meridian-wash; combat % playtest later) |

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

**v1 catalog (owner OK 2026-07-25):** `plain_balanced`, `fire_aspected`, `thunder_tempered`, `sword_inclined`, `blood_fiend`. More natures later; more methods to suit.

**Test manuals (non-plain):**

| Method | Stamps |
|--------|--------|
| Cinder Meridian Cycle | `fire_aspected` |
| Storm Vein Breath | `thunder_tempered` |
| Edge Tempering Scripture | `sword_inclined` |
| Crimson Harvest Breath | `blood_fiend` |

Findable via explore/method loot (same pool as other qi methods).

---

## Stamp + lock (Q4, Q7)

- **When:** FE Seal / Consolidate (UI may say Seal today; consolidate-vs-seal naming is a parked cleanup).
- **What:** Stamp nature from active primary method’s `stampsNature`; set `primaryLocked`.
- **After:** path change only via rare **meridian-wash** — **skipped for now** (owner 2026-07-25); lock is real, escape hatch later.
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
- Blood kill-harvest loops: **park** for evil-playthrough slice.

### Sword — sharper aura (owner 2026-07-25)

**One real social effect for this slice:** sealed `sword_inclined` gives a **sharper aura** — not overpowering; sometimes reflected in NPC greet/talk (world + story). Combat armor pen stays as the modest combat signature. Intent-ease wiring still later.

---

## What natures *do* (Q6)

**Goal:** Defining path trait — sealing and choosing your method should matter. Not OP; not a forgotten label.

**Nature is not cultivate speed.** Method **grade** owns speed.

**Combat numbers (~3–6%):** leave as coded; **tune after playtest** (owner).

**v1 code lean:** small shared list (plain + a few); one signature each; modest numbers; expand catalog later.

---

## Later realms — method deepening (sister sketch, not this slice)

Parked — same lineage grade ups, realm chapters, new cultivate actions. Not blocking.

---

## Prerequisites

- [x] Owner P2 lock-in — 2026-07-22
- [x] Stamp + lock on current FE seal
- [x] `FOUNDATION_NATURES` catalog (five natures)
- [x] Test manuals for non-plain natures + shelf “Seals:” line
- [x] Sword sharper aura in NPC chat (light)
- [ ] Meridian-wash — later, after playtest
- [ ] More natures + methods (next pass)
- [ ] Combat % balance pass after playtest
- [ ] FE redesign integrates same stamp helper when journey rewrite lands

## Open questions (parked)

- Meridian-wash frequency/cost — ship later, playtest
- Exact combat signature numbers — playtest
- When Intent-ease and blood intimidation get full wiring
- Method realm-chapter / deepening design pass

## Implementation crumbs

- `consolidation.js` / FE Seal Dantian — `stampFoundationNatureAtFeSeal`
- `cultivation-methods.js` — nature helpers, shelf stamp preview, `hasSwordSharperAura`
- `data.js` — `FOUNDATION_NATURES`, `CULTIVATION_METHOD_POOL`
- `npc.js` — sword aura greet/talk notes
- `foundation.js` / chamber — nature label beside quality
}
