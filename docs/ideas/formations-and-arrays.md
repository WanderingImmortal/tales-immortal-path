# Formations & arrays

| Field | Value |
|-------|-------|
| **Status** | `building` (F1a on branch); v1 residence qi buffs `shipped` |
| **Blocked on** | Cultivation methods P0–P2 for essence fuel bands; roots v2 for rite formations |
| **Issue** | none yet |
| **Chat / PR** | F1a: [PR #61](https://github.com/WanderingImmortal/tales-immortal-path/pull/61) (`cursor/formations-f1a-fuel-activation-e82d`); design park #60 |
| **Updated** | 2026-07-22 (F1b thin path OK; acquire/content elaboration) |

## Intent

**Formations** are comprehended **patterns** — diagrams traced with flags, pins, and spirit stones — that **redirect ambient qi or essence** through a small area (home, courtyard, guild hall, market HQ). They are infrastructure, not combat hotkeys.

**Arrays** are **many formations linked** into a larger whole: sect territory, city scale, grand defense or grand cultivation. Same underlying pattern language, different scale and upkeep.

Gameplay stays **simple**: choose a known pattern, lay it at a **valid anchor** (not freehand map drawing), pay upkeep. Fiction carries the “staking flags and drawing meridian lines” fantasy.

**Not in scope for v1:** free placement anywhere on the world map, combat-time inscription, essence-location expansion (sun/moon/vein nodes), guild/auction formations.

---

## Scale ladder

| Tier | Scale | Examples | Player fantasy |
|------|-------|----------|----------------|
| **Formation** | Building or small area | Leader’s courtyard, meditation chamber, future guild/market HQ | “I inscribed my quarters.” |
| **Array** | Sect or city | Mountain defense perimeter, cultivation hall essence pillar, reclaimed sect infra | “Our sect’s grand array shields the peak.” |
| **Grand array** *(optional, far future)* | Region / watershed | Suppression of demon lands, nation-scale weather | “Heaven-defying rite” — rare story beats, not required |

**Rule:** Arrays are **not** a separate magic system — they are **composed formations** with shared nodes, higher build cost, and higher upkeep. See [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md) for essence fuel bands (Starved / Formation / Array / Condensate).

---

## How patterns work (fiction → gameplay)

| Fiction | Gameplay (keep simple) |
|---------|------------------------|
| Comprehend a formation manual / diagram | **Study pipeline** (below) — not one button |
| Stake flags, place spirit stones at nodes | **Lay** action: materials + months at a valid anchor |
| Maintain the pattern | **Integrity upkeep** (labour, touch-up) — neglect → fade → scatter |
| Keep a fuel stock / flip the switch | **Fuel + activation** — laid ≠ running; see below |
| Ambient qi/essence flows along the lines | Bonus only while **active** and **fueled** |
| Talented master pre-inscribes gear | **Equipment formation** — limited charges, wears out |
| One-shot burst on paper | **Talisman formation** — consumed on deploy |

**No combat laying:** cultivators do not trace patterns mid-fight. Pre-built gear and talismans are the combat-adjacent expression.

---

## Deployment modes

| Mode | Where | Durability | Typical use |
|------|-------|------------|-------------|
| **Fixed site** | Residence slot, sect anchor node, (later) guild/market HQ | Until neglected or replaced | Gather, stabilise, ward, condense |
| **Equipment** | Robes, boots, belt, weapon (pre-inscribed) | **Charges** — depletes with use | Instant deploy in danger — blink ward, spirit step, stored strike |
| **Talisman** | Inventory consumable | **One use** | Emergency ward, escape, single burst |

Equipment and talisman formations are **formation-master** content: higher comprehension / Formation Dao investment unlocks blueprints. Wear and consumption are the cost of skipping the “lay at home” requirement.

---

## Primary function (+ hybrids)

Every formation pattern has **one primary job**. UI and balance should read clearly at a glance.

| Primary tag | What it does | Example |
|-------------|--------------|---------|
| **Gather** | Pull qi or essence to a spot | Spirit Gathering (qi cultivate boost) |
| **Stabilise** | Smooth meridian / foundation flow | Qi Stabilizer |
| **Ward** | Defense, concealment, tribulation splash | Iron Wall Ward (perimeter / events) |
| **Condense** | Ambient essence → dew / flask / tank | Sun pillar condensate (array-scale) |
| **Rite** | One-shot or rare breakthrough pattern | Seven-Day Heaven-Defying Array (see roots doc) |

**Hybrid formations** (advanced): a master of **Formation Dao** can comprehend patterns that combine two primaries — e.g. **kill + gather** → harvest **blood essence** from slain foes into a collection node. Hybrids cost more to lay and maintain; not default early-game.

Design rule: **no overlapping +5% soup** — if Cultivation Hall gives sect-wide cultivate %, courtyard formations should lean gather/stabilise/essence/ward, not duplicate the same knob.

---

## Where formations sit (anchors, not “anywhere”)

Owner direction: patterns are laid on **valid anchors**, not arbitrary world tiles.

| Anchor (now / near) | Scale | Notes |
|---------------------|-------|-------|
| **Leader’s residence courtyard** | Formation | **Shipped v1** — `G.sect.residence.formations.slots` |
| **Sect map nodes** | Formation or array | `meditation_chamber`, `cultivation_hall`, `defense_array` — buildings today are flat %; future = host patterns |
| **Guild / market / auction HQ** | Formation | **Later** — when those locations exist |
| **World essence nodes** | Formation (essence) | **Later expansion** — sun terrace, moon pool, vein tap; pattern must match site tag |

Essence formations **require a matching location** to draw fuel (sun yang, moon yin, vein, etc.). Qi formations work on generic ambient qi at any qi-rated anchor.

---

## Fuel vs neglect (two axes — owner 2026-07-22)

Do **not** collapse these into one “durability” bar. Players should never confuse “the ward is weak in a fight” with “the ink is fading.”

### Fuel (power stock)

**Rule:** a laid pattern **requires fuel** to run when activated. No fuel → flip the switch and nothing happens. Fuel is the power stock, not the inscription’s health and not the same as “is the switch on.”

| Now (F1 lean) | Later idea (parked) |
|---------------|---------------------|
| Keep a fuel stock; **active** patterns draw from it | **Consumption tied to use** — busy wards/gathers draw more while on |
| Empty fuel → **cannot run** (still present on the land) | Defense: while **active + fueled**, handle attacks it **would normally block** (tier/grade ceiling) without a separate “HP of blocks” meter |

**Defense formation lean (owner):** if the ward is **active**, fueled, and the attack is within what that pattern’s tier/grade can handle, it can keep blocking — **not** “3 charges then shatter.” Exhaustion comes from **running out of fuel** (and later: use-scaled drain), not from a hit-counter confused with neglect.

Out-of-band attacks (above what the pattern can handle) are a **tier/grade / exception** problem — same as kill-ground rules elsewhere — not “the lines wore out.”

### Activation (laid ≠ running — owner 2026-07-22)

**Rule:** laying a pattern stakes it on the land. It does **not** stay roaring forever. Formations and especially **arrays** need an explicit **on/off**.

Fiction: a sect does not keep the mountain defense array lit every day — that would bankrupt the spirit-stone vault. They keep it **ready**, then **activate** when threatened (raid, duel on the peak, tribulation splash, war).

| State | Meaning | Fuel | Integrity |
|-------|---------|------|-----------|
| **Laid / ready** | Pattern on the land, switch off | Little or none (standby) | Still neglects if ignored |
| **Active** | Switch on — doing its job | Draws fuel (arrays: a lot) | Same integrity rules |
| **Starved** | Switch on, tank empty | No effect until refueled | — |

**How you flip it**

| Control | Who / when | Notes |
|---------|------------|-------|
| **Switch** | At the anchor / array hall / residence console | Default: stand there and activate or shut down |
| **Command talisman** | Remote / emergency | Pre-bound to that pattern or array; burn or charge to flip from afar (leader away, sudden assault) |

Arrays cost **a lot** while active — that is intentional. Standby readiness is cheap; wartime light-up is the expensive moment. Small courtyard formations may default “on” for convenience once fueled, but the **same switch model** applies so players learn one rule before arrays.

**Design guard:** do not auto-activate grand defense on every world tick. Player (or delegated Array Disciple / elder standing order) chooses when to spend.

### Neglect = inscription integrity (lines fade, nodes decay)

**Neglect wears the diagram itself**, not the ward’s combat rating.

| Integrity | Fiction | Gameplay |
|-----------|---------|----------|
| **Sharp** | Lines clear, nodes bright | Full output when fueled |
| **Fading** | Lines blur, nodes dim | Same fuel rules, but output softens / fail chance on reinscribe rises; **visual** should show fade |
| **Decayed** | Nodes crack, pattern half-gone | Near-useless even if you pour fuel; needs **repair / reinscribe** |
| **Scattered** | Pattern gone from the land | Must lay again (cheaper than first lay if proficiency remembered) |

**Maintain** (labour, touch-up materials, elder/disciple duty) restores integrity. **Fuel** stocks the tank. **Activation** spends it. Paying stones into an empty tank does not repaint faded lines; painting lines does not fill the tank; a full tank does nothing until the switch is on.

Reincarnation **sect reclaim**: structures and laid patterns may persist; **fuel, integrity, and activation discipline are not waived**.

---

## Relationship to other systems

| System | Link |
|--------|------|
| [**Cultivation manuals**](cultivation-manuals-framework.md) | Essence methods need **Formation / Array / Condensate** fuel band; qi methods do not |
| [**Spiritual roots v2**](spiritual-roots-taxonomy-v2.md) | **Rite formations** — basin ascension, composition ascension, stabilise (grade/basin, not “delete element”) |
| [**Watershed pacing**](watershed-realms-lifespan-pacing.md) | Formations/pills as rare aids to cross talent ceiling |
| **Sect buildings** | Buildings = halls & staff; formations = **patterns on the land** at or under those sites |
| **Combat** | No field inscription; talismans & inscribed gear only |

### Rite formations (roots — separate bucket)

One-shot or rare **arrays** for fate shifts: +1 basin tier, capped composition step, breakthrough support. Consumed or burned out on success. Documented in roots taxonomy; **not** courtyard slot buffs.

---

## Pattern primitives (building blocks)

Finished formations are **recipes** of a few **primitives** — the “grammar” every diagram shares. Hybrids are not new magic; they combine primitives (and usually two **primary tags**) in one anchor.

### The eight primitives

| Primitive | What it does in fiction | Typical physical expression |
|-----------|-------------------------|----------------------------|
| **Sink** | Draw ambient qi/essence into the pattern | Outer gathering ring, inward-facing flags |
| **Channel** | Move power along a defined path | Lines between nodes, meridian traces |
| **Pool** | Concentrate power at a node (阵眼 / “eye”) | Central spirit stone, courtyard heart |
| **Seal** | Bind, stabilise, prevent leak or collapse | Corner locks, closure stroke, jade pins |
| **Ward** | Barrier outward — block, deflect, conceal | Perimeter square, mirror facing out |
| **Condense** | Compress gathered essence into storable form | Condensation plate, dew basin |
| **Trap** | Hold, delay, or cage (area or trigger) | Snare lines, closing loop |
| **Sever** | Cut, kill, or convert (lethal or harvest) | Kill zone, blood channel to pool |

**Design rule:** every blueprint lists `primitives`, `formationTier`, `formationGrade` (quality within tier), and optional `requiredComponents`. UI example: **“3rd-tier kill formation (peerless)”**.

### Formation tier (realm band)

**Tier** = what **cultivation band** the pattern is built to threaten. A 3rd-tier formation is aimed at **Golden Core**-band targets; it is not meant to reliably affect Nascent Soul+ without exceptions (below).

| Formation tier | Aligns to realm band (qi path) | Role |
|----------------|--------------------------------|------|
| **1st** | Qi Condensation | Tutorial gather, weak ward |
| **2nd** | Foundation Establishment | Residence/hall patterns; FE traps |
| **3rd** | Core Formation (Golden Core) | Kill or hard-control vs GC **in pattern** |
| **4th** | Nascent Soul | Sect-scale; NS traps (heavy prep) |
| **5th** | Void Refinement | Regional arrays |
| **6th** | Dao Seeking | Requires **dao / law components** |
| **7th** | Immortal Ascension | Dao/law + heaven materials; rite-adjacent |

### Formation grade (effectiveness *within* tier)

**Grade** = how well the diagram executes **within its tier** — same ladder as cultivation manual quality:

| Grade | Within-tier effect (example: 3rd-tier kill vs GC band) |
|-------|----------------------------------------------------------|
| **Crude** | Mostly **stymie** — slow, weaken, pin briefly; unlikely to kill a typical GC |
| **Common** | Credible threat to average GC in band |
| **Superior** | Strong kill/control vs most in band |
| **Peerless** | Kills **all but the strongest** Golden Cores in that tier’s variance band |

**Owner direction (2026-07-21):** Tier + grade split. *“Peerless 3rd-tier”* is the terrifying kill trap; *“crude 3rd-tier”* might only stop them for a while. **Stub for now** — full payoff when later realms have more **strength variance** within a band (early GC vs peak GC, foundation quality, etc.). Until then, grade can map to simple output % bands.

**Manual condition** (fragment, smudged, intact) stacks with grade: a fragment peerless manual might perform like superior until completed.

### Dao, law, and high-tier targets

At **6th tier+**, patterns need **dao or law** as necessary components — not optional.

| Component type | Fiction | Game role |
|----------------|---------|-----------|
| **Dao fragment** | Comprehended dao wired into a node | Pattern can affect dao-aligned targets |
| **Law shard / talisman** | Heaven law, sect relic | Stabilise vs transcendent targets |
| **Essence anchor** | Sun vein, moon pool, etc. | Essence-heavy tiers |

**Complexity** scales with tier + grade + hybrids. **Formation Master tier** (profession) caps **max formation tier** you can lay and pattern complexity.

### Power axes

| Axis | What it is | Drives |
|------|------------|--------|
| **Formation tier** | Realm band the pattern targets | 3rd-tier vs GC, not vs Immortal |
| **Formation grade** | Quality within that tier | Crude stymie vs peerless kill within band |
| **Master tier + blueprint proficiency** | Profession + per-diagram skill | Lay success, stability, % of grade ceiling |
| **Application mastery** *(stub)* | How well you **apply** patterns in the field | Natural/heavenly formations; above-tier tricks — see below |
| **Cultivator realm** | Body cultivation | Backlash, exam access, sustain |

### Above-tier effects (exceptions)

**Default:** tier matches target band; grade sets how hard you hit **within** band.

Occasional **above-tier** outcomes use **exceptions** — not a low-tier crude pattern solo-killing an Immortal:

| Exception | Plain language | Typical bump |
|-----------|----------------|--------------|
| **Stymie only** | Lower **tier** pattern inconveniences higher target; kill denied | — |
| **Array tier lift** | Several linked formations act as **one step higher tier** for one spring | **+1 tier** (e.g. two 2nd-tier nodes + link → behaves like 3rd-tier for activation) |
| **Vein / material overcharge** | Tap spirit vein or burn over-tier materials to **force more power through** a pattern for one activation | **+1 tier** for that spring, then pattern scatters or needs repair |
| **Target weakened** | Wounded, tribulation, suppressed | Lowers target’s **effective tier** for encounter |
| **Heaven rite array** | Story off-ladder patterns | Roots / ascension rites |

**What “+1” meant:** temporarily treat the formation as **one tier higher** than its blueprint — e.g. a **2nd-tier** kill ground with array lift **+1** hits like **3rd-tier** for that one spring. **Vein overcharge +1** is the same bump from **external fuel**, not from linking extra nodes.

**Open:** whether array lift and vein overcharge **both** apply in one spring (myth-tier only) or only one — owner TBD.

**Formation-master fantasy at parity:** 3rd-tier peerless kill ground vs Golden Cores; win via **lure + prep**, not tier mismatch.

### Application mastery & natural formations *(stub — needs tweaking)*

Separate from **Formation Master tier** (what tier blueprint you can **lay**):

**Application mastery** = how skilled you are at **using** formations in the real world — reading terrain, borrowing landscape, timing springs.

| Milestone *(names TBD)* | Fiction | Game hook |
|-------------------------|---------|-----------|
| **Inscribed patterns** | Flags, stones, drawn lines | Default — anchors on sect/residence |
| **Natural formation** *(name TBD)* | Mountains, rivers, forests **are** the array; you trace connections, not import materials | Unlock via high application mastery; site-specific; no portable blueprint |
| **Heavenly formation** *(name TBD)* | Mandate-scale — sky, thunder, ley lines | Endgame / rite-adjacent; extreme mastery + world event |

Owner lean: mastery unlocks **environment-as-formation**, not bypassing tier rules for free. A natural 3rd-tier still targets GC band — but you didn’t haul spirit stones; you **woke** the valley. Needs heavy design pass; stub only.

### Example compositions

| Blueprint | Tier | Grade *(stub)* | Primary | Notes |
|-----------|------|----------------|---------|-------|
| Spirit Gathering | 1st | common | Gather | v1 shipped |
| Qi Stabilizer | 2nd | common | Stabilise | FE-band |
| Iron Wall Ward | 2nd | common | Ward | Perimeter |
| Golden Core Slayer | 3rd | superior+ | Kill | Peerless → kills most GC; crude → mostly stymie |
| Blood Harvest | 3rd | superior | Gather + Kill | Hybrid |
| Dao Suppression Lattice | 6th | — | Trap + Ward | Dao component required |
| Sun Condensation Plate | 3rd | common | Condense | Essence site later |

**Arrays** reuse the same primitives at larger scale: more physical **anchors** (flags/stones), longer **Channels**, shared **Pools** between sub-formations.

---

## Formation Master (profession)

Being a formation master is **dedication**, not a side perk. Most cultivators **use** formations; fewer **inscribe** them. Profession **tier** gates max **formation tier** you may lay; **blueprint proficiency** gates how well you lay a specific diagram.

### Tracked axes (summary)

| Axis | What it measures | How it rises |
|------|------------------|--------------|
| **Master tier** | Max formation **tier** + complexity you can lay | Tier exams, FI |
| **Blueprint proficiency** | Skill on *one* diagram | Trace, lays, upkeep |
| **Formation tier** | Realm band pattern targets | Blueprint |
| **Formation grade** | Effectiveness within tier | Better manual, materials, annotation |
| **Application mastery** *(stub)* | Field skill — natural/heavenly use | Terrain wins, springs, rare teachings |
| **Cultivator realm** | Body cultivation | Backlash, exams |

**Formation Dao** (late game): hybrid **design** + legendary patterns — not the early profession ladder. UI: **Formation Master tier** or **Inscriber**.

### Master tier vs formation tier

| Master tier | Title (working) | Max formation tier | Complexity |
|-------------|-----------------|----------------------|------------|
| **0** | Uninitiated | — (hire only) | — |
| **1** | Pattern Student | 1st | ≤4 primitives |
| **2** | Inscriber | 2nd | Single primary |
| **3** | Formation Adept | 3rd | Talismans; simple hybrids |
| **4** | Array Disciple | 4th | Array assist; essence sites |
| **5** | Formation Master | 5th | Gear inscription; full hybrids |
| **6** | Array Master | 6th | Arrays + dao components |
| **7** | Grand Formationist | 7th | Rite-grade with law/heaven mats |

Promotion via **exam + FI** — lay standard pattern at current max **tier**.

### Tier advancement (not a comprehend button)

Promotion is a **trial**, not `+1 Formation Level`:

1. **Insight threshold** — enough **Formation Insight** (FI) from practice, lays, maintenance, assisted array work.
2. **Proof lay** — inscribe a **standard exam pattern** at a sect hall or borrowed anchor (materials + months; failure delays retry).
3. **Optional witness** — sect formation elder, or NPC master for rogue cultivators.

Failed exam: materials lost, cooldown. Success: **master tier** increases.

FI sources: trace sessions, successful first lays, months maintaining active patterns, repairing scattered patterns, array assistant duty, deciphering manuals.

---

## Hired inscription (always allowed)

No run has time to learn every pattern. **Hiring an outside formation master** to decipher, lay, or maintain is **always valid**.

| Who lays | Player gets | Player does not get |
|----------|-------------|---------------------|
| **Hired NPC** | Active pattern at NPC’s skill level; saves your months | FI, blueprint proficiency, master tier progress |
| **Self** | Proficiency + FI + full control | Time, materials, fail risk |

**Cost model:** stones + materials + months. Higher **formation tier** or secrecy → premium. 6th-tier work needs NPC **master tier ≥ 6** + dao access.

**Sect disciples (later):** in-house formation specialist = recurring salary vs one-off hire.

---

## Formation Master as primary path

Formations are a **viable main identity**, not a side job for every build.

| Cultivator main | Formation Master main |
|-----------------|----------------------|
| Realm + combat techniques first | Master tier + blueprint catalog first |
| Hires formations as needed | Cultivates enough realm to survive backlash; wins via traps, wards, arrays |
| Personal fight power | **Pattern power** — talismans, gear inscriptions, sprung kills |
| Sect = cultivate hall + income | Sect = **anchor network**, array hall, material pipeline |

**Whole playthrough fantasy:** at parity, **peerless 3rd-tier** kill ground vs Golden Cores who walk in; later **arrays**, **dao nodes**, **natural formations** (mastery stub). Reincarnation carries blueprints + sect array reclaim.

**Balance guardrails:** kill **above formation tier** needs **stacked exceptions** (stymie, array +1 tier, vein overcharge, wounded target). Within tier, **grade** sets crude stymie vs peerless kill.

---

## Learning a blueprint (pipeline)

**Problem:** looting a manual and instantly laying feels wrong. **Also wrong:** one global “Comprehend Formation +1” button.

**Solution:** manual → **diagram state** on shelf; **master tier + proficiency** gate real inscription.

### Pipeline stages

```
Acquire → Decipher → Trace (×N) → First Lay → Maintain → Master copy
```

| Stage | Player action | Time / cost | Outcome |
|-------|---------------|-------------|---------|
| **Acquire** | Loot, buy, sect grant, residence upgrade | — | Manual on **formation shelf** (separate from combat manuals) |
| **Decipher** | Study at library / formation hall / quarters | Months + optional stones | Readable diagram; **cannot lay** if master tier too low for blueprint **tier** |
| **Trace** | Practice on **sand table** or scrap anchor | 1–3 sessions: cheap mats + months each | Blueprint proficiency → “ready for first lay”; lowers first-lay fail chance |
| **First lay** | Real anchor, full `layCost` | Materials + months | On success: pattern active + proficiency tier 1; on fail: partial material loss, retry |
| **Maintain** | Pay upkeep each period | Recurring | Proficiency slowly rises; output approaches blueprint cap |
| **Master copy** | High proficiency on this blueprint | — | Lay faster, cheaper reinscribe, or +output band (per-diagram mastery reward) |

### What master tier gates vs what proficiency gates

| Action | Gated by |
|--------|----------|
| Decipher manual | Realm, sect access |
| Trace practice | Master tier ≥ 1 |
| First lay, 1st-tier formation | Master tier ≥ 2, proficiency ready |
| Lay 3rd-tier kill pattern | Master tier ≥ 3 |
| Essence formation at tagged site | Master tier ≥ 4 |
| Talisman | Master tier ≥ 3 + proficiency ≥ 2 |
| Inscribe gear | Master tier ≥ 5 |
| Hybrid / 6th-tier + dao | Master tier ≥ 6 |

### Manual types

| Type | Learning feel |
|------|----------------|
| **Complete diagram** | Full pipeline |
| **Fragment** | More trace sessions; missing grade ceiling until completed |
| **Copied / smudged** | Higher fail; lower effective **grade** within tier |
| **Sect inheritance** | Elder-traced starter; player still deciphers to maintain |

### v1 migration note

Current `learnOnResidenceLevel` auto-push to `knownFormations` is **bootstrap** (elder traces starter patterns). When F1 lands: manual to **formation shelf** + auto-decipher for master tier 1–2 tutorial, or elder lays first copy.

### Learn pipeline lean (2026-07-22 — owner OK thin path)

Full `Acquire → Decipher → Trace → First Lay` is the right **fantasy**; **F1b ships thin**.

**Owner OK (2026-07-22):**

1. **Thin F1b:** shelf + Decipher only; **skip Trace** until more blueprints exist.
2. **Decipher at residence** — not locked behind founding a sect. Quarters / personal dwelling is enough (later: optional residence expansions for a study desk / sand table — not required for F1b).
3. **Master grades 0–2:** use the existing ladder in this doc (below) as the rough unlock table; no exams in F1b — stub tier + soft gate only.
4. **Acquire + content:** see **F1b acquire & content** — needs a real second source of manuals or the shelf is just a rename.

Hire-an-NPC stays parked (always-allowed fantasy; UI later).

### Master grades 0–2 (what the doc already says)

From the profession table — **this is the rough unlock idea**; F1b only needs the first three rows stubbed:

| Master tier | Can lay (formation **tier**) | Matches current courtyard blueprints |
|-------------|------------------------------|--------------------------------------|
| **0** Uninitiated | Nothing self-laid (hire only later) | — |
| **1** Pattern Student | **1st**-tier | Spirit Gathering |
| **2** Inscriber | **2nd**-tier | Qi Stabilizer (and Iron Wall when implemented) |

**F1b stub lean (proposed, not coded):**

- New characters start **master tier 1** (or bump to 1 on first residence grant) so Spirit Gathering is not blocked.
- Residence grant for Qi Stabilizer also bumps master tier to **2** if below (elder teaching), **or** player must already be 2 — prefer auto-bump on grant so courtyard never soft-locks.
- Exams / FI / promotion UI → **F2**.

No need to invent new unlock fantasy for 0–2 until content outgrows “two courtyard patterns.”

### F1b acquire & content (elaboration)

**Problem:** today the only acquire path is `learnOnResidenceLevel` → instant `knownFormations`. A shelf with nothing to put on it is empty chrome.

**Acquire channels (pick for F1b / near-F1b):**

| Channel | Effort | Fiction | F1b fit |
|---------|--------|---------|---------|
| **A. Residence grant → shelf** | Low | Elder leaves a diagram when you upgrade quarters | **Must ship** — migrate existing grants onto shelf as `source: residence_grant`, `deciphered: true` (or auto-decipher on grant) |
| **B. Market / auction formation manuals** | Medium | Buy unread manuals with stones | Strong “second path” — 1–2 SKUs (e.g. smudged Spirit Gathering duplicate, or a third 1st-tier gather/ward stub) |
| **C. Explore / loot drop** | Medium | Rare manual in ruins / sealed sites | Flavorful; needs loot table hook |
| **D. Sect library copy** | Higher | Copy after founded | Fine later; conflicts with “decipher without sect” if it’s the *only* path |
| **E. Hire decipher** | Parked | Pay NPC to skip Decipher months | Matches hire fantasy; skip UI in F1b |

**Recommendation for F1b:**

1. **Migrate A** — all current known manuals become shelf entries; residence upgrades still grant, but write shelf rows (pre-deciphered).
2. **Add one B or C source** so Decipher is a real verb at least once — e.g. market sells **“Incomplete Spirit Diagram”** (unread, cheap, months to decipher) *or* a third blueprint stub (`mist_veil` conceal 1st-tier, residence-ok) sold unread.
3. Without **B or C**, ship shelf UI anyway but treat Decipher as latent until the next content drop — worse for playtest.

**Lay vs decipher without a sect:**

- **Decipher / shelf:** personal — works with residence (or a future pre-sect dwelling). Do **not** require `isSectFounded()`.
- **Lay at courtyard slots:** today requires founded sect + residence level. Keep that for F1b unless/until a wanderer “camp formation” anchor exists. So: you can **study** patterns as a wanderer; you **inscribe** them once you have quarters on sect grounds (or a later personal expansion).

**Content minimum so F1b feels real:**

| Item | Why |
|------|-----|
| Shelf panel on residence UI | See unread vs deciphered |
| Decipher action (months + small stone cost) | The verb |
| Master tier stub 0–2 + lay gate by formation tier | Soft profession |
| Migrate residence grants | No soft-lock |
| **One unread acquire** (market or loot) | Otherwise Decipher is dead UI |

Trace, fragments, exams, hire UI → later.

---

## Player state (proposal)

```js
G.formationMaster = {
  tier: 0,                    // profession tier 0–7; caps layable formation tier
  insight: 0,
  applicationMastery: 0,      // stub — natural/heavenly formations
  lastExamMonth: null,
  examCooldownMonths: 6
};

G.formationShelf = {
  spirit_gathering: {
    source: 'residence_grant',
    formationTier: 1,
    formationGrade: 'common',   // crude | common | superior | peerless
    manualCondition: 'intact',
    deciphered: true,
    proficiency: 2,
    traceSessionsDone: 2,
    totalMaintainMonths: 8
  }
};

G.knownFormations = [];       // derive from shelf + master tier (F1b)
// F1a slot shape (migrates legacy string ids on load):
G.sect.residence.formations.slots = [
  // null | { id, active, fuel, integrity, scattered }
];
```

---

## Shipped today

| Piece | Location |
|-------|----------|
| Residence slots 0→1→2→3 | `SECT_RESIDENCE.formationSlotsByLevel` in `data.js` |
| Spirit Gathering, Qi Stabilizer | `FORMATIONS` in `data.js` |
| Iron Wall Ward | Stub (`implemented: false`) |
| Lay / clear / cultivate at quarters | `formations.js`, `sect-map.js` |
| **F1a fuel / switch / integrity** | Slot objects; `tickResidenceFormations`; Activate / fuel / Maintain UI |
| Save keys | `G.knownFormations`, `G.sect.residence.formations.slots` (objects) |

**Still gaps:** command talisman (designed, not coded), shelf/decipher (F1b), anchors beyond residence, equipment/talisman, arrays, essence tags, hybrids, formation master ranks (residence level auto-grants manuals — **bootstrap only**).

---

## Implementation phases (suggested)

| Phase | Scope |
|-------|-------|
| **F0** *(shipped)* | Residence qi formations, lay cost, cultivate-at-quarters hook |
| **F1a** *(building)* | Fuel + activation switch + inscription integrity; residence patterns first |
| **F1b** | Formation shelf + decipher (trace optional); master grade 0–2 |
| **F2** | Sect anchor nodes; master grade 3–4; grade exams |
| **F3** | Essence gather + site tags (with cultivation methods P3) |
| **F4** | Arrays — multi-formation sect scale, condensate; Array Disciple duties |
| **F5** | Equipment + talisman deploy (master grade 5+) |
| **F6** | Hybrids + Formation Dao design; guild/market anchors; grand arrays |

---

## Prerequisites

- [ ] Owner OK: anchors vs free placement ( **anchors** — owner 2026-07-21 )
- [ ] Owner OK: formation vs building bonus split (avoid duplicate cultivate %)
- [ ] Cultivation methods P0–P2 for qi track before essence formations
- [x] Hire outside masters — always OK (owner 2026-07-21)
- [x] Formation grade realm-aligned (1st = QC band, 3rd = GC band); no peerless tier (owner 2026-07-21)
- [x] Master grade caps layable formation grade + complexity; dao/law components for 6th+ (owner 2026-07-21)
- [ ] Owner OK: above-grade exception table (stacking rules for array +1, overcharge, stymie-only)
- [ ] Owner OK: eight primitives (sink, channel, pool, seal, ward, condense, trap, sever)
- [ ] Owner OK: master grade ladder (0–7) aligned to max layable formation grade
- [x] Fuel required to run when active; no fuel = starved (owner 2026-07-22)
- [x] Neglect = inscription integrity (fade/decay), **not** defensive hit-HP (owner 2026-07-22)
- [x] Activation switch — laid ≠ running; arrays expensive while on (owner 2026-07-22)
- [x] Command talisman for remote / emergency flip (owner 2026-07-22)
- [x] Learn pipeline thin path — F1b = shelf + decipher; Trace later (owner 2026-07-22)
- [x] Decipher at residence / personal dwelling — not gated on founding a sect (owner 2026-07-22)
- [x] Master 0–2 unlocks = existing table (1st / 2nd formation tier); stub only in F1b, exams in F2
- [ ] Owner OK: F1b second acquire — market unread manual vs loot vs shelf-only + latent Decipher
- [ ] Owner OK: third blueprint stub for unread acquire, or reuse smudged Spirit Gathering
- [ ] Owner OK: use-scaled fuel drain (later) vs flat draw while active only
- [ ] Upkeep economy tuning with [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md)

## Open questions

- **F1b unread source:** market SKU, explore loot, or defer real Decipher until more content?
- **Third courtyard pattern?** Small 1st-tier (mist/conceal) vs “smudged copy of Spirit Gathering” only
- **Wanderer lay:** keep lay-behind-sect for F1b, or allow a camp/personal slot later?
- **Standby cost:** true zero fuel when off, or a tiny “keep the eye warm” sip so arrays feel alive?
- **Command talisman:** one-shot burn vs rechargeable seal; who can craft (master grade)?
- **Standing orders:** can an Array Disciple auto-activate on raid alert, or always player confirm for grand defense?
- **Use-scaled fuel:** flat draw while active for F1, or already sip more when a ward actually blocks / gather runs?
- **Defense ceiling:** express “what it can normally block” purely as formation tier/grade vs attacker realm, or also event tags?
- **Integrity UI:** text state only vs map/SVG line fade (lines/nodes) — when does visual fade ship?
- **Insight curve:** FI per trace session vs per maintained month — tune in playtest
- **Exam patterns:** one global “standard array” per rank or sect-specific variants?
- **Hire pricing:** flat fee vs % of formation grade + secrecy premium
- **Above-grade stacking:** max +1 effective grade from arrays, or +1 from overcharge — both stackable or pick one?
- **Stymie duration:** how long can 2nd-grade pin inconvenience a 4th-grade target?
- **Dao component source:** player dao track only, or lootable fragments / sect relics?
- **Dual profession:** Full formation master run vs cultivator who dabbles — same grades, slower FI?
- **Equipment charges:** per-item durability vs shared inscription fatigue?
- **Array composition UI:** explicit node graph vs abstract array level + type?
- **Iron Wall Ward:** residence slot vs sect perimeter node?
- **Formation Dao unlock:** separate from master grade 7, or grade 7 gates entry to Dao track?
- **Grand array:** story-only vs playable late-game

## Implementation crumbs

- `formations.js` — extend for shelf, decipher/trace, master grade gates, upkeep
- `techniques.js` — `comprehendManual` / shelf patterns to **clone UI**, not merge pools
- `data.js` — `FORMATIONS`, `SECT_RESIDENCE`, `SECT_BUILDINGS`, `SECT_MAP_NODES`
- `sect-map.js` — residence UI; future anchor picker
- [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md) — essence fuel, condensate, array save shape `G.sect.arrays`
- [`spiritual-roots-taxonomy-v2.md`](spiritual-roots-taxonomy-v2.md) — rite formation IDs and outcomes
