# Blessed — heaven's manuscript (protagonist-grade NPCs)

| Field | Value |
|-------|-------|
| **Status** | `idea` |
| **Blocked on** | Owner lock: in-world name, kill price, how many may live at once. A thin slice does not need the opportunity engine, situation threads, or the World Fortune meter. |
| **Issue** | none yet |
| **Chat / PR** | Design only — cloud agent, 2026-09-28 |
| **Updated** | 2026-09-28 |

## Intent

Some people in a xianxia world are not merely talented. The story leans toward them. Treasures surface where they happen to stand, killing blows miss by a finger, and a desperate fight becomes the chapter where they comprehend the next realm. Readers recognize the type immediately: the person the novel would have followed if the camera had not been on you.

That is the NPC this doc is for. Working name: **Blessed** (气运之子 — a child of fortune). "Protagonist" is the design metaphor. The jianghu should never print that word on a nameplate.

They exist to punish a specific player fantasy: *I am the prodigy, the one chances follow, the one heaven cannot quite kill.* Meet one, and that fantasy acquires a prior claimant. The classic sting is 山外有山, 天外有天 — a mountain behind the mountain, a heaven above this heaven. You were the genius of Redwell. Someone else's script is thicker.

They are unbelievably hard to kill **among peers**, and they **can** die. That second sentence is the whole design. Fortune is a loan heaven expects to get back. When the loan is spent, a sword works.

Parents and neighbors: [`heaven-cycle-and-apexes.md`](heaven-cycle-and-apexes.md) (heaven is rules, death repays loans), [`post-immortal-cosmology.md`](post-immortal-cosmology.md) (World Fortune — the same resource, immortal scale), [`jianghu-situation-threads.md`](jianghu-situation-threads.md) (the grudge after you cut a thread), [`procedural-zone-sect-ecology.md`](procedural-zone-sect-ecology.md) (sect `prodigy` slot = talent, not this), [`redwell-starter-city.md`](redwell-starter-city.md) (NPC "chance to ascend" parked — this is the named, tiny version).

## Why this is a different animal from a Demonic Talent

Demonic Talents already ship (`NPC_ROLES.demonic_talent`, occupation string "Heaven-defying prodigy"). They are geniuses who **edit** heaven's rules: fast growth, a threat meter, a confront-or-bargain quest, a Dao alignment hit when you kill or join them. Their talk is "the heavens wrote rules. I chose to edit them."

A Blessed does not edit the rules. The rules **spend luck on them**. No demonic qi, no bargain, no corruption. Killing one is not "you slew an unnatural prodigy and heaven shuddered." It is "you ended a story heaven was in the middle of writing." The social price is fame, a patron's grudge, and a brief residue of attention — not a slide toward dissonance.

| | Demonic Talent (shipped) | Blessed (this doc) |
|--|--------------------------|--------------------|
| Heaven's posture | They defy it | It concentrates fortune on them |
| Feel | Villain prodigy, unnatural growth | The person the novel would follow |
| Tell | Demonic qi, threat, 😈 | Ordinary face; the room leans their way |
| Power | Higher growth rate, slightly thicker combat | Events: escapes, chances, pressure breakthroughs |
| Player menu | Confront or bargain | Race the chance, refuse their duel, strike when the thread is thin, or stand beside them |
| Death | A real kill, alignment shifts | A real kill **after fortune is spent**. No alignment hit |
| How common | Rare wanderer, ~10 year emergence | Scarcer. One thickness per band. Not a role weight |

A talented disciple, a rival who scales to you, and a sect ecology `prodigy` are a third category: **skill and ceiling**. They can be brilliant and still have ordinary luck. Do not fold them into this flag. A Blessed may join a sect and occupy its prodigy slot. The slot can also be a hard-working genius heaven has never glanced at.

Leave the demonic occupation string alone until a copy pass. "Heaven-defying" on that role means defiance. Do not reuse those talk lines for the Blessed.

## What the two novels are doing

**History's Strongest Senior Brother — the Blessed.** Heaven's darlings carry a script. Opportunities walk into them. Straight fights against a thick script are how side characters die, because the chapter is written for the Blessed to survive and comprehend. The senior brother's answer is temperament: do not volunteer as the villain of their chapter, do not duel on the ground the script prepared, and do not assume "stronger than them today" means "the blow will land." They still die when the script is refused, starved, or simply overmatched. Caution is the weapon.

