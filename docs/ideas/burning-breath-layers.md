# Burning Breath — method layers (layer 2 sketch)

| Field | Value |
|-------|-------|
| **Status** | `designed` (layer 2 sketch only) |
| **Blocked on** | Elemental breath set playtest ([#64](https://github.com/WanderingImmortal/tales-immortal-path/pull/64)); layer save shape |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chat, 2026-07-23 |
| **Updated** | 2026-07-23 |

## Intent

**Layers** are depth inside one manual — not a better scroll, not a grade bump, not a new nature stamp. Burning Breath layer 1 is what ships today: comprehend, walk, gather, seal **fire-aspected**.

Layer 2 should feel like **the art opened a little** — worth months of practice, not a second job. Unlock leans **enlightenment / insight**, not finding a teacher (teachers reserved for higher tiers or other systems later).

Related: [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md) (layers stub), [`technique-driven-cultivation.md`](technique-driven-cultivation.md) (nature vs grade).

---

## What layer 2 is *not*

| Not this | Why |
|----------|-----|
| New `methodGrade` | Grade = copy quality; capped by mortal tier (common max) |
| New `stampsNature` | Nature fixed at FE seal from layer-1 path |
| Big cultivate speed mult | Grade + roots own pacing; layers add **tools**, not another speed lever |
| Teacher quest gate | Owner direction: enlightenment for early layers |

---

## Layer 2 name & fiction

**Ember Insight** (internal id: `ember_insight`) — the cultivator stops fighting the heat and learns to *listen* to it. Not a new scripture; the same Burning Breath, understood one level deeper.

Log line on unlock: *"The flame in your dantian steadies — not hotter, but truer. You have touched the second layer of the Burning Breath."*

---

## Unlock — enlightenment, not instructor

**Primary path (grind + insight):**

1. Active primary = `burning_breath_technique` (or same `lineageId` after compatible tier swap later).
2. **≥ 35 chamber Gather** actions on this path (count per-life on lineage, not global).
3. During gather or short seclusion, roll **Ember Insight** (base **8%** per eligible action after step 2 met; pity +2% per fail, cap one insight per 6 months).

**Alternate path (enlightenment beat):**

- Complete any **seclusion project ≥ 10 years** while on Burning Breath → guaranteed insight if step 2 already met; otherwise counts as +15 gathers toward threshold.

No NPC teacher. Optional future hook: meditating at a **fire anchor** (volcano tile, ashen shrine) doubles insight chance — location bonus, not a quest giver.

---

## Layer 2 benefits (modest, worth the grind)

Three small effects — identity + one new verb. Tuned so total power is **noticeable, not build-defining**.

### 1. Chamber verb — **Kindle Dantian** (main payoff)

New qi-chamber action, unlocked only at layer 2.

| | Gather (layer 1) | Kindle Dantian (layer 2) |
|--|------------------|---------------------------|
| Time | 1 week | **4 months** |
| Density | random min–max roll | same roll but **floor +25%** of min |
| Qi fill | normal | normal |
| Cooldown | none | **once per 12 in-game months** |
| Fiction | steady breath cycles | force a breath "surge" — condense heat deliberately |

Feels different from plain gather: slower, spikier, player-chosen timing. Good for players who want to push density before seal without another speed mult.

### 2. Passive — **steady flame** (+stability)

`profile.stabilityBias` **+0.02** while layer 2 active on this lineage (helps FE seal quality slightly; stacks with method's base 0.04 → 0.06 total). No gather speed change.

### 3. Signature nudge — **truer fire** (+nature magnitude)

`+0.04` to foundation-nature magnitude multiplier for **fire-aspected** effects only (if sealed before unlock, apply retroactively). Roughly **+1–2% effective** fire technique damage on top of the base 6% — not a second damage stat.

**Deliberately omitted from layer 2:** tribulation skew, new combat techniques, realm cap changes, auto-upgrade to condensation-tier manual.

---

## Save shape (implementation sketch)

```js
G.cultivationMethod.layer = 1;              // max unlocked layer on active lineage
G.cultivationMethod.layerProgress = {
  burning_breath_line: {
    gatherCount: 0,
    insightFails: 0,
    lastInsightMonth: null,
    unlocked: ['ember_insight']  // layer 2 id
  }
};
```

Layer progress keyed by **`lineageId`**, not `primaryId`, so a future condensation-tier fire manual in the same line inherits layer depth.

---

## UI

- Path card: `Burning Breath · Common · Layer II / Ember Insight`
- Chamber: Kindle Dantian button with cooldown tooltip
- Pre-seal preview unchanged (still stamps fire-aspected); post-unlock note: *"Deeper practice will sharpen the seal's fire."*

---

## Higher layers (parked)

| Layer | Working name | Unlock sketch | Benefit sketch |
|-------|--------------|---------------|----------------|
| 3 | **Blazing Circulation** | GC-era; rare pill or calamity survival | Second cooldown ability or fire-zone ambient bonus |
| 4+ | TBD | Strong enlightenment / dao beat | Tie to absorption family (fire anchors) — not mortal tier |

Teachers, sect promotion, and **array** hooks belong here or on **tier upgrades**, not layer 2.

---

## Open questions

- [ ] Insight roll on gather only, or also on Kindle Dantian?
- [ ] Should layer 2 be **losable** on meridian-wash (fire → water resets lineage progress)?
- [ ] Pity timer — is 6-month cap right for lifespan pacing?
- [ ] Kindle cooldown: 12 months vs 1 year project cadence?

## Prerequisites

- [ ] Elemental breath PR merged ([#64](https://github.com/WanderingImmortal/tales-immortal-path/pull/64))
- [ ] `G.cultivationMethod.layerProgress` save migration
- [ ] Chamber second action hook (`chamber.js`)

## Implementation crumbs

- `cultivation-methods.js` — layer helpers, lineage progress
- `chamber.js` — `kindleDantian()` action, cooldown month tracking
- `seclusion-project.js` — optional insight grant on long seclusion complete
- `data.js` — `BURNING_BREATH_LAYERS` config block (thresholds, cooldowns)
