# Tribulation & breakthrough — xianxia feel (brainstorm)

| Field | Value |
|-------|-------|
| **Status** | `designed` (brainstorm — owner review) |
| **Blocked on** | Combat damage depth (for full tribulation combat); per-gate journey design |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent brainstorm, 2026-09-14 |
| **Updated** | 2026-09-14 (owner: per-gate trib sketches QC / FE→GC / GC→NS) |

## Intent

Breakthroughs and tribulations should feel like **a cultivator's life catching up at a watershed** — not a roguelite draft at the finish line. Heaven audits whether you belong in the next realm; the player should already know *how* they cultivate before the sky falls. Rewards should read from your path, not from picking one of three random perks.

**Owner direction (2026-09-14):** breakthroughs need **buildup and weight** — something you've worked toward. Each realm's breakthrough should **feel different** or the ladder gets repetitive. Prep should **not** be a hard-locked grind checklist, but **what you put in beforehand must show up in the tribulation and in the rewards**.

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

## Buildup & weight (not a checklist grind)

The breakthrough should land because **the sim already told you you were ready** — then the tribulation is the dramatic punctuation.

### What creates weight

| Signal | Player feeling |
|--------|----------------|
| **Realm journey meter** fills over calendar time | "I've been at this stage for years" |
| **Consolidate action** is a deliberate capstone | "I'm choosing to knock on the gate now" |
| **Named limbo state** (nascent core, unconfirmed foundation) | "I'm in between — one wrong step and it's over" |
| **Chronicle / log callbacks** | "That pill I hoarded / that shortcut I took — it's here now" |
| **Preview before commit** | "I can see how my prep changes the audit" |

### Soft prep, hard payoff (no grind lock)

Prep is **optional depth**, not a wall. You can break through hasty; you pay in trib severity, scar risk, and reward ceiling.

| Prep axis | How it enters tribulation | How it enters rewards |
|-----------|---------------------------|------------------------|
| **Consolidation tier** (hasty / settled / peak) | Severity, which choices are *strong* vs *risky* | Perfect → imprint; peak → grade ceiling |
| **Foundation / core quality** | Resist, which fail scars apply | Foundation echo, core grade band |
| **Pills & arrays spent** | One-time resist, skip a wave, soften a scar | None directly — survival is the win |
| **Manual / breakthrough method** | Different trial copy + eligible choices | Path-specific imprint, technique unlock |
| **Ledger** (theft, corruption) | Harsher audit, karmic beats surface | None — punishment lane |
| **Sect backing** (elder array, guarded site) | Ease %, extra omen option | Sect standing, diary beat |

**Rule:** every prep axis the game tracks should either **change tribulation text/mechanics** or **change what you walk away with** — or don't track it. No invisible grind.

### Anti-patterns

- Mandatory "collect 7 herbs before breakthrough" quest with no trib payoff
- Same overlay shape every gate with only severity scaled up
- Rewards that only come from a post-trib 3-pick, ignoring months of cultivation

---

## Each realm feels different

**Different ≠ longer.** Different means different *question*, *verb*, *limbo fiction*, *failure shape*, and *reward type*.

| Transition | Breakthrough **verb** | Limbo fiction | Tribulation **feel** | Reward **shape** |
|------------|---------------------|---------------|----------------------|------------------|
| **QC → FE** | Qi settles into foundation | Unstable gathered qi | Bedrock test — can it hold? | Foundation variant / crack scar |
| **FE → GC** | Initial Core Formation | Nascent core, unaccepted | Core-integrity lightning | Core grade + condition (cracked / intact) |
| **GC → NS** | Soul birth / embryo | Something stirs behind the eyes | Identity fracture — heart demon | Soul imprint, embryo origin |
| **NS → Void** | Dissolve boundaries | Self thinning | Void unmaking — hold center | Void tolerance, sense shift |
| **Later** | Per cosmology | Per gate | Dao heart, karmic, punishment | Law glimpse, heaven mark |

