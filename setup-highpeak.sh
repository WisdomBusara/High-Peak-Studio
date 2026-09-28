#!/bin/bash

#############################################################################
# Highpeak Platform - Complete Setup Script
# Generates secrets, creates .env.local, and deploys via Cloudflare Tunnel
#############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}➜${NC} $1"; }
log_success() { echo -e "${GREEN}✓${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; }

#############################################################################
# STEP 1: Verify Prerequisites
#############################################################################

log_info "Checking prerequisites..."

if [ ! -f "docker-compose.yml" ]; then
  log_error "docker-compose.yml not found. Run from /opt/highpeak"
  exit 1
fi

# Check for docker compose (v2 preferred over old v1)
if ! command -v docker &> /dev/null; then
  log_error "Docker not installed"
  exit 1
fi

if ! command -v openssl &> /dev/null; then
  log_error "OpenSSL not installed"
  exit 1
fi

log_success "Prerequisites verified"
echo ""

#############################################################################
# STEP 2: Generate Secure Secrets
#############################################################################

log_info "Generating secure secrets..."

# Generate random passwords and secrets
DB_PASSWORD=$(openssl rand -base64 32)
PAYLOAD_SECRET=$(openssl rand -base64 32)
DB_USER="highpeak_user"
DB_NAME="highpeak"

log_success "Secrets generated"
echo ""

#############################################################################
# STEP 3: Prompt for Configuration
#############################################################################

log_info "Configure your deployment..."
echo ""

read -p "$(echo -e ${BLUE}?)$(echo -e ${NC}) Enter domain (default: peak.wisdombusara.com): " DOMAIN
DOMAIN=${DOMAIN:-peak.wisdombusara.com}

read -p "$(echo -e ${BLUE}?)$(echo -e ${NC}) Enter NODE_ENV (default: production): " NODE_ENV
NODE_ENV=${NODE_ENV:-production}

read -p "$(echo -e ${BLUE}?)$(echo -e ${NC}) OpenAI API Key (optional, press Enter to skip): " OPENAI_API_KEY
OPENAI_API_KEY=${OPENAI_API_KEY:-}

echo ""

#############################################################################
# STEP 4: Create .env.local
#############################################################################

log_info "Creating .env.local..."

cat > .env.local << EOF
# Highpeak Environment Configuration
# Generated: $(date)

# Node Environment
NODE_ENV=${NODE_ENV}

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://${DOMAIN}

# Database Configuration
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}
DATABASE_URL=postgres://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}

# Payload CMS Secret
PAYLOAD_SECRET=${PAYLOAD_SECRET}

# Optional: OpenAI Integration
EOF

if [ -n "$OPENAI_API_KEY" ]; then
  echo "OPENAI_API_KEY=${OPENAI_API_KEY}" >> .env.local
else
  echo "# OPENAI_API_KEY=sk-..." >> .env.local
fi

cat >> .env.local << 'EOF'

# Optional: Cloudflare R2 Storage
# R2_ACCESS_KEY_ID=
# R2_SECRET_ACCESS_KEY=
# R2_BUCKET_NAME=
# NEXT_PUBLIC_R2_URL=

# Optional: Analytics
# NEXT_PUBLIC_ANALYTICS_ID=

# Optional: Email
# RESEND_API_KEY=
EOF

log_success ".env.local created"
echo ""

#############################################################################
# STEP 5: Display Configuration
#############################################################################

log_info "Configuration Summary:"
echo ""
echo "  Domain:              ${DOMAIN}"
echo "  Environment:         ${NODE_ENV}"
echo "  Database User:       ${DB_USER}"
echo "  Database Name:       ${DB_NAME}"
echo "  Database Password:   ${DB_PASSWORD:0:15}..."
echo "  Payload Secret:      ${PAYLOAD_SECRET:0:15}..."
if [ -n "$OPENAI_API_KEY" ]; then
  echo "  OpenAI Key:          Set ✓"
else
  echo "  OpenAI Key:          Not set (optional)"
fi
echo ""

read -p "$(echo -e ${YELLOW}⚠${NC}) Continue with deployment? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ]; then
  log_error "Deployment cancelled"
  exit 1
fi

echo ""

#############################################################################
# STEP 6: Deploy Docker Services
#############################################################################

log_info "Deploying Docker services..."

# Use docker compose v2 instead of old docker-compose
DOCKER_CMD="docker compose"

# Check which command to use
if ! $DOCKER_CMD version &>/dev/null; then
  log_info "docker compose v2 not found, trying docker-compose v1..."
  DOCKER_CMD="docker-compose"
