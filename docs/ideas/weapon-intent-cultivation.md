# Weapon Intent — cultivation loop (redesign)

| Field | Value |
|-------|-------|
| **Status** | `designed` (parked — owner 2026-08-01) |
| **Blocked on** | Redwell / starter slice first; no build Issue |
| **Issue** | none yet |
| **Chat / PR** | Intent planning — [PR #91](https://github.com/WanderingImmortal/tales-immortal-path/pull/91) · sister work [PR #95](https://github.com/WanderingImmortal/tales-immortal-path/pull/95) (awakening + Demon Cult life) |
| **Updated** | 2026-08-01 (playable slice scoped to intent realms 1–2) |

## Intent

Intent should grow **alongside cultivation** — not a side minigame you tick once at Foundation. It is a comprehension you **awaken**, **deepen** through lived practice, **expand** into named expressions, and **break through** into higher intent realms as your main realm rises.

**Owner lock (2026-08-01):** retire **Deepen *or* Expand** at each breakpoint. New loop: **deepen within the band → at 100% you are ripe → Expand ceremony breaks you into the next intent realm** (cultivation + comprehension gates required). **Expand is not a separate step before realm-up** — it *is* the realm-up. Keeps every deepen milestone **and** every expand art — nothing thrown away.

Sister docs:

| Doc | Job |
|-----|-----|
| [`combat-damage-depth.md`](combat-damage-depth.md) | How intent **expresses** in hits (cross-wield, Circle, Sword vs Blade) |
| [`weapon-intent-awakening.md`](weapon-intent-awakening.md) *(PR #95)* | How intent is **born** — groundwork + spark, no weapon picker |
| [`devouring-intent.md`](devouring-intent.md) *(PR #95)* | Deviant track template — intent realms, gates, cult life |
| [`heavenly-demon-cult-life.md`](heavenly-demon-cult-life.md) *(PR #95)* | Sect life × realm × intent spine (copy pattern for Sword Sect, etc.) |
| [`intent-track-template.md`](intent-track-template.md) | **Copy this** for new tracks — shared engine, fill-in slots |

> **Planning only.** Existing `intent.js` deepen/expand fork and weapon picker may be **rewritten** when this ships.

---

## How xianxia handles intent — and what that means for us

Genre note: **意** in novels is deliberately fuzzy — “will made manifest,” not a stat block. We pick **expressions players can feel** (combat shape, logs, sect life) and accept that cosmic intent will stay partly mysterious until Law / Domain tiers.

### What novels usually do

| Pattern | What it looks like in fiction | Game job |
|---------|------------------------------|----------|
| **Learn vs realize** | Manual teaches the *move*; intent is *understood* — “you can copy the form, not the soul” | Techniques from syllabus; intent from **awakening + ripening** |
| **Walk the path first** | Carry the sword, live as a sword cultivator, lose yourself in the weight — *then* something stirs | **Groundwork** before spark ([`weapon-intent-awakening.md`](weapon-intent-awakening.md)) |
| **Spark / epiphany** | Treasure, relic, near-death, witnessing an apex duel, inheritance ground | **Awakening** — not a menu pick |
| **Battle comprehension** | Life-or-death fights sharpen intent; worthy opponents matter | Combat saturation **chunks** |
| **Sitting comprehension** | Meditate with blade, merge qi and mind, months in grotto | **Meditate-with-weapon** cultivate mode |
| **Drilling** | Ten thousand strikes — boring on page, *felt* as time passing | **Passive drip** + soft cap (time alone isn’t enough) |
| **Inheritance environment** | Sword sect valley, demon grotto, elder drills | **Sect life** boost table ([`heavenly-demon-cult-life.md`](heavenly-demon-cult-life.md)) |
| **Stages** | 初意 → 小成 → 大成 → 圆满 → 意境 (sprout → minor → major → perfection → domain) | **Intent realms** + automatic deepen milestones |
| **New face at each stage** | Intent “shows” differently — phantom sword, killing pressure, domain | **Expand** arts (Returning Edge, Maw Domain, …) |
| **Realm coupling** | Can’t hold apex intent in a weak vessel | Intent **sleeps** off dantian path; breakthrough needs cultivation band |
| **Divided heart** | Two intents / wrong path → progress halts or splits | Divided heart slower; cross-wield awkward until deep |
| **Intent clash** | Stronger intent suppresses weaker without swinging | Future: morale, flee, tribulation — not v1 |
| **Setback** | Intent injury, shattered comprehension | Parked — scars / limbo later |

### What we had vs what genre wants

| Shipped / old design | Xianxia read | Adaptation |
|----------------------|--------------|------------|
| Weapon picker at FE | “I chose Sword on a character sheet” | **Groundwork + spark** (PR #95) |
| Uses → tier only | Fighting helps, but not the whole story | Uses = **one boost channel** inside saturation |
| Refine Intent button | “I spent months” without living differently | **Ripening meter** — same months, different *activities* fill it |
| Deepen **or** Expand | Fork isn’t in novels — you deepen *until* a new manifestation appears | **Deepen milestones → Expand at band cap** |
| Expand on basics only | Intent should color *everything* you do at high depth | Expression + expand tint **techniques** ([`combat-damage-depth.md`](combat-damage-depth.md)) |
| Intent separate from sect | Great sects *train* crown comprehensions over decades | Rank × realm life doc; drills feed saturation |

### Proposed game adaptation (keeps saturation)

Think of intent growth as **three layers** the player never names — one hidden ripening bar represents all of them:

```text
1. WALK    — passive drip, carried weapon, sect posting, manual alignment
2. WIELD   — fights, spars, missions (big chunks)
3. REALIZE — sparks, witness beats, expand ceremony, realm breakthrough
```

**Walk** alone hits ~70% (you’re living the shape). **Wield** pushes you through the band. **Realize** is the punctuation — awaken, expand, break into next intent realm.

That maps cleanly onto xianxia: years of walking the path, punctuated by fights and epiphanies, capped by what your cultivation vessel can hold.

### What we should *not* copy from novels

| Trope | Why skip or soften in a game |
|-------|------------------------------|
| Pure author fiat | Player needs **readable** progress (bar, hints, next milestone) |
| Infinite grind, no UI | Soft cap + boosts so decades feel directed |
| Intent solves everything | Techniques, realm, gear still matter — intent **tints** and **rewards** |
| Instant max from one treasure | Spark **opens** the track; saturation **fills** it |

### Open synthesis (owner 2026-08-01)

**Hidden ripening** — saturation meter exists in code but **not shown as a bar**. Player reads progress through **qi chamber feel**, logs, combat expression, sect reactions. Keeps xianxia mystery without losing steerability for designers.

Saturation + soft cap + realize beats **still the model**; only the **UI** changes.

Alternatives if playtest says otherwise:

- **Dual meters** — Walk + Wield both required — more sim, more UI
- **Event-only deepen** — no drip — harsher

---

## What’s wrong today

| Today | Problem |
|-------|---------|
| Weapon **picker** at FE | Feels like a class select, not xianxia awakening |
| **Deepen or Expand** fork | Throws away half the design at every tier |
| Uses from **combat only** | Thin loop — one `refineActiveIntent` action, not a life path |
| **Refine / Deepen buttons** | “Spend 3 months to deepen” is **meh** — another menu tick, not a life system |
| Tier names tied to **use count only** | Intent can outrun or lag cultivation realm with no story |
| Expand arts on **basics only** | Techniques don’t inherit your expression |

---

## New loop (plain language)

```text
Awaken (spark + groundwork) → Intent Realm 1 (Sprout)
  → Ripen: auto deepen milestones at ~35% / ~70%
  → 100% = ripe (inward: “a new face wants to be born”)
  → Expand ceremony → Intent Realm 2 (Minor Success) + that realm’s expand art + realm package
  → Ripen in Realm 2… repeat until Domain
```

**Deepen** = *the intent gets truer inside you while you stay in this realm* — milestones at 35 / 70; 100% means **ready**, not “already promoted.”

**Expand** = *breakthrough into the next intent realm* — one deliberate ceremony. Grants **realm promotion**, the **named expression** for the realm you enter, and that realm’s mechanical package (expression rewrite tier, synergy rules, etc.). Not a capstone you collect *before* leveling intent.

You earn deepen milestones **in** realm N; you earn the expand art **on entering** realm N+1.

**Owner lock (2026-08-01):** **Deepen is not an action button.** It is a **meter that fills while you live your path**, with spikes from choices that matter. The player watches intent ripen — they don’t hammer “Deepen” every few months.

---

## Deepen without a Deepen button — **Intent Saturation** (hidden)

Working name: **Intent Saturation** (意熟 · “the intent is ripening”). One **hidden** meter per intent realm band (0 → 100%). Milestone deepen steps fire automatically at thresholds (e.g. 35 / 70 / 100). Player never sees “67%.”

### Root vs will — two layers (owner lock 2026-08-01)

**Intent is not root flavoring.** Roots are **congenital** — how your qi *naturally* runs (metal sharp, wood supple, fire hot). **Intent is imposed will** — you **force** a shape onto circulation through comprehension. Same dantian; two readings.

| Layer | What it is | Chamber line type |
|-------|------------|-------------------|
| **Root** | Born with it | *“Metal root — your qi runs naturally sharp.”* |
| **Will (intent)** | Chosen / awakened comprehension | *“Within you, sword-will sits **imposed** on the flow — an edge held against the water.”* |

When root and intent **align** (sword root + sword intent): inward read notes **harmony** — will rides easily. When they **clash** (earth root + sword intent): inward read notes **strain** — will still works, but circulation pulls two ways until depth smooths it. Cross-wield fiction lives here too.

**Do not** describe intent ripening as “your qi got sharper” without the **imposed will** frame — that sounds like root. Say: *“The sword-will you carry has settled deeper”* / *“Your imposed line holds longer when you circulate.”*

### Inward signs vs outward tells

Player needs to know intent **depth** without a progress bar. Split **who can see what**:

| Read | Who | When | v1 |
|------|-----|------|-----|
| **Inward sign** | **You only** — meditating, gathering, circulating in chamber | Qi chamber **self-perception** block | **Yes** — primary feedback |
| **Outward tell** | Others — elders, rivals, spiritual sense | Duels, sect halls, story | **Parked** — not shown to player by default in v1 |
| **Concealment** | You hide outward tell while keeping inward truth | Arrays, techniques, scheming | **Way later** — [`spiritual-sense-cultivation-reading.md`](spiritual-sense-cultivation-reading.md), formation wards |

**v1 rule:** chamber shows **what you perceive within yourself**. It does **not** say *“Others would read you as Minor Success.”* That arrives with spiritual sense / NPC probe later. Player learns their depth from **inner sensation**, combat expression, milestone logs — not a public rating.

### Dantian vs wielded — where will lives

| Where | What happens |
|-------|----------------|
| **Dantian (inward)** | Will **pressed into** stored qi while you cultivate — you feel it when circulating. Root-colored base + imposed shape **layered on top**. |
| **Wielded (outward action)** | Will **released** — cut, thrust, siphon. What combat expression uses. |
| **Domain (apex)** | Will **leaks** — outward tell becomes hard to hide (future concealment tier) |

Intent does not rewrite foundation or root. It is a **comprehension sitting in the dantian** that colors how you release qi.

### Hidden feedback — qi chamber **inward read**

Primary ripening UI: a dedicated **Within yourself** block on the qi chamber (or post-gather flavor line) — separate from root display and density numbers.

**Chamber layout (draft):**

| Block | Source | Example |
|-------|--------|---------|
| **Root** | `spiritualRoots` / nature | *Metal root — qi runs sharp by nature.* |
| **Density** | mechanical + viscosity flavor | *1.42 · flows like warmed mercury* |
| **Within yourself** | hidden saturation + active intent | *Sword-will imposed on your circulation — still shallow, but the edge is real when you look inward.* |
| *(not in v1)* **Outward tell** | — | hidden until sense / probe systems |

**Do not show:** saturation %, tier names on the inward block (optional subtle realm name on intent screen only).

#### Inward signs — Sword will (draft)

Language pattern: **imposed will + how settled it feels** — not “your qi is sharp.”

| Hidden band | **Within yourself** (player-only) |
|-------------|-----------------------------------|
| Groundwork, not awakened | *Holding a blade, you feel the **shape you want** — will not yet imposed.* |
| Awakened · low | *Sword-will **sits on** your circulation — thin, but when you look inward the edge is there.* |
| Mid ripening | *The imposed line **holds** through a full cycle; root and will not yet one thing, but they stop fighting.* |
| High ripening | *Within, every pulse wants to **exit as a cut**; you feel how deep the will has settled.* |
| Ripe (100%, gates pending) | *The will has **one shape** it wants to show — you are ready to break through.* |
| After Expand → Realm 2 | *Inward, you feel **two edges** in the same will — imposed line and returning line.* |

Parallel tables: Spear (*imposed thrust*), Blade (*imposed weight*), Staff Circle (*imposed ring*), Devouring (*imposed claim*).

#### What still surfaces elsewhere (v1)

| Channel | Inward or action |
|---------|------------------|
| **Milestone log** | *“Sword-will deepens — the imposed line clarifies.”* |
| **Combat** | Expression when wielding (*palm lands as cut*) |
| **Intent screen** | Track name, arts owned — minimal |
| **NPC / sense** *(later)* | Outward tell — *“He carries sword intent, Minor Success at least.”* |

### What the player sees (summary)

- **Qi chamber** — root (nature) + density + **Within yourself** (intent depth, inward only)
- **No** outward tell in v1 UI; **no** ripening bar
- **Expand** — inward nudge at band cap, then short ceremony

No deepen button. Hidden meter still drives milestones behind the inward-read text swaps.

### Passive fill (always on, slow)

While awakened + on the dantian path + this intent is **active** (or recently used):

| Drip | Rate feel |
|------|-----------|
| **Time** | Slow months drip — intent ripens like roots in winter |
| **Carried weapon** | Faster if inventory matches intent shape (sword intent + sword equipped) |
| **Foundation / manual alignment** | Small mult if lineage matches (sword sect canon + sword intent) |

**Soft cap (draft):** passive drip alone tops out around **~60–70%** per band. To finish the band you need at least one **engaging** boost source below. Prevents AFK decades to max intent without playing.

### Engaging boosts (player choices, not a deepen click)

These add **chunks** to saturation — the fun part is stacking and choosing how to invest months:

| Boost | When | Feel |
|-------|------|------|
| **Fight with active intent** | Combat, explore elites, duels | Biggest steady chunk — intent is *wielded* |
| **Meditate with weapon** | Cultivate / chamber **mode** — not a separate intent button | Sit with the blade; ties intent to main cultivate loop |
| **Worthy spar** | NPC duel, sect hall, cult lethal spar | Spike + story |
| **Witness / enlightenment** | Apex duel, story beat | One-time lump (awakening-adjacent) |
| **Sect training** | Sword sect drill month, cult hunt board | Faction life feeds crown art |
| **Manual layer milestone** | Comprehend canon chapter | Syllabus and intent grow together |
| **Seclusion** *(optional one action)* | Multi-month retreat — **high burst**, cooldown | Rare “I’m focusing my will” without making every deepen a button |

**Devouring variant:** sanctioned cultivator kills, feast rites, Layer 2 refine loop — same meter, different boost table ([`devouring-intent.md`](devouring-intent.md)).

### Milestones (automatic deepen)

When saturation crosses a threshold → **deepen step unlocks in log + stats** — no player fork.

| Saturation | Example (Sword Realm 1) |
|------------|-------------------------|
| **35%** | +expression efficiency; faint cross-wield on palm |
| **70%** | Cross-wield palm reads as cut more often; +basics |
| **100%** | Band **ripe** — inward nudge; **Expand ceremony** available when cultivation + comprehension gates pass |

After Expand, you are in the **next intent realm**, saturation **resets to 0** for that band, and the expand art for the realm you entered is yours.

### Expand — breakthrough into the next intent realm (owner lock 2026-08-01)

**Expand = realm-up.** One deliberate ceremony — not a grind button, not a separate reward before promotion.

**Gates (all required):**

| Gate | Role |
|------|------|
| **100% saturation** in current intent realm | Comprehension is ripe |
| **Cultivation band** | Vessel can hold the next intent (e.g. GC for Realm 2) |
| **Comprehension beat** | Story / sect / witness — not meter alone |

**On Expand (single beat):**

1. **Intent realm +1** (Sprout → Minor Success, …)
2. **Expand art** for the realm you **enter** (e.g. Returning Edge when entering Minor Success)
3. **Realm package** — mechanical identity of the new tier (see table below)
4. Log + optional 1–3 month ceremony (sect elder, seclude)
5. Saturation resets; new inward-sign band for the new realm

**Fiction:** *“Your sword-will breaks into Minor Success — Returning Edge awakens as the intent shows its second face.”* One moment, not two.

**Stuck at 100%:** ripeness without gates = inward line says *“the will is ready; your cultivation cannot hold more yet”* (or missing comprehension beat). Player keeps fighting; no fake expand.

### What we retire

| Today | Replace with |
|-------|----------------|
| `refineActiveIntent` button | Saturation drip + meditate-with-weapon cultivate mode |
| `makeIntentChoice('deepen')` | Auto milestone at saturation % |
| `makeIntentChoice('expand')` | 100% ripe + gates → **Expand ceremony** (realm-up + art) |
| Uses → tier index only | Combat still adds saturation chunk; tier gates need realm + beat |

`intentRefine` months action can become **Seclusion** (optional burst) or vanish entirely if meditate-mode covers it.

### Why this is more fun

| Button deepen | Saturation deepen |
|---------------|-------------------|
| Same every time | Different months feel different (hunt month vs drill vs seclude) |
| Menu hygiene | Intent grows while you play the game you already play |
| Ignored system | Glance at bar — “I’m close to Expand” |
| Passive OK | Passive to ~70%, then nudge toward spar / sect / meditate |

---

## Intent realms × cultivation realms

Intent has its **own** realm ladder (comprehensions), but each step is **gated by** your main cultivation band. Weapon tracks can keep orthodox tier names; deviant tracks (Devouring) keep cult names — **same structure**.

| Intent realm | Weapon names (draft) | Typical cultivation | What changes |
|--------------|----------------------|---------------------|--------------|
| **1st** | Sprout / Stirring | Foundation Establishment | Intent awakens; expression weak |
| **2nd** | Minor Success / Taking | Golden Core | Expression rewrites mismatched arts |
| **3rd** | Major Success / Feast | **Nascent Soul → Deity Transformation** | Spans 2 cultivation realms |
| **4th** | Perfection / Surfeit | **Void Refinement → Dao Seeking** | Dao may open or fail; intent keeps sharpening |
| **5th** | Intent Domain | **Late Seeking / Void apex** (dao-blocked builds) | Self-Will peak — competes with Dao Manifestation in duels ([`intent-apex-self-will.md`](intent-apex-self-will.md)) |

**Not parallel:** later intent realms deliberately **stretch** across cultivation bands so apex will can match Manifestation weight without mirroring every breakthrough.

**Prodigy bypass:** break intent realm **before** cultivation realm if gates are met (FE Taking, etc.) — rare, loud, from [`devouring-intent.md`](devouring-intent.md).

**Ceiling:** you cannot **break through** to Intent Realm 2 while still QC. Intent **sleeps** off the dantian path (keep today’s rule).

---

## Intent Realm 1 — Sprout (what it should be)

**Design target** for first intent level — Sword as worked example; other tracks swap voice + expand art. Replaces today’s thin “+0% and a flat +10 on basics.”

### What Sprout usually is in xianxia

Not power — **first honesty between will and qi.**

| Fiction beat | Meaning |
|--------------|---------|
| **意初生** — intent first born | Will is no longer generic; it has a **shape** (line, thrust, ring…) |
| **Self-known** | *You* feel it when circulating — not others (yet) |
| **Form truer** | Matching arts **form cleaner**; wrong-path arts feel **slightly wrong** |
| **Strike focused** | Basics aren’t bigger — they’re **more directed** (one line, not scattered qi) |
| **Not yet domain** | No pressure field, no phantom army, no legislation |

**One line:** Sprout is *“I have imposed a will, and I can feel it when I look inward.”* Not *“I am stronger.”*

### Gameplay pillars (adaptation)

| Pillar | Player feel | Avoid |
|--------|-------------|-------|
| **Recognition** | Chamber **Within yourself** line appears on awaken | +0% label with no fiction |
| **Focus** | Basics **read different** (log + small mechanical identity) | Huge damage spike |
| **Formation** | Sword arts **less punishing** at shallow will; true synergy waits for Realm 2 | Hard 72% brick on all high arts |
| **Seed** | Hidden ripening + milestones → **ripe at 100%** → Expand into Realm 2 | Expand art on day one |

**Sprout is the whole first intent realm** (awaken → ripen → **ready at 100%**). **Returning Edge belongs to Realm 2** — you get it when Expand promotes you to Minor Success, not while still Sprout.

---

### Sword Sprout — fiction → mechanics (draft)

#### On awaken (spark + groundwork)

| Deliver | Detail |
|---------|--------|
| Track opens | Sword intent, Realm 1, saturation 0% |
| Log | *“Sword-will settles on your circulation — thin, but real when you look inward.”* |
| Chamber | **Within yourself** line unlocks (updates as saturation rises) |
| Combat | Basics log changes from generic qi blast → **line-flavored** (see below) |

No Returning Edge yet. No outward tell (NPCs don’t read you).

#### While ripening in Sprout (hidden saturation)

| Hidden band | Inward (chamber) | Combat / formation |
|-------------|------------------|---------------------|
| **Low** | *Imposed line sits on the flow — shallow.* | Basics: **Focused Line** — small flat bonus **or** +precision vs same-realm trash (pick one in tuning) |
| **~35%** milestone | *The line **holds** one full circulation.* | **Formation I** — high sword arts at wrong stage: penalty softened (e.g. 72% → **85%**), still warn *“forms weakly”* |
| **~70%** milestone | *Every pulse wants to exit straight.* | **Expression preview** — cross-wield palm gets **flavor log** + tiny slash stress splash (when damage system exists); no full rewrite |
| **100%** | *A new face presses to be born — you are **ripe**.* | **No art yet.** Expand ceremony → **Minor Success** + Returning Edge (when gates pass) |

Passive drip + fights + meditate-with-weapon fill the band. Soft cap ~70% without engagement.

#### Basics at Sprout (Sword) — replace today’s flat chunk

Today: `+(8 + realmIdx×2)` with no identity.

**Target:**

| Element | Sprout behavior |
|---------|-----------------|
| **Log** | *“Qi carries a sword-line.”* (not “Qi blast!”) |
| **Damage** | **Modest** — same ballpark as today or slightly lower flat; power is **focus**, not scale |
| **Optional hook** | +small bonus vs **same or lower realm** fodder (*prey sense seed*) — Devouring Stirring parallel |
| **Guard** | No Returning Edge until **Expand → Minor Success** |

#### Techniques at Sprout

| Case | Sprout behavior |
|------|-----------------|
| **High art, Sword req, need Realm 2+** | **Forms at reduced power** — softened penalty + UI *“Sword-will too shallow — art forms weakly.”* |
| **Low/mid sword-tagged art** | Small synergy if Sword active (+3–6% band) |
| **Wrong weapon art** | Usable; no expression rewrite (Realm 2 job) |

Realm 2 (Minor Success) is when **expression rewrite** and real synergy kick in. Sprout is **formation**, not mastery.

#### What Sprout does **not** do

- No expand arts while still Sprout (Returning Edge unlocks **on entering** Realm 2)
- No NPC intent read, no spiritual sense tier reveal
- No Self-Will, no domain pressure
- No chamber change to **root** or density numbers — only **Within yourself** + optional basics flavor

---

### Other tracks — one-line Sprout identity

| Track | Sprout inward | Sprout combat seed |
|-------|---------------|-------------------|
| **Blade** | *Imposed weight on the flow — shallow.* | Basics lean **bleed-flavor** log; wounded bonus seed |
| **Spear** | *Imposed thrust on the flow — shallow.* | Basics **linear** log; guard interaction seed at 70% |
| **Fist** | *Imposed shock on the flow — shallow.* | Concussive log; slow seed at 70% |
| **Staff (Circle)** | *Imposed ring on the flow — shallow.* | **Circulating** log; defend synergy seed |
| **Devouring** | *Imposed claim on the flow — shallow.* | **Prey sense** + conversion seed ([`devouring-intent.md`](devouring-intent.md)) |

Same milestone structure; swap copy. **100% Expand art** is always the **first art of the realm you enter** (Realm 2 for first Expand).

---

### vs shipped game today

| Today (Sprout) | Target (Realm 1 Sprout) |
|----------------|-------------------------|
| Weapon picker awaken | Spark + groundwork |
| +0% tier, flat basic chunk | Focused basics + inward line |
| 72% hard fail on high arts | Softened formation + warning |
| No fiction | Chamber + combat logs |
| Expand at 10 uses / tier break | Expand at **100% + gates** = **realm-up** + art |
| Refine button | Meditate-with-weapon + live path |

**v1 slice order:** see [Playable slice — realms 1–2 only](#playable-slice--realms-1-2-only-owner-scope). Do **not** block on realms 3–5 or combat damage depth.

---

Each intent realm has:

| Piece | Count (draft) | Player feel |
|-------|---------------|-------------|
| **Deepen milestones** | 2 at 35 / 70 (100% = ripe, not a third deepen) | Automatic — “My sword intent sharpened.” |
| **Expand ceremony** | 1 per realm transition (×4 total to Domain) | “I broke into Minor Success — Returning Edge awakens.” |
| **Comprehension beat** | 1 per transition (paired with Expand gates) | Story / sect — not meter alone |

### Example — Sword intent @ FE → GC

| Phase | What happens |
|-------|----------------|
| Awaken | Realm 1 Sprout, saturation 0% |
| **35%** | Deepen 1 — formation soften on high arts |
| **70%** | Deepen 2 — cross-wield preview |
| **100%** | Ripe — inward: *“a new face wants to be born”* |
| *gates* | GC stable + comprehension beat (e.g. First Edge) |
| **Expand** | → **Realm 2 Minor Success** + **Returning Edge** + expression rewrite tier |

Player might hit 100% Sprout in year 40 or year 120 — but cannot Expand until GC + beat. Hitting gates before 100% means living the path until ripe.

Next band: ripen in Minor Success → Expand → Major Success + **Blade Pressure**. Then **Edge Domain** on entering Perfection; apex **Intent Domain** on final Expand (manifestation line + Self-Will path — see [`intent-apex-self-will.md`](intent-apex-self-will.md)).

---

## What Expand unlocks (review)

**Rule:** Expand art is granted **on entering** the destination realm, not while finishing the previous one. Four Expand ceremonies (Realm 1→2 … 4→5). Realm 1 (Sprout) has **no** expand art — only awaken + ripen.

Each Expand bundles three things:

| Bundle piece | Example (Sword, Sprout → Minor Success) |
|--------------|----------------------------------------|
| **Realm promotion** | Sprout → Minor Success (+tier bonus, UI name) |
| **Named expand art** | Returning Edge |
| **Realm package** | Expression rewrite tier, synergy rules, inward-sign band |

### Realm packages (shared engine, Sword voice)

| Entering realm | Tier bonus (draft) | Realm package (what changes beyond the art) |
|----------------|-------------------|---------------------------------------------|
| **1 Sprout** | +0% | Awaken only — focused basics, formation soften at milestones, no expand art |
| **2 Minor Success** | +10% | **Expression rewrite** on cross-wield; high arts at full synergy; expand art **strike** role |
| **3 Major Success** | +20% | Stronger rewrite; technique synergy band widens; expand art **pressure** role |
| **4 Perfection** | +35% | Near-signature expression; expand art **domain** role on basics |
| **5 Intent Domain** | +50% | Manifestation line; basics default to home expression; apex Self-Will duel weight |

### Expand arts by weapon (from `data.js` — art unlocks **on entering** column’s realm)

| Transition | Sword | Blade | Spear | Fist | Staff (Circle) |
|------------|-------|-------|-------|------|----------------|
| **→ Minor Success** | Returning Edge — basics chance double strike | Slaughter Aura — wounded foes take more from basics | Penetrating Line — basics pierce guard better | Concussive Rhythm — every 3rd basic slows | Circulating Guard — basics restore resource sliver |
| **→ Major Success** | Blade Pressure — matching techniques stronger synergy | Blood Scent — flee less reliable vs you | Reach Advantage — bonus vs slowed/shaken | Iron Knuckle — basics cost less stamina/breath | Reach Sweep *(new)* — **Reach** leg |
| **→ Perfection** | Edge Domain — basics always half Returning Edge | Butcher Domain — Slaughter Aura threshold widens | Pierce Domain — first basic ignores guard | Press Domain — slows last longer | Sanctuary Domain or Vein Channel — **Hold / Conduct** |
| **→ Intent Domain** | Phantom sword-forms *(manifestation)* | Slaughter aura unnerves wounded | Piercing intent ignores half defense | Shockwaves from every strike | Arcane ward circulates |

**Staff note:** first shipped expand may keep **Circulating Guard** on entering Minor Success; **Reach Sweep** replaces pure-defensive ladder gap on entering Major Success ([`combat-damage-depth.md`](combat-damage-depth.md)).

### Devouring (PR #95 — same Expand = realm-up rule)

| Transition | Expand art | Notes |
|------------|------------|-------|
| **→ Taking** (Realm 2) | Predator's Mark *(draft)* | Stirring has **no** expand — prey sense only |
| **→ Feast** (Realm 3) | Qi Siphon | Dyadic conversion opens |
| **→ Surfeit** (Realm 4) | TBD | |
| **→ Maw Domain** (Realm 5) | Maw Domain | Apex |

Old doc line “Realm 1 expand: Returning Edge / Stirring none” still holds: **first expand art arrives with first Expand ceremony** (entering Realm 2).

### Staff (Circle intent) — expand slots by leg

| Transition (entering…) | Expand art (draft) | Leg |
|------------------------|-------------------|-----|
| Minor Success | **Circulating Guard** (rewrite or keep) | Hold |
| Major Success | **Reach Sweep** *(new)* | Reach |
| Perfection | **Sanctuary Domain** or **Vein Channel** | Hold / Conduct |
| Intent Domain | Circulating ward manifestation | Circle apex |

Retire “all three staff expands are defensive” — Circle needs **Reach** and **Conduct** picks in the ladder.

---

## Playable slice — realms 1–2 only (owner scope)

> **Parked (2026-08-01).** Design retained for when intent build resumes; not on the current queue.

**Goal:** ship something **feelable** at Foundation → Golden Core — not the full five-realm ladder. Realms 3–5 stay **designed / stubbed** in data; code paths should not assume they exist yet.

### What “playable” means

One complete loop a player can run:

```text
Awaken → Sprout (ripen 35 / 70 / 100) → Expand → Minor Success + first expand art
```

Second realm band can **start** ripening (same milestones) but **Realm 2 → 3 Expand is out of scope** for this slice — UI may show “not yet” or simply cap intent realm at 2 until a later Issue.

### In scope (build this)

| Piece | Ship as |
|-------|---------|
| **Intent realm idx 0–1** | Sprout, Minor Success only (`INTENT_TIERS[0–1]` or equivalent) |
| **Hidden saturation** | 0–100% per band; combat chunks + passive drip |
| **Milestones** | Auto at 35% / 70%; 100% = ripe |
| **Expand ceremony** | Sprout → Minor Success when 100% + **GC** + one comprehension beat |
| **First expand art only** | Sword: Returning Edge; other weapons: first row in expand table — **one track for playtest is OK** |
| **Chamber inward line** | `getChamberInwardIntentLine()` — Sprout + Minor Success copy |
| **Sprout combat** | Basic log flavor; soften high-art penalty at 35%; preview log at 70% |
| **Minor Success package** | +10% tier; high arts at `minStage: 1` full synergy; Returning Edge proc on basics |
| **Expression rewrite (lite)** | Cross-wield **log + small damage lean** only — no full stress pipeline |
| **Retire deepen/expand fork** | For realm 0→1 transition only; old buttons can stub realms 2+ |

### Out of scope (park — do not block v1)

| Piece | Why wait |
|-------|----------|
| Realms 3–5 + arts 2–4 | Design exists; not needed to prove loop |
| Full awakening (PR #95) | Weapon picker OK as **temporary** if spark doc not merged |
| Meditate-with-weapon mode | Combat + drip enough for first playtest |
| Sect life saturation boosts | Table later; [`heavenly-demon-cult-life.md`](heavenly-demon-cult-life.md) |
| Combat damage depth / stress types | Log flavor only until [`combat-damage-depth.md`](combat-damage-depth.md) ships |
| Devouring track | Separate Issue after orthodox slice works |
| Staff Circle Reach/Conduct ladder | Realm 1–2 staff can use existing Circulating Guard only |
| Divided heart | Edge case |
| Self-Will / Domain apex | [`intent-apex-self-will.md`](intent-apex-self-will.md) |

### Suggested build order

1. **Saturation engine** — hidden meter, combat chunk, passive drip, milestone flags  
2. **Sprout feel** — inward line, basic log, 35% penalty soften (`techniques.js`)  
3. **Expand = realm-up** — promote idx 0→1, grant first expand art, reset saturation  
4. **Minor Success feel** — Returning Edge (already in `data.js`), rewrite-lite on one cross-wield case (Sword + palm)  
5. **One comprehension beat** — minimal gate (sect line, story flag, or “win N fights with intent”)  
6. **Polish** — 70% preview log, ripe-at-100% inward copy, remove deepen/expand buttons for this path  

### Playtest success criteria

- Awakening → inward line appears; basics no longer say “Qi blast!” (Sword).  
- High sword art at Sprout: usable with warning, not a 72% brick after 35%.  
- Fighting with intent fills ripening over months; player senses progress via chamber copy, not a bar.  
- At 100% + GC + beat: one Expand → Minor Success, Returning Edge visible, double-strike sometimes fires.  
- Palm with Sword intent at Minor Success: log reads as cut-leaning at least once.  

### When to open the build Issue

After owner signs this slice + picks **one playtest track** (Sword recommended). Issue title sketch: *“Intent saturation + Sprout/Minor Success playable slice.”* Link this section.

---

## How intent grows (saturation sources)

The meter is fed by **living**, not intent-menu chores:

| Source | Saturation role |
|--------|-----------------|
| **Combat** with active intent | Large chunk per fight — primary driver |
| **Meditate with weapon** | Cultivate/chamber **mode** — steady boost, no extra button |
| **Manual / canon layer** | Lump on comprehend; ties syllabus to intent ([`heavenly-demon-cult-life.md`](heavenly-demon-cult-life.md)) |
| **Sect life** | Drills, hunts, missions — faction-specific boost table |
| **Comprehension beats** | One-time spikes; **realm breakthrough** still needs these, not meter alone |
| **Passive drip** | Slow months while on-path — tops out ~60–70% without boosts |
| **Seclusion** *(optional)* | Rare high burst if owner wants one explicit “focus will” action |

Intent should show up in **decades of play**: awaken at FE, saturation creeps through GC missions, expand at NS+ — same rhythm as cult life rank × realm table.

---

## Awakening (from PR #95 — keep)

No weapon picker. **Groundwork + spark.** See [`weapon-intent-awakening.md`](weapon-intent-awakening.md).

After awaken: track opens at **Intent Realm 1**, saturation at 0%, no expand arts.

---

## Deviant intents (same skeleton)

**Devouring Intent** is the template for non-weapon tracks — same deepen → expand → breakthrough, different names and gates. Update [`devouring-intent.md`](devouring-intent.md) when this doc merges: change “pick Deepen or Expand” tables to **sequential** deepen chain + expand unlock per realm.

| | Weapon Sword | Devouring |
|--|--------------|-----------|
| Realm 1 (Sprout / Stirring) | *(none — ripen only)* | Prey sense / formation seeds |
| Realm 2 expand (on **entering**) | Returning Edge | Predator's Mark |
| Deepen in Realm 2 | +line / +synergy | +conversion / +siphon |

---

## What we can rewrite (owner OK)

| Legacy | Direction |
|--------|-----------|
| `chooseWeaponIntent` picker | Spark resolution |
| `refineActiveIntent` / deepen button | **Intent Saturation** meter + milestones |
| `pendingIntentChoice` deepen **or** expand | Saturation milestones + Expand ceremony at 100% + gates |
| `INTENT_TIERS` use-only breakpoints | Intent realm gates + saturation + comprehension beat |
| `INTENT_EXPAND_ARTS` fixed 3×3 grid | Per-realm one expand; saturation milestones per realm |
| Intent popup deepen/expand/refine buttons | Saturation bar, boost hints, expand ceremony at 100% |

## Open questions

- Inward sign copy — imposed-will voice; per intent track tables
- Outward tell + concealment — spiritual sense / wards (later); no v1 UI
- **Decay** if neglect intent for decades — yes/no (lean no for v1)
- Meditate-with-weapon: new cultivate tab vs FE chamber toggle
- Seclusion burst — keep one optional action or fold entirely into meditate mode
- Whether weapon tier names rename to match “intent realm” vocabulary in UI
- Shared breakthrough UI for weapon + deviant tracks
- Second awakened intent: divided heart + separate saturation tracks

## Prerequisites

- [ ] Merge or cross-link PR #95 awakening + cult life docs
- [ ] Owner pass on Sword/Spear/Staff expand ladder names
- [ ] Update `devouring-intent.md` fork language when consolidating branches

## Implementation crumbs (when building — not now)

- `intent.js` — saturation meter, milestone auto-deepen, expand ceremony (realm-up + art)
- `data.js` — `INTENT_SATURATION_BOOSTS` per activity; expand per realm; milestone effects
- `ui.js` — intent screen: arts + focus only; **no ripening bar**
- `chamber.js` — `getChamberInwardIntentLine()` (root block separate from will block)
- `heavenly-demon-cult-life.md` — rank promotions tied to intent realm gates
