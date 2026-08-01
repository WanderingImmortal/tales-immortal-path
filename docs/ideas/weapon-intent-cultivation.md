# Weapon Intent — cultivation loop (redesign)

| Field | Value |
|-------|-------|
| **Status** | `designed` (planning — owner 2026-08-01) |
| **Blocked on** | none for design; build Issue not opened |
| **Issue** | none yet |
| **Chat / PR** | Intent planning — [PR #91](https://github.com/WanderingImmortal/tales-immortal-path/pull/91) · sister work [PR #95](https://github.com/WanderingImmortal/tales-immortal-path/pull/95) (awakening + Demon Cult life) |
| **Updated** | 2026-08-01 |

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
| **Deepen steps** | 2–3 per realm | “My sword intent sharpens.” |
| **One Expand unlock** | 1 per realm | “A new expression opens.” |
| **Breakthrough beat** | 1 per realm | Story / comprehension — not uses alone |

### Example — Sword intent, Realm 1 (Sprout) @ FE

| Step | Type | Effect |
|------|------|--------|
| 1 | Deepen | +basics / expression efficiency |
| 2 | Deepen | Cross-wield palm → stronger cut lean |
| 3 | Deepen | Cap — tier polish for Sprout |
| 4 | **Expand** | **Returning Edge** unlocks |
| — | *gate* | FE stable + N uses + optional spar/witness beat |
| → | **Realm 2** | Minor Success — expression rewrite gets real |

Realm 2 deepen chain → **Blade Pressure** expand. Realm 3 → **Edge Domain**. Same pattern for Spear, Fist, Staff, Devouring.

### Staff (Circle intent) — expand slots by leg

| Realm | Expand art (draft) | Leg |
|-------|-------------------|-----|
| 1 | **Circulating Guard** (rewrite or keep) | Hold |
| 2 | **Reach Sweep** *(new)* | Reach |
| 3 | **Sanctuary Domain** or **Vein Channel** | Hold / Conduct |

Retire “all three staff expands are defensive” — Circle needs **Reach** and **Conduct** picks in the ladder.

---

## How intent grows (more than combat clicks)

Uses still matter, but **intent cultivation** pulls from the same life as your path:

| Source | Role |
|--------|------|
| **Combat** with active intent | Primary use gain (today) |
| **Meditate with weapon** | FE+ action — groundwork before awaken; polish between realms after |
| **Manual / canon layer** | Sect syllabus unlocks breakthrough rites (Demon Cult Layer 3 before Taking) |
| **Comprehension beats** | First Taking, First Feast, witness duel, spar imprint — **not** automatic at use threshold |
| **Realm breakthrough** | Opens next intent realm **ceiling** |
| **Refine intent** (months action) | Bonus polish — supplement, not the whole loop |

Intent should show up in **decades of play**: awaken at FE, polish through GC missions, domain at NS+ — same rhythm as [`heavenly-demon-cult-life.md`](heavenly-demon-cult-life.md) rank × realm table.

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
| `pendingIntentChoice` deepen **or** expand | Deepen steps until cap → expand unlock |
| `INTENT_TIERS` use-only breakpoints | Intent realm gates + use floor + comprehension beat |
| `INTENT_EXPAND_ARTS` fixed 3×3 grid | Per-realm one expand; deepen count per realm |
| `refineActiveIntent` only polish | Part of a richer intent screen (meditate, breakthrough, preview next expand) |

---

## Open questions

- Exact deepen steps per realm (2 vs 3)
- Whether weapon tier names rename to match “intent realm” vocabulary in UI
- Shared breakthrough UI for weapon + deviant tracks
- Can you **delay** expand to keep deepening (owner: probably no — expand is the band capstone)
- Second awakened intent: divided heart + separate deepen/expand tracks per intent

## Prerequisites

- [ ] Merge or cross-link PR #95 awakening + cult life docs
- [ ] Owner pass on Sword/Spear/Staff expand ladder names
- [ ] Update `devouring-intent.md` fork language when consolidating branches

## Implementation crumbs (when building — not now)

- `intent.js` — realm model, deepen cap, expand unlock, breakthrough beats
- `data.js` — `INTENT_EXPAND_ARTS` per realm; `INTENT_DEEPEN_STEPS` per weapon
- `ui.js` — intent screen: realm, deepen progress, next expand preview, unawakened hints
- `heavenly-demon-cult-life.md` — rank promotions tied to intent realm gates
