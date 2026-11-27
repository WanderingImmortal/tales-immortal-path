# Design authority map

Use this directory to find the existing topic note and the specific decision
that governs your question. The author has final authority over creative
direction. A note can contain accepted decisions, exploratory alternatives,
and unresolved questions side by side.

## Which source answers the question?

| Question | Evidence to use |
|---|---|
| What should the game do? | The author's explicitly accepted decision in its owning topic note. Check what was approved and where it applies. A newer proposal or a merged implementation does not supersede it. |
| What does the game do today? | Reachable production paths and observed behaviour. Tests demonstrate specific outcomes under stated conditions. Notes and PRs help locate the implementation and its history. |
| Why was it decided? | The recorded rationale and dated approval or discussion linked from the decision. Mark unavailable reasoning unknown. |
| What remains unfinished? | Reconcile accepted scope, current implementation, and verification. Keep exploratory ambitions separate from outstanding commitments. |
| What should be built next? | The author's current priorities and approved direction, dependencies, and actionable Issues. [NOW](NOW.md) records immediate focus. Queue position conveys priority rather than design approval. |

## Where to look

These are starting points for locating scoped decisions. Check each linked
record for its disposition and approval evidence. For topics outside this
directory, use the [idea index](ideas/README.md) and related notes. Add a row
when a frequently used domain has a clear owner or a recurring ownership gap.