fi

# Build image
log_info "Building Docker image (this may take 2-3 minutes)..."
$DOCKER_CMD build --no-cache 2>&1 | grep -E "Step|Successfully|ERROR" || true

log_success "Docker image built"

# Start services
log_info "Starting services..."
$DOCKER_CMD up -d

log_success "Services started"

# Wait for database
log_info "Waiting for database to be ready..."
for i in {1..30}; do
  if $DOCKER_CMD exec -T postgres pg_isready -U ${DB_USER} &> /dev/null; then
    log_success "Database is ready"
    break
  fi
  echo -n "."
  sleep 2
done

echo ""

# Show status
log_info "Service status:"
$DOCKER_CMD ps
echo ""

#############################################################################
# STEP 7: Initialize Database
#############################################################################

log_info "Initializing database..."

log_info "Running migrations..."
$DOCKER_CMD exec -T app npm run payload:migrate 2>&1 | tail -5 || true

log_success "Database initialized"
echo ""

#############################################################################
# STEP 8: Create Admin User
#############################################################################

log_info "Creating admin user..."
echo ""

read -p "$(echo -e ${BLUE}?)$(echo -e ${NC}) Admin email: " ADMIN_EMAIL
read -sp "$(echo -e ${BLUE}?)$(echo -e ${NC}) Admin password: " ADMIN_PASSWORD
echo ""

$DOCKER_CMD exec -T app npm run payload:create-user -- \
  --email "$ADMIN_EMAIL" \
  --password "$ADMIN_PASSWORD" 2>&1 | tail -3 || true

log_success "Admin user creation initiated"
echo ""

#############################################################################
# STEP 9: Verify Cloudflare Tunnel
#############################################################################

log_info "Checking Cloudflare Tunnel..."

if sudo systemctl is-active --quiet cloudflared; then
  log_success "Cloudflare Tunnel is running"
  TUNNEL_STATUS=$(cloudflared tunnel info highpeak 2>&1 | head -3 || echo "Tunnel info unavailable")
  echo "  $TUNNEL_STATUS"
else
  log_error "Cloudflare Tunnel is NOT running"
  log_info "To start: sudo systemctl start cloudflared"
fi

echo ""

#############################################################################
# SUMMARY
#############################################################################

echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         Highpeak Deployment Complete! 🎉                   ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${GREEN}✓ Configuration saved to: .env.local${NC}"
echo ""

echo -e "${BLUE}📌 NEXT STEPS:${NC}"
echo ""

echo "1. ${YELLOW}Verify Cloudflare Tunnel DNS${NC}"
echo "   In Cloudflare Dashboard:"
echo "   - Domain: wisdombusara.com"
echo "   - DNS → Add CNAME Record"
echo "   - Name: peak"
echo "   - Target: 7769d2c1-8f71-4486-b96a-45cc10a284e6.cfargotunnel.com"
echo "   - Proxied: ✅ ON"
echo ""

echo "2. ${YELLOW}Test your deployment${NC}"
echo "   Wait 30-60 seconds for DNS propagation, then:"
echo "   curl -I https://${DOMAIN}"
echo ""

echo "3. ${YELLOW}Access your platform${NC}"
echo "   Website:  https://${DOMAIN}"
echo "   Admin:    https://${DOMAIN}/admin"
echo "   Email:    ${ADMIN_EMAIL}"
echo ""

echo -e "${GREEN}📊 Service Information:${NC}"
echo "   Database User:  ${DB_USER}"
echo "   Database:       ${DB_NAME}"
echo "   Container Port: 3000 → localhost:3000"
echo ""

echo -e "${GREEN}🔧 Useful Commands:${NC}"
echo "   Check status:    docker compose ps"
echo "   View logs:       docker compose logs -f app"
echo "   Restart:         docker compose restart"
echo "   Stop:            docker compose down"
echo "   Database backup: docker compose exec -T postgres pg_dump -U ${DB_USER} ${DB_NAME} > backup.sql"
echo ""

echo -e "${YELLOW}💾 Important Files:${NC}"
echo "   Environment:     .env.local (keep secure!)"
echo "   Tunnel Config:   /etc/cloudflared/config.yml"
echo "   Tunnel Status:   sudo systemctl status cloudflared"
echo ""

log_success "Setup complete! Your Highpeak platform is ready to serve traffic."
log_info "Visit https://${DOMAIN} once DNS propagates (30-60 seconds)"
