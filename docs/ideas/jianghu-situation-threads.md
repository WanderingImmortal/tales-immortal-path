# Jianghu situation threads (grievances → consequences)

| Field | Value |
|-------|-------|
| **Status** | `designed` |
| **Blocked on** | Grudge cultivate interrupt v1 ([`qc-cultivate-excitement.md`](qc-cultivate-excitement.md)); backing/sect power read for NPCs (partial hooks: fame, sect renown, grudge tiers) |
| **Issue** | none yet |
| **Chat / PR** | design chat 2026-09-23 |
| **Updated** | 2026-09-23 (proxy junior beatdown, lethal escalation gate) |

**Hub:** [`dustbone-living-board.md`](dustbone-living-board.md) · [`mortal-life-sim-cluster.md`](mortal-life-sim-cluster.md)  
**Sisters:** [`qc-cultivate-excitement.md`](qc-cultivate-excitement.md) (personal interrupts) · [`world-events-layered-battlefield.md`](world-events-layered-battlefield.md) (civic scale) · [`world-standing-and-property.md`](world-standing-and-property.md) (visibility) · [`chronicle-and-projects.md`](chronicle-and-projects.md) (diary) · [`civic-seats-generator.md`](civic-seats-generator.md) (same “engine + packs” pattern) · [`disguise-and-public-identity.md`](disguise-and-public-identity.md) (counterplay)

## Intent

Players find their own path in a **non-linear** jianghu. We should not hand-write every “quest.” Instead, record **what happened** (slights, kills, betrayals, public humiliation) and let **personality + ties + standing** turn those facts into **situation threads** — optional chains like *fight a noble’s son → family hears → hunters, bounties, or a formal challenge*.

This is **not** a replacement for authored story arcs (`STORY_ARCS`). It is the **procedural glue** between personal NPC drama, faction standing, and calendar events.

**Player feel:** consequences you earned, readable in the diary, escapable or negotiable if you play smart — not an infinite quest log of fetch quests.

---

## What exists today (scattered but real)

| Layer | Role today | Gap for threads |
|-------|------------|-----------------|
| **World NPC converse** | `impression` / `trust`, personality synergies (`grudge_keeper`, `schemer`), decay | Per-NPC mood, not a **propagating debt** |
| **npc-betrayal.js** | Ambush / intel hooks from gap + synergy | Reactive combat, no multi-beat **chain** |
| **npcKillLog** | Last ~30 kills (uid, zone, reason) | No kin/clan/patron links; no scheduled follow-ups |
| **STORY_ARCS + shiftNpcRelationship** | Authored arcs, `fate: enemy`, journal | Right **shape** for chains; wrong **scale** (each arc hand-built) |
| **worldEventQuests + WORLD_EVENT_TEMPLATES** | Timed template quests (Wei rumors) | Quest-shaped UI; weak **cause** (not tied to player deeds) |
| **world-scheduler.js** | `scheduleWorldEvent(type, at, payload)` + handlers | **Correct spine** for delayed beats — underused for personal drama |
| **Sect diplomacy** | `declare_grudge`, grudge raids, rep tiers | Org-level, not “this NPC’s uncle” |
| **Design (parked)** | Grudge cultivate interrupt pulls story + kill log + hostile NPCs | Needs a **picker** and **persistent thread** model |

**Verdict:** You have **inputs** (relationship stats, kills, personalities, scheduler, quest log mirror) and **outputs** (combat, log lines, faction shifts). What’s missing is a **middle layer**: normalized **incidents**, **threads**, and **escalation packs** — plus rules for **who cares** (ties).

---

## Design — one engine, three layers

Think **civic seats generator**, but for drama: one runtime, data-driven packs.

```text
INCIDENT (immutable fact)
    ↓ rules + personality + ties
THREAD (active situation — stages, cooldowns, caps)
    ↓ each stage
BEAT (handler: interrupt · rumor · combat · letter · standing delta · chronicle line)
    ↓ optional mirror
QUEST LOG ROW (UI convenience — not the source of truth)
```

### 1. Incidents (ledger)

Append-only records — small, save-safe.

| Field | Purpose |
|-------|---------|
| `id` | Stable key |
| `type` | `slight` · `insult` · `robbery` · `kill` · `humiliation_public` · `betrayal` · `spare` · … |
| `atMonths` | When |
| `zoneId` | Where (matters for face — parked) |
| `actor` | Usually `player` |
| `target` | NPC uid and/or org id |
| `severity` | 1–5 (or derived from type + context) |
| `witnesses` | Optional uids / “public” flag |
| `payload` | Combat id, choice id, stolen item ref, etc. |

**Sources:** combat kill (`recordWorldNpcKill`), converse stances, story arc resolutions, future public duel outcomes.

Do **not** re-derive drama from impression alone each tick — impression is **local temperature**; incidents are **debts**.

### 2. Threads (active situations)

A thread is “the noble clan hunt” or “Merchant Su’s grudge” — one **narrative unit** with stages.

