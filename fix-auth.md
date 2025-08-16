# Fix Login/Register Issues

## Step 1: Update NEXTAUTH_URL
1. Go to AWS Amplify Console
2. Find your app URL (e.g., `https://dev.d2id7ng1xclks.amplifyapp.com`)
3. Go to Environment variables
4. Update `NEXTAUTH_URL` with your actual URL
5. Redeploy

## Step 2: Run Database Migrations
```bash
# Connect to your database and run migrations
npx prisma migrate deploy --schema=./src/app/prisma/schema.prisma
```

## Step 3: Test Database Connection
```bash
# Test if database is accessible
npx prisma db push --schema=./src/app/prisma/schema.prisma
```

## Quick Fix Script:
```bash
# Set your Amplify URL
export DATABASE_URL="postgresql://postgres:SecurePassword123!@grow-cms-db.clouewmg2ya7.eu-north-1.rds.amazonaws.com:5432/postgres"

# Run migrations
npx prisma migrate deploy --schema=./src/app/prisma/schema.prisma

# Generate client
npx prisma generate --schema=./src/app/prisma/schema.prisma
```