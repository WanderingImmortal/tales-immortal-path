# Heavenly Demon Cult (天魔教)

| Field | Value |
|-------|-------|
| **Status** | `designed` (v1 — identity + branch map) |
| **Blocked on** | Lineage manual (`blood_fiend` spine); alignment/sacrilege hooks; owner pass on charter “fifth power” politics |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chat, 2026-07-28 |
| **Updated** | 2026-07-28 |

Parent index: [`sect-faction-identities.md`](sect-faction-identities.md). Moral rulebook: [`alignment-sacrilege-corruption.md`](alignment-sacrilege-corruption.md). Blood cultivation: [`technique-driven-cultivation.md`](technique-driven-cultivation.md). Peers (orthodox): [`celestial-sword-sect.md`](celestial-sword-sect.md), [`jade-lotus-sect.md`](jade-lotus-sect.md), [`void-temple-sect.md`](void-temple-sect.md), [`golden-phoenix-sect.md`](golden-phoenix-sect.md).

**Design principle:** The cult is a **great demonic institution** — not a random bandit gang. It has doctrine, ranks, a homeland, and immortals in the vault. **Blood and extraction** are sacred economics: other cultivators, mortals, beasts, and sects are **inputs**. It is **not** a charter great power; the mandate and the Heartlands four hunt it on paper while failing to uproot it.

---

## At a glance

| | |
|--|--|
| **Vibe** | Classic **Heavenly Demon Cult** — arrogant, seductive, cruel; “heaven’s rules are for cattle.” |
| **Path** | **Qi-primary** with **blood-fiend** foundation stamp; body and soul arts as **support lanes** (harvest, bind, refine). |
| **Element / dao** | **Blood–yin** lean; predatory cycle (devour → condense → ascend). `blood_fiend` nature fits. |
| **Homeland** | **Blood Sealing Gorge** (封血峡) — cursed ravine *inside* the Heartlands sphere, warded and politically “unowned” |
| **Public face in Heartlands** | None — bounty sect. **Cover:** merchant houses, bankrupt dojos, “healing” clinics, charter-adjacent contractors |
| **Lineage** | **Heavenly Demon Canon** (天魔典) — working `lineageId`: `heavenly_demon_blood_line` |
| **Forbidden apex** | **Heavenly Demon Scripture** (天魔经) — patriarch / demon lord only; wears the cult’s **law of devouring** |
| **Sect spine** | **The Heavenly Demon** (天魔) — epithet, not a single historical person; the **first** who finished the Scripture and **became the title** |
| **Charter status** | **Suppressed** — imperial warrant, sect coalition bounties; tolerated only where graft or deterrence blocks a purge |
| **Allies / rivals** | **Rivals:** all four Heartlands sects (hunted); **uneasy tools:** Phoenix pamphleteers, Lotus register leakers, corrupt Tian cadets — never trusted allies |
| **Combat lean** | **Attrition + burst** — blood shields, life-drain, formation harvest; weak in open charter duels (no license) |
| **Player hook** | Join forbidden path · infiltrate branches · bounty hunter · expose a cover cell in Longcheng |

---

## Position on the board

```text
                    [ Tian mandate + charter ]
                              |
        ┌─────────────────────┼─────────────────────┐
        |                     |                     |
   Celestial Sword      Jade Lotus            Void Temple
        |                     |                     |
        └──────────┬──────────┴──────────┬──────────┘
                   |    Golden Phoenix   |
                   |         |           |
                   └────┬────┘           |
                        |                |
              (proxy fights, bounties)   |
                        |                |
              ══════ Blood Sealing Gorge ══════
                     Heavenly Demon Cult
                        |  |  |  |
            hidden branches in every zone
```

| Layer | Cult role |
|-------|-----------|
| **Lore** | Continent’s archetypal demonic apex — older than the mandate’s propaganda admits |
| **Heartlands** | **True HQ** — gorge, blood arrays, patriarch court; raids hit caravan roads (see `dustbone_caravan` demonic ambush) |
| **Other zones** | **Cells** — logistics, recruitment, material laundering; not second HQs until late content |
| **Alignment** | **Rebellious** default; acts that **mass-harvest** living qi → **corruption** per [`alignment-sacrilege-corruption.md`](alignment-sacrilege-corruption.md) |
| **Orthodox sects** | Sword refuses blood; Lotus purges parasitic arts; Void seals demonic sites; Phoenix **secretly** studies renewal via stolen blood rites |

