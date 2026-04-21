#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

# Clean build dirs that we manage
rm -rf docs/assets docs/fonts
mkdir -p docs/assets docs/fonts docs/img

# Copy static assets
cp -r src/fonts/*.woff2 docs/fonts/ 2>/dev/null || true
# only the merged -full- files actually need shipping; remove non-full to keep docs lean
rm -f docs/fonts/inter-tight-400.woff2 docs/fonts/inter-tight-500.woff2 docs/fonts/inter-tight-600.woff2 \
      docs/fonts/inter-tight-ext-400.woff2 docs/fonts/inter-tight-ext-500.woff2 docs/fonts/inter-tight-ext-600.woff2 \
      docs/fonts/fraunces-400.woff2 docs/fonts/fraunces-500.woff2 docs/fonts/fraunces-600.woff2 \
      docs/fonts/fraunces-400-italic.woff2 \
      docs/fonts/fraunces-ext-400.woff2 docs/fonts/fraunces-ext-500.woff2 docs/fonts/fraunces-ext-600.woff2 \
      docs/fonts/fraunces-ext-400-italic.woff2

# Copy images
cp -r src/img/*.webp docs/img/ 2>/dev/null || true
cp -r src/img/*.svg docs/img/ 2>/dev/null || true

# Copy fonts.css
cp src/fonts.css docs/fonts.css

# Copy main.js
cp src/main.js docs/assets/main.js

# Build Tailwind
./node_modules/.bin/tailwindcss -i src/main.css -o docs/assets/main.css --minify

echo "--- docs tree ---"
find docs -maxdepth 3 -type f | sort
du -sh docs
