# Soul Root Dao — five branches, ladder unlocks, inherited skills

| Field | Value |
|-------|-------|
| **Status** | `designed` (ladder + unlock stagger + benchmark stubs — not implementation) |
| **Blocked on** | [`stats-to-meters-rework.md`](stats-to-meters-rework.md) (guards, Focus); nine-realm `PATHS.soul` ship; Root Dao row in [`law-taxonomy.md`](law-taxonomy.md) |
| **Issue** | none yet |
| **Chat / PR** | Cloud design chat 2026-10-13 — spirit ladder + branch benchmarking |
| **Updated** | 2026-10-13 (branch apex fiction; society menace; Illusion + Memory) |

## Intent

**Root Dao (根道)** is the spirit lane’s **purview layer** — exactly **five** branches, not the same shelf as Art Great Daos (Sword, Poison, …). A spirit-primary cultivator **walks one or two branches** to idx 6–7, earns **lesser → greater inherited expressions** as realms rise, and uses **manuals** as stylized applications (see § Skill sources).

This doc ties **nine-realm spirit names** ([`nine-realm-ladder.md`](nine-realm-ladder.md)) to **when branches open** and **how strong inherited skills should feel** vs generic `soul_condensation` ([`spirit-path-full-design.md`](spirit-path-full-design.md)).

**Inherited skills:** formal **expression tiers** (below) — you **gain more arts over the ladder**, not just two and done. **Greater** means **second tier of the same branch**, not “better version of the first skill only.”

**Five branches (locked for now):** Karma · Fate · Memory · Illusion · **True Self** (真我 — Personal God home; not “Ego Dao” in UI).

