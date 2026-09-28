# Deploy peak.wisdombusara.com to Your VPS

Simplified deployment following your existing Cloudflare infrastructure.

## Prerequisites

- ✅ VPS with your public IP
- ✅ SSH access to VPS
- ✅ `wisdombusara.com` zone in Cloudflare (already active)
- ✅ Cloudflare Origin Certificate for `*.wisdombusara.com` (already exists)
- ✅ Repository cloned to `/opt/highpeak`

## Quick Start (5 steps)

### Step 1: Prepare VPS

```bash
# SSH to VPS
ssh root@YOUR_VM_IP

# Create deployment directory
mkdir -p /opt/highpeak
cd /opt/highpeak

# Clone repository
git clone https://github.com/WisdomBusara/High-Peak-Studio.git .

# Copy environment template
cp .env.production .env.local

# Edit with database password and Payload secret
nano .env.local
```

**Update in `.env.local`:**
```
DATABASE_URL=postgres://highpeak_user:YOUR_SECURE_PASSWORD@postgres:5432/highpeak
PAYLOAD_SECRET=YOUR_VERY_SECURE_SECRET_KEY_MIN_32_CHARS
NEXT_PUBLIC_SITE_URL=https://peak.wisdombusara.com
```

Generate secure secrets:
```bash
openssl rand -base64 32  # Run twice
```

### Step 2: Copy Cloudflare Origin Certificate

Copy your existing wildcard certificate to the VPS:

```bash
# On your local machine or wherever the cert is stored:
# Get the Cloudflare Origin Certificate from dashboard
# (SSL/TLS → Origin Server, should already be created)

# Then on VPS:
sudo mkdir -p /etc/ssl/cloudflare

# Paste certificate
sudo install -m 600 /dev/stdin /etc/ssl/cloudflare/wisdombusara.pem

# Paste key
sudo install -m 600 /dev/stdin /etc/ssl/cloudflare/wisdombusara.key

# Verify
ls -la /etc/ssl/cloudflare/
```

**If certificate doesn't exist yet:**
1. Go to Cloudflare Dashboard
2. SSL/TLS → Origin Server → Create Certificate
3. Add: `*.wisdombusara.com` and `wisdombusara.com`
4. Copy cert and key to paths above

### Step 3: Update Docker Compose

The nginx config needs to reference the Cloudflare certificate. Update `docker-compose.yml`:

```yaml
nginx:
  image: nginx:alpine
  container_name: highpeak-nginx
  restart: unless-stopped
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf:ro
    - /etc/ssl/cloudflare:/etc/nginx/ssl:ro  # Add this line
  depends_on:
    - app
  networks:
    - highpeak-network
```

### Step 4: Configure Nginx

Create `nginx.conf` that uses the Cloudflare certificate:

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types text/plain text/css text/xml text/javascript
               application/x-javascript application/xml+rss
               application/javascript application/json;

    upstream app {
        server app:3000;
    }

    # HTTP to HTTPS redirect
    server {
        listen 80;
        server_name peak.wisdombusara.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS with Cloudflare Origin Certificate
    server {
        listen 443 ssl http2;
        server_name peak.wisdombusara.com;

        # Cloudflare Origin Certificate (covers *.wisdombusara.com)
        ssl_certificate /etc/nginx/ssl/wisdombusara.pem;
        ssl_certificate_key /etc/nginx/ssl/wisdombusara.key;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # These headers are critical for proper client IP propagation
        # Cloudflare sets CF-Connecting-IP header on proxied requests
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Root location
        location / {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_cache_bypass $http_upgrade;
        }

        # API endpoints
        location ~ ^/api/ {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_request_buffering off;
        }

        # Static files - cache
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            proxy_pass http://app;
        }

        # Admin panel
        location /admin {
            proxy_pass http://app;
            proxy_http_version 1.1;
        }
    }
}
```

### Step 5: Deploy

```bash
cd /opt/highpeak

# Build Docker image
docker-compose build --no-cache

# Start services
docker-compose up -d

# Wait for database and app to be ready
sleep 10

# Check status
docker-compose ps

