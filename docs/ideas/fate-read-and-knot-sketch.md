# Fate — read UX sketch & Misfortune Knot (playground)

| Field | Value |
|-------|-------|
| **Status** | `designed` — owner review 2026-10-14; **grounding test** before full Fate pass |
| **Blocked on** | `fateOutline` / scheduler hooks; combat telegraph pipeline |
| **Issue** | none yet |
| **Chat / PR** | Spirit Root · [PR #149](https://github.com/WanderingImmortal/tales-immortal-path/pull/149) |
| **Updated** | 2026-10-14 |

**Parent:** [`fate-fortune-grounding.md`](fate-fortune-grounding.md) (unwritten book) · [`soul-root-dao.md`](soul-root-dao.md) § Fate

## Intent

Two concrete sketches so the soft-outline model **grounds in play**:

1. **Fate reading** — what the player **sees** on **self** vs **others** (not prophecy text).
2. **Misfortune Knot** (凶结) — **utility** that **marks** a target; **harm** arrives when a **later beat** resolves (combat or chronicle).

---

## 1. Fate reading — one verb, two mirrors

**Inherit @4:** **Thread Glimpse** (working name). Same soul art; **target** chooses mode. Cost: Focus + short cast (combat: 1 beat; jianghu: 1 action month lean).

**Rule:** Output is always **chapter heading + tendency**, never quest IDs or “NPC X dies Tuesday.”

### Read **others** (person anchor)

| Context | UI / copy (examples) | Mechanics (lean) |
|---------|----------------------|------------------|
| **Combat** | Floating tag on foe: **「Next line: Heavy strike」** or icon + *“Their luck commits to a reckless opening.”* | Surfaces **imminent action class** for counter-play ([`fate-fortune-grounding.md`](fate-fortune-grounding.md)); respects wards → **Partial** or **False branch** copy |
| **Converse / explore** | Panel line: **Momentum ↓** · active stub *「Patronage / Betrayal fork warming」* · *“Not certain — two branches breathe.”* | Shows **momentum band** + **beat category** on personal 运; no hidden quest name |
| **Partial fail** | *“The page smears — you catch only: **Misfortune lean**.”* | Momentum direction only |
| **False branch** | *“You read **Retreat** — they **Advance**.”* (once) | Teaches omen unreliability; higher realm foe more common |
| **True Self / merit** | *“Their name doesn’t sit still on the page.”* | Read fails or personal band only |
| **Institutional hint (crude)** | Secondary colour on portrait: **Sect stream: cold** (no detail) | Org 气数 **omen colour** only until manual |

**Not shown:** full life timeline, exact dialogue line, inventory contents (Memory), karma edges (Karma branch tint is separate UI if dual walker).

### Read **self** (inner chapter)

| Context | UI / copy (examples) | Mechanics (lean) |
|---------|----------------------|------------------|
| **Anytime (out of combat lean)** | Soul panel **「Your chapter」**: *Active stub: **Breakthrough pressure*** · **Deviation 12** · **Momentum →** | **`fateOutline` active beat category** + **deviation** + momentum arrow |
| **Low deviation** | *“The plan expects you to **consolidate**, not fight.”* | Flavour nudge toward “on plan” play — not a debuff |
| **High deviation** | *“**Off the plan** — heaven’s next gate may read you harder.”* (if NHK) + *“Something in the jianghu can still surprise you.”* | Hooks tribulation **flavour** + chronicle tag; **not** automatic punishment |
| **Before breakthrough (junctures)** | *「Juncture lean: Audit / Heart-demon / Cycle」* — **one of 2–3 themes**, not wave count | Thematic **pressure omen** only — tribulation math unchanged unless NHK |
| **Combat self-read** | Short action: *“You feel your own line leaning **Evasive**.”* | Same as Nudge setup — **self Nudge** preview, 1 turn |

**Not shown:** exact tribulation failure, lifespan number, other characters’ futures.

### Side-by-side (player cheat sheet)

```text
OTHER read  → “What line are THEY leaning into?”  (counter / social timing)
SELF read   → “What chapter am I in?” + am I off-plan?  (deviation, juncture mood)
```

### Implementation lean

```js
// result shape (conceptual)
{
  success: 'full' | 'partial' | 'false' | 'fail',
  momentumBand: 'rising' | 'flat' | 'falling',
  beatCategory: 'patronage' | 'betrayal' | 'breakthrough' | 'misfortune' | 'combat_heavy' | …,
  imminentCombatLine: 'heavy' | 'feint' | 'technique' | 'flee' | null,  // other + in fight
  deviation: number,           // self only
  institutionalTint: 'cold' | 'warm' | null,
  copyKey: 'fate_read.partial_smear',
}
```

---

## 2. Misfortune Knot (凶结) — delayed utility / harm

**Unlock:** Fate **greater @5** (with **Nudge** — same band as Karma’s double @4). **Tag:** `fate_mark` · not direct damage.

### Fantasy

You **tie a knot** in the target’s **unwritten page** — not cutting them now. When the outline hits the **next decision stub** (their choice point), the knot **pulls** toward a **misfortune branch**: slip, backlash, scandal beat, missed proc — **later**, **escapable**, **readable**.

Genre beat: *“After that duel nothing went right for him.”* — because a beat **resolved** with your mark weighted, not because you deleted their HP bar.

### Cast (now)

| | |
|--|--|
| **Target** | One **foe** (combat) or **person / org anchor** (jianghu, org needs faint outline) |
| **Cost** | Focus (Suppression-tier lean), soul strain on crude |
| **Duration** | Until **next outline decision** on that anchor **or** **N months** cap (e.g. 3–6), whichever first |
| **Immediate effect** | **None** on HP — optional omen line on target: *“Something cold in their 运.”* (warded targets may not show) |

### Payoff (later)

When the anchor hits a **decision stub** (engine-defined):

| Context | Payoff examples |
|---------|-----------------|
| **Combat** | Next time they **commit** a heavy line or **try flee**, roll **misfortune**: guard drop, proc fizzle, self-inflicted opening (pairs with your Glimpse) |
| **Jianghu** | Scheduler fires: **minor accident**, **failed roll** on exam/trade, **rumor beat**, ambush **bias** — situation-thread engine ([`jianghu-situation-threads.md`](jianghu-situation-threads.md)) |
| **Org** | Donor mood dip, **one** negative org roll in pack |

**Weight:** `misfortuneWeight += markStrength` on branch roll — **not** auto-fail. Merit/luck treasure **damp**.

### Player feedback loop

1. **On cast:** Chronicle: *“You knot **{name}**’s fortune — the page waits.”*
2. **Optional pulse:** If you **Glimpse** them again before payoff, see **「Knot active · Misfortune fork fattened」**
3. **On fire:** *“The knot pulls — **{name}** stumbles on the line they chose.”* + mechanical effect
4. **On expire:** *“The page moved on; the knot slackens unused.”*

### Counters & fail cases

| Case | Result |
|------|--------|
| Target **merit cleanse** / sect luck rite | Mark **snapped** — log line |
| Peer **Fate** sever (manual, late) | Mark removed |
| **No decision stub** before timeout | Mark fades — wasted knot (crude tax) |
| **True Self** | Shorter carry or weaker weight |
| Spam on innocents | Low NHK heat only if institutional forge; personal knot **jianghu blowback** lean |

### Vs Karma / Illusion

| | **Misfortune Knot** | **Karma Retribution** |
|--|---------------------|-------------------------|
| Timing | **Later** beat | **Now** (combat settlement) |
| Fuel | Outline **decision** | Stain / edges |
| Feel | “Bad season finds them” | “Ledger pays out” |

### Manual upgrade (focused)

**Red Pin Omen** — longer carry, +weight, **one** extra stub type (e.g. social + combat). Apex org variants stay separate (**Clan Omen Pin**).

### Data lean

```js
// on anchor
fateMarks: [{
  id, casterUid,
  strength: 1..3,
  placedAtMonths,
  expiresAtMonths,
  trigger: 'next_decision_stub' | 'next_combat_commit',
  misfortuneWeight: number,
}]
```

---

## Open (owner)

- [ ] Merge self/other into one button with target toggle vs two shelf entries?
- [ ] Show **deviation** on self read to player or chronicle-only?
- [ ] Misfortune Knot **combat-only v1** vs jianghu scheduler day one?
- [ ] Rename **Thread Glimpse** → **Fortune Line** / split **Inner Chapter** self read name?

## Related

- [`world-scheduler.js`](../../world-scheduler.js) — delayed payoff
- [`fate-fortune-grounding.md`](fate-fortune-grounding.md) — outline + deviation
