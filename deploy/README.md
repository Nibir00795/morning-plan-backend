# Morning Plan Deploy

## Option 1: Local deploy (simplest)

From your machine, with Docker and SSH working:

```bash
./deploy/deploy.sh nibir@167.86.104.73
```

Uses your default SSH key or password. No GitLab variables needed.

## Option 2: GitLab CI/CD deploy

1. Generate PEM key: `./deploy/generate-deploy-key.sh`
2. Add public key to server: `cat key.pub | ssh nibir@167.86.104.73 'cat >> ~/.ssh/authorized_keys'`
3. In GitLab: **Settings → CI/CD → Variables**
   - **SSH_PRIVATE_KEY**: Type = **Variable**, Masked = **No**
   - Value: paste full private key (-----BEGIN RSA PRIVATE KEY----- ... -----END RSA PRIVATE KEY-----)
4. Push to main → pipeline deploys

Use PEM format only (`ssh-keygen -t rsa -m PEM`). Remove SSH_KEY_BASE64 if you added it.
