#!/usr/bin/env bash
# Build, then force-push dist/ to the gh-pages branch. No dependencies.
set -euo pipefail

cd "$(dirname "$0")/.."

remote=$(git remote get-url origin)
name=$(git config user.name)
email=$(git config user.email)
stamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)

npm run build

rm -rf .deploy
cp -R dist .deploy
cd .deploy

git init -q -b gh-pages
git add -A
git -c user.name="$name" -c user.email="$email" commit -qm "Deploy $stamp"
git push -qf "$remote" gh-pages

cd ..
rm -rf .deploy

echo "Deployed $stamp to gh-pages"
