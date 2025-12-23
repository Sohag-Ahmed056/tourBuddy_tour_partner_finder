#!/bin/bash
set -o errexit

bun install
 npx prisma generate --schema ./prisma
bun run build