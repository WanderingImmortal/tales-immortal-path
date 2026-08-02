# Body-path great sect (world NPC cultivators)

| Field | Value |
|-------|-------|
| **Status** | `idea` (owner brainstorm — 2026-08-02) |
| **Blocked on** | Body path depth pass (chamber, manuals, tribulation); lineage manual framework for body |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chat, 2026-08-02 |
| **Updated** | 2026-08-02 (great sect survivor; southern spine — owner) |

Parent index: [`sect-faction-identities.md`](sect-faction-identities.md). Body systems: [`body-chamber-anatomy-rebuild.md`](body-chamber-anatomy-rebuild.md), [`soul-body-refining.md`](soul-body-refining.md). Qi sect peers: Heartlands four identity docs.

## Intent

The world today is full of **qi-path sects** — sword schools, flame calderas, trade lotuses, void archives. **Body cultivators exist as a player path** (realms, chamber, vessel rules, martial arts) but **nobody in the jianghu is visibly “the body sect.”** That gap makes body path feel like a solo hobby instead of a living tradition.

Add **one named great power** (or strong regional sect) whose **primary cultivation line is the vessel** — tempering flesh, bone, marrow — with culture, enemies, and a lineage manual hook when body manuals ship. Not implementation yet; this doc is the parking lot.

## Where things stand today

| Layer | Body path | Qi path (contrast) |
|-------|-----------|-------------------|
| Realms | Bronze Skin → … → Indestructible Vajra (`PATHS.body`) | Full ladder + chamber |
| World factions | None body-primary | Heartlands four + zone stubs |
| Techniques | Martial arts tagged `path: body` | Sword, flame, dao arts |
| Identity | Vessel Rules (Blood, Unnamed) | Weapon Intent, dantian seal |
| Manuals | Deferred in manuals framework | Lineage manuals in progress |

Every `FACTION_DEFINITIONS` entry is qi-leaning, trade, beast, or ascetic — **no “we forge the body” institution.**

## Design principle

A body sect is **not** “the combat faction.” Celestial Sword and Phoenix already own martial prestige on the qi line. The body sect’s identity is **the vessel as scripture** — pain as curriculum, oath as law, flesh as the cultivation base. They fight well because they **are** the weapon, not because they picked a combat doctrine perk.

## Candidate: **Vajra Ridge Sect** (金刚岭宗) — **owner lean: lock**

Working name — matches end-realm **Indestructible Vajra** without sounding demonic.

**Owner lock (2026-08-02):** Frostbite’s **other Dao Wars survivor** beside Yin Maiden Palace — a **monk sect of body refiners** on the **southern** habitable spine (granite ridge above Frost Gate), not on the crown. Same great-sect weight class as the palace; **different lane** (flesh, escort, bell halls vs yin silence).

### At a glance

| | |
|--|--|
| **Vibe** | **Ascetic iron monks** — silence, bell strikes, bones that ring when tempered; **body refining** as scripture |
| **Path** | **Body-primary**; qi used as fuel for tempering, not as the cultivation root |
| **Cultivation identity** | **Vessel Canon** (金刚体经) — layer-by-layer refinement (skin → bone → marrow) |
| **Sacred practice** | **Vessel Rules** — sworn physical oaths; outer court learns discipline, inner court swears one rule for life |
| **Homeland** | **Vajra Ridge** (金刚岭) — wind-scoured granite, hanging bell halls, marrow hot springs under the peak |
| **Founder myth** | A mortal smith who **hammered his own ribs into scripture** until heaven could not break him — no immortal patron at founding, which they still boast about |
| **Public leader** | **Patriarch Bell Luo** (钟络) — Void Refinement; rarely leaves the ridge |
| **Player-facing elder** | **Elder Iron Han** (铁瀚) — Nascent Soul; trial master, accepts worthy wanderers |
| **Primary lean** | **Fortification & escort** — ridge arrays, caravan muscle, border garrisons for hire |
| **Also has hands in** | Ore and beast-bone trade, medicinal baths, duel arbitration (“flesh decides”) |
| **What they teach** | Outer: stances, breath-for-stamina, bone conditioning · Inner: marrow arts, vessel rule rites · **Refuse:** sword intent, flame rebirth, void gates |
| **Forbidden apex** | *Stub* — blood-as-oath extremes, unnamed-rule mastery; **not** soul-into-body (that stays separate forbidden practice) |

### Placement — **Frostbite south spine** (dual great sect)

Owner direction: outer zones get **great sect–tier peers** with their own stories. Frostbite holds **two survivors** from the Dao Wars — not one northern bloc:

| Band on spine | Institution | Tradition | Notes |
|---------------|-------------|-----------|-------|
| **Frost Gate margin** | Traders, chilly edge | — | Habitable south |
| **Granite ridge** (mid-south) | **Vajra Ridge** | **Body-refining monks** | **Southern** great sect — escorts, bell halls, marrow springs |
| **Last habitable crown** | **Yin Maiden Palace** | Peak Yin, female-only | [`frostbite-yin-sect.md`](frostbite-yin-sect.md) — **northern** peer on spine |
| **Scar margin → apex** | Sunless Scar | — | No sect HQ |

