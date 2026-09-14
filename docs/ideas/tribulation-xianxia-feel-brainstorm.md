# Tribulation & breakthrough — xianxia feel (brainstorm)

| Field | Value |
|-------|-------|
| **Status** | `designed` (brainstorm — owner review) |
| **Blocked on** | Combat damage depth (for full tribulation combat); per-gate journey design |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent brainstorm, 2026-09-14 |
| **Updated** | 2026-09-14 |

## Intent

Breakthroughs and tribulations should feel like **a cultivator's life catching up at a watershed** — not a roguelite draft at the finish line. Heaven audits whether you belong in the next realm; the player should already know *how* they cultivate before the sky falls. Rewards should read from your path, not from picking one of three random perks.

**Parent docs:** [`tribulation-system-rework.md`](tribulation-system-rework.md) (engine + heaven's ledger), [`tribulation-per-gate-backlog.md`](tribulation-per-gate-backlog.md) (per-gate scripts), [`combat-damage-depth.md`](combat-damage-depth.md) (blocked for full combat trib).

---

## What's wrong today (player-facing)

| Layer | Current feel | Why it clashes |
|-------|--------------|----------------|
| **Breakthrough popup** | Pick Balanced / Power / Wisdom at the moment of breakthrough | Feels like drafting a build in a roguelite — disconnected from months of cultivation, manual, sect, foundation |
| **Transcendence** | Perfect break → pick 1 of 3 random perks | Relic draft; the blessing doesn't emerge from *how* you perfected |
| **Tribulation (generic gates)** | Omen → trial → aftermath; each phase offers ~3 menu choices | Same deck every gate; "scar risk %" poker instead of named consequences |
| **Tribulation (QC→FE)** | Scripted choices exist but still read as a 3-option menu inside an overlay | Better fiction, same interaction shape |

None of this is *wrong mechanically* — it's the **interaction model** that says "card game" instead of "lifespan sim crossing a heavenly gate."

---

## Core reframe

**Three separate beats** — don't collapse them into one popup chain:

```text
1. PREPARATION (weeks/months/years of sim)
   What you built: consolidation tier, foundation variant, pills, array, sect backing, karma ledger

2. BREAKTHROUGH (one committed action)
   Your manual/method fires — not a 3-button draft

3. TRIBULATION (thin limbo → heaven's audit)
   Scripted for this gate + your path + ledger — consequences are specific, not "% scar risk"
```

**Roguelite drafts become sim outcomes:** if you want a "power" breakthrough, you earn it by *how* you consolidated and *which* technique you used — not by clicking ⚡ Power thirty seconds before tribulation.

---

## Tribulation types (not one generic deck)

Use **type** for *what heaven is testing*, **script** for *which gate*, **context** for *why now*.

| Type | What heaven asks | Default path | When |
|------|------------------|--------------|------|
| **Lightning** | Can your vessel endure external force? | Qi, Body | Most breakthrough audits |
| **Heart Demon** | Can your self hold against your own shadow? | Soul | Soul breakthroughs; also qi/body at gates where identity fractures |
| **Dao Heart** | Does your dao cohere — or contradict itself? | Any path at dao-heavy gates | GC→NS, Void→Dao; cultivators with conflicting techniques |
| **Karmic** | What debts did you leave unpaid? | Ledger-driven | Breakthrough when corruption noticed; jianghu choices surface |
| **Heavenly Punishment** | You broke the rules — survive the reckoning | Fate theft, sacrilege | Fate-rite end; rare world events |
| **Elemental** | Lightning wearing your sealed nature's colour | Qi at specific gates | Fire soul at GC, etc. — *variation*, not a separate minigame |
| **Void / Dissolution** | Can you remain yourself while the world un makes you? | NS→Void+ | See void cosmology doc |

**Rule:** type is assigned by `path + transitionId + ledger`, not `Math.random()`. Randomness belongs in *severity* and *which specific scar*, not *which genre of trial*.

---

## Per-gate identity (heaven's question)

Each watershed gets **one sentence** heaven is asking. The tribulation is the test for that question — not a reskin of the last gate with bigger numbers.

| Transition | Heaven's question (draft) | Trial shape |
|------------|---------------------------|-------------|
| **QC → FE** | Can gathered qi settle into bedrock the ledger recognizes? | Bedrock / compress / meet thunder (shipped direction) |
| **FE → GC** | Does this nascent core belong in the ledger? | Core-integrity lightning; thin limbo; failure = crack or shatter |
| **GC → NS** | What is born when the soul emerges — you, or something wearing you? | Heart demon + soul-pressure; identity beats |
| **NS → Void** | Can you dissolve without scattering? | Void-lightning / dissolution sequence |
| **Fate rite** | You stole from the ledger — does your array hold? | Chronicle sit → multi-wave assault (high threat only) |

If we can't write the heaven's question yet, **park that gate's tribulation** and design the cultivation journey first ([`tribulation-per-gate-backlog.md`](tribulation-per-gate-backlog.md) rule).

---

## What to do without full combat damage

Combat damage rework is parked — tribulations should not *wait* on DPS races. Plenty of xianxia tribulation is **endurance, will, preparation, resource burn** — not trading blows.

**Works now (existing stats/systems):**

| Mechanic | Tribulation use |
|----------|-----------------|
| **Severity vs resist** | Lightning: foundation, lightning resist, consolidation tier, pills |
| **Will / spirit checks** | Heart demon branches; reject illusion vs face it |
| **Months cost** | Each trib phase advances the calendar — time is the price |
| **Concrete fail scars** | "Compress dantian failed → Qi Backlash" not "+18% scar risk" |
| **Consolidation tier** | Bedrock choice *strong if consolidated* — prep matters |
| **Pills / arrays** | Burn pill for protection; formation mitigation on fate rite |
| **Simplified heart-demon combat** | Keep for soul beats — one shadow fight, not full damage model |
| **Ledger modifiers** | Theft count, corruption noticed → harsher audit (already in engine) |
| **Multi-wave (rare)** | Only when heaven wants destruction — between-wave: reinforce ward, hold center, burn pill |

**Defer until damage depth:**

- Tribulation as full technique duel (meridian seal, limb break during audit)
- Boss tribulation with wound-nature variety
- Player wound persistence from failed trib combat

**Plain-language goal:** tribulation feels like **"can your cultivation hold"** before it feels like **"can you win this fight."**

---

## Replace the roguelite layers

### Breakthrough popup (Balanced / Power / Wisdom)

**Kill the draft.** Replace with:

- **Consolidation tier** (hasty / settled / peak) already sets break posture
- **Active manual / breakthrough method** from sect or technique (when manuals framework lands)
- **Optional consumables** chosen in chamber before attempting — pills, array tiles, elder escort

The breakthrough action becomes: *"Attempt Initial Core Formation using [your method]"* with preview text driven by your build state.

| Old | New |
|-----|-----|
| Pick Power for +qi | Peak consolidate + aggressive manual → naturally high qi, higher trib severity |
| Pick Wisdom for +will | Soul-heavy foundation + settled tier → will-forward break |
| Pick Balanced | Settled tier default — safest audit |

### Transcendence (pick 1 of 3 perks)

**Kill the random 3-pick.** Replace with:

- **Named imprint** tied to *how* you achieved perfect — foundation variant, path, gate, maybe sect
- One blessing per gate per life, **deterministic or small curated pool** (2–3 that match your build, not 3 random from entire list)
- Display as chronicle beat: *"Heaven's Glance — your flawless Foundation left a mark the ledger cannot erase"* — not a shop row

Open question from backlog still stands: fold transcendence into consolidation tier reward entirely?

### Tribulation phases (generic 3-pick menus)

**Per gate:** 2–3 choices that are **named story beats** with **named fail outcomes** (QC→FE model).

**Cross-cutting rules:**

- Omen = preparation beat (or skip if player already prepared in chamber)
- Trial = the gate's actual test — often **one primary choice** with risk variant, not six unrelated buttons
- Aftermath = recovery posture (seal breath vs rush out) — minor, not a second draft
- Drop opaque `scarRisk` meter where possible

---

## Player flow sketch (target)

```text
[Realm peak reached — consolidate action available]
        ↓
[Player consolidates: hasty / settled / peak]
        ↓
[Optional: gather trib supplies — pills, array, secluded site]
        ↓
[Breakthrough — one action, method from build]
        ↓
[Thin limbo — "Nascent Core" / "Unconfirmed Foundation" — immediate]
        ↓
[Tribulation overlay — gate script, path default type]
   · Copy states heaven's question
   · Choices reference YOUR prep ("bedrock holds because you consolidated")
   · Fail → specific scar or regression
        ↓
[Pass → realm accepted; optional perfect imprint if earned]
```

---

## Single-wave vs multi-wave (unchanged philosophy)

- **Routine breakthrough audit** = single wave. Enough.
- **Multi-wave** = heaven wants you dead (fate rite + high ledger, peak thief, heavenly punishment). Between waves: resource decisions, not perk drafts.

---

## Suggested design order (when implementing)

1. **Redesign breakthrough popup** → method from build; posture from consolidation
2. **Redesign transcendence** → curated/path imprint, not random 3-pick
3. **FE→GC script** — first gate that really needs limbo + core fiction ([`golden-core-cultivation-journey.md`](golden-core-cultivation-journey.md))
4. **Retire generic trib menus** gate-by-gate as journeys land
5. **Dao Heart / Karmic types** — when alignment/sacrilege UI and GC journey exist
6. **Fate-rite trib mode** — chronicle project
7. **Combat-heavy trib beats** — after damage depth

---

## Open questions (owner)

- [ ] Breakthrough popup: remove entirely, or keep as "confirm + preview" with no style draft?
- [ ] Transcendence: deterministic imprint per perfect path, or small curated pool filtered by build?
- [ ] Omen phase: always present, or skip when player did chamber prep?
- [ ] Body path tribulation default — lightning on flesh, or endurance trial with different copy?
- [ ] Can players *avoid* tribulation at low gates (hidden paths), or is audit mandatory at every watershed?
- [ ] How much sect infrastructure (array, elder guard) before first tribulation is teachable?

## Implementation crumbs

- `cultivation.js` — breakthrough popup, `continueAfterBreakthrough`
- `transcendence.js` — perk offer / 3-pick
- `tribulation.js` — phases, `getOmenChoices`, `getTrialChoices`, scripted `TRIBULATION_SCRIPTS`
- `consolidation.js` — tier already affects trib (`getConsolidationTierTribulationBonus`)
- `chamber.js` — FE→GC condense + limbo
- `data.js` — `TRIBULATION_TYPES`, `TRIBULATION_SCRIPTS`, `TRANSCENDENCE_PERKS`
