# Cloudflare Tunnel Setup for peak.wisdombusara.com

Create a secure tunnel from your VPS to Cloudflare's edge without exposing ports or managing origin certificates.

## What is Cloudflare Tunnel?

Cloudflare Tunnel (formerly Argo Tunnel) creates an **outbound-only** connection from your VPS to Cloudflare's edge. Traffic flows:

```
Browser → Cloudflare Edge → Secure Tunnel → Your VPS (nginx) → Docker App
```

**Benefits:**
- ✅ No ports 80/443 exposed on VPS
- ✅ No SSL certificate management at origin
- ✅ Works behind firewalls/NAT
- ✅ DDoS protection at edge
- ✅ Simple DNS setup (one CNAME record)
- ✅ Free tier available
- ✅ Works on shared infrastructure

**Comparison:**

| Aspect | Tunnel | Direct SSL | Direct + Tunnel |
|---|---|---|---|
| Port exposure | ❌ None | ✅ 80/443 | ✅ 80/443 |
| SSL at origin | ❌ No | ✅ Yes | ✅ Yes |
| Works behind NAT | ✅ Yes | ❌ No | ✅ Yes |
| Certificate renewal | ❌ N/A | ⚠️ 90 days | ❌ N/A |
| Setup complexity | ⭐ Simplest | ⭐⭐ Medium | ⭐⭐⭐ Complex |
| Cost | Free | Free | Free |
| Recommended | ✅ **For VPS** | ⚠️ Dedicated servers | ❌ Redundant |

---

## Prerequisites

- Cloudflare account with `wisdombusara.com` zone
- VPS with SSH access
- Docker and docker-compose installed
- Repository at `/opt/highpeak`
- 10 minutes setup time

---

## Step 1: Install Cloudflared on VPS

SSH into your VPS:

```bash
# Download cloudflared
curl -L --output cloudflared.deb \
  https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb

# Install
sudo dpkg -i cloudflared.deb
rm cloudflared.deb

# Verify installation
cloudflared --version
```

---

## Step 2: Authenticate Cloudflared

This creates a certificate that allows your VPS to create tunnels:

```bash
# Login to Cloudflare (opens browser)
cloudflared tunnel login

# You'll see:
# A browser window opens asking to authorize
# After confirming, a certificate is saved to ~/.cloudflared/cert.pem
```

This certificate is valid for years and only needs to be done once.

---

## Step 3: Create Tunnel

Create a named tunnel for your Highpeak platform:

```bash
# Create tunnel
cloudflared tunnel create highpeak

# Output shows:
# Created tunnel highpeak with id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
# Credentials file saved to: /home/USER/.cloudflared/a1b2c3d4-e5f6-7890-abcd-ef1234567890.json

# Save the tunnel ID - you'll need it for DNS
TUNNEL_ID="a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

---

## Step 4: Create Tunnel Configuration

Create `~/.cloudflared/config.yml`:

```bash
cat > ~/.cloudflared/config.yml << 'EOF'
tunnel: highpeak
credentials-file: /home/YOUR_USERNAME/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: peak.wisdombusara.com
    service: http://localhost:3000
  - service: http_status:404
EOF
```

**Replace:**
- `YOUR_USERNAME` - Your VPS user (e.g., `root`)
- `YOUR_TUNNEL_ID` - The tunnel ID from step 3

**Explanation:**
- `tunnel: highpeak` - Use the tunnel named "highpeak"
- `hostname: peak.wisdombusara.com` - Route this domain through tunnel
- `service: http://localhost:3000` - Forward to your app on port 3000
- `http_status:404` - Return 404 for any other hostnames

---

## Step 5: Test Tunnel Locally

Run tunnel in foreground to verify it works:

```bash
# Run tunnel (shows logs)
cloudflared tunnel run highpeak

# Expected output:
# INFO  |  Established named tunnel connection to edge
# INFO  |  Route assigned https://peak.wisdombusara.com
# INFO  |  Tunnel running at id=a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

The tunnel is now active. Leave it running and test in another terminal:

```bash
# In another SSH session or locally:
curl -I https://peak.wisdombusara.com
# Expected: 200 OK or 301 redirect

# Or open browser to: https://peak.wisdombusara.com
```

If it works, press `Ctrl+C` to stop the tunnel. We'll run it as a service next.

---

## Step 6: Install as Systemd Service

Run tunnel automatically on VPS startup:

```bash
# Install as service
sudo cloudflared service install

# Start service
sudo systemctl start cloudflared

# Enable auto-start
sudo systemctl enable cloudflared