| Field | Purpose |
|-------|---------|
| `threadId` | Unique |
| `templateId` | Which pack (e.g. `clan_blood_debt`, `personal_grudge`) |
| `status` | `active` · `dormant` · `resolved` · `expired` |
| `stage` | Index into pack |
| `participants` | Player + NPC uids + optional `orgId` |
| `rootIncidentId` | What started it |
| `nextBeatAt` | Scheduler hook |
| `flags` | Player choices (`paid_blood_price`, `fled_region`, `killed_envoy`, `accepted_compensation`) |
| `grudgeLevel` | 1–5 ladder at spawn (slight → clan stain) — rarely drops; compensation may lower |
| `heat` | 0–100 intensity within level (escalation / decay / provocation) |

**Caps:** max active **personal** threads (e.g. 3–5); org-level threads separate cap — avoids quest spam.

**Resolution:** pay off, kill apex, flee zone, serve sentence, ally-of-enemy peace, time + decay (personality-dependent), story arc override.

### 3. Beats (handlers)

Reuse **world-scheduler** pattern: beat type → function.

| Beat type | Example |
|-----------|---------|
| `rumor_tick` | Inn line: “House X seeks a cultivator who…” |
| `grudge_interrupt` | Cultivate / travel pause — someone with reason |
| `spawn_hunter` | Ambient NPC or named proxy in zone |
| `faction_standing_delta` | Clan rep, city law attention |
| `letter_choice` | Pay · duel · deny · flee |
| `chronicle_entry` | Jianghu tab line |
| `mirror_quest_log` | Optional `npcQuests` row for journal UI |

**Quest log is a view.** Thread state lives in `G.situationThreads` (name TBD). Same as today: `worldEventQuests` mirrors into `npcQuests` — keep that pattern.

---

## Fight appetite & face (how NPCs choose *whether* and *how* to hit back)

Xianxia feuds are not “everyone always rushes you.” Actors weigh **can we win?**, **what do we lose if we lose?**, and **how ugly would it look if we win?** That belongs in the **thread engine** (when picking the next beat), not in hand-written quest text.

### Two decisions per escalation step

| Decision | Question | Drives |
|----------|----------|--------|
| **Appetite** | Do we engage at all, wait, or drop it? | Delay beat · de-escalate · ignore (with personality exceptions) |
| **Modality** | Open · formal · or shadow? | Beat type: duel letter, public challenge, ambush, bounty, poison, law trap, clan petition |

Both run **after** an incident exists; they do not replace personal grudges (`grudge_keeper` may fight anyway when appetite says “no”).

### Signals the world already has (or will)

**Player — displayed strength & record**

| Signal | Source (today / near) | Notes |
|--------|------------------------|-------|
| **Realm band** | `G.realmIdx` | Coarse; main “can you crush my son?” read |
| **Fame / renown** | `G.fame`, sect renown tiers | Jianghu **visibility**, not only power |
| **Recent deeds** | Incidents ledger, kill log | “You humiliated us *last week*” vs ancient slight |
| **Sect role** | Outer · registered · inner · core · elder · named heir — see **Backing layers** | Outer disciple ≠ patriarch’s closed-door pupil |
| **Backing** | Org tier × role weight + patron link ([`jianghu-organization-types.md`](jianghu-organization-types.md)) | Great sect **name** vs **who you are inside it** |
| **Gear / aura display** | Stretch — luxury gear → [`world-standing-and-property.md`](world-standing-and-property.md) visibility | Optional appetite modifier, not required v1 |

**Counterparty — who is judging**

| Actor | Reads |
|-------|--------|
| **Individual NPC** | Own realm vs player, impression/trust, personality (`proud_*` overestimates self; `schemer` prefers shadow) |
| **Clan / house org** | House apex band (seat tier table), `lean`, heir flag, **public reputation tier** |
| **Sect** | Sect diplomacy rep, alignment branding, grudge rules |

Use a simple **power index** per side for v1: realm band + optional org apex band + small fame/renown bump — not a full combat sim. Goal: *plausible hesitation*, not perfect prediction.

### Backing layers (org × role)

**Backing is not one flag.** Counterparties read:

```text
effectiveBacking =
  orgTierWeight(great_sect | mid_hall | clan | none)
× roleWeight(outer | inner | core | elder | direct_pupil)
+ optionalPatronBonus(named_elder | city_seat | imperial_touch)
```

| Sect role (player) | Fiction | Retaliation risk from outsiders |
|--------------------|---------|--------------------------------|
| **Outer / probationary** | Name on the ledger; sect may deny you | **Low** — noble house may strike *you* and **pay compensation later** if heat stays small |
| **Registered / inner** | Sect will ask questions | **Medium** — open kill triggers diplomatic beat |
| **Core / named disciple** | Master’s face tied to yours | **High** — proxy duel or sect envoy first |
| **Elder / representative** | You *are* sect face in city | **Very high** — attack = org incident |

Same **great sect** on the robe: killing an **outer** is “discipline our trash or accept stones”; killing a **core** is “declare war or grovel.”

**Org tier** sets the **price of compensation** and whether the sect **notices** at all (lesser hall outer vs Celestial Sword outer).

Store on player: `sectAffiliation { orgId, role, publicRobe }` — robe may lie under [`disguise-and-public-identity.md`](disguise-and-public-identity.md) until blown.

### Grudge levels (severity ladder)

Separate **grudge level** (what the debt *is*) from **heat** (how hot it burns this month).

