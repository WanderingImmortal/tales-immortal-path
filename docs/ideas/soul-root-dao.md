# Soul Root Dao — five branches, ladder unlocks, inherited skills

| Field | Value |
|-------|-------|
| **Status** | `designed` (ladder + unlock stagger + benchmark stubs — not implementation) |
| **Blocked on** | [`stats-to-meters-rework.md`](stats-to-meters-rework.md) (guards, Focus); nine-realm `PATHS.soul` ship; Root Dao row in [`law-taxonomy.md`](law-taxonomy.md) |
| **Issue** | none yet |
| **Chat / PR** | Cloud design chat 2026-10-13 — spirit ladder + branch benchmarking |
| **Updated** | 2026-10-13 |

## Intent

**Root Dao (根道)** is the spirit lane’s **purview layer** — exactly **five** branches, not the same shelf as Art Great Daos (Sword, Poison, …). A spirit-primary cultivator **walks one or two branches** to idx 6–7, earns **lesser → greater inherited expressions** as realms rise, and uses **manuals** as stylized applications (see § Skill sources).

This doc ties **nine-realm spirit names** ([`nine-realm-ladder.md`](nine-realm-ladder.md)) to **when branches open** and **how strong inherited skills should feel** vs generic `soul_condensation` ([`spirit-path-full-design.md`](spirit-path-full-design.md)).

**Five branches (locked for now):** Karma · Fate · Memory · Illusion · **True Self** (真我 — Personal God home; not “Ego Dao” in UI).

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

## Branch unlock stagger

Branches unlock on **spirit track realm idx**, not qi realm. Dabblers on another primary track do **not** get the full innate ladder (see § Dabblers).

| Spirit idx | Realm (short) | Branch unlocked | Lesser inherited (auto) | Greater inherited (auto) |
|------------|---------------|-----------------|-------------------------|----------------------------|
| **1** | Sea Stilling | **Illusion** | **Veil Glimpse** — cheap misdirection / soft accuracy debuff | @ **2** **Mirror Fleck** — short phantom, breaks on hit |
| **2** | Soul Seed | **Memory** | **Surface Read** — combat probe lite; explore lie hint | @ **3** **Soul Search** *(canon migrate)* — full utility read |
| **3** | Soul Birth | **Karma** | **Weight Sense** — see debt/alignment tint; tiny damage amp vs stained foes | @ **4** **Ledger Mark** — mark for follow-up soul arts |
| **4** | Soul Transformation | **Fate** | **Thread Glimpse** — see next intent / telegraph one action | @ **5** **Nudge** — small action-order or proc bias *(not hard stun)* |
| **5** | Ego Refinement | **True Self** | **Self Anchor** — resist possession / illusion peel | @ **6** **Name Bound** — declare self; buff vs identity attacks |
| **6** | Divinity Seeking | *(no sixth branch)* | **Greater tier-2** for committed branches + **clause draft** UI | Peak branch kit before statute |
| **7** | Divine Soul | — | **Seated statute** (one primary branch) | Pseudo God peak abilities |

**Commit rule (lean):** at **Soul Birth (idx 3)** pick **one primary Root branch** for idx 7 statute; optional **secondary** at idx 5 with reduced greater-cap. Changing branch = rare rite (same family as meridian-wash — [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md)).

**High-tier-only branches (curve, not absence):** Karma and Fate **lessers are info/control**; their **greater** skills carry damage and fight swing. Illusion and Memory **lessers are strong in QC–FE band**. True Self is **mostly idx 5+**.

---

## Skill sources (three layers)

| Layer | Source | Examples |
|-------|--------|----------|
| **Generic condensation** | Manuals, market, sect | Soul Lash, Spectral Shield — [`data.js`](../../data.js) `soul_condensation` pool |
| **Root inherited** | Branch unlock + realm | Table above — always on hotbar / innate list |
| **Manual applications** | Comprehend scrolls tagged `rootBranch` | Sect styles, sets, forbidden variants — bump grade or add combo, not replace purview |

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
| **Seeking / Manifest** | 6–7 | Dao peers | Clause + statute = **identity system** power (like vessel rules / worn dao), not +50% Soul Rend |

