# Body path — refining rewrite (ACS lean)

| Field | Value |
|-------|-------|
| **Status** | `idea` (owner lean locked 2026-08-05; full design still open) |
| **Blocked on** | Anatomy Phase 1–2 can proceed; full rewrite design after that |
| **Issue** | none yet |
| **Chat / PR** | Body chamber triage 2026-08-05 |
| **Updated** | 2026-09-25 |

## Intent

Body cultivation should feel like **refining a living vessel** — layer by layer, organ by organ, with visible quality changes — closer in spirit to *Amazing Cultivation Simulator* body work than to qi’s “fill bar → break into a new realm.”

**Owner lean (2026-08-05):** body path does **not** need qi-style realm breakthroughs. It needs **milestone equivalents** — named checkpoints that line up with qi/soul realm *indices* so relative power, travel danger, trib gates, and UI comparisons stay easy to track. The *work* is refining; the *milestones* are the power ruler, not the fantasy of “ascending a new realm” the way qi does.

Related visuals: [`body-chamber-anatomy-rebuild.md`](body-chamber-anatomy-rebuild.md) (Phase 1–2 anatomy can ship first). Forbidden practice stub: [`soul-body-refining.md`](soul-body-refining.md).

## Design notes

### What exists today

| Piece | Today |
|-------|--------|
| **Body realms** | Named ladder on `PATHS.body`: Bronze Skin → Iron Bones → Jade Marrow → … |
| **Body chamber** | Layers with 0–100% progress; actions bump layer %; sub-unlocks |
| **Bone tier (Phase 3a proposal)** | Not built — visual ladder proposal only |

### Mesh direction (owner lean)

**Refining = the loop. Milestones = the power ruler.**

- Player refines by soaking, then by later work on the finished body.
- Thresholds award **milestones** mapped to the same index as qi’s QC / FE / GC / …
- Milestone names are the proposed ladder, Inner Tempering through Saintly Flesh. The live Bronze Skin list is what the game still shows. The proposal is not locked: [`nine-realm-ladder.md`](nine-realm-ladder.md).
- The first door is a brace, not heaven’s lightning. Later notices: TBD.

**Phase 1–2 anatomy does not wait on this.**

### Chamber scope (lean 2026-09-25)

The live chamber is seven layers on one figure: skin, flesh, bones, organs, blood, meridians, nerves. Each layer is a few repeats for a small percent. The next layer opens at 50% of the previous. Nerves is one capstone click. Realm progress treats “your realm index” as “which layer you are on,” and there are only seven layers.

That chamber is the **mortal dig**, the work of realms 0–3 (Inner Tempering through Nascent Physique). It stays **one screen**. The realm name changes when the dig crosses a threshold. A layer is not a realm. Skin is not Inner Tempering by itself. The physique being born is the moment this chamber is finished.

Later realms do not add layers. They change the work done to the body you already refined:

| Idx | Realm | Work |
|-----|--------|------|
| 0–3 | Inner Tempering → Nascent Physique | The current chamber, one continuous refinement. Milestones rename you. Heaven does not need a tribulation at every layer. |
| 4 | Physique Transformation | Change the finished mortal body. Same figure, new kind of flesh. Not new organs. |
| 5 | Hollow Refinement | Open an empty place inside that body and refine power there. Early on you are not past a transformed physique until the hollow fills. |
| 6 | Origin Seeking | One source in the flesh. A sworn rule becomes that source. No oath means a slower dig, and no interior peak. Not a dao library. |
| 7 | Origin Manifestation | That source becomes the flesh people meet. |
| 8 | Saintly Flesh | Sanctify. The end. |

The “three clicks, +1%” gimmick is a depth problem **inside** the mortal dig. Solve it there later (quality, materials, the figure actually changing). Do not solve it by inventing layers for the saint path.

Names and the oath split: [`nine-realm-ladder.md`](nine-realm-ladder.md).

### Inner Tempering — saturation (lean 2026-09-25)

**Work:** soak the body, or a part of it, in a material or a brewed solution, and draw the essence out of that bath into the flesh.

