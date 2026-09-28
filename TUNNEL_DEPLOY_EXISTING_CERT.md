# Cloudflare Tunnel Deployment (With Existing Certificate)

Fast deployment using your existing Cloudflare certificate at `/root/.cloudflared/cert.pem`.

## Quick Start (4 Steps)

You're at `/opt/highpeak` with cloudflared already installed. Your certificate exists, so skip login.

### Step 1: Create Tunnel

```bash
# You're already in /opt/highpeak
# Create tunnel
cloudflared tunnel create highpeak

# Output shows:
# Created tunnel highpeak with id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
# Credentials file saved to: /root/.cloudflared/a1b2c3d4-e5f6-7890-abcd-ef1234567890.json

# SAVE the tunnel ID
```

### Step 2: Configure Tunnel

```bash
# Create config file
cat > ~/.cloudflared/config.yml << 'EOF'
tunnel: highpeak
credentials-file: /root/.cloudflared/a1b2c3d4-e5f6-7890-abcd-ef1234567890.json

ingress:
  - hostname: peak.wisdombusara.com
    service: http://localhost:3000
  - service: http_status:404
EOF
```

Replace `a1b2c3d4-e5f6-7890-abcd-ef1234567890` with your tunnel ID from Step 1.

### Step 3: Start Tunnel Service

```bash
# Install and start as service (auto-restarts on reboot)
sudo cloudflared service install
sudo systemctl start cloudflared

# Check it's running
sudo systemctl status cloudflared

# Expected: Active (running)
```

### Step 4: Configure Cloudflare DNS

**Cloudflare Dashboard → wisdombusara.com → DNS → Add Record**

| Field | Value |
|---|---|
| Type | CNAME |
| Name | peak |
| Target | `a1b2c3d4-e5f6-7890-abcd-ef1234567890.cfargotunnel.com` |
| Proxied | ✅ ON |
| TTL | Auto |

(Use your actual tunnel ID)

Verify:
```bash
dig +short peak.wisdombusara.com
# Should return your tunnel ID + .cfargotunnel.com
```

---

## Deploy App (Parallel)

While DNS propagates, deploy your Docker app:

```bash
cd /opt/highpeak

# Configure environment
cp .env.production .env.local

# Edit with secrets (database password, Payload secret)
nano .env.local

# Build and start
docker-compose build --no-cache
docker-compose up -d

# Wait for startup
sleep 10

# Check services
docker-compose ps

# Initialize database (first time only)
docker-compose exec -T app npm run payload:migrate
docker-compose exec -T app npm run payload:create-user
```

---

## Verify

```bash
# 1. Tunnel running
sudo systemctl status cloudflared

# 2. DNS working
dig +short peak.wisdombusara.com

# 3. Services up
docker-compose ps

# 4. Test access
curl -I https://peak.wisdombusara.com

# Expected: HTTP/2 200
```

---

## Done! 🎉

Your platform is live at **https://peak.wisdombusara.com**

### Access Points

- **Website:** https://peak.wisdombusara.com
- **Admin Panel:** https://peak.wisdombusara.com/admin
- **API:** https://peak.wisdombusara.com/api

### Monitoring

```bash
# Check tunnel
sudo systemctl status cloudflared

# View tunnel logs
sudo journalctl -u cloudflared -f

# View app logs
cd /opt/highpeak && docker-compose logs -f
```

### Common Commands

```bash
# Restart tunnel
sudo systemctl restart cloudflared

# Restart app
docker-compose restart app

# Check backups
ls /opt/highpeak/backups/

# Stop everything
docker-compose down

# Start everything
docker-compose up -d
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Tunnel inactive | `sudo systemctl start cloudflared` |
| DNS not resolving | Wait 60 sec, check CNAME in Cloudflare dashboard |
| 502 error | `docker-compose ps` and restart: `docker-compose up -d` |
| App crash | `docker-compose logs app` |

---

## Next Steps

1. ✅ Tunnel created and running
2. ✅ DNS configured
3. ✅ App deployed
4. → Monitor: `sudo journalctl -u cloudflared -f`
5. → Optional: Add rate limiting in Cloudflare dashboard

**Total deployment time: ~10 minutes**

For detailed info: See `CLOUDFLARE_TUNNEL_SETUP.md`
