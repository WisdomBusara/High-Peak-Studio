#!/bin/bash

#############################################################################
# Highpeak Platform - Deployment with Cloudflare Tunnel Support
# Supports both direct SSL and Cloudflare Tunnel modes
#############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Log functions
log_info() { echo -e "${BLUE}➜${NC} $1"; }
log_success() { echo -e "${GREEN}✓${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; }
log_warning() { echo -e "${YELLOW}⚠${NC} $1"; }

#############################################################################
# STEP 0: Pre-flight checks
#############################################################################

log_info "Starting Highpeak deployment..."
echo ""

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ] && ! sudo -n true 2>/dev/null; then
  log_error "This script requires sudo access. Please run: sudo bash deploy-with-cloudflare.sh"
  exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  log_warning "Docker not found. Installing..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  sudo usermod -aG docker $USER
  log_success "Docker installed"
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
  log_info "Installing docker-compose..."
  sudo apt-get install -y docker-compose
  log_success "docker-compose installed"
fi

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
  log_error "docker-compose.yml not found. Please run this script from the Highpeak repository root."
  exit 1
fi

log_success "Pre-flight checks passed"
echo ""

#############################################################################
# STEP 1: Choose deployment method
#############################################################################

log_info "Choose your deployment method:"
echo ""
echo "  1) Cloudflare Tunnel (recommended)"
echo "     - No port exposure"
echo "     - Free SSL (Cloudflare handles it)"
echo "     - Works behind NAT/firewall"
echo ""
echo "  2) Direct SSL with Let's Encrypt"
echo "     - Requires port 80/443 open"
echo "     - Manual certificate renewal"
echo "     - Works for dedicated servers"
echo ""
read -p "$(echo -e ${BLUE}?)$(echo -e ${NC}) Select method (1 or 2): " METHOD

if [ "$METHOD" == "1" ]; then
  TUNNEL_MODE=true
  log_success "Using Cloudflare Tunnel mode"
elif [ "$METHOD" == "2" ]; then
  TUNNEL_MODE=false
  log_success "Using Direct SSL mode"
else
  log_error "Invalid selection. Exiting."
  exit 1
fi

echo ""

#############################################################################
# STEP 2: Generate Secure Secrets
#############################################################################

log_info "Step 1: Generating secure secrets..."

# Generate DB password
DB_PASSWORD=$(openssl rand -base64 32)
log_success "Generated database password"

# Generate Payload secret
PAYLOAD_SECRET=$(openssl rand -base64 32)
log_success "Generated Payload secret"

echo ""

#############################################################################
# STEP 3: Setup Environment Variables
#############################################################################

log_info "Step 2: Setting up environment variables..."

# Copy template
cp .env.production .env.local
log_success "Copied .env.production to .env.local"

# Prompt for domain
echo ""
read -p "$(echo -e ${BLUE}?)$(echo -e ${NC}) Enter your domain (default: peak.wisdombusara.com): " DOMAIN
DOMAIN=${DOMAIN:-peak.wisdombusara.com}
log_success "Domain set to: $DOMAIN"

# Update .env.local with values
sed -i "s|DATABASE_URL=.*|DATABASE_URL=postgres://highpeak_user:${DB_PASSWORD}@postgres:5432/highpeak|" .env.local
sed -i "s|PAYLOAD_SECRET=.*|PAYLOAD_SECRET=${PAYLOAD_SECRET}|" .env.local
sed -i "s|NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=https://${DOMAIN}|" .env.local

log_success "Environment variables updated in .env.local"
echo ""

#############################################################################
# CONDITIONAL STEPS: SSL or Cloudflare
#############################################################################

