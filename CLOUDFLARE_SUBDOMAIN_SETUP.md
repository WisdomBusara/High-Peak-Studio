# Setting up peak.wisdombusara.com on Cloudflare

Complete guide to activate the `peak.wisdombusara.com` subdomain following the existing infrastructure model.

## Model

`wisdombusara.com` is the core domain with nameservers delegated to Cloudflare. `peak.wisdombusara.com` is a DNS record in that zone—no separate registration needed.

Four layers must align for activation to work:

| Layer | Owner | Failure | Fix Section |
|---|---|---|---|
| DNS record | Cloudflare dashboard | NXDOMAIN | Step 1 |
| TLS at edge | Cloudflare Origin Cert | 525/526 | Step 2 |
| Reverse proxy | nginx in Docker | 502/404 | Step 3 |
| Application | Docker containers | 503/error | Step 4 |

---

## Prerequisites

- Cloudflare account access
- VPS public IP address
- SSH access to VM
- Cloudflare Origin Certificate for `*.wisdombusara.com` (already exists per your docs)
- Repository deployed to `/opt/highpeak`

---

## Step 1: Add DNS Record

**Cloudflare Dashboard → wisdombusara.com → DNS → Records → Add Record**

| Field | Value |
|---|---|
| Type | A |
| Name | `peak` (Cloudflare appends `.wisdombusara.com`) |
| IPv4 address | Your VPS public IP |
| Proxy status | **Proxied** (orange cloud) |
| TTL | Auto |

**Critical:** Use **Proxied**, not DNS only. This enables:
- Edge TLS certificate (Cloudflare handles it)
- DDoS protection
- `CF-Connecting-IP` header for client IP
- Protection of origin IP

Verify it resolves to Cloudflare anycast IPs, not your VPS IP:

```bash
dig +short peak.wisdombusara.com
# Should return Cloudflare IPs (104.x or 172.67.x)
# NOT your VPS IP
```

---

## Step 2: Origin Certificate

Your wildcard Cloudflare Origin Certificate already covers `*.wisdombusara.com`, so **no new certificate needed**.

Verify it exists on the VPS:

```bash
# Check if cert files exist
ls -la /etc/ssl/cloudflare/wisdombusara.pem
ls -la /etc/ssl/cloudflare/wisdombusara.key

# If they don't exist, get them from Cloudflare Dashboard:
# SSL/TLS → Origin Server → Create Certificate
# Add: *.wisdombusara.com, wisdombusara.com
# Save both cert and key to paths above
```

The cert is already referenced in your docker-compose setup (if using direct SSL mode) via the nginx config.

---

## Step 3: Nginx Configuration

Your deployment already includes nginx in Docker. The nginx config is automatically selected based on deployment mode:

### For Cloudflare Tunnel Mode (Recommended)

Uses `nginx-tunnel.conf` which is already configured for peak.wisdombusara.com:

```bash
# In /opt/highpeak/docker-compose.yml, nginx volume already includes:
- ./nginx-tunnel.conf:/etc/nginx/nginx.conf:ro

# The config already has:
server_name peak.wisdombusara.com;
proxy_pass http://app:3000;
```

**No additional nginx config needed for tunnel mode.**

### For Direct SSL Mode

If you used the `deploy.sh` script (direct SSL), verify the nginx config:

```bash
cd /opt/highpeak

# Check which config is in use
cat nginx.conf | grep -A 20 "server {"

# Should see:
server_name peak.wisdombusara.com;
ssl_certificate /etc/letsencrypt/live/peak.wisdombusara.com/...
```

To switch to using your Cloudflare Origin Certificate instead:

```bash
# Edit nginx.conf (or create new one)
# Update SSL certificate paths to use Cloudflare cert:
ssl_certificate /etc/ssl/cloudflare/wisdombusara.pem;
ssl_certificate_key /etc/ssl/cloudflare/wisdombusara.key;

# Restart nginx
docker-compose restart nginx
```

---

## Step 4: Application Environment Variables

Your environment variables should be set correctly during deployment, but verify:

On the VPS:

```bash
cat /opt/highpeak/.env.local | grep SITE_URL
# Should see:
NEXT_PUBLIC_SITE_URL=https://peak.wisdombusara.com
```

If deploying a Next.js app from this repo:

```bash
# In /opt/highpeak/.env.local
NEXT_PUBLIC_SITE_URL=https://peak.wisdombusara.com

# Rebuild if environment changed:
docker-compose down
docker-compose up -d
```

---

## Step 5: Cloudflare TLS Mode Verification

In Cloudflare Dashboard, verify zone SSL/TLS settings:

**SSL/TLS → Overview**
- Mode should be: **Full (strict)**

This requires a valid certificate on the origin (which you have: the Cloudflare Origin Certificate).

If mode is `Flexible`, change it to `Full (strict)`:
- `Flexible` talks HTTP to the origin → infinite redirect loops
- `Full (strict)` requires HTTPS at origin → correct

---

## Activation Checklist

Run these in order. The first one that fails tells you which step to revisit.

