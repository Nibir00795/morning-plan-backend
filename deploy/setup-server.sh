#!/bin/bash
set -euo pipefail

echo "=== Morning Plan Backend — Server Setup ==="

if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
fi

if ! docker compose version &> /dev/null; then
    echo "Installing Docker Compose plugin..."
    apt-get update && apt-get install -y docker-compose-plugin
fi

mkdir -p /opt/morning-plan
cd /opt/morning-plan

if [ ! -f .env ]; then
    cat > .env << 'ENVEOF'
NODE_ENV=production
PORT=3000

POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=morning_plan
POSTGRES_PASSWORD=CHANGE_ME_STRONG_PASSWORD
POSTGRES_DB=morning_plan

REDIS_HOST=redis
REDIS_PORT=6379

SUPABASE_JWT_SECRET=your-supabase-jwt-secret

MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=CHANGE_ME_MINIO_SECRET
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=CHANGE_ME_MINIO_SECRET

REVENUECAT_WEBHOOK_SECRET=your-revenuecat-secret

FREE_TASK_LIMIT=3
PREMIUM_TASK_LIMIT=50
FREE_FAVORITE_LIMIT=2
PREMIUM_FAVORITE_LIMIT=5

ADMIN_API_KEY=CHANGE_ME_ADMIN_KEY
ENVEOF
    echo "Created /opt/morning-plan/.env — EDIT IT with real values before deploying!"
else
    echo ".env already exists, skipping"
fi

echo ""
echo "=== Setup complete ==="
echo "Next steps:"
echo "  1. Edit /opt/morning-plan/.env with your real secrets"
echo "  2. Push to GitLab main branch to trigger deployment"
echo "  3. Or manually: docker compose up -d"
