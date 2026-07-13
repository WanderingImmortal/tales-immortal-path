#!/usr/bin/env bash
# Pre-PR recursion audits. Run from repo root: bash scripts/pre-pr-check.sh
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

echo "=== Pre-PR recursion audits ==="
node scripts/audit-ensure-sync-recursion.js
node scripts/audit-storage-recursion.js
echo ""
echo "All recursion audits passed."
