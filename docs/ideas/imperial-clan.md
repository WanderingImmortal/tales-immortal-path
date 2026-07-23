# Imperial clan — the Tian Clan (sleeping dragon)

| Field | Value |
|-------|-------|
| **Status** | `designed` (core lore — owner lock-in 2026-07-23) |
| **Blocked on** | Capital name/map node; four-sect charter detail; cultivation lineage |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent workshop, 2026-07-23 |
| **Updated** | 2026-07-23 |

## Intent

The **Tian Clan** (天氏) — remembered by that name alone; older names are lost or deliberately buried — is the Azure Sky Continent's **sleeping dragon**. They do not rule through open tyranny. Everyone knows who the boss is. The court schemes beneath the surface; the founder sleeps at the gate of immortality.

**Imperial public face:** five-clawed true dragon (五爪真龙) — *only* the Tian may bear it; usurpation is existential treason.

**Not the same as:** post-mortal **Heavenly Court** ([`post-immortal-cosmology.md`](post-immortal-cosmology.md)) — cosmic accounting, not the mortal throne.

Related: [`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md), [`sect-faction-identities.md`](sect-faction-identities.md), [`nine-realm-ladder.md`](nine-realm-ladder.md) (Half-Step Immortal).

---

## History — Dao Wars & the uneasy peace

### Before

The **Dao Wars** (道战 — working name) — sects and rising powers tore the continent apart competing for dao fragments, veins, and breakthrough paths. Havoc at a scale the mortal board could not sustain.

### The turn

The **Tian Clan** produced the first cultivator to reach **Half-Step Immortal** — first to touch the gates of true immortality. The wars ended **swiftly** under that might. Not a century of siege; a demonstration that the board had a new ceiling.

*(Older immortals among the top sects may remember the clan's **original name** and older sins. They do not dwell on it in public.)*

### The settlement

An **uneasy peace**: great powers **pushed into chartered homelands** — borders the throne still recognizes. Some suffered worse; some bargained early and kept more:

| Power (draft) | Homeland | Dao Wars outcome (sketch) |
|---------------|----------|---------------------------|
| **Tian Clan** | Heartlands core (capital TBD) | Victor; became imperial mandate |
| **Celestial Sword** | Heartlands — sword peaks | Early capitulation; kept blade honor → **imperial sword** when law must look clean |
| **Jade Lotus** | Heartlands — trade cities | **Early alliance**; best charter terms → court ledgers, market rights |
| **Void Temple** | Heartlands — observatory slopes | Neutral late; preserved archives in exchange for oaths |
| **Golden Phoenix** | Heartlands — flame courts | **Broken late**; humiliating truce → fuels modern "reunification" ambition |
| **Frostpeak Monastery** | Frostbite | Isolation bargain — left alone if they ward the north |
| **Sandveil tribes** | Dustbone | Imperial reach **weak** — Tribunal is local law |
| **Storm Dragon / Tidal Lotus** | Jade archipelago | Sea charter — throne mediates, does not sail |
| **Emberwild Collective** | Emberwild | Contained, not conquered — jungle not worth the debt |

*Sect rows are draft for [`sect-faction-identities.md`](sect-faction-identities.md) — refine in owner pass.*

### Now

- **Sleeping giant:** no open continental wars; scheming, charters, succession plots, buried deterrence.
- **Founder** (first Half-Step) **buried / sealed** under or within the capital — the dragon sleeps. Regents rule. Sects feud in lanes the charter allows.
- **Public myth:** the founder chose sleep so the realm could heal.
- **Sect whisper:** the founder sleeps because acting openly accrues heaven's debt — wake them only if the mandate cracks.

---

## Power model (locked)

| Layer | Role |
|-------|------|
| **Buried founder** | Half-Step at heaven's gate — ultimate deterrence; may not be "alive" in daily politics |
| **Imperial court** | Regents, blood branches, chancellors — **surface scheming** |
| **Charter law** | Sects licensed in homelands; open conquest forbidden without imperial verdict |
| **Today's emperor** | Face of mandate — may be NS/Deity tier publicly; not the founder |

**Balancer + sacred shell:** not iron-fist daily rule; **historical force** + mutual terror + procedure.

---

## Symbol & identity

- **Five-clawed true dragon** — imperial Tian only. Four claws = insult or foreign claim.
- **"Sleeping dragon"** — continent metaphor; court motto; forbidden to mock in Heartlands.
- **Name:** **Tian Clan** (cliché on purpose — 天, heaven). Imperial style: *Tian [era name] Court* / *Mandate of Tian*.

---

## Cultivation (open)

- Imperial lineage manual TBD — likely **dragon / mandate / earth-metal** lean; **layered + unique** per manuals policy.
- Court may **license** sect lines rather than teach widely.
- Tian cultivators: stricter heaven accounting? ([`tribulation-system-rework.md`](tribulation-system-rework.md))

---

## Geography (open)

- **Capital** — inner Heartlands node (not in code yet). Near `heartlands_root` / `celestial_observatory` fiction.
- **Celestial Market** — likely imperial neutral ground (all sects trade under charter).
- **Outer heartlands** — buffer between sect peaks and sleeping capital.

---

## Player hooks (open)

- Imperial **favor** track separate from sect rep?
- **Examination** at capital — root test, charter oaths.
- Found sect → register with Tian charter?
- Late-game: does the sleeping founder **wake**? (calamity / player choice — Chekhov's gun)

---

## Open questions

- [ ] Founder's true name (pre-Tian) — ever revealed?
- [ ] Dao Wars start date / how many generations of regents since burial?
- [ ] Does Phoenix reunification seek to **replace** Tian or **become** Tian (five claws)?
- [ ] Imperial rep: fifth faction vs overlay?
- [ ] Dustbone: tribute fiction without direct rule?

## Prerequisites

- [ ] Lock four Heartlands sect identities **against** this charter table
- [ ] Capital name + map node

## Implementation crumbs (later)

- `data.js` — `tian_clan` or `imperial_tian` faction, capital location, dragon symbol in UI
- `factions-expand.js` — imperial favor, charter violations
- Chronicle / diary — Dao Wars era entries at high rep or void archive
