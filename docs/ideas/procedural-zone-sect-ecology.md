# Procedural zone sect ecology (mid & small sects)

| Field | Value |
|-------|-------|
| **Status** | `designed` (owner: hard line A + city-tier branches) |
| **Blocked on** | [`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md) size taxonomy; zone power map (owner) |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent planning, 2026-08-01 |
| **Updated** | 2026-08-01 (owner: hard line A; city-tier branch rule) |

## Intent

Populate each zone with **mid and small cultivation organizations** without hand-authoring every one. The world should feel alive over time: sects **rise, stagnate, merge, and fall** while the player is elsewhere. Great powers (Celestial Sword, Sandveil Tribunal, etc.) stay **authored anchors**; procedural sects fill the space between "city dojo" and "continental hegemon."

## What exists today (gap)

| Layer | What it does | Gap |
|-------|--------------|-----|
| **FACTION_DEFINITIONS** (11) | Hand-authored regional powers — rep, quests, NPC elders | Static; never spawn or collapse |
| **worldSects** (`sect.js`) | 3–5 procedural rivals when player reaches Established | Player-centric only; not a zone population |
| **sect_hq locations** | Named HQs on local map | Hand-placed; no turnover |

No global registry of "all sects in Dustbone." No size tier (`school` / `minor` / `regional`). No autonomous rise/fall beyond player defeating a rival.

## Three-layer model (recommended)

```text
GREAT POWERS (authored)     — 1–4 per zone, never procedural
        ↑ subordinate / rival / absorbed
PROCEDURAL SECTS (generated) — mid & small; rise/fall on world clock
        ↑ graduate / crushed / patronized
SCHOOLS & HALLS (generated) — FE-scale; city-attached; high churn
```

**Rule:** Procedural sects never outrank the zone's authored great powers. Heartlands procedural cap is low (great sects already own the board); Dustbone/Jade can carry many small fry.

## Owner decision — hard line (A) + city-tier branches

**Locked:** Hall ≠ sect. Schools are FE-scale, city-bound. Sects are GC+ institutions with ground (mountain, compound, vein). No soft overlap — if it hasn't claimed cultivation ground and produced GC leadership, it's a hall.

**Caveat (owner):** Major cities are **not** where indie small fry thrive. Wealthy civic nodes have higher effective power floors — city lords, charter law, great-power economics. Independent halls get **priced out, regulated out, or absorbed**. What remains in tier 1–2 cities is mostly **branches** of powers that already won.

### Three procedural kinds (not two)

| Kind | `kind` | Where it lives | Apex | Procedural? |
|------|--------|----------------|------|-------------|
| **Hall** | `hall` | Tier 4 cities, frontier, wilderness edge | Peak FE teacher | Yes — indie, high churn |
| **Branch** | `branch` | Tier 1–3 city compounds; Envoy Row pattern | Capped by **city civic apex** ([`city-tiers.md`](city-tiers.md)) | Yes — but `patronFactionId` required |
| **Sect** | `sect` | Mountains, valleys, routes — **outside** city cores | GC+ patriarch | Yes — minor/regional |

**Great powers** stay authored (`FACTION_DEFINITIONS`). Their city presence is **branch**, not a second HQ. Mountain is home; city office is charter business ([`imperial-city-tianjing.md`](imperial-city-tianjing.md)).

### City tier → what spawns

| Civic tier | Examples | Indie hall | Branch | Minor sect (mountain) |
|------------|----------|------------|--------|------------------------|
| **Imperial** | Longcheng | No | Authored only | No |
| **1st** | Threshold City | No | Authored + rare procedural branch stubs | Outskirts only, not city seat |
| **2nd** | Strong regional capitals | Rare (1) | Mostly branches | Zone wilderness |
| **3rd** | Zone capitals | Some | Mix | Wilderness + fringe |
| **4th** | Redwell | **Main indie hall pool** | Occasional branch outreach | Nearby hills |
| **Outpost** | Waystation, camp | Tiny halls or none | None | Wilderness |

**Xianxia read:** Redwell has three competing dojos and a con artist "sect." Threshold has Jade Lotus factor, Sunscar liaison compound, and no patience for unlicensed teachers. Heartlands Envoy Row is offices, not mountains.

### Branch behavior (lighter than indie)

Branches **share patron fate** — Phoenix war hits Phoenix branch standing. They don't run full ecology succession; staff rotates; `patronFactionId` links to `G.factions.reputation`.

- Can't promote to regional or great power
- Peer contests vs indie halls unfair (branch has patron backup — contest mod, not auto-win)
- Procedural branch stubs: "Celestial Sword charter office (Redwell outreach)" only if tier allows and patron has zone presence

### Indie hall pressure events (tier 3+)

When indie hall spawns near branch-heavy city, weight events:

- `undercut_by_branch` — wealth −, disciples leave
- `charter_shutdown` — city lord + branch pressure; hall closes or moves to fringe
- `defiant_survive` — rare; hall keeps niche (cheap QC, local roots)

Genre flavor: the jianghu is **open on the frontier** and **cartelized in the capital**.

## Size tiers

Align with [`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md):

