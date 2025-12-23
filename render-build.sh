#!/bin/bash
set -o errexit

bun install
npx prisma generate --schema ./prisma/schema
bun run build