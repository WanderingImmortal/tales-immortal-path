# Body path — Martial Intent (武意)

| Field | Value |
|-------|-------|
| **Status** | `designed` (combat feel locked 2026-10-12; not implemented) |
| **Blocked on** | Body chamber depth; `INTENT_TRACK_BY_PATH.body`; combat tempo hooks |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent 2026-08-02; **2026-10-12** — press/stagger vs soul — cloud chat |
| **Updated** | 2026-10-12 |

Parent: [`body-path-sect.md`](body-path-sect.md), [`body-chamber-anatomy-rebuild.md`](body-chamber-anatomy-rebuild.md). Qi lane: Weapon Intent (`intent.js`). Oaths: [`vessel-rules.js`](../../vessel-rules.js).

## Intent

Body refining needs an equivalent to qi **Weapon Intent** — but **not** the same thing.

| Concept | What it is | Xianxia feel |
|---------|------------|--------------|
| **Weapon Intent** (器意 / 兵意) | Will channeled through an **external weapon category** via **qi** | Meditate the sword, staff, spear — **tool + qi** |
| **Martial Intent** (武意) | **Physique presence** — enlightenment through **impact**; ambient **weight** (压境) | Not qi through a tool — **Press Domain**, marrow shock, stagger — not soul-cut |
| **Elemental / ethereal intent** *(future)* | Qi shaping **fire, lightning, void** etc. | Natural **qi-path** gate — not weapon taxonomy |

**Owner lock:** **Martial Intent = fist / unarmed only.** If it’s a **weapon** (staff, sword), it stays **Weapon Intent** on the **qi** track — even for monks who carry a staff.

## Taxonomy — why qi gates weapon intent (and doesn’t gate martial)

**Weapon Intent behind qi path** is acceptable in game and in genre:

- Sword, blade, spear, **staff** = **external** tools — intent is **qi meeting instrument**
- Qi-path **Fist** Weapon Intent = **palm / knuckle qi** (Five Elements Fist, Phoenix palm) — still **qi ornament**, not bodily enlightenment

**Martial Intent** answers the nitpick: *why do I need qi to unlock **my own fist***?

- Body path cultivators **enlighten the fist through use** — Bell Trial, impacts, marrow feedback
- Cultivated in **vessel / trial ground**, not dantian meditation on a weapon label
- **Staff under martial felt wrong** — staff is a **weapon**; martial is **bodily** (拳、身、打击)

## What exists in code today (gap)

| System | Path | Home | Notes |
|--------|------|------|-------|
| **Weapon Intent** | Qi | Dantian | Sword, Blade, Spear, Fist, Staff |
| **Vessel Rules** | Body | Vessel | **Rule Adherence** — oath settles into flesh; own loop ([`vessel-rules-design.md`](vessel-rules-design.md)) |
| **Body `intentReq: Fist`** | Broken for pure body | Checks qi `getActiveIntent()` | Should gate on **Martial Intent**, not Weapon Intent |

`INTENT_TRACK_BY_PATH` only has `qi`. Body track **not** implemented.

## Design rule — lanes

| Path | Unarmed | Weapons (sword, blade, spear, staff) | Elemental / ethereal *(future)* |
|------|---------|--------------------------------------|--------------------------------|
| **Qi** | **Fist Weapon Intent** (palm qi) | **Weapon Intent** | Qi-gated *(separate from weapon taxonomy)* |
| **Body** | **Martial Intent** (武意) | No intent track — use body arts + optional **qi-fuel staff** without Staff Weapon Intent *or* accept qi gate for staff mastery |
| **Soul** | Soul arts | — | — |

**Rule Adherence** = law **sticks**; flesh **settles**; Body Dao rewards/punishes — **not** meditate-on-rule. **Martial Intent** = fist enlightenment through **impact**. **Chamber** = tempering. Three verbs: **adhere**, **strike**, **temper** — not three reskins of intent `uses`.

## Martial Intent — **fist only** (owner lock)