| Tier | Fiction | Typical apex | Zone fit |
|------|---------|--------------|----------|
| **Hall / school** | City dojo, rented courtyard, teaches basics | Peak FE elder | Any city; high turnover |
| **Minor sect** | Named mountain or compound, dozens of disciples | Golden Core patriarch | Dustbone, Jade, fringe Emberwild/Frostbite |
| **Regional sect** | Controls a valley or trade route | Nascent Soul public face | Jade, Emberwild, Frostbite — rare in Dustbone |
| **Great power** | Authored only | NS+ public, VR patriarch, hidden ancestors | One slot per zone (or cluster) — **not generated** |

**Realm bands per zone** (from existing `dangerRealm` / `minRealm`):

| Zone | Procedural pool | Notes |
|------|-----------------|-------|
| Dustbone | halls, minor | GC is local tyrant; many small fry |
| Jade | halls, minor, some regional | Twin great sects already present |
| Emberwild / Frostbite | minor, regional | Hard zones — fewer but tougher |
| Heartlands | halls only (maybe 1–2 minor) | Great four dominate; procedural = satellites |

## Generation (what to roll)

Reuse patterns from `generateWorldSect` (`sect.js`) and `generateWorldNpc` (`world.js`):

1. **When** — world start seed + periodic spawn tick (e.g. every 24–36 in-game months per zone)
2. **How many** — target density per zone; **start light** (tunable constants):

| Zone | Starter target | Notes |
|------|----------------|-------|
| Dustbone | 4–6 active | Ramp to 8–12 later |
| Jade | 3–5 | |
| Emberwild / Frostbite | 2–4 | |
| Heartlands | 2–3 | Mostly halls |

`ZONE_SECT_DENSITY` in data — one number per zone, easy to dial.
3. **Roll per spawn:**
   - `size` (weighted by zone)
   - `name` (prefix/suffix pools — already exist)
   - `doctrine` + `flavorType` (map to faction archetypes: warrior, merchant, mystic — **flavor only**, not full faction rep)
   - `zone` + optional `anchorLocationId` (city or wilderness node)
   - `apexRealm` (champion patriarch — capped by zone + size)
   - `renown`, `power`, `discipleCount` (lightweight numbers)
   - `status`: `rising` | `stable` | `declining` | `extinct`
   - `spawnedAtMonths`, `lastTickMonths`

**Optional coherence:** "Lineage stub" — one element or breath name from a small pool so two sects in Jade don't feel identical. Not full identity docs; 1–2 tags.

## Founder archetypes (story-first sim)

**Goal:** Sects feel like they have a history — genius-led meteoric rise, band-of-brothers slow grind, refugee remnant, etc. The player does **not** need to watch it happen. They encounter a sect that already **reads** like it had a life.

**Principle:** Simulate **story pressure**, not disciples. No RimWorld. Each sect gets a **founding template** at spawn; the world tick advances hidden counters; when thresholds cross, emit a chronicle beat and update state. Quiet years produce nothing (same rule as [`chronicle-and-projects.md`](chronicle-and-projects.md)).

### Archetypes (starter set)

| Archetype | Founding fiction | Rise curve | Weakness (how they fall) |
|-----------|------------------|------------|--------------------------|
| **Lone genius** | One prodigy founds alone; sect is load-bearing on them | Fast early renown; can skip hall → minor quickly | Talent ceiling hit → stagnate → decline; patriarch dies in duel; offends great power |
| **Band of brothers** | 2–4 peak-FE / early-GC friends pool resources | Slow, steady; rarely spikes | Internal split after first elder death; succession fight |
| **Refugee remnant** | Survivors of a fallen sect flee with a manual fragment | Starts with modest renown, often **declining** | Unless a lucky breakthrough, slowly fades; merge target |
| **Patron-backed** | Merchant house or minor noble funds a courtyard school | Money-fueled rise in cities | Patron withdraws / scandal → sudden decline |
| **Proxy / vassal** | Satellite of a great power or tribe | Stable, low ceiling | Patron war or treaty change → absorbed or abandoned |
| **Village hall** | Local teacher, no ambition | Flat; may never leave hall tier | High churn — closes when teacher dies of age |

