#!/bin/bash
set -o errexit

bun install
bun run db:generate
bun run build