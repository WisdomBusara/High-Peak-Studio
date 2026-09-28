# Cloudflare Tunnel Setup for peak.wisdombusara.com

Use Cloudflare Tunnel to expose your VM securely without opening ports or dealing with SSL certificates.

## Prerequisites

- Cloudflare account with wisdombusara.com domain
- VM at any location (no IP exposure needed)
- SSH access to VM
- 10 minutes

## Benefits

✅ No port forwarding needed  
✅ No SSL certificate management (Cloudflare handles it)  
✅ DDoS protection included  
✅ Works behind NAT/firewalls  
✅ Free tier available  

## Step 1: Install Cloudflared on VM

SSH into your VM:

```bash
# Download and install cloudflared
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb
rm cloudflared.deb

# Verify installation
cloudflared --version
```

## Step 2: Authenticate with Cloudflare

```bash
# Login to Cloudflare (opens browser)
cloudflared tunnel login

# This will:
# - Open browser to Cloudflare login
# - Ask permission to create tunnels
# - Create ~/.cloudflared/cert.pem certificate
```

## Step 3: Create Tunnel

```bash
# Create tunnel named "highpeak"
cloudflared tunnel create highpeak

# Note the Tunnel ID (you'll need it)
# Example output:
# Created tunnel highpeak with id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

## Step 4: Create Tunnel Config File

Create `/home/YOUR_USER/.cloudflared/config.yml`:

```bash
# Create config directory
mkdir -p ~/.cloudflared

# Create config file
cat > ~/.cloudflared/config.yml << 'EOF'
tunnel: highpeak
credentials-file: /home/YOUR_USER/.cloudflared/a1b2c3d4-e5f6-7890-abcd-ef1234567890.json

ingress:
  - hostname: peak.wisdombusara.com
    service: http://localhost:3000
  - service: http_status:404
EOF
```

Replace:
- `YOUR_USER` with your VM username
- `a1b2c3d4-e5f6-7890-abcd-ef1234567890` with your Tunnel ID

## Step 5: Configure DNS in Cloudflare Dashboard

1. Log into Cloudflare dashboard
2. Go to DNS settings for wisdombusara.com
3. Add CNAME record:
   ```
   Name: peak
   Content: a1b2c3d4-e5f6-7890-abcd-ef1234567890.cfargotunnel.com
   ```
   (Replace the ID with your actual tunnel ID)

## Step 6: Test Tunnel Locally

```bash
# Run tunnel in foreground (for testing)
cloudflared tunnel run highpeak

# Should see:
# INFO  |  Tunnel running at... 
# INFO  |  peak.wisdombusara.com available
```

Press `Ctrl+C` after confirming it works.

## Step 7: Run Tunnel as System Service

```bash
# Install tunnel as systemd service
sudo cloudflared service install

# Start service
sudo systemctl start cloudflared

# Enable auto-start
sudo systemctl enable cloudflared

# Check status
sudo systemctl status cloudflared

# View logs
sudo journalctl -u cloudflared -f
```

## Step 8: Simplify Deployment Script

Now your deployment script can be simpler:

```bash
# NO NEED FOR:
# - SSL certificate setup (Cloudflare handles it)
# - DNS configuration (already done via CNAME)
# - Port forwarding
# - Certbot

# Just run:
cd /opt/highpeak
docker-compose build
docker-compose up -d
```

## Step 9: Update docker-compose.yml

Since Cloudflare handles HTTPS, update nginx config to not need SSL:

Replace in `docker-compose.yml`:

```yaml
nginx:
  image: nginx:alpine
  container_name: highpeak-nginx
  restart: unless-stopped
  ports:
    - "80:80"  # Only HTTP needed (Cloudflare adds HTTPS)
  volumes:
    - ./nginx-tunnel.conf:/etc/nginx/nginx.conf:ro
  depends_on:
    - app
  networks:
    - highpeak-network