| Level | Typical incident | Counterparty goal | vs low backing | vs high backing |
|-------|------------------|-------------------|----------------|-----------------|
| **1 — Sl slight** | Rudeness, small cheat | Save face, warn | Cold shoulder | Ignore / clerk note |
| **2 — Grievance** | Robbery, insult, lost money | Compensation, lesson | Beatings, hirelings | Formal letter, law |
| **3 — Vendetta** | Public humiliation, maim, repeat offense | Name cleared | Ambush, hunters | Challenge, sect petition |
| **4 — Blood** | Kill kin, heir, sworn ally | Life for life | Open hunt | Shadow + compensation politics |
| **5 — Clan stain** | Mass kill, sect disciple dead, charter breach | Exterminate / trial | Total war local | Org thread + imperial attention |

**Level** set at thread spawn from incident type + targets (heir, seat holder). **Heat** ticks up/down with beats, time, bribes, new incidents.

**Dossier legibility:** show level in fiction voice (“House Pei: **grievance**” not “level 2”) — aligns with heat band.

### Appetite score (sketch)

Conceptual formula — tune in data, not prose:

```text
grievanceLevelBase         (1–5 from incident)
+ heatDrift
+ personalityAggression
- powerGapPenalty          (realm vs player)
- backingShield            (org tier × sect role — outer shield weak)
- apexRisk                 (their patriarch vs your patron)
+ nobleBoldness            (clan tag: “will touch outers, pay later”)
```

**Noble-clan boldness (owner lean):** A **martial house / noble clan** may **appetite-medium** strike even a **great-sect outer** on level **2–3** if face demands response — then offer **compensation** (`letter_choice` · stones · grovel) before escalating to level 4. They are betting the sect **does not spend political capital** on an outer. Wrong if player is secretly core or incident was **blood**.

**Retaliation ceiling:** `min(grudgeLevel, maxBoldness(org, appetite))` caps beat severity — level 4 thread does not spawn apex hunter if backing shield wins *unless* heat maxed or heir flag.

| Band | Typical behavior |
|------|------------------|
| **Low appetite** | Rumor only, cold shoulder, report to patron, wait for player to leave tier-4 pond |
| **Medium** | Formal letter, compensation demand, challenge board in **their** venue |
| **High** | Hunters, ambush, sect proxy fight |
| **Obsessed** | `grudge_keeper` / blood debt — ignores gap (may still pick **shadow** if face demands) |

**Examples:**

- QC nobody slaps a **named GC heir** in a 3rd-tier city → house appetite **high**, modality likely **formal** (duel summons) or **legal** (yamen) — not a back-alley thug unless `lean: graft`.
- QC nobody with **no sect** kills a bandit chief’s son → chief appetite **high**, modality **open** (they think they win).
- Player backed by **feared** sect renown + high realm → weaker clan appetite **low** unless incident severity 5 or heir killed — then they **escalate sideways** (see face).
- **Noble son** slaps **great-sect outer disciple** (level 2) → house **bold**: steward beats you in alley; chronicle later *“House Pei sends stones to the sect hall — an outer was not worth a war.”* Same house, **core disciple** (level 2) → **envoy + compensation demand**, no alley.
- Incident escalates to **blood** (level 4) → compensation window **closes**; backing shield matters less.

### Face calculus (public vs shadow)

**Face** here means: *reputation cost to the aggressor if the response is seen*. It picks **modality**, not whether the grudge exists.

| Input | Effect |
|-------|--------|
| **`witnesses` / `humiliation_public` on incident** | Counterparty **must** respond or lose face; method still varies |
| **Location tier** | Threshold / capital / tournament month → more **public** optics |
| **Org brand** | `righteous_charter` · `imperial_clan` · `merchant_guild` · `martial_house` · `hidden_evil` · **`face_first`** · **`martial_fair`** (data tags on org/clan packs) |
| **Relative status** | High-status clan vs unknown cultivator: winning a **street brawl** can look **petty or bullying** |
| **Player fame** | Famous victimizer → public defeat of player **gains** face; failed public attack **hurts** |

**Modality rules (owner lean):**

| Profile | Prefers when face-sensitive |
|---------|----------------------------|
| **Righteous / charter sect / imperial kin** | Petition law, **duel under witness**, “righteous punishment” framing; **avoid** alley knife in market |
| **Same, but schemer seat holder** | Public apology demand + **private** assassin / poison / bounty — [`npc-betrayal.js`](../../npc-betrayal.js) beats |
| **Martial house / bandit kin** | Open challenge, hunt in wilds — public brawl OK if honor narrative fits |
| **Merchant / clerk lean** | Economic squeeze, deed contest, hire blades — minimal public violence |

So: a **great righteous sect** whose disciple you wronged might **not** send ten disciples to jump you at the inn. They send **one envoy**, a **formal challenge**, or a **bounty through gray guild** — fiction matches “we are righteous” without giving the player a free pass.

### Backing asymmetry (sect vs lone cultivator)

When **player backing ≥ counterparty apex**:

- Appetite may drop to **wait** or **legal/economic** pressure only.
- Face logic flips: *they* cannot afford to lose in public either — stalemate, poison, or targeting **weak ties** (disciple, caravan, residence) per [`world-standing-and-property.md`](world-standing-and-property.md).

When **counterparty ≫ player**:

- Appetite high but modality may be **contemptuous** (send a steward, not the patriarch) unless you killed an heir.

