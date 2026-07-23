# Celestial Sword Sect (天体剑宗)

| Field | Value |
|-------|-------|
| **Status** | `designed` (v1 — owner workshop) |
| **Blocked on** | Lineage manual implementation; Longcheng branch dialogue |
| **Issue** | none yet |
| **Chat / PR** | Heartlands sect pass, 2026-07-23 |
| **Updated** | 2026-07-23 |

Parent index: [`sect-faction-identities.md`](sect-faction-identities.md). Imperial context: [`imperial-clan.md`](imperial-clan.md). Power bands: [`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md).

**Terminology:** In this world **sword** (剑) and **blade** (刀) are distinct weapon paths. This sect cultivates **Sword Dao only** — no blade arts, no blade intent, no conflating the two.

---

## At a glance

| | |
|--|--|
| **Vibe** | Aloof sword masters on a lonely mountain — obsessed with **Sword Dao**, contemptuous of everything that distracts from the sword. |
| **Path** | **Qi-primary**; **Sword Dao** / sword intent only. Palm conditioning in outer court (Heavenly Palm) before the sword. |
| **Element / dao** | **Metal-wind** lean — sharpness, line, intent. `sword_inclined` foundation fits. |
| **Homeland** | **Solitary Sword Mountain** (孤剑山) — northwest Heartlands |
| **Public leader** | **Patriarch Yun Jian** (云鉴) — Void Refinement peak |
| **Player-facing elder** | **Elder Sword Feng** (锋长老) — Nascent Soul, discipline / trials *(code: `Elder Blade Feng` — rename later)* |
| **Allies / rivals** | Allies **Jade Lotus**; rivals **Golden Phoenix**; respectful distance from **Void Temple** |
| **Combat lean** | Best **sword duelist** among Heartlands four; weaker at siege economics and dirty charter war |

---

## History

### Before the mandate

The Celestial Sword Sect predates the Tian mandate. They rose on **Solitary Sword Mountain** when the continent still had a dozen sword schools — most swallowed or forgotten. Their founder is said to have **cut the first sword intent** into the ridge now called **Heaven-Cut Cliff**, teaching that the sword is not iron but **will made a single perfect line**.

Through the pre-imperial chaos they survived by three rules passed down as **The Three Edges**:

1. **Draw only when the heart is clear.**
2. **Finish what the sword begins.**
3. **Never sell the mountain.**

### Dao Wars

The Sword Sect fought in the Dao Wars as a **major power** — not the largest, but the one other armies learned to route around. When the Tian Clan produced the first Half-Step Immortal, Sword leadership read the board faster than Phoenix or Lotus.

They **capitulated early** — on terms:

- **Solitary Sword Mountain and ancestral arrays** remain Sword sovereign soil.
- The sect keeps its **lineage**, **trials**, and **internal ranks** — no imperial appointment of patriarch.
- In exchange: charter oaths, no open war against the mandate, and **licensed sword work** when imperial law must look clean.

The humiliation is whispered in inner court: they were the first great sect to kneel. The pragmatism is taught in outer court: they knelt **with their mountain intact**.

Phoenix broke late and was **forced** to kneel. Sword chose. That difference fuels a quiet contempt — Phoenix fights the charter with pamphlets; Sword would rather return to the mountain and cultivate.

### Now

- **Allied with Jade Lotus** — marriage lines, trade escorts, charter votes. The mountain tolerates politics; it does not enjoy them.
- **Cold war with Golden Phoenix** — flame expansionists vs Sword Dao purists; Phoenix Gambit puts Sword in an awkward seat (honor vs Lotus ally).
- **Imperial relation** — respected, not loved. Tian court hires Sword for **licensed duels** and edict enforcement; Sword accepts when the job is *worthy of a sword*, refuses when it isn’t.
- **Void Temple** — uneasy respect. Sword elders think Void scholars hide behind books; Void adepts think Sword cultivators mistake violence for clarity. They ally against Phoenix when the charter cracks.

---

## Leadership

Per [`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md) — public elders **Nascent Soul**, patriarch **Void Refinement**, ancestors **Dao Seeking+**.

