#!/usr/bin/env bash
set -euo pipefail

# Read the latest commit message, lowercase, and strip newlines
COMMIT_MSG=$(git log -1 --pretty=%B | tr -d '\n' | tr '[:upper:]' '[:lower:]')

if [[ "$COMMIT_MSG" =~ feat\[breaking\] ]]; then
  echo "major"
elif [[ "$COMMIT_MSG" =~ feat! ]]; then
  echo "minor"
elif [[ "$COMMIT_MSG" =~ (feat|fix|chore) ]]; then
  echo "patch"
else
  # Default fallback
  echo "patch"
fi