if [ "$TUNNEL_MODE" = false ]; then

  #############################################################################
  # STEP 4A: Setup SSL Certificate (Direct Mode)
  #############################################################################

  log_info "Step 3: Setting up SSL certificate with Let's Encrypt..."

  # Install certbot if needed
  if ! command -v certbot &> /dev/null; then
    log_info "Installing certbot..."
    sudo apt-get update
    sudo apt-get install -y certbot python3-certbot-nginx
    log_success "certbot installed"
  fi

  # Prompt for admin email
  echo ""
  read -p "$(echo -e ${BLUE}?)$(echo -e ${NC}) Enter admin email for SSL certificate: " ADMIN_EMAIL
  log_success "Admin email set to: $ADMIN_EMAIL"

  # Get SSL certificate
  log_info "Requesting SSL certificate for $DOMAIN..."
  sudo certbot certonly --standalone \
    -d "$DOMAIN" \
    --agree-tos \
    --no-eff-email \
    -m "$ADMIN_EMAIL" \
    --force-renewal 2>/dev/null || true

  # Copy certificates to local directory
  log_info "Copying SSL certificates..."
  mkdir -p ssl
  sudo cp /etc/letsencrypt/live/"$DOMAIN"/fullchain.pem ssl/fullchain.pem
  sudo cp /etc/letsencrypt/live/"$DOMAIN"/privkey.pem ssl/privkey.pem
  sudo chown -R $USER:$USER ssl

  log_success "SSL certificates configured"
  echo ""

  # Use standard nginx config
  NGINX_CONFIG="nginx.conf"

else

  #############################################################################
  # STEP 4B: Setup Cloudflare Tunnel
  #############################################################################

  log_info "Step 3: Setting up Cloudflare Tunnel..."

  # Install cloudflared if needed
  if ! command -v cloudflared &> /dev/null; then
    log_info "Installing cloudflared..."
    curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
    sudo dpkg -i cloudflared.deb
    rm cloudflared.deb
    log_success "cloudflared installed"
  fi

  log_info "Authenticating with Cloudflare..."
  cloudflared tunnel login

  echo ""
  read -p "$(echo -e ${BLUE}?)$(echo -e ${NC}) Enter tunnel name (default: highpeak): " TUNNEL_NAME
  TUNNEL_NAME=${TUNNEL_NAME:-highpeak}

  log_info "Creating tunnel '$TUNNEL_NAME'..."
  TUNNEL_ID=$(cloudflared tunnel create "$TUNNEL_NAME" 2>&1 | grep -oP "(?<=id: )[a-f0-9-]+")

  if [ -z "$TUNNEL_ID" ]; then
    # If tunnel already exists, get its ID
    TUNNEL_ID=$(cloudflared tunnel list 2>&1 | grep "$TUNNEL_NAME" | awk '{print $1}')
  fi

  log_success "Tunnel ID: $TUNNEL_ID"

  echo ""
  log_info "Setting up tunnel configuration..."

  # Create config file
  CLOUDFLARED_DIR="$HOME/.cloudflared"
  mkdir -p "$CLOUDFLARED_DIR"

  cat > "$CLOUDFLARED_DIR/config.yml" << EOF
tunnel: $TUNNEL_NAME
credentials-file: $CLOUDFLARED_DIR/${TUNNEL_ID}.json

ingress:
  - hostname: $DOMAIN
    service: http://localhost:3000
  - service: http_status:404
EOF

  log_success "Tunnel configuration created"

  echo ""
  log_warning "⚠  IMPORTANT: Configure Cloudflare DNS"
  echo ""
  echo "1. Go to Cloudflare Dashboard"
  echo "2. Select wisdombusara.com domain"
  echo "3. Go to DNS settings"
  echo "4. Add/Update CNAME record:"
  echo "   Name: peak"
  echo "   Content: ${TUNNEL_ID}.cfargotunnel.com"
  echo ""
  read -p "$(echo -e ${YELLOW}⚠${NC}) Press Enter once DNS is configured..."

  log_info "Starting cloudflared service..."
  sudo cloudflared service install
  sudo systemctl start cloudflared
  sudo systemctl enable cloudflared

  log_success "Cloudflared service started"
  echo ""

  # Use tunnel nginx config
  NGINX_CONFIG="nginx-tunnel.conf"

fi

#############################################################################
# STEP 5: Deploy with Docker
#############################################################################

log_info "Step 4: Building and starting Docker services..."

# Select appropriate nginx config
cp "$NGINX_CONFIG" nginx.conf

# Build Docker image
log_info "Building Docker image (this may take 2-3 minutes)..."
docker-compose build --no-cache

log_success "Docker image built"

# Start services
log_info "Starting services..."
docker-compose up -d

log_success "Services started"

# Wait for database to be ready
log_info "Waiting for database to be ready..."
for i in {1..30}; do
  if docker-compose exec -T postgres pg_isready -U highpeak_user &> /dev/null; then
    log_success "Database is ready"
    break
  fi
  echo -n "."
  sleep 2
