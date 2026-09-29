#!/usr/bin/env bash
# Deploys Highpeak on this host: Postgres + the Next.js/Payload app in Docker,
# reachable only on 127.0.0.1 (Cloudflare Tunnel forwards public traffic to it).
# Safe to re-run: an existing .env is reused, so the database password never drifts.
set -euo pipefail
cd "$(dirname "$0")"

red()   { printf '\033[0;31m%s\033[0m\n' "$*"; }
green() { printf '\033[0;32m%s\033[0m\n' "$*"; }
info()  { printf '\n\033[0;34m==>\033[0m %s\n' "$*"; }
fail()  { red "ERROR: $*"; exit 1; }
# Discard lines pasted ahead of a prompt so they are not taken as answers.
drain_input() { while read -r -t 0.2 _; do :; done; }

command -v docker >/dev/null || fail "docker is not installed"
docker compose version >/dev/null 2>&1 || fail "'docker compose' (v2) is required"
command -v openssl >/dev/null || fail "openssl is not installed"
command -v curl >/dev/null || fail "curl is not installed"

# ---------------------------------------------------------------- 1. .env
if [ -f .env ]; then
  info "Using existing .env"
else
  if docker volume inspect highpeak_postgres_data >/dev/null 2>&1; then
    red "A database volume from an earlier run exists, but .env is missing."
    echo "That database keeps the password it was created with. Either restore the old .env,"
    echo "or, if the database holds nothing you need, delete it and re-run:"
    echo "    docker compose down -v && bash setup-highpeak.sh"
    exit 1
  fi

  info "Creating .env"
  drain_input
  read -rp "Public domain [peak.wisdombusara.com]: " DOMAIN
  DOMAIN=${DOMAIN:-peak.wisdombusara.com}
  read -rp "Local port for the app [3100]: " APP_PORT
  APP_PORT=${APP_PORT:-3100}
  [[ "$APP_PORT" =~ ^[0-9]+$ ]] || fail "Port must be a number"

  while true; do
    read -rsp "Database password (press Enter to generate one): " DB_PASSWORD; echo
    if [ -z "$DB_PASSWORD" ]; then
      DB_PASSWORD=$(openssl rand -hex 24)
      echo "Generated a random database password (stored in .env)."
      break
    fi
    if [ ${#DB_PASSWORD} -lt 12 ]; then red "Use at least 12 characters."; continue; fi
    case "$DB_PASSWORD" in *"'"*) red "The password cannot contain a single quote."; continue ;; esac
    read -rsp "Repeat database password: " CONFIRM; echo
    [ "$DB_PASSWORD" = "$CONFIRM" ] && break
    red "Passwords did not match."
  done

  (
    umask 077
    cat > .env <<EOF
SITE_URL=https://${DOMAIN}
APP_PORT=${APP_PORT}
DB_PASSWORD='${DB_PASSWORD}'
PAYLOAD_SECRET=$(openssl rand -hex 32)
EOF
  )
  green ".env written (readable by root only)"
fi

set -a; . ./.env; set +a
DOMAIN=${SITE_URL#https://}

# ---------------------------------------------------------------- 2. port
if ss -Hltn "sport = :${APP_PORT}" | grep -q . && [ -z "$(docker compose ps -q app 2>/dev/null)" ]; then
  fail "Port ${APP_PORT} is already used by something else on this host. Change APP_PORT in .env and re-run."
fi

# ---------------------------------------------------------------- 3. build + start
info "Building the app image (the first build takes several minutes)"
docker compose build app

info "Starting database and app"
docker compose up -d

# ---------------------------------------------------------------- 4. readiness
info "Waiting for the app (database migrations run on first start)"
ready=0
for _ in $(seq 1 60); do
  if curl -fsS --max-time 5 "http://127.0.0.1:${APP_PORT}/api/chatbot/health" >/dev/null 2>&1; then ready=1; break; fi
  sleep 3
done
if [ "$ready" != 1 ]; then
  red "The app did not start. Last log lines:"
  docker compose logs --tail=80 app
  exit 1
fi

# This call initialises Payload, which connects to Postgres and applies migrations.
if ! INIT=$(curl -fsS --max-time 180 "http://127.0.0.1:${APP_PORT}/cms-api/users/init"); then
  red "The app is up but could not initialise the database. Last log lines:"
  docker compose logs --tail=80 app
  exit 1
fi
green "App and database are running"

# ---------------------------------------------------------------- 5. first admin
# Created here over loopback, before the site is public, so nobody else can claim the first account.
if echo "$INIT" | grep -q '"initialized":false'; then
  info "Create the first CMS admin account"
  drain_input
  while true; do
    read -rp "Admin email: " ADMIN_EMAIL
    [[ "$ADMIN_EMAIL" =~ ^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$ ]] && break
    red "Enter a valid email address."
  done
  while true; do
    read -rsp "Admin password (min 8 characters): " ADMIN_PASSWORD; echo
    if [ ${#ADMIN_PASSWORD} -lt 8 ]; then red "Too short."; continue; fi
    read -rsp "Repeat admin password: " CONFIRM; echo
    [ "$ADMIN_PASSWORD" = "$CONFIRM" ] && break
    red "Passwords did not match."
  done
  export ADMIN_EMAIL ADMIN_PASSWORD
  RESPONSE=$(docker compose exec -T -e ADMIN_EMAIL -e ADMIN_PASSWORD app node -e \
    'process.stdout.write(JSON.stringify({email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, name: "Admin", role: "super-admin"}))' \
    | curl -sS -w '\n%{http_code}' -X POST -H 'Content-Type: application/json' --data-binary @- \
      "http://127.0.0.1:${APP_PORT}/cms-api/users/first-register")
  unset ADMIN_PASSWORD
  CODE=${RESPONSE##*$'\n'}
  if [ "$CODE" != 200 ] && [ "$CODE" != 201 ]; then
    red "Could not create the admin user (HTTP ${CODE}):"
    echo "${RESPONSE%$'\n'*}"
    exit 1
  fi
  green "Admin account created: ${ADMIN_EMAIL}"
else
  info "A CMS admin account already exists - skipping"
fi

# ---------------------------------------------------------------- 6. tunnel instructions
TUNNEL=$(awk '/^tunnel:/ {print $2}' /etc/cloudflared/config.yml 2>/dev/null || true)

green "
Highpeak is running on http://127.0.0.1:${APP_PORT}
"
cat <<EOF
Last step - publish it at https://${DOMAIN} through cloudflared.
This script does not edit the tunnel config, because other sites depend on it.

  1. In /etc/cloudflared/config.yml add these two lines directly ABOVE the final
     '- service: http_status:404' line. Leave every other rule as it is:

       - hostname: ${DOMAIN}
         service: http://127.0.0.1:${APP_PORT}

  2. sudo cloudflared --config /etc/cloudflared/config.yml tunnel ingress validate
  3. sudo systemctl restart cloudflared
  4. sudo cloudflared tunnel route dns --overwrite-dns ${TUNNEL:-<tunnel name from config.yml>} ${DOMAIN}

Then open https://${DOMAIN}/admin and log in.

Useful:  docker compose ps | docker compose logs -f app | docker compose restart app
Update:  git pull && bash setup-highpeak.sh
EOF