```

## Step 10: Create Simplified Nginx Config

Create `nginx-tunnel.conf` for use with Cloudflare Tunnel:

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

    # Simple HTTP only (Cloudflare adds HTTPS layer)
    server {
        listen 80;
        server_name peak.wisdombusara.com;

        location / {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        location /api/ {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            proxy_pass http://app;
        }

        location /admin {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

## Step 11: Deploy with Cloudflare Tunnel

```bash
# SSH to VM
ssh root@YOUR_VM_IP

# Clone repo
mkdir -p /opt/highpeak
cd /opt/highpeak
git clone https://github.com/WisdomBusara/High-Peak-Studio.git .

# Copy tunnel nginx config
cp nginx-tunnel.conf nginx.conf

# Copy production env template
cp .env.production .env.local

# Generate secrets
nano .env.local
# Update: DATABASE_URL password and PAYLOAD_SECRET

# Build and start
docker-compose build
docker-compose up -d

# Check status
docker-compose ps
```

## Tunnel Management Commands

```bash
# List all tunnels
cloudflared tunnel list

# View tunnel status
sudo systemctl status cloudflared

# View tunnel logs
sudo journalctl -u cloudflared -f

# Stop tunnel
sudo systemctl stop cloudflared

# Start tunnel
sudo systemctl start cloudflared

# Restart tunnel
sudo systemctl restart cloudflared

# Remove tunnel (deletes everything)
cloudflared tunnel delete highpeak
```

## Cloudflare Dashboard Features

After tunnel is created, access your tunnel dashboard:

1. Go to Cloudflare Dashboard
2. Select wisdombusara.com
3. Go to "Caching" → "Caching Rules" to add cache rules
4. Go to "Speed" for performance monitoring
5. Go to "Security" → "WAF Rules" for DDoS protection

## SSL Certificate Management

✅ **Cloudflare handles SSL automatically:**
- Encrypts traffic between Cloudflare and browser
- Unencrypted between Cloudflare and your server (both on same network)
- No certificate renewal needed
- Auto-upgrade to latest TLS versions

If you want end-to-end encryption, enable in Cloudflare Dashboard:
- SSL/TLS mode: Full (strict)
- Create self-signed cert on VM (optional)

## Troubleshooting

### Tunnel won't start
```bash
# Check credentials exist
ls ~/.cloudflared/cert.pem

# Reauthenticate
cloudflared tunnel login
```

### DNS not resolving
```bash
# Verify CNAME record
nslookup peak.wisdombusara.com

# Should return tunnel URL
```

### Traffic not routing
```bash
# Verify tunnel is running
sudo systemctl status cloudflared

# Check config syntax
cloudflared tunnel ingress validate

# View logs
sudo journalctl -u cloudflared -n 50
```

### High latency
- Check tunnel bandwidth at Cloudflare Dashboard
- Verify server is running (`docker-compose ps`)
- Check nginx logs: `docker-compose logs nginx`

## Cost

- Cloudflare Tunnel: Free
- Cloudflare Pro: $200/year (for advanced features like Workers)
- No egress charges (free bandwidth)

## Security Notes

✅ Traffic encrypted by Cloudflare  
✅ VM IP never exposed  
✅ DDoS protected  
✅ WAF rules available  
✅ Rate limiting included  

## Next Steps

1. ✅ Install cloudflared
2. ✅ Create tunnel
3. ✅ Add DNS CNAME record
4. ✅ Test locally
5. ✅ Install systemd service
6. ✅ Deploy application
7. → Access at https://peak.wisdombusara.com

## Complete Setup Command

Copy and run on your VM:

```bash
# Download cloudflared
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb
rm cloudflared.deb

# Create tunnel (opens browser to login)
cloudflared tunnel login
cloudflared tunnel create highpeak

# Note: Save the Tunnel ID shown!
```

Then manually:
1. Add CNAME record to Cloudflare DNS
2. Create config file with tunnel ID
3. Start service: `sudo systemctl start cloudflared`
4. Deploy app: `cd /opt/highpeak && docker-compose up -d`
