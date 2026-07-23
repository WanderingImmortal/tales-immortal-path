# Celestial Sword Sect (天体剑宗)

| Field | Value |
|-------|-------|
| **Status** | `designed` (v1 — owner workshop) |
| **Blocked on** | Lineage manual implementation; Longcheng branch dialogue |
| **Issue** | none yet |
| **Chat / PR** | Heartlands sect pass, 2026-07-23 |
| **Updated** | 2026-07-23 |

Parent index: [`sect-faction-identities.md`](sect-faction-identities.md). Imperial context: [`imperial-clan.md`](imperial-clan.md). Power bands: [`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md).

---

## At a glance

| | |
|--|--|
| **Vibe** | The blade that would rather break than bend — honor first, but they bent *once* at the Dao Wars and never forgot the cost. |
| **Path** | **Qi-primary**; sword & blade intent. Palm arts in outer court (Heavenly Palm tradition). |
| **Element / dao** | **Metal-wind** lean — cutting, sharpness, intent over raw element. `sword_inclined` foundation fits. |
| **Homeland** | **Jianyun Peaks** (剑云峰) — sword-cloud ridge, northwest Heartlands |
| **Public leader** | **Patriarch Yun Jian** (云鉴) — Void Refinement peak |
| **Player-facing elder** | **Elder Blade Feng** (锋长老) — Nascent Soul, discipline / trials |
| **Allies / rivals** | Allies **Jade Lotus**; rivals **Golden Phoenix**; respectful distance from **Void Temple** |
| **Combat lean** | Best **duelist** among Heartlands four; weaker at siege economics and dirty charter war |

---

## History

### Before the mandate

The Celestial Sword Sect predates the Tian mandate. They rose on **Jianyun Peaks** when the continent still had a dozen blade schools — most swallowed or forgotten. Their founder is said to have **cut the first sword intent** into the ridge now called **Heaven-Cut Cliff**, teaching that a cultivator’s edge is not metal but **will made sharp**.

Through the pre-imperial chaos they survived by three rules passed down as **The Three Edges**:

1. **Draw only when the heart is clear.**
2. **Finish what the blade begins.**
3. **Never sell the mountain.**

### Dao Wars

The Sword Sect fought in the Dao Wars as a **major power** — not the largest, but the one other armies learned to route around. When the Tian Clan produced the first Half-Step Immortal, Sword leadership read the board faster than Phoenix or Lotus.

They **capitulated early** — on terms:

- **Jianyun Peaks and ancestral arrays** remain Sword sovereign soil.
- The sect keeps its **lineage**, **trials**, and **internal ranks** — no imperial appointment of patriarch.
- In exchange: charter oaths, no open war against the mandate, and **honor-blade work** when imperial law must look clean.

The humiliation is whispered in inner court: they were the first great sect to kneel. The pragmatism is taught in outer court: they knelt **with their mountain intact**.

Phoenix broke late and was **forced** to kneel. Sword chose. That difference fuels a quiet contempt — Phoenix fights the charter with pamphlets; Sword remembers choosing survival.

### Now

- **Allied with Jade Lotus** — marriage lines, trade escorts, charter votes. Not subservience; Lotus gold pays for Sword steel when interests align.
- **Cold war with Golden Phoenix** — flame expansionists vs blade honor; Phoenix Gambit puts Sword in an awkward seat (honor vs Lotus ally).
- **Imperial relation** — respected, not loved. Tian court hires Sword for **licensed duels** and edict enforcement; Sword accepts when the job is *honorable*, refuses when it isn’t.
- **Void Temple** — uneasy respect. Sword elders think Void scholars hide behind books; Void adepts think Sword cultivators mistake violence for clarity. They ally against Phoenix when the charter cracks.

---

## Leadership

Per [`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md) — public elders **Nascent Soul**, patriarch **Void Refinement**, ancestors **Dao Seeking+**.

