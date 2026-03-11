#!/bin/bash
# Generate RSA deploy key for GitLab CI/CD (avoids libcrypto issues with Ed25519)
set -e
KEY_FILE="${1:-./morning-plan-deploy}"
echo "Generating RSA key at $KEY_FILE..."
ssh-keygen -t rsa -b 4096 -m PEM -f "$KEY_FILE" -N "" -C "morning-plan-deploy"
echo ""
echo "Done. Next steps:"
echo "  1. Add the PUBLIC key to server:"
echo "     ssh nibir@167.86.104.73 'mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys' < ${KEY_FILE}.pub"
echo ""
echo "  2. In GitLab: Settings → CI/CD → Variables"
echo "     - Edit SSH_PRIVATE_KEY (or create new)"
echo "     - Type: File"
echo "     - Value: paste contents of ${KEY_FILE} (the private key)"
echo "     - Save"
echo ""
echo "  3. Delete the local key files after: rm ${KEY_FILE} ${KEY_FILE}.pub"
