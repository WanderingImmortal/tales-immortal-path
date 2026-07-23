# Sect power pyramid, schools & world food chain

| Field | Value |
|-------|-------|
| **Status** | `designed` (brainstorm — owner review) |
| **Blocked on** | World power map (owner); [`nine-realm-ladder.md`](nine-realm-ladder.md) |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent brainstorm, 2026-07-21 |
| **Updated** | 2026-07-21 |

## Intent

Park how **great sects**, **imperial clan**, and **FE schools** sit on the mortal ladder — who runs the jianghu at each scale, and why apex cultivators don't flatten the map. Golden Core is a **local tyrant** in lower spheres; **low–mid on the 9-realm path** but rare in the population.

## Design notes

### GC on the food chain

Mortal ladder idx `0–8`. GC = idx **2** — third realm, five major realms still above.

| Context | GC role |
|---------|---------|
| **Population** | Watershed rare — most die at peak FE or peak GC |
| **Dustbone / Jade** | Apex local predator; domain is law |
| **Frostbite / Emberwild** | Serious power |
| **Heartlands** | Talented junior — NS+ is normal among powers (`minRealm: 3` content) |
| **Imperial heart** | Nobody without backing |

### School (FE) vs sect (GC+)

| | **School** (FE) | **Sect** (GC+) |
|--|-----------------|----------------|
| Scale | City dojo / hall — operates *in* a city | Regional institution |
| Fiction | Teaches basics, few disciples, rents courtyard | Spiritual veins, politics, formations |
| Game (stub) | Light disciples, local fame — first-run leadership | Full sect systems |

**Parked:** found **school** at Peak FE; **sect ascends** at GC (or full founding at GC). Current build gates sect panel at `minRealm: 2`.

### Two “elder” layers

| Layer | Realm band (9-realm ladder) | Examples | Player-facing |
|-------|------------------------------|----------|---------------|
| **Public elders** | **Nascent Soul** (idx 3) | Discipline elders, law elders, mission elders, envoy NPCs | Daily jianghu — what players meet |
| **Peak inner elders** | **Deity Transformation** (idx 4) | War elders, enforcement, inheritance gatekeepers | Serious sect business |
| **Patriarch / public apex** | **Void Refinement** (idx 5) | Sect leader who runs the mountain day-to-day | Rumored, rare audiences |
| **Ancestor vault** | Dao Seeking+ (idx 6–8) | Past patriarchs, breakthrough legends, hidden immortals | Names, crises, rumor — not on the street |

*Current 7-realm build:* NS (3) = public elder · VR (4) = patriarch · Dao Seeking (5)+ = ancestor vault. Deity Transformation slots between NS and VR when nine-realm ladder ships.

Discipline elder at NS ≠ hidden Void ancestor.

### Great sect pyramid (template)

```text
IMMORTAL (8)              True leaders · heaven-restricted · mutual deterrence
DAO MANIFESTATION (7)     Highest ancestors below immortals · wear a law
DAO SEEKING (6)           Pursuit elders · fragments · can travel, often obsessed
VOID (5)                  Patriarch / public apex · runs the mountain day-to-day
DEITY (4)                 Peak inner elders · war · enforcement
NS (3)                    Inner court · inheritance
GC (2)                    Outer elders · true disciples
FE and below              Outer disciples · city schools (separate track)
```

**Void above Deity** for public leadership (realm idx 5 > 4 on nine-realm ladder). **Public-facing elders** players interact with are mostly **Nascent Soul**; the **patriarch** is **Void Refinement**; ancient assets hide above.

Sects: public **NS** face for daily elders; **VR** patriarch; hidden ancestor/immortal cards comparable to imperial (deterrence, not identical).

### Immortal true leaders

- Great powers (imperial + major sects) likely **all** have immortals — **mutual deterrence**.
- Not necessarily **oldest** — historical **geniuses** or **determination** types who cleared the final hurdle; age is side effect of realm.
- **Restrictions ≠ weaker** — restricted **agency**, not power. Acting in mortal plane accrues **heaven's debt** (audit, sect backlash, Court summons, rival opening). Sect histories remember when patriarch moved.
- Not every immortal equal: wounded, sleeping, Half-Step at gate, one strike left.

### Dao Manifestation ancestors

- Highest below immortal true leaders.
- **Not weak immortals** — different axis: **wearing a law** vs **transcending mortal board**. Full power in dao/law lane; different ceiling.
- Still **mastering embodiment** — dao is long; wrong move cracks the law they wear.
- Active in **narrow** mandate: tribulation skew, forbidden breach, rival manifestation, law politics — not discipline court.
- Saw what immortals paid for intervention — intervene selectively, not because weak.

### Dao Seeking elders

- Obvious pursuit — fragments, comprehension. Can be public; priority is unfinished dao.
- Wall above: Manifestation, then Immortality with restrictions they've seen backbone immortals bear.

### Half-Step Immortal

Peak before idx 8 — rumor/chronicle tier for hidden apex. See [`nine-realm-ladder.md`](nine-realm-ladder.md). Patriarch might be Half-Step without true Immortal.

### Imperial vs great sects

Imperial: wider top — more Manifestation/Immortal assets, stricter heaven accounting. Sects: public NS elder face; VR patriarch; hidden ancestor cards comparable to imperial (deterrence, not identical).

## Prerequisites

- [ ] Owner maps zones to power bands
- [ ] Sect founding gate decision (school at FE vs sect at GC)
- [ ] Immortal restriction mechanics — [`immortal-world-layer.md`](immortal-world-layer.md)

## Open questions

- [ ] How many immortals per great sect / imperial (1–3 apex assets?)
- [ ] Borrowed immortality (formation + ancestor spirit) for mid sects?
- [ ] Player role in Heartlands great sect (outer disciple vs regional tyrant in Jade)

## Implementation crumbs

- `data.js` — `ACTION_UNLOCKS.sect` (`minRealm: 2`), `SECT_FOUNDING`
- `sect.js` — founding gate; future school type
- Chronicle / NPC tier by zone

## Links

- [`golden-core-cultivation-journey.md`](golden-core-cultivation-journey.md)
- [`domain-system.md`](domain-system.md)
- [`nine-realm-ladder.md`](nine-realm-ladder.md)
- [`immortal-world-layer.md`](immortal-world-layer.md)
- [`realm-claims.md`](realm-claims.md)