Roll archetype at spawn (zone-weighted). Store on sect object:

```javascript
{
  founderArchetype: 'lone_genius',
  storyBeats: [ /* compressed chronicle */ ],
  storyPressure: { rise: 0, stability: 0.7, successionDepth: 0.1 },
  patriarch: { name, realmIdx, alive, talentCeiling },
  elders: 1,  // abstract count — not full NPCs unless promoted
}
```

### What actually ticks (lightweight)

Each ecology tick (e.g. yearly), per active sect:

1. **Advance pressure** from archetype curves + random noise + zone danger
2. **Check failure triggers** (weighted by archetype)
3. **Maybe emit a beat** → append to `storyBeats` + optional `appendWorldChronicle` (Jianghu tab)
4. **Update** `status`, `renown`, `size`, `patriarch.alive`

| Hidden variable | Meaning |
|-----------------|--------|
| `rise` | Accumulates → renown gain, size bump |
| `stability` | Low → split, succession crisis |
| `successionDepth` | Backup elders; genius archetypes start near 0 |
| `patriarch.talentCeiling` | Max realm genius can reach; when hit, rise stalls |

**Failure rolls** (archetype sets weights):

- `patriarch_slain` — rival sect, demonic talent, offended faction
- `talent_ceiling` — genius can't break through; disciples leave
- `internal_split` — brothers feud; sect fractures or weakens
- `patron_withdrawal` — merchant / great power pulls support
- `absorbed` — great power or stronger procedural sect wins
- `old_age` — patriarch dies naturally; succession roll decides survive vs decline

### Chronicle as the product

The sim exists to fill **`storyBeats`** — 2–6 lines over a sect's life. Player-facing surfaces:

| Surface | What they see |
|---------|----------------|
| **Jianghu chronicle** | "In Jade, the Crimson Reed Sect rose fast on Patriarch Lu's talent — until he angered the Storm Dragon envoy." |
| **NPC gossip** | One-line variant when visiting zone |
| **Sect inspect** (later) | Compressed origin: founding archetype + last 2 beats |
| **Quest hooks** | "Declining remnant seeks patron" / "Rising genius sect challenges local order" |

Template examples (filled at runtime):

```text
{founded} — {patriarch} and {N} companions founded {name} in {zone}.
{rise} — {name} grew swiftly while {patriarch} broke through to {realm}.
{crisis} — {patriarch} {death_reason}; the sect {outcome}.
{fall} — {name} {extinction_reason}. The {zone} remembers.
```

No beat during quiet years — only state drift.

### Genius vs brothers (worked example)

**Lone genius** spawns in Dustbone:

- Year 0: beat — "Lu Feng opened the Iron Reed Hall with a stolen breathing pamphlet."
- Years 1–8: `rise` high each tick; renown climbs; hall → minor
- Year 9: patriarch hits `talentCeiling` (GC peak); rise stalls; stability slowly drops
- Year 14: roll `offended_power` → beat — "Lu Feng refused tribute to Sunscar riders."
- Year 15: `patriarch_slain` → beat — "Lu Feng fell in the Bone Crossroads. Iron Reed declined."
- Year 18: renown 0 → extinct; slot opens for new spawn (maybe **band of brothers** this time)

**Band of brothers** in same slot later:

- Year 0: three named elders, `successionDepth: 0.6`, slow rise
- Years 1–20: occasional small beats ("secured a spirit stone mine")
- Year 22: one elder dies; stability check — pass, continue
- Year 35: second elder dies; stability fails → split → one sect becomes remnant, original weakens
- Player might never visit; chronicle still tells the story

### Permanence answer

- **Most** procedural sects die or shrink within decades — that's fine; slots recycle.
- **Rare promotion:** A brotherhood that survives 50+ years with high renown + lucky succession **might** graduate to "regional" and get a **sticky name** in save — still capped below authored great powers unless owner later promotes one to faction (manual or milestone).
- **Emergent legend** is a reward for beating the odds in sim, not the default.

### What we deliberately do NOT sim (v1)

- Individual disciple names, breakthroughs, building construction
- Full elder NPC roster (optional: one `patriarch` NPC when player visits HQ)
- Technique inheritance detail (flavor tag only)
- Geography beyond zone + optional anchor city

Add depth only where player interaction demands it.

## Lifespan & sect longevity

