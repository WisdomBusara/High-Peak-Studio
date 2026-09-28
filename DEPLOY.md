# Deploying Highpeak

Production runs on the shared VPS in `/opt/highpeak`:

| Piece | Where |
|---|---|
| App (Next.js + Payload CMS) | Docker container `highpeak-app`, listening on `127.0.0.1:3100` only |
| Database (Postgres 15) | Docker container `highpeak-db`, not published to the host |
| Uploaded media | Docker volume `highpeak_media` |
| Public HTTPS | The host's existing `cloudflared` service forwards `peak.wisdombusara.com` to `127.0.0.1:3100` |

Secrets live in `/opt/highpeak/.env` (created by the setup script, mode 600, never committed).
Database migrations in `src/migrations` are applied automatically when the app starts.

## First deploy and every update

```bash
cd /opt/highpeak
git pull
bash setup-highpeak.sh
```

On the first run the script asks for the domain, the app port and a database password, then builds,
starts, waits until the database is migrated, and creates the first CMS admin account over loopback
(before the site is public, so nobody else can claim it). On later runs it reuses `.env` and only
rebuilds and restarts.

It stops with the relevant log lines if anything fails. It never edits the cloudflared config.

## Publishing through the tunnel (once)

Add the hostname to the tunnel that `/etc/cloudflared/config.yml` already runs, directly above the
final catch-all rule, without touching the other rules:

```yaml
  - hostname: peak.wisdombusara.com
    service: http://127.0.0.1:3100
  - service: http_status:404
```

```bash
sudo cloudflared --config /etc/cloudflared/config.yml tunnel ingress validate
sudo systemctl restart cloudflared
sudo cloudflared tunnel route dns --overwrite-dns <tunnel-name> peak.wisdombusara.com
```

`<tunnel-name>` is the `tunnel:` value at the top of that file. Back the file up before editing:
other sites on this server are routed through it.

## Day to day

```bash
docker compose ps                  # status
docker compose logs -f app         # app logs
docker compose restart app         # restart
docker compose exec -T postgres pg_dump -U highpeak_user highpeak > backup_$(date +%F).sql
```

## Changing the CMS schema

After editing collections in `src/payload/collections`, run locally
`npm run migrate:create -- <name>`, commit the generated files in `src/migrations`, and redeploy.
