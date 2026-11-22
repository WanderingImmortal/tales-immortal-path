# System reconciliation

Use this guide to compare the evidence from [pre-work discovery](../.cursor/rules/work-tracking.mdc).
Record the result for the affected functional slices in the existing owning
[topic note](ideas/_template.md). See [where information lives](README.md) for
the roles of notes, the index, Issues, PRs, code, tests, and current priorities.

## Compare the evidence

1. **Intended design.** Cite the accepted direction, its approval scope and
   recorded reasons. Keep constraints, compromises and their revisit
   conditions, exploratory alternatives, deferred or superseded decisions, and
   open questions visible. Mark unavailable reasoning as unknown. Approval
   requires evidence beyond a newer note or a merged implementation.
2. **Actual implementation.** Follow a production entry point through its gates
   and dependencies. Record what a player or NPC can actually do, what only
   works in a prototype, and what is partial, unwired, or absent. A filename,
   comment, or merged PR can help locate the implementation.
3. **Verification.** For important claims cite an automated test, manual result,
   or simulation run and its conditions. Say whether it executes the
   production path, an isolated helper, or a prototype. Identify untested
   boundaries and distinguish tests of an accepted rule from tests that
   preserve current behaviour. If existing tests lock in a suspected
   restriction, record it for review before changing the assertions.

Scope completeness by the player-facing or simulation behaviour under review.
Record these dimensions separately:

| Dimension | What to record |
|---|---|
| Design | Accepted within a stated scope, exploratory, deferred, disputed, or unknown. |
| Implementation | Absent, prototype-only, partial, or implemented within an explicit scope. Note unfinished dependencies. |
| Verification | Untested, manually checked, automatically tested, or insufficient evidence. Name what the check actually covers. |
| Alignment | Matches the accepted rule, approved compromise, suspected divergence, confirmed divergence, or insufficient evidence. |
| Remaining work | The specific missing behaviour, content, integration, or verification. Separate approved scope from exploratory depth. |

A working mechanic, a completed implementation slice, and the full intended
experience are three different claims. State each at the scope supported by
evidence. Report specific gaps without percentages or new design requirements.

## Classify discrepancies

- **Stale documentation:** Current code has moved on, and the note misstates what is available.
- **Incomplete implementation:** Some of the intended behaviour is absent or blocked by an unfinished dependency.
- **Approved compromise:** There is evidence that the author accepted the narrower behaviour. Record any known revisit condition.
- **Suspected design drift:** Evidence suggests a conflict, but intent or implementation rationale is uncertain.
- **Confirmed design drift:** An accepted decision and reachable behaviour demonstrably conflict.
- **Unresolved design question:** The intended rule has yet to be established.

A slice may have several findings. Check for overbroad shipped labels, duplicated
mechanics that disagree, shortcuts without revisit conditions, and alternatives
marked rejected without evidence. Preserve original decisions and alternatives,
link to implementation and test evidence, and record the discrepancy explicitly.
Correct a stale scoped status when the evidence supports it. Use the existing
approval boundary for design choices. Queue actionable next work through the
existing Issue convention.

## Report on a substantial review

Lead with a short plain-English summary for mobile review:

- **System overview and what works.** Explain the intent and current reachable behaviour.
- **What is partial or missing?** Separate agreed work from exploratory depth.
- **What has been verified?** State the checks and important limits.
- **Where has it diverged?** Give the classification, evidence and consequences.
- **What would be lost by changing it?** Name behaviour to preserve, compatibility risks and tradeoffs.
- **What should happen next?** Recommend the smallest useful fix, investigation, note correction, or author decision.

Put detailed code references and evidence below. In a discovery handover,
include this information in the existing summary. In a PR, use the evidence in
the [existing five-question handover](../.cursor/rules/github-branch-workflow.mdc).

## Worked examples

| Slice | Design and implementation | Verification and alignment | Smallest next step |
|---|---|---|---|
| Cultivation manuals · Foundation Establishment seal | The recorded P2 decision calls for a foundation nature and path lock at the existing seal. Issue #54 and merged PR #55 lead to the production consolidation caller, which invokes the stamp. The eligible Qi seal path writes the nature and the method lock. | Code inspection supports the scoped design. The Qi foundation audit checks foundation quality, and the browser smoke suite gathers Qi. Those checks do not establish a full nature-stamp and lock playthrough. The framework's P2 status is behind the shipped slice. Later essence, legacy and method-deepening work needs separate evidence. | Annotate P2 as implemented within the existing Qi seal scope, cite the caller and PR, and flag end-to-end verification separately. Preserve later phases and alternatives. [Framework](ideas/cultivation-manuals-framework.md) · [Issue #54](https://github.com/WanderingImmortal/tales-immortal-path/issues/54) · [PR #55](https://github.com/WanderingImmortal/tales-immortal-path/pull/55) · [Seal caller](../consolidation.js#L586) · [Stamp and lock](../cultivation-methods.js#L224) · [Foundation audit](../scripts/audit-qi-purity-foundation.js) · [Browser tests](../tests/browser/game.spec.js) |
| Demonic talent · Growth and encounters | Shipped NPC growth uses a player-relative ceiling. Encounter threat has a numerical effect on combat, changes with some encounters, and is gated by whether the NPC has been met for some growth gains. Independently exceptional cultivators and reactions based on what observers learn are exploratory directions. The original rationale for the live ceiling is unknown. | Production inspection and the Phase 3B threat probe show existing behaviour and a timing discrepancy. They do not verify design approval or the proposed replacement. Record the tension and unresolved rule rather than claiming confirmed drift from the exploratory proposal. | Preserve the existing encounter behaviour and saved NPC state while investigating. Ask the author whether to approve separating growth from the player's realm and what encounter behaviour should carry forward. [Growth](../world.js#L1393) · [Encounters](../quests.js#L145) · [Design evidence](audits/development-workflow-design-knowledge.md#demonic-talent-evidence-and-handoff) · [Threat probe](audits/world-simulation-behaviour-3b.md#causality-and-consistency) |
| Redwell · Civic upkeep and town politics | The starter town has scoped civic offices and markets. The shared calendar runs rent accounting, which refreshes market stock and ages civic seats. A draft describes broader offscreen developments. Town-wide political pressure is outside the observed upkeep slice. | Phase 3B observed office turnover and restocking through production in seeded idle runs. Those runs kept the player in Redwell and did not verify the proposed effects of absence or a town-wide response. The audited slice works within that scope. Missing political depth is a separate design question. | Record what was observed and retain the draft proposal. Before queuing a political mechanic, agree on a concrete town consequence and how to verify it while the player is away. Preserve current office and stock ownership. [Starter city](ideas/redwell-starter-city.md) · [Calendar](../core.js#L1032) · [Upkeep call](../qc-depth.js#L908) · [Redwell observations](audits/world-simulation-behaviour-3b.md#redwell-case-study) · [Draft PR #251](https://github.com/WanderingImmortal/tales-immortal-path/pull/251) |