# Check status
sudo systemctl status cloudflared
```

You should see:
```
● cloudflared.service - Cloudflare Tunnel
   Active: active (running)
   CGroup: /system.slice/cloudflared.service
           └─123 /usr/bin/cloudflared tunnel run highpeak
```

The tunnel now runs automatically, even after VPS reboot.

---

## Step 7: Configure Cloudflare DNS

Add DNS record in Cloudflare Dashboard:

**Cloudflare Dashboard → wisdombusara.com → DNS → Add Record**

| Field | Value |
|---|---|
| Type | CNAME |
| Name | `peak` |
| Target | `YOUR_TUNNEL_ID.cfargotunnel.com` |
| Proxy status | Proxied (orange cloud) |
| TTL | Auto |

Example:
```
Name: peak
Target: a1b2c3d4-e5f6-7890-abcd-ef1234567890.cfargotunnel.com
```

Verify DNS resolves:

```bash
dig +short peak.wisdombusara.com
# Expected: a1b2c3d4-e5f6-7890-abcd-ef1234567890.cfargotunnel.com
```

---

## Step 8: Deploy Application

Now deploy your Docker application:

```bash
cd /opt/highpeak

# Copy and configure environment
cp .env.production .env.local
nano .env.local

# Set:
# DATABASE_URL=postgres://highpeak_user:PASSWORD@postgres:5432/highpeak
# PAYLOAD_SECRET=VERY_SECURE_SECRET
# NEXT_PUBLIC_SITE_URL=https://peak.wisdombusara.com

# Build and start
docker-compose build --no-cache
docker-compose up -d

# Wait for services
sleep 10

# Check status
docker-compose ps

# Initialize database (first time only)
docker-compose exec -T app npm run payload:migrate
docker-compose exec -T app npm run payload:create-user
```

Since the tunnel is already routing traffic to `localhost:3000`, your app is now live!

---

## Step 9: Verify Everything

Run these checks:

```bash
# 1. Tunnel is running
sudo systemctl status cloudflared
# Expected: Active (running)

# 2. DNS resolves correctly
dig +short peak.wisdombusara.com
# Expected: tunnel ID + .cfargotunnel.com

# 3. Services are up
docker-compose ps
# Expected: postgres, app, nginx all "Up"

# 4. App responds
curl -s https://peak.wisdombusara.com/ | head -20
# Expected: HTML content from your app

# 5. Admin panel works
curl -I https://peak.wisdombusara.com/admin
# Expected: 200 or 301

# 6. API responds
curl -s https://peak.wisdombusara.com/api/health
# Expected: JSON response
```

All checks passing? You're live! 🎉

---

## Complete Setup Summary

After these 9 steps, you have:

✅ **At Cloudflare edge:**
- Domain `peak.wisdombusara.com` proxied through tunnel
- TLS/HTTPS handled automatically
- DDoS protection active

✅ **On your VPS:**
- Cloudflared tunnel service running
- Docker containers for app/database
- No ports exposed publicly
- No SSL certificates to manage

✅ **Access:**
- https://peak.wisdombusara.com → Your app
- https://peak.wisdombusara.com/admin → Admin panel
- https://peak.wisdombusara.com/api → API endpoints

---

## Management Commands

```bash
# Check tunnel status
sudo systemctl status cloudflared

# View tunnel logs
sudo journalctl -u cloudflared -f

# View last 50 lines of logs
sudo journalctl -u cloudflared -n 50

# Restart tunnel (if needed)
sudo systemctl restart cloudflared

# Stop tunnel
sudo systemctl stop cloudflared

# Start tunnel
sudo systemctl start cloudflared

# Check tunnel configuration
cloudflared tunnel list

# View ingress rules
cloudflared tunnel ingress validate
```

---

## Cloudflare Dashboard Features

Now that your tunnel is active, you can use Cloudflare features:

**Analytics**
- Dashboard → Analytics & Logs
- View traffic, errors, performance for `peak.wisdombusara.com`

**Caching**
- Dashboard → Caching → Cache Rules
- Cache static assets for better performance

**Security**
- Dashboard → Security → WAF Rules
- Add rate limiting, bot protection, etc.

**Performance**
- Dashboard → Speed → Optimization
- Enable Brotli, minification, etc.

---

## Troubleshooting

### Tunnel won't start

```bash
# Check if credentials exist
ls ~/.cloudflared/cert.pem

# If missing, re-authenticate
cloudflared tunnel login

# Check config file syntax
cloudflared tunnel ingress validate
```

### DNS not resolving

```bash
# Verify CNAME record in Cloudflare Dashboard
# Should point to: YOUR_TUNNEL_ID.cfargotunnel.com

# Flush local DNS cache
# macOS: sudo dscacheutil -flushcache
# Linux: sudo systemctl restart systemd-resolved
# Windows: ipconfig /flushdns

