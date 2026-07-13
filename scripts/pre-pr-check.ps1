# Pre-PR recursion audits. Run from repo root: .\scripts\pre-pr-check.ps1
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)

Write-Host '=== Pre-PR recursion audits ==='
node scripts/audit-ensure-sync-recursion.js
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
node scripts/audit-storage-recursion.js
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host ''
Write-Host 'All recursion audits passed.'