Store on thread: `lastAppetite`, `preferredModality`, `publicFacePressure` (0–100) so beats stay consistent across months.

### New beat types (face-aware)

| Beat | When |
|------|------|
| `formal_challenge` | Public venue; honourable path; timer to accept/flee/forfeit face |
| `law_petition` | City seat / charter — arrest, fine, ban from market |
| `shadow_bounty` | No giver name; hunter thread; righteous org **deniability** |
| `economic_squeeze` | Refuse service, price spike, license revoke |
| `proxy_duel` | Send champion disciple — org saves apex face |
| `forbear` | Chronicle: “House X watches silently” — dormant thread, heat decays unless provoked again |
| `compensation_offer` | Noble/clerk lean after low-level hit on weak backing — stones, public apology; accept → heat down, level may stick |
| `sect_inquiry` | Great sect asks if outer worth defending — player choices affect future shield |
| `clan_summons` | Escorted to manor/hall for **compensation parley** — see below |

### Clan summons (compensation parley)

**Owner lean (2026-09-23):** Not every beat is a beatdown. When **backing is roughly even** and the wound is **social not mortal** (humiliated heir, maim-lite, heavy beating but alive), a proud house often prefers **drag you to the clan** and ask *how you will compensate* — face for them (authority on their ground), leverage for you (talk before blood).

This is still a **thread beat** (cause-linked), but plays like a **set-piece event**: travel interrupt, short scene, choices — same shell as cultivate interrupt or a story stage, not a separate orphan quest.

**When to pick `clan_summons` over ambush**

| Favor summons | Favor ambush / hunters |
|---------------|------------------------|
| `grudgeLevel` 2–3 (grievance / vendetta, **not** blood) | Level 4–5 or heir **killed** |
| Victim tie: **heir**, young master, named scion — **alive** | Witnesses + they want hide deniability |
| `\|backingPlayer − backingHouse\|` within **parity band** | Player backing ≪ house (contempt alley) or ≫ house (they use law/shadow) |
| Org lean: martial house, noble clan, merchant (contract room) | `schemer` + high face pressure → skip open summons |
| `publicFacePressure` high — spectacle on **their** turf | Player fled twice — skip talk |

**Scene shape (sketch)**

1. **Find you** — inn, road, city gate (recognition check; disguise may delay).
2. **Escort** — resist → fight + heat; comply → no free damage if you don’t run.
3. **Hall** — elder / steward; victim visible or absent.
4. **Choices** (examples): pay stones · public apology · serve term · hand item · accept duel later · name your sect to share blame · **refuse** → thrown out, heat +1, next beat hunters.
5. **Outcome** — incident `compensation_settled` or thread dormant with level maybe lowered; chronicle + dossier update.

**Why parity matters:** If you’re a nobody outer, they may not ** bother** with a hall — alley + compensation by mail. If you’re equal backing (your sect’s inner vs their heir), summons is the **honorable default** before both sides lose face in the street.

**Player fantasy:** “I punched the young master and lived because his uncle wanted **terms**, not a corpse.” Still tension — wrong tone and you’re kneeling in the hall or dead in the courtyard.

**Event type note:** Implement as `registerWorldEventHandler('clan_summons', …)` **or** thread stage firing the same handler — one handler, two schedulers. Prefer thread-owned payload `{ threadId, houseId, victimUid }` so the parley knows **why** you’re there.

### v1 vs later

| v1 (personal grudge) | Later (clan / sect threads) |
|----------------------|-----------------------------|
| Individual appetite from realm + impression + personality | Org tags + backing index |
| Wilderness vs settlement flag only | Full face tiers + challenge board UI |
| Open ambush vs converse coldness | Shadow bounty, proxy duel, law petition |

[`qc-cultivate-excitement.md`](qc-cultivate-excitement.md) v1 stays **personal enemies**; when sect-face threads land, interrupts must respect **modality** (no righteous sect alley ambush in capital without a flag).

---

## Escalation packs (what you author)

Author **packs**, not 500 quests. Each pack: trigger conditions + stage list + personality/org modifiers.

### Example pack — `clan_blood_debt`

**Trigger (sketch):**

- Incident `kill` or `humiliation_public` where `target` has `tie: clan_heir` or seat holder with `fateSeed: wrong_enemy`
- Or kill logged + target carries `clanId` in NPC data

**Stages (sketch):** each stage runs **appetite + modality** pick before firing.

1. **Word spreads** — rumor beat; optional visibility bump ([`world-standing-and-property.md`](world-standing-and-property.md))
2. **Envoy or summons** — parity + live heir → **`clan_summons`**; else `letter_choice` / `formal_challenge`; shadow if righteous + player strong
3. **Pressure** — `economic_squeeze` or standing hit; skip open raid if `publicFacePressure` high
4. **Hunters** — `spawn_hunter` (wilds) or `proxy_duel` (send champion) — not both unless heat maxed
5. **Apex** — optional authored beat if player ignored N stages; apex only if appetite still high **and** modality allows public apex (or story override)

**Personality modifiers:**

| Synergy | Effect |
|---------|--------|
| `grudge_keeper` | Slower decay, +heat on insult incidents; may force high appetite when others would forbear |
| `schemer` | Shadow modality bias; `betrayal` beat instead of open fight |
| `proud_*` | Overestimates power → higher open-fight appetite; still prefers witnessed duel over ambush |

