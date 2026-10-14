# Alignment, sacrilege & corruption (three tracks)

| Field | Value |
|-------|-------|
| **Status** | `designed` (owner direction 2026-07-22) |
| **Blocked on** | Tribulation rework; corruption content hooks |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chat, 2026-07-22 |
| **Updated** | 2026-10-14 |

## Intent

Three **separate** tracks — not one muddy "morality score." Heaven (the cosmic accountant) only enforces **sacrilege** and **corruption threshold** at **junctures**. **Dao alignment** is how you walk in the jianghu — philosophy and reputation, not the rulebook.

Related: [`tribulation-system-rework.md`](tribulation-system-rework.md), [`root-rite-formations.md`](root-rite-formations.md).

---

## Design notes

### The three tracks

| Track | What it is | Example sources | When heaven cares |
|-------|------------|-----------------|-------------------|
| **Dao alignment** | Cultivator **philosophy** — harmony ↔ rebellious *attitude* | Help innocents, sect doctrine, walk your path, "I don't need the world" | **Not directly** — affects NPCs, markets, techniques, soul-path flavour |
| **Sacrilege** | Discrete **rulebook violations** (ledger entries) | Successful fate theft, forbidden arts, certain oath-breaking | **Junctures** — harsher breakthrough / fate-rite tribulation |
| **Corruption** | **Stain** from tampering with cosmic cycles | Soul stealing, refining that disrupts reincarnation, major harm to karmic cycles/ties | **Accrues silently**; heaven **notices** past a threshold but **acts at next juncture** |

**Layman:**

- **Alignment** = *who you choose to be* ("I'll take what I need" rebellious vs harmonious sect disciple).
- **Sacrilege** = *what forbidden things you did that the book records*.
- **Corruption** = *how badly you damaged the cycle itself* — reincarnation, souls, karma.

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

Everything else → **alignment** and/or **interpersonal karma threads**, not sacrilege/corruption unless a row above applies.

---

### Sacrilege vs corruption — why two (not duplicate “evil meter”)

They answer **different questions** on the same jurisdiction:

| | **Sacrilege** | **Corruption** |
|--|---------------|----------------|
| **Question** | *Which rules did you break, how often?* | *How much damage did that do to the cycle?* |
| **Shape** | **Discrete entries** (rap sheet) | **Accumulating stain** (0…threshold) |
| **Analog** | Indictments — fate theft #2, forbidden art X | Pollution — the reincarnation pipe is clogged |
| **Typical source** | **Gate fraud**, successful theft, flagged forbidden use | **Soul cycle harm** — bind, refine, trap, mass sever |
| **UI feel** | “Ledger: 3 entries” | “Cycle stain: 72 / 100 — **noticed**” |
| **At juncture** | Multiplier from **entry count + type** | Multiplier if **threshold noticed** |

**One act, both:** soul-into-body refining → **sacrilege entry** (“forbidden soul refine”) **+** large **corruption** bump. Fate theft success → **sacrilege/theft count** **+** small or zero corruption (you cheated the **gate**, didn’t necessarily gum the **cycle**).

**Not sacrilege or corruption:**

- Walk wicked path, rob merchant, kill rival cultivator → **alignment** + **incidents** for Karma threads
- Fail fate rite → indifference (no entry)

**Merge option (if two tracks still feel samey in UI):** one **`heavenLedger[]`** where each entry has `{ type, corruptionPoints }`; **sacrilege** = entry list, **corruption** = sum(points). Same save, two views — tribulation reads both.

**Karma Retribution (spirit Root):** **Heavenly fuel** reads **corruption + sacrilege-derived weight** — see [`soul-root-dao.md`](soul-root-dao.md) § two karma layers.

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

### Sacrilege (ledger entries)

Discrete flags or counter — **entries**, not a smooth -100…+100 bar.

| Violation | Ledger? |
|-----------|---------|
| Successful fate theft (basin / composition rite) | Yes — `heavenTheftCount` |
| Forbidden technique mastered / used | Yes (TBD which) |
| **Heaven-registered** oath broken; kills that **explicitly** violate cycle law (TBD list) | Yes — not every kill |
| Rebellious alignment actions (rob, intimidate) | **No** — alignment only unless act also breaks cosmic rule |
| Failed fate rite | **No** |

Stacks with corruption for **juncture severity**; settled at breakthrough or breach tribulation.

---

### Corruption (cycle tampering — owner 2026-07-22)

**Not an alignment thing.** Corruption always felt out of place glued to the alignment panel — it belongs on the **rulebook / cycle** axis.

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
  × sacrilegeMultiplier(heavenTheftCount + ledger entries)
  × corruptionMultiplier(if corruptionNoticed)
  × threatScore(peak, perfected)
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
- [ ] `sacrilegeLedger[]` or extend `heavenLedger` beyond theft
- [ ] Corruption sources wired to soul/refining content (when those systems exist)
- [ ] UI: corruption separate from alignment panel (deferred)

## Open questions

- [ ] **Forbidden art id list** — which techniques add sacrilege on first use vs mastery only
- [ ] **Heaven-registered oath** — which story oaths count (sect vs mandate rite)
- [ ] **Merge vs dual meters** — owner preference after Karma pass (ledger-only vs stain bar)
- [ ] Evil physique: **no stain on embrace**; stain from documented acts when body path ships
- [ ] Heaven-facing atonement: separate rare rite (design TBD) — not public atonement
- [ ] Purifying elixir: tier gate + recipe; only premier stain cleanse for most of game

## Implementation crumbs

- `alignment.js` — `daoAlignment`, `shiftDaoAlignment`, `maybeHeavenlyAlignmentEvent`, corruption drift
- `core.js` — `corruptionLevel`, `corruptionThreshold`
- `cultivation.js` — corruption gain on certain acts
- `ui.js` — alignment popup corruption bar
- `tribulation.js` — severity hooks