---

## History (sketch)

### Before the mandate — the first Heavenly Demon

Legends disagree whether the **Heavenly Demon** was one cultivator or a **line of inheritors** who take the same epithet after the predecessor is devoured or ascends. The cult teaches: *“The Demon does not die — the vessel is empty calories.”*

Pre-imperial doctrine — **The Three Draughts**:

1. **All qi returns to the pot** — the world is a cauldron; refuse none of it.
2. **The strong draw the vein** — mercy is storage loss.
3. **Heaven’s ledger is written in other people’s blood** — break it or be ink.

They held **Blood Sealing Gorge** before the Tian clan named the Heartlands. The gorge’s arrays **seal spilled blood** into cultivation fuel — why the land still smells of iron after rain.

### Dao Wars — useful monster

The cult **did not capitulate** like the four. It **fed** on the war — battlefields as farms, deserters as recruits, fallen schools as libraries.

The Heartlands four remember:

| Sect | War memory |
|------|------------|
| **Sword** | Demon elders duel-poisoned Sword heirs; blood arrays on retreat routes |
| **Lotus** | Register forgeries; “healing” tents that drained convoy guards |
| **Void** | Sealed sites cracked open; demonic copies of void-walking manuals |
| **Phoenix** | Stole rebirth rites; tried to **phoenix-burn** blood pools (failed; ash fed the cult) |

**Tian** issued the first **continent-wide demon warrant**. Purges shrank the gorge but never took the **Scripture vault**.

### Now — heart in Heartlands, face in the shadows

- **HQ** remains in the gorge — warded, raid-only for orthodox sects without coalition.
- **Branches** hide as mundane fronts; each zone has a **specialty** (below).
- **Imperial fiction:** “mostly exterminated.” **Jianghu truth:** caravans still vanish; young masters still disappear on “secret realms.”
- **Code seed:** Heartlands route ambush on `dustbone_caravan` — demonic strike on the road; name the cult explicitly when that quest gets a lore pass.

---

## Homeland — Blood Sealing Gorge (封血峡)

| Feature | Fiction |
|---------|---------|
| **Geography** | Narrow ravine, red stone, mist that tastes of copper; upstream “spring” is array runoff |
| **Arrays** | **Blood Seal Grand Array** — converts battlefield and ritual spill into sect vein qi; ties to formation **Sever + Gather** hybrids ([`formations-and-arrays.md`](formations-and-arrays.md)) |
| **Courts** | **Outer Slaughter Terrace** (disciples) · **Inner Cauldron Hall** (core) · **Demon Lord Pit** (apex, sealed) |
| **Why Heartlands** | Proximity to **charter traffic**, noble bloodlines, and sect disciple pipelines — highest-value “resources” |
| **Why not on sect map v1** | Hidden realm entrance / raid instance until sect-map content supports hostile HQ |

---

## Doctrine & ranks

### Cult ranks (player-facing ladder)

| Rank | Name (EN) | Hanzi | Notes |
|------|-----------|-------|-------|
| 0 | **Blood Servant** | 血役 | Mortal thralls, failed recruits — fuel, not disciples |
| 1 | **Outer Demon** | 外魔 | Sworn; taught **Crimson Harvest** breath cousin |
| 2 | **Core Demon** | 内魔 | Gorge residency; blood missions |
| 3 | **Demon Envoy** | 魔使 | Runs a **branch cell** in a zone |
| 4 | **Elder of the Cauldron** | 鼎长老 | NS band; maintains harvest formations |
| 5 | **Heavenly Demon Envoy** | 天魔使 | VR-facing; speaks for patriarch |
| 6 | **Patriarch** | 魔主 | Public apex — **Demon Lord** (魔主) title in jianghu |
| ∞ | **The Heavenly Demon** | 天魔 | Immortal spine; may devour patriarch who weakens |

