# Root rite formations — heaven theft & escalating tribulation

| Field | Value |
|-------|-------|
| **Status** | `designed` (owner direction 2026-07-22) |
| **Blocked on** | Chronicle projects (sit duration / watch mode); formation tier ladder stub |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chat, 2026-07-22 |
| **Updated** | 2026-07-22 |

## Intent

**Fate rites** let a cultivator **keep stealing from heaven** — raising basin ceiling or purifying composition. There is **no hard once-per-life cap**. The brake is **strength**: you must survive a tribulation that grows with each **successful** theft, while a grand formation **mitigates part of the blow** (mechanical and/or flavour).

**Heaven does not escalate for failures.** Subjects scrabbling at the gate are beneath notice until one **succeeds** — then the ledger opens. Monstrous tribulations target **peak cultivators** who keep stealing and could pose a real threat. See [`tribulation-system-rework.md`](tribulation-system-rework.md).

Related: [`spiritual-roots-taxonomy-v2.md`](spiritual-roots-taxonomy-v2.md), [`formations-and-arrays.md`](formations-and-arrays.md), [`watershed-realms-lifespan-pacing.md`](watershed-realms-lifespan-pacing.md), [`chronicle-and-projects.md`](chronicle-and-projects.md).

---

## Design notes

### Core fantasy

> Sect elder reads your root at birth. You can defy that verdict — again and again — but heaven remembers every theft.

- **Formation** = the stolen diagram; lays the pattern, channels, seals; **absorbs part of the tribulation**.
- **Player** = must endure what leaks through — stats, realm, foundation quality, pills, physique, choices during the rite project.
- **Materials & tier** = each successive rite is **more expensive** and/or requires a **higher-tier formation blueprint**.

### Two fate-rite families (repeatable)

| Family | What changes | Still one step at a time? |
|--------|--------------|---------------------------|
| **Basin ascension** | +1 innate ceiling (watershed gate) | Yes — one basin step per successful rite |
| **Composition purification** | One composition row (pentamixed→mixed→dual→single) | Yes — never skip a row in one rite |

**Grade purification** (inferior→common pills, stabilise arrays) stays the **cheap track** — mild or no tribulation. Not covered here.

### No once-per-life cap — soft caps instead

| Brake | How it works |
|-------|----------------|
| **Escalating tribulation (success only)** | Each **successful** fate rite adds to heaven's ledger; **failed attempts do not escalate** — heaven ignores ants until one succeeds |
| **Threat scaling** | Monstrous trials target **peak / absolute cultivators** with multiple thefts — low-realm first success is serious but proportionate |
| **Formation tier** | Nth successful fate rite may require higher-tier formation blueprint |
| **Material cost** | Steeper cost curve per `heavenTheftCount` (successes only) |
| **Cultivation gate** | Minimum realm / foundation quality to attempt |
| **Failure stakes** | Wasted materials, formation burns, injury — **no ledger entry** |

**Layman:** you can keep stealing, but heaven sends a bigger bill each time — and the array you need to afford the heist gets grander.

---

### Escalation model (draft)

Track on the save:

```js
G.heavenTheftCount = 0;        // successful fate rites this life (basin + composition)
G.fateRiteLog = [];            // { type, month, formationId, outcome, theftIndex }
```

**Tribulation severity** (concept):

```text
threatScore = cultivatorPower × (1 + heavenTheftCount × theftWeight) × targetMagnitude
severity    = base(type) × threatCurve(threatScore)
```

| Input | Effect |
|-------|--------|
| `heavenTheftCount` | **Successful thefts only** — failures do not increment |
| `cultivatorPower` | Realm, perfected peak, seal grade — **heaven cares more about peak threats** |
| `type` | Composition rite > basin rite |
| `targetMagnitude` | No skipping watershed rows in one rite |

**Formation mitigation** (concept):

```text
damageTaken = tribulationSeverity × (1 - formationMitigation)
```

| Formation grade | Mitigation band (example) |
|-----------------|---------------------------|
| Crude | 10–20% — “the array shudders; most of heaven’s wrath finds you” |
| Common | 25–35% |
| Superior | 40–50% |
| Peerless | 55–65% — never 100%; player always faces something |

Mitigation can be **mostly flavour** early (one tribulation roll, formation adds a log line + small % bonus) and deepened later.

**Player survivability** (what “strength to do so” means):

- Current **realm** and **subrealm peak** (competent vs perfected — see watershed doc)
- **Foundation seal quality** / nature
- **Physique**, ward pills, sect array support (optional secondary mitigation)
- **Choices during rite project** (reinforce pin vs hold center — chronicle event templates)

---

### Formation tier & cost escalation (owner direction)