### Branch benchmark matrix (inherited only)

Ratings vs generic at **same idx** and similar Focus cost: **D** damage · **C** control · **I** info · **S** self/sustain.

| Branch | Lesser (unlock idx) | D | C | I | S | Notes |
|--------|---------------------|---|---|---|---|-------|
| **Illusion** | Veil Glimpse @1 | ● | ●●● | ● | — | Wins trades via miss / wrong target; loses vs high Will / clarity treasures |
| **Illusion** | Mirror Fleck @2 | ●● | ●● | — | — | Greater = small punish window |
| **Memory** | Surface Read @2 | — | ● | ●●● | — | Explore + combat probe; weaker than full Search |
| **Memory** | Soul Search @3 | — | ●● | ●●●● | — | **Benchmark utility** — migrate existing technique here |
| **Karma** | Weight Sense @3 | ● | ● | ●●● | — | Damage amp only vs **stained / oath-broken** — PvE skew |
| **Karma** | Ledger Mark @4 | ●● | ●●● | ●● | — | Setup for branch manuals + greater karma arts |
| **Fate** | Thread Glimpse @4 | — | ●● | ●●● | — | Telegraphed counter-play; weak in multi-enemy without greater |
| **Fate** | Nudge @5 | — | ●●● | ●● | — | **No hard skip-turn** at lesser/greater — bias proc / order |
| **True Self** | Self Anchor @5 | — | ●● | — | ●●●● | Anti-possession; PvP vs illusion/memory |
| **True Self** | Name Bound @6 | ●● | ●● | — | ●●● | Personal God runway — ego intact under soul stress |

**Parity rule:** at idx 3–4, a **primary spirit** with two branch greaters + generic kit ≈ **one qi specialist’s** signature combo (not full dao library). Spirit wins **information and guard bypass**; loses **raw throughput vs body**, **sustain vs qi**.

**Body / treasure counter:** minimal realm lifeforce soul resist; **wards and dharma gear** blunt branch info (Memory/Karma reads); Martial Intent **tempo only** ([`nine-realm-ladder.md`](nine-realm-ladder.md) owner lean).

---

## Generic vs branch — example turn budget (idx 3, Soul Birth)

Spirit-primary vs comparable Nascent qi foe:

- **Generic:** Soul Lash + Spirit Suppression (mass permitting) — ~18 Focus, spirit guard pressure.
- **Memory path:** Surface Read → Soul Search (after greater) — lower damage, wins if foe has hidden intent or lie gate.
- **Illusion + Memory dabble:** Veil Glimpse → Soul Lash — one miss chance + steady damage.

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

- Tag techniques: `rootBranch`, `expressionTier` (`lesser` | `greater` | `manual`).
- Grant inherited on `spiritTrackRealmIdx` milestone + `G.soulRoot.primary`.
- Move **Soul Search** grant from flat pool to **Memory greater @3** (keep generic probe pamphlet as weaker variant or remove duplicate).
- idx 6–7: **soul clause + seated statute** data model — parallel [`dao-seeking-and-manifestation.md`](dao-seeking-and-manifestation.md), not Art Great Dao merge.

---

## Open questions

- [ ] Idx 5 final name — **Ego Refinement** vs **Selfless Refinement**
- [ ] Secondary branch — allowed for all or True Self / Karma locked pairs?
- [ ] Soul Birth **primary pick** — idx 3 breakthrough UI vs idx 1 first branch auto then respec?
- [ ] Exact Focus costs / cooldowns for inherited skills (playtest after guards ship)
- [ ] Root Dao subsection in `law-taxonomy.md` (stack position vs Great Dao)

## Implementation crumbs

- [`data.js`](../../data.js) — `PATHS.soul`, `soul_condensation` techniques
- [`soul-mass.js`](../../soul-mass.js) — `getSoulCondensationPowerMult`, mass gates
- [`cultivation-tracks.js`](../../cultivation-tracks.js) — spirit track realm idx
- [`spirit-path-full-design.md`](spirit-path-full-design.md) — facets, divine ability, embryo policy