**Relationship modifiers:**

- High trust with a **different** clan member might unlock “appeal to patriarch” branch
- Negative trust with victim → skip envoy, jump to hunters

### Example pack — `personal_grudge` (v1)

Smaller scope — maps directly to cultivate interrupt design:

- Trigger: impression/trust threshold, `dueledPlayer`, story `fate: enemy`, kill-log link
- Stages: single interrupt → optional repeat if heat high
- Good **first implementation** of thread + beat without full clan sim

### Example pack — `kill_log_kin` (stretch)

- Trigger: kill where victim had `kinUid` or procedural “brother” spawn rule ([`qc-cultivate-excitement.md`](qc-cultivate-excitement.md) open question)
- Stages: rumor → grudge_interrupt → resolve or chain into `clan_blood_debt` if kin is connected

---

## Who cares? (ties — minimal graph)

Full NPC social sim is **out** ([`dustbone-living-board.md`](dustbone-living-board.md)). Enough links to propagate:

| Tie | On |
|-----|-----|
| `clanId` / `houseId` | NPC or civic seat holder |
| `patronOrgId` | Sect, merc guild, yamen |
| `kinUid` | Optional explicit relative |
| `seatRole` | `city_lord`, etc. — institutional response |
| `storyId` | Authored NPCs |

**Rule:** when an incident fires, walk **target’s ties** (1 hop default, 2 hops for `severity >= 4`). Each matching org/clan checks org **temperament** (martial vs legalistic) to pick pack variant.

Civic seats: killing the “son of the lord” is different if the lord seat is `lean: martial` vs `clerk` — same engine, culture/tier tables like civic generator.

---

## Scale ladder (don’t mix fiction)

| Scale | System | Example |
|-------|--------|---------|
| **Personal** | Situation threads | Grudge, kin revenge, betrayed merchant |
| **Org** | Factions + scheduler | Grudge sect raid, phoenix war advance |
| **Civic** | World events doc | Beast wave conscription |
| **Authored** | STORY_ARCS | Liang Chen, caravan, legacy chain |

Personal threads **may** escalate into org standing (clan puts bounty) but should not instantly become “world war.”

---

## UI / narrative

- **Chronicle Jianghu tab** ([`chronicle-and-projects.md`](chronicle-and-projects.md)): prose lines from beats — primary “what’s happening”
- **Quest journal**: optional mirror for players who want a checklist — title from template + participant names
- **No objective spam:** stages can be hidden until rumor fires (“something is coming”) — fits non-linear play

### Jianghu dossier (player-facing “what the world thinks”)

A dedicated **Diary tab** (or sub-panel): **Your name in the jianghu** — slightly meta, but matches cultivator introspection / “know thyself on the path.” Not a combat spoiler screen; a **legibility layer** so chaos stays readable when threads multiply.

**Split two ledgers in UI copy:**

| Ledger | Player sees | Source |
|--------|-------------|--------|
| **Public record** | What others plausibly believe | Witnessed incidents, rumors fired, public duels, sect announcements |
| **Your memory** | What *you* did (fuller) | Same incident log, including private acts — may note “not yet spread” |

Immersion line: *“The jianghu is wrong sometimes. What spreads is what kills you.”*

#### Sections (sketch)

| Section | Content | Precision |
|---------|---------|-----------|
| **Displayed strength** | Realm band **as known** (not true realm if hidden) | Bands: “Rumored QC” · “Seen at FE early” · “Confirmed GC” — from public fights / breakthrough witness / boasts |
| **Arts shown** | Named techniques or tags seen in public combat | Signature ledger — drives recognition under disguise ([`disguise-and-public-identity.md`](disguise-and-public-identity.md)) |
| **Face / name** | Alias, fame tier, “face known in X zones” | Tied to fame + visibility ([`world-standing-and-property.md`](world-standing-and-property.md)) |
| **Backing (known)** | Sect robe, hall, patron — **only if displayed** | “Disciple of …” vs “Unaffiliated (rumors say …)” if uncertain |
| **Enemies & debts** | Persons · clans · sects · law | Filters + sort by heat; see below |
| **Allies & credit** | Callable favors + major goodwill only — see **Favor ledger** | Stops dossier feeling like pure punishment |

#### Enemy list — how much to tell?

**Owner lean: retrospective yes, predictive no.**

| Show | Hide |
|------|------|
| **That** House X or NPC Y bears a grievance (once rumor or envoy fired) | **When** the next beat fires |
| **Category** of grudge in fiction voice: “blood debt,” “public humiliation,” “broken contract” | Exact beat type (`shadow_bounty` vs `formal_challenge`) |
| **Hint** tied to *past* public facts: “After the bazaar incident…” | “Prepare for ambush in Dustbone” |
| **Grudge level + heat band** (slight → blood; cold · warm · burning) | Numeric stage index / scheduler |

Private/shadow threads: list as **“Unknown party”** or **“Whispers, no name”** until a rumor beat names them — righteous sect shadow play stays deniable in-fiction.

**Why not full transparency?**

- Full “you did X → they will Y” turns the game into a **retribution checklist** and pushes optimal pacifist play — bad for rogue cultivator fantasy.
- Zero feedback makes threads feel like **random jumps** — bad for learning and for “I pissed off everyone” manageability.

