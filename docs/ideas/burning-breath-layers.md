# Burning Breath — method layers (layer 2 sketch)

| Field | Value |
|-------|-------|
| **Status** | `idea` (revising — owner pushback on flashy L2 for market syllabi) |
| **Blocked on** | Tier/layer policy decision; elemental breath playtest ([#64](https://github.com/WanderingImmortal/tales-immortal-path/pull/64)) |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chat, 2026-07-23 |
| **Updated** | 2026-07-23 |

## Intent

**Layers** are depth inside one manual — not a grade bump, not a new nature stamp. The open question for **Burning Breath** specifically: should a **mortal-tier market pamphlet** have cool layer unlocks at all?

Owner direction (2026-07-23): *Kindle the Dantian* sounds too impressive for something anyone buys at the local market. Flashy layer payoffs may belong on **higher-tier** manuals, not standard outer-court syllabi.

Related: [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md), [`technique-driven-cultivation.md`](technique-driven-cultivation.md).

---

## Policy fork (pick one)

### A — **Market syllabi have no layers** *(owner lean)*

Burning Breath **is** layer 1. The whole pamphlet. No Ember Insight, no new chamber verbs.

| What “progress” means | How |
|-----------------------|-----|
| Better fire cultivation | Find a **higher-tier compatible** manual (condensation fire cycle) |
| Deeper mechanics | That manual's layers / chapters |
| Market breath job | Pick element + stamp nature at seal — done |

**Kindle Dantian** (or similar) moves to a future **condensation-tier fire method** — where a named surge-gather fits the fantasy.

### B — **Mastery fluff only** on market syllabi

Optional “you finished the pamphlet” beat — **no new mechanics**:

- Diary line after N gathers: *"You have nothing left to learn from the Burning Breath pamphlet."*
- Tiny polish: `rootFit.fire` +0.02 (you finally breathe it correctly)
- NPC flavor: elder notes you’ve mastered the syllabus

No chamber buttons, no magnitude bumps worth caring about in combat.

### C — **Layers on everything** *(rejected for mortal tier for now)*

Previous sketch — Ember Insight + Kindle Dantian. Shelved for market manuals; may revisit for superior+ tier only.

---

## If policy A: what Burning Breath layer 1 includes

Everything shipped in [#64](https://github.com/WanderingImmortal/tales-immortal-path/pull/64):

- Walk path → gather with normal chamber verb → seal **fire-aspected**
- `rootFit` fire bonus / water penalty
- +6% fire technique dmg from nature

**That's the complete outer-court product.** Grind worth = choosing fire identity early, not unlocking secret techniques from a 50-stone scroll.

---

## Where cool layers *do* live (draft)

| Manual tier | Example | Layer fantasy |
|-------------|---------|---------------|
| **Mortal / market** | Burning Breath | None (or mastery fluff only) |
| **Condensation** | Blazing Meridian Cycle *(future)* | Layer 2: Kindle-style surge gather; enlightenment unlock |
| **Foundation+** | Vermillion Sun fragment *(P3)* | Realm chapters, array fuel, essence milestones |
| **Superior / sect inheritance** | Inner Court–grade fire line | Named layers, maybe teacher *or* enlightenment for layer 3+ |

**Unlock style by tier:**

| Tier | Layer unlock |
|------|----------------|
| Market mortal | N/A or passive mastery |
| Condensation+ | Enlightenment / insight rolls, seclusion, location anchors |
| Rare / forbidden | Enlightenment + rare materials; teachers optional for highest layers |

---

## Shelved sketch — Ember Insight + Kindle Dantian

Kept for reference if we ever attach layers to **non-market** fire manuals. Not recommended for Burning Breath.

<details>
<summary>Previous layer 2 proposal (collapsed)</summary>

- Unlock: ~35 gathers + insight roll / long seclusion
- **Kindle Dantian**: 4-month surge gather, density floor +25%, 12-month cooldown
- +0.02 stability, +~1–2% fire nature magnitude

**Why shelved:** wrong fantasy tier for a market pamphlet.

</details>

---

## Open questions

- [ ] Confirm policy **A** (no layers on mortal market breaths) vs **B** (mastery fluff only)?
- [ ] Name/sketch condensation-tier fire successor (Blazing Meridian Cycle?) — home for Kindle Dantian?
- [ ] Does “pamphlet mastered” show in UI at all, or invisible?

## Prerequisites

- [ ] Owner tier/layer policy locked
- [ ] Elemental breath PR merged

## Implementation crumbs

- If **A**: no code for Burning Breath layers
- If **B**: gather counter + one diary line in `cultivation-methods.js` / `chronicle-diary.js`
- Kindle Dantian (if ever): `chamber.js` on condensation-tier fire method
