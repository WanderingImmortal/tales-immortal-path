# Agent / branch / PR status for Wandering Immortal
# Run from repo root: .\scripts\agent-status.ps1
# Filters: -StaleOnly  -WipOnly

param(
    [switch]$StaleOnly,
    [switch]$WipOnly
)

$repoRoot = Split-Path $PSScriptRoot -Parent
Set-Location $repoRoot

git fetch origin --quiet 2>$null | Out-Null

$mainTip = (git rev-parse main 2>$null)
if (-not $mainTip) {
    Write-Error 'Could not resolve main. Are you inside the repo?'
    exit 1
}
$mainTip = "$mainTip".Trim()

$cursorBranches = @(git branch -r --list 'origin/cursor/*' 2>$null |
    ForEach-Object { ("$_".Trim() -replace '^origin/', '') } |
    Sort-Object -Unique)

$prJson = gh pr list --state all --limit 100 --json headRefName,state,number,title,mergedAt,isDraft 2>$null
if (-not $prJson) {
    Write-Warning 'gh CLI unavailable — showing branch diff only (no PR data).'
    $prs = @()
} else {
    $prs = $prJson | ConvertFrom-Json
}

function Get-GitCount {
    param([string]$Range)
    $n = git rev-list --count $Range 2>$null
    if ($null -eq $n -or "$n" -eq '') { return 0 }
    return [int]$n
}

$rows = foreach ($branch in $cursorBranches) {
    $ahead = Get-GitCount "main..origin/$branch"
    $behind = Get-GitCount "origin/$branch..main"
    $pr = $prs | Where-Object { $_.headRefName -eq $branch } | Select-Object -First 1

    $note = ''
    $status = 'unknown'

    if ($pr) {
        if ($pr.state -eq 'MERGED') {
            $status = 'merged'
            $note = 'in main'
        } elseif ($pr.isDraft) {
            $status = 'draft PR'
            $note = "PR #$($pr.number)"
        } else {
            $status = 'open PR'
            $note = "PR #$($pr.number)"
        }
    } elseif ($ahead -gt 0) {
        $status = 'WIP'
        $note = 'needs PR'
    } elseif ($behind -gt 0 -and $ahead -eq 0) {
        $status = 'stale'
        $note = 'behind main, no unique commits — delete branch'
    } else {
        $status = 'synced'
        $note = 'matches main tip'
    }

    [pscustomobject]@{
        Branch = $branch
        Status = $status
        PR     = if ($pr) { "#$($pr.number)" } else { '-' }
        Ahead  = $ahead
        Behind = $behind
        Title  = if ($pr) { $pr.title } else { '' }
        Note   = $note
        Chat   = switch ($status) {
            'merged'   { "[merged] $($pr.title) — $branch" }
            'draft PR' { "[PR #$($pr.number)] $($pr.title) — $branch" }
            'open PR'  { "[PR #$($pr.number)] $($pr.title) — $branch" }
            'WIP'      { "[WIP] — $branch" }
            'stale'    { "[stale] — $branch" }
            default    { "[?] — $branch" }
        }
    }
}

if ($StaleOnly) { $rows = @($rows | Where-Object { $_.Status -eq 'stale' }) }
if ($WipOnly)   { $rows = @($rows | Where-Object { $_.Status -in @('WIP', 'open PR', 'draft PR') }) }

Write-Host ''
Write-Host '=== Wandering Immortal — agent branch status ===' -ForegroundColor Cyan
Write-Host "main @ $($mainTip.Substring(0, 7))  |  cursor branches: $($cursorBranches.Count)" -ForegroundColor DarkGray
Write-Host ''

$rows | Format-Table Branch, Status, PR, Ahead, Behind, Note -AutoSize

$merged = @($rows | Where-Object { $_.Status -eq 'merged' }).Count
$open   = @($rows | Where-Object { $_.Status -in @('open PR', 'draft PR') }).Count
$wip    = @($rows | Where-Object { $_.Status -eq 'WIP' }).Count
$stale  = @($rows | Where-Object { $_.Status -eq 'stale' }).Count

Write-Host 'Summary:' -ForegroundColor Cyan
Write-Host "  merged to main : $merged"
Write-Host "  open PRs       : $open"
Write-Host "  WIP (no PR)    : $wip"
Write-Host "  stale branches : $stale  (safe to delete — work already in main)"
Write-Host ''

$active = @($rows | Where-Object { $_.Status -in @('WIP', 'open PR', 'draft PR') })
if ($active.Count -gt 0) {
    Write-Host 'Active work (rename chats to match):' -ForegroundColor Yellow
    $active | ForEach-Object { Write-Host "  $($_.Chat)" }
    Write-Host ''
}

$stash = @(git stash list 2>$null)
if ($stash.Count -gt 0) {
    Write-Host 'Uncommitted stash (easy to forget after phone session):' -ForegroundColor Yellow
    $stash | ForEach-Object { Write-Host "  $_" }
    Write-Host ''
}

$current = ("$(git branch --show-current 2>$null)").Trim()
if ($current -and $current -ne 'main') {
    $curRow = $rows | Where-Object { $_.Branch -eq $current }
    if ($curRow -and $curRow.Status -eq 'merged') {
        Write-Host "WARNING: You are on merged branch '$current'. Start a new branch from main before new work." -ForegroundColor Red
    } else {
        Write-Host "Current branch: $current" -ForegroundColor DarkGray
    }
}
