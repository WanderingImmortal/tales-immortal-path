# Chamber track Seal / Break (per refinement)

**Status:** building  
**Issue / PR:** PR #173 (`cursor/fix-body-seal-qc-gate-0d8d`)

## Vision

Every cultivator runs **three independent tracks** (dantian, vessel, spirit). Seal and Break Through live **inside the matching chamber**, synced to that track — not creation “emphasis” or legacy `G.path`.

Creation no longer offers three path cards; new games start on **dantian focus** with all tracks at realm 0. Entry to body/soul/qi refinement is via **Cultivation Hub**.

## Mechanics

- `cultivation-chamber-steps.js`: shared UI + `withCultivationTrack` / `getActiveChamberTrack`
- Main-world Seal/Break hidden while any of qi/body/soul chambers is open
- Vessel External Tempering UI when **vessel track @ idx 0**, not `G.path === 'body'`

## Still meaningful without creation cards

- Soul embryo origin perks, tribulation scripts, chamber-specific loops
- Focus track (hub label) for main-world actions when not in a chamber

## Open questions

- Whether to remove legacy `G.path` shims entirely (future)