**Middle path:** dossier is a **mirror of incidents + surfaced threads**, not the thread AI’s plan. Player can prepare **generally** (leave clan lands, don’t cultivate exposed, buy guards) without dodging every scheduled beat.

**Owner lock (2026-09-23):** Legibility replaces a “main quest.” The player should know **they have enemies** and roughly **why / how hot**, but not **when** or **how** retaliation arrives. That forces a real choice: *how much do I prepare vs can I move on to the next thing?* — cultivation, travel, opportunity, seclusion — without the UI prescribing a single correct path. No main quest arrow; **direction**, not **solution**.

Optional **accessibility / tone** toggle (settings):

| Mode | Feel |
|------|------|
| **Jianghu voice** (default) | Rumor prose, bands, vague heat |
| **Blunt** | Same facts, shorter labels — still no beat timers |

Do **not** gate difficulty on the toggle; only wording density.

#### Filters (when the list explodes)

- Type: **Persons** · **Clans/houses** · **Sects** · **Law/charter** · **Unknown**
- State: **Active** · **Dormant** · **Settled**
- Zone: where grudge is loudest
- Sort: heat · recent · alphabetical

Cap **pinned** entries (3) for “main feud” without hiding the long tail.

#### Relation to other UI

| Surface | Role |
|---------|------|
| **My path** chronicle | Story of your life |
| **Jianghu dossier** | Structured **status** — skimmable |
| **Quest journal mirror** | Optional objectives for players who want tasks |
| **Rumor inn lines** | First hint before dossier row appears |

Dossier rows **unlock** when the world would plausibly know — not at incident write for secret kills.

#### Phasing

| Phase | Dossier |
|-------|---------|
| P0–P1 | Manual-ish: fame, sect tag, story `fate: enemy`, kill-log names after rumor |
| P2+ | Thread-driven rows, heat bands, org/person filters |
| P3 | Known vs true realm, arts shown, backing uncertainty |

---

## Phased build (when implementing)

| Phase | Deliverable |
|-------|-------------|
| **P0** | Incident recorder API; `personal_grudge` thread; hook grudge interrupt picker to active threads |
| **P1** | Scheduler beats + rumor + chronicle; thread caps + resolve paths |
| **P2** | Kill-log kin + `clan_blood_debt` pack; NPC/seat `clanId` on holders |
| **P3** | Appetite + modality picker; org face tags; challenge board vs shadow beats |
| **P4** | Cross-thread arbitration (two clans both hunting — pick or merge) |

---

## Sim depth — gaps & high-value additions

What we have covers **personal → org retaliation**, **face/modality**, **backing layers**, **dossier legibility**, **disguise/signatures**, and **clan parley**. For a deep xianxia sim, these are the main **missing pieces** worth designing next (not all v1).

### Rumor propagation (design — was mentioned, now specified)

Incidents do **not** instantly update every org’s dossier. Each incident gets **spread** state per `(zoneId | orgId)`:

| Stage | Meaning | Typical trigger |
|-------|---------|-----------------|
| **unknown** | No local belief | Private kill, no witnesses |
| **whisper** | Inn/scatter gossip | 1+ witness, or rumor broker |
| **known** | Locals treat it as fact | Time + travel along trade routes, or envoy |
| **posted** | Charter poster / sect bulletin | High level, law, or org push |

**Spread ticks** on world clock (monthly): move along **adjacency** (Redwell → mid city → Threshold) at speed `f(severity, witnesses, fame, org PR push)`. Beats like `rumor_tick` fire when a zone **crosses** a threshold — thread may stay **dormant** until `known` in *that* zone.

**Player levers:** silence witnesses (hard), bribe broker, flee zone before `posted`, disguise delays **link** not erase ledger.

**Existing crumbs:** inn rumor lines ([`redwell-starter-city.md`](redwell-starter-city.md)), Merchant Su `rumorCost`, Wei template quests — **re-use UI**, new **`spread` model** on incidents.

---

### Favor ledger (credit — big debts only)

Mirror grudge threads with **`favor` / `credit`** entries — not a log of every kind act.

**Record when:**

- Incident type in **favor tier** table: saved named NPC/heir, returned clan relic, tournament forfeit to give face, major sect aid, etc.
- Witnesses or recipient org **acknowledges** (beat: `gratitude_ack`).
- Optional **collectible**: recipient flags `owesPlayer` until **called in** (one major ask: escort, loan, sanctuary, speak at parley).

**Do not record:** random street help, small coin, generic “merciful” converse — those stay **alignment/fame** only if anything.

**Dossier:** **Allies & credit** — short list (cap ~8 active), each row: who · what you did (past tense) · **callable?** · heat/decay. Callable favors are gameplay; passive goodwill is mood only.

**Scale:** same **grudge levels** inverted lightly (1 = courtesy, 3 = life debt, 5 = clan owes survival) — tune separately.

---

### Home sect discipline (genuine vs show)

When **your** actions threaten sect face, spawn **`sect_discipline`** thread (`orgId = playerSect`) — may run **before** external `clan_summons`.

