# Alignment, heavenly karma & corruption (tracks)

| Field | Value |
|-------|-------|
| **Status** | `designed` — **NHK rework** owner 2026-10-14 supersedes sacrilege-as-separate-meter for heaven rulebook |
| **Blocked on** | Tribulation rework; NHK save shape; corruption transform design |
| **Issue** | none yet |
| **Chat / PR** | 2026-07-22 initial; **2026-10-14** Negative Heavenly Karma threads |
| **Updated** | 2026-10-14 |

## Intent

**Dao alignment** = jianghu philosophy (NPCs, markets). **Negative Heavenly Karma (NHK)** = **threads** tied to heaven’s rulebook — one unified heavenly ledger, not two parallel “sacrilege + corruption stain” meters for the same jurisdiction. **Corruption** (rework) = **transformative taint** — you become something else — **different system**, not heavenly fuel.

Related: [`tribulation-system-rework.md`](tribulation-system-rework.md), [`soul-root-dao.md`](soul-root-dao.md), [`root-rite-formations.md`](root-rite-formations.md).

---

## Owner rework — Negative Heavenly Karma (NHK) (2026-10-14)

**UI term:** **Negative Heavenly Karma** (avoid “sacrilege” in player copy). Internal: `negativeHeavenlyKarma` / `nhkThreads[]`.

### Core rule: heaven only at **gates**

Heaven **does not** enforce mid-walk except through **junctures** (breakthrough, breach tribulation, registered gate events). Between gates the book **accumulates threads** — visible to karma cultivators, not a lightning bolt every month.

**Exception (player agency):** a **karmic cultivator** can **force settlement** (Retribution) — that is **not** heaven acting; it is a mortal/interface invoking the ledger **outside a gate**. Fiction cost: the walker gains **their own NHK thread** — *“heaven does not reach here; you spoke in its voice.”*

### Thread model (replaces sacrilege entries + corruption bar for heaven)

Each **NHK thread** = one class of violation against heaven’s rulebook:

| Field (lean) | Purpose |
|--------------|---------|
| `type` | `gate_theft` · `forbidden_art` · `heaven_oath_break` · `forced_settlement` · … |
| `strength` | 1–5 — grows when **same class** repeated |
| `heat` | 0–100 — volatility; karma **reinforce** on heavenly threads (future) |
| `entangled` | count of active types — more types → closer to forced action |

**Repeat action** → **same thread strengthens** (not a second confusing meter). **New violation class** → **new thread entangled**.

**Heaven forced to act when:**

1. **Juncture** — you knock on a gate; tribulation reads **sum(strength) + entanglement**; or  
2. **Karmic cultivator** — Retribution / apex art **settles early** on **you** (target) or you settle on them; or  
3. *(Future)* world event at threshold — rare.

**Migration from code today:** `heavenTheftCount` → **`gate_theft` thread strength**; `corruptionLevel` / `corruptionNoticed` for **cycle** violations → **fold into NHK thread types** (e.g. `cycle_tamper`) until **Corruption transform** ships — then **move** soul-cycle acts to transform track and **remove** from NHK (see below).

### Retribution cooldown (owner sidenote)

Each **forced settlement** (Retribution with heavenly fuel):

- Adds or strengthens walker’s **`forced_settlement`** NHK thread  
- Acts as **soft cooldown** on spam — next heavenly retribution **less efficient** until cleansed  
- **Cleanse:** time, rite, manual, peer — karmic cultivator can **sever/reinforce own** NHK (Root Karma fantasy)

### What counts (unchanged jurisdiction pin)

See § Heaven’s jurisdiction below — only **rulebook** acts create **NHK threads**. Jianghu murder/feud → **alignment + interpersonal karma** only.

---

## Corruption — rework (separate system, parked)

**Not** heavenly karma. **Corruption** = **transformative taint** — the cultivator **turns into** or **toward** something (demon physiology, soul-refine mutation, loss of human claim on reincarnation).

