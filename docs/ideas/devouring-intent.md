# Devouring Intent (吞天魔意)

| Field | Value |
|-------|-------|
| **Status** | `designed` (v1 — fun slice) |
| **Blocked on** | [`weapon-intent-awakening.md`](weapon-intent-awakening.md) (no picker); cult content |
| **Issue** | none yet |
| **Chat / PR** | Planning chat 2026-07-31 · [`heavenly-demon-cult.md`](heavenly-demon-cult.md) |
| **Updated** | 2026-07-31 |

Sister docs: [`devouring-law.md`](devouring-law.md), [`heavenly-demon-cult-life.md`](heavenly-demon-cult-life.md), [`heavenly-demon-cult.md`](heavenly-demon-cult.md).

## Intent

**Devouring Intent** is the Heavenly Demon Cult's crown art — not a sixth weapon type, but a **deviant intent track**: your will shaped as **hunger**. You do not "swing a devourer." You **take** — qi, momentum, fear, the last breath of a dying technique — and make it yours.

**Name lock (owner lean):** **Devouring Intent** (吞意 / 吞天魔意 in sect speech). **Blood** is the most common *entry path* (`blood_fiend` foundation, blood techniques), not a separate "Blood Devouring Intent" track — blood is one flavor of the same maw.

Player fantasy: *"Every fight feeds me. Every kill makes the next one easier. Heaven wanted a tax — I ate the collector."*

## Design notes

### Not a weapon intent

| Weapon intents (today) | Devouring Intent |
|------------------------|------------------|
| Sword, Blade, Spear, Fist, Staff | **Consumption** — no weaponType |
| Basics get sharper | Basics **siphon**; kills **snowball** |
| Expand = edge tricks | Expand = appetite expressions |
| Any FE cultivator (picker today) | **Deviant** — cult syllabus, forbidden sparks, stained groundwork |

Shares tier **structure** with weapon intent (uses, deepen, expand, domain) but separate:

- `INTENT_TRACK_BY_PATH` entry: `devouring: { id: 'devouringIntent', label: 'Devouring Intent', emoji: '🩸' }` (emoji TBD)
- Own `INTENT_EXPAND_ARTS.Devouring` pool (or `INTENT_EXPAND_ARTS.devouring` key)
- Techniques tagged `intentReq: { track: 'devouring', minStage: N }` instead of weapon

### Tier names (xianxia flavor)

| Tier idx | Name | Uses (draft) | Feel |
|----------|------|--------------|------|
| 0 | **Hunger** | 0 | Qi feels thin; you notice what others waste |
| 1 | **Gnawing** | 10 | Combat siphon begins; weak foes hesitate |
| 2 | **Gluttony** | 30 | Kills within window empower next strike |
| 3 | **Bottomless** | 60 | Techniques "taste" wrong without feeding first |
| 4 | **Maw Domain** | 100 | Intent Domain — *the air feels like a throat* |

Deepen: **+ killing conversion** (more damage from siphon stacks, stronger feast-on-wounded).  
Expand: **new appetite expression** (see table below).

### Expand arts (draft — the fun part)

Pick **Deepen** or **Expand** at each breakpoint (same fork as weapon intent).

| # | Id | Name | Tier | Effect (fiction-first) |
|---|-----|------|------|------------------------|
| 1 | `qi_siphon` | **Qi Siphon** | Gnawing | Basics restore a sliver of combat qi / breath on hit |
| 2 | `predator_mark` | **Predator's Mark** | Gnawing | First damaging hit each fight tags prey — bonus damage while they're wounded |
| 3 | `technique_taste` | **Technique Taste** | Gluttony | Once per fight, copying a **category** of enemy tech you survived (light buff — e.g. +armor pen after their heavy) |
| 4 | `fear_feed` | **Fear Feed** | Gluttony | Intimidate/flee checks against you fail more; killing a fleeing foe heals |
| 5 | `momentum_feast` | **Momentum Feast** | Bottomless | Each kill or execute in a window adds a stack (+basics / +siphon) until fight ends |
| 6 | `maw_domain` | **Maw Domain** | Maw Domain | Opening turn: enemies below X% max HP feel **swallowed** — bonus damage + flee penalty; *not* a second GC field |

**Intent Domain manifestation (log / UI):**

*"The space between you and your enemy feels like a closing throat."*

### Combat identity (how it plays)

| Beat | Behavior |
|------|----------|
| **Basics** | Lower raw bonus than sword deepen at same tier; higher **sustain** (qi back, stacks) |
| **Techniques** | Cult techniques want `devouring` intent; orthodox high arts still work but feel "unfed" (soft debuff like wrong weapon) |
| **Kill snowball** | Gluttony+ rewards **finishing** weak prey — not face-tanking bosses raw |
| **Boss fights** | Momentum Feast stacks slower; Maw Domain is opener burst not infinite scaling |
| **Divided heart** | Devouring + Sword intent = classic demon swordsman — allowed, slower refinement |

### Soul / out of combat (light v1)

| Hook | Effect |
|------|--------|
| Soul mitigation | Lower than sword at same tier; **feeds on recent kill** (optional buff 1 month after boss) |
| NPC read | Observe: *"Their qi does not circulate — it **ingests**."* |
| Market | Cult rep or high rebellious: some merchants refuse |

