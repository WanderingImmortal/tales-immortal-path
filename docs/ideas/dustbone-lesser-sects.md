# Dustbone lesser sects (design slots)

| Field | Value |
|-------|-------|
| **Status** | `idea` — **identities TBD by owner** |
| **Blocked on** | [`jianghu-organization-types.md`](jianghu-organization-types.md); [`qc-sect-join-ladder.md`](qc-sect-join-ladder.md) |
| **Issue** | none yet |
| **Chat / PR** | design chat 2026-07-31 · [`cursor/qc-density-org-stubs-ae81`](../../) |
| **Updated** | 2026-07-31 |

**Not:** Sandveil tribes ([`sandveil-tribunal-cultures.md`](sandveil-tribunal-cultures.md)) · great sect branches (Heartlands docs) · guilds ([`creation-path-guilds.md`](creation-path-guilds.md))

## Intent

**Tier I** cultivation halls in Dustbone — where inferior-root QC cultivators actually land. Weaker standards, smaller manuals, local rivals — **foot in the jianghu** without great sect lineage. Design **2–3** for Redwell–mid-city band before implementing join flow.

## Design notes

### Slot map (fill one block per sect)

Use template from [`jianghu-organization-types.md`](jianghu-organization-types.md).

---

### Slot A — Redwell fringe (suggested lean: civic / well-cultivator)

| Field | Draft |
|-------|-------|
| **Working name** | *TBD* — e.g. Well-Ring Lodge |
| **Type** | Lesser sect / hall · **Org tier I** |
| **Apex** | Peak FE hall master · no hidden NS |
| **Vibe** | Sand-brick respectability; cultivators who answer to the warden |
| **Recruitment** | Sponsor from well boss seat or pass basic trial |
| **Manual lean** | Crude circulation; earth/water dustbone flavor |
| **Rival** | *TBD* outer disciple |
| **Player hook** | Stable missions; boring; good for porter-cultivator hybrid |

---

### Slot B — Quarry / warrior lean (suggested lean: Sunscar-adjacent, not tribal)

| Field | Draft |
|-------|-------|
| **Working name** | *TBD* — e.g. Sand-Scar Hall |
| **Type** | Lesser sect · **Org tier I** |
| **Apex** | Strong Peak QC / early FE master |
| **Vibe** | Harsh trials; body-conditioning before qi; quarry grit |
| **Recruitment** | Fight trial; tolerate pain |
| **Manual lean** | Bronze-skin variant; short gather buffs |
| **Rival** | *TBD* — bully outer |
| **Player hook** | Combat missions; Sunscar respect without blood oath |

**Note:** Not Sunscar tribe — adjacent culture, separate institution.

---

### Slot C — Mid city (suggested lean: first place player feels small)

| Field | Draft |
|-------|-------|
| **Working name** | *TBD* |
| **Type** | Lesser sect · **Org tier I–II** |
| **Apex** | GC elder (public) — humbles visitors |
| **Vibe** | Real sect fiction at smaller scale; GC disciples on the street |
| **Recruitment** | Harder trial; inferior root may be turned to attendant |
| **Manual lean** | One step above Redwell pamphlets |
| **Rival** | *TBD* — named GC outer (unreachable until later) |
| **Player hook** | Tournament month; beast-wave conscription pool |

---

### Explicitly not these slots

- Sandveil tribes (blood, contract, not mass disciple)
- Threshold great sect branches (root exam — separate ladder)
- Alchemy / Formations guild (craft charter)

## Prerequisites

- [ ] Owner names + myth for A/B/C
- [ ] [`qc-sect-join-ladder.md`](qc-sect-join-ladder.md) mission template
- [ ] Redwell + mid city on map

## Open questions

- [ ] Two halls near Redwell or one hall + one mid-city only for v1?
- [ ] Hall feud with each other or shared enemy (bandits, cult)?

## Implementation crumbs

`data.js` faction defs, `WORLD_LOCATIONS` hall nodes, `story-arcs.js` mission pool — after identities locked.