| | **NHK** | **Corruption (new)** |
|--|---------|---------------------|
| Question | *What did you do to the rulebook?* | *What are you **becoming**?* |
| Shape | **Threads** (many, typed) | **Stages / mutation** (few, body-soul identity) |
| Enforcement | Junctures + karma settlers | Transformation content, tribulation **flavour**, maybe unique endings |
| Cleansing | Atonement, sever thread | Harder — may be **irreversible** past stage |

**Parked hooks:** [`soul-body-refining.md`](soul-body-refining.md), evil physique **acts** (not embrace). Retire **`corruptionLevel` game-over** and **tribulation `corruptionNoticed` mult** when transform track replaces cycle stain — map old “cycle tamper” to **NHK `cycle_tamper` thread** interim.

**Open:** one doc `corruption-transform.md` when mechanics exist.

---

## Design notes (legacy + alignment)

### The three tracks (target state)

| Track | What it is | When it “acts” |
|-------|------------|----------------|
| **Dao alignment** | Philosophy — harmony ↔ rebellious | NPCs, markets — **not heaven** |
| **Negative Heavenly Karma** | **Threads** vs heaven’s rulebook | **Junctures**; **karmic cultivators** force early settlement |
| **Corruption (transform)** | **Becoming** — mutation / monster path | Story, chamber, irreversible stages — **TBD** |

**Deprecated framing:** separate **Sacrilege** + **Corruption stain** as two heavenly fuels — merged into **NHK threads** for one player-readable heavenly ledger.

---

### Heaven’s jurisdiction — what counts (owner lean 2026-10-14)

Heaven (the accountant) cares about **rules it owns**, not mortal morality. **Jianghu evil** (robbery, murder, feud) is **alignment + interpersonal karma** unless the act also **breaks cosmic jurisdiction**.

| In heaven’s book | Usually **not** heaven alone |
|------------------|------------------------------|
| **Realm / root / lifespan gates** — false credentials, fate theft, skipping watershed lawfully | Ordinary murder, banditry, sect war (unless oath registered *to heaven*) |
| **Soul cycle** — reincarnation, passage, what may bind or harvest souls | Rebellious attitude, “evil” physique without acts |
| **Registered oaths** — vows sworn *to the mandate* (rare rites), not every sect promise | Broken business contract, insult |
| **Forbidden arts** — list TBD: techniques that **touch cycle or gates** without permission | Generic demonic cultivation that only hurts mortals |

**Pin list (implement gradually):**

1. **Successful fate / root theft** (existing `heavenTheftCount`)
2. **Soul bind / steal / refine** outside permitted framework ([`soul-body-refining.md`](soul-body-refining.md))
3. **Reincarnation trap / redirect / annihilate** soul from cycle
4. **Mass cycle poison** — grotto/refine that corrupts local reincarnation (regional, rare)
5. **Forbidden heaven-touching art** — mastered or used (explicit id list)
6. **Heaven-registered oath broken** — content-flagged only

Everything else → **alignment** and/or **interpersonal karma threads**, not **NHK** unless a row above applies.

---

### Player-facing — Negative Heavenly Karma (owner 2026-10-14)

**One heavenly ledger for the player:** a list of **threads** (typed violations), each with **strength** (repeat the same sin → same thread grows). More **distinct types** → **entangled** → heaven’s hand is heavier at the next **gate**. No second “cycle stain bar” in the same panel — that was the confusing duplicate.