**The realm has a limit.** Diminishing returns only decide how you fill the cup. They are not the ceiling.

A mortal frame can hold so much converted nature, and then it is saturated. Vessel Establishment exists to brace that frame so it can hold more. If soaking forever still made you stronger, the next realm would be optional. Qi Condensation already works this way: Early, Mid, Late, then an optional Peak inside the same basin. Late is full enough to leave. Peak is a little more of the same kind of power, not a new kind.

| Band | Flesh | World |
|------|--------|--------|
| **Early** | First soaks. Common meat, beast hide, field herbs, and grit will fill a vat. | You stop being an ordinary laborer. A shift doesn't ruin you. Cuts close. |
| **Mid** | The temper is reliable. Variety matters: the same carcass pays less the second time. | Town strongman, caravan muscle. Ordinary Dustbone beasts are huntable. |
| **Late** | The frame is saturated. This is the door to Vessel Establishment. | As much "stolen wild" as a human body can keep without a brace. |
| **Peak** (optional) | A little more density. The step into establishment is harsher because you are packed tighter. | Still a mortal. The Redwell hunter people tell stories about. |

**What does not raise the ceiling:** rarer ingredients, talent, or patience. They fill the frame faster and with less waste. A demon core, jade, a beast's cultivation core, marrow-as-pearl, meridians, and Vessel Rules are later work. Forcing them into a full mortal body is rejection — fever, scarring, the power will not stay — not a secret rank above Late.

**How far that still is:** the strongest honest mortal. Visible in a 4th-tier town. Same social weight as a peak Qi Condenser: real, local, not a lord. A vessel-established cultivator is a different category, the way a foundation cultivator is heavier than someone whose dantian is merely full.

**Lifespan:** the idx 0 cap stays **80 years**. Tempered flesh lets you reach that cap still sound, instead of broken at sixty. It does not buy centuries. Law of Dust still applies: this body holds together better, and it is still dust.

Pacing can share the Qi Condensation clock (inferior: Late around 40–44, Peak around 45–50) so a full mortal physique still has years left to attempt the vessel, or to live out the basin and die the strongest body in town.

### What the player does (lean 2026-09-25)

The screen is the body. A resource is a bath, or part of one. The player should be able to read a stack of demon-beast blood and know what it is for.

**Demon-beast blood, as the picture.** It is not in the game yet. Collected, it fills a vat. Enough for a limb is a smaller vat than enough for the whole body. You soak the arm, or you soak yourself. Over days the essence leaves the blood and enters the flesh you steeped. That arm runs with whatever grain the blood carried. A second soak of the same blood in the same arm pays less. A whole-body soak writes the grain everywhere and drinks far more blood. If the frame is already full, or the blood is too fierce for a mortal body, the soak rejects: fever, scarring, the essence will not stay.

**The rule for every resource.**

| You have | You can do | You learn |
|----------|------------|-----------|
| A little of one material | Nothing yet. It is not a bath. | Keep collecting. |
| Enough raw material for a limb | Soak that limb. Crude. More waste, more chance of a scar. | The grain, in that limb only. |
| Enough raw material for the body | Soak the whole frame. | The same grain, everywhere. Costs much more. |
| Materials for a solution (x, or x + y + z) | Brew, then soak a limb or the body. Purer essence. Less waste. | A cleaner take of that grain. |

You choose the target: a limb, or the whole body. The bath chooses what that flesh learns. The soak reaches the skin and the meat and blood under it. It does not reach organs, marrow, or meridians.

Early, Mid, and Late move by themselves as the frame fills. There is no button between bands. Redwell feels it: work hurts less, ordinary beasts are huntable, people ask you to lift things.

At **Late**, soaks reject. A brace can be attempted if you know **any** method for it. Without a method you stay a full mortal until the 80-year cap. Peak is optional before the brace: a purer soak might still take a little, rejection comes easier, the brace is harsher, and you are still in the first realm.