| Role | Name | Realm (public) | Notes |
|------|------|----------------|-------|
| **Patriarch** | **Yun Jian** (云鉴) | VR peak | “Cloud Mirror” — rarely leaves Jianyun; audiences by appointment |
| **War peak elder** | **Elder Iron Xu** (铁墟) | Deity Transformation *(9-realm)* / NS peak today | Leads enforcement; inner court |
| **Discipline elder** | **Elder Blade Feng** (锋) | Nascent Soul | Player NPC at hall gate — trials, spars, rep |
| **Longcheng envoy** | **Captain Wen Ning** (温宁) | Core Formation+ | Charter office; not the sect’s identity |
| **Ancestor vault** | **Sword Ancestor Qing Luo** (青罗) | Dao Seeking | Legend: cut a tribulation cloud once; sleeps in array |

**Succession:** patriarch names a **Sword Heir** from core disciples who survive **Heaven-Cut Cliff** and win the **Ancestral Blade Trial**. Blood helps; merit decides.

---

## Cultivation — techniques & lineage

### Sacred art (lineage manual — future)

**Working name:** **Celestial Sword Canon** (天体剑典) · `lineageId: celestial_sword_qi_line`

| Layer | Who gets it | Content (sketch) |
|-------|-------------|------------------|
| **Outer breath** | Initiates | Generic qi circulation — market breaths OK until inner court |
| **Sword Intent chapters** | Inner disciples | Intent stages; ties to `sword_dominion` technique set |
| **Canon layers** | Core court+ | Layered manual per [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md) — sect-only |

**Dao:** **Sword Intent** — qi shaped as edge; wind and metal metaphors; neutral element techniques common.

**Foundation nature:** `sword_inclined` — edge-tempered seal, piercing guards.

### Techniques in culture today (code hooks)

| Technique | Role |
|-----------|------|
| **Heavenly Palm** | Outer-court staple — palm before blade for many initiates |
| **Heavenly Sword Qi** | Condensed intent without physical blade |
| **Wind Blade Strike** | `sword_dominion` set — crescent cutting wind |
| **Phantom Blade** | Soul-edge crossover — inner court only in fiction |

**What they teach:** outer disciples get palm basics + drilling; inner court gets intent methods; core court gets canon layers.

**What they refuse:** **Poison**, **blood blade** arts, **charter assassination** disguised as dueling. Selling lineage layers to non-disciples is expulsion.

**Mixed paths:** qi-primary sect; body cultivators who respect the drill hall tolerated in outer court. Soul-path blade (Phantom Blade) is rare — mentored individually, not mass taught.

---

## Where they live

### Jianyun Peaks (剑云峰) — homeland

Northwest Heartlands — **`sword_sect_hall`** on the local map is the **outer gate hall**, not the whole mountain.

```text
[Celestial Sword Hall]  ← player node — drills, Elder Feng, outer bureaucracy
        |
   Ascending sword-roads
        |
   Inner peaks — arrays, inner court, patriarch court
        |
   Ancestral grounds (below)
```

**Terrain:** knife-ridge peaks, perpetual wind, qi sharp enough to cut unprepared skin. Stone terraces for ten thousand simultaneous drills.

### Ancestral grounds

| Site | Fiction |
|------|---------|
| **Heaven-Cut Cliff** (斩天崖) | Founder’s first cut; disciples face falling sword-qi to advance rank |
| **Ten Thousand Blade Sepulcher** (万剑冢) | Broken blades of dead masters — each blade a name, a debt |
| **Intent Pool** (剑意潭) | Still water that reflects your killing intent; inner court meditation |
| **Patriarch Array** | Sect homeland defense — why Tian could not absorb the mountain |

**Forbidden (rumor):** a sealed cavern under the Sepulcher — **First Blade’s** remnant; calamity if drawn.

---

## Attitude & culture

**Not** imperial police. **Not** duel-obsessed thugs. A **great sect** whose culture happens to measure worth in blade honesty.

| Trait | How it shows |
|-------|----------------|
| **Honor** | Oaths matter; public duels preferred to ambush |
| **Pride** | Insult the mountain, not the emperor, if you want a war |
| **Pragmatism** | They knelt once; they won’t confuse pride with suicide |
| **Contempt** | Phoenix charter games, assassin guild “blades,” scholars who never spar |
| **Loyalty** | Lotus alliance is real — breaking it requires patriarch vote |

