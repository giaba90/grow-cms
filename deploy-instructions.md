# AWS Deployment Instructions for GROW CMS

## Prerequisites
- AWS CLI installed and configured
- GitHub repository with your code
- Docker installed locally (for testing)

## Option 1: Quick Deploy with CloudFormation (Recommended)

1. **Deploy Infrastructure**:
   ```bash
   aws cloudformation create-stack \
     --stack-name grow-cms-stack \
     --template-body file://cloudformation-template.yaml \
     --parameters ParameterKey=DBPassword,ParameterValue=YourSecurePassword123! \
                  ParameterKey=GitHubRepo,ParameterValue=https://github.com/yourusername/grow-cms \
     --capabilities CAPABILITY_IAM
   ```

2. **Wait for completion**:
   ```bash
   aws cloudformation wait stack-create-complete --stack-name grow-cms-stack
   ```

3. **Get outputs**:
   ```bash
   aws cloudformation describe-stacks --stack-name grow-cms-stack --query 'Stacks[0].Outputs'
   ```

## Option 2: Manual Setup

1. **Make deployment script executable**:
   ```bash
   chmod +x aws-deploy.sh
   ```

2. **Run deployment script**:
   ```bash
   ./aws-deploy.sh
   ```

3. **Create App Runner service manually in AWS Console**

## Environment Variables Setup

Update your `.env.production` with:
```env
DATABASE_URL=postgresql://postgres:password@your-rds-endpoint:5432/postgres
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-apprunner-url.region.awsapprunner.com
```

## Post-Deployment Steps

1. **Test your database connection**:
   ```bash
   npx prisma migrate deploy
   ```

2. **Monitor your App Runner service** in AWS Console

3. **Set up custom domain** (optional) in App Runner settings

## Costs Estimation
- RDS t3.micro: ~$13/month
- App Runner: ~$7/month (0.25 vCPU, 0.5GB RAM)
- **Total**: ~$20/month

## Troubleshooting

- Check App Runner logs in AWS Console
- Verify environment variables are set correctly
- Ensure database migrations run successfully