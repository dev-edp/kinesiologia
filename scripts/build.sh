#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

# Clean build dirs that we manage
rm -rf docs/assets docs/fonts
mkdir -p docs/assets docs/fonts docs/img

# Copy fonts (Saira variable woff2 — 4 files, ~125KB total)
cp -r src/fonts/*.woff2 docs/fonts/

# Copy SVGs (logos, favicon)
cp -r src/img/*.svg docs/img/ 2>/dev/null || true
# Copy any local webp (we keep almost nothing local — most images live on R2)
cp -r src/img/*.webp docs/img/ 2>/dev/null || true

# Copy fonts.css
cp src/fonts.css docs/fonts.css

# Copy main.js
cp src/main.js docs/assets/main.js

# Build Tailwind
./node_modules/.bin/tailwindcss -i src/main.css -o docs/assets/main.css --minify

echo "--- docs tree ---"
find docs -maxdepth 3 -type f | sort
du -sh docs
