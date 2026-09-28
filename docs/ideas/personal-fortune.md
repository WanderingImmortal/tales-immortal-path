# Personal fortune

| Field | Value |
|-------|-------|
| **Status** | `idea` |
| **Blocked on** | Owner lock on the delineation below. Fortune-knot NPCs wait on this. World Fortune's meter does not. |
| **Issue** | none yet |
| **Chat / PR** | Design only — [PR #139](https://github.com/WanderingImmortal/tales-immortal-path/pull/139) |
| **Updated** | 2026-09-28 |

## Intent

Fortune in this world is one substance with two ledgers. **World Fortune** is the climate of the age: how freely qi is circulating at all. **Personal fortune** is the balance currently caught on one life. People gossip as if heaven were handing out favor. The rules are not. A life can be carrying a large balance in a harsh age, and a lush age can still be full of ordinary people.

Protagonist-shaped NPCs ([`blessed-protagonist-npcs.md`](blessed-protagonist-npcs.md)) are not a separate magic. They are lives whose personal fortune is high enough to track. This doc is the notion those NPCs need. It does not build them.

Parents: [`heaven-cycle-and-apexes.md`](heaven-cycle-and-apexes.md) (heaven is rules; death repays), [`post-immortal-cosmology.md`](post-immortal-cosmology.md) (World Fortune meter).

## The two fortunes

| | Personal fortune | World Fortune |
|--|------------------|----------------|
| What it is | How much circulating fortune is caught on **one life** right now | How freely fortune is circulating in **the age** |
| Who has it | A person. Almost everyone carries a trickle. A few carry a knot. | Nobody. The age has a climate. |
| Scale | A life. A handful of points, if it is worth counting. | A slow global meter (sketched 0–100, moves over centuries). |
| You and it | You carry it. Mostly it spends itself through your life. | You live in it. An Immortal's holding or release nudges it. |
| Goes up | A snag posts a balance onto this life | Immortals release, or an age recovers. Not when a mortal gets lucky. |
| Goes down | An event completes, someone burns it, or the life ends | Immortals hold qi out of the cycle. Not when a mortal spends a point. |
| Death | The remainder returns to local circulation at once | A mortal's return is a drop. An Immortal's death is a flood. |
| High means | This person survives peers strangely and walks into chances | A lush age: herbs, prodigies, less resistance at the gate |
| Low means | Ordinary causality. A sword does what a sword does. | A harsher mortal age. Fewer prodigies. One person is not "unlucky" because the age is thin. |

The line between them is repayment. Personal fortune is a loan **this life will give back**, by spending it in events or by dying. World Fortune drops when something **stops giving it back** and keeps growing on the hold — an Immortal dam. A mortal sitting on a knot is a pebble in the river. The life still ends.

A harsh age can still have one loud personal knot. A lush age does not put a knot on every disciple. High World Fortune makes new catches a little more common. It does not add points to people each year.

## The third thing people will mix up

**Heavenly Luck** (`heavenly_luck` in `TRAITS`) is a paid personal channel: better breakthrough odds, weaker tribulation resistance. It is not a fortune score. It does not add personal fortune, and a high personal fortune does not turn the trait on.

Gossip may call all three "luck." The systems stay separate.

| | Heavenly Luck | Personal fortune | World Fortune |
|--|----------------|------------------|----------------|
| Where it lives | A creation trait | A balance on a life, usually untracked | A hidden climate, revealed late |
| What it touches | Your breakthrough math | Events around that life | The age: herbs, prodigy rates, gate resistance |

## How personal fortune exists

It is a balance, not a blessing and not a stat bar on every character.

- **Untracked trickle.** Zero or one, implied. Ordinary causality, plus at most a coincidence the chronicle never bothers to simulate. Do not store a number on every villager.
- **Tracked balance.** Worth a small integer only once it can buy a scene: a narrow escape, a chance, a comprehension. That threshold is what [`blessed-protagonist-npcs.md`](blessed-protagonist-npcs.md) calls a fortune knot. The integer is personal fortune. There is no second currency.

The player starts as trickle unless play later posts a real balance onto them. Wearing a tracked balance is a later question. It is not required to define the notion, and it is not granted by the Heavenly Luck trait.

Folk names ("blessed," "heaven's darling") describe the pattern. They invent a chooser the rules do not have.

## How it increases

A point appears when circulation **posts** onto this life. Nothing mints fortune from nothing, and cultivation does not earn it.

| Posting | What happened |
|---------|----------------|
| **Natal** | A death, a broken vein, a sealed hoard, a parent with an open account. The balance lands on the nearest open life, often a birth in that spot. |
| **Deed** | One act settles a large account at once: killing a hoarder of fortune, cracking a seal, walking out of a tribulation that should have taken the deposit back. Virtue is not in the sum. |
| **Vacuum** | Fortune in a place has nowhere to go — ruined sect, stoppered vein, a sleeper's pool leaking — and dumps onto the most porous mortal nearby. |
| **Catch at a release** | An Immortal's death, a vein unsealed, a thick knot cut open. Most of the flood returns to the land. A porous person standing in it may catch a point. Often they catch nothing. Sometimes the flood kills them. |

Staying alive does not add points. Winning fights does not add points. A high World Fortune does not drip points onto the living. A new posting is a new event.

## How it decreases

| Spend | What happens to the balance |
|-------|------------------------------|
| **A scene completes** | Escape, chance, comprehension, a pressured comeback. The knot doc lists the scenes. Each one returns a point through a life. |
| **A burn** | Someone forces a spend. See wielding. |
| **A combing** | A rare rite pushes the balance back into the cycle. The rite-worker does not receive it. Later knowledge, not a starter art. |
| **Death** | Whatever remains returns to local circulation at once. The killer does not gain the balance. A thick return is a splash: a leftover on the ground, a sharper tribulation once. A spent return is quiet. |

Losing a race for a chance does not spend. The scene never completed, so the point is still caught.

The calendar does not tax it. Seclusion does not dissolve it. Seclusion delays scenes; coming out can offer a burst of them, because the balance is still sitting there. Cultivation, spirit stones, and reputation do not move the number.

## How it can be wielded

Most of the time it is not wielded. The balance spends itself by completing events. The life is where the water caught, not the treasurer.

**What a person can do**

| Act | Result |
|-----|--------|
| **Do nothing** | The balance sits. It adds no HP, no damage, no breakthrough percentage. |
| **Live** | Scenes offer themselves and spend it. This is the knot NPC. |
| **Refuse a scene** | Walk away from the cave. The point stays. Another scene will offer later. Refusing does not become a stored charge. |
| **Burn** | Spend one or more so the next drip is a survival or a comprehension. You do not pick the narration, the item, or the enemy. A few people learn this on purpose. Anyone with a balance can burn without meaning to when a killing blow lands and an escape is still affordable. |
| **Catch** | Stand in a release. Mostly nothing. Sometimes +1. Sometimes you die. Not a farm. |
| **Comb** (later) | A work or a rite shoves someone else's balance back into the cycle. You do not inherit it. |

**What nobody can do with it**

- Pay a merchant, buy a pill, or stock it as currency.
- Add a flat combat stat, or aim a miss at a named enemy.
- Take another life's balance by killing them.
- Grant it to a disciple.
- Raise World Fortune by spending a personal point. A mortal drip is local. The global meter does not tick.
- Lower World Fortune by hoarding a mortal balance. The life still ends, so the loan is still good.
- Hold a balance past death, or hold it so tightly it never spends and never returns. That hold is no longer personal fortune. It is a dam, and dams are World Fortune's problem. Mortals do not get this verb.

Burn is the only deliberate wield inside one life, and it is blind. If a proposal lets the player choose the outcome of a point, it has left this doc.

## What the player should be able to understand

One paragraph, in the world's mouth once someone actually knows:

> The age has a tide. That tide is not yours. What catches on a person comes back through the life they live, or all at once when they die. You can waste it. You cannot aim it. You cannot keep it forever.

Until that explanation exists in play, chronicle lines may keep saying heaven favored someone. That is gossip. The number underneath still follows this doc.

## Where it is allowed to show up first

1. **Language and rules, here.** No integer in the save until a consumer needs it.
2. **Fortune-knot NPCs**, after this notion is locked. They are the first tracked balances. Their scenes are spends. Their deaths are returns.
3. **A player balance**, only if a later design wants the player to catch or burn. Not part of the knot slice.
4. **Combing rites, catch-at-a-release**, after someone is actually standing in an Immortal flood or a seal breaking. Those events are not starter content.

World Fortune stays on its own track in [`post-immortal-cosmology.md`](post-immortal-cosmology.md). Do not wire a personal point into that meter.

## Prerequisites

- [ ] Owner lock: personal fortune is a life-scale balance; World Fortune is the age; Heavenly Luck is neither.
- [ ] Owner lock: it does not tick with time, it does not transfer on death, and the only deliberate wield is a blind burn.
- [ ] Fortune knots stay blocked until those two locks are in.

## Open questions

- **Does the player ever see their own number?** Proposal: no, until a later slice where they have a tracked balance. Knots are visible by scenes, not by a shared UI.
- **Who can burn on purpose?** Proposal: rare knowledge, not a Qi Condensation button. Unconscious burn on a killing blow is the knot escape rule, and it is enough for the first consumer.
- **Combing.** Proposal: exists in the notion so fortune can be stripped without a murder, and stays unbuilt until a rite has a home.
- **Seclusion burst.** Proposal: leaving a long seclusion with a thick balance offers scenes sooner. The number did not grow while they were inside.

## Implementation crumbs

- No current `fortune` field on the player or on world NPCs. Do not overload `heavenly_luck`.
- World Fortune is still a sketch in `post-immortal-cosmology.md` (global, slow, Immortal-driven). Keep the names distinct in UI if both are ever shown: climate versus a life.
- Knot NPC spends, bands, and the kill line live in `blessed-protagonist-npcs.md`. If that doc disagrees with increase, decrease, or wielding, this doc wins.
