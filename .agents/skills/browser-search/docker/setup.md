# Docker Container Setup

Initial setup and diagnostics for SearXNG and Camofox containers.
Containers are configured to start automatically on boot (`--restart unless-stopped`).

## Initial Setup

```bash
# SearXNG (via docker-compose)
# Follow: https://docs.searxng.org/admin/installation-docker.html
cd <searxng-directory> && docker compose up -d

# Camofox
# Build from source or pull image, then:
docker start camofox-browser 2>/dev/null || docker run -d \
  --name camofox-browser \
  --restart unless-stopped \
  -p 9377:9377 \
  -e CAMOFOX_API_KEY=<your-api-key> \
  camofox-browser:latest
```

## Diagnostics

```bash
# Check running containers
docker ps | grep -E 'searxng|camofox'

# Individual health checks
curl -s http://localhost:9377/health   # Camofox
curl -s http://localhost:8080/health   # SearXNG
```