**Corruption (transform track)** is **not** on this panel — see [§ Corruption — rework](#corruption--rework-separate-system-parked) and [`corruption-transform.md`](corruption-transform.md).

#### What exists in code today (honest)

| Signal | NHK migration lean | Where it hits today |
|--------|-------------------|---------------------|
| `heavenTheftCount` | **`gate_theft`** thread strength | Breakthrough tribulation **× (1 + 0.25 × thefts)** — [`tribulation.js`](../../tribulation.js) |
| `corruptionLevel` / `corruptionNoticed` | **`cycle_tamper`** (interim) → later **transform track only** | Trib **× ~1.35** when noticed; alignment UI bar |

Ship target: `G.nhkThreads[]` replaces theft count + heavenly slice of corruption for tribulation and Karma fuel.

#### Four play profiles (threads, not two meters)

| Your profile | Dominant NHK threads | **Feel** |
|--------------|----------------------|----------|
| **Gate thief** | `gate_theft` strong, few others | Junctures = **audit / credential** scripts; seers: *fate marked by theft*; jianghu may still trust you. |
| **Soul butcher** | `cycle_tamper` / `forbidden_art` (interim: high cycle_tamper strength) | Junctures = **cycle / heart-demon** waves; omens *the cycle remembers*; Karma sense shows **heavy heavenly tint**. |
| **Karmic abuser** | `forced_settlement` on **you** | You **spoke heaven’s voice outside a gate** — retribution **efficiency drops** until you cleanse that thread (rite, time, peer Karma). |
| **Full stack** | Many types, high strength + entanglement | Worst juncture multiplier; **rich Retribution fuel** for enemies; qualified karma walkers = nightmare. |
| **Clean book** | *(none or faint)* | Tribulation = skill check; heavenly retribution **whiffs**; interpersonal karma only. |

#### Between junctures

Heaven **does not** smite monthly. Threads **sit in the book** — karma cultivators **see** them; ordinary NPCs may not. **Repeat** the same violation class → **one thread strengthens** (player copy: *Negative Heavenly Karma: Gate Theft deepens*).

#### Karma Retribution — fuel and backlash

| | Target | Caster (walker) |
|--|--------|-----------------|
| **Fuel** | Sum of **NHK thread strengths** (+ interpersonal edges) — typed threads can skew **debuff tag** (e.g. `gate_theft` → audit whiplash on Core/Circulation) | — |
| **Backlash** | — | Each **forced settlement** adds/strengthens caster’s **`forced_settlement`** thread — *heaven’s rule: no direct reach except gates; you bridged anyway* |
| **Cooldown fantasy** | — | Spam → **`forced_settlement`** high → next heavenly retributions **less efficient** until sever/atone (Root Karma cleanse verbs) |
| **Fabricated guilt** | Weak or fails resist check | **`forbidden_art`** or **`heaven_oath_break`** thread on caster if art lies to the book |

See [`soul-root-dao.md`](soul-root-dao.md) § Retribution Echo for **interface** scaling.

#### Cleansing NHK (not transform)

| Path | Clears |
|------|--------|
| **Heaven-facing atonement** (rare rite @ juncture-adjacent) | Specific thread types — partial |
| **Stop repeating** + time | **Heat** decay on threads; strength may cap |
| **Karmic cultivator** (self or peer) | **Sever / reinforce own** NHK — spirit Root fantasy |
| **Public apology** | **Interpersonal** only — **not** NHK |

#### One-line player guide

- **Negative Heavenly Karma** = *threads tied to heaven’s rulebook* — repeat sins **twist the same thread**; many threads **entangle** until the **next gate** (or a karma walker **forces settlement**).
- **Forced retribution** = powerful, but costs **`forced_settlement`** on **you** — a cooldown on speaking heaven’s voice mid-walk.
- **Corruption** (future) = *what you are **becoming*** — separate from the heavenly ledger.

---

### Legacy note — sacrilege vs corruption split (2026-07, superseded 2026-10-14)

Pre-NHK design used **Sacrilege** (discrete entries) + **Corruption** (cycle stain bar) as two heavenly fuels. Owner found them **same flavour, two UIs**. **Merged into NHK threads** for heaven; **cycle “stain”** migrates to **transform corruption** when that doc ships. Implementation crumbs below still name old fields until migration lands.

---

### Dao alignment (keep — reframe)

**Rebellious** is not "evil" or "corrupt." It is an **attitude**: *I don't need the world — I'll take what I need.* Self-reliant, predatory, dismissive of mandate and sect niceties. Jianghu reacts; heaven does not smite you monthly for it.

**Harmony** = walking with mortal order, aid, sect righteousness — again **social/philosophical**, not cosmic bookkeeping.

**Still drives (no heaven enforcement between junctures):**

- NPC mood, refusals, market prices
- Sect doctrine friction
- Technique / content gates (`reqAlignment`)
- Soul-path tribulation flavour (heart demon themes)
- Player-facing omens — reframe copy away from sentient heaven ("path diverges from the mandate" not "heaven recoils")

**Remove / relocate:**

- `maybeHeavenlyAlignmentEvent()` monthly bless/punish at ±90 — not accountant heaven; defer to fortune/karma or juncture settlement

**De-couple from corruption:**

- Drop `corruptionDriftPerCultivate` pushing alignment down — corruption is not an alignment sub-stat
- Drop corruption capping harmony **tier** — corruption has its own threshold fiction instead

---

### Sacrilege (ledger entries) — **legacy → NHK `type`**

Discrete flags or counter — **entries**, not a smooth -100…+100 bar. **Target:** each entry class → one **NHK thread `type`** with **strength**.

| Violation | Ledger? |
|-----------|---------|
| Successful fate theft (basin / composition rite) | Yes — `heavenTheftCount` |
| Forbidden technique mastered / used | Yes (TBD which) |
| **Heaven-registered** oath broken; kills that **explicitly** violate cycle law (TBD list) | Yes — not every kill |
| Rebellious alignment actions (rob, intimidate) | **No** — alignment only unless act also breaks cosmic rule |
| Failed fate rite | **No** |

Stacks with other NHK threads for **juncture severity**; settled at breakthrough or breach tribulation.

---

### Corruption (cycle tampering — owner 2026-07-22) — **legacy → NHK interim + transform**

**Not an alignment thing.** **Heavenly cycle tamper** → **`cycle_tamper` NHK thread** until [`corruption-transform.md`](corruption-transform.md) owns **mutation** fiction; then remove cycle acts from NHK and use **transform stages** instead.

**What adds corruption (sketch):**

| Act | Fiction |
|-----|---------|
| **Soul stealing** | Harvesting or binding souls outside permitted arts |
| **Reincarnation tampering** | Refining, trapping, or redirecting souls against the cycle |
| **Major karmic damage** | Severing ties, mass fate disruption, grotto/refining that poisons local karma |

**Heaven behaviour:**

1. **Below threshold** — accountant **logs** but does not act. Player may feel unease (omen copy); no random smites, **no game over**.
2. **Threshold breached** — `corruptionNoticed = true`; omen foreshadows — *"The cycle remembers."* Still **no immediate enforcement**.
3. **Next juncture** — tribulation severity **amplified** (and multi-wave threshold if combined with sacrilege + peak threat). **Amplify only** — does not block breakthrough or force a separate reckoning event first (owner 2026-07-22).

```js
G.corruptionLevel = 0;       // stain 0…threshold
G.corruptionThreshold = 100; // tune per content
G.corruptionNoticed = false; // flip when threshold breached — foreshadow next juncture
```

**Remove old behaviour:** instant `gameOver` when `corruptionLevel >= corruptionThreshold` (`cultivation.js` evil physique) — replace with notice + juncture amplify when tribulation hook exists.

**UI (later):** move corruption out of alignment popup — own line on stats or cultivation panel ("Cycle stain" / "Karmic debt").

---

### How tracks interact at a juncture

```text
Breakthrough tribulation severity =
  base(realm, path)
  × nhkMultiplier( sum(thread.strength), entangledTypes, maxHeat )
  × transformCorruptionMult( optional — when corruption-transform ships )
  × threatScore(peak, perfected)

// Interim until nhkThreads[] ships:
//   nhkMultiplier ≈ theftMult(heavenTheftCount) × noticedMult(corruptionNoticed)
```

**Alignment** does not multiply qi lightning severity (owner confirmed). Soul heart-demon **flavour** may still reference alignment (rebellious sees different mirror).

---

### Confirmed tweaks (owner 2026-07-22)

- [x] Split alignment / sacrilege / corruption
- [x] Remove monthly heavenly bless/punish from alignment (when implementing)
- [x] Reframe alignment omens (less sentient heaven)
- [x] Tribulation severity from sacrilege + corruption at juncture, not alignment (qi path)
- [x] Corruption = cycle/rulebook tampering; threshold → noticed → **amplify at juncture only**
- [x] Rebellious = attitude ("I'll take what I need"), not corruption

---

### Migration audit — old corruption sources (redo required)

Current code still treats corruption as a generic "evil meter" tied to alignment. **Redo** anything that does not fit **cycle tampering** (soul stealing, reincarnation disruption, major karmic harm).

| Source | File | Current | New model |
|--------|------|---------|-----------|
| **Evil physique embrace** | `cultivation.js` | +20 corruption; **game over** at threshold | **Remove entirely** until body-path physique rewrite. Stain from **acts**, not physique id. |
| **"Embrace Demonic Impulse"** alignment action | `data.js` `DAO_ALIGNMENT.actions` | +6 corruption, requires corruption 20+ | **Delete action** — use `walk_wicked_path` for attitude. |
| **"Public Atonement"** corruption reduce | `data.js` | −8…15 corruption | **Reframe:** jianghu reputation / alignment only — **no** cycle stain cleanse until heaven-atonement rite exists. |
| **Demonic shrine desecrate** | `data.js` zone encounter | +5 corruption, −5 alignment | **Alignment − only** (or remove encounter choice). No corruption. |
| **Purifying elixir** | `data.js` pill | cheap corruption reduce + alignment | **Gate** as rare high-tier; only meaningful stain cleanse in game for a long time. |
| **Heavenly punishment `corruption_sting`** | `data.js` + `alignment.js` | +8 corruption on monthly punish | **Remove** with monthly heavenly events |
| **`applyCorruptionAlignmentDrift`** | `alignment.js` + `actions.js` cultivate | High corruption drifts alignment −1 per cultivate | **Remove** — corruption ≠ alignment |
| **`corruptionBlockHarmony`** | `alignment.js` | High corruption caps harmony perks | **Remove** — separate tracks |
| **Alignment popup warn** | `ui.js` | "drifts alignment downward when cultivating" | **Remove** / replace with cycle-stain omen when `corruptionNoticed` |
| **Purifying elixir** | `data.js` pill | reduces corruption + alignment +2 | **Keep** corruption reduce; alignment +2 optional (steadying self, not heaven) |
| **Quest/NPC flavour** | `quests.js`, factions | "corruption" in story text (Master Zhong) | **Keep as fiction** — NPC demonic corruption, not player `corruptionLevel` |
| **Emberwild hunt corruption** quest | `factions-expand.js` | jungle demonic corruption event | **Keep as world fiction** — not player stain unless player acts tamper cycle |
| **Technique copy** | `data.js` | "purge corruption from foe" | Flavour / future PvE — no change until soul systems |

### Evil physiques & body path (owner 2026-07-22)

Physique cultivation is **due for a rewrite** — should live under **body path** chamber/projects, not a side "embrace evil physique" button. Until then, corruption rules below.

**Principle:** **Physique type alone** does not stain the cycle. **What you do** with it does.

| Physique flavour | Embracing / training | Cycle stain (corruption) |
|------------------|----------------------|---------------------------|
| **Blood devourer** | Rebellious alignment shift maybe; not heaven's business | **Massacres**, blood-refining at scale, harvesting living qi from people |
| **Demon heart / shadow form** | Attitude + alignment; maybe minor sacrilege if forbidden art | Acts that tamper souls or reincarnation — not the passive bonus |
| **Soul-into-body refining** | Major forbidden practice (TBD mechanic) | **Large stain** — direct cycle violation |

Blood devourer walking around hungry ≠ corruption. Blood devourer **feeding** on a village = stain (and alignment/reputation). Heaven logs; amplifies at next juncture.

**Evil physique embrace today** (`cultivation.js` +20, game over): **remove** until body-path rewrite. No blanket corruption on equip.

---

### Alignment actions & encounters — cull or repurpose (owner 2026-07-22)

Several legacy hooks treated "evil" as corruption. Under accountant heaven, **cut or reassign**:

| Content | Verdict | Why |
|---------|---------|-----|
| **"Embrace Demonic Impulse"** (`walk_wicked_path` sibling) | **Remove** | Too vague; rebellious attitude is already `walk_wicked_path` / alignment shifts. Heaven doesn't care about impulse. |
| **Demonic shrine desecrate** | **Remove corruption**; optional **alignment −** only | Heaven doesn't audit shrines. Jianghu / sect reaction if anyone sees. Not sacrilege unless altar is a **registered cycle site** (rare story beat). |
| **"Public atonement"** | **Reframe — jianghu atonement**, not heaven | Confessing to mortals restores **reputation / alignment**; does **not** cleanse cycle stain. Different fantasy from settling with the accountant. |
| **Heaven-facing atonement** | **Design later** — rare, high-tier | Rite or pilgrimage that addresses **sacrilege ledger** or **corruption noticed** — expensive, partial, at a juncture-adjacent beat. Not a button in alignment panel. |
| **Purifying elixir** | **Rare high-tier pill** | "Mends the bridge" = reduces **cycle stain** and maybe clears `corruptionNoticed` below threshold — **not** shop trash. Wrong tier today; gate behind realm, recipe, sect, or reincarnation unlock. |

---

**Central helper (when implementing):**

```js
function addCycleStain(amount, reason) {
  // was: raw G.corruptionLevel +=
  // check threshold → set corruptionNoticed + omen
}
```

---

## Prerequisites

- [ ] Migration audit above — remove/reframe each old source
- [ ] Remove `gameOver` on corruption threshold (`cultivation.js`)
- [ ] `addCycleStain()` + `corruptionNoticed` on threshold breach
- [ ] Tribulation: `getCorruptionJunctureMult()` amplify when `corruptionNoticed`
- [ ] Stop corruption ↔ alignment drift (`applyCorruptionAlignmentDrift`, `corruptionBlockHarmony`)
- [ ] Remove `maybeHeavenlyAlignmentEvent` monthly bless/punish
- [ ] `G.nhkThreads[]` + tribulation + Karma heavenly fuel; deprecate theft count / heavenly corruption bar
- [ ] Corruption sources wired to soul/refining content (when those systems exist)
- [ ] UI: corruption separate from alignment panel (deferred)

## Open questions

- [ ] **Forbidden art id list** — which techniques add **`forbidden_art`** NHK on first use vs mastery only
- [ ] **Heaven-registered oath** — which story oaths count (sect vs mandate rite)
- [x] **Single heavenly meter** — **NHK threads** (owner 2026-10-14); no sacrilege+corruption dual fuel
- [ ] Evil physique: **no stain on embrace**; stain from documented acts when body path ships
- [ ] Heaven-facing atonement: separate rare rite (design TBD) — not public atonement
- [ ] Purifying elixir: tier gate + recipe; only premier stain cleanse for most of game

## Implementation crumbs

- `alignment.js` — `daoAlignment`, `shiftDaoAlignment`, `maybeHeavenlyAlignmentEvent`, corruption drift
- `core.js` — `corruptionLevel`, `corruptionThreshold`
- `cultivation.js` — corruption gain on certain acts
- `ui.js` — alignment popup corruption bar
- `tribulation.js` — severity hooks