**Paragon of Sin — the life the player is chasing.** Fortuitous encounters, karmic luck, a body the world declines to finish off, a breakthrough snatched out of a defeat. That is the prodigy daydream. The sting is meeting someone who lives it more loudly than you do, while your own Heavenly Luck trait remains a modest personal coefficient.

Both fantasies fit one NPC. The player who wants to *be* them feels the mountain. The player who wants to *survive* them gets the senior-brother game: patience, theft of the chance, and a killing blow only when the loan is thin.

## The adaptation rule

**Fortune is a spendable loan with a visible bottom. It buys scenes. It never buys a second life after a confirmed death.**

Three brakes, same spirit as [`immortal-powers-adaptation.md`](immortal-powers-adaptation.md):

| Brake | Means |
|-------|--------|
| **Budget** | A small integer, `fortune`. Escapes and chances spend it. It does not regen inside a fight. It has a band cap. |
| **Peer scope** | The absurd survival is for someone in your range. A two-realm gap is not a novel chapter. Heaven's loan does not cover ant versus boot. |
| **Death sticks** | At zero, or after the escapes this fight were allowed, they die like any other NPC. No hidden extra life. No heaven-sponsored resurrection. Their lifespan is the normal one for their realm. Hard to kill is not long-lived. |

If a design proposal needs infinite plot armor, a player debuff, or "they always have one more chance," it has left this doc.

Heaven, per the cycle doc, is not a person picking a favorite. Fortune **concentrates**. A Blessed is allowed because the loan still ends — they die, or they spend it climbing and the thread thins. An Immortal who keeps fortune forever is a different problem (World Fortune). A mortal darling who can be cut is the cycle working.

## Fortune

Hidden integer on the NPC. The player does not see the number at first. They see the scenes, then later a sense of thick / thin / spent.

| Band | Fortune cap | Escapes in one fight | Who they are |
|------|-------------|----------------------|--------------|
| **Local darling** | 3 | 1 | County genius, lesser-sect junior. The first one a Dustbone prodigy should meet. |
| **Era's proud** | 8 | 2 | The name the zone chronicle will not shut up about. A great-sect disciple or a wanderer whose chances have started to stack. |
| **Heaven's manuscript** | 16+ | not for v1 | One per age. Rumor only until upper realms. You do not roll this as a road encounter. |

**Spends**

| Scene | Cost | What the player sees |
|-------|------|----------------------|
| Narrow escape | −1 | The blow that should have ended them does not. The fight **ends** with them alive and gone — cliff and spirit herb, a senior's sleeve, the beast turning, a hidden jade cracking instead of the heart. They do not get a free turn that kills you. |
| Chance claimed | −1 | Inheritance, patron, beast core, sealed ground. They receive one concrete boon (growth, a patron flag, a named treasure). |
| Comprehension under pressure | −1 | Cornered or fresh from an escape, they break through, or their growth jumps a visible step. The duel you "won" becomes their chapter. |
| Comeback after a public humiliation | −2 | Delayed. The script wants a return bout. If fortune cannot pay, the script **cracks** instead: no comeback, and the next real fight can kill them. |

**Refill**

Slow, capped at the band, never inside a fight, never as a rubber band on the player's success. A point returns over years of staying alive, not because the player won a tournament. The higher heaven is a **different person already in the world**, not a new shield bolted on after you look too clever.

Do not refund an escape five minutes later. The loan was spent. That is the window.

## How a killing blow resolves

On a hit that would drop them to 0:

1. **Fortune remains, and this fight still has an escape.** Spend 1. Set them to a sliver or remove them from the field. Log the absurd survival. Combat ends. They are injured in the fiction, alive in the save, and poorer in fortune.
2. **Fortune is 0, or this fight already used its escapes.** They die. The log is ordinary. No shudder. No second roll.
3. **Player realm is two or more above theirs.** Deny the escape. A Foundation cultivator executing a Qi Condensation darling is allowed to succeed. Among peers the survival is the point. Across a rude gap, the sword is the point.
4. **The thread was already spent this season** (chronicle escape, chance just claimed, comeback already paid). This encounter has nothing left to spend. Death sticks at peer realm too, if you actually land the blow.

Prepared ground can stand in for the gap: no audience, a sealed place, they are already fortune-spent. v1 can skip a special "execution" action and just honor (3) and (4). The senior-brother lesson still lands — you waited.

