#!/bin/bash
# Prisma Guard - blocks dangerous prisma commands that destroy FK constraints
# Usage: source this in your shell profile, or use as a wrapper
#
# Add to ~/.zshrc or ~/.bashrc:
#   alias prisma="/path/to/prisma-guard.sh"

BLOCKED_COMMANDS=("db push" "migrate dev" "migrate deploy" "migrate reset" "db seed")

for blocked in "${BLOCKED_COMMANDS[@]}"; do
  if echo "$*" | grep -qi "$blocked"; then
    echo ""
    echo "!! BLOCKED: 'prisma $blocked' is not allowed in this project."
    echo ""
    echo "   prisma db push / migrate DESTROYS foreign key constraints"
    echo "   that are maintained manually in Supabase."
    echo ""
    echo "   Safe commands:"
    echo "     pnpm prisma:generate   - regenerate TypeScript types"
    echo "     prisma generate        - same thing"
    echo "     prisma studio          - browse data (read-only)"
    echo ""
    echo "   Schema changes: apply manually via SQL in Supabase dashboard."
    echo ""
    exit 1
  fi
done

# Allow safe commands (generate, studio, format, validate, etc.)
exec npx prisma "$@"
