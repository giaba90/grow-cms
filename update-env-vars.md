# Update Environment Variables in Amplify

## Go to AWS Amplify Console:
1. Open: https://console.aws.amazon.com/amplify/
2. Click your `grow-cms` app
3. Go to "Environment variables" (left sidebar)
4. Update these variables:

```
NEXTAUTH_URL
https://dev.d2id7ng1xclks.amplifyapp.com

NEXTAUTH_SECRET
your-long-random-secret-generate-with-openssl-rand-base64-32

DATABASE_URL
postgresql://postgres:SecurePassword123!@grow-cms-db.clouewmg2ya7.eu-north-1.rds.amazonaws.com:5432/postgres

NODE_ENV
production
```

5. Click "Save"
6. Click "Redeploy this version"

## Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

After redeploy (2-3 minutes), login/register should work! ✅