**Promotion:** merit = **delivered qi** (quests, PvE harvest, betrayals). Cruel but **meritocratic** — bloodline helps only if it bleeds well.

### The Three Draughts (public sermon)

Taught to Outer Demons; inner court adds **Fourth Draught** (parked): *“The Demon eats the Demon”* — cannibal succession.

---

## Cultivation identity

### Lineage — Heavenly Demon Canon (天魔典)

| Field | Value |
|-------|-------|
| **`lineageId`** | `heavenly_demon_blood_line` |
| **Foundation stamp** | `blood_fiend` at FE seal — [`technique-driven-cultivation.md`](technique-driven-cultivation.md) |
| **Market cousin** | **Crimson Harvest Breath** — sect entry replaces pamphlet for sworn demons |
| **Apex** | **Heavenly Demon Scripture** — not in manual pool; patriarch / story only |

#### Manual tiers (working)

| Pool id *(working)* | Display name | `methodTier` | Notes |
|---------------------|--------------|--------------|-------|
| `hdc_crimson_breath` | **Crimson Demon Breath** (魔息采血) | condensation | Outer — learn to drink ambient blood qi |
| `hdc_blood_furnace` | **Blood Furnace Canon** (血炉经) | foundation | FE — seal `blood_fiend` |
| `hdc_devour_cycle` | **Devouring Demon Cycle** (吞魔诀) | core | GC — sustain via drain in combat |
| `hdc_soul_cauldron` | **Soul Cauldron Art** (魂鼎法) | nascent | NS — binds weak souls as batteries *(corruption risk)* |
| `hdc_heavenly_demon` | **Heavenly Demon Canon** (天魔典) | void | VR — inner court |

#### Technique set — **Demon Arts** (魔功)

| Technique | Tier | Role |
|-----------|------|------|
| **Blood Palm** | outer | Conditioning; opens meridians via micro-harm |
| **Siphon Touch** | foundation | Single-target drain; charter illegal |
| **Crimson Barrier** | core | Shield fueled by stored blood essence |
| **Blood Rain** | core | AoE; tags corpses for array harvest |
| **Soul Hook** | nascent | Pull fleeing souls — high corruption |
| **Heavenly Demon Form** | void | Burst transformation; juncture omen magnet |

**What they teach:** breath → furnace → devour cycle → demon arts → cauldron layers.  
**What they refuse:** “righteous” purification, free teaching, disciples who **won’t** harvest.

**Mixed paths:** qi-primary; body cultivators prized as **meat shields**; soul artists as **battery tenders**.

### Evil variant vs orthodox blood

| Topic | Rule |
|-------|------|
| **Blood path** | Cultivating blood is **not** automatic corruption — **massacres and living harvest** are ([`alignment-sacrilege-corruption.md`](alignment-sacrilege-corruption.md)) |
| **Lotus Withered Lotus** | Expelled Lotus traitors sometimes **defect here** — cult welcomes parasitic arts |
| **Sword** | Blood-sword manuals **sold** to cult by black market; Sword hunts buyers |

---

## Hidden branches (by zone)

Cells share **doctrine and signals**; differ by **local resource**.

| Zone | Cover identity | Branch name *(working)* | Specialty | Sample hook |
|------|----------------|---------------------------|-----------|-------------|
| **Heartlands** | Gorge HQ + road bandits | **Gorge Court** (峡庭) | Caravan raids, noble kidnaps, charter sabotage | Extend `caravan_demon` boss lore |
| **Dustbone** | Mirage clinic / tomb raiders | **Ashen Blood Lodge** (尘血寮) | Corpse qi, bone essence, Tribunal outsiders | Sunscar deserters; competes with Ashen Priests |
| **Jade** | Tidal shipping / pleasure house | **Red Tide Cell** (赤潮房) | Smuggling, dual-cultivation traps, sea beast blood | Storm Dragon “pirate” cover |
| **Frostbite** | Hermit ice healers | **Frozen Cauldron** (寒鼎) | Preserved blood cores, slow drain over winter | Frostpeak exiles |
| **Emberwild** | Beast-tamer collective fringe | **Primal Pit** (野血坑) | Beast heart refining, jungle “corruption” events | Tie to emberwild hunt corruption **fiction** — cult behind some outbreaks |