| Mode | When | Beats |
|------|------|-------|
| **Genuine** | You wronged ally sect, broke charter, outer caused war scare | Hall punishment, strip rank, pay from **your** stones, expulsion risk |
| **Show** | External org demands blood but sect wants peace | Public **three lashes**, kneel, small compensation — **heat down** on external thread; sect standing cost to you is real but survivable |

Picker: `externalGrudgeLevel`, `playerRole`, sect doctrine tag, `compensation_offer` on other thread pending.

Same **`clan_summons`** scene shell; dialogue source is **your elder**, not House Pei.

---

### Player-initiated aggression (elaborated)

**Not a “start thread” menu.** You initiate by **doing things in the world** that write incidents — rob, challenge, steal, declare sect grudge, public humiliation. Each qualifying action can spawn the victim’s **response thread** (same engine as reactive grudges). Explicit actions (duel letter, extort choice in event) are just **clear** initiators; sneaky initiators still write incidents with witnesses optional.

Feuds are not only “you offended someone.” **Player is aggressor** when an incident lists `actor: player` and `provoked: true` on a **response thread** owned by target/org.

**How aggression starts (examples):**

| Player action | Incident | Who gets a response thread |
|---------------|----------|----------------------------|
| Rob / extort caravan | `robbery` | Merchant house, escort sect, story giver |
| Public duel challenge | `challenge_issued` | Target + their clan if heir |
| Kill in fight you started | `kill` + provoked | Kin/clan packs |
| `declare_grudge` (sect) | org incident | Rival sect diplomacy (existing hooks) |
| Steal from seat holder | `theft` | Civic org + law |
| Humiliate for sport | `humiliation_public` | Same as reactive — but **you** chose it |

**Flow:**

```text
Player commits act → incident (witnesses?) → spread rules apply
→ spawn/defend RESPONSE thread on victim org (they are “counterparty”)
→ appetite/modality on *their* side (may still clan_summons you if parity)
→ parallel: sect_discipline if you drag sect in
→ dossier: your memory always; public record when spread catches up
```

**Why it matters:**

- Rogue / demonic / ambitious paths stay viable without fake “you were attacked” framing.
- **Alignment & fame** skew from provoked incidents; dossier shows **you** as known aggressor in zones where spread landed.
- NPC **appetite** can be **low** if you picked on a weak target — backlash is **law/shame**, not duel (bullying optics).
- **Callable favors** can be **burned** if you later attack someone who owed you — incident `betrayed_credit`.

**Not every fight is aggression:** see **Clan pride & self-defense** — reasonable orgs honor `selfDefense: true`; some clans ignore it.

---

### Clan pride & self-defense (org temperament)

Not every house is insufferable — **mix org tags** so most honor proportionality; a few **pride** clans drive xianxia friction.

| Org tag | Self-defense | Fiction |
|---------|--------------|---------|
| **`pragmatic`** | Lowers level or drops thread | Merchant house, clerk lean — wants money not martyrs |
| **`martial_fair`** | Honors `selfDefense` if witnesses or clear bully | Respects counter-challenge |
| **`face_first`** | Often **ignores** self-defense — “you touched our blood” | Insufferable but **predictable** from dossier/rumor |
| **`imperial_kin`** | Law + face blend | May use yamen instead of alley even when angry |

**Rule:** on incident resolve, if `selfDefense: true` → apply tag modifier **before** thread spawn. `face_first` may still spawn at **claimed** severity (below).

Store tags on clan packs / civic seat culture tables — same place as `nobleBoldness`.

---

### Embellished reports (young scion lies — fair mechanic)

Novel beat: junior gets humbled, runs home, **embellishes** → clan mobilizes on a fiction. System needs **truth vs claim** without feeling like cheating RNG.

**Two records on one encounter:**

| Record | Contents |
|--------|----------|
| **`factualIncident`** | Engine truth: who struck first, `selfDefense`, severity, witnesses |
| **`claimedNarrative`** | What the scion told their house (may inflate level + erase self-defense) |

**When lies happen:**

- Victim NPC has **`embellisher`** personality and/or clan **`spoiled_heir`** frequency — not every loss.
- **No witnesses** → pride clans default to **claim** for spread; witnessed fights can still lie but player gets **rebuttal tools** (below).
- Lie **inflates** at most +1 level (e.g. bruised ego → “nearly killed”) — not instant blood debt from a slap unless tag extreme + no pushback.

**Spread uses claim** for `public record` until **`narrative_disputed`** or **`truth_beat`** resolves.

**Fair to the player (telegraph + counterplay):**

| Fairness lever | How |
|----------------|-----|
| **Telegraph** | Arrogant/scion personality before fight; inn rumor “House X’s youngest is thin-skinned”; clan tag known after first rumor |
| **Dossier split** | **Your memory** shows factual; **public** shows claim — mismatch flags **disputed** once you’ve heard the rumor |
| **Rebuttal window** | Beat between rumor and `clan_summons`/hunters: confront scion in public, produce **witness** NPC, charter **truth-seeking** array (city tier), callable favor (“he was bullying a junior merchant — I have names”) |
| **Parley option** | At summons, present evidence — success downgrades level/heat; failure means elder believes nephew |
| **Cost of truth** | Rebuttal takes time/stones — fits “prepare vs move on”; ignoring rumor lets claim harden (+heat) |
| **Comeuppance** | Rare: proven lie **burns scion face** — internal clan heat, player optional favor, elder ashamed (not required every time) |

