$ErrorActionPreference = 'Stop'

Write-Host '[init] Installing pinned dependencies...'
npm ci
Write-Host '[init] Checking Harness environment...'
npm run harness:doctor
Write-Host '[init] Resetting isolated test state...'
npm run harness:reset
Write-Host '[init] Ready.'