**Branch rule:** no cell knows the **full** Scripture; only **Demon Envoys** know gorge coordinates; betrayal = soul cauldron fuel.

---

## Leadership (sketch)

Per [`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md).

| Role | Name *(working)* | Realm (public) | Notes |
|------|------------------|----------------|-------|
| **Sect spine** | **The Heavenly Demon** (天魔) | **Immortal** | Current vessel **unknown**; speaks through blood mirrors |
| **Patriarch** | **Mo Xuan** (魔玄) | VR peak | “Demon Profound”; runs Cauldron Hall |
| **Cauldron Elder** | **Elder Hong Lian** (红莲) | NS peak | Harvest formations; player quest giver |
| **Heartlands envoy** | **Envoy Chi** (赤使) | Core+ | Road raids; `caravan_demon` voice |
| **Longcheng** | **“Dr. Wen”** clinic | Mortal cover | Recruits desperate patients |

**Succession:** patriarch who fails a **Century Cauldron** audit may be **devoured** by inner court — strengthens the next Demon vessel.

---

## Relationships

| Faction | Relation |
|---------|----------|
| **Celestial Sword** | Blood feud; Sword takes demon heads for charter credit |
| **Jade Lotus** | Lotus purges cells; cult forges register seals |
| **Void Temple** | Void seals gorge entrances; cult steals void-walk copies |
| **Golden Phoenix** | Mutual theft of rebirth / blood rites; no alliance |
| **Tian clan** | Open execution; covert use of demon assassins when deniable |
| **Sandveil Tribunal** | Uneasy distance — cult avoids main treaty camps |

---

## Player hooks (phased)

| Phase | Fiction | Systems |
|-------|---------|---------|
| **P0** | Ambush on caravan road; bounty posters in Celestial Market | Quest text; `caravan_demon` |
| **P1** | Expose a branch cover; earn sect rep or demon rep | Zone events; alignment shifts |
| **P2** | Sworn Outer Demon — `blood_fiend` lineage, illegal market | Sect join alternate; `reqAlignment` rebellious |
| **P3** | Raid Blood Sealing Gorge instance | Coalition or solo; high corruption risk |
| **P4** | Heavenly Demon Scripture beat | Immortal-layer story; tribulation amplification if stained |

**Join fantasy:** power fast, world hates you, mentors treat you as **inventory** until you’re dangerous.  
**Hate fantasy:** cleanse the gorge; rescue thralls; break arrays.

---

## Prerequisites

- [ ] Owner pass: is gorge **inside** `outer_heartlands` graph or separate hidden map?
- [ ] Lineage manual implementation ([`cultivation-manuals-framework.md`](cultivation-manuals-framework.md))
- [ ] `blood_fiend` aura + intent wiring ([#54](https://github.com/WanderingImmortal/tales-immortal-path/issues/54))
- [ ] Sacrilege ledger entries for living harvest / soul cauldron
- [ ] Sect join UX for **illegal** factions (or disguise rep)

## Open questions

- [ ] **Fifth great power?** — cult as strong as four but **unchartered**, or tier below until immortal beat?
- [ ] **Player patriarch** — ever, or forever NPC throne?
- [ ] **Phoenix overlap** — does Phoenix **deep** manual share blood-rebirth with cult, or stay flame-only?
- [ ] **Name in UI** — full **Heavenly Demon Cult** vs regional “blood sect” before reveal?
- [ ] **Blood Servant** mortals — playable horror, or NPC-only?
- [ ] **Imperial double game** — does Tian **Secret Service** run a demon cell for deniable work?

## Implementation crumbs

- `data.js` — `dustbone_caravan` stage 3 demonic ambush; `caravan_demon` boss; `Corrupted Cultivator` enemy pool
- `technique-driven-cultivation.md` — `Crimson Harvest Breath` → `blood_fiend`
- Future: `FACTION_DEFINITIONS` hostile faction; hidden `WORLD_LOCATIONS` for gorge + branch fronts
- [`formations-and-arrays.md`](formations-and-arrays.md) — blood harvest hybrid arrays for gorge defense