| | Martial Intent (body) | Fist Weapon Intent (qi) |
|--|----------------------|-------------------------|
| **Hanzi** | **武意** (lean) | 拳意 as flavor of **器意** — fist-as-channel |
| **Cultivation** | Trial ground, combat, tempering — **enlightenment through hitting** | Dantian awaken / deepen / expand |
| **Feel** | Marrow shock, bone ring, flesh memory | Elemental palm, qi wave, breath |
| **Da Chi** | Ceiling of **Martial Intent** | Refuses — “fist is not technique” |
| **Schools** | Vajra Ridge, grit body styles | Five Elements, Phoenix palm, Heavenly Palm |

**Not two names for the same bar** in UI if confusing — technique resolver branches on `path`:

- Qi fist arts → `weaponIntent` Fist
- Body fist arts → `martialIntent` (武意)

## Staff — **Weapon Intent** (qi), not martial

| Approach | Detail |
|----------|--------|
| **Genre** | Staff is a **weapon** — 棍意 belongs with **weapon intent**, qi-shaped |
| **Mad Monks** | Carry bell-staffs; **Staff Shatter** etc. may **not** require intent on body path — pure tempered leverage — *or* require qi outer-court breath + Staff Weapon Intent as **secondary** skill |
| **Game** | Locking staff behind qi is **fine** — body mains fist; staff is **tool** monks learn with qi fuel, not bodily enlightenment |

**Lean:** body-path **staff techniques** = **no `intentReq`** or low gate (technique quality only); **Staff Weapon Intent** stays **qi-path** for qi staff supremacy (`Celestial Judgment`).

## Vajra Ridge — teaching

| Teach | Refuse |
|-------|--------|
| **Martial Intent** (武意) — fist enlightenment | Sword / blade / spear **Weapon Intent** |
| Staff forms as **body techniques** (leverage, shatter) | Staff as **martial intent** |
| Outer: breath-for-stamina (qi **fuel**) | Palm qi as **cultivation root** |

**Bell Trial** — awakens / stresses **Martial Intent**, not weapon meditation.

## Tier structure (draft)

Mirror Weapon Intent **mechanics**, body-flavored **names**:

| Uses | Name option |
|------|-------------|
| 0 | Bruise / Sprout |
| 10 | Ring (骨鸣) |
| 30 | Echo |
| 60 | Temper |
| 100 | Press Domain (压境) |

## Combat vs soul cultivators (owner lock 2026-10-12)

**UI label:** **Martial Intent** (武意) — not “Body Intent.”

| Qi Weapon Intent (high) | Martial Intent (body) |
|-------------------------|------------------------|
| Can **cut / wound** soul (intent bridge) | **Shake / stagger** — tempo war, not `spiritDamage` |
| Meditate + tool category | **Press Domain** — ambient pressure; **concussive** hits → `slowTurns` / `skipTurns` / Focus strain on soul targets |

**Not** primary soul mitigation (that stays **minimal realm lifeforce + treasures**). MI is **spice** so body mains can **deny clean soul casts** without a spirit alt. Tune caps so stagger does not hard-lock bosses.

**Feed-forward:** MI shapes **Runeforging** options; optional synergy with **Vessel Rules** (contest on close) — [`vessel-rules-design.md`](vessel-rules-design.md).

## Open questions

- [x] UI label — **Martial Intent** (owner 2026-10-12)
- [ ] Technique field: `martialReq` vs shared `intentReq` with path branch
- [ ] Body staff arts — **no intent gate** vs optional Staff Weapon Intent for hybrid monks
- [ ] Elemental intent system — separate from weapon intent when designed
- [ ] Divided heart: Martial Intent + Weapon Intent Fist on mixed-path character?

## Implementation crumbs (later)

- `martial-intent.js` or `INTENT_TRACK_BY_PATH.body` — **single** fist/unarmed track
- `getTechniqueIntentMatch` — body path checks Martial Intent; qi fist checks Weapon Intent Fist
- Remove / remap body arts `intentReq: { weapon: "Fist" }` → martial gate
- Vajra Ridge manual → Martial Intent syllabus
