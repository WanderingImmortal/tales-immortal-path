$ErrorActionPreference = 'Stop'
node (Join-Path $PSScriptRoot 'verify.js')
exit $LASTEXITCODE