```bash
# 1. DNS resolves to Cloudflare (not VPS IP)
dig +short peak.wisdombusara.com
# Expected: Cloudflare IPs like 104.x.x.x or 172.67.x.x
# If returns VPS IP: Record is "DNS only", change to "Proxied"

# 2. Edge serves valid TLS certificate for correct hostname
curl -sI https://peak.wisdombusara.com | head -5
# Expected: HTTP/2 200 or 301
# If 525/526: Origin cert problem or Cloudflare can't reach origin

# 3. nginx is running and reachable
docker-compose ps
# Expected: nginx container is "Up"

# 4. nginx proxies correctly to app
curl -sI http://localhost:3000
# Expected: 200 or 301 (app is responding)
# If 502: app container not running, restart with docker-compose up -d

# 5. Full end-to-end test through Cloudflare
curl -sI https://peak.wisdombusara.com/
# Expected: 200 OK (page loads)
# If 502: nginx can't reach app, check docker-compose ps and logs
# If 403/404: app is running but route doesn't exist

# 6. Verify client IP propagation (for rate limiting/logging)
curl -s https://peak.wisdombusara.com/api/health
# App should log your real client IP via CF-Connecting-IP
```

---

## Troubleshooting by Symptom

| Symptom | Cause | Fix |
|---|---|---|
| NXDOMAIN / host not found | DNS record missing or not proxied | Step 1: Add DNS record, set to Proxied |
| 525/526 errors | Origin unreachable or cert problem | Verify origin cert exists, check TLS mode is Full (strict) |
| 502 Bad Gateway | nginx can't reach app | Check `docker-compose ps`, restart with `docker-compose up -d` |
| 404 Not Found | Route doesn't exist in app | Check app is responding: `curl http://localhost:3000` |
| 403 Forbidden | May be rate limiting or auth | Check nginx logs: `docker-compose logs -f nginx` |
| Infinite redirect loop | TLS mode is Flexible, not Full (strict) | Change Cloudflare SSL/TLS mode to Full (strict) |
| Slow/timeout | App or database not responding | Check `docker-compose logs -f app` and `docker-compose logs -f postgres` |

---

## Database Layer

If using the knowledge pipeline, verify PostgreSQL is running:

```bash
docker-compose ps postgres
# Expected: Status "Up"

# Check database is healthy
docker-compose exec -T postgres pg_isready -U highpeak_user
# Expected: "accepting connections"

# Run migrations if not yet done
docker-compose exec app npm run payload:migrate

# Create admin user for CMS
docker-compose exec app npm run payload:create-user
```

---

## Cloudflare Dashboard Features

Now that peak.wisdombusara.com is active, you can use these features in Cloudflare Dashboard:

**Caching → Cache Rules**
- Cache static assets (*.js, *.css, etc) for 1 year
- Bypass cache for /api/* endpoints

**Speed → Optimization**
- Enable Brotli compression
- Enable Automatic HTTPS rewrites
- Minify CSS/JavaScript

**Security → WAF Rules**
- Add rate limiting
- Block known bot patterns
- Whitelist trusted IPs

**Analytics**
- View traffic, errors, performance metrics for peak.wisdombusara.com

---

## Post-Activation Maintenance

### Regular checks

```bash
# Weekly: Verify services are up
cd /opt/highpeak && docker-compose ps

# Weekly: Check for errors in logs
docker-compose logs --tail=100 | grep -i error

# Monthly: Verify backups are happening
ls -lah /opt/highpeak/backups/ | head -5
```

### Updates and redeployment

```bash
cd /opt/highpeak

# Pull latest code
git pull origin master

# Rebuild and restart
docker-compose build --no-cache
docker-compose up -d

# Run migrations if database schema changed
docker-compose exec app npm run payload:migrate
```

### Cache purging

After deploying updates, purge Cloudflare cache:

```bash
# Via CLI (if cloudflared installed)
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  --data '{"files":["https://peak.wisdombusara.com/*"]}'

# Or via Cloudflare Dashboard:
# Caching → Configuration → Purge Everything
```

---

## Security Notes

✅ **What's protected:**
- Traffic encrypted by Cloudflare edge (TLS 1.2+)
- Origin traffic encrypted with Cloudflare Origin Certificate
- DDoS protection enabled by default
- WAF rules can be added for additional protection

⚠️ **Keep secure:**
- Never expose the origin certificate private key
- Don't use DNS-only mode (exposes VPS IP)
- Keep Cloudflare API tokens in secure storage
- Rotate database passwords regularly

---

## Reference: Existing subdomain

For comparison, the existing `lfg.wisdombusara.com` follows this same pattern:
- DNS A record (proxied)
- Cloudflare Origin Certificate
- nginx server block
- systemd unit for Next.js app
- Same Cloudflare zone

Your setup for peak.wisdombusara.com is analogous, just with Docker containers instead of systemd units.

---

## Complete Setup Command (Quick Reference)

After deployment to `/opt/highpeak`:

```bash
# 1. Add DNS record in Cloudflare Dashboard (see Step 1)

# 2. Verify services running
cd /opt/highpeak && docker-compose ps

# 3. Run activation checklist (see Step 5)
dig +short peak.wisdombusara.com
curl -sI https://peak.wisdombusara.com/

# 4. Access your site
# Website:  https://peak.wisdombusara.com
# Admin:    https://peak.wisdombusara.com/admin
# API:      https://peak.wisdombusara.com/api
```

---

## Next Steps

1. ✅ Add DNS A record for peak → Your VPS IP
2. ✅ Verify DNS resolves to Cloudflare IPs
3. ✅ Run activation checklist
4. → Set up rate limiting / WAF rules (optional)
5. → Configure cache rules for optimal performance
6. → Monitor through Cloudflare Analytics

**Estimated time to activation:** 5-10 minutes after DNS propagates