**Per-gate differentiation toolkit** (mix 2–3 per gate — don't reuse the same combo):

1. **Different breakthrough action name** in cultivation hub (not always "Breakthrough")
2. **Different limbo label** on stats panel for 0–1 player-minutes
3. **Different tribulation type default** (lightning vs heart demon vs dao heart)
4. **Different choice verbs** (bedrock / compress / thunder ≠ barrier / channel / pill)
5. **Different failure mode** (regression vs crack vs broken core vs scar only)
6. **Different reward object** (foundation seal vs core grade vs soul embryo vs void mark)

QC→FE is "can qi become bedrock?" FE→GC is "does the core belong?" — same engine, **different story**.

---

## Prep → tribulation → reward (one pipeline)

```text
BEFORE (sim)                    AT GATE (drama)              AFTER (permanent)
─────────────────────────────────────────────────────────────────────────────
Consolidation tier      →       Severity + choice strength  →  Grade ceiling / perfect imprint
Foundation variant      →       Trial options + copy        →  Foundation echo on core
Pills / array spent     →       Resist, scar soften         →  (spent — survival is payoff)
Manual / method         →       Which beats appear          →  Path-specific blessing
Hasty break             →       Higher severity, worse opts →  Lower grade cap, scar bias
Perfect + peak          →       Easier audit, named choices →  Deterministic imprint
```

**Player-readable preview** before committing to breakthrough:

> *Nascent Core Formation — Initial Core Formation*
> *Consolidation: Peak · Foundation: Sealed (Superior) · Ledger: clean*
> *Audit: Lightning · severity ~moderate · core grade ceiling: Superior*
> *If flawless: Heaven's Mark (matches your sealed nature)*

No hidden math — the sim shows what your life built.

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

## Per-gate tribulation sketches (owner pass — QC / FE→GC / GC→NS)

Three gates, three **structural** relationships — not three lightning reskins:

| Transition | What changes | Tribulation type | One-line heaven question |
|------------|--------------|------------------|--------------------------|
| **QC → FE** | Loose qi → solid foundation | **Lightning** (external) | Can gathered qi settle into bedrock the ledger recognizes? |
| **FE → GC** | Foundation → golden core | **Foundation collapse / inward forge** (internal) | Can what you built collapse into a core without shattering? |
| **GC → NS** | Core shell → nascent soul | **Soul lightning** (external, soul-frequency) | May what stirs inside the core be born — and is it still you? |

### QC → FE — Lightning tribulation

**Obvious and correct.** Heaven strikes from outside; you prove loose qi can **settle** into something the ledger calls Foundation.

- **Feel:** first storm — bedrock, compression, meeting thunder openly (existing script direction).
- **Failure:** foundation crack, unstable foundation, qi backlash — the foundation never properly formed.
- **Prep payoff:** consolidation tier makes "stand on bedrock" strong; rushed break = crack risk.

### FE → GC — Foundation implosion / inward forge

**Owner direction:** not another sky bolt — the foundation **melts, implodes, or collapses inward** under heaven's audit until it becomes a golden core.

Aligns with [`qi-foundation-establishment-redesign.md`](qi-foundation-establishment-redesign.md): player attempts **Initial Core Formation** → thin limbo (mid-forge) → tribulation is the catastrophic condensation.

- **Feel:** pressure from *inside* — dantian contracts, foundation liquefies and re-crystallizes. Horror is **scattering**, not burning.
- **Different from QC:** QC asks "can qi hold shape?" FE→GC asks "can your whole foundation **die as foundation** and become something denser?"
- **Limbo fiction:** *Nascent Core* / *Unconfirmed Golden Core* — the collapse has started; heaven has not stamped it yet.
- **Trial beats (draft):** hold the collapse center · channel melt through sealed nature · let a weak section shatter and seal after (risky).
- **Failure:** core never forms (regression); **cracked core** (formed but damaged); rare **broken core** (wrong shape survived).
- **Prep payoff:** foundation grade/nature echoes into core grade band; peak consolidate = cleaner collapse.

**Soul path variant:** same gate, different auditor — heart demon of *what you're willing to destroy to advance* (not lightning, still inward).

### GC → NS — Soul lightning

**Owner direction:** lightning tinged with soul energy — facilitates the **nascent soul breaking out of the core**.

Already sketched in `TRIBULATION_TRANSITIONS.gc_to_ns` log line. Not heart-demon shadow combat (that's identity *after* birth) — this is the **birth trauma** of the shell cracking open.

- **Feel:** the bolt doesn't test flesh or foundation — it strikes the **boundary** between condensed qi (core) and the soul trying to emerge. Violet-white, wrong-frequency thunder. The core is the egg; the soul is what hatches.
- **Different from FE→GC:** FE→GC is **inward collapse** (making the container). GC→NS is **outward emergence** (breaking the container). Opposite direction.
- **Heaven's question:** not "can you endure?" but "may this soul exist — and is it yours?"
- **Trial beats (draft):** hold the shell together until the soul anchors · let the bolt crack you open (fast, risky) · reject the emergence (will test — wrong for most builds).
- **Failure:** soul stillborn (core intact, no NS path); **warped soul** / weakened soul scars; core cracks but soul survives (playable scar).
- **Prep payoff:** late GC purify stage, core grade, will/spirit — affects whether emergence is clean.

### Parked (owner will do later)

NS → Void, Void → Dao, Dao → Immortal — not in this pass.

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

- [ ] Breakthrough popup: remove entirely, or keep as **confirm + preview** (no style draft)? — *lean: preview carries weight*
- [ ] Transcendence: deterministic imprint per perfect path, or small curated pool filtered by build?
- [ ] Omen phase: always present, or skip when player did chamber prep?
- [ ] Body path tribulation default — lightning on flesh, or endurance trial with different copy?
- [ ] Can players *avoid* tribulation at low gates (hidden paths), or is audit mandatory at every watershed?
- [ ] How much sect infrastructure (array, elder guard) before first tribulation is teachable?
- [ ] Minimum viable "different feel" per gate: is **verb + limbo + reward object** enough before unique combat?
- [ ] Hasty break: always allowed, or gated below "insufficient" consolidation only?

## Implementation crumbs

- `cultivation.js` — breakthrough popup, `continueAfterBreakthrough`
- `transcendence.js` — perk offer / 3-pick
- `tribulation.js` — phases, `getOmenChoices`, `getTrialChoices`, scripted `TRIBULATION_SCRIPTS`
- `consolidation.js` — tier already affects trib (`getConsolidationTierTribulationBonus`)
- `chamber.js` — FE→GC condense + limbo
- `data.js` — `TRIBULATION_TYPES`, `TRIBULATION_SCRIPTS`, `TRANSCENDENCE_PERKS`