| Domain | Existing homes and their scope |
|---|---|
| Shared cultivation progression | [Nine-realm ladder](ideas/nine-realm-ladder.md#design-ship-readiness-owner-2026-10-14) records the shared scaffold and path-specific name decisions. [Watershed pacing](ideas/watershed-realms-lifespan-pacing.md) holds lifespan and breakthrough pacing decisions and playtest targets. |
| Qi, Body, and Soul | [Technique-driven cultivation](ideas/technique-driven-cultivation.md) covers Qi methods and foundation stamping. [Body refinement](ideas/body-refinement-philosophy-and-ceilings.md) covers refinement and its ceilings, and points to the shared ladder for upper realm identities. [Spirit path](ideas/spirit-path-full-design.md) holds the soul progression direction and its open policy questions. |
| NPC cultivation and agency | [World cultivation parity](ideas/world-cultivation-parity.md) holds parity principles. [Ambitions and goal pursuit](ideas/npc-agency-ambitions-goals.md) covers the runtime goal model and the Well-Ring slice. |
| NPC knowledge and social perception | [Incidents and imperfect knowledge](ideas/npc-agency-incidents-beliefs.md) covers objective incidents, actor observations and beliefs. [Public identity and disguise](ideas/disguise-and-public-identity.md) covers what an actor can present or conceal. Check deferred scope for wider rumour transmission. |
| Innate gifts and exceptional NPC talent | [Spiritual roots](ideas/spiritual-roots-taxonomy-v2.md) covers root composition, grade, and innate height. Ownership of an accepted demonic-talent redesign is unresolved. The [audit](audits/development-workflow-design-knowledge.md#demonic-talent-evidence-and-handoff) preserves the exploratory direction and shipped evidence. |
| Combat and damage | [Combat damage depth](ideas/combat-damage-depth.md) holds scoped damage and debuff decisions alongside parked options. The [combat reaction sandbox](ideas/combat-reaction-sandbox-prototype.md) records an experiment. |
| Interface navigation | [Overlay navigation lifecycle](ideas/escape-key-overlay-navigation.md#approved-navigation-principles) records the approved Back, cleanup and protected-flow rules and the currently migrated surfaces. |
| Time and background simulation | [Living world clock](ideas/world-clock-continuous.md) covers the shared calendar and Play/Pause. [Chronicle and projects](ideas/chronicle-and-projects.md) covers seclusion playback. [Time and NPC state consistency](ideas/time-npc-state-consistency.md) is an implementation handoff for overlap and ordering. |
| Cities and local simulation | [Redwell starter city](ideas/redwell-starter-city.md) covers the local starter scope. [Civic seats](ideas/civic-seats-generator.md) describes the office model. Broader city simulation remains a [draft proposal](https://github.com/WanderingImmortal/tales-immortal-path/pull/251). |
| Sects and factions | [Organization types](ideas/jianghu-organization-types.md) covers the taxonomy. [Procedural sect ecology](ideas/procedural-zone-sect-ecology.md) covers smaller organizations and their scope. [Sect and faction identities](ideas/sect-faction-identities.md) points to named powers and lineage notes. |
| Reincarnation and cross-life persistence | [PR #246](https://github.com/WanderingImmortal/tales-immortal-path/pull/246) and the [stabilization audit](audits/post-stabilization-audit-250.md) locate the current legacy and run handoff. An accepted design owner for broader cross-life world continuity is unresolved in the reviewed sources. [Draft PR #251](https://github.com/WanderingImmortal/tales-immortal-path/pull/251) leaves that decision open. |
| Economy and markets | [Redwell starter city](ideas/redwell-starter-city.md) covers the local market. [Resource sources](ideas/resource-sources-wilderness-regen.md) covers finite stock and regeneration, and [institutional procurement](ideas/institutional-procurement-storehouse.md) covers replenishment. [Commerce and markets](ideas/commerce-and-markets.md) retains broader proposals. |

## Ownership and changes over time

Keep one owning location for each consequential rule. Related notes should link
to the specific decision and explain how their system uses it. Two notes can
own different questions about the same system. When two notes appear to own
the same rule, flag the overlap for [reconciliation](system-reconciliation.md)
before changing either account.

Trace technical ownership separately during
[discovery](../.cursor/rules/work-tracking.mdc). For example, the imperfect
knowledge note describes the intended separation, while
[`npc-incidents.js`](../npc-incidents.js#L117) records incidents and
[`npc-decisions.js`](../npc-decisions.js#L344) consumes the actor's knowledge.
If the actual state writers or readers are unclear, record the architecture
question and verify the relevant path before changing it.

After explicit author approval of a change, record it in the owning note with
the approval source and exact path, realm, NPC type, region, or phase affected.
Link the old and new decisions in both directions. Keep the old reasoning and
open alternatives, describe the gains, sacrifices, and affected systems, and
point dependent notes to the current decision. Track any implementation change
separately. Reuse the [decision template](ideas/_template.md).

## When sources disagree

1. Quote the conflicting claims and identify the question. Locate the owning
   note and check disposition, date, scope, and approval source.
2. Check reachable production paths and what the tests actually show when
   behaviour is at issue. Compare scope and terminology before classifying a
   contradiction. Preserve earlier decisions and alternatives.
3. Explain the remaining conflict in plain English and flag any missing
   evidence. Use the existing [approval boundary](../.cursor/rules/work-tracking.mdc)
   for consequential creative or mechanical decisions. Use the
   [plain-English PR handover](../.cursor/rules/github-branch-workflow.mdc) to
   say whether the change preserves, extends, simplifies, or contradicts
   accepted design.

## Worked examples

- **Demonic talent.** The parity note records common cultivation rules where
  lore permits and allows NPC schedules to be abstracted. Production growth
  has a player-relative ceiling, and the encounter code uses numerical threat
  for confrontation and combat. The author direction for independently
  exceptional cultivators remains exploratory. The original rationale for the
  ceiling is unknown. Cite the parity scope and live consumers, and ask the
  author before establishing a new talent or encounter rule. [Parity](ideas/world-cultivation-parity.md#everyone-cultivates-sim-parity) · [Growth](../world.js#L1393) · [Encounters](../quests.js#L145) · [Audit](audits/development-workflow-design-knowledge.md#demonic-talent-evidence-and-handoff)
- **Cultivation progression.** The Qi Foundation Establishment seal's nature
  stamp and method lock are scoped in the technique-driven cultivation note,
  which the manuals framework already references. A market or combat note
  should link to the seal decision when describing method choice or a nature's
  effects. The production helper checks the eligible Qi seal, and the design
  parks the meridian-wash escape hatch. The seal gives no authority to impose
  the same lock on Body or Soul or at other realms. [Stamp and lock](ideas/technique-driven-cultivation.md#stamp--lock-q4-q7) · [Manuals framework](ideas/cultivation-manuals-framework.md) · [Qi seal helper](../cultivation-methods.js#L224)
- **Lifespan and combat overlap.** The lifespan note addresses realm pacing and
  the damage note addresses combat consequences. A regression demonstrates
  that an NPC's strongest track currently sets realm-based lifespan while
  encounter combat uses a Qi baseline. These are different questions.
  Hypothetical request: use the lifespan track for combat too. Trace encounter
  tuning and affected capabilities, then check for approval of that change.
  The lifespan rule and its test do not settle the combat rule. If the design
  evidence is still unclear, ask before changing combat outcomes.
  [Pacing](ideas/watershed-realms-lifespan-pacing.md) · [Damage design](ideas/combat-damage-depth.md) · [Overlap audit](audits/post-stabilization-audit-250.md#b-02--medium--npc-potential-and-combat-use-different-player-relative-scales) · [Regression](../scripts/test-unified-disciple-identity.js#L452)