Sects don't last because of renown — they last because **someone alive can hold the door**. Cultivator lifespan is the clock. Tie ecology ticks to the same table as NPCs and player (`LIFESPAN_BY_REALM` in `data.js`; owner target may move GC toward ~300y — model uses whatever the table says).

### Realm lifespans (current build → owner direction)

| Realm idx | Realm | Lifespan (code today) | Owner note |
|-----------|-------|----------------------|------------|
| 0 | Qi Condensation | 80y | |
| 1 | Foundation Establishment | 120y | Peak FE at 80–90 → ~30–40y runway |
| 2 | Golden Core | **200y** | User: **~300y** target — tune when watershed pass lands |
| 3+ | Nascent Soul+ | 400y+ | Regional sects can span centuries easily |

**Design rule:** ecology sim reads `LIFESPAN_BY_REALM[patriarch.realmIdx]` — no hardcoded 300.

### How long a sect can last

```text
sect runway ≈ patriarch remaining life
            + succession bonus (if a worthy heir broke through in time)
            − crises (feuds, splits, no talent)
```

| Sect tier | Typical patriarch | Realistic span | What extends it |
|-----------|-------------------|----------------|-----------------|
| **Hall** | Peak FE elder | **30–80 years** active | Teacher trains a replacement FE; often dies with the hall |
| **Minor sect** | Golden Core | **50–200+ years** | Second GC before first dies; staggered elders |
| **Regional** | Nascent Soul | **Centuries** | Multiple NS/GC generations; rarely procedural |

**Breakthrough age matters.** A GC patriarch who formed their core at 80 has ~120–220 years left (at 200y cap). One who broke through at 150 might only have 50–150. Store `patriarch.ageMonths` and `patriarch.realmReachedAtMonths` so runway is computed, not guessed.

```javascript
function getPatriarchRemainingYears(patriarch) {
  const cap = LIFESPAN_BY_REALM[patriarch.realmIdx] * 12;
  return Math.max(0, (cap - patriarch.ageMonths) / 12);
}
```

### Succession (the load-bearing question)

When patriarch age crosses **~70% of realm lifespan**, roll succession each ecology tick:

| Outcome | Effect |
|---------|--------|
| **Heir ready** | New patriarch at realm−0 or realm−1; `successionDepth` resets partially; beat — "Second patriarch inherits the mountain" |
| **Heir too weak** | Sect continues but `stability` drops; decline on death |
| **No heir** | On patriarch death → sharp decline or immediate extinction |

**Archetype modifiers:**

| Archetype | Succession odds | Notes |
|-----------|-----------------|-------|
| Lone genius | Low | Sect often **is** the genius; dies with them unless lucky disciple |
| Band of brothers | High early | Staggered elder ages; can bridge 2–3 generations if brothers don't split |
| Refugee remnant | Medium | May start with an heir figure (survivor elder) |
| Village hall | Low | Teacher dies → hall closes unless student takes over at FE |

**Genius sect story:** fast rise, patriarch caps at GC at age 90, runs the sect 110 years, never produces another GC → sect collapses within a generation of their death. **Brotherhood story:** slow climb, first patriarch dies at 140, brother holds until 180, trains a talented disciple who breaks through at 160 → sect lasts **250+ years** across three faces.

### Tick integration

On each ecology tick (yearly):

1. `patriarch.ageMonths += 12`
2. If `ageMonths >= lifespan cap` → `old_age` death (unless immortal plot)
3. Else if age > 70% cap → succession roll (weighted by archetype + `successionDepth` + disciple pipeline abstract score)
4. If patriarch dies without heir → apply failure mode; emit fall beat

**Disciple pipeline** (abstract, v1): single number `heirPotential` that rises slowly while sect is `stable`/`rising` and has renown; breakthrough roll when patriarch nears death. No named disciples until player visits.

### Chronicle beats tied to lifespan

```text
{patriarch} reached Golden Core at age {age} — {name} would endure as long as they lived.
{succession} — Before old age took {patriarch}, disciple {heir} formed a golden core. The sect endured.
{no_succession} — {patriarch} died at {age} with no equal heir. {name} withered within a generation.
```

Player doesn't need the math — they read that a GC sect lasted "three patriarchs over two centuries" or "one brilliant century, then gone."

### Zone interaction

- **Dustbone/Jade:** most procedural sects are FE–GC; lifespans keep turnover **human-scale** (decades to a few centuries)
- **Heartlands:** great powers have NS+ elders — procedural halls are mayflies by comparison
- Don't spawn procedural sects whose patriarch realm exceeds zone `dangerRealm` band without story reason (refugee remnant exception)

