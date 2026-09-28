# Cloudflare Tunnel Quick Start (10 Minutes)

Fast deployment to peak.wisdombusara.com using Cloudflare Tunnel.

## Prerequisites

✅ Cloudflare account with wisdombusara.com  
✅ VPS with SSH access  
✅ Docker + docker-compose installed  
✅ Repository cloned to /opt/highpeak

## 5-Minute Setup

### 1. Install & Authenticate (2 min)

```bash
ssh root@YOUR_VPS_IP

# Install cloudflared
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb && rm cloudflared.deb

# Login to Cloudflare (opens browser)
cloudflared tunnel login
```

### 2. Create Tunnel (1 min)

```bash
# Create tunnel
cloudflared tunnel create highpeak

# Copy the tunnel ID from output
# Example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

### 3. Configure & Run Tunnel (1 min)

```bash
# Create config
cat > ~/.cloudflared/config.yml << 'EOF'
tunnel: highpeak
credentials-file: /home/root/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: peak.wisdombusara.com
    service: http://localhost:3000
  - service: http_status:404
EOF

# Replace YOUR_TUNNEL_ID with the ID from step 2

# Install as service
sudo cloudflared service install
sudo systemctl start cloudflared

# Check it's running
sudo systemctl status cloudflared
```

### 4. Add DNS Record (1 min)

In Cloudflare Dashboard:
- Go to **wisdombusara.com** → **DNS**
- Click **Add Record**
- Type: `CNAME`
- Name: `peak`
- Target: `YOUR_TUNNEL_ID.cfargotunnel.com`
- Proxied: ✅ ON
- Save

### 5. Deploy App (Parallel with DNS)

While DNS propagates, deploy your app:

```bash
cd /opt/highpeak

# Configure environment
cp .env.production .env.local

# Edit with your secrets
nano .env.local
# Set: DATABASE_URL password, PAYLOAD_SECRET

# Deploy
docker-compose build --no-cache
docker-compose up -d

# Initialize (first time only)
docker-compose exec -T app npm run payload:migrate
docker-compose exec -T app npm run payload:create-user
```

## Verify (1 min)

```bash
# Wait 30-60 seconds for DNS propagation, then:

# 1. Check tunnel status
sudo systemctl status cloudflared

# 2. Check services running
docker-compose ps

# 3. Test website
curl -I https://peak.wisdombusara.com

# 4. Open in browser
# https://peak.wisdombusara.com
```

## Done! 🎉

Your platform is live at **https://peak.wisdombusara.com**

- **Website:** https://peak.wisdombusara.com
- **Admin:** https://peak.wisdombusara.com/admin
- **API:** https://peak.wisdombusara.com/api

## Useful Commands

```bash
# Check tunnel status
sudo systemctl status cloudflared

# View tunnel logs
sudo journalctl -u cloudflared -f

# Check services
docker-compose ps

# View app logs
docker-compose logs -f app

# Restart app
docker-compose restart app

# View backups
ls /opt/highpeak/backups/
```

## Troubleshooting

| Issue | Fix |
|---|---|
| NXDOMAIN | Wait 60 seconds for DNS, check CNAME record in Cloudflare |
| 502 error | Check docker-compose ps, restart with up -d |
| Connection refused | Check tunnel: sudo systemctl restart cloudflared |
| Slow response | Check docker-compose logs app |

## Next Steps

1. ✅ Tunnel set up
2. ✅ App deployed
3. → Monitor with docker-compose logs -f
4. → Add rate limiting in Cloudflare Dashboard (optional)
5. → Integrate LLM (optional)

## Complete Reference

For detailed setup: See `CLOUDFLARE_TUNNEL_SETUP.md`

---

**Total time to live: ~15 minutes** ✅