**Outer disciple life:** drill at dawn, spar at dusk, carry messages to Longcheng rotation. **Inner court:** intent refinement, ancestral rites at Sepulcher. **Elders:** politics, war, marriage, charter.

**Mortal attitude:** Sword disciples are respected and feared on the road — hireable as guards, avoided as bullies if honor is intact.

---

## Combat prowess

| vs | Sword sect |
|----|------------|
| **Heartlands four (duel)** | **Top** — intent, drilling, peak elders |
| **Heartlands four (siege / economic war)** | Mid — Lotus money and Phoenix fanatics outlast in charter fights |
| **Imperial court** | Won’t start a war; patriarch-tier deters casual aggression |
| **Player early game** | Elder Feng is NS — crushing if hostile |

**In game today:** `combatDmgPct` faction perk — fits. Market unlock **Heavenly Palm** at friendly — outer art distribution.

**Military role:** charter **honor blades**, caravan escort for Lotus routes, licensed duel supervision in Longcheng — **also** mercenary work for noble houses (Qin clan hires rejects).

---

## Sect ranking

Formal ranks — merit + cultivation + intent stage:

| Rank | Hanzi (working) | Requirement sketch |
|------|-----------------|-------------------|
| **Outer disciple** | 外门弟子 | Entry trial — survive drill season |
| **Inner disciple** | 内门弟子 | Foundation+; intent awakened |
| **Core disciple** | 真传弟子 | Golden Core+; ancestral rite at Sepulcher |
| **Sword Son / Daughter** | 剑子 / 剑女 | Top core; heir candidates |
| **Elder** | 长老 | Nascent Soul public face; court duty |
| **Peak elder** | 太上长老 | Inner enforcement / war *(Deity band later)* |
| **Patriarch** | 宗主 | VR peak; Yun Jian today |

**Advancement:** duels, cliff trial, patriarch approval — not years alone. **Demotion:** cowardice, poison, breaking oaths.

**Player rep** maps loosely: friendly = outer court respect; allied = core court access fiction; elder quests = Blade Audience before Feng.

---

## Longcheng footprint

One **satellite compound** on Envoy Row — not a second HQ.

| Piece | Fiction |
|-------|---------|
| **Charter office** | Captain Wen Ning — edict duels, filings |
| **Licensed duel ground** | Sword Bureau supervises *(shared city fixture)* |
| **Barracks** | Rotating outer disciples — most Sword cultivators never live here |

Patriarch and arrays stay on **Jianyun**. Longcheng is where the sect does **business the mountain dislikes**.

---

## Player hooks

| Hook | Beat |
|------|------|
| **Join fantasy** | Earn your place by blade — spar Feng, win trial, inherit intent |
| **Honor path** | Refuse Phoenix Gambit dirty work; gain Sword + Lotus |
| **Pragmatic path** | Take charter blade jobs; imperial favor vs sect purity |
| **Enemy** | Insult Sepulcher, use poison, back Phoenix absorption |
| **Late game** | Patriarch audience; ancestral blade rumor under Sepulcher |

---

## Open questions (owner)

- [ ] Patriarch **Yun Jian** — keep name / temperament?
- [ ] Founder name and whether **First Blade** cavern is real or myth
- [ ] Qi-only lock or keep rare soul-blade inner court?
- [ ] **Celestial Sword Canon** — layer count when lineage ships
- [ ] Phoenix Gambit: does Sword **split** (honor faction vs pragmatist faction)?

## Implementation crumbs (later)

- `data.js` — enrich `sword_sect_hall` lore; optional `jianyun_peaks` forbidden stub
- `FACTION_NPCS` — Feng stays; add Wen Ning when Longcheng ships
- `CULTIVATION_METHOD_POOL` — `celestial_sword_qi_line` layered entries
- `factions-expand.js` — Phoenix Gambit Sword choice branches