# Initialize database (first time only)
docker-compose exec -T postgres pg_isready -U highpeak_user
docker-compose exec -T app npm run payload:migrate
docker-compose exec -T app npm run payload:create-user
```

## Configure Cloudflare DNS

Now that services are running, add the DNS record:

1. **Cloudflare Dashboard** → Select `wisdombusara.com`
2. **DNS → Records → Add Record**

| Field | Value |
|---|---|
| Type | A |
| Name | `peak` |
| IPv4 address | Your VPS public IP |
| Proxy status | **Proxied** (orange cloud) ⚠️ Critical |
| TTL | Auto |

**Why Proxied matters:**
- ✅ Enables edge TLS (Cloudflare handles HTTPS)
- ✅ Hides your VPS IP (DDoS protection)
- ✅ Enables CF-Connecting-IP header
- ❌ DNS only exposes your IP and breaks rate limiting

Verify it resolves correctly:

```bash
dig +short peak.wisdombusara.com
# Should return Cloudflare IPs like 104.x.x.x, NOT your VPS IP
```

## Verification Checklist

Run these commands to verify each layer:

```bash
# 1. DNS resolves to Cloudflare (not your VPS IP)
dig +short peak.wisdombusara.com
# Expected: 104.x.x.x or 172.67.x.x (Cloudflare anycast)

# 2. Cloudflare edge has valid certificate
curl -sI https://peak.wisdombusara.com | head -1
# Expected: HTTP/2 200 or 301

# 3. Services are running
docker-compose ps
# Expected: postgres, app, nginx all "Up"

# 4. App responds on localhost
curl -s http://localhost:3000 | head -20
# Expected: HTML or redirect

# 5. Nginx proxies correctly
curl -sI --resolve peak.wisdombusara.com:443:127.0.0.1 https://peak.wisdombusara.com
# Expected: 200 OK

# 6. Full end-to-end through Cloudflare
curl -sI https://peak.wisdombusara.com
# Expected: 200 OK
```

## Access Your Site

Once DNS propagates (30-60 seconds):

- **Website:** https://peak.wisdombusara.com
- **Admin Panel:** https://peak.wisdombusara.com/admin
- **API:** https://peak.wisdombusara.com/api/health

## Useful Commands

```bash
cd /opt/highpeak

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app
docker-compose logs -f postgres
docker-compose logs -f nginx

# Check service health
docker-compose ps

# Restart a service
docker-compose restart app

# Stop all services
docker-compose down

# Start all services
docker-compose up -d

# View backups
ls -la /opt/highpeak/backups/

# Manually backup database
docker-compose exec -T postgres pg_dump -U highpeak_user highpeak > backup_manual.sql
```

## Troubleshooting

| Issue | Check |
|---|---|
| NXDOMAIN / Not found | DNS record exists? Set to Proxied? |
| 525/526 errors | Origin cert exists? TLS mode is Full (strict)? |
| 502 Bad Gateway | Is app running? (`docker-compose ps`) |
| 404 Not Found | Is app responding? (`curl http://localhost:3000`) |
| Slow response | Check `docker-compose logs app` for errors |

## Security

✅ **Protected by:**
- TLS 1.2+ at Cloudflare edge
- Cloudflare Origin Certificate at origin
- DDoS protection (Cloudflare)
- WAF rules (optional, in Cloudflare Dashboard)

⚠️ **Keep safe:**
- Don't commit `.env.local` to git
- Use strong database password
- Rotate PAYLOAD_SECRET periodically
- Keep certificate files secure (`/etc/ssl/cloudflare/`)

## Maintenance

```bash
# Weekly: Check services
docker-compose ps

# Monthly: Check for errors
docker-compose logs --tail=100 | grep -i error

# After each deploy: Purge Cloudflare cache
# (In Cloudflare Dashboard: Caching → Configuration → Purge Everything)
```

## Next Steps

1. ✅ Deploy to VM
2. ✅ Add Cloudflare DNS record
3. ✅ Verify with checklist
4. → Monitor logs for errors
5. → Set up monitoring/alerts
6. → Add LLM integration (optional)

**Total time to deployment:** 15 minutes

---

## Differences from Tunnel/Certbot Approaches

This approach (Cloudflare Origin Certificate) is **simpler and more aligned with your existing infrastructure**:

| Aspect | This Approach | Tunnel | Certbot |
|---|---|---|---|
| Certificate | Cloudflare Origin Cert | Cloudflare edge | Let's Encrypt |
| Port exposure | Needs 80/443 | None needed | Needs 80/443 |
| Setup time | ~5 min | ~10 min | ~10 min |
| Certificate renewal | Manual (15 years) | Auto | Auto (90 days) |
| Matches existing infra | ✅ Yes | ❌ No | ⚠️ Different |

Since your existing `lfg.wisdombusara.com` uses this approach, `peak.wisdombusara.com` should too for consistency.