**The breakthrough is the brace.** You stop soaking. The flesh you drew in has to be bound so it stops leaking back to dust. The result is always Vessel Establishment. The way you bind it depends on the manual.

**Methods, not one ritual for every realm (owner 2026-09-25).** Each threshold has its own act. The brace belongs to this door only. Later doors are different work (a pearl, a physique, a hollow), not the same brace with a new caption. A manual teaches one method for one door. Knowing any method for that door is enough to attempt it.

Ship one common brace first. Leave room for more manuals that open the same door with a different cost.

| Method | What you spend | How it feels |
|--------|----------------|--------------|
| **Stillness** | Wrappings, resin, a long stretch you cannot hunt | The common manual. Failure slips some of the weave. You live. |
| **Heat** | A harsh solution, shorter | Sets the flesh the way a smith sets steel. Failure scars. |
| **Weight** | A place that can load the body (yard, quarry). Few reagents. | The frame is forced to hold. Failure is pain and a slipped weave. |

Same success either way: Vessel Establishment, the 120-year cap, a frame that can hold more. The next work is structure, not another soak of the same kind. Failure on any of the three leaves you alive and not quite full. Soak back up and try again. Heat also scars.

A birth marrow makes a matching bath waste less. It does not perform the brace for you.

Pills stay qi alchemy. A body bath is not a potion you drink.

### Kept from the vessel-vision workshop (2026-09-25)