## Sim vs fake — the honesty model

**Problem:** Sect strength is multidimensional — territory, economy, disciples, reputation, diplomacy, techniques, arrays, patriarch realm, lifespan, great-power backing, … Simulating all of that for dozens of background sects is Dwarf Fortress. The player mostly needs **believable stories** and **consistent power when they interact**.

**Answer:** Almost everything is **faked for background sects**. A small set of **vitals** stands in for the whole machine. Events are **labels** that nudge vitals; chronicle **narrates** the label. Full simulation is reserved for **your sect** (already built) and optionally **one sect you zoom in on**.

### Decision rule

| Question | Fake it | Simulate it |
|----------|---------|---------------|
| Does the player see it happen? | Yes — almost always | Only player sect; maybe 1 rival during active arc |
| Does it need tactical detail? | Background wars, trade routes | Duels, raids, diplomacy you chose |
| Would wrong details break immersion? | "They lost a skirmish" — fine | "Your raid target had 3 GC elders" — needs hydrate |
| Cost if abstracted wrong? | Low — swap chronicle line | High — unfair combat, save corruption |

**Proximity rule:** far away = vitals drift + story beats. Player enters zone or picks a quest hook = **hydrate** plausible details from vitals (patriarch realm, rough disciple count, one grudge) — still not full sim.

### What you listed → what we actually store

Collapse many factors into **~6 vitals** + archetype + patriarch:

| You said | Vital (hidden) | How it's "faked" |
|----------|----------------|------------------|
| Territorial skirmishes | `might` | Yearly noise ±; war event = −might, +renown if win |
| Economic situation | `wealth` | Archetype bias (merchant high); famine event −wealth |
| Disciple pool | `depth` | Abstract headcount + `heirPotential`; no names |
| Reputation / standing | `renown` + `standing` | renown = fame; standing = {-2..+2} vs zone average |
| Diplomatic ability | trait on archetype | Modifies war/insult roll weights, not conversation trees |
| Patriarch strength | `patriarch.realmIdx` | Real — drives combat when hydrated |
| Lifespan / succession | `patriarch.age` + `heirPotential` | Real clock — see above |
| Techniques / arrays | flavor tags | "sword lineage", "merchant hall" — modifier on rolls |
| Great power backing | `patronId` or null | Binary-ish; loss of patron = event |
| Internal stability | `cohesion` | Split/merge rolls; brothers high start |
| **Contest variance** | `fortune` (hidden, −1..+1) | Situational luck; shifts peer fight odds |
| **Rare prodigy** | `prodigy` (optional, hidden) | See below — surprise factor in fights & succession |

**Displayed "power"** (like existing `calcWorldSectPower`) = weighted sum of vitals + patriarch realm — **never shown as a precise number for peers**. Player sees **bands** and **rumors**, not a spreadsheet.

### What actually runs each year (background)

Not a war simulator. One tick per sect:

```text
1. Age patriarch
2. Drift vitals slightly (archetype curves)
3. Roll 0–1 events from a table (weighted by vitals + zone)
4. Apply event → nudge vitals, maybe chronicle beat
5. Check extinction (lifespan, might≤0, cohesion collapse, etc.)
```

**Event table examples** (each is a story label + vital deltas):

| Event | Typical effect | Chronicle flavor |
|-------|----------------|------------------|
| `won_skirmish` | +renown, −might (casualties) | "Seized a spirit stone vein from a rival hall" |
| `lost_skirmish` | −renown, −might | "Retreated from the western pass" |
| `trade_boom` | +wealth, +renown | "Caravan season filled their coffers" |
| `famine` | −wealth, −cohesion | "Disciples scattered after a lean winter" |
| `insulted_great_power` | −standing, triggers feud risk | "Refused tribute to…" |
| `talented_recruit` | +heirPotential | "A prodigy took the outer oath" |
| `prodigy_breakthrough` | +might, +renown; prodigy `ascendant` | "Their hidden prodigy broke through in closed door" |
| `prodigy_fallen` | −heirPotential; prodigy `fallen` | "Envy and assassination claimed their star disciple" |
| `internal_split` | −cohesion, maybe fork sect | "Two elders divided the inheritance" |

No battle map. No individual disciple cultivation. The **story** mentions skirmishes; the **state** only moves numbers.

### When details become "real"

**Hydration** — on demand when player:

- Visits sect HQ / pins on map
- Accepts quest involving them
- Duels / raids them (reuse `worldSects` pattern)

Roll from vitals:

- `discipleCount` ≈ f(depth, size tier) — "about forty disciples"
- `championRealm` = patriarch or patriarch−1
- One named patriarch + maybe one elder if `cohesion` high
- Grudge list = 0–1 procedural rival in same zone

Discard extra detail when player leaves if needed (keep vitals + names).

### Player sect vs background sects

| | Player sect | Background sect |
|--|-------------|-----------------|
| Buildings, inventory, disciples | **Simulated** | Abstract `depth` |
| Economy | **Simulated** | `wealth` vital |
| Diplomacy UI | **Simulated** | `standing` + event rolls |
| Wars | Events you choose | Chronicle lines |
| Purpose | Gameplay | Texture + quest hooks |

Fairness: background sect power at interaction time must match hydrated stats derived from vitals — no pulling a NS patriarch out of a "hall" with low might.

### Depth ladder (if you ever want more)

| Tier | Cost | What you get |
|------|------|--------------|
| **A — Vitals + events** (recommend v1) | Low | Living world feel, chronicle, hooks |
| **B — Zone conflict graph** | Medium | Sect A vs B persistent grudges; still no battles |
| **C — Named elders as world NPCs** | Medium-high | Patriarch exists in `worldNpcs` when hydrated |
| **D — Economic sim per sect** | High | Trade routes, stone income — probably never for background |
| **E — Full sect sim** | Absurd | Only player sect |

Stop at **A** until player interaction forces **B** or **C**.

### "Does it feel fake?"

It won't if:

1. **Outcomes match vitals** — declining sect reads declining; chronicle matches state
2. **Events are sparse** — quiet years, highlight beats (diary rule)
3. **Archetypes differ** — genius vs brothers produce different event mixes
4. **Lifespan is real** — time pressure isn't faked; succession math uses real ages
5. **Hydration is consistent** — same sect doesn't have 5 GC elders one visit and a dying FE patriarch the next

Players accept abstraction if **consequences feel earned** when they show up.

## Peer contests — unpredictable fights

**Goal:** Between **peers**, the player should **not** be able to call the winner at a glance. A slightly stronger sect on paper should win *more often*, not *always*. Upsets are part of the jianghu.

### Peer band vs mismatch

| Gap | Predictability | Player reads |
|-----|----------------|--------------|
| **Peers** (effective power within ~15%) | **Low** — coin-flip-ish with edge | "Evenly matched" / "Could go either way" |
| **Moderate** (15–35%) | Medium | "Slight advantage to X" |
| **Dominant** (35%+) | High | "X heavily favored" — OK to read clearly |

Background skirmishes and player-facing raid/diplomacy previews use the same resolver. Only mismatches feel deterministic.

### Contest resolution (one function)

```text
effectiveA = basePower(A) + hiddenVariance(A) + situationalMods(A)
effectiveB = basePower(B) + hiddenVariance(B) + situationalMods(B)
margin = effectiveA - effectiveB
winChanceA = sigmoid(margin / peerSpread)   // peers → ~45–55%
roll → winner, apply vital deltas, chronicle beat
```

**`basePower`** — vitals + patriarch realm (not shown to player).

**`hiddenVariance`** (per contest, rolled fresh):

- `fortune` drift on sect
- `morale` / `cohesion` spike or dip
- `wealth` spent on emergency pills (one-shot)
- **Prodigy unleashed** — hidden ace (see below)
- Patriarch in seclusion (−) vs just broke through (+)

**Situational mods** (can be revealed by intel):

- Home territory (+)
- Ambush / array primed (+)
- Patriarch injured (−)
- Great power secretly backing (+)

Chronicle after upset: *"Few expected the Iron Reed to hold the pass — their young sword prodigy turned the line."*

### What the player sees (before the fight)

Never: `Power 847 vs 812`.

Instead, **intel-dependent bands**:

| Intel level | Preview text |
|-------------|--------------|
| Public rumor | "Two minor sects feud over a vein — outcomes unclear." |
| Scout report | "Iron Reed: disciplined, patriarch GC early-life. Sandveil cohort: wealthier, cohesion shaky. **Even match.**" |
| Spy dossier | Vitals bands + prodigy hint + patriarch age + "array believed primed" |

Same sect pair can read "even match" to one player and "slight edge Iron Reed" to another with better intel — and both can be wrong once variance rolls.

### Player's own fights

When **you** raid a peer, your choice matters (tactics, timing, spending) — adds player-side mod on top of variance. Background sect-vs-sect stays fully automatic.

## Rare prodigies (hidden aces)

Talents exist everywhere; they're **rare**. No need to sim every disciple — one optional **prodigy slot** per sect.

