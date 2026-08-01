# Weapon Intent — cultivation loop (redesign)

| Field | Value |
|-------|-------|
| **Status** | `designed` (planning — owner 2026-08-01) |
| **Blocked on** | none for design; build Issue not opened |
| **Issue** | none yet |
| **Chat / PR** | Intent planning — [PR #91](https://github.com/WanderingImmortal/tales-immortal-path/pull/91) · sister work [PR #95](https://github.com/WanderingImmortal/tales-immortal-path/pull/95) (awakening + Demon Cult life) |
| **Updated** | 2026-08-01 (deepen = passive saturation + boosts, not a button) |

## Intent

Intent should grow **alongside cultivation** — not a side minigame you tick once at Foundation. It is a comprehension you **awaken**, **deepen** through lived practice, **expand** into named expressions, and **break through** into higher intent realms as your main realm rises.

**Owner lock (2026-08-01):** retire **Deepen *or* Expand** at each breakpoint. New loop: **deepen within the band → expand when the band is full → breakthrough to the next intent realm** (with cultivation + comprehension gates). Keeps every deepen bonus **and** every expand art — nothing thrown away.

Sister docs:

| Doc | Job |
|-----|-----|
| [`combat-damage-depth.md`](combat-damage-depth.md) | How intent **expresses** in hits (cross-wield, Circle, Sword vs Blade) |
| [`weapon-intent-awakening.md`](weapon-intent-awakening.md) *(PR #95)* | How intent is **born** — groundwork + spark, no weapon picker |
| [`devouring-intent.md`](devouring-intent.md) *(PR #95)* | Deviant track template — intent realms, gates, cult life |
| [`heavenly-demon-cult-life.md`](heavenly-demon-cult-life.md) *(PR #95)* | Sect life × realm × intent spine (copy pattern for Sword Sect, etc.) |

> **Planning only.** Existing `intent.js` deepen/expand fork and weapon picker may be **rewritten** when this ships.

---

## What’s wrong today

| Today | Problem |
|-------|---------|
| Weapon **picker** at FE | Feels like a class select, not xianxia awakening |
| **Deepen or Expand** fork | Throws away half the design at every tier |
| Uses from **combat only** | Thin loop — one `refineActiveIntent` action, not a life path |
| **Refine / Deepen buttons** | “Spend 3 months to deepen” is **meh** — another menu tick, not a life system |
| Tier names tied to **use count only** | Intent can outrun or lag cultivation realm with no story |
| Expand arts on **basics only** | Techniques don’t inherit your expression |

---

## New loop (plain language)

```text
Awaken (spark + groundwork)
  → Intent Realm 1 — live in it, fight, meditate with your shape
  → Deepen, deepen, deepen… (band fills)
  → Expand — unlock one named expression (Returning Edge, Qi Siphon, …)
  → Breakthrough to Intent Realm 2 — needs higher cultivation + a comprehension beat
  → repeat until Domain
```

**Deepen** = *the intent gets truer inside you* — stronger expression, better cross-wield, small combat bonuses.

**Expand** = *the intent shows a new face to the world* — a named art, technique tint, or signature behavior.

You earn **both**. Expand is the **reward for finishing** the deepen track in that band, not a rival choice.

---

## Intent realms × cultivation realms

Intent has its **own** realm ladder (comprehensions), but each step is **gated by** your main cultivation band. Weapon tracks can keep orthodox tier names; deviant tracks (Devouring) keep cult names — **same structure**.

| Intent realm | Weapon names (draft) | Typical cultivation | What changes |
|--------------|----------------------|---------------------|--------------|
| **1st** | Sprout / Stirring | Foundation Establishment | Intent awakens; expression is weak; cross-wield is flavor |
| **2nd** | Minor Success / Taking | Golden Core | Expression rewrites mismatched arts; first expand arts matter in duels |
| **3rd** | Major Success / Feast | Nascent Soul (TBD) | Techniques inherit expand arts; stress / expression stack |
| **4th** | Perfection / Surfeit | Void / Dao Seeking band (TBD) | Near-domain polish |
| **5th** | Intent Domain / Maw Domain | High immortal band (TBD) | Signature domain manifestation |

**Prodigy bypass:** break intent realm **before** cultivation realm if gates are met (FE Taking, etc.) — rare, loud, from [`devouring-intent.md`](devouring-intent.md).

**Ceiling:** you cannot **break through** to Intent Realm 2 while still QC. Intent **sleeps** off the dantian path (keep today’s rule).

---

## Within one intent realm — deepen then expand

Each intent realm has:

| Piece | Count (draft) | Player feel |
|-------|---------------|-------------|
| **Deepen milestones** | 2–3 per realm (saturation 35 / 70 / 100) | Automatic — “My sword intent sharpened.” |
| **One Expand unlock** | At 100% saturation | “A new expression opens.” |
| **Breakthrough beat** | 1 per realm | Story / comprehension — not meter alone |

### Example — Sword intent, Realm 1 (Sprout) @ FE

| Saturation | What happens |
|------------|--------------|
| **35%** | Deepen 1 — +expression efficiency |
| **70%** | Deepen 2 — cross-wield palm → stronger cut lean |
| **100%** | Deepen 3 cap → **Expand: Returning Edge** (short ceremony) |
| *gate* | FE stable + comprehension beat → **Realm 2** (Minor Success) |

Player might hit 100% in year 40 or year 120 depending on fights, sect life, and whether they bother with meditate-with-weapon — not on how many times they clicked Deepen.

Realm 2 saturation track → **Blade Pressure** expand. Realm 3 → **Edge Domain**.

### Staff (Circle intent) — expand slots by leg

| Realm | Expand art (draft) | Leg |
|-------|-------------------|-----|
| 1 | **Circulating Guard** (rewrite or keep) | Hold |
| 2 | **Reach Sweep** *(new)* | Reach |
| 3 | **Sanctuary Domain** or **Vein Channel** | Hold / Conduct |

Retire “all three staff expands are defensive” — Circle needs **Reach** and **Conduct** picks in the ladder.

---

## How intent grows (saturation sources)

The meter is fed by **living**, not intent-menu chores:

| Source | Saturation role |
|--------|-----------------|
| **Combat** with active intent | Large chunk per fight — primary driver |
| **Meditate with weapon** | Cultivate/chamber **mode** — steady boost, no extra button |
| **Manual / canon layer** | Lump on comprehend; ties syllabus to intent ([`heavenly-demon-cult-life.md`](heavenly-demon-cult-life.md)) |
| **Sect life** | Drills, hunts, missions — faction-specific boost table |
| **Comprehension beats** | One-time spikes; **realm breakthrough** still needs these, not meter alone |
| **Passive drip** | Slow months while on-path — tops out ~60–70% without boosts |
| **Seclusion** *(optional)* | Rare high burst if owner wants one explicit “focus will” action |

Intent should show up in **decades of play**: awaken at FE, saturation creeps through GC missions, expand at NS+ — same rhythm as cult life rank × realm table.

---

## Awakening (from PR #95 — keep)

No weapon picker. **Groundwork + spark.** See [`weapon-intent-awakening.md`](weapon-intent-awakening.md).

After awaken: track opens at **Intent Realm 1**, 0 deepen steps, 0 expand arts.

---

## Deviant intents (same skeleton)

**Devouring Intent** is the template for non-weapon tracks — same deepen → expand → breakthrough, different names and gates. Update [`devouring-intent.md`](devouring-intent.md) when this doc merges: change “pick Deepen or Expand” tables to **sequential** deepen chain + expand unlock per realm.

| | Weapon Sword | Devouring |
|--|--------------|-----------|
| Realm 1 expand | Returning Edge | *(none at Stirring — siphon is Realm 2)* |
| Realm 2 expand | Blade Pressure | Predator's Mark |
| Deepen in Realm 2 | +line / +synergy | +conversion / +siphon |

---

## What we can rewrite (owner OK)

| Legacy | Direction |
|--------|-----------|
| `chooseWeaponIntent` picker | Spark resolution |
| `refineActiveIntent` / deepen button | **Intent Saturation** meter + milestones |
| `pendingIntentChoice` deepen **or** expand | Saturation milestones + expand at 100% |

---

## Open questions

- Saturation milestone % (35/70/100 vs 50/100)
- Passive soft cap exact value (60 vs 70)
- **Decay** if neglect intent for decades — yes/no (lean no for v1)
- Meditate-with-weapon: new cultivate tab vs FE chamber toggle
- Seclusion burst — keep one optional action or fold entirely into meditate mode
- Whether weapon tier names rename to match “intent realm” vocabulary in UI
- Shared breakthrough UI for weapon + deviant tracks
- Second awakened intent: divided heart + separate saturation tracks

## Prerequisites

- [ ] Merge or cross-link PR #95 awakening + cult life docs
- [ ] Owner pass on Sword/Spear/Staff expand ladder names
- [ ] Update `devouring-intent.md` fork language when consolidating branches

## Implementation crumbs (when building — not now)

- `intent.js` — saturation meter, milestone auto-deepen, expand at 100%, breakthrough beats
- `data.js` — `INTENT_SATURATION_BOOSTS` per activity; expand per realm; milestone effects
- `ui.js` — intent screen: saturation bar, active boosts, next milestone (no deepen button)
- `chamber.js` / cultivate — meditate-with-weapon mode feeds saturation
- `heavenly-demon-cult-life.md` — rank promotions tied to intent realm gates