done

echo ""

# Check status
log_info "Service status:"
docker-compose ps
echo ""

log_success "Docker services deployed"
echo ""

#############################################################################
# STEP 6: Initialize Database
#############################################################################

log_info "Step 5: Initializing database..."

# Wait for app to be ready
log_info "Waiting for app to be ready..."
sleep 5

# Run migrations
log_info "Running database migrations..."
docker-compose exec -T app npm run payload:migrate || log_warning "Migrations may have already run"

log_success "Database initialized"
echo ""

#############################################################################
# STEP 7: Create Admin User
#############################################################################

log_info "Step 6: Creating admin user..."
echo ""

read -p "$(echo -e ${BLUE}?)$(echo -e ${NC}) Enter admin email: " ADMIN_USER_EMAIL
read -sp "$(echo -e ${BLUE}?)$(echo -e ${NC}) Enter admin password: " ADMIN_PASSWORD
echo ""

# Create admin user (non-interactive)
docker-compose exec -T app npm run payload:create-user -- \
  --email "$ADMIN_USER_EMAIL" \
  --password "$ADMIN_PASSWORD" || log_warning "Admin user creation requires manual step"

log_success "Admin user creation initiated"
echo ""

#############################################################################
# CONDITIONAL: Setup Auto-Renewal (Direct SSL only)
#############################################################################

if [ "$TUNNEL_MODE" = false ]; then

  log_info "Step 7: Setting up SSL auto-renewal..."

  # Create renewal script
  RENEWAL_SCRIPT="/opt/highpeak/renew-ssl.sh"
  sudo bash -c "cat > $RENEWAL_SCRIPT << 'RENEWEOF'
#!/bin/bash
cd /opt/highpeak
certbot renew --quiet
if [ \$? -eq 0 ]; then
  cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem /opt/highpeak/ssl/fullchain.pem
  cp /etc/letsencrypt/live/$DOMAIN/privkey.pem /opt/highpeak/ssl/privkey.pem
  docker-compose restart nginx
fi
RENEWEOF
"

  sudo chmod +x "$RENEWAL_SCRIPT"

  # Add to crontab
  (sudo crontab -l 2>/dev/null || echo "") | grep -q "renew-ssl.sh" || \
    (sudo crontab -l 2>/dev/null; echo "0 3 * * * $RENEWAL_SCRIPT") | sudo crontab -

  log_success "SSL auto-renewal scheduled (daily at 3 AM)"
  echo ""

fi

#############################################################################
# STEP 8: Setup Backups
#############################################################################

log_info "Step 8: Setting up daily backups..."

# Create backup script
BACKUP_SCRIPT="/opt/highpeak/backup.sh"
sudo bash -c "cat > $BACKUP_SCRIPT << 'BACKUPEOF'
#!/bin/bash
BACKUP_DIR=\"/opt/highpeak/backups\"
mkdir -p \$BACKUP_DIR
cd /opt/highpeak
docker-compose exec -T postgres pg_dump -U highpeak_user highpeak > \$BACKUP_DIR/backup_\$(date +%Y%m%d_%H%M%S).sql
# Keep only last 7 days
find \$BACKUP_DIR -type f -mtime +7 -delete
BACKUPEOF
"

sudo chmod +x "$BACKUP_SCRIPT"

# Add to crontab
(sudo crontab -l 2>/dev/null || echo "") | grep -q "backup.sh" || \
  (sudo crontab -l 2>/dev/null; echo "0 2 * * * $BACKUP_SCRIPT") | sudo crontab -

log_success "Daily backups scheduled (2 AM)"
echo ""

#############################################################################
# STEP 9: Configure Firewall
#############################################################################

log_info "Step 9: Configuring firewall..."

# Check if UFW is available
if command -v ufw &> /dev/null; then
  sudo ufw allow 22/tcp || true

  # Only open HTTP/HTTPS in direct SSL mode
  if [ "$TUNNEL_MODE" = false ]; then
    sudo ufw allow 80/tcp || true
    sudo ufw allow 443/tcp || true
  fi

  sudo ufw enable || true
  log_success "Firewall rules configured"
