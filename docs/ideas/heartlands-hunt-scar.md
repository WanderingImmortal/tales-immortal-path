# Heartlands hunt scar (Forbidden Ground)

| Field | Value |
|-------|-------|
| **Status** | `designed` (fiction + player loop — code later) |
| **Blocked on** | High-realm climb fleshed enough that DM content matters; Forbidden Ground rewrite Issue |
| **Issue** | none yet |
| **Chat / PR** | Local design 2026-07-30–31 · `cursor/void-prisoner-origin-docs` / PR #93 |
| **Updated** | 2026-07-31 |

Parent: [`void-prisoner.md`](void-prisoner.md). Temple frame: [`void-temple-sect.md`](void-temple-sect.md). Live stubs today: `FORBIDDEN_GROUNDS.mirror_lake`, `celestial_observatory` in [`data.js`](../../data.js).

**Agents:** this is the **cage/hunt battlefield scar** in the Heartlands — not Void Temple HQ (Hanging Star), not a Grotto Master site, not a disciple’s body (those are Sealed Ancients — later pass).

---

## Intent

One continental Forbidden Ground where players can **enter**, risk a **Dao Manifestation–tier** battlefield, and walk out with **top-band** rewards and lore — residue of boxing the Void Prisoner. Allure is “come have a look” **and** survive paid/changed — not map wallpaper.

---

## Design notes

### Replaces (fiction)

| Today | Fate |
|-------|------|
| **Mirror Lake** (reflection duel) | **Park fantasy** for a **future sect trial**. Free the Heartlands FG slot. |
| **Celestial Observatory** (star honesty quiz) | **Drop as standalone** — “void/sky watches” vibe folds into **outer ring**. Not Hanging Star. |

Implementation later: rename/reuse `mirror_lake` and/or retire `celestial_observatory`; retarget story delve + `ANCIENT_FORBIDDEN_CLUES` hooks.

### Site shape

```text
[ Outer ring — Law Wreck ]
   DM coalition worn-laws clashed holding him down
        ↓
[ Inner ring — Cycle Wound ]
   true Samsara stepped / tore — life/death will not finalize
```

Working display name: **The Unclosed Field** (final name TBD). Data id TBD (`cycle_wound` / reuse `mirror_lake`).

### Outer — Law Wreck

**Why:** Climax of the hunt — Void Seeker (DM) + peer DMs wore heaven’s **shadow** laws at once to pin him. True Samsara would not take a clean ledger kill; overlapping Manifestations **burned the ground**. Scar still argues with itself.

**Feel (keep a bit vague):** law weather; techniques skew/mute; debris of worn heavens; leftover ledger/sky pressure (salvaged Observatory). Rumor: “where the sky broke,” not “Void Temple tower.”

**Player:** enterable first. DM-tier fights/hazards. Loot worn-law scrap / high mats. **Bail** with partial payout, or open the path inward.

### Inner — Cycle Wound

**Why:** Where he **just stepped onto true Samsara** (or the Work tore through). Cycle rules fail locally — unfinished endings, things that will not stay down. Continental “don’t.”

**Feel:** quiet wrongness over spectacle. Lifespan / unfinished-death pressure. Optional echo of old Mirror: a **life that will not close**, not a build-mirror duel.

**Player:** enterable after outer (or hard gate). Full clear = real prize.

### Realm gate and rewards

| Rule | Lock |
|------|------|
| **Below Dao Manifestation** | Effectively **instakill / refuse** — taboo weight |
| **At DM** | Survivable but **dangerous** |
| **Reward band** | Matches the gate — top-band, not early FG chips |

**True Samsara at center — do not grant full true path.** That is board-break and fights [`void-prisoner.md`](void-prisoner.md) true/shadow locks.

| Inner clear gives | Is |
|-------------------|-----|
| **Cycle Glimpse** | Life/Death greater progress and/or fragment that *points at* true cycle |
| **Scar Boon** | High-band lasting perk (e.g. once/life death-save, decay resist, shadow Samsara wear bonus) |
| **Lore / Void hook** | Temple notice, prisoner rumor, chronicle |
| **Not** | True Samsara wield, ledger-immune body, Little Heaven key |

Player line: *I touched the real cycle — and lived. Heaven’s copy will never feel the same.*  
Game truth: shadow path enriched + mythic souvenir; **true path stays locked**.

### Clear fantasy

Not free the prisoner (he is in Little Heaven). **Walk the scar and take what the clash left.**

### Related pins (out of scope here)

- **Root Warden / Root of the World** — leave alone this pass (continental lock / Void clue).
- **Sealed Ancients as disciples** — default lean for later; **not** this FG; **not** Grotto Masters (Chaos-path parked fiction).
- Most other Forbidden Grounds — other story later.

---

## Prerequisites

- [x] Prisoner origin parked ([`void-prisoner.md`](void-prisoner.md))
- [ ] High-realm climb deep enough that DM content is reachable in normal play
- [ ] Build Issue: merge/rename FG data + trials in `forbidden.js` / `data.js`

## Open questions

- [ ] Final display name
- [ ] Reuse `mirror_lake` id vs new id; what happens to `celestial_observatory` code path
- [ ] Exact Scar Boon numbers
- [ ] Soft rim tourism for VR/DS (view and die) vs hard DM+ only

## Implementation crumbs

- `data.js` — `FORBIDDEN_GROUNDS.mirror_lake`, `celestial_observatory`; `ANCIENT_FORBIDDEN_CLUES`; story arc delve on observatory
- `forbidden.js` — trial types `mirror`, `observatory`
- Retarget clues / Liang Chen-style delves when rewriting
- No true-Samsara player dao flag in v1
