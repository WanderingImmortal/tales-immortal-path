# Weapon Intent — awakening redesign (stub)

| Field | Value |
|-------|-------|
| **Status** | `designed` (stub — owner chat 2026-07-31) |
| **Blocked on** | Owner pass on first catalyst items; FE interior slice |
| **Issue** | none yet |
| **Chat / PR** | Planning chat 2026-07-31 |
| **Updated** | 2026-07-31 |

## Intent

Replace the **five-weapon picker** at Foundation with **earned awakening**: rare sparks (treasures, tempered relics, enlightenment moments) only work when the cultivator has already **walked a path** (groundwork). Intent is something that *happens to you*, not a class select.

Sister docs: [`devouring-intent.md`](devouring-intent.md) (deviant track), [`realm-claims.md`](realm-claims.md) (Anchor claim @ FE), [`technique-driven-cultivation.md`](technique-driven-cultivation.md) (foundation nature ≠ intent gate).

## Design notes

### Core rule (owner lock)

> **Two layers, both required:** groundwork (living with a shape) + spark (rare catalyst or moment). No menu.

| Layer | Player feel | Game sketch |
|-------|-------------|-------------|
| **Groundwork** | "I've been walking this road." | Hidden or lightly hinted affinity: meditate with weapon, carry blade, learn matching arts, spar worthy foes, foundation nature |
| **Spark** | "Something clicked." | Named treasure, tempered relic, witness enlightenment, rare spar imprint |

Swinging a sword many times alone is **not** enough. Meditating *with* the sword, carrying it, losing yourself in its weight — that is groundwork. The spark confirms it.

### Remove

- Intent popup **weapon picker** (`chooseWeaponIntent` five buttons)
- Fiction that intent is freely chosen at FE like picking a loadout

### Keep (unchanged for now)

- FE unlock (`minRealm: 1` dantian) — you can **hold** intent after Anchor
- Tiers: Sprout → Minor Success → Major Success → Perfection → Intent Domain
- Deepen vs Expand fork at breakpoints
- Divided heart (multiple intents progress slower)
- Intent sleeps off dantian path
- Technique intent gates (`intentReq` on manuals)
- Intent Domain arts ≠ GC realm Domain ([`domain-system.md`](domain-system.md))

### FE intent band (owner lock 2026-07-31 — cross-ref [`devouring-intent.md`](devouring-intent.md))

**Full intent ceiling TBD.** For FE slice: treat **awakening (tier 0 — Stirring)** as **rare**; **Taking** (tier 1) during FE as **prodigy**. Higher tiers parked until Core+ design pass. Weapon tracks keep Sprout / Minor Success labels until rename pass; devouring uses **Stirring / Taking**.

---

### Spark type A — Natural treasures (strict)

| Rule | Detail |
|------|--------|
| **Fixed intent** | Item defines what can be born (e.g. edge-shard → sword-shaped intent) |
| **Resonance gate (owner lock: C)** | Wrong groundwork → nothing happens. Item **waits** in inventory. |
| **Player knows upfront** | Examine text states birthing intent + required groundwork |

Example examine line:

*"Birthing intent: Sword. Requires: you have walked the sword path. If your heart is elsewhere, it will not answer — yet."*

### Spark type B — Tempered weapons / relics (open read)

| Rule | Detail |
|------|--------|
| **Never force intent change** | Relic describes its imprint openly |
| **Mismatch** | Player sees it won't take root; stash, sell, or pivot groundwork on purpose over months |
| **Adjacent aid (parked)** | Similar groundwork *might* ease awakening of a related intent — not copy the dead cultivator's. Owner unsure; ship open-read first |

### Spark type C — Enlightenment moments (situational)

| Situation | Likely intent | Notes |
|-----------|---------------|-------|
| Witness apex duel, fall into trance | Sword / spear (lineage intents) | Opponent far above station |
| Rare spar vs worthy foe | Matches their weapon **if** groundwork aligned | Not training-dummy procs |
| Near-death vs specific style | Blade, fist, etc. | Trauma imprint |
| Meditate months in keyed place + weapon | Staff, fist | Place + posture matter |

**Witness vs spar:** witness is safer and scriptable once; spar is rare and opponent-quality gated.

### Groundwork (not 10,000 swings)

Track affinity toward a **shape** (invisible or hinted):

- Carried weapon type
- Learned techniques / manuals
- **Meditate with weapon** — FE action or cultivate variant ("sit with your blade")
- Serious spars (not trash mobs)
- Foundation nature (`sword_inclined` = head start, not auto-awaken)

Resolve on spark:

```
if (named natural treasure) → that intent, or fail if groundwork mismatch (item waits)
else if (tempered relic + months meditation) → open read; aid or no resonance
else if (enlightenment moment) → highest groundwork + scene tags
else → not ready
```

### Deviant intents

Not all intents are Sword / Blade / Spear / Fist / Staff. **Devouring Intent** ([`devouring-intent.md`](devouring-intent.md)) is the first special track — cult lineage, consumption fantasy, separate awakening sparks.

Weapon intents and deviant intents share tier **structure** (deepen / expand / domain) but different spark pools and expand art tables.

---

### UI direction (stub)

At FE, Intent screen shows:

- *Unawakened — seek a spark*
- Optional hint: *"Your qi leans toward…"* (if groundwork > threshold)
- List awakened intents (weapon + deviant) once earned
- No picker for unawakened state

---

### v1 scope (when building)

Ship **one of each** spark type before expanding:

| Piece | Example |
|-------|---------|
| Named treasure | TBD — one Dustbone/FE ultra-rare |
| Tempered relic | TBD — one NPC or field boss drop |
| Enlightenment | TBD — witness fight above station |

Do **not** build five bespoke awakening quests in v1.

## Prerequisites

- [ ] Owner names first treasure + first relic + first enlightenment beat
- [ ] Define minimum groundwork flags per weapon shape
- [ ] Remove weapon picker; add spark resolution helper
- [ ] Devouring Intent design locked ([`devouring-intent.md`](devouring-intent.md))

## Open questions

- Exact groundwork thresholds (months meditating? one manual? carried weapon duration?)
- Tempered relic: consumable imprint vs permanent gear with no post-awaken effect
- Adjacent-aid rule for similar groundwork + mismatched relic
- Second intent: same spark rules + divided heart — no free pick

## Implementation crumbs

- `intent.js` — `chooseWeaponIntent`, `ACTION_MONTHS.intentChoose`
- `ui.js` — `renderIntentPopup` weapon buttons
- `data.js` — `ACTION_UNLOCKS.intent`, `INTENT_EXPAND_ARTS`, catalyst item tables (future)
- `npc-betrayal.js` — `getSoulSearchBetrayalReadout` (separate "ill intent" — do not merge)
