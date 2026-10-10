#!/usr/bin/env sh
set -eu

echo '[init] Installing pinned dependencies...'
npm ci
echo '[init] Checking Harness environment...'
npm run harness:doctor
echo '[init] Resetting isolated test state...'
npm run harness:reset
echo '[init] Ready.'