| Role | Name | Realm (public) | Notes |
|------|------|----------------|-------|
| **Patriarch** | **Yun Jian** (云鉴) | VR peak | “Cloud Mirror” — rarely leaves the mountain; audiences by appointment |
| **War peak elder** | **Elder Iron Xu** (铁墟) | Deity Transformation *(9-realm)* / NS peak today | Leads enforcement; inner court |
| **Discipline elder** | **Elder Sword Feng** (锋) | Nascent Soul | Player NPC at hall gate — trials, spars, rep |
| **Longcheng envoy** | **Captain Wen Ning** (温宁) | Core Formation+ | Charter office; not the sect’s identity |
| **Ancestor vault** | **Sword Ancestor Qing Luo** (青罗) | Dao Seeking | Legend: cut a tribulation cloud with one sword stroke; sleeps in array |

**Succession:** patriarch names a **Sword Heir** from core disciples who survive **Heaven-Cut Cliff** and win the **Ancestral Sword Trial**. Blood helps; merit decides.

---

## Cultivation — techniques & lineage

### Sacred art (lineage manual — future)

**Working name:** **Celestial Sword Canon** (天体剑典) · `lineageId: celestial_sword_qi_line`

| Layer | Who gets it | Content (sketch) |
|-------|-------------|------------------|
| **Outer breath** | Initiates | Generic qi circulation — market breaths OK until inner court |
| **Sword Intent chapters** | Inner disciples | Sword Dao stages; sword-type techniques only |
| **Canon layers** | Core court+ | Layered manual per [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md) — sect-only |

**Dao:** **Sword Dao** — one intent, one line; wind and metal as metaphor; qi shaped as sword, never as blade or saber.

**Foundation nature:** `sword_inclined` — edge-tempered seal, piercing guards.

### Techniques in culture today (code hooks)

| Technique | Role |
|-----------|------|
| **Heavenly Palm** | Outer-court conditioning — palm before sword for many initiates |
| **Heavenly Sword Qi** | Condensed sword intent without a physical sword |

**Not sect arts:** blade-type techniques (e.g. Wind Blade Strike), saber paths, or soul-weapon hybrids — found elsewhere in the world; teaching them on the mountain is grounds for expulsion.

**What they teach:** outer disciples get palm basics + sword drilling; inner court gets Sword Intent; core court gets canon layers.

**What they refuse:** **Poison**, **blood sword** forbidden paths, **blade** weapon curricula, **charter assassination** disguised as dueling. Selling lineage layers to non-disciples is expulsion.

**Mixed paths:** qi-primary sect; body cultivators who respect the drill hall tolerated in outer court if they commit to the sword. No secondary weapon obsession.

---

## Where they live

### Solitary Sword Mountain (孤剑山) — homeland

Northwest Heartlands — **`sword_sect_hall`** on the local map is the **outer gate hall** at the mountain’s foot, not the peak.

```text
[Celestial Sword Hall]  ← player node — drills, Elder Feng, outer bureaucracy
        |
   Ascending sword-roads (few visitors welcome)
        |
   Inner peaks — arrays, inner court, patriarch court
        |
   Ancestral grounds (below)
```

**Terrain:** a single dominant massif — lonely, wind-scoured, qi sharp enough to cut unprepared skin. The sect **likes** that it feels apart from the Heartlands sprawl. Stone terraces for ten thousand simultaneous sword forms.

### Ancestral grounds

| Site | Fiction |
|------|---------|
| **Heaven-Cut Cliff** (斩天崖) | Founder’s first sword stroke; disciples face falling sword-qi to advance rank |
| **Ten Thousand Swords Sepulcher** (万剑冢) | Broken **swords** of dead masters — each weapon a name, a debt |
| **Intent Pool** (剑意潭) | Still water that reflects your sword intent; inner court meditation |
| **Patriarch Array** | Sect homeland defense — why Tian could not absorb the mountain |

**Forbidden (rumor):** a sealed cavern under the Sepulcher — the **First Sword’s** remnant; calamity if drawn.

---

## Attitude & culture

**Aloof.** The mountain comes first; jianghu politics second; Longcheng a necessary annoyance.

