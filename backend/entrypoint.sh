#!/bin/sh
set -eu

echo "Waiting for ngrok (http://ngrok:4040/api/tunnels)..."
i=0
until [ $i -ge 100 ]; do
  if curl -fsS http://ngrok:4040/api/tunnels >/dev/null 2>&1; then
    break
  fi
  i=$((i+1))
  sleep 0.2
done

JSON=$(curl -fsS http://ngrok:4040/api/tunnels || echo "{}")
BASE_URL=$(printf "%s" "$JSON" \
  | sed -n 's/.*"public_url":"\([^"]*\)".*/\1/p' \
  | grep '^https://' | head -n1 || true)

if [ -z "${BASE_URL:-}" ]; then
  echo "ERREUR: Impossible de récupérer BASE_URL depuis ngrok."
  exit 1
fi

export BASE_URL
echo "BASE_URL=$BASE_URL"
echo "BASE_URL=$BASE_URL" > /app/.env.runtime

exec npx ts-node -r tsconfig-paths/register src/main.ts
