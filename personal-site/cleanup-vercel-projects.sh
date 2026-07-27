#!/usr/bin/env bash
set -euo pipefail

# Removes only the accidental Ulas personal-site test projects.
# Keeps: ulas-arslan, sighub-renewal-radar-8417d2ad, dailyrevops,
# sighub-admin, and prayer-habits-press-site.

SCOPE="ulas-projects-e976586e"
PROJECTS=(
  "ulas-deploy-schema-check"
  "ulas-site-data-2-a"
  "ulas-site-diag"
  "ulas-site-data-2-p1"
  "ulas-site-data-2-parts"
  "ulas-site-data-0-parts"
  "ulas-site-data-0"
  "ulas-recover-diag"
  "ulas-site-data-6"
  "ulas-site-data-5"
  "ulas-site-data-4"
  "ulas-site-data-3"
  "ulas-site-data-2"
  "ulas-site-data-1"
  "ulas-binary-test"
)

for project in "${PROJECTS[@]}"; do
  echo "Removing ${project} from ${SCOPE}..."
  vercel remove "${project}" --yes --scope "${SCOPE}"
done

echo "Done. The only remaining Ulas personal-site project should be: ulas-arslan"