| Trait | How it shows |
|-------|----------------|
| **Sword Dao obsession** | Talk of anything else bores them; disciples who lose focus are sent down the mountain |
| **Honor** | Oaths matter; public duels preferred to ambush — but mainly because ambush is *sloppy sword* |
| **Detachment** | Insult the sword, not the emperor, if you want a fight |
| **Pragmatism** | They knelt once; they won’t confuse pride with suicide — then they went home to cultivate |
| **Contempt** | Phoenix charter games, assassin guild contracts, blade cultivators who think steel is interchangeable |
| **Loyalty** | Lotus alliance is real — breaking it requires patriarch vote |

**Outer disciple life:** drill at dawn, spar at dusk, minimal small talk. **Inner court:** Sword Intent refinement, ancestral rites at Sepulcher. **Elders:** politics they tolerate for the mountain’s sake.

**Mortal attitude:** Sword disciples are respected, feared, and considered **strange** — they don’t linger in taverns.

---

## Combat prowess

| vs | Sword sect |
|----|------------|
| **Heartlands four (sword duel)** | **Top** — intent, drilling, peak elders |
| **Heartlands four (siege / economic war)** | Mid — Lotus money and Phoenix fanatics outlast in charter fights |
| **Imperial court** | Won’t start a war; patriarch-tier deters casual aggression |
| **Player early game** | Elder Feng is NS — crushing if hostile |

**In game today:** `combatDmgPct` faction perk — fits. Market unlock **Heavenly Palm** at friendly — outer conditioning art.

**Military role:** charter **licensed sword** work, caravan escort for Lotus routes, duel supervision in Longcheng — **also** noble house contracts (Qin clan hires ex-disciples).

---

## Sect ranking

Formal ranks — merit + cultivation + sword intent stage:

| Rank | Hanzi (working) | Requirement sketch |
|------|-----------------|-------------------|
| **Outer disciple** | 外门弟子 | Entry trial — survive drill season |
| **Inner disciple** | 内门弟子 | Foundation+; sword intent awakened |
| **Core disciple** | 真传弟子 | Golden Core+; ancestral rite at Sepulcher |
| **Sword Son / Daughter** | 剑子 / 剑女 | Top core; heir candidates |
| **Elder** | 长老 | Nascent Soul public face; court duty |
| **Peak elder** | 太上长老 | Inner enforcement / war *(Deity band later)* |
| **Patriarch** | 宗主 | VR peak; Yun Jian today |

**Advancement:** cliff trial, duels, patriarch approval — not years alone. **Demotion:** cowardice, poison, blade curriculum, breaking oaths.

**Player rep** maps loosely: friendly = outer court respect; allied = core court access fiction; elder quests = Sword Audience before Feng.

---

## Longcheng footprint

One **satellite compound** on Envoy Row — not a second HQ.

| Piece | Fiction |
|-------|---------|
| **Charter office** | Captain Wen Ning — edict duels, filings |
| **Licensed duel ground** | Sword Bureau supervises *(shared city fixture)* |
| **Barracks** | Rotating outer disciples — most cultivators never live here |

Patriarch and arrays stay on **Solitary Sword Mountain**. Longcheng is where the sect does **business the mountain dislikes**.

---

## Player hooks

| Hook | Beat |
|------|------|
| **Join fantasy** | Earn your place by the sword — spar Feng, win trial, inherit intent |
| **Honor path** | Refuse Phoenix Gambit dirty work; gain Sword + Lotus |
| **Pragmatic path** | Take charter sword jobs; imperial favor vs sect purity |
| **Enemy** | Insult Sepulcher, teach blade arts on the mountain, back Phoenix absorption |
| **Late game** | Patriarch audience; First Sword rumor under Sepulcher |

---

## Open questions (owner)

- [ ] Patriarch **Yun Jian** — keep name / temperament?
- [ ] Founder name and whether **First Sword** cavern is real or myth
- [ ] Rename in code: `Elder Blade Feng` → **Elder Sword Feng**
- [ ] **Celestial Sword Canon** — layer count when lineage ships
- [ ] Phoenix Gambit: does Sword **split** (purist vs pragmatist faction)?

## Implementation crumbs (later)

- `data.js` — enrich `sword_sect_hall` lore; optional `solitary_sword_mountain` forbidden stub
- `FACTION_NPCS` — Feng rename; add Wen Ning when Longcheng ships
- `CULTIVATION_METHOD_POOL` — `celestial_sword_qi_line` layered entries (sword techniques only)
- `factions-expand.js` — Phoenix Gambit Sword choice branches
