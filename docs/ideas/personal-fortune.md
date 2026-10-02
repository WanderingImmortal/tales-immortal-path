# Karma, personal fortune & World Fortune

| Field | Value |
|-------|-------|
| **Status** | `idea` (restarted 2026-09-28 from owner framing) |
| **Blocked on** | Owner lock on the three definitions and the one bridge rule. Protagonist NPCs wait on this. |
| **Issue** | none yet |
| **Chat / PR** | Design only — [PR #139](https://github.com/WanderingImmortal/tales-immortal-path/pull/139) |
| **Updated** | 2026-10-02 |

## Intent

Three things, cleanly apart:

| | One sentence | Scale |
|--|--------------|-------|
| **Karma** (因果) | The ties between your actions and their consequences. | Relational — you and someone or something else |
| **Personal fortune** (气运) | How often chance breaks your way: lucky encounters, timely rescue, a blow that misses. | One life |
| **World Fortune** | The state of the world: how much qi, treasure, and opportunity exists at all. | The age |

**Heavenly Luck is out of this model.** The creation trait still exists in code (`heavenly_luck`: breakthrough odds against tribulation resistance). Whether to delete it or rename it as a plain breakthrough talent is a later call. It is not fortune.

Parents: [`heaven-cycle-and-apexes.md`](heaven-cycle-and-apexes.md) (heaven is rules; death repays), [`post-immortal-cosmology.md`](post-immortal-cosmology.md) (the existing World Fortune meter), [`alignment-sacrilege-corruption.md`](alignment-sacrilege-corruption.md) (tracks karma must not duplicate), [`jianghu-situation-threads.md`](jianghu-situation-threads.md) (the incident ledger).

## Karma

A **tie** runs from an act to its consequence. It has:

- **A direction.** Debt — you owe. Grace — you are owed.
- **A weight.** A slight is light. A killing is heavy. Ending a lineage is very heavy.
- **An anchor.** Who or what holds the other end: a person, a family, a sect, a place.

A tie **settles** when its consequence arrives. The anchor collects or repays. Compensation is accepted. Service is rendered. A light tie can fade with time.

Karma is not a morality score. A saint is heavily tied. So is a butcher. The existing tracks stay intact:

| Track | Question |
|-------|----------|
| Dao alignment | Who do you choose to be? |
| Sacrilege | Which rule did you break? |
| Corruption | How badly did you damage the cycle itself? |
| **Karma** | Who is tied to you, which way, and how heavily? |

No new meter. The situation-threads **incident ledger** (kills, spares, thefts, betrayals, oaths, humiliations) is the record. Karma is that record read as ties. Karma Dao (Debt, Grace) and the karmic tribulation stub are existing hooks.

### Does karma persist through lifetimes?

**Yes, with one filter.** The heaven's-cycle doc already says flesh and qi return to the land at death and the soul returns through reincarnation. Unsettled ties ride with the soul. What they lose is the name on the other end.

- **A tie whose anchor still lives stays a tie.** Rare, and loud: the old enemy who recognizes your soul, the sect that still keeps your past life's oath. Xianxia's past-life reunion.
- **A tie whose anchor is gone cannot come back as a person.** The creditor is dead, the lineage is ended, or you have forgotten them. It becomes **fortune**. See the bridge rule.

A **Bitter Reincarnation** (you died) carries every open tie. That is the common case. Runs generate a new world today, so almost every carried tie loses its anchor anyway.

**True Reincarnation — interaction wanted, shape unknown (owner 2026-09-29).** Today it is only offered at the Immortal Ascension gate, and it pays +2 legacy CP against Bitter's +1, plus one small carried echo. There is no real reason to choose it, so runs end Bitter. Karma should give it a reason. What that is stays open.

Candidate worth weighing, not locked: the gate is already where the ascender draws on World Fortune. True Reincarnation is the only choice at that gate that *doesn't* take. Stepping back into the cycle instead of out of it could be the one act that repays willingly — settling open ties, carrying grace forward, leaving the world's fortune where it is.

An Immortal never reincarnates. Their karma can never turn into a next life's fortune, so it accumulates. That is a natural reason immortal calamities get worse over time. Hook only.

## The bridge rule

**Karma with a name on it comes back as a person. Karma without a name comes back as luck.**

A tie that still has an anchor settles as a consequence you can trace: the man you saved returns with a sword at your side, the brother of the man you killed arrives with a bounty.

A tie whose anchor is gone dissolves into personal fortune:

- Nameless **grace** becomes good fortune.
- Nameless **debt** becomes ill fortune.

It happens within a life (you saved someone, and they died before repaying) and across lives (most carried karma).

That answers the question from the Blessed drafts. Protagonist-shaped people are not heaven's favorites. They are being repaid for something that happened before anyone can see, usually a past life, in a currency without a return address. The ill-starred are paying off debts in that same currency.

One more direction runs the other way: **fortune writes new named karma.** Timely rescue means someone rescued you. Now you owe them. A treasure you stumbled on had a prior claimant. Now they are tied to you. This is why the lucky attract endless trouble: every stroke of luck puts a new name in their ledger.

## Personal fortune

The individual layer: your odds of meeting lucky events, of timely help arriving, of the blow missing.

- **A balance per life, and it can go negative.** Positive is fortunate. Around zero is ordinary causality. Negative is ill-starred: the bad break lands at the worst moment.
- **Filled only by nameless karma** (the bridge rule). Not by cultivating, winning, or time passing.
- **Spent by the events it produces.** A rescue, a find, a miss each draw it down. Ill fortune is spent by misfortunes. That is why the protagonist's luck ends: it was a finite repayment.
- **It cannot be aimed.** Fortune decides *that* something breaks your way, never *what*. Nobody chooses which treasure, which rescuer, or which enemy misses.
- **It cannot be traded, taken by killing, or given to a disciple.** Killing someone creates a heavy named tie to their people. It does not hand you their luck.

It needs a tracked number only once it is large enough to cause scenes. Most lives are near zero and need no simulation.

## World Fortune

**The state of the world as it is.** Not anyone's luck.

**What it affects:** things anyone can use.

- **Ambient qi.** How thick cultivation grounds are, and how fast veins recover.
- **Natural treasures.** How often herbs, ores, and beast cores of real grade appear.
- **Windows.** Ancient caves open, sealed tombs crack, a lethal zone goes quiet for a season, a secret realm surfaces. These are public events with timers. Anyone who hears and moves can contest them.

### Ascension draws on it (owner lean 2026-09-29)

**World Fortune is part of what an ascender draws from the world to immortalise themselves.** It is not a side effect. It is an ingredient.

Everything in the world is on loan from the cycle, and death repays the loan. Ascension is the one act that takes and never repays: the ascender pulls a share of the world's fortune into the immortal body and lease, and that share leaves circulation for as long as they exist. A greater ascension draws more.

So the drain happens at the moment of ascension, and the scale of the draw is part of what the ascension *is*. How the draw is sized (realm, path, what the ascender brings in, how thin the world already is) and whether anything keeps drawing afterward are later calls. A thin world has less to give, which fits the existing idea that gate resistance rises as World Fortune falls.

### How it is restored

Already outlined in [`heaven-cycle-and-apexes.md`](heaven-cycle-and-apexes.md):

- **Departure upward** — the full wave. See below.
- **Immortal death** — a lesser wave, then a long seep. See *Two waves* below. Still "the last dying gift."
- **Voluntary release** — an Immortal gives back held qi at a personal cost.
- **Healing the land** — formations, vein nurture, and root rites repair and reroute qi. Slow and costly. They restore flow. They do not create qi.

Restoring it lowers gate resistance for everyone, including rivals.

### Departure upward (owner idea 2026-10-01 — not locked)

**One rule covers death and departure: what belongs to this world stays in it.** Death returns qi, flesh, and soul to the cycle. Leaving for the upper realm returns whatever the Immortal drew from this world. Borrowed fortune cannot cross the gate, any more than a corpse can.

This is the existing Mandate model in [`post-immortal-cosmology.md`](post-immortal-cosmology.md), given a place. A lower-realm Immortal lives on **Mandate** — borrowed world fortune. The true breakthrough upstairs converts it into **Self-Sustenance**, power that is actually theirs. That doc already says World Fortune only drains while Mandate is above zero.

So: **draw to rise, outgrow the draw to leave.**

| Step | World Fortune |
|------|---------------|
| Ascension | The Immortal draws a share and holds it. The world thins. |
| Life as a lower Immortal | The share stays held while they remain. |
| Conversion | They stop needing the borrowed share. |
| Departure upward | The whole share leaves them at once and falls back to this world where they go — near their seat, grotto, or lineage. |
| Death without departure | Part bursts out. The rest stays in the body and seeps out slowly. |
| Staying forever (warden, restrained, stalled, devourer) | The share is never returned. This is the dam. |

### Two waves (owner lean 2026-10-02)

| Event | What returns | Shape |
|-------|--------------|-------|
| **Departure** | Everything held, at once | A full **fortune wave**. Nothing can follow them through the gate, so nothing stays behind. |
| **Death** | A large burst, then the remainder over a long time | A **lesser wave**, then a **seep**. The body still holds what was refined into it. |

**Refinement decides the split.** The more refined an Immortal's power, the tighter it clings to the body. A crude Immortal's death is mostly burst. A deeply refined one bursts less and seeps for ages. Total returned is the same either way. Only the timing differs.

**Sacred ground.** A refined Immortal's corpse has been seeping into the land for millennia. The ground around it is rich, strange, and slow to deplete: thick qi, treasures that grow nowhere else, a place sects and beasts fight over without knowing why. It is a standing World Fortune window, not a timed one.

This stays consistent with "no Immortal death is recorded yet" in [`heaven-cycle-and-apexes.md`](heaven-cycle-and-apexes.md). Sacred grounds can exist without anyone knowing what is buried there. The first *recorded* death is still a world-shaking event.

Hooks, not locked:

- **Saint corpses** (body path) should cling longest of all. That fits Da Chi's flesh that "won't settle."
- **Disturbing a corpse** — refining it, harvesting it, moving it — interrupts a return to the cycle. That reads as corruption under [`alignment-sacrilege-corruption.md`](alignment-sacrilege-corruption.md). A tempting crime, with an existing price.
- **Killing an Immortal returns less, sooner, than letting them leave.** That is a real argument in-world for and against assassination.

**What the rule explains without new parts**

- **Forgotten Immortals.** People who went up long ago. Their names aged out of every register. The world they left was richer for their going.
- **Golden ages.** A departure is a full wave. Several in one era is an age of plenty, remembered as myth.
- **Legacies.** Returned fortune pools where they left, alongside whatever they left behind. Ancient immortal caves and inheritance grounds are World Fortune windows: public, contestable, and tied to someone history forgot. Sacred grounds are the death version of the same thing.
- **Why this age thins.** The Immortals known today are the ones who stay: the Void Seeker guards his lock, the Tian founder sleeps, the Jade Lotus Matriarch stalled, the cult founder devours. A world whose Immortals stop leaving is a world that only drains.
- **Karma of the departed.** A departed Immortal's ties below lose their anchor, so the bridge rule turns them into nameless fortune for whoever was tied to them. A lineage of a forgotten Immortal can carry inexplicable luck. No new rule needed.

**Not the same as grotto masters.** The ancients doc's severed grotto masters are forgotten for a different reason: they slipped off heaven's tracking but are still *here*. Many refused the lease, so they never drew. Departed and severed are both forgotten. Only the departed gave fortune back.

**Not the outer void.** The Void Seeker's hunt beyond the firmament is still inside this world's books. He has not departed.

**What this forces us to answer, so the rule stays consistent**

1. **Must every departure be preceded by a draw?** Lean yes as the rule: Ascension as boarding pass. The cosmology's hidden "Door B" — walking up on your own power without a lease — can stay a rare exception that never drained anything.
2. **Why don't today's Immortals leave?** If leaving is easy, World Fortune never declines and the thinning age makes no sense. Owner is open to either answer (2026-10-02):
   - **Incredibly hard.** Departure is one more breakthrough, and most Immortals stall below it. The Jade Lotus Matriarch is already written as stalled by "heaven's restrictions."
   - **The method was lost.** This one has a built-in explanation: the only people who ever knew how to leave are the ones who left. Teachers of departure do not stay to teach. The lineages they left behind kept the luck and the caves, not the instructions.
   - They combine without contradiction. It was always hard, and the knowledge thinned with every departure.
3. **Is the return all at once?** Yes for departure (owner lean). Death is the split wave above.
4. **Does the upper realm have its own fortune?** Deferred. No upper-realm design until the owner has a picture of it.
5. **Can anyone come back down?** Owner lean: prohibitively hard; shape unknown. If it happens, they arrive owning no lower fortune and must draw again — which keeps the rule intact.

Still open from that doc: one global number, or regional values. Suggestion: one global number, expressed unevenly. Waves land where the Immortal left or died. Sacred grounds seep where corpses lie. Held qi pools near where Immortals sit.

## How personal fortune and World Fortune meet

**World Fortune decides what is out there. Personal fortune decides whether it meets you at the right moment.**

A tomb opening is a World Fortune event: public, contested, available to anyone who shows up. Personal fortune is happening to pass on the day it opens, or the collapsing tunnel missing you and not the man behind you.

In a thin age, a fortunate person still has fortune, but there is less out there for it to land on. It shows more as survival and timely help than as treasure. In a rich age, an ordinary person can still gain a lot by being prepared and moving fast. The world is generous. It is not aimed at them.

The two never convert. Spending personal fortune does not drain the world. An Immortal's wave does not raise anyone's personal fortune. It opens windows, and people with fortune tend to be standing in the right place.

## Where it shows up first

1. **World Fortune** — windows and treasure frequency from the existing meter. It needs no karma to work.
2. **Karma** — read from the incident ledger once situation threads exist. Named ties settle as thread beats.
3. **Personal fortune** — protagonist NPCs as the first tracked balances, sourced from carried nameless grace.
4. **Cross-life karma for the player** — through Legacy's two reincarnation types, after the above exist.

## Prerequisites

- [ ] Owner lock: the three definitions.
- [ ] Owner lock: the bridge rule (named karma → a person; nameless karma → fortune), and that fortune writes new named karma.
- [ ] Owner lock: karma persists across lifetimes, and loses its names.
- [ ] Owner call: delete or rename `heavenly_luck`.
- [x] Owner lean: World Fortune is drawn as part of Ascension itself.
- [ ] Owner call: departure upward returns the held share ("what belongs to this world stays in it"), and the open questions under *Departure upward*.
- [x] Owner lean: departure is a full wave; death is a lesser wave plus a seep, split by refinement.

## Open questions

- **What makes True Reincarnation worth choosing?** Open. See the karma section.
- **Does fortune decay?** Suggestion: no. It is only spent. A lucky life that avoids risk keeps its luck.
- **How is the ascension draw sized, and does anything keep drawing afterward?**
- **Whole concept expects touch-ups.** Seers, readouts, and how a player perceives any of this are deferred.
- **Can ill fortune be cleansed?** Suggestion: only by settling it the long way, through spending. There are no purification pills for karma.

## Implementation crumbs

- `legacy.js` — `triggerBitterReincarnation`, `triggerTrueReincarnation` (offered only in the Immortal Ascension modal), `pendingCarryPerk`, `LEGACY_BONUS_CP` (bitter 1, true 2). The cross-life karma hook.
- `LEGACY_CARRY_PERKS` → `echo_of_fortune` is +25 spirit stones. The name collides with this concept; rename when either system is touched.
- `npcKillLog` / `recordWorldNpcKill` — the seed of the incident ledger.
- Karma Dao ids `karma`, `karma_debt`, `karma_grace`; `TRIBULATION_TYPES.karmic` (stub).
- World Fortune meter sketch in `post-immortal-cosmology.md`. `world-scheduler.js` for windows.
- `TRAITS` → `heavenly_luck` — out of this model; not yet removed.