### Spawn

Yearly roll per active sect (low base chance, e.g. 2–4%; higher if `depth` high and `rising`):

```javascript
prodigy: {
  name: null,           // rolled on reveal
  realmIdx: 1,          // starts low
  ageYears: 16,
  ceiling: 3,           // rolled — may exceed patriarch
  status: 'latent' | 'revealed' | 'ascendant' | 'heir' | 'fallen',
  revealedAtMonths: null
}
```

| Status | Meaning |
|--------|---------|
| **latent** | Exists in sim; no public name; spy may detect "unusual qi gathering" |
| **revealed** | Chronicle — "A prodigy took the outer oath"; +renown |
| **ascendant** | Fast breakthrough ticks; contest wildcard; envy events |
| **heir** | Slotted for succession; boosts `heirPotential` massively |
| **fallen** | Died, defected, or crippled — tragedy beat |

### Fast climb (abstract)

While `ascendant`, yearly roll:

- `realmIdx++` (capped by `ceiling`) at higher rate than normal pipeline
- Triggers events: wins duel, offends rival, great power recruitment attempt
- Can **upset peer contests** before becoming patriarch
- Can become patriarch early if current dies (`heir` fast-track)

**Genius-founder sect** may start *with* a prodigy (the founder). **Brotherhood** might produce one in generation two. Player reads a story; engine tracks one object.

### Player interaction

- **Without intel:** prodigy is surprise in fight or chronicle
- **With spy dossier:** "Rumored hidden prodigy, realm unknown (FE–GC band)"
- **Visit HQ / duel prodigy:** hydrate name + realm for that encounter

## Intel & spying (player-gated "more sim")

Spying doesn't require full background simulation — it requires **reading hidden fields on a declared target** and presenting them as reports. Gate behind **tension**, not always-on.

### When intel unlocks

| State | Intel available |
|-------|-----------------|
| Neutral | Public band only (renown, size tier, zone reputation) |
| **Focused** — player marks sect as interest | Scout reports (cost time/stones) |
| **Tense** — feud, embargo, insult | Spy missions unlock |
| **War** — declared hostilities | Full dossier tier, refresh cadence, counter-intel risk |

Declare target from sect diplomacy UI (reuse `worldSects` / zone sect inspect). Sets `G.sect.intelTargets[sectId]`.

### Intel tiers (decay over time)

| Tier | Cost | Reveals | Decay |
|------|------|---------|-------|
| **Public** | Free | Name, zone, size tier, renown band | Slow |
| **Scout** | Months + stones | Might/wealth/cohesion **bands**; patriarch realm **range** | ~2–5 years |
| **Spy** | Disciple mission + risk | Narrower bands; patriarch **age**; prodigy **hint**; patron | ~1–3 years |
| **Deep cover** | War only, high risk | Near-exact vitals; array primed; succession timeline | ~6–18 months |

Stale intel shows as *"Report dated Year 214 — reliability low."* Player must refresh before a raid.

### Spy as lightweight sim

Only the **target sect** gets a detail pass when spied upon:

1. Read true vitals + prodigy + patriarch from save
2. Add **noise** (deception if high cohesion / shadow doctrine)
3. Write report entry to `G.sect.intelReports[targetId]`
4. Roll discovery → worsens standing, may trigger ambush event

No second simulation running — **inspection with fog and lies**. Feels like sim because reports are specific; cost is one target at a time.

### Counter-intel (optional later)

High-cohesion targets feed false bands. Player learns on failed raid: *"Their array was already primed — your scout was fed misdirection."*

## Lifecycle (rise and fall)

Hook into `world-scheduler.js` — new tick `zoneSectEcology` (priority ~45, near world NPC growth):

| Event | Trigger | Effect |
|-------|---------|--------|
| **Rise** | Empty slot + spawn roll; or `rising` + good tick | +renown, maybe size bump (hall → minor) |
| **Stagnate** | `stable` for N years | Flavor only; occasional quest hook |
| **Decline** | War loss, patriarch death, resource famine roll | −renown, `declining`, may shrink |
| **Fall** | renown ≤ 0, or lost war vs great power / rival | `extinct` — name enters chronicle, slot opens |
| **Merge** | Two weak same-zone sects + proximity | One absorbs other; combined renown |
| **Absorbed** | Great power expansion event (scripted or roll) | Procedural sect → vassal or extinct |

**Player interaction:**
- Defeating a procedural sect (duel/raid) accelerates fall — reuse `worldSects` defeat flow
- Player sect growth can **vacuum** a slot (new minor sect spawns to fill niche)
- Chronicle lines: "The Iron Reed Hall collapsed after their patriarch fell in the Emberwild."