# Check again
dig +short peak.wisdombusara.com
```

### Getting 502 Bad Gateway

```bash
# 1. Check tunnel is running
sudo systemctl status cloudflared

# 2. Check app is running
docker-compose ps

# 3. Check app is listening on port 3000
curl http://localhost:3000

# 4. Check tunnel config
cat ~/.cloudflared/config.yml

# 5. View tunnel logs
sudo journalctl -u cloudflared -f
```

### Getting 404 errors

```bash
# Check ingress rules
cloudflared tunnel ingress validate

# Verify app is handling the route
docker-compose logs app | grep "peak.wisdombusara.com"
```

### Tunnel keeps disconnecting

```bash
# Check VPS network connectivity
ping 1.1.1.1

# Restart tunnel service
sudo systemctl restart cloudflared

# Check system logs
sudo journalctl -xe | tail -50
```

---

## Security Notes

✅ **What's secure:**
- Tunnel traffic encrypted end-to-end
- Cloudflare edge provides TLS/HTTPS
- DDoS protection included
- No origin certificate needed
- Private outbound connection (no open ports)

⚠️ **Keep safe:**
- Don't commit `.cloudflared/` directory to git
- Protect `~/.cloudflared/` directory permissions
- Keep `cert.pem` and credentials files safe
- Use strong database passwords in `.env.local`

---

## Performance

Tunnel performance is excellent:

- **Latency:** Typically 10-50ms added latency (depending on geography)
- **Bandwidth:** No limits on free tier
- **Reliability:** 99.99% uptime SLA

For Highpeak's use case (corporate website + chatbot + CMS), tunnel adds negligible latency while providing maximum simplicity and security.

---

## Scaling (If Needed)

For high traffic, you can:

1. **Add redundancy:**
   ```bash
   # Run tunnel on multiple servers
   # All pointing to same tunnel ID
   cloudflared tunnel run highpeak
   ```

2. **Load balance:**
   ```bash
   # Cloudflare automatically load-balances
   # between multiple tunnel instances
   ```

3. **Monitor performance:**
   ```bash
   # Cloudflare Analytics show traffic patterns
   # Scale based on data
   ```

---

## Maintenance

### Monthly

```bash
# Check tunnel is still running
sudo systemctl status cloudflared

# Review Cloudflare Analytics
# (Dashboard → Analytics & Logs)

# Check for updates
cloudflared update
```

### After app updates

```bash
# Just rebuild and restart Docker
docker-compose build --no-cache
docker-compose up -d

# Tunnel automatically routes to updated app
# No tunnel restart needed
```

### Purge cache after deploy

```bash
# In Cloudflare Dashboard:
# Caching → Configuration → Purge Everything
# Or specific URLs if needed
```

---

## Comparison: Tunnel vs Direct SSL

| Feature | Tunnel | Direct SSL |
|---|---|---|
| Setup | 9 steps, ~10 min | 8 steps, ~15 min |
| Port exposure | No | Yes (80/443) |
| Certificate | N/A | Cloudflare Origin Cert |
| Complexity | Simple | Medium |
| Maintenance | None | 15-year cert |
| Works behind NAT | Yes | No |
| Bandwidth | Free | Free |
| Recommended | **✅ Yes** | ⚠️ If ports available |

**For your VPS setup, Tunnel is strongly recommended.**

---

## Next Steps

1. ✅ Install cloudflared
2. ✅ Authenticate with Cloudflare
3. ✅ Create tunnel
4. ✅ Test locally
5. ✅ Install as service
6. ✅ Add DNS record
7. ✅ Deploy app
8. ✅ Verify with checklist
9. → Monitor and maintain

**Your platform will be live in ~20 minutes!**

---

## One-Command Setup

After prerequisites are met:

```bash
# Full setup (assumes you run these commands)
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb && rm cloudflared.deb

cloudflared tunnel login
cloudflared tunnel create highpeak

# Note the tunnel ID shown, then:
cat > ~/.cloudflared/config.yml << 'EOF'
tunnel: highpeak
credentials-file: /home/YOUR_USERNAME/.cloudflared/YOUR_TUNNEL_ID.json
ingress:
  - hostname: peak.wisdombusara.com
    service: http://localhost:3000
  - service: http_status:404
EOF

sudo cloudflared service install
sudo systemctl start cloudflared

# Add CNAME in Cloudflare Dashboard pointing to YOUR_TUNNEL_ID.cfargotunnel.com

# Deploy app
cd /opt/highpeak
cp .env.production .env.local
# Edit .env.local with secrets
docker-compose up -d

echo "Visit: https://peak.wisdombusara.com"
```

Done! 🎉
