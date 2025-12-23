#!/bin/bash
set -o errexit

bun install
bunx prisma generate
bun run build