# Devouring Law (吞天之道)

| Field | Value |
|-------|-------|
| **Status** | `designed` (v1 — cult dao slice) |
| **Blocked on** | Dao system redo; [`devouring-intent.md`](devouring-intent.md) |
| **Issue** | none yet |
| **Chat / PR** | Planning chat 2026-07-31 · [`heavenly-demon-cult.md`](heavenly-demon-cult.md) |
| **Updated** | 2026-07-31 |

## Intent

**Devouring Law** (cult speech: *the Way of Devouring*; game id: `devouring` in Dao taxonomy) is what the Heavenly Demon Cult believes heaven already practices — **all qi is borrowed, all forms are food, all boundaries are shells to crack open**.

It is **not** Devouring Intent. Intent is **your** drive to take and become. Law is **the rule** that consumption is how the world actually works.

Player fantasy at Dao Seeking: *"I don't just eat my enemies — I understand why the universe permits eating."*

Sister: [`devouring-intent.md`](devouring-intent.md), [`alignment-sacrilege-corruption.md`](alignment-sacrilege-corruption.md), [`chaos-cultivation-path.md`](chaos-cultivation-path.md) (Lu Feng **Devourer** = wrong Chaos walk, not this law).

## Design notes

### Intent vs Law (devouring edition)

| | **Devouring Intent** | **Devouring Law** |
|--|----------------------|-------------------|
| **Question** | "Is my **heart** a mouth?" | "Do I **understand** that all things return to intake?" |
| **Unlock era** | FE (Anchor) — spark + groundwork | Dao Seeking — fragments, rites, witness |
| **Built by** | Kill, meditate hungry, carry stained seal | Comprehend fragments, cult inner trials, forbidden insights |
| **Combat job** | Siphon, snowball, taste techniques, maw pressure | **Eat** buffs, shields, formation edges, borrowed qi |
| **You can have…** | Intent without Law (starving genius) | Law without Intent (theorist who chokes on the first bite) |
| **Peak** | Maw Domain — throat in the air | **Law (wear)** — local reality treats your vicinity as digestive tract |

**They work hand in hand** on union arts; they gate **different** technique families (see below).

### Not Return-to-Dust, not Chaos Devourer

| Concept | Difference |
|---------|------------|
| **Dustbone Return-to-Dust** | Basin entropy, dynasties, lawful burial — *cycle without a cult* |
| **Chaos Devourer (Lu Feng)** | Forced wrong exit off the pipe — cautionary, not curriculum |
| **Devouring Law** | *Within* the mandate — "heaven eats; learn the receipt" |

Cult doctrine: you are not breaking the cycle; you are **honest** about it.

---

### Dao taxonomy placement (draft)

| Tier | Id (suggested) | Name | Role |
|------|----------------|------|------|
| **Lesser** | `devour_morsel` | Morsel Dao | First fragment — "nothing wasted in a fight" |
| **Greater** | `devouring` | Devouring Dao | Full law branch — cult core |
| **Fundamental** (apex / NPC) | `heaven_glutton` | Heaven's Gluttony | Patriarch-tier insight — *the ledger eats too* |

Element phases **do not** replace Devouring Law. Fire Phase + Devouring Law can synergy (burn then eat ash) but are different gates.

---

### Law techniques (dao-shaped arts)

*"The world agrees something can be consumed."*

| Technique | Tier | Law req | What it does (fiction) |
|-----------|------|---------|------------------------|
| **Shell Crack** | FE | Morsel fragment | Strip one enemy buff / ward layer |
| **Borrowed Qi Reversal** | Core | Devouring lesser | Turn their last technique's element against them |
| **Formation Gnaw** | Core | Devouring lesser | Slow array; bite a node offline in long fights |
| **Heaven-Defying Swallow** | Core | Devouring + intent synergy | **Union** — eat shield + siphon (see devouring-intent doc) |
| **Mandate Bite** | Dao Seeking | Devouring greater | Briefly **consume** a zone law debuff (high sacrilege risk) |
| **Gluttonous Heaven** | Dao Manifestation | Fundamental (NPC) | Patriarch myth only in v1 |

**Fails without law:** *"You would take — the world does not yield its skin."*

---

### Intent techniques (form-shaped) — cross-ref

See [`devouring-intent.md`](devouring-intent.md): Gullet Palm, Predator's Mark expressions, Maw Domain opener.

**Fails without intent:** *"You understand the meal — your stomach is still empty."*

---

### Fragment sources (cult life)

| Source | Fragment | Feel |
|--------|----------|------|
| Inner trial — **Fast for nine days** | Morsel | Body learns emptiness |
| Witness elder **consume** a failed initiate's core | Devouring (progress) | Horror lesson |
| Field treasure — **Receipt of Heaven's Tax** | Devouring | Natural law text |
| Forbidden ground clear + cult envoy | Greater unlock | Sect sanctions the hunt |
| Kill-log revenge — eat the killer's technique echo | Morsel (controversial) | Personal, stains if abused |

Fragments are **not** sold in Redwell bazaar.

---

### Law combat procs (sketch — when dao system redone)

Not "% damage." World reactions:

| Proc | Trigger | Effect |
|------|---------|--------|
| **Buff peel** | Heavy technique vs you | Chance to digest one buff |
| **Shield sour** | Enemy defends | Their guard costs more next turn |
| **Qi refund** | You ate something lawfully | Small tribulation of *their* resource |
| **Flee choke** | Weak enemy runs | Law says exit is also intake — catch sliver |

Stacks with intent siphon; does not replace it.

---

### Corruption & sacrilege (owner rules)

| Act | Track |
|-----|-------|
| Study Devouring Law in cell | Neither — doctrine |
| **Mandate Bite** on registered holy site | Sacrilege + corruption risk |
| Massacre feeding for fragments | Corruption (cycle harm) |
| Eat a living foundation | Corruption; cult may still teach it in inner hall |

Intent/Law power does not **auto-stain**; **what you eat** does.

## Prerequisites

- [ ] Dao taxonomy redo — `devouring` branch ids
- [ ] [`heavenly-demon-cult-life.md`](heavenly-demon-cult-life.md) fragment beats per rank
- [ ] Union art list agreed with devouring-intent doc

## Open questions

- Player-facing term: **Devouring Law** vs **Devouring Dao** on UI (cult vs system)
- Is Morsel Dao mandatory before Devouring greater?
- Cross-element devouring (eat fire with water law?) — park

## Implementation crumbs

- `dao-taxonomy.js` — new branch + fragments in `DAO_FRAGMENT_POOL`
- `techniques.js` — `daoReq: { id, minTier }` when system redone
- `heavenly-demon-cult-life.md` — rank gates
