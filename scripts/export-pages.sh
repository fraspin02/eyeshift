#!/usr/bin/env bash
# Static export for GitHub Pages (project site at https://<user>.github.io/<repo>/)
set -euo pipefail
REPO_NAME="${1:-eyeshift}"
export EXPORT=1 NEXT_PUBLIC_BASE_PATH="/${REPO_NAME}"
rm -rf out .next-export
NEXT_DIST_DIR=.next-export npx next build
touch out/.nojekyll   # keep the _next/ folder
echo "Static site ready in ./out (base path /${REPO_NAME})"
