# Post-immortal cosmology (upper realm vs Chaos vs Court)

| Field | Value |
|-------|-------|
| **Status** | `idea` |
| **Blocked on** | Immortal Ascension as a real climax; Chaos Path brainstorm; Heavenly Court POC fit |
| **Issue** | none yet |
| **Chat / PR** | Chaos brainstorm 2026-07-20; stale POC [PR #1](https://github.com/WanderingImmortal/tales-immortal-path/pull/1) — **not gospel**, rewrite freely |
| **Updated** | 2026-07-20 |

> **Not ready to implement.** Cosmology / endgame shape only. Do not stack another nine-realm ladder in code until this settles.

> **Heavenly Court POC is optional flavor** (owner 2026-07-20): not locked in. Shackle origin does **not** require Court — see “Shackle vs Court” below. Stale POC = alignment-gated post-Ascension path, Celestial Favor, ranks, decrees, intrigue, fall if Favor &lt; 0; **no** cosmology for false immortality.

## Intent

**Immortal Ascension is not the end.** It should feel like a watershed that *reveals* the climb was incomplete — “immortals” of the lower path are **false / earthbound / law-bound** — and that true height (upper realm, heavenly order, and/or Chaos) still waits.

That does **not** mean defaulting to **“same cultivation loop, bigger numbers, forever.”** Owner finishes novels when late game changes *kind* of goal at times — but also wants more levels after the false-immortal reveal, because today’s seven majors feel too thin to touch literal creation.

Post-immortal content should mix **continued climbing** with **distinct fantasies** (Court politics, Chaos remaking the law), not only reskinned Condensation→Ascension.

## Owner taste (why this matters)

| Pattern | Feel | Owner reaction |
|---------|------|----------------|
| Perpetual realm scaling (another continent, another 9 majors…) | Power is always the goal | Often drop ~90% — scaling stops being fun |
| Goal shifts away from raw power | Politics, sealing, rewriting laws | Finishes more often |
| **I Shall Seal the Heavens** | Ending / sealing as climax | Finished — ending interesting |
| **Library of Heaven’s Path** | Long journey, system-y growth | Read nearly to end |
| **Primordial Throne of Divine Blood** | Retroactively creating a *better* cultivation system | Finished — **direct inspiration for Chaos Path** |

## Settled so far (2026-07-20)

| Question | Direction |
|----------|-----------|
| Immortal Ascension = ending? | **No** — reveal + more climb |
| False immortal beat? | **Yes** — ISSTH-flavored: Ascension = **mandate / facade** (lease + siphon); **true Immortal** = broke through on own power upstairs (or via Chaos). Not evil — wrong finish line. |
| Greedy for +9? | Maybe — separate **deepen current seven** from **add post-false-immortal watersheds**. Creator (Chaos) should not sit flush against today’s shallow Ascension. |

## False immortal reveal (sketch)

Classic xianxia move: what the continent calls “Immortal Ascension” is **longevity under heaven’s law**, not true transcendence.

### Owner spark (2026-07-20) — immortality as world shackles

Ascending is not “you become eternal.” It is closer to **binding the world** so *you* stop dying:

- The Ascension rite (or the Immortal state itself) **puts shackles on heaven-and-earth** — future generations find cultivation harder, thinner, more constrained.
- Your “immortal” lifespan is **siphoned longevity** drawn from the world’s remaining fortune / spiritual veins / natal lifespan pool — not proof you transcended the Dao.
- The moral beat is **not** “you were evil for ascending.” Almost every peak cultivator would take the step. The horror is **recognition after the fact**: *this isn’t immortality — I am starving the world so I can linger.*

That gives the false-immortal reveal teeth:

| Beat | Feel |
|------|------|
| Before Ascension | Glorious goal the whole continent chases |
| At / just after Ascension | Triumph — infinite years, title, power |
| The crack | Sense the world dimming; juniors plateau earlier; veins thin; Court calls it “order” |
| The confession | Not villainy — tragic complicity. You joined the machine that eats tomorrow |

**Ties cleanly to Chaos:** perceiving the “flaw in the Dao” can be *seeing the shackle* — the law that sells false immortality as transcendence. Chaos then isn’t “more power”; it’s refusing the siphon / returning to source / remaking a law that doesn’t eat the young.

**Court (optional hook, not required cause):** if kept, Court is **downstream** — clerks and envoys who *think* they enforce Heaven’s Will, redistributing fortune and revoking leases they didn’t invent. See “Shackle vs Court” below.

### Other beat options (compat / combine)

- Upper-realm gate / forbidden site / grotto master — reveal without any Court scene
- Lifespan infinity revealed as **heaven’s lease**, revocable (Court fall POC rhymes if we keep it)
- Chaos perception: the flaw *is* the siphon mechanism

Code today: `isImmortal()` = last realm index; reincarnation UI calls it “True Reincarnation” at Ascension — naming may need a pass so “true” isn’t spent early.

### ISSTH-inspired true vs false (owner spark 2026-07-20)

*I Shall Seal the Heavens* energy without copying it: **true Immortals broke through on their own power**; what the continent celebrates as Ascension is something lesser — a **facade** of forever, propped up by drawing life from the world.

#### One sentence

> **False immortality is a mandate. True immortality is self-sustenance.**

#### How the siphon and “own power” fit together

They are **the same mechanism, two readings**:

| | **False Immortal** (orthodox Ascension) | **True Immortal** (north star upstairs) |
|---|----------------------------------------|----------------------------------------|
| **What happened** | Heaven / the array **recognized** you and **granted** a lease | You **overwhelmed** the law with your own cultivated totality |
| **Lifespan** | ∞ on paper — actually **subsidized** | Sustained by **your** dao / body / soul / chaos unity |
| **Fuel** | World fortune, veins, juniors’ potential | None required (or you feed yourself from Chaos / primordial source) |
| **Feel** | “I passed tribulation and became eternal” | “Heaven’s label means nothing — I walked through the door myself” |
| **Failure mode** | Lease revoked, cast down, array collapse | Heart demon, erosion, but not “heaven unplugged you” |

**The facade:** your immortal body is a **shell kept inflated** by ambient extraction — like a lantern that burns the room’s oxygen. You look ageless; the realm gets thinner. You didn’t fail cultivation; you succeeded at the **wrong definition** of success.

**Why it feels like achievement:** tribulation, pills, and seals are real work. The lie is what Ascension **hooks you into** at the finish line, not that you cheated the grind.

#### Three model options (pick / blend)

**1. Mandate vs Self-Sustenance (cleanest for UI)**  
Post-Ascension hidden stat: `% Mandate` (borrowed) vs `% Self-Sustenance` (owned). Orthodox Ascension sets Mandate ~100%. True breakthrough upstairs **converts** Mandate → Self-Sustenance over a questline. World Fortune only drains while Mandate &gt; 0. Chaos Sacrifice zeroes Mandate and starts Self-Sustenance from a different ruleset.

**2. Two doors at the same threshold (ISSTH tribulation vibe)**  
Immortal Ascension tribulation has a **hidden fork**:  
- **Door A (easy):** accept recognition → false immortal, lease, siphon node. What 99% take.  
- **Door B (brutal):** reject recognition / walk through the lightning on your own → no lease, no ∞ yet, but you’re on the true path.  
Player who “ascends” normally gets Door A. True path is discoverable via forbidden lore, grotto master, or stats (perfect seals + Wuji glimpse?). **No retroactive punishment** — you didn’t know Door B existed.

**3. Upper realm as the real test**  
Ascension is **always** false immortality in the lower world — that’s the point of the reveal. “True Immortal” is not a rename of realm 6; it’s the **first real watershed upstairs** (or first of 2–3 sparse true realms). Lower Ascension = boarding pass. Upper breakthrough = you actually leave the airport. Siphon continues until you clear true watershed 1.

**Recommendation:** **3 for story** (matches “Ascension isn’t the end”) + **1 for mechanics** (Mandate meter explains siphon clearly). **2** for a killer single reveal moment if you want one legendary choice.

#### Tie to Chaos

See **“Taxonomy: Mandate, True, Chaos, Progenitor”** and **“Impartial Heaven”** below — Chaos is **not** another immortal on heaven’s registry.

| Path | Relationship to true/false |
|------|---------------------------|
| **Orthodox upstairs** | Try to convert Mandate → Self-Sustenance **inside** heaven’s law |
| **Chaos** | **Unregister** from heaven’s taxonomy — revert mandate, rebuild self-sustenance from primordial source; heaven applies **counter-rules**, not grudges |
| **Court (optional)** | Hands out Mandate paperwork; cannot grant true or Chaos status |

#### Open on this model

- Can NPCs tell the difference? (Spirit sense idea doc — “this one smells of heaven’s stamp”)  
- Is there **one** true immortal watershed or a sparse ladder?  
- Does Door B (model 2) need to exist, or is upstairs-only (model 3) enough?

### Impartial Heaven (owner direction 2026-07-20)

**Heaven is not a person.** No throne-room villain, no scheming Emperor of reality (unless a *mortal institution* like Court mistakes itself for Heaven).

Heaven = the **rule-engine** left behind when Chaos was ordered into Dao:

- Predetermined **if/then** laws: tribulation thresholds, registry entries, fortune debits, tribulation severity curves
- **Impartial:** it does not hate Chaos walkers or love righteous sects. It executes clauses.
- “Forbidden” Chaos = **no clause exists** for what you’re doing → heaven responds with **default denial behaviors** (erosion pressure, anomalous tribulations, instability) the way a immune system reacts to unclassified input — not anger

**Why immortals are fake (lore, nailed down):**

When the Dao was patched to close the primordial wound, the engineers (founders, forgotten) encoded a **sustainment rule**:

> *Registry Immortals shall not decay. Maintenance cost: debit from `MortalFortuneIndex` per registered node.*

Nobody lied in a meeting. The law **assumed** sparse ascenders and a rich world. Ages of cultivators later, the rule still runs. Each Ascension is a new registry entry. The continent calls it transcendence; Heaven calls it **Rule 7**.

**Owner phrasing (2026-07-20) — same idea, sharper:**

> The Heavens **cannot sustain** a true immortal being — or at least **not every** immortal, forever. Anyone who ascends on Heaven’s path is **permanently etched** as a **fixed cost** on the world. That cost is **paid by everyone still under Heaven’s authority** — mortals, sects, veins, juniors, *and* other registry Immortals. Not malice. **Arithmetic.**

False immortality isn’t punishment — it’s **accounting** with a **finite budget** and **no off-switch** per registered node.

### What extraction looks and feels like

**Lore image:** golden **ledger-threads** — thin filaments from ley lines, spirit veins, and unborn potential into the registry marks on each false Immortal’s dantian / soul-crown. Invisible until you learn to see.

| Stage | What the player experiences |
|-------|----------------------------|
| **At Ascension** | Weightlessness, then **borrowed stillness** — your heartbeat feels *correct* but not quite *yours*, like wearing perfectly fitted armor |
| **Early post-Ascension** | Cultivation near sacred sites feels **effortless**; remote backwater zones feel **thin** (you’re standing where the pipes are fattest) |
| **Hints** | Dreams of drought; techniques that used to spark in juniors **won’t catch**; herbs pale in chronicles |
| **Reveal** | UI or scene: **Mandate %** + threads visualized; line: *“Heaven did not crown you. It enrolled you.”* |
| **After** | Dependency feeling — warmth with a draft from somewhere else. True / Chaos paths = learning to close the tap or burn without oxygen theft |

**Not:** cartoon evil voice. **Yes:** cold bureaucratic wrongness, then grief.

### Taxonomy: Mandate, True, Chaos, Progenitor

Four **different kinds of end-state**, not one ladder with bigger numbers:

| Tier | Name (draft) | What it is | On heaven’s books? | World drain? |
|------|--------------|------------|-------------------|--------------|
| 1 | **Mandate Immortal** / Registry Immortal | Orthodox Ascension — ∞ via lease | **Yes** — Rule 7 | **Yes** |
| 2 | **True Immortal** | Sparse upstairs watershed; self-sustained **within** Dao law | Yes, but **self-authored** entry | **No** (or net-neutral) |
| 3 | **Chaos Ascendant** / **Unwritten** | Chaos Path completion short of Creator — self-sustained **outside** Dao taxonomy | **No** — unclassified | **No** — you draw from primordial source, not MortalFortuneIndex |
| 4 | **Progenitor** | Creator capstone (Realm 8) — authors pocket worlds / Dao / reality | **Irrelevant** — you write ledgers | **Varies** — can forge systems that don’t eat the young (Primordial Throne fantasy) |

**“Do Chaos walkers become immortals?”**  
**Not in heaven’s sense.** They don’t get ∞ from Rule 7. They get **something else** — long life from self-sustaining chaos, but the UI shouldn’t reuse the immortal chip. Call them **Unwritten**, **Chaos Ascendant**, or **Primordial Walker** until late realms.

**Progenitor:** keep for **Creator-stage only** — far above “just immortal.” Feels like author of a law, not a tough fight. Don’t use as synonym for Chaos realm 7.

**Heaven vs Chaos (no personality):**

| Heaven (rules) | Chaos (outside rules) |
|----------------|----------------------|
| Executes registry, debits fortune | No registry slot |
| “Forbidden” = undefined behavior → instability | Walkers train to stabilize internally (or erode) |
| Counter-pressure is **automatic** | Grotto Masters show what happens when you fail the stabilization |

---

## How it works in practice (brainstorm — owner Q 2026-07-20)

Three questions the concept must answer: **complicity**, **why**, and **what the player sees**.

### 1. How are current Immortals complicit? (Not “all evil”)

**Complicity ≠ intent.** The Ascension rite plugs you into a **celestial sustainment array** that already exists. You don’t need to know the cost to become a drain node.

| Who | Relationship to the shackle |
|-----|---------------------------|
| **You (newly ascended)** | Just became a new tap on the same pipe. Guilt lands *after* the reveal. |
| **Court Immortals upstairs** | **Symptom managers**, not architects — if Court exists, they enforce decrees, bless regions, hunt rogues. They may *believe* they speak for Heaven; they don’t have the power to **end** the siphon, only shuffle it. |
| **Ancient / sealed immortals** | May have **built** the first seal (wound in the sky, post-Chaos split) without understanding long-term cost — tragic founders, not mustache-twirlers. |
| **Hermits / wanderer immortals** | Still nodes in the array even if they “left politics.” Their ∞ lifespan is still leased. |
| **Grotto Masters (failed Chaos walkers)** | Cautionary: tried to step off the pipe wrong (Devourer) or saw it and broke (Lost Pilgrim). |

**Player-facing line:** *“Every Immortal who ever ascended is complicit — including the ones who never wanted to hurt anyone. The rite does not ask permission from the world.”*

**Design guardrail:** early-game mortals are **not** punished for the player not having ascended yet. Pre-existing immortals share blame so it’s systemic, not “you alone ruined everything on day one.”

### 2. Why is it this way? (In-world cause)

**Court does not need to be the reason.** Owner direction: a seated group *could* have started the cycle, but they also don’t read as powerful enough to own the whole cosmology — and “Court enforces Heaven’s Will” is half-forgotten design anyway. Prefer **impersonal or ancient** origins; Court is optional late-game politics on top.

Pick **one** primary myth (others = rumors / sect doctrines):

**A. The Seal (recommended default)**  
After primordial Chaos was forced into order, the sky had a **wound**. The first “Immortals” didn’t transcend — they **stitched the wound shut** using the mortal realm’s spiritual fortune as thread. The **founders may be dead, ascended elsewhere, or sealed** — not sitting in a courtroom. The array runs on **inertia**. Every new Ascension adds another stitch.

**B. Heaven’s Will (abstract law)**  
“Heaven” is not the Court — it is **the hardened Dao** itself. Ascension binds you to that law. No committee required. The Court (if any) is mortals’ and lesser immortals’ *misreading* of the mechanism as a government.

**C. Degraded Dao (Primordial Throne echo)**  
True cultivation once didn’t require siphoning. The current Dao is a **patch** that hardened into law. False immortality is what happens when you reach the top of a **broken** system.

**D. Court as late institution (optional)**  
A council **formed after** the Seal to manage crises — famine of qi, rogue immortals, vein collapse. They codified redistribution rituals (bless region, hunt rogue) and **mistook stewardship for authorship**. They tell themselves they enforce Heaven’s Will; they’re paper-pushers on a machine older than their titles.

All four support the same gameplay spine (World Fortune, reveal, Chaos response). **A + B** keep Court optional; **D** only if you want political satire upstairs.

### Shackle vs Court (design split)

| Layer | Question it answers |
|-------|---------------------|
| **Shackle / siphon** | *Why* false immortality exists — cosmic, ancient, impersonal |
| **Heaven’s Will** | *What* the orthodox world thinks is sacred law — may be the Dao-patch, not a person |
| **Heavenly Court** (optional) | *Who* pretends to administer it upstairs — favors, decrees, intrigue, fall |
| **Chaos** | *How* you leave or rewrite the mechanism |

Court works best as **“the DMV of heaven”** — powerful over *you*, powerless over *the array* — not the villain who invented the cycle.

### 3. What does it look like in game?

Split effects into **hidden → hinted → revealed → actionable**.

#### Phase 0 — Before Ascension (player doesn’t know)

- Optional ambient lore: old texts mention a “narrower path,” golden age decline, fewer prodigies.
- No mechanical penalty tied to the player.

#### Phase 1 — At Ascension (triumph + hidden hook)

- Normal ascension celebration: ∞ lifespan, title, unlock Court / upper content.
- **Silent state attach:** `G.worldShackle` or `G.immortalLease` — you are now `immortalNode: true`.
- Maybe one uncanny line in the log: *“The heavens accept your oath. Something elsewhere grows quieter.”*

#### Phase 2 — Hints (post-Ascension play)

Player can **feel** wrongness before the lecture:

| Signal | Mechanic sketch |
|--------|-----------------|
| **World Fortune** (global 0–100, slow) | Drifts down over long time skips while any Immortal count is high; each new Ascension nudges it. Player actions while Immortal can nudge faster (greedy decrees, forbidden unseals). |
| **Natal ceiling** | World NPCs / sect recruits: slightly lower starting `realmIdx` cap or slower `tickWorldNpcGrowth` breakthrough odds in late eras. |
| **Explore / gather** | Soft `-X%` spirit herb quality or rare drop tier cap in zones when Fortune is low. |
| **Dialogue** | “My grandson stalled at Qi Condensation for thirty years. My grandfather reached Foundation at eighteen.” |
| **Sect chronicle** | “No Core Formation breakthrough in forty years.” |

Fortune should move **slowly** — decades/centuries, not every cultivate click — or it feels like punishment spam.

#### Phase 3 — The reveal (story beat)

Triggered by one or combine (Court **not** required):

- Forbidden Ground / sealed ancient / grotto master (Watcher)
- Upper-realm threshold (sky gate, vein nexus)
- Dao / Wuji-adjacent insight
- *Optional:* first Court audience — they **explain it wrong** (“maintain order”) and the player sees through it elsewhere

**Reveal UI:** short scene + unlock **World Fortune** (or **Heaven’s Debt**) on sidebar / world panel.

Copy tone: *“Immortality was never yours. You are a needle drawing blood from the realm’s veins. The Court calls it order. The young call it a dying age.”*

#### Phase 4 — After reveal (choices, not just guilt)

| Path | Player fantasy | Mechanic direction |
|------|----------------|-------------------|
| **Court** (if kept) | Navigate a broken bureaucracy | Favor / decrees redistribute Fortune; you can’t fix the array, only play the game. Fall = lease revoked. |
| **Orthodox upper climb** | Find “true” immortality inside the law | Few sparse upstairs watersheds; maybe reduce *your* drain rate, never zero without Chaos. |
| **Chaos** | Leave / remake the law | Sacrifice = tear out your node. Rebirth = encode non-siphoning foundation. |
| **Denial** | Stay Immortal, ignore | Valid for a while; Fortune keeps drifting. |

### Concrete numbers (placeholder — tune later)

- `worldFortune` starts ~85 at campaign start (already post–golden age).
- Each **Immortal Ascension** (player or major world event): −2 to −5.
- Each **century** while player is Immortal and idle: −1.
- Court **Bless Region** decree: +3 local for 24 months, −1 global (robbing Peter).
- **Chaos Sacrifice** (if taken): +8 global, player loses Immortal status.

Caps: Fortune floor ~20 before “mortal age” events fire (famine of qi, sect collapses, plot hooks).

### Problems & fixes

| Problem | Fix |
|---------|-----|
| “Why would anyone ascend if it’s bad?” | They **don’t know** until late. Same as real xianxia — the lie is the point. |
| “All immortals evil?” | **Systemic** complicity; founders tragic; Court bureaucratic; player guilt is recognition. |
| “Punishes new players?” | Meter barely moves pre-Ascension; pre-existing immortals already drained the world. |
| “Feels like guilt trip only?” | Tie to **play** — Court redistribution minigame, Chaos opt-out, upstairs search for true law. |
| “Too sim-heavy?” | Start with **Fortune + dialogue + 1–2 loot modifiers**; expand if fun. |

### Minimum viable slice (when/if built)

1. `worldFortune` global + sidebar after reveal  
2. Ascension attaches immortal node + log line  
3. One Court task that bumps local / hurts global (teaches the tradeoff)  
4. One reveal scene (Court or Forbidden)  
5. Chaos doc cross-link: Sacrifice/Rebirth as responses to Fortune/debt

---

These can coexist as **branches / places / choices**, but they answer different questions:

| Kind | Fantasy | Existing / parked |
|------|---------|-------------------|
| **A. Walk heaven’s order** | Immortal politics, favor, decrees — *if* Court exists | Stale POC (PR #1) — rewrite freely; not the shackle’s cause |
| **B. Break / remake the system** | Return to source; forge Dao / pocket worlds / reality | [`chaos-cultivation-path.md`](chaos-cultivation-path.md) — Chaos Path (Primordial Throne DNA) |
| **C. Upper realm as place** | New map / sky continent / immortal world to explore | **Unsettled** — tempting “+9 major realms”; risk of recreating the scaling trap |

**Design rule of thumb:** an upper *map* can exist without an upper *power ladder*. New zones, courts, tribulations, and NPCs ≠ nine more “Qi Condensation but golden.”

## Upper realm — open sketch

Owner thought (2026-07-20): maybe an **upper realm map**, and maybe **another ~9 major realms** — number unsettled; shape unknown.

### Temptation
- Classic xianxia structure (lower world → immortal world → …)
- Room for late content and “I made it upstairs”

### Risk
- Nine more majors that feel like **reskinned** Condensation → Ascension
- Chaos then becomes “why bother with upper orthodox realms?” *or* Chaos gets buried under more bars
- Same abandonment curve as novels that only escalate tier names

### Safer shapes (brainstorm options — pick later)

1. **Upper map + a few true watersheds** — not nine empty majors; 2–4 identity-heavy steps between false Immortal and whatever “true” means (True Immortal / Heavenly / Chaos gate).
2. **Upper ranks alongside sparse realms** — Court ranks / titles / domains (Heavenly Court POC) carry a lot of “more to climb” without nine combat ladders.
3. **Deepen the lower seven first** — if peaks feel hollow, FE→Ascension depth fixes the “unfair jump to creation” feeling as much as adding upstairs floors.
4. **Upper realm = Chaos-hostile heaven** — place for orthodox climb + story; Chaos walkers hunted / mythic.
5. **Defer the count** — commit to “Ascension is false; more exists” before locking “9.”

**Greedy check:** wanting more after Ascension is fair if creation is the north star. Wanting nine *identical* power floors is the novel-drop pattern. Prefer fewer upstairs watersheds with weight.

## How Chaos fits the novels you finish

Chaos is closest to **Primordial Throne**: the late game is not “become stronger Immortal,” it is **author a better law of cultivation** (Creator stages: pocket dimension → Dao → reality). That is an *exit* from perpetual scaling, not another floor of it.

Heavenly Court is closer to **ISSTH / political immortal** — power is a ticket; the game becomes favor, decrees, rivals, falling.

Upper realm + 9 majors, if done as pure power, is the pattern you drop.

## Prerequisites

- [x] Immortal Ascension is **not** a final ending (owner)
- [ ] Write the **false immortal** reveal (lore + when it fires) — **world-shackle / longevity siphon**; see “How it works in practice” section
- [ ] Decide siphon MVP: **World Fortune meter** + post-reveal Court tradeoffs (leaning this over full NPC-genetics sim on day one)
- [ ] Decide upper realm is **map + sparse true watersheds / ranks** — don’t auto-commit to 9 majors
- [ ] Align Chaos vs Court vs upper climb: when can you perceive Chaos — at false Ascension, or only after tasting the upper lie?
- [ ] Deepen-current-seven vs invent-upstairs priority (can be parallel docs, not one PR)
- [ ] Decide whether **Heavenly Court** survives at all, or is replaced (upper sect, vein nexus, nameless Heaven’s Will trials only)
- [ ] Revisit stale Heavenly Court POC (PR #1) — salvage mechanics (Favor, fall) without making Court the cosmology villain
- [ ] Promote Issues only after status → `designed`

## Open questions

1. Is the upper realm primarily a **place**, a **power ladder**, or both?
2. If ladder: how many *mechanical* true watersheds upstairs (2–3 / ~9 / other)?
3. Does the false-immortal reveal happen **at** Ascension, or only when you try to enter the upper realm / Court?
4. Does choosing a Court path (if any) lock out Chaos, or can bureaucrat-Immortals later perceive the flaw?
5. Does Chaos Sacrifice/Rebirth remove you from upper-map / Court access?
6. Should “Creator” content rewrite the *player’s* world, or only forge side realities (safer for sim integrity)?
7. Rename collision: FE “Earthbound Immortal” vs Ascension “false immortal” vs Chaos “true” — vocabulary pass needed.
8. **Siphon sim:** do Immortal NPCs (and the player) measurably thin the world’s fortune over long time skips? Hook for watershed / time-model ideas?

## Related

- [`chaos-cultivation-path.md`](chaos-cultivation-path.md)
- Heavenly Court POC — PR #1, `post-immortal.js` on `cursor/post-immortal-heavenly-court-a11b`
- [`watershed-realms-lifespan-pacing.md`](watershed-realms-lifespan-pacing.md)