```text
Frost Gate → Vajra Ridge (body monks, south) → Yin Maiden Palace (crown) → Scar margin → Scar apex
```

- Homeland: **lower granite spine** — traders hear **bells** before the ice palace appears in cloud
- **Respected, not courted** — imperial hire for border muscle; Heartlands sects rarely invite them to votes
- **Regional great sect** — Dao Wars **survivor** with homeland intact; not a Heartlands “fifth petal”

### Dao Wars — hold the corridor, sell the fist (owner lean)

Different war posture from Yin Maiden — **visible muscle**, not silence ledger.

| Layer | What they did | Why |
|-------|---------------|-----|
| **Southern buffer** | Held **Frost Gate approaches** and granite spine — stopped armies and refugee sects from **clogging the only sane road north** | Ridge arrays + **flesh that doesn’t break in Bleed wind** |
| **Licensed muscle** | Escort contracts for Lotus caravans, imperial border forts, tribulation witness parties | **Monks for hire** — oaths, not marriage webs |
| **Body-refiner exports** | Sent **small squads** of tempered adepts south when pay justified — shock infantry, array anchors, “walk through the flank” | Quality flesh; **not** yin concealment |
| **Settlement** | **Vajra Ridge recognized** — homeland behind bell arrays; **no southern land claim** | Same capitulation lane as palace: intact bastion, charter border |

**Contrast Yin Maiden:** palace **quelled north** around the crown and **small yin incursions** south; ridge **held the southern door** and sold **body expertise** outward. Both survived; neither ruled Frostbite as an empire.

**Player memory:** “The bells held the gate. The maidens held the crown. **Nobody held the Scar.**”

### Relationships (sketch)

| Power | Relationship | Why |
|-------|--------------|-----|
| **Celestial Sword** | Respectful rivalry | Both honor direct confrontation — “your line vs our fist” |
| **Jade Lotus** | Practical ties | Lotus hires ridge escorts; Ridge tolerates Lotus paperwork |
| **Void Temple** | Mutual disdain | Books vs bell halls |
| **Golden Phoenix** | Uneasy | Phoenix wants shock troops; Ridge refuses “ash renewal” ideology |
| **Yin Maiden Palace** | Neighbors on spine — **mutual ward of the north** | Moon stillness on crown vs iron on ridge — hire each other for tribulation / Bleed-margin work; **not** shared doctrine |
| **Sunscar Clan** | Distant kin | Desert warriors respect pain; different religion |
| **Imperial court** | Licensed muscle | Border forts, tribulation guards — not dynasty marriage |

### Player hooks

- **Body-path player:** natural home — lineage manual, martial set (`body_tempering`), vessel-rule mentorship, ridge trials
- **Qi-path player:** friction — outer conditioning allowed, inner court closed; or a long “prove your flesh” side arc
- **Found your own sect:** Vajra Ridge as template or rival once player sect systems deepen

### What they are *not*

- Not the **blood demon sect** — blood conditioning is a lane; mass slaughter and soul refining are acts / separate forbidden design
- Not **beast tamers** — Emberwild owns primal communion; Ridge uses beast **bones** as material, not partners
- Not a **dojo in a city** — that's the FE school track; Ridge is a mountain institution

## Alternatives (parked names)

| Name | Pros | Cons |
|------|------|------|
| **Iron Scripture Hall** (铁经殿) | Clear “body as text” | Sounds smaller than great sect |
| **Myriad Tempering Peak** (万淬峰) | Evokes grind | Generic |
| **Bronze Bell Monastery** (铜钟寺) | Strong sound/ritual hook | “Monastery” overlaps Frostpeak |
| **War God's Remnant** (战神遗脉) | Matches mid-realm name | Too warlord, not ascetic |

## Prerequisites (before code)

- [ ] Owner picks **name, zone, and tier** (regional great vs Heartlands peer)
- [ ] Body path **manual / chamber** slice — at least one teachable lineage stub
- [ ] Identity doc v1 stable enough for `FACTION_DEFINITIONS` + one elder NPC
- [ ] Relationship pass with Heartlands four (one paragraph each in peer docs)

## Open questions

- [x] Zone: **Frostbite** — **southern** spine peer to Yin Maiden (owner 2026-08-02)
- [x] Tier: **great sect Dao Wars survivor** — monk body refiners (owner 2026-08-02)
- [ ] Great sect **immortal in the vault** or founder-only myth (no sleeping apex)?
- [ ] Do they accept **mixed-path disciples** (qi outer, body inner) or body-only?
- [ ] Vessel Rule: sect assigns your rule, or you choose after trial?
- [ ] Market unlock: which martial techniques are Ridge-exclusive at launch?

## Implementation crumbs (later)

- `data.js` — `FACTION_DEFINITIONS`, `FACTION_NPCS`, `WORLD_LOCATIONS` HQ
- `docs/ideas/sect-faction-identities.md` — index row + fill template
- `cultivation-methods.js` — body `lineageId` when body manuals exist
- `sect-faction-identities.md` open question: “Are Heartlands sects qi-only?” → **mostly yes; Ridge is the exception elsewhere**
