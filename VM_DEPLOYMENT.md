# VM Deployment Guide - peak.wisdombusara.com

Complete guide to deploy Highpeak platform to your VM.

## Prerequisites

- Ubuntu 20.04+ or similar Linux
- Docker and Docker Compose installed
- Domain: peak.wisdombusara.com
- SSH access to VM
- 2GB+ RAM, 20GB+ storage

## Step 1: Prepare VM

### 1.1 Update System
```bash
sudo apt update
sudo apt upgrade -y
```

### 1.2 Install Docker
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install -y docker-compose

# Add current user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### 1.3 Install Certbot (SSL)
```bash
sudo apt install -y certbot python3-certbot-nginx
```

## Step 2: Clone and Setup Repository

```bash
# Create app directory
mkdir -p /opt/highpeak
cd /opt/highpeak

# Clone repository
git clone https://github.com/WisdomBusara/High-Peak-Studio.git .

# Create .env.local from .env.production
cp .env.production .env.local

# Edit environment variables
nano .env.local
```

**Critical settings to update in `.env.local`:**
```
DATABASE_URL=postgres://highpeak_user:YOUR_SECURE_PASSWORD@localhost:5432/highpeak
PAYLOAD_SECRET=YOUR_VERY_SECURE_SECRET_KEY_MIN_32_CHARS
```

Generate secure secrets:
```bash
# Generate random secret
openssl rand -base64 32

# Use for both DATABASE_URL password and PAYLOAD_SECRET
```

## Step 3: Setup SSL Certificate

### 3.1 Initial Certificate
```bash
sudo certbot certonly --standalone \
  -d peak.wisdombusara.com \
  --agree-tos \
  --no-eff-email \
  -m your-email@example.com
```

### 3.2 Create SSL Directory
```bash
mkdir -p /opt/highpeak/ssl
sudo cp /etc/letsencrypt/live/peak.wisdombusara.com/fullchain.pem /opt/highpeak/ssl/
sudo cp /etc/letsencrypt/live/peak.wisdombusara.com/privkey.pem /opt/highpeak/ssl/
sudo chown -R $USER:$USER /opt/highpeak/ssl
```

### 3.3 Setup Auto-Renewal
```bash
# Edit crontab
sudo crontab -e

# Add this line (runs daily)
0 3 * * * certbot renew --quiet --post-hook "cd /opt/highpeak && docker-compose restart nginx"
```

## Step 4: Start Services

### 4.1 Build and Start
```bash
cd /opt/highpeak

# Build Docker image
docker-compose build

# Start services
docker-compose up -d

# Check status
docker-compose ps
```

### 4.2 Verify Services
```bash
# Check app is running
docker-compose logs -f app

# Check database is healthy
docker-compose logs -f postgres

# Check nginx
docker-compose logs -f nginx
```

### 4.3 Initialize Database

First time only - run migrations:
```bash
# Access app container
docker-compose exec app npm run payload:migrate

# Create admin user
docker-compose exec app npm run payload:create-user
```

## Step 5: Configure Domain DNS

Update DNS records for peak.wisdombusara.com:

```
A record:
  Name: peak
  Value: YOUR_VM_IP_ADDRESS
  TTL: 3600
```

Verify DNS:
```bash
nslookup peak.wisdombusara.com
```

## Step 6: Verify Deployment

### 6.1 Test Website
```bash
curl -I https://peak.wisdombusara.com
```

Expected response:
```
HTTP/2 200
Server: nginx/alpine
```

### 6.2 Access Services
- **Website**: https://peak.wisdombusara.com
- **Admin Panel**: https://peak.wisdombusara.com/admin
- **API**: https://peak.wisdombusara.com/api

### 6.3 Check Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres
docker-compose logs -f nginx
```

## Step 7: Backup Strategy

### 7.1 Daily Database Backups
```bash
# Create backup script
cat > /opt/highpeak/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/highpeak/backups"
mkdir -p $BACKUP_DIR
docker-compose exec -T postgres pg_dump -U highpeak_user highpeak > $BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql
# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete
EOF

