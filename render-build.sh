#!/bin/bash
set -o errexit

bun install
npx prisma generate
bun run build