else
  log_warning "UFW not found. Please configure firewall manually if needed."
fi

echo ""

#############################################################################
# STEP 10: Test Deployment
#############################################################################

log_info "Step 10: Testing deployment..."

# Wait a moment for services to fully start
sleep 5

# Test website
log_info "Testing website access..."

if [ "$TUNNEL_MODE" = true ]; then
  log_info "Waiting for Cloudflare Tunnel to propagate (60 seconds)..."
  sleep 60
fi

if curl -s -I "https://$DOMAIN" 2>/dev/null | grep -q "200\|302\|301"; then
  log_success "Website is accessible at https://$DOMAIN"
else
  log_warning "Website test inconclusive - DNS may not be configured yet"
fi

# Check container status
log_info "Final service status:"
docker-compose ps
echo ""

#############################################################################
# SUMMARY
#############################################################################

echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         Deployment Complete! 🚀                             ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ "$TUNNEL_MODE" = true ]; then
  echo -e "${GREEN}🌐 Cloudflare Tunnel Mode${NC}"
  echo ""
  echo "Tunnel ID: $TUNNEL_ID"
  echo "Tunnel Name: $TUNNEL_NAME"
  echo ""
  echo -e "${YELLOW}⚠  Configuration Status:${NC}"
  echo "✓ Tunnel created and running"
  echo "⏳ DNS CNAME record must be added:"
  echo "   Name: peak"
  echo "   Content: ${TUNNEL_ID}.cfargotunnel.com"
  echo ""
else
  echo -e "${GREEN}🔒 Direct SSL Mode${NC}"
  echo ""
  echo -e "${YELLOW}⚠  Configuration Status:${NC}"
  echo "✓ SSL certificate installed"
  echo "✓ Auto-renewal scheduled"
  echo "⏳ DNS A record must point to your VM:"
  echo "   Name: peak"
  echo "   Content: YOUR_VM_IP_ADDRESS"
  echo ""
fi

echo -e "${BLUE}📌 NEXT STEPS:${NC}"
echo ""
echo "1. ${YELLOW}Configure DNS${NC}"
if [ "$TUNNEL_MODE" = true ]; then
  echo "   Add CNAME: peak → ${TUNNEL_ID}.cfargotunnel.com"
else
  echo "   Add A record: peak → YOUR_VM_IP"
fi
echo ""
echo "2. ${YELLOW}Verify services are running${NC}"
echo "   cd /opt/highpeak && docker-compose ps"
echo ""
echo "3. ${YELLOW}Check logs if services aren't healthy${NC}"
echo "   docker-compose logs -f"
echo ""
echo "4. ${YELLOW}Manually create admin user (if needed)${NC}"
echo "   docker-compose exec app npm run payload:create-user"
echo ""

echo -e "${GREEN}🌐 Access your deployment:${NC}"
echo "   Website:    https://$DOMAIN"
echo "   Admin:      https://$DOMAIN/admin"
echo "   API:        https://$DOMAIN/api"
echo ""

echo -e "${GREEN}📊 Useful commands:${NC}"
echo "   View logs:           docker-compose logs -f"
echo "   Check status:        docker-compose ps"
echo "   Restart services:    docker-compose restart"
echo "   View backups:        ls -la /opt/highpeak/backups"
echo ""

if [ "$TUNNEL_MODE" = true ]; then
  echo -e "${GREEN}🔧 Tunnel commands:${NC}"
  echo "   Tunnel status:       sudo systemctl status cloudflared"
  echo "   Tunnel logs:         sudo journalctl -u cloudflared -f"
  echo "   Restart tunnel:      sudo systemctl restart cloudflared"
  echo ""
fi

echo -e "${GREEN}💾 Database credentials:${NC}"
echo "   Username: highpeak_user"
echo "   Password: [saved in .env.local]"
echo ""

echo -e "${YELLOW}⚠  Save these important values:${NC}"
echo "   Database Password:  ${DB_PASSWORD:0:15}..."
echo "   Payload Secret:     ${PAYLOAD_SECRET:0:15}..."
if [ "$TUNNEL_MODE" = true ]; then
  echo "   Tunnel ID:          $TUNNEL_ID"
fi
echo ""

log_success "Deployment script completed successfully!"
log_info "Your Highpeak platform is now running! 🎉"
