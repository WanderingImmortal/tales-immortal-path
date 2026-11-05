#!/usr/bin/env bash
# Pre-PR recursion audits. Run from repo root: bash scripts/pre-pr-check.sh
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

echo "=== Pre-PR recursion audits ==="
node scripts/audit-ensure-sync-recursion.js
node scripts/audit-storage-recursion.js
node scripts/audit-time-billing.js
node scripts/audit-world-sim.js
node scripts/test-time-npc-consistency.js
node scripts/test-player-activity.js
node scripts/test-well-ring-lodge-npcs.js
node scripts/test-npc-foundations-ties.js
node scripts/test-npc-personality-consistency.js
node scripts/audit-cultivation-progression.js
node scripts/audit-qi-density-recovery.js
node scripts/audit-qi-purity-foundation.js
node scripts/audit-qi-purity-technique.js
echo ""
echo "=== Body overlay fit audit ==="
node scripts/audit-body-overlay-fit.js
echo ""
echo "All pre-PR audits passed."