**Self-defense + lie combo:** you fought back after bully scion struck first → factual has `selfDefense`; claim says “unprovoked attack.” **`face_first`** clan acts on claim until rebuttal; **`martial_fair`** clan may **`sect_inquiry`** or **`forbear`** when witness exists.

**Initiating vs lying:** if **you** truly provoked, rebuttal fails — no “I was innocent” minigame for real aggression.

---

### Strong fits (same engine) — remainder

| Addition | Why |
|----------|-----|
| **Resolution catalog** | Beyond pay/fight: **oath on contract** (break → heaven strikes?), **serve N years**, **marriage / adoption tie**, **hand technique copy**, **kowtow in public**. Level 2–3 summons become rich. |
| **Third-party lanes** | Charter **yamen**, **neutral hub** (market truce, Forgers charter hall), **jianghu mediator** NPC — beat type `arbitration_summons` when both sides high backing. |
| **Mortal vs cultivator lane** | *Parked until mortal civic play justifies it* — mortals **hire blades**, **petition law**, **slander**; same ledger, different pack ([`redwell-starter-city.md`](redwell-starter-city.md) mortals exist but aren’t feud drivers yet). |
| **Thread interaction** | Two active debts collide: House A hunt vs your B sect ally → merge, choose side, or `crossfire` beat. (P4 sketch.) |
| **Time & seclusion** | Heat decays in dormancy; **blood level** barely decays; long seclusion pauses beats but not ledger; world moves (posters appear when you emerge). |
| **Counter-disguise** | Soul lamp, karma tie, **fate** hooks ([`chronicle-and-projects.md`](chronicle-and-projects.md) fate-rite), **framed signature** — someone else uses your art. Deep cover stays risky late game. |

### Player agency & power fantasy

| Addition | Why |
|----------|-----|
| **Patron intervention (limited)** | Once per arc: call master/elder — cancels one beat, costs face/ debt to sect. Not a reload button. |
| **You as hunter** | Bounty board reads **your** threads from enemy side — same ledger, reverse role. |
| **Founded sect / hall** | When player is org apex, threads hit **your disciples/caravan** as weak ties ([`player-organization-paths.md`](player-organization-paths.md)). |

### Already sister docs — wire in, do not duplicate

| Topic | Doc |
|-------|-----|
| Property / weak ties | [`world-standing-and-property.md`](world-standing-and-property.md) |
| Civic / war scale | [`world-events-layered-battlefield.md`](world-events-layered-battlefield.md) |
| Alignment & “righteous” fiction | [`alignment-sacrilege-corruption.md`](alignment-sacrilege-corruption.md) |
| Imperial / charter law | [`imperial-clan.md`](imperial-clan.md) · [`city-tiers.md`](city-tiers.md) |

### Park (depth creep)

- NPCs feuding among themselves off-screen (Taiwu full sim — [`dustbone-living-board.md`](dustbone-living-board.md) already parked).
- Full procedural marriage / heir politics.
- Every technique as unique signature (curate **signature tier** on arts/weapons).

**Build order hint:** rumor propagation + positive threads + home sect discipline pay off immediately after P1 threads; arbitration + resolution catalog before more combat beats.

---

## Open questions

- [ ] Thread vs existing `STORY_ARCS`: can an arc **spawn** a thread on fail/betray path only, or always?
- [ ] Player-initiated feuds (`declare_grudge` analog for NPCs)?
- [ ] De-escalation economy: blood money amounts by city tier × org tier × grudge level?
- [ ] Sect **defends outer** automatically or needs player merit / elder quest?
- [ ] Grudge **downgrade** via compensation — can level 3 → 2, or only heat?
- [ ] Summons **refusal** — instant combat in courtyard vs escape chase beat?
- [ ] Can player **counter-summon** (request duel on neutral ground instead of their hall)?
- [ ] Permadeath of thread NPC — thread transfers to org or ends?
- [ ] Wei-style **opportunity** world quests vs **consequence** threads — same UI or separate tab?
- [ ] Org **brand tags** — one enum per great sect / clan pack, or derive from alignment + charter fiction?
- [ ] Player **forfeit face** — skip duel → thread heat vs permanent standing hit?
- [ ] Assassins guild as universal shadow sink vs per-org hired blades only?
- [ ] Dossier **Blunt** toggle — default off; copy-only or also show heat numbers?
- [ ] “Your memory” private incidents — always visible to player or locked behind Soul Search / high insight perk?
- [ ] Favor **call-in** — one active request per creditor or cooldown?
- [ ] Rumor **speed** — fixed adjacency vs caravan-linked?
- [ ] Show punishment — player opt-in to elder or forced?
- [ ] Embellish **max inflate** — always +1 level or tag-dependent?
- [ ] Witness jade / recording treasure — mandatory for rebuttal or optional hard mode?

---

## Implementation crumbs

`world-scheduler.js`, `story-arcs.js` (`worldEventQuests` mirror pattern), `quests.js` (`npcKillLog`, `addNpcQuest`), `npc-converse.js`, `npc-betrayal.js`, `factions.js` / sect grudge, `data.js` `WORLD_EVENT_TEMPLATES`, civic seats holder shape in [`civic-seats-generator.md`](civic-seats-generator.md).
