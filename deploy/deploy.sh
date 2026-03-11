#!/bin/bash
# Deploy Morning Plan from your machine (no GitLab CI variables needed)
set -e

SERVER="${1:-nibir@167.86.104.73}"
DEPLOY_DIR="/home/nibir/morning-plan"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "=== Morning Plan Deploy ==="
echo "Server: $SERVER"
echo ""

# Build
echo "Building Docker image..."
cd "$PROJECT_DIR"
docker build -t morning-plan-api:latest .

# Save
echo "Saving image..."
docker save morning-plan-api:latest | gzip > /tmp/morning-plan-image.tar.gz

# Deploy
echo "Copying to server..."
scp -o StrictHostKeyChecking=no /tmp/morning-plan-image.tar.gz "$SERVER:$DEPLOY_DIR/image.tar.gz"
scp -o StrictHostKeyChecking=no "$PROJECT_DIR/docker-compose.prod.yml" "$SERVER:$DEPLOY_DIR/docker-compose.yml"
scp -o StrictHostKeyChecking=no "$PROJECT_DIR/deploy/nginx.conf" "$SERVER:$DEPLOY_DIR/nginx.conf"

echo "Starting on server..."
ssh -o StrictHostKeyChecking=no "$SERVER" "cd $DEPLOY_DIR && docker load < image.tar.gz && rm -f image.tar.gz && docker compose up -d --force-recreate api && docker image prune -f"

rm -f /tmp/morning-plan-image.tar.gz
echo ""
echo "Deployment complete."