chmod +x /opt/highpeak/backup.sh
```

### 7.2 Schedule Backups
```bash
sudo crontab -e

# Add daily backup at 2 AM
0 2 * * * cd /opt/highpeak && ./backup.sh
```

### 7.3 Restore from Backup
```bash
docker-compose exec -T postgres psql -U highpeak_user highpeak < /opt/highpeak/backups/backup_YYYYMMDD_HHMMSS.sql
```

## Step 8: Monitoring & Maintenance

### 8.1 Check System Health
```bash
# Disk space
df -h

# Memory usage
free -h

# Container status
docker-compose ps

# Docker disk usage
docker system df
```

### 8.2 View Logs
```bash
# Real-time logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific service
docker-compose logs app
```

### 8.3 Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart app
docker-compose restart nginx
docker-compose restart postgres
```

## Step 9: Updates & Deployment

### 9.1 Pull Latest Code
```bash
cd /opt/highpeak
git pull origin master
```

### 9.2 Rebuild and Restart
```bash
docker-compose build --no-cache
docker-compose up -d
docker-compose logs -f app
```

### 9.3 Run Migrations (if needed)
```bash
docker-compose exec app npm run payload:migrate
```

## Troubleshooting

### App won't start
```bash
# Check logs
docker-compose logs app

# Common issues:
# - DATABASE_URL incorrect
# - PAYLOAD_SECRET too short
# - Port 3000 already in use
```

### Database connection failed
```bash
# Check postgres is running
docker-compose logs postgres

# Verify DATABASE_URL format
# postgres://user:password@postgres:5432/dbname
```

### SSL certificate errors
```bash
# Check certificate exists
ls -la /opt/highpeak/ssl/

# Renew manually
sudo certbot renew --force-renewal

# Copy new certs
sudo cp /etc/letsencrypt/live/peak.wisdombusara.com/* /opt/highpeak/ssl/
sudo chown -R $USER:$USER /opt/highpeak/ssl
docker-compose restart nginx
```

### High memory usage
```bash
# Check docker stats
docker stats

# Limit memory in docker-compose.yml:
# services:
#   app:
#     mem_limit: 1g
#   postgres:
#     mem_limit: 1g
```

## Production Checklist

- [ ] Domain DNS configured
- [ ] SSL certificate installed
- [ ] Environment variables set
- [ ] Database initialized
- [ ] Admin user created
- [ ] Website accessible at peak.wisdombusara.com
- [ ] Admin panel works
- [ ] API endpoints responding
- [ ] Backups scheduled
- [ ] Monitoring setup
- [ ] SSL auto-renewal configured
- [ ] Firewall rules configured

## Security Hardening

### Firewall Rules (UFW)
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Database Security
```bash
# Change default password in docker-compose.yml
# Use strong password (32+ chars)
```

### Update docker-compose.yml
```yaml
environment:
  POSTGRES_PASSWORD: YOUR_VERY_SECURE_PASSWORD_HERE
  PAYLOAD_SECRET: YOUR_VERY_SECURE_SECRET_KEY_HERE
```

### Restrict Admin Access
Consider adding IP whitelist or basic auth to /admin routes

## Next Steps

1. ✅ Deploy to VM
2. → Add OpenAI LLM (1-2 hours)
3. → Configure backups
4. → Setup monitoring
5. → Add admin dashboard pages

## Support & Logs

For debugging, always check:
```bash
# Application logs
docker-compose logs app

# Database logs
docker-compose logs postgres

# Web server logs
docker-compose logs nginx

# System logs
journalctl -xe
```

## Disaster Recovery

If services crash:
```bash
# Full restart
docker-compose down
docker-compose up -d

# If database corrupted:
# Restore from backup
docker-compose down
docker-compose up -d
docker-compose exec -T postgres psql -U highpeak_user highpeak < backups/backup_XXXXX.sql
```
