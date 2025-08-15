#!/bin/bash

# AWS Deployment Script for GROW CMS
# Make sure you have AWS CLI configured with appropriate permissions

set -e

echo "🚀 Starting AWS deployment for GROW CMS..."

# Variables
APP_NAME="grow-cms"
REGION="us-east-1"  # Change to your preferred region
DB_NAME="growcms"
DB_USERNAME="postgres"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Creating RDS PostgreSQL instance...${NC}"
aws rds create-db-instance \
    --db-instance-identifier ${DB_NAME} \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username ${DB_USERNAME} \
    --master-user-password $(openssl rand -base64 32) \
    --allocated-storage 20 \
    --vpc-security-group-ids default \
    --backup-retention-period 7 \
    --region ${REGION} \
    --no-multi-az \
    --storage-type gp2 \
    --engine-version 15.4 \
    --no-publicly-accessible

echo -e "${YELLOW}Step 2: Waiting for RDS instance to be available...${NC}"
aws rds wait db-instance-available --db-instance-identifier ${DB_NAME} --region ${REGION}

echo -e "${YELLOW}Step 3: Getting RDS endpoint...${NC}"
DB_ENDPOINT=$(aws rds describe-db-instances \
    --db-instance-identifier ${DB_NAME} \
    --region ${REGION} \
    --query 'DBInstances[0].Endpoint.Address' \
    --output text)

echo -e "${GREEN}RDS endpoint: ${DB_ENDPOINT}${NC}"

echo -e "${YELLOW}Step 4: Creating App Runner service...${NC}"
# Note: You'll need to create the service through AWS Console or use CloudFormation
# as App Runner CLI support is limited

echo -e "${GREEN}✅ Infrastructure setup complete!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update your .env.production with the RDS endpoint"
echo "2. Create App Runner service in AWS Console"
echo "3. Connect your GitHub repository"
echo "4. Deploy your application"

echo -e "${GREEN}Database URL format:${NC}"
echo "postgresql://username:password@${DB_ENDPOINT}:5432/${DB_NAME}"