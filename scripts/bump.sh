#!/usr/bin/env bash
# Bump the version of app, api and push together, commit and tag vX.Y.Z.
# Usage: scripts/bump.sh major|minor|patch
set -euo pipefail

part=${1:?usage: bump.sh major|minor|patch}
cd "$(dirname "$0")/.."

if [ -n "$(git status --porcelain)" ]; then
  echo "working tree is not clean" >&2
  exit 1
fi

# Latest release tag is the source of truth; fall back to package.json.
current=$(git tag --list 'v[0-9]*' --sort=-v:refname | head -n1 | sed 's/^v//')
current=${current:-$(sed -n 's/^  "version": "\(.*\)",/\1/p' app/package.json)}
IFS=. read -r major minor patch <<<"$current"
case "$part" in
  major) major=$((major + 1)); minor=0; patch=0 ;;
  minor) minor=$((minor + 1)); patch=0 ;;
  patch) patch=$((patch + 1)) ;;
  *) echo "unknown bump: $part" >&2; exit 1 ;;
esac
next="$major.$minor.$patch"

sed -i.bak "s/^  \"version\": \".*\",/  \"version\": \"$next\",/" app/package.json && rm app/package.json.bak
uv version "$next" --project api
uv version "$next" --project push

git add app/package.json api/pyproject.toml api/uv.lock push/pyproject.toml push/uv.lock
git commit -m "release v$next"
git tag "v$next"
echo "$current -> $next (tagged v$next)"
