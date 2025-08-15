# AWS Amplify Deployment Guide

## Your Database is Ready! 🎉
- **Database URL**: `postgresql://postgres:SecurePassword123!@grow-cms-db.clouewmg2ya7.eu-north-1.rds.amazonaws.com:5432/postgres`

## Deploy with AWS Amplify Console

1. **Go to AWS Amplify Console**: https://console.aws.amazon.com/amplify/
2. **Click "New app" → "Host web app"**
3. **Connect GitHub repository**: `https://github.com/giaba90/grow-cms`
4. **Select branch**: `dev`
5. **Configure build settings**:
   - Build command: `npm run build`
   - Output directory: `.next`
   - Node version: `18`

6. **Add Environment Variables**:
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://postgres:SecurePassword123!@grow-cms-db.clouewmg2ya7.eu-north-1.rds.amazonaws.com:5432/postgres
   NEXTAUTH_SECRET=your-long-random-secret-key-here
   ```

7. **Deploy!**

## Alternative: Manual Deploy

```bash
# Build locally
npm run build

# Deploy to S3 + CloudFront
aws s3 sync .next s3://your-bucket-name
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

## Next Steps
1. Set up custom domain in Amplify Console
2. Configure SSL certificate
3. Set up monitoring and logging