[PR #119](https://github.com/WanderingImmortal/tales-immortal-path/pull/119) stays closed. The useful pieces live here. The rest of that workshop is retired: neutral grade names (“First Temper”) as the ladder, a purity cap that leaves a crude body forever shorter, and a five-step refine pipeline before the first soak is playable.

**Still true**

- A manual can replace the project for the same door. Stillness, heat, and weight are the common braces. A lineage text is another method, not a higher realm.
- The world’s nickname for a body is not the realm name. A dragon manual may call Inner Tempering a Hidden Dragon Vessel. The step is still Inner Tempering.
- Two natures in one body can clash. Reconciling them (harmonize) is later work, not the first soak.
- Body progress is paid in materials. Qi can grind on ambient qi and cheap pills.
- A bath does not grant a ranged art. Breath, fog, and a flung life-force are techniques you learn. Coating the fists is what a soak can do.
- Once you have arrived at a step, that step matches qi for travel and danger. Spirit roots do not decide whether you may arrive.
- There is no body flight. Later steps leap. They do not hover.

**Lineage examples (not required to ship the first brace)**

| Manual | First-realm project | What success still is |
|--------|---------------------|------------------------|
| **Nine Dragons Body Forging** | Nine skin-and-blood circuits. Needs a dragon-touched material on the last one. | Vessel Establishment. The sect calls the body a Hidden Dragon Vessel. |
| **Thousand Poisons Body Forging** | Twelve weak poisons, in order, soaked into the skin. No antidote during that project. | The same door. The body carries poison seeds, not a higher step. |
| **No lineage text** | Limb or whole-body soaks until Late, then any common brace. | The same door, if you know a method. |

Same manual, same distance. The lineage text changes the baths and the ordeal. It does not open a step a normal body cannot reach with a common method and the materials that method asks for.

### Physique is built (lean 2026-09-25)

The **vessel physique** is the recipe of what the flesh kept. It is not rolled at birth. Variations are the point of the body path, and they lock in when the recipe locks. Something you are born with is a different object — a birth marrow or a physique seed — covered below.

| When | What the soaks have become |
|------|----------------------------|
| **Inner Tempering** | A lean in the mortal frame. Still one kind of person: the strongest honest mortal. |
| **Essence Pearl** | The mix condenses. The pearl remembers the recipe. |
| **Nascent Physique** | A physique is born with that character. Two people at the same step are not the same body. |
| **Physique Transformation** | The lean stops being a tilt and becomes what you are. |

**“Endless” means combinations, not infinite hand-authored bodies.** A short list of natures, stacked by what you soaked and where you soaked it, is enough for two refiners to diverge. Authoring a new physique for every beast is not the model.

**Where the soak lands vs what the bath is.** You choose a limb or the whole body. The solution chooses the grain.

| Material grain (mortal) | What the flesh learns | Not this |
|-------------------------|----------------------|----------|
| Stone, iron, beast hide | Density. Blows turn on the skin and meat. | A new combat stat row |
| Sinew, springy beasts | Quickness of the frame | |
| Sunscar heat, frost plants | Tolerance to that hardship | Casting that element |
| Bitter organs, venomous game | Poison and filth tolerance | |
| Rich blood, marrow foods | Staying power | A pearl (that is the next realm) |

The same bath pays less the more of that grain the flesh already holds. A body soaked only in toughening solutions is lopsided, and Late is still Late. Saturation does not move.

**Close combat, not a fireball.** A natural treasure can leave an element in the flesh. It shows up on contact: knuckles coated in flame, a step that frosts the ground, venom on the palm. Qi throws the bolt. The body wears it. Vajra Ridge still refuses flame *rebirth* (a qi art). A monk’s fists running hot is a different thing.

**Most manuals are recipes.** Gather this, brew this solution, soak this long. Practice, not comprehension. A few late manuals can demand comprehension because they bind a Vessel Rule or reconcile a birth bias with a bath. That is a second gate on top of rare materials. Keep it rare. Inner Tempering pamphlets should not require a scholar.

### Birth marrow vs vessel physique (lean 2026-09-25)

Body cultivation is not a comprehension path. Someone who pulls ahead is **lucky**, not a genius. The luck is congenital. It biases what the flesh will take. It does not make the mortal cup bigger, and it does not skip a realm.

| What you start with | How common | What it is |
|---------------------|------------|------------|
| **Birth marrow** | The usual “lucky” case | A bias in the flesh from birth. Stone baths settle easier, or the blood runs hot. Not a physique yet. |
| **Physique seed** | Rare | An unopened physique sleeping in the body. It hungers for one nature and quarrels with baths that contradict it. |
| **Stirring seed** | Very rare | The seed is already faintly awake. A close-combat flicker before you have earned anything (warm knuckles, heavy bones). Still Inner Tempering. Still a mortal frame. |

**Vessel physique** is the one you make. It is the recipe locked at Nascent Physique from what you tempered. “Vessel” here means the body you raised, not a Vessel Rule.

They can look alike in a fight and still be different things. Birth marrow is a **tenant** you did not choose. The vessel physique is the **house** you build. If they agree, baths of that nature waste less and the physique comes out specialized. If they fight, you either feed the tenant or build against it, and the house comes out compromised or costly. Two fists coated in flame are not the same story: one was born hot, the other was fed until it learned heat.

Creation points can sell this later. Birth marrow is the ordinary spend. A physique seed costs more. A stirring seed is the rare one, in the same spirit as a heavenly root. None of them enlarge the mortal cup, skip a step, or decide how far the ladder goes.

**How far the body can climb (owner 2026-09-25):** with the same manual and a normal body, every person can walk the same distance. Spirit roots do not cap vessel height. They cap the dantian. What stops a body cultivator is a missing manual or missing materials. Birth luck changes waste and the shape of the physique. It does not open a realm a normal body cannot enter, and it does not close one.

The tragedy stays. Most people never see the manual or the treasure for the next step, so they die full of the realm they could feed. That is poverty and supply, not a bad root. Reaching a realm still grants that realm’s lifespan. A body cultivator who is fed and taught can outlive a heavenly-root qi cultivator who never leaves Foundation.

Soul height is untouched by this lean.

Today the talent check does not care which path is breaking through (`isRealmBlockedByTalent`). The vessel track already has its own step number. The root cap has to apply to the dantian only, once this is built.

Da Chi’s “supreme body talent” reads as this kind of luck: a marrow that drank tempering and took the canon easily. Not a man who understood the scripture faster than his elders.

### Cult refiners and Pit Two (lean 2026-09-25)

The Blood Vessel Ward and **Tuo Yan** (Pit Two) are written on [PR #115](https://github.com/WanderingImmortal/tales-immortal-path/pull/115), not on this branch. The story still works. The old material names and the “he ate his way up” picture need a retell when that branch is next touched. Do not edit #115 from the nine-realm notes.

**What stays.** He is the founder’s question: can devouring feed the body and skip the dantian? Ward life, bind seal, vestigial Foundation qi, no Devouring Intent, meathead who chooses not to think, ~50 years old and still looking about thirty, not a successor. Gu Wei stays the other experiment: will in the dantian, ordinary flesh. The ward is still ammunition. Vajra Ridge is still scripture. Same body ladder, opposite culture. No public saint. His fate seeds stay, including the founder eating him when the experiment has an answer.

**Rename the steps, not the man.**

| Old line | Under this design |
|----------|-------------------|
| Fodder rushed to **Bronze Skin** | Rushed **Inner Tempering**. Still mortal. Still 80 years. Most die in a diversion before anyone teaches a brace. |
| Reavers at **Golden Core** and up | **Essence Pearl** and up. Taught blood arts plus a real method. Investment, not a sermon. |
| Tuo Yan at body idx **3**, **Diamond Body**, Nascent Soul parity | **Nascent Physique**. One step past a typical Reaver. Founder-fed. Not a Saint. |
| Stagnate seed climbs toward idx **4** | **Physique Transformation**. The fortress changes kind. Not a march on Saintly Flesh. |

His lifespan line still fits. Nascent Physique is the thousand-year band. He is about fifty years into it. The horror is how little of that clock he has used.

**Two kinds of feeding. Do not collapse them.**

A player refines by soaking. A cult kill is supposed to go the other way: Remnant Refine into the dantian. Tuo Yan’s horror is that the kill stays in the flesh. Eating the slain is his anomaly, not the player loop. Skin that turns common steel is Nascent Physique density, not a word for hide, and not something an Inner Tempering strongman has.

Blood pills are the ward’s cruel shortcut, not qi alchemy and not a clean bath. They are a concentrated ration that forces a crude soak and keeps the seal. Faster, more waste, same mortal cup. They do not open the next realm by themselves.

**He is not proof that manuals do not matter.** Without a method, a full mortal stays a full mortal. Ward elders have manuals and still cannot copy him. His birth marrow is why the rite stuck in the flesh instead of the dantian — luck, not comprehension. The founder’s feeding is why he walked to Nascent Physique. A bad spirit root would not have stopped that climb. Roots still explain the paper Foundation: the dantian was neglected, not the vessel.

Once that accident is written down, a normal body fed the same way should be able to walk the same distance, with more waste if the marrow fights it. Until then he is unreplicable, because the elders are trying to rebuild an accident with pills, seals, and the syllabus. The founder is trying to turn the accident into a manual. That is the experiment.

Fodder are expendable because they are sealed, untaught, and sent to die. Not because a short root caps the body.

## Prerequisites

- [x] Owner lean: milestones for power parity, not qi-style realm breakthroughs
- [ ] Anatomy Phase 1–2 ([`body-chamber-anatomy-rebuild.md`](body-chamber-anatomy-rebuild.md))
- [ ] Map refine thresholds → milestone indices
- [ ] Full design pass → `designed` before Issues

## Open questions

- Does every milestone need a tribulation, or only watershed steps?
- ACS-style “temper organ X with material Y” recipes?
- Realm names: **rename** (owner 2026-09-25). Live material ladder does not match qi grandeur. Proposal, not locked: [`nine-realm-ladder.md`](nine-realm-ladder.md) — Inner Tempering through Saintly Flesh.
- Cult ward and Pit Two (PR #115) still use Bronze / Diamond Body and “ate wrong” as the climb. Retell is parked above. Apply it on that branch when someone next edits Tuo Yan. Not this PR.

## Implementation crumbs

`data.js` `PATHS.body`, `body-chamber.js`, [`body-chamber-anatomy-rebuild.md`](body-chamber-anatomy-rebuild.md) Phase 3.