**Hybrid rule (recommended):**

1. **First** basin rite at a given starting composition → e.g. **2nd-tier** formation blueprint + baseline material list.
2. **Second** fate rite this life → **3rd-tier** blueprint (or **annotated** version of same pattern) + **×1.5–2×** materials.
3. **Third+** → next formation tier and/or rare heaven materials (dao/law components at high counts).

Same **primitive grammar** (Sink, Pool, Seal, Ward — see formations doc); higher tier = larger array, more nodes, better mitigation ceiling.

| Theft # (this life) | Formation tier (example) | Material curve |
|---------------------|--------------------------|----------------|
| 0 (first rite) | 2nd (FE band) | Baseline |
| 1 | 3rd (GC band) | ×1.75 mats |
| 2 | 4th (NS band) | ×2.5 mats + rare |
| 3+ | 5th+ / annotated peerless | Sect-scale / forbidden site |

Composition rites use the **same theft counter** — stealing twice is stealing twice, regardless of type.

---

### Rite flow (gameplay)

1. **Discover recipe** — explore, sect, alchemy, forbidden ground, reincarnation catalog.
2. **Gather materials** — long-term goal across years.
3. **Lay grand array** — valid anchor (sect grounds, peak, forbidden site); not courtyard slot buff.
4. **Project / watch mode** — sit duration (years); sparse events (“eastern pin cracks”, “hold the seal stroke”).
5. **Tribulation phase** — formation mitigates part; player resolves the rest (combat, survival check, pill spend — TBD).
6. **Outcome**
   - **Success:** root patched; `heavenTheftCount++`; formation consumed; oracle updates; **heaven's ledger opens**.
   - **Failure:** formation gone; backlash; **`heavenTheftCount` unchanged** — heaven was not robbed; no escalation.

---

### Primitive roles (composition of the formation — still high level)

**Basin ascension** — open the next gate:

```text
Sink  → draw heaven’s attention
Pool  → cultivator at array eye
Seal  → bind new basin tier into the root
Ward  → outward-facing; array takes part of the tribulation
```

**Composition purification** — one row purer:

```text
Sever   → quarantine / cut weakest element (or harmonise branch for pentamixed)
Channel → redirect meridian flow
Seal    → lock new composition
Pool    → cultivator holds the center through the pain
```

Tribulation **completes the circuit** — fiction: heaven answers the stolen pattern with lightning.

---

### Relationship to reincarnation

| Layer | Role |
|-------|------|
| **This life** | Repeatable theft via escalating rites + tribulation |
| **Meta** | Recipes discovered, formation tiers comprehended, deviants unlocked — **starting menu** improves, not free passes |
| **Rare meta** | `basinTierBonus` (+1 ceiling at birth) — very rare; does not replace in-run theft fantasy |

Reincarnation should not be the **only** way to get a second ceiling bump — but a new life may start with **better composition** or **known recipes** so the *next* theft attempt is feasible earlier.

---

### What this replaces in older notes

- ~~Once per life~~ for basin / composition fate rites — **dropped** (owner 2026-07-22).
- ~~`talentCapBypassed` cheap flag~~ — permanent patches via successful rites only.
- Hard cap of 1–2 composition steps per life — replaced by **escalation**, not count limit.

Grade pills may remain **capped per life** (less cosmic).

---

## Prerequisites

- [ ] `heavenTheftCount` + `fateRiteLog` on save
- [ ] Chronicle project type: `fate_rite` (sit + tribulation phase)
- [ ] Formation tier ladder wired to recipe requirements
- [ ] Tribulation resolver (even v0: roll + mitigation % + log flavour)
- [ ] Root patch helpers (`basinBonus`, composition step) — partial in `talent.js`
- [ ] Watershed doc: competent vs perfected peak (attempt gating)

## Open questions

- [x] Failure increments `heavenTheftCount`? → **No** — heaven ignores until success (owner 2026-07-22)
- [ ] Does breakthrough tribulation also scale with `heavenTheftCount`, or only fate-rite tribulations?
- [ ] Composition vs basin: same tribulation multiplier or composition ×1.5?
- [ ] Tribulation as combat encounter vs survival check vs hybrid?
- [ ] Can two fate rites be **in progress** back-to-back or forced cooldown / recovery years?
- [ ] Sect array support — second mitigation stack or flavour only?

## Implementation crumbs

- `talent.js` — `basinBonus`, `computeSpiritRootProfile`, `isRealmBlockedByTalent`
- `formations-and-arrays.md` — primitives, formation tier table
- `time-playback.js` / `seclusion-project.js` — project shell for sit + events
- `legacy.js` — recipe catalog across lives
- `chronicle-and-projects.md` — watch mode between phases