Confirmed death is the end of the flag. Do not spawn a new Blessed from the corpse. `spawnVengeanceDemonicTalent` is the wrong follow-up. A grieving friend or a patron's hunter can come later, through situation threads. That person is angry. They are not automatically heaven's new manuscript.

## Chances, and the race

Do not build the universal "anyone can ascend" pulse parked on the Redwell docs. One flagged person is enough.

While a Blessed lives, the world scheduler occasionally offers a `blessed_chance` (local darling: every few years; era's proud: a little faster):

- A place (cave, ruin, lot) the player can reach.
- A patron or a closed-door rumor the player cannot physically steal, only arrive too late to matter.

If it is a place, the player hears a stir **before** the chronicle awards it. Take it — explore, buy, claim — and their chance fizzles. Fortune does not drop (they never spent it; they missed). They, or someone who likes them, may notice.

Ignore it, and the chronicle records that they found it. Fortune −1. They get the boon.

That is the prodigy pressure in one loop. Your run assumed the next rare thing was yours. Someone else is the default recipient unless you move.

## How the player comes to know

Same shape as the immortal fortune reveal, at mortal size. No quest titled after them.

| Phase | What you have |
|-------|----------------|
| Rumor | "A junior survived the scorpion pit. Third time this year." No name required. |
| Name | Gossip acquires a person. Easy to dismiss as a braggart. |
| Meeting | You see them. Qi is not demonic. Merchants offer them the better price. The stray beast does not bare teeth first. Their role label is still disciple, wanderer, rival — whatever they actually are. |
| Witness | You watch an escape, or you lose a chance you were walking toward. Now you know. |
| Sense (later, higher realm) | Thick, thin, or spent. v1 can live without this and let the chronicle do the telling. |

"Blessed" is what cultivators whisper once the pattern is obvious, the way they say "demonic talent" once the threat is obvious. Before that, the occupation stays ordinary. The disguise is the point. Heaven's darling often looks like a lucky junior.

## The prodigy player's mountain

The player's **Heavenly Luck** trait stays what it is: a personal bonus to breakthroughs, paid for with thinner tribulation resistance. It does not turn off in their presence, and it does not upgrade into their script. Comparison is the hurt, not a silent debuff.

When a Blessed shares your zone and you have been winning — early breakthroughs, fame, the trait, a tournament later:

- Talk from elders cools. "We thought you were the one."
- Contested chances default to them if you delay. Ordinary herb gathering does not.
- A peer duel while their fortune is thick becomes their comprehension chapter. You were the obstacle in a story that was not about you.

Three legal responses, all intended:

| Life | What you are doing |
|------|--------------------|
| **The prodigy** | Race every chance. Refuse the duel they would comprehend inside. Kill only when the thread is thin, and accept the fame and the grudge. |
| **The steady senior** | Do not volunteer as the chapter villain. Let them have a loud chance you do not need. Strike once, on prepared ground, or never. Survive the age. |
| **The person in their story** | Stand close. A splash of fortune sometimes lands on you. Rare, telegraphed beats may ask an ally to pay a price (time, blood, a resource). Stepping out is always available. Their script does not get to delete the player for drama. |

Ignoring them is also legal. They climb. The chronicle mentions it. When they break a realm you have not, the higher heaven stops being a proverb.

**Higher heaven is a ladder of bands, not a respawn.** Crush the local darling and the era's proud is already a rumor from Jade or the Heartlands. Crush that one, in a later life of the save, and the manuscript of the age is still only a name in an old text. v1 ships the local darling as a person and the next band as rumor. It does not spawn the manuscript.

## Death, residue, and company

**Killing a Blessed**

- Fame, sized to the band. A local darling is a louder rival kill, not a story-boss.
- No Dao alignment shift.
- If they had a sect or a patron, a grudge can open later (situation threads). v1 can be one log line plus, at most, an ordinary vengeful NPC — not a new demonic talent and not a new Blessed.
- Residue: if you cut them while fortune was already spent, the thread snaps quietly back into the world. Maybe a single contested leftover at the site (a cracked jade, a half-claimed insight). If you overwhelmed a **thick** thread, the chronicle is louder for a season and the next tribulation is slightly sharper, once. That is heaven noticing a loan torn up early. It is not a curse, not a new trait, and not a transfer of protagonist status onto the killer.

**Sparing or allying** does not recruit their flag onto you. Splash boons stay small and occasional.

**Old age and ordinary failure** still kill them. Fortune is not lifespan. A darling who never meets you can stall, offend a real elder, or die in a calamity that cost more fortune than they had. The chronicle should be allowed to record that. The world is not obligated to keep your rival alive until you arrive.

**A Blessed who walks into demonic cultivation** is a parked calamity — the manuscript and the editor in one body. v1: the two flags never share a person.

## What this should not become

- A second Demonic Talent with a higher HP multiplier. `demonicHpMult` is the wrong tool. The feel is the escape and the stolen chance.
- A role weight in `ZONE_NPC_ROLES`. They are not 5% of wanderers.
- A rubber band that appears because the player is doing well.
- A main-quest arrow.
- A player transformation. Living the prodigy life is already the trait, the manuals, and the player's own choices. Wearing their flag would erase the mountain.
- The parked universal opportunity sim. One scheduler thread, one NPC.
- Permission for their script to kill the player as a cutscene. Player death stays combat.

## First slice, when someone builds it

Enough to feel the type. Nothing else.

1. After the player has had time to feel clever (not day one), one **local darling** in their region. Cap: one per zone, and no era's proud on the map yet — that name exists as rumor only.
2. Fortune 3. One escape per fight. The escape ends the fight.
3. Two chance types: a place the player can race, and a breakthrough rumor.
4. Chronicle lines for rumor, escape, chance, and death.
5. At fortune 0, combat kills them for good. A two-realm gap denies the escape.
6. Fame on the kill. No alignment shift. No new Blessed from the body.
7. Heavenly Luck untouched.

Era's proud as a real NPC, sense readout, patron grudges, splash fortune for allies, and the manuscript rumor gaining a body all wait on a later pass. World Fortune stays the immortal-scale meter; do not wire this integer into it on day one. They should stay *compatible*: both are concentration of a loan, at different heights.

## Prerequisites

- [ ] Owner lock on the in-world name (Blessed is the proposal).
- [ ] Owner lock on the kill price (proposal: fame, no alignment hit, one sharper tribulation only if the thread was still thick).
- [ ] Owner lock on concurrency (proposal: one local darling per zone, one era's proud on the whole map, manuscript is rumor).
- [ ] No code prerequisite for the thin slice. Chronicle and `scheduleWorldEvent` already exist. Situation threads, sect ecology, and World Fortune can stay parked.

## Open questions

- **Name.** Blessed, Heaven-Favored, or Child of Fortune. Blessed matches the senior-brother novel and stays short in a log line.
- **Does public humiliation crack fortune immediately, or only fail when they cannot afford the comeback?** Proposal: the comeback is the default spend; the crack is what happens when they cannot pay. Total, witnessed disgrace by someone clearly above them might crack a local darling outright — easy to overdo, so leave it out of v1.
- **Can a player with Heavenly Luck ever be mistaken for one by NPCs?** Flavor only, probably yes ("the well has two darlings this generation"). Mechanically they remain a person with a trait.
- **Gender, age, path.** Not all young masters. A village girl, an older wanderer, a body cultivator. v1 can roll from normal world-NPC generation and set the flag, so they inherit ordinary variety.
- **Intersection with rivals.** A Blessed might also be your rival if they decide you are in the way. The rival role is their opinion of you. The Blessed flag is heaven's loan. Both can be true. Do not require it.
- **Where the first darling stands.** Redwell / Dustbone is the right *band* (local). Whether they are a named character or a rolled world NPC can wait. A rolled one keeps the system honest; a named one is easier to write. Lean rolled, with chronicle voice doing the literature.

## Implementation crumbs

- `NPC_ROLES.demonic_talent`, `isDemonicTalent`, `NPC_COMBAT_BALANCE`, `calcNpcCombatStats`, `startNpcDemonicCombat`, `npcDemonicBargain` — the pattern to leave alone and not extend.
- `generateWorldNpc`, `tickWorldNpcGrowth`, `killWorldNpc`, `fireDemonicEmergenceEvent` — spawn and death. Blessed need their own cap and their own emergence, not `demonicSpawnChance`.
- `scheduleWorldEvent` / `appendWorldChronicle` in `world-scheduler.js` — chances, rumors, deaths.
- `TRAITS` → `heavenly_luck` — player-side echo. Do not scale it up to match NPC fortune.
- Sect ecology `prodigy` object — talent and succession. A comment in that doc should point here if the flags are ever both live, so nobody merges them.
- `spawnVengeanceDemonicTalent` — explicitly the wrong corpse follow-up.
- Alignment shift on demonic kill (`demonicVictoryAlignment`) — do not copy onto this death.