**Parity (owner 2026-10-13):** spirit is **not** mainly “win the duel.” People fear soul cultivators because of **jianghu and chronicle** power — and because **each Root Dao at its pinnacle** is a worthy xianxia threat on its own ([§ Branch apex fiction](#branch-apex-fiction-owner-lock-2026-10-13)). Lower **innates** stay fight-fair; **supreme + statute** (primary branch) deliver peak menace — **constrained in systems**, unlimited in **fiction**. Manuals spread **styles** and softer mid-tier access; worst acts still **stain**. See § Society menace.

---

## Society menace vs combat kit

### Fantasy (why NPCs flinch)

| Fear | Branch home | When it shows |
|------|-------------|----------------|
| “They **know** what I hid” | **Memory** | Reads, ledger marks, tribunal confession |
| “I can’t trust my **eyes** or witnesses” | **Illusion** | False presence, forged scene *(manual)* |
| “Old debts / blood feuds might **wake**” | **Karma** | Thread tug, feud recall, stain amplification *(upper + manuals)* |
| “Our clan’s **luck** could turn” | **Fate** | Nudge outcomes, omen, marriage/exam bias *(upper + manuals)* |
| “They could **remake** or **bind** me” | **Memory** apex *(+ stain)* | Life-format / puppet — not idx 2 innates |
| “Blood washes blood **by itself**” | **Karma** apex | Thread-weave feuds |
| “The **sect’s luck** died” | **Fate** apex | Area / institution fortune collapse |

Threat tone: **insidious** — unknowable **future** harm, not only HP today. Fits [`heaven-cycle-and-apexes.md`](heaven-cycle-and-apexes.md) soul stigma and Void Temple watching soul tampering.

### Two channels (design rule)

```text
  INNATE lesser → greater
       │  Tilt per branch (Illusion/Memory skew early; Karma/Fate skew late)
       │  Combat-fair band + light social
       ▼
  INNATE supreme → statute (PRIMARY branch)
       │  **Branch apex fiction** — peak menace ([§ Branch apex fiction](#branch-apex-fiction-owner-lock-2026-10-13))
       │  Hard caps: scope, cost, strain, counters, chronicle hooks
       ▼
  MANUALS
       │  Variants, sect styles, **earlier/weaker** expressions of apex themes
       ▼
  STAIN / SACRILEGE (worst acts)
       Full puppeting, mass fate-break, cycle tampering — ledger + tribulation — [`alignment-sacrilege-corruption.md`](alignment-sacrilege-corruption.md)
```

**Owner lock (2026-10-13):** apex horror is **on the branch**, not only black-scroll flavor — but **implementation** never gives a menu “delete empire” button; it gives **bounded clauses** that *feel* like the fiction.

### Branch → menace vector (summary)

Full peak fiction: [§ Branch apex fiction](#branch-apex-fiction-owner-lock-2026-10-13). Innates **tilt** toward combat vs chronicle by branch; **supreme/statute** always expresses apex for **primary** walkers.

| Branch | Early inherit tilt | Peak menace (fiction) |
|--------|-------------------|------------------------|
| Illusion | Combat control | **Thought → real** strike / hazard |
| Memory | Intel, reads | **Life rewrite → puppet** |
| Karma | Stain, marks | **Organic bloodshed** via thread weave |
| Fate | Telegraph, nudge | **Sect / empire fall** via fortune collapse |
| True Self | Defense | *(open)* — likely **un-ownable self**, Personal God |

### Memory & Illusion — adjust innates?

**Owner lean:** **keep current combat innates** (Misdirecting Gaze, Hollow Double, Surface Inscription, Soul Search). **Add** explicit **jianghu hooks** on existing tiers + **manual catalog stubs** — no rewrite required.

| Art | Combat (unchanged) | **+ Society hook** |
|-----|-------------------|---------------------|
| Surface Inscription | Telegraph / one hidden buff | Dialogue **lie hint**; NPC **unease** flag if spirit path known |
| Soul Search | Deep probe in fight | Explore **secrets**; elders **refuse private audience** reputation |
| Misdirecting Gaze | Misread next hit | **Not** overworld identity forge — that stays **manual** |
| Hollow Double | One-hit decoy | — |
| The Record Endures | — | **Known** mark drives recognition / grudges / cannot “forget” you |
| The Lie Holds | — | Illusions in **social scenes** (if any) get extra beat — manual-heavy |

**Manual examples (balance gate — not granted free):**

| Manual tag | Branch | Effect sketch | Risk |
|------------|--------|---------------|------|
| `memory_jianghu` | Memory | **Confession Seal** — long rite, target reveals one quest truth | Tribulation / witness |
| `memory_jianghu` | Memory | **Witness Rubbing** — copy what they saw (not invent) | Evidence chain |
| `illusion_jianghu` | Illusion | **False Presence** — you were seen at X (illusion, not Memory) | Countered by Memory reader |
| `karma_forbidden` | Karma | **Feud Wake** — surface old blood debt thread on a family | Stain lean |
| `fate_forbidden` | Fate | **Clan Omen Pin** — bias one upcoming situation roll | Heaven notice at threshold |

Generic `soul_condensation` stays **fight dialect**; **jianghu** scrolls use separate shelf tag or `context: combat | jianghu | forbidden` so UI doesn’t mix “Soul Lash” with “Soul Bind.”

### Player-facing tone

Sect pamphlets and rumors: *“Don’t draw a soul cultivator’s gaze at the banquet — the duel might be even, but your secrets aren’t.”* At **idx 7**, rumors name the branch: *“He wears the Lie as law.”* / *“She edits lives like scrolls.”*

---

## Branch apex fiction (owner lock 2026-10-13)

**Rule:** anything taken to the **pinnacle** of a Root Dao is a **worthy threat** — xianxia scale. Game expresses that through **supreme + seated statute** (primary branch), not through basin lesser skills. **Balance** = constraints below, not weak fiction.

### Shared constraints (how peak stays playable)

| Lever | Use |
|-------|-----|
| **Scope** | One foe, one scene, one clan thread, one “real rule” at a time — no instant map wipe |
| **Cost** | Focus drain, **soul strain**, lifespan, rare materials, months-long rite for worst outcomes |
| **Telegraph** | NPCs and UI show **omen** / **Known** / **thread tug** before payoff lands |
| **Counters** | Equal-realm **True Self**, Memory reader, clarity wards, Void Temple attention, tribulation |
| **Chronicle** | Empire/sect fall = **situation-thread cascade** ([`jianghu-situation-threads.md`](jianghu-situation-threads.md)), not one click |
| **Stain** | Mass puppeting, forced mass killing, cycle tampering → **sacrilege** escalates future gates |
| **Manuals** | Softer or partial versions **before** supreme; apex inherit still **best** expression for primary |

**Inheritance tilt:** Illusion & Memory peak **can** include terrifying **combat-real** outcomes; Karma & Fate peak skew **jianghu / institution**; True Self TBD but likely **anti-domination** + godhood runway.

---

### Illusion (幻) — *假作真*

**Peak fiction:** an illusionist at the summit can make **real**, for purposes of harming you, **essentially anything they can hold in mind** — weapon, terrain, beast, calamity — not cartoon omnipotence: **one declared form**, **one bounded law** (“this bite counts,” “this wall blocks”).

| Tier | Expression |
|------|------------|
| **Supreme** | **Weight of the Unreal** — one imagined form, **one real rule**, short window (evolved from current stub) |
| **Statute** | **The Lie Holds** — your illusions gain **legal weight**: they fail slower, resist first dispel, can **stack one clause** (e.g. declared hazard persists N beats / one scene flag) |
| **Manuals** | False witness, crowd haze — **partial** realification before supreme |

**Counters:** Memory **truth read**, True Self anchor, “too absurd for realm” hard cap, strain if form exceeds mass/realm budget.

---

### Memory (忆) — *改忆塑命*

**Peak fiction:** a memory dao apex can **rewrite the narrative of a life** — format identity, loyalties, remembered oaths — until the person is a **perfectly obedient puppet** (genre: soul formatting / 夺忆).

| Tier | Expression |
|------|------------|
| **Supreme** | **Vault Unsealing** — pull/seal one **deep layer** (identity, oath, technique memory) |
| **Statute** | **The Record Endures** → apex lean **Life Ledger**: successful deep work leaves **editable Record** — long rite **Format** puppet (obedience flags, not combat bot in basin) |
| **Manuals** | Confession, witness copy — **read/edit surface** without full statute |

**Constraints (mandatory):** **time + rite**, target will/True Self contest, **heavy stain** on full puppet, Void Temple / heaven notice, **reversible** only at extreme cost (genre rare). **Not** instant turn-1 dominate in duel — **chronicle horror**.

**Counters:** True Self primary, supreme anchor, grotto wards, killing the formatter mid-rite.

---

### Karma (因果) — *织业杀机*

**Peak fiction:** weave **karma threads** so targets **organically** move against each other — old debts wake, cousins “remember” blood feuds, guards look the other way — **no single mind-control button**; the world **finds reasons**.

| Tier | Expression (stubs — detail on Karma pass) |
|------|---------------------------------------------|
| **Lesser / greater** | Weight Sense, Ledger Mark — stain read, setup mark |
| **Supreme** | **Thread Weave** *(working)* — link 2–N marked parties; situation engine raises **feud / betrayal / accident** proc |
| **Statute** | **Debts Come Due** *(working)* — passive: marked names **accumulate** karmic coupling; one **Invoke** per season forces a **thread event** (duel, raid, denunciation) |

**Manuals:** Feud Wake, amplify stain on a house — weaker weave.

**Counters:** merit temples, karma purification, imperial charter, counter-weave by peer Karma walker.

---

### Fate (命) — *气数倾覆*

**Peak fiction:** manipulate **fortune of place and institution** — sect examination luck, vein yield, patron attention — until **empires or sects fall** “naturally” (misfortune cascade).

| Tier | Expression (stubs — detail on Fate pass) |
|------|------------------------------------------|
| **Lesser / greater** | Thread Glimpse, Nudge — telegraph, small bias |
| **Supreme** | **Fortune Shear** *(working)* — one **institution or zone** loses a **luck band** for a season; threads spawn (exodus, coup rumor, resource fail) |
| **Statute** | **Omen Crown** *(working)* — worn fate: passive bad luck for enemies **in claim**; active **Pin** one **situation thread** toward collapse |

**Manuals:** Clan omen pin, marriage thread — local bias before supreme.

**Counters:** fate-rite tribulation, heavenly luck treasures, Immortal-level counter-fate (late).

---

### True Self (真我) — *open*

**Peak fiction (owner):** still **TBD**. Design space — **not** a copy of other branches’ offensive apex:

| Direction | Menace type | Fits Personal God |
|-----------|-------------|-------------------|
| **A — Sovereign self** | Cannot be formatted, fated against, or illusion-erased; **you lose** by failing to break them | Reclaim ego from heaven’s cycle |
| **B — Name as law** | Speaking **true name** binds oaths reality-wide | Enthroned / worshipped contrast |
| **C — Mirror apex** | Reflects apex attack back once (defensive pinnacle) | Less jianghu menace, more duel |

**Lean:** True Self apex = **the threat that you cannot own, rewrite, or doom** — counterweight to Memory/Fate/Karma horror; offensive godhood lives in **Devouring / Worshipped** kinds ([`heaven-cycle-and-apexes.md`](heaven-cycle-and-apexes.md)).

Innates **Self Anchor / Name Bound** stay **anti-domination**; statute name **TBD** when owner picks.

---

## Spirit ladder — job per rung (nine-realm target)

Same rule as body: each name is **the work** or **the change**. Qi neighbor is for pacing only — spirit owns its verbs.

| Idx | Qi neighbor | Spirit realm | What this rung *does* | Meter / chamber |
|-----|-------------|--------------|------------------------|-----------------|
| 0 | Qi Condensation | **Sea Opening** | Open the sea; perception wakes | Spirit sea capacity grows; **Sense** facet online |
| 1 | Foundation Establishment | **Sea Stilling** *(lock)* | Calm the sea so it can hold power | Capacity + stability; first **Root branch** opens |
| 2 | Core Formation | **Soul Seed** | One bright condensation — watershed before birth | Sea near cap; tribulation foreshadow |
| 3 | Nascent Soul | **Soul Birth** *(lock)* | The soul **exists**; mass meter begins | Birth quality gate; **神通** slot (facet-chosen signature — separate from branch kit) |
| 4 | Celestial Avatar | **Soul Transformation** | Soul acts **outside** the shell (出窍 / 阳神 flavour) | Out-of-combat projection; jianghu presence |
| 5 | Void Refinement | **Ego Refinement** *(lean name)* | Strip false attachment before godhood | “Dissolve” rung — three god kinds answer here ([`heaven-cycle-and-apexes.md`](heaven-cycle-and-apexes.md)) |
| 6 | Dao Seeking | **Divinity Seeking** *(lean)* | Seek what makes a soul a **god** (parallel to qi dao library) | **Clause** prep — one seated statute per committed branch |
| 7 | Dao Manifestation | **Divine Soul** *(lean)* | Soul-nature is divine; **wear** soul-law | **Seated statute** active (Manifestation analog) |
| 8 | Immortal Ascension | **Godhood** *(title, not one label)* | Apex — Worshipped · Devouring · **Personal** | **Pseudo God** threshold sits on idx 7 peak ([`nine-realm-ladder.md`](nine-realm-ladder.md) § Half-Step) |

**Still open (names only):** Soul Seed → Spirit Seed; Sea Stilling → Sea Settling; Soul Transformation → Unbound Soul. **Idx 5** working label **Ego Refinement** preferred over *Selfless Refinement* (less misleading for True Self branch).

**Pre-birth (idx 0–2):** only **Illusion + Memory** branches — the sea is inward. **Post-birth (idx 3+):** Karma, then Fate, then True Self — the soul touches the world, debt, and trajectory.

---

## Inherited expression tiers (all branches)

| Tier | Code tag | When (typical) | What it is |
|------|----------|----------------|------------|
| **Lesser** | `lesser` | Branch **unlock** realm | First **innate** art for that purview — readable, low Focus, defines early fantasy |
| **Greater** | `greater` | **+1 spirit idx** after unlock (or peak of that rung) | Second innate — new verb or combo hook, **Suppression-band** power if damage |
| **Supreme** | `supreme` | **Idx 5–6**, **primary branch only** (lean) | Genre peak for that purview — expensive, strain, cooldown; **not** basin kit |
| **Statute** | `statute` | **Idx 7** Divine Soul, primary branch | Worn soul-law — passive + one triggered clause; Manifestation analog |

Manuals add **variants** and set bonuses at any tier; they do **not** replace supreme/statute slots.

**Dabblers:** lesser only, or greater one idx late — no supreme/statute ([§ Dabblers](#dabblers-and-qi-cross-access)).

---

## Branch unlock stagger

Branches unlock on **spirit track realm idx**, not qi realm. Dabblers on another primary track do **not** get the full innate ladder (see § Dabblers).

| Spirit idx | Realm (short) | Branch unlocked | Lesser inherited (auto) | Greater inherited (auto) |
|------------|---------------|-----------------|-------------------------|----------------------------|
| **1** | Sea Stilling | **Illusion** | **Misdirecting Gaze** — debuff **one foe** (see § Illusion) | @ **2** **Hollow Double** — **self** decoy echo |
| **2** | Soul Seed | **Memory** | **Surface Inscription** — **foe** surface read (see § Memory) | @ **3** **Soul Search** — deep read *(canon migrate)* |
| **3** | Soul Birth | **Karma** | **Weight Sense** — see debt/alignment tint; tiny damage amp vs stained foes | @ **4** **Ledger Mark** — mark for follow-up soul arts |
| **4** | Soul Transformation | **Fate** | **Thread Glimpse** — see next intent / telegraph one action | @ **5** **Nudge** — small action-order or proc bias *(not hard stun)* |
| **5** | Ego Refinement | **True Self** | **Self Anchor** — resist possession / illusion peel | @ **6** **Name Bound** — declare self; buff vs identity attacks |
| **6** | Divinity Seeking | *(no sixth branch)* | **Supreme** for **primary** branch + clause draft | Peak kit before statute |
| **7** | Divine Soul | — | **Statute** (primary branch) | Pseudo God peak abilities |

**Commit rule (lean):** at **Soul Birth (idx 3)** pick **one primary Root branch** for idx 7 statute; optional **secondary** at idx 5 with reduced greater-cap. Changing branch = rare rite (same family as meridian-wash — [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md)).

**High-tier-only branch *curves* (not absence):** Karma and Fate **lessers are info/setup**; payoffs land on greater/supreme. Illusion **lesser/greater are survival control** in QC–GC; **“illusion becomes real”** is **supreme + statute**, never lesser. Memory **lessers are strong in QC–FE band**. True Self is **mostly idx 5+**.

---

## Branch focus — Illusion (幻)

**Fantasy:** you do not out-tank; you **spoof what the enemy thinks is true** — first about **you**, then about **the field**. Xianxia endgame: **假作真** — a lie heavy enough to **bite**; that belongs at **supreme/statute**, not Sea Stilling.

### Targeting rule (UI)

Every inherited illusion art names **who is affected**:

| Target tag | Means |
|------------|--------|
| **Foe** | One enemy spirit / mind — debuff or mis-aim |
| **Self** | Your soul presentation — decoy, misread profile, guard fudge |
| **Field** | Zone illusion — supreme+ only in v1 (costly, short) |

### Innate ladder (Illusion-primary; others cap at greater unless secondary commit)

| Tier | Spirit idx | Name (working) | Target | Effect (design) | Power note |
|------|------------|----------------|--------|-----------------|------------|
| **Lesser** | 1 | **Misdirecting Gaze** | **Foe** | Apply **Misread** (1 stack): their **next single-target** hostile action vs you has a strong **miss / wrong-target** chance; optional tiny spirit chip if it misfires. **No self-buff fluff** — you are attacking *their* perception. | ~0–0.5× Lash damage; **C** focus; loses vs high Will, clarity gear, Memory read |
| **Greater** | 2 | **Hollow Double** | **Self** | Spawn a **decoy echo** tied to you for 1–2 turns: **first hit** that would land on you **strikes the echo** instead (then echo pops). You may **step** (flee bias) or cast one **light** soul art at −Focus. Clear fantasy: they cut the wrong body. | No “vague fleck”; echo has **one HP layer** on spirit guard, not a second character |
| **Supreme** | 5–6 *(primary)* | **Weight of the Unreal** | **Field** *(one tile / one foe)* | **Apex step:** one **held-in-mind** form, **one real rule** (damage, block, hazard) — short window. Precursor to full “think it, it bites.” Heavy Focus + **strain**; cooldown. | See [§ Illusion apex](#illusion-幻--假作真) |
| **Statute** | 7 | **The Lie Holds** *(working)* | Passive + trigger | Declared illusions gain **legal weight** — persist, resist first break, **one clause** active. Primary Illusion **identity**. | Peak **假作真** — countered by True Self / Memory truth |

**Name swaps open:** Misdirecting Gaze → **Mind Snare**, **False Opening**; Hollow Double → **Soul Afterimage**, **Borrowed Body**.

### Why this fits squishy early spirit

Idx 1–2 you **kite**: Misdirecting Gaze on the scariest striker, Hollow Double when focused. Damage still comes from **generic** Soul Lash / manuals until GC+. Branch does **not** give basin burst.

### Manuals (Illusion)

**Combat styles:** longer Misread, echo that explodes, multi-foe haze — `rootBranch: illusion`, `context: combat`.

**Jianghu styles (manual only):** **False Presence**, **Borrowed Witness**, crowd **Haze** — forge *scene*, not deep memory (Memory lane). Gated by sect/black market; higher tier than innates.

---

## Branch focus — Memory (忆)

**Fantasy:** Memory does **not** paint lies (Illusion) — it **reads what was inscribed**: recent intent, hidden loadout, sealed past. Pre-birth **Soul Seed** is the sea **condensing a trace**; Memory unlocks there because recall becomes a **weapon**.

**Vs Illusion:** Illusion edits **presentation**; Memory extracts **record**. Illusion supreme makes a fake **bite once**; Memory supreme **pulls a sealed truth** (identity, technique signature, quest shard).

### Targeting rule (UI)

| Target tag | Means |
|------------|--------|
| **Foe (surface)** | One enemy — **recent / shallow** layer only |
| **Foe (deep)** | One enemy or NPC — **full Soul Search** depth |
| **Record** | A **marked** mind or chronicle hook — supreme+ (pull sealed layer) |

Out of combat: surface = **lie hint / aura tell**; deep = dialogue and explore gates ([`spiritual-sense-cultivation-reading.md`](spiritual-sense-cultivation-reading.md), [`disguise-and-public-identity.md`](disguise-and-public-identity.md)).

### Innate ladder (Memory-primary)

| Tier | Spirit idx | Name (working) | Target | Effect (design) | Power note |
|------|------------|----------------|--------|-----------------|------------|
| **Lesser** | 2 | **Surface Inscription** | **Foe (surface)** | Read the **top layer** of one mind: in combat → reveal **one** of: telegraphed next attack category, **one hidden buff/debuff**, or weak-spirit tell; in talk/explore → **lie hint** (not full truth). **Zero damage.** | **I** king at GC band; does **not** bypass bone-shifting or deep wards |
| **Greater** | 3 | **Soul Search** | **Foe (deep)** | **Existing game art** — deep probe in combat; hidden truths when exploring or speaking. Grant via Memory branch, not flat pool. Pierces **cosmetic / shallow** disguise; **bone layer** may still need supreme or specialist manual (open — link disguise doc). | Benchmark **utility** — [`data.js`](../../data.js); numbers = playtest later |
| **Supreme** | 5–6 *(primary)* | **Vault Unsealing** | **Foe (deep)** or **Record** | Force **one sealed layer** — identity, oath, technique memory. Strain + backlash if target ≥ your spirit realm. | Step toward [§ Memory apex](#memory-忆--改忆塑命) |
| **Statute** | 7 | **The Record Endures** → **Life Ledger** *(apex lean)* | Passive + long rite | **Known** mark + **editable Record** on deep-read victims; **Format** rite → puppet obedience (stain, time, contest). | Peak **改忆** — not instant duel dominate |

**Name swaps open:** Surface Inscription → **Recent Trace**, **Shallow Recall**; Vault Unsealing → **Depth Recall**, **Seal Break**.

### Pairing with Illusion (idx 1–3 dabble)

| Combo | Role |
|-------|------|
| **Misdirecting Gaze → Surface Inscription** | They mis-aim while you **read** whether they had a hidden opener |
| **Soul Search after fight** | Intel path — less burst, wins **lie / hidden intent** gates |

### Manuals (Memory)

**Combat / read styles:** deeper read, multi-foe surface, longer **Known** — `rootBranch: memory`, `context: combat`.

**Jianghu styles (manual only):** **Confession Seal**, **Witness Rubbing**, **Blackmail Packet** (truth extracted, not fabricated) — primary source of “soul cultivators are terrifying at the tea house” fantasy. Generic **Probe** pamphlet (if kept) = weaker than Surface Inscription or one-charge dabble for non-Memory.

### Disguise interaction (lean)

| Layer | Surface Inscription | Soul Search | Vault Unsealing |
|-------|---------------------|-------------|-----------------|
| Makeup / face | Often | Yes | — |
| Bone-shift | No | **Lean: no** (needs supreme/manual) | **Lean: yes** one layer |
| Signature arts / ledger | Hint only | Partial match | **Signature pull** |

Tune when [`disguise-and-public-identity.md`](disguise-and-public-identity.md) implements `resolveRecognition`.

---

## Skill sources (three layers)

| Layer | Source | Examples |
|-------|--------|----------|
| **Generic condensation** | Manuals, market, sect | Soul Lash, Spectral Shield — [`data.js`](../../data.js) `soul_condensation` pool |
| **Root inherited** | Branch unlock + realm | Lesser/greater tilt; **supreme/statute = branch apex** ([§ Branch apex fiction](#branch-apex-fiction-owner-lock-2026-10-13)) |
| **Manual applications** | Comprehend scrolls tagged `rootBranch` + `context` | Styles + **partial** apex themes before supreme; extra stain on worst ([§ Society menace](#society-menace-vs-combat-kit)) |

Manuals **without** the branch unlock: stash, weak cross-cast, or fail comprehend — same dabble ethic as qi reading a soul pamphlet.

---

## Power benchmark (design targets)

Benchmark against **live** generic arts (tune at implement; numbers are **relative**, not final).

### Reference generics (code today)

| Art | Tier | soulMassMin | dmg | Focus cost | Role |
|-----|------|-------------|-----|------------|------|
| Soul Lash | light | 10 | ~11 | 7 | baseline spam |
| Soul Search | utility | 10 | 0 | 6 | read / probe |
| Spirit Suppression | medium | 15 | ~14 | 9 | control + damage |
| Soul Rend | heavy | 40 | ~22 | 14 | burst |

**Mass gate:** inherited lessers use **same or −2** massMin as Soul Lash at unlock realm; greater uses **Suppression band** at unlock+1; branch **finishers** post-idx 5 sit **below Soul Rend** unless Focus strain + cooldown.

### Band by mortal phase

| Phase | Spirit idx | Player power band | Inherited should… |
|-------|------------|-------------------|---------------------|
| **QC basin** | 0–1 | FE qi peers | Illusion lesser ≈ **0.8× Soul Lash** damage but adds **control**; no heavy soul burst |
| **GC / NS** | 2–3 | Core / Nascent qi | Memory greater (**Soul Search**) = **best-in-slot utility**; Karma lesser = **zero-damage** info |
| **Upper mortal** | 4–5 | Avatar / Void qi | Fate + Karma greater = **Suppression-tier** with **setup**; True Self = **defensive identity** |
| **Seeking / Manifest** | 6–7 | Dao peers | **Branch apex** statute — chronicle/clause power (like worn dao), not +50% Soul Rend |

### Branch benchmark matrix (inherited only)

Ratings vs generic at **same idx** and similar Focus cost: **D** damage · **C** control · **I** info · **S** self/sustain.

| Branch | Lesser (unlock idx) | D | C | I | S | Notes |
|--------|---------------------|---|---|---|---|-------|
| **Illusion** | Misdirecting Gaze @1 | ● | ●●● | — | — | **Foe** Misread — survival debuff |
| **Illusion** | Hollow Double @2 | — | ●●● | — | ● | **Self** decoy — one hit soak |
| **Illusion** | Weight of the Unreal @5–6 | ●● | ●●● | — | — | **Field** one real bite — supreme only |
| **Illusion** | The Lie Holds @7 | — | ●●● | — | ●● | Statute — extra credibility beat |
| **Memory** | Surface Inscription @2 | — | ● | ●●● | — | **Foe surface** — telegraph / lie hint |
| **Memory** | Soul Search @3 | — | ●● | ●●●● | — | **Foe deep** — migrate existing technique |
| **Memory** | Vault Unsealing @5–6 | — | ● | ●●●● | — | **Sealed layer** — supreme only |
| **Memory** | The Record Endures @7 | — | ●● | ●●● | — | **Known** mark / pierce hook |
| **Karma** | Weight Sense @3 | ● | ● | ●●● | — | Damage amp only vs **stained / oath-broken** — PvE skew |
| **Karma** | Ledger Mark @4 | ●● | ●●● | ●● | — | Setup for branch manuals + greater karma arts |
| **Fate** | Thread Glimpse @4 | — | ●● | ●●● | — | Telegraphed counter-play; weak in multi-enemy without greater |
| **Fate** | Nudge @5 | — | ●●● | ●● | — | **No hard skip-turn** at lesser/greater — bias proc / order |
| **True Self** | Self Anchor @5 | — | ●● | — | ●●●● | Anti-possession; PvP vs illusion/memory |
| **True Self** | Name Bound @6 | ●● | ●● | — | ●●● | Personal God runway — ego intact under soul stress |

**Parity rule (combat):** at idx 3–4, a **primary spirit** with two branch greaters + generic kit ≈ **one qi specialist’s** signature combo (not full dao library). Spirit wins **information and guard bypass**; loses **raw throughput vs body**, **sustain vs qi**.

**Parity rule (jianghu):** with manuals + upper Karma/Fate, spirit wins **delayed, chronicle-level** pressure — not auto-win fights. NPC fear and situation-thread leverage are the **identity payoff**.

**Body / treasure counter:** minimal realm lifeforce soul resist; **wards and dharma gear** blunt branch info (Memory/Karma reads); Martial Intent **tempo only** ([`nine-realm-ladder.md`](nine-realm-ladder.md) owner lean).

---

## Generic vs branch — example turn budget (idx 3, Soul Birth)

Spirit-primary vs comparable Nascent qi foe:

- **Generic:** Soul Lash + Spirit Suppression (mass permitting) — ~18 Focus, spirit guard pressure.
- **Memory path:** Surface Inscription → Soul Search — lower damage, wins **hidden intent / lie / disguise** gates.
- **Illusion + Memory dabble:** Misdirecting Gaze → Soul Lash — Misread then damage while foe is wrong-footed.

Design check: **branchless spirit** still playable via generics; **one committed branch** feels like a **class fantasy** at idx 3+.

---

## Dabblers and qi cross-access

| Profile | Branches | Inherited cap |
|---------|----------|---------------|
| Spirit-primary | 1 primary (+ optional secondary @5) | Full lesser → greater → statute |
| Dual (qi + spirit) | Usually **one** branch @ reduced idx | Greaters **one realm late**; no statute |
| Qi Seeking @6 | Optional **shadow** branch ([`void-prisoner.md`](void-prisoner.md) flavour) | **One lesser** + manuals only |

---

## Links to implement (later)

- Tag techniques: `rootBranch`, `expressionTier` (`lesser` | `greater` | `supreme` | `statute`), `mindTarget` (`foe_surface` | `foe_deep` | `self` | `field` | `record`).
- Grant inherited on `spiritTrackRealmIdx` milestone + `G.soulRoot.primary`.
- Move **Soul Search** grant from flat pool to **Memory greater @3** (keep generic probe pamphlet as weaker variant or remove duplicate).
- idx 6–7: **soul clause + seated statute** data model — parallel [`dao-seeking-and-manifestation.md`](dao-seeking-and-manifestation.md), not Art Great Dao merge.

---

## Open questions

- [ ] Idx 5 final name — **Ego Refinement** vs **Selfless Refinement**
- [ ] Secondary branch — allowed for all or True Self / Karma locked pairs?
- [ ] Soul Birth **primary pick** — idx 3 breakthrough UI vs idx 1 first branch auto then respec?
- [ ] Exact Focus costs / cooldowns for inherited skills (playtest after guards ship)
- [x] Illusion lesser/greater names + targets (owner chat 2026-10-13) — Misdirecting Gaze, Hollow Double; real-illusion at supreme/statute
- [ ] Illusion supreme wording — **Weight of the Unreal** vs **Manifest False Step**
- [x] Memory lesser/greater/supreme/statute (owner chat 2026-10-13) — Surface Inscription, Soul Search, Vault Unsealing, The Record Endures
- [ ] Soul Search vs **bone-shifting** — supreme only or greater partial (disguise doc)
- [x] Society menace frame — innates bounded; manuals = partial/variants (owner 2026-10-13)
- [x] Branch apex fiction — five peak threats + shared constraints (owner 2026-10-13)
- [ ] True Self apex — pick A/B/C or hybrid ([§ True Self](#true-self-真我--open))
- [ ] Karma/Fate supreme/statute names — Thread Weave, Debts Come Due, Fortune Shear, Omen Crown
- [ ] `context: combat | jianghu | forbidden` on technique templates + shelf UI
- [ ] Karma/Fate jianghu manuals — design with branch pass
- [ ] Root Dao subsection in `law-taxonomy.md` (stack position vs Great Dao)

## Implementation crumbs

- [`data.js`](../../data.js) — `PATHS.soul`, `soul_condensation` techniques
- [`soul-mass.js`](../../soul-mass.js) — `getSoulCondensationPowerMult`, mass gates
- [`cultivation-tracks.js`](../../cultivation-tracks.js) — spirit track realm idx
- [`spirit-path-full-design.md`](spirit-path-full-design.md) — facets, divine ability, embryo policy