**Important:** Fall should happen **without** the player. Most churn is background.

## Storage (proposed)

New save slice — **not** inside `G.sect.worldSects` (that stays player-rival focused):

```javascript
G.world.zoneSects = {
  dustbone: [ /* sect objects */ ],
  jade: [ ],
  // ...
}
```

Or flat `G.world.sects[]` with `zone` field + index by zone at read time.

**Migration:** On first load, seed each zone from templates + random roll. Authored `sect_hq` locations stay; procedural sects can attach to wilderness nodes or cities without new map pins initially (name in travel/look flavor).

## What players see (phased)

| Phase | Player-facing |
|-------|----------------|
| **A — background** | Chronicle ticks, NPC dialogue refs ("three halls compete for Redwell students") |
| **B — map** | Optional pins on local map for regional+ sects; halls as city flavor |
| **C — interaction** | Duels, trade, protection quests, "lesser sect seeks patron" events |
| **D — player sect** | Your rise can displace a procedural sect; absorption mechanics |

## Reuse from existing code

- `generateWorldSect`, `SECT_WORLD_BALANCE`, `SECT_RIVAL_PREFIXES/SUFFIXES` — naming and power scaling
- `pickWorldSectZone`, `ZONE_NPC_ROLES` — zone weighting
- `SECT_EVENTS` `powerCompare` — asymmetric sect events
- `registerWorldTick` in `world-scheduler.js`
- `getWorldSectsInZone` pattern — extend to zone registry
- `FACTION_DEFINITIONS.type` — flavor archetype without full faction machinery

## Prerequisites

- [x] Density — start light; tunable per zone (`ZONE_SECT_DENSITY`)
- [x] School vs sect — **hard line A**; halls FE/city, sects GC+/ground
- [x] Major cities — **branches not indie**; tier table above
- [ ] Owner confirms size tier names
- [ ] Owner confirms GC lifespan target (200y code today vs ~300y design intent) before tuning succession math
- [ ] Decision: seed at new game vs lazy spawn on first zone visit
- [ ] [`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md) — school vs sect founding gate (affects hall → sect graduation)
- [ ] Optional: [`city-tiers.md`](city-tiers.md) — halls attach to city tier (more halls in Redwell-tier cities)

## Open questions

- [x] Density — start light, vary by zone (constants)
- [x] Permanence — story-first sim via founder archetypes; rare sticky promotion
- [ ] Shared world seed across playthroughs vs per-save random?
- [ ] How much NPC depth — patriarch only at HQ visit, or never materialize?
- [ ] Bridge to `FACTION_DEFINITIONS` rep when player helps/harms a procedural sect?
- [ ] Imperial / court reaction when a procedural regional sect gets too bold?
- [x] Peer fights — contest resolver + variance; bands not raw power
- [x] Prodigies — optional hidden slot, rare roll, contest/succession wildcard
- [x] Spying — player-gated intel tiers on declared target; read vitals + noise, not full sim
- [ ] Spy UI placement — sect panel vs diplomacy vs disciple mission

## Implementation crumbs (when promoted)

- `sect.js` — extract `generateWorldSect` → shared `generateZoneSect({ size, zone, capRealm })`
- New `zone-sect-ecology.js` — registry, spawn, tick lifecycle
- `world-scheduler.js` — register tick
- `data.js` — `ZONE_SECT_DENSITY`, `SECT_SIZE_TIERS`, `SECT_FOUNDER_ARCHETYPES`, realm caps per zone
- `zone-sect-ecology.js` — `resolveSectContest(a, b, opts)`, `rollProdigyEvent(sect)`, `tickZoneSectStory(sect)`
- `sect-intel.js` (or `sect-expand.js`) — `declareIntelTarget`, `runScoutMission`, `runSpyMission`, `getIntelPreview(sectId)`
- `world-scheduler.js` — register tick; `appendWorldChronicle` for Jianghu beats
- `locations.js` / chronicle — flavor hooks first

## Links

- [`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md)
- [`sect-faction-identities.md`](sect-faction-identities.md)
- [`city-tiers.md`](city-tiers.md)
- [`imperial-city-tianjing.md`](imperial-city-tianjing.md)
- [`watershed-realms-lifespan-pacing.md`](watershed-realms-lifespan-pacing.md)
- [`chronicle-and-projects.md`](chronicle-and-projects.md)
- [`mortal-life-sim-cluster.md`](mortal-life-sim-cluster.md)
