# Intent track — design template

| Field | Value |
|-------|-------|
| **Status** | `designed` (meta — copy for new tracks) |
| **Blocked on** | none |
| **Issue** | none |
| **Parent** | [`weapon-intent-cultivation.md`](weapon-intent-cultivation.md) · [`combat-damage-depth.md`](combat-damage-depth.md) |
| **Updated** | 2026-08-01 |

## Intent

**One engine, many tracks.** Sword, Spear, Staff Circle, and Devouring feel different in *fiction and combat knobs* — but they share the **same lifecycle**: awaken → ripen (hidden) → deepen milestones → expand → breakthrough → next intent realm.

**Do not** hand-write five full design docs from scratch. **Do** copy this template, fill the slots, and only go bespoke where the table says **track-specific**.

Worked example: [`devouring-intent.md`](devouring-intent.md) *(PR #95)* — same skeleton, cult names + siphon mechanics.

---

## What is shared (write once in code + one doc)

| Piece | Same for every track |
|-------|----------------------|
| Lifecycle | Groundwork → spark → Intent Realm 1…5 |
| Ripening | Hidden saturation; inward chamber lines; no deepen button |
| Per realm band | 3 auto deepen milestones (~35 / 70 / 100) + **1 expand** |
| Breakthrough | Cultivation ceiling + comprehension beat — **not** meter alone |
| Inward vs outward | Chamber **Within yourself** in v1; sense/conceal later |
| Expression | Cross-wield matrix from [`combat-damage-depth.md`](combat-damage-depth.md) |
| Divided heart | Multiple tracks progress slower |
| Data shape | `INTENT_TRACKS[id]` — see slot checklist below |

---

## What varies per track (fill-in slots)

| Slot | Sword | Devouring | Notes |
|------|-------|-----------|-------|
| **trackId** | `sword` | `devouring` | code key |
| **Display name** | Sword Intent | Devouring Intent | UI |
| **Kind** | `weapon` | `deviant` | deviant = no weaponType gate |
| **Imposed-will word** | edge, line | claim, maw | inward copy voice |
| **Home expression** | slash / cut | consumption | cross-wield target |
| **Realm names ×5** | Sprout → Domain | Stirring → Maw Domain | **flavor only** — same idx 0–4 |
| **Typical cultivation ×5** | FE → GC → NS… | FE → GC → NS… | **not 1:1** — see spans in [`intent-apex-self-will.md`](intent-apex-self-will.md) |
| **Expand arts ×5** | Returning Edge… | Qi Siphon… | **track-specific** — main creative work |
| **Inward signs ×5** | see cultivation doc | cult voice | **copy pass** per band |
| **Boost table** | spar, drill | kills, feast rite | optional overrides |
| **Awakening** | blade groundwork + treasure | stained path + shard | [`weapon-intent-awakening.md`](weapon-intent-awakening.md) |

**Rule:** if a row isn’t in this table, it’s probably **shared** — don’t redesign it per track.

---

## Per-track doc checklist (copy → fill)

Create `docs/ideas/<track>-intent.md` from this section.

### 1. Header

```markdown
| **Status** | `designed` |
| **Parent template** | [intent-track-template.md](intent-track-template.md) |
| **Sect / source** | Celestial Sword / Heavenly Demon Cult / … |
```

### 2. One-paragraph fantasy

What imposed will feels like. *“Sword-will is a line pressed on circulation.”*

### 3. Awakening (if non-default)

| Groundwork (2+ of) | Sparks (1 of) |
|--------------------|---------------|
| … | … |

Skip if orthodox weapon — use generic [`weapon-intent-awakening.md`](weapon-intent-awakening.md) table.

### 4. Intent realms table (required)

| idx | Name | Hanzi (opt) | Typical cultivation | Comprehension beat | Expand art |
|-----|------|-------------|---------------------|--------------------|------------|
| 0 | | | FE | Awakening spark | |
| 1 | | | GC | *First …* beat | |
| 2 | | | NS (TBD) | *First …* beat | |
| 3 | | | TBD | TBD | |
| 4 | | Domain | TBD | TBD | domain art · **Self-Will apex** optional ([`intent-apex-self-will.md`](intent-apex-self-will.md)) |

**Same row count for every track.** Names and beats change; structure does not.

### 5. Per-realm band (repeat ×5 or stub 1–2 and park rest)

For each idx:

| Piece | Content |
|-------|---------|
| **Why this realm** | One sentence — how comprehension changed (*dyadic siphon* vs *just sharper edge*) |
| **Inward signs** | 5 lines (groundwork → post-expand) — **imposed-will voice** |
| **Deepen milestones** | What auto-unlocks at 35 / 70 / 100 (mechanical + log) |
| **Expand art** | Name, id, combat hook (1 paragraph) |
| **Breakthrough gates** | Cultivation + beat + syllabus if any |

**Shortcut for weapon tracks:** realms 3–5 can be `TBD — copy Sword structure, swap names` until that band ships.

### 6. Expression row (one line)

Point at cross-wield column in combat-damage doc; note any track-only twist.

### 7. Boost overrides (optional)

Only list boosts **different** from default saturation table.

---

## Expand art — small internal template

Every expand fits one of a few **roles** so combat code stays generic:

| Role | Examples | Hook shape |
|------|----------|------------|
| **Strike** | Returning Edge, Qi Siphon | on basic / on hit |
| **Pressure** | Blade Pressure, Predator's Mark | vs wounded / vs guarded |
| **Sustain** | Circulating Guard, Iron Knuckle | resource / cost |
| **Domain** | Edge Domain, Maw Domain | fight opener / aura |

New art = pick role + track flavor. Engine merges `expressionModifier` blob — not a new combat branch.

---

## When to break the template

| Situation | OK to diverge |
|-----------|----------------|
| Deviant track (Devouring, future Blood Emperor, etc.) | No `weaponType`; own awakening + boost table |
| Staff Circle | Expand arts tagged `reach` / `hold` / `conduct` — same 5 realms |
| Prodigy realm early | Same idx, different **typical** cultivation — one flag |
| Law / Dao Seeking+ | **New doc layer** — intent template stops at Domain; Law is separate ([`devouring-law.md`](devouring-law.md)) |

**Not OK:** different number of realms per track, deepen-or-expand fork, visible grind button per track.

---

## Work estimate (honest)

| Track type | Custom work |
|------------|-------------|
| **Orthodox weapon** (Spear, Fist, …) | ~1 page: names, inward lines, 5 expand blurbs, comprehension beat names |
| **Weapon with twist** (Staff Circle) | +half page: Reach/Hold/Conduct tags |
| **Deviant + sect life** | Template + full [`heavenly-demon-cult-life.md`](heavenly-demon-cult-life.md) spine |
| **Engine / code** | **Once** — saturation, milestones, expression merge |

You are not writing five games. You are filling **five rows** in the realms table and **five expand slots**.

---

## Index of tracks (fill as designed)

| Track | Doc | Status |
|-------|-----|--------|
| Sword | *(inline / TBD stub)* | expand arts in `data.js` |
| Blade | — | expand arts in `data.js` |
| Spear | — | expand arts in `data.js` |
| Fist | — | expand arts in `data.js` |
| Staff (Circle) | [`combat-damage-depth.md`](combat-damage-depth.md) | Circle + expand ladder sketched |
| Devouring | [`devouring-intent.md`](devouring-intent.md) *(PR #95)* | most complete deviant example |

---

## Open questions

- Ship all five weapon inward-sign tables in one PR or one track per sect release?
- Stub realms 3–5 as `TBD` until NS band is designed globally?

## Implementation crumbs (when building)

- `data.js` — `INTENT_TRACKS` registry: shared defaults + per-track overrides
- `intent.js` — generic saturation, milestone, expand unlock — **no per-track branches**
- Per-track content: mostly data + inward-sign string tables