Massacre feeding → **corruption** per alignment doc; intent does not auto-corrupt.

---

### Awakening (no picker)

Devouring Intent **never** appears on a weapon menu. Sparks only.

#### Groundwork (walked the hungry road)

Any **two** of (draft):

- Sealed `blood_fiend` foundation **or** mastered Crimson Harvest Breath
- Killed N sentient foes (not beasts-only) — **or** one story `fate: blood_debt` foe
- Meditated with cult pamphlet / carried forbidden syllabus item
- Walked Wicked Path or cult rep above threshold

Hint line: *"Your dantian aches like an empty stomach."*

#### Spark A — Natural treasure (strict, owner lock C)

| Item | Birthing intent | Groundwork |
|------|-----------------|------------|
| **Maw-Womb Shard** (魔胎碎片) | Devouring | Blood-fiend or blood techniques + hungry groundwork |

Examine:

*"A tooth of something that ate a god and choked. Birthing intent: **Devouring**. Requires: a stained seal or blood path walked — otherwise it sleeps in your palm, patient and cruel."*

Wrong groundwork → item waits.

#### Spark B — Tempered relic (open read)

| Item | Fiction |
|------|---------|
| **Elder Gullet Blade** | Demon elder's weapon — drank three cores before breaking. Examine: *"Devouring intent clings like dried blood. Your heart is sword-shaped; the blade only **hungers**."* |

Does not force sword → devouring. May **aid** awakening if groundwork is blood + rebellious + months meditation with relic.

#### Spark C — Enlightenment

| Scene | Fiction |
|-------|---------|
| **Witness apex feed** | Watch a high cultivator **consume** a defeated foe's foundation (story or rare zone event). Trance: *"You understood the meal before the prayer."* |
| **Survived being devoured** | Boss or envoy attempt to refine you; you break out with hunger mirrored |
| **Cult initiation** | Envoy rite — rare spar where they fight to **taste** your qi, not kill you |

Spar awakening: **rare**, opponent must carry devouring tags.

---

### Cult technique set (sketch — not full manual pass)

| Technique | Tier | Role |
|-----------|------|------|
| **Crimson Harvest Breath** | QC–FE | Method — stamps `blood_fiend`; groundwork |
| **Blood Refining Art** | FE | Outer steal — exists today |
| **Gullet Palm** | FE | Short-range qi drain; devouring intent soft-synergy |
| **Heaven-Defying Swallow** | Core | Heavy — devours enemy buff / shield layer |
| **Demon Maw Manifestation** | GC+ | Technique that **requires** Devouring Intent Major+ |

Lineage id suggestion: `heavenly_demon_devour_line`.

---

### Balance guardrails

| Risk | Guard |
|------|-------|
| Infinite sustain | Siphon caps per turn; boss DR after N heals |
| Speed-running whole game | Devouring scales with **kills in fight**, not lifetime kills |
| GC Domain overlap | Maw Domain = combat opener + flee pressure; does not contest realm Domain ([`domain-system.md`](domain-system.md)) |
| Evil = win button | Best in **prolonged** fights vs many weak; worse vs single immune boss without setup |

---

### Comparison to Blade "Slaughter Aura"

Blade intent: wounded **enemy** takes more damage.  
Devouring: **you** grow from the wound — sustain + snowball. Same family, different mouth.

### vs Devouring Law (intent ≠ law)

| | **Devouring Intent** | **Devouring Law** |
|--|----------------------|-------------------|
| Job | **Form** — your hunger, siphon, snowball | **Law** — peel buffs, bite formations, world agrees to intake |
| Era | FE+ | Dao Seeking+ |
| Example art | Gullet Palm | Shell Crack |
| Union | Heaven-Defying Swallow needs **both** | — |

Full law doc: [`devouring-law.md`](devouring-law.md). Sect life: [`heavenly-demon-cult-life.md`](heavenly-demon-cult-life.md).

## Prerequisites

- [ ] Owner sign-off on name (**Devouring Intent** vs blood subtitle)
- [ ] [`weapon-intent-awakening.md`](weapon-intent-awakening.md) deviant track plumbing
- [ ] One natural treasure + one cult encounter stub in data
- [ ] Expand art combat hooks (new file section or `intent.js` branch)

## Open questions

- Separate emoji / UI track color (blood red vs demon purple)
- `technique_taste` — copy buff too RPG? Simpler: +5% vs last element hit by
- Cult join vs found-manual-only path for first playthrough
- Blood-only NPCs refuse to teach if nature is `sword_inclined`?

## Implementation crumbs

- `intent.js` — generalize beyond `WEAPON_TYPES`; `getIntentTrackForPath` / deviant tracks
- `data.js` — `INTENT_EXPAND_ARTS`, catalyst items, `HIGH_INTENT_TECHNIQUES` pattern for devouring arts
- `techniques.js` — `resolveIntentReq` supports `track: 'devouring'`
- `combat.js` — siphon, stack, maw_domain opener
- `cultivation-methods.js` — cult manual row
- `heavenly-demon-cult.md` — faction fiction
