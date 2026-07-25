# Tribulation system rework

| Field | Value |
|-------|-------|
| **Status** | `shipped` (v1 engine) · v2 QC→FE in [#63](https://github.com/WanderingImmortal/tales-immortal-path/pull/63) |
| **Blocked on** | Higher gates — see [`tribulation-per-gate-backlog.md`](tribulation-per-gate-backlog.md) |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chat, 2026-07-22 |
| **Updated** | 2026-07-22 (realm-specific scars, meridian Option A, owner satisfied — park) |

## Intent

Tribulations should feel like **heaven responding to something that matters** — not a generic popup with higher numbers each realm.

**Heaven's attention is earned, not assumed.** Ants scrabbling at the gate are ignored until one **succeeds**. After that, heaven keeps a ledger — and only **peak cultivators who keep stealing** draw the monstrous trials that could erase them.

Breakthrough tribulations, fate-rite tribulations, and (later) karmic / dao trials share one **tribulation engine** but different **scripts** and **stakes**.

**Heaven only acts at junctures** — realm breakthrough and breaches of heaven's rules (fate theft, forbidden acts). It does not micromanage mortal life. The ledger makes breakthrough audits harsher for those who already stole successfully.

**Heaven is not a person.** It is the **accountant of the universe's rules** — a conceptual manifest, the judge of preset law. It does not get "angry"; it **records sacrilege** and **enforces at junctures**. Going against the rules is sacrilege, not offending a deity.

Related: [`tribulation-per-realm-limbo.md`](tribulation-per-realm-limbo.md), [`root-rite-formations.md`](root-rite-formations.md), [`broken-core-cultivators.md`](broken-core-cultivators.md), [`qi-foundation-establishment-redesign.md`](qi-foundation-establishment-redesign.md), [`golden-core-cultivation-journey.md`](golden-core-cultivation-journey.md).

---

## Design notes

### Heaven's ledger (core rule — owner 2026-07-22)

| Situation | Heaven's reaction |
|-----------|-------------------|
| Cultivator **attempts** a fate rite and **fails** | **Indifference** — materials lost, maybe injured; **no escalation**, no ledger entry |
| Cultivator **succeeds** at a fate rite | **Noticed** — root patched; `heavenTheftCount++`; future tribulations scale |
| Low-realm first theft | Serious trial, but **proportionate** — heaven tests, does not annihilate |
| **Peak / absolute cultivator** with multiple thefts | **Threat response** — apocalyptic scaling; heaven tries to kill what it can no longer ignore |

**Layman:** heaven doesn't punish failed pickpockets. It **remembers successful thieves** — and sends worse storms to those strong enough to become a problem.

```js
G.heavenTheftCount = 0;      // successful fate rites only
G.heavenLedger = [];         // { type, month, realmIdx, outcome: 'success' }
// failure attempts: not logged on ledger (optional player diary only)
```

### Threat model (what makes tribulation monstrous)

Severity is not **only** theft count. Combine:

| Factor | Role |
|--------|------|
| **`heavenTheftCount`** | Each successful theft adds to heaven's grudge |
| **Cultivator power** | Realm, competent vs perfected peak, foundation seal grade, dao progress |
| **Rite type** | Composition theft > basin theft (editing birth > opening next gate) |
| **Context** | Breakthrough tribulation vs fate-rite tribulation vs random heavenly punishment |

```text
threatScore = cultivatorPower × (1 + theftCount × theftWeight) × riteTypeMult
severity   = baseScript(realmTransition or riteType) × threatCurve(threatScore)
```

**Design intent:** a Foundation thief surviving theft #1 faces a **real** tribulation. A peak Golden Core on theft #3 faces something **genre-appropriate** — the heavens swatting a wasp that stung them twice already.

Early failures are **dangerous to the player** (lost goods, injury) but **beneath heaven's escalation curve**.

---

### When heaven can act (jurisdiction — owner 2026-07-22)

Heaven is not a petty overseer or sentient judge with moods. It is the **accountant of the universe's rules** — a **concept manifest**: the preset law of realms, roots, lifespans, and what may cross a watershed. Cultivators personify it as "the heavens," but fictionally it **enforces**, it does not **feel**.

| Juncture | What happened | Heaven's move |
|----------|---------------|---------------|
| **Realm breakthrough** | Cultivator knocks on the next watershed gate | **Audit** — test or destroy per the rules of ascent |
| **Rule breach** | Successful fate theft, forbidden act, recorded sacrilege | **Punishment** — theft tribulation or heavenly punishment at juncture |
| **Everything else** | Daily cultivate, failed theft, moral choices, mortal life | **No enforcement** — the rules run; violations may be **logged** but not punished until a juncture |

**"Angering the heavens" (player-facing)** = **sacrilege** — entries on the cosmic ledger (rule violations), not making a god mad. Sects may still say "heaven is displeased" — that's **personification** of the accountant.

**Ledger effect on breakthroughs (confirmed):** each successful theft + sacrilege stack makes later breakthrough tribulations harsher when you present yourself at the gate.

**Lore sketch:** *The Heavenly Order is not a throne. It is the book that says a mixed root stops at the Golden Core gate — until someone forges a false credential and survives the audit. Between audits, the book waits.*

Formal in-world name TBD (Heavenly Order, Mandate of Boundaries, Cosmic Ledger, etc.).

---

### Alignment vs sacrilege vs corruption (owner 2026-07-22 — confirmed)

Full design: [`alignment-sacrilege-corruption.md`](alignment-sacrilege-corruption.md).

**Three tracks — not one score:**

| Track | Role |
|-------|------|
| **Dao alignment** | Philosophy & jianghu — harmony vs rebellious *attitude* ("I don't need the world; I'll take what I need") |
| **Sacrilege** | Ledger entries for rulebook violations (fate theft, forbidden acts) — settled at **junctures** |
| **Corruption** | Stain from **cycle tampering** (soul stealing, reincarnation disruption, major karmic harm) — heaven **notices** at threshold, **acts** at next juncture |

**Confirmed implementation direction:** remove monthly heavenly bless/punish from alignment; reframe omens; qi trib severity from sacrilege/corruption not alignment; decouple corruption from alignment panel logic.

---

### Limbo — brief, not a chapter (owner 2026-07-22)

Limbo is the **thin moment** between knocking and verdict — **not** a playable state players linger in.

| Case | Limbo | Outcome |
|------|-------|---------|
| **Normal breakthrough** | Immediate tribulation overlay; limbo is fiction + stats copy only | Pass → accepted; fail → regression / retry |
| **Broken survivor (rare)** | Someone survived where they should not; door half-open | **Broken Core** or similar — alive, capped, tragic; see [`broken-core-cultivators.md`](broken-core-cultivators.md) |

**Rule:** no extended "unconfirmed realm" grind. If limbo appears in UI, it clears when tribulation resolves — minutes of player time, not years.

---

### Three tribulation families (one engine)

| Family | When | Feel |
|--------|------|------|
| **Breakthrough** | Limbo after major realm crossing (FE→GC first) | Heaven audits: *do you belong in the next realm?* |
| **Fate rite** | End of grand array project ([`root-rite-formations.md`](root-rite-formations.md)) | Heaven punishes **theft**; formation mitigates part |
| **Heavenly punishment** | Rare — karma, forbidden acts, world events | *You were already on the ledger* |

All share: **phases**, **choices**, **scars/transcendence**, **months cost** — but **scripts differ**.

---

### Breakthrough tribulations — per-realm identity & path defaults (owner 2026-07-22)

**Problem today:** random lightning vs heart demon for all paths; same three-phase overlay.

**Path defaults:**

| Path | Default trial | Notes |
|------|---------------|-------|
| **Qi** | **Lightning** (external) | Primary mode — heaven strikes the vessel. Optional **elemental** variant tied to sealed nature / dominant element at specific gates (fire soul at GC, etc.) — still external, not internal |
| **Soul** | **Heart demon** | Internal — shadow self, dao conflicts, unresolved self |
| **Body** | TBD — likely lightning on flesh / endurance trial | External stress on the body; sketch later |

**Qi path rule:** most breakthroughs = lightning tribulation. Elemental flavour is **variation on the same external audit**, not heart-demon crossover. Each major transition should still feel **unique** (intensity, phase choices, failure mode) — owner to sketch per gate.

| Transition | Qi script (draft) | Soul script |
|------------|-------------------|-------------|
| **FE → GC** | Lightning on nascent core; thin limbo → immediate | Heart demon: shortcuts, fear of failure |
| **GC → NS** | Lightning + soul-pressure flavour? or pure lightning | Heart demon: identity at soul birth |
| **NS → Void** | Elemental or void-lightning — external unmaking | Heart demon: dissolution of self |
| Later | Per gate | Per gate |

**v1 rework:** assign `tribulationScript` by `path` + `transitionId`; qi → lightning pool; soul → heart_demon; drop random cross-path pick.

**Owner:** per-realm unique scripts — table to be filled further.

---

### Single-wave vs multi-wave (owner 2026-07-22)

**Default breakthrough tribulation = single wave** (omen → trial → aftermath). Enough for an audit.

**Multi-wave = heaven means destruction**, not routine testing. Use only when:

| Trigger | Why multi-wave |
|---------|----------------|
| **Fate rite** + high `threatScore` | Active theft; heaven strikes until the thief breaks or the array fails |
| **Breakthrough** + high ledger + peak cultivator | Heaven treats ascent as annihilation threat, not audit |
| **Heavenly punishment** events | Rare; already on the ledger |

**Not** every GC breakthrough gets three lightning waves. Multi-wave is the exception that feels like *the sky wants you dead*.

Between-wave choices (reinforce ward, hold center, burn pill) only in multi-wave mode.

---

### Fate-rite tribulations — distinct mode

Not a reskin of breakthrough overlay.

| Phase | What happens |
|-------|----------------|
| **Sit** | Chronicle watch — years in array; sparse reinforcement events |
| **Descent** | Tribulation begins; formation mitigation applied |
| **Trial** | **Single wave** (low threat) or **multi-wave** (high threat / ledger) |
| **Verdict** | Success → root patch + ledger; failure → formation gone, no ledger |

Formation mitigation = mechanical % + log flavour. **No mandatory visible meters** — weight comes from copy, stakes, and consequences (owner 2026-07-22).

---

### Making tribulations more exciting (owner direction)

Current build (`tribulation.js`): omen → trial → aftermath overlay; mostly text choices + optional heart-demon combat. **Functional but flat.**

**In scope now:**

1. **Thin limbo** — immediate tribulation; rare broken survivor outcome
2. **Per-realm breakthrough scripts** — unique and significant each gate (sketch TBD)
3. **Multi-wave as exception** — destruction intent, not default audit
4. **Consequences stick** — scars, cracked core, broken core, transcendence (rare)
5. **Ledger amplifies breakthrough tribulations** — harder if you stole successfully before

**Deferred (come back later):**

- Build-tied choice pools (foundation nature, path)
- Chronicle / diary integration for tribulation beats
- Heaven's voice / ledger callouts in copy
- Mandatory visible meters (integrity bars) — weight via event stakes instead

**Not required for v1:** full combat overhaul; new art; every realm fully scripted day one.

---

### Suggested build order

```text
1. Heaven ledger + threatScore (success-only; breakthrough trib scales with ledger)
2. Thin limbo + FE→GC scripted breakthrough (per-realm sketch table — owner to fill)
3. Single-wave default tribulation; multi-wave flag for high-threat fate rite / peak+ledger
4. Fate-rite tribulation mode — needs chronicle project
5. Per-realm unique scripts (GC→NS, NS→Void, …) — iterative
```

---

## Build v1 (shipping now)

**Scope:** accountant heaven engine + breakthrough path scripts — **not** fate-rite waves or per-realm unique choice pools yet.

| Ship in v1 | Defer |
|------------|-------|
| `startTribulation({ breakStyle, context, transitionId, limbo })` | Multi-wave tribulation |
| Path scripts: qi/body → lightning, soul → heart_demon | Per-transition unique choice pools |
| `heavenTheftCount` + `corruptionNoticed` amplify severity at juncture | Fate-rite tribulation mode |
| Thin `G.cultivationLimbo` on FE→GC chamber condense | Broken Core player branch |
| `TRIBULATION_TRANSITIONS` copy per gate | Elemental qi variants per realm |
| Remove dao-alignment severity mult on qi trib | Heaven-facing atonement rite |
| Corruption migration (no game over, no drift, cull bad sources) | `addCycleStain` on new soul content |
| Disable monthly heavenly bless/punish | UI: move corruption off alignment panel |

**Related design (parked, not v1 code):** [`alignment-sacrilege-corruption.md`](alignment-sacrilege-corruption.md), [`root-rite-formations.md`](root-rite-formations.md), [`soul-body-refining.md`](soul-body-refining.md), [`watershed-realms-lifespan-pacing.md`](watershed-realms-lifespan-pacing.md).

---

### Scars — realm-specific pools (owner 2026-07-22)

**Rule:** every scar belongs to a **realm gate** (or explicit transition). Rolling at QC→FE must never surface *Cracked Core* or *Fractured Dao* — those are GC+ / NS+ wounds.

| Principle | Detail |
|-----------|--------|
| **Realm tag required** | Each `TRIBULATION_SCARS` entry gets `realmAtBreakthrough` (or `transitionId`) — no untagged scars |
| **Pool = that gate only** | `getEligibleScarsForRoll` filters strictly; **no fallback** to the global list when the pool is empty |
| **Concrete outcomes** | Prefer choice-forced scars (foundation crack, qi backlash) over opaque `+scar risk %` poker |
| **Mostly downside** | Small upside optional; born from trib beats, not random loot |

**QC→FE example scars (draft):** foundation crack, meridian burst (if meridians matter at FE wiring), qi backlash — not late-realm names.

**Code gap today:** several scars lack `realmAtBreakthrough`; empty pool falls back to all scars — feels random. Fix when QC→FE script ships.

---

### Meridians — Option A for now (owner 2026-07-22)

**Chosen direction:** meridians matter at **Foundation Establishment** as **foundation wiring**, not as QC homework grind or QC→FE trib fiction.

| Do | Don't (for now) |
|----|-----------------|
| FE-era wiring / circulation fantasy | 13-node meridian grind without unique payoffs per node |
| Tie *Shattered Meridian* scar to a trib beat at the FE gate | `minMeridians: 2` on QC perfect consolidation |
| Revisit when FE journey redesign lands | Force meridians into QC→FE trib choices |

Potential acknowledged — excavate when [`qi-foundation-establishment-redesign.md`](qi-foundation-establishment-redesign.md) gets an owner pass.

---

- [ ] `heavenTheftCount` / `heavenLedger` (success-only) — see root-rite doc
- [ ] `G.cultivationLimbo` or equivalent for FE→GC
- [ ] `transitionId` on `startTribulation(context)` — breakthrough vs fate_rite vs punishment
- [ ] Per-transition choice pools in data (not only `pickTribulationType()` random)
- [ ] Chronicle fate-rite project shell

## Open questions

- [x] Breakthrough tribulation scales with ledger? → **Yes** — harsher audit if you stole before (owner 2026-07-22)
- [x] Limbo linger? → **No** — thin moment; broken survivor is rare edge case
- [x] Multi-wave default? → **No** — only destruction-intent (high threat / fate rite)
- [x] Visible meters required? → **No** — event weight over UI chrome (deferred)
- [ ] Formal lore name for heaven's jurisdiction rule (accountant / cosmic ledger)
- [ ] Alignment rework: see [`alignment-sacrilege-corruption.md`](alignment-sacrilege-corruption.md)
- [ ] Per-realm breakthrough script sketch (table — owner)
- [ ] Player Broken Core — ever, or NPC-only?
- [ ] Combat during tribulation: keep heart-demon fights for which scripts?

## Implementation crumbs

- `tribulation.js` — `startTribulation`, phases, `getTribulationSeverity`, `pickTribulationType`
- `data.js` — `TRIBULATION_TYPES`, `TRIBULATION_BALANCE`, `TRIBULATION_PATH_FLAVOR`
- `chamber.js` — `chamberCondensePending`, limbo hook
- `ui.js` — `tribulationOverlay`, cue banner, marks display
- `root-rite-formations.md` — fate-rite tribulation phase
