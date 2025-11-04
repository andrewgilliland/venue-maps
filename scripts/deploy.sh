#!/bin/bash

# Venue Maps Deployment Script
# This script builds the Vite app and syncs it to S3
# Usage: ./deploy.sh

set -e  # Exit on any error

# Configuration
S3_BUCKET="venue-maps-bucket-1234567890"
AWS_REGION="us-east-1"
DIST_DIR="dist"

echo "🚀 Starting deployment for Venue Maps..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install it first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js and npm first."
    exit 1
fi

# Check AWS credentials
echo "🔐 Checking AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Please run 'aws configure' first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the app
echo "🏗️  Building Vite app..."
npm run build

# Check if build directory exists
if [ ! -d "$DIST_DIR" ]; then
    echo "❌ Build directory '$DIST_DIR' not found. Build may have failed."
    exit 1
fi

echo "📦 Build completed. Contents:"
ls -la dist/

# Sync to S3
echo "☁️  Syncing to S3 bucket: $S3_BUCKET..."

# Sync all files except HTML/JSON with long cache
aws s3 sync "$DIST_DIR/" "s3://$S3_BUCKET/" \
    --delete \
    --cache-control "public, max-age=31536000" \
    --exclude "*.html" \
    --exclude "*.json"

# Sync HTML/JSON files with short cache (for SPA routing)
aws s3 sync "$DIST_DIR/" "s3://$S3_BUCKET/" \
    --cache-control "public, max-age=0, must-revalidate" \
    --include "*.html" \
    --include "*.json"

echo "🌐 Setting website configuration..."
aws s3 website "s3://$S3_BUCKET" --index-document index.html --error-document index.html

echo "✅ Files synced to S3 successfully!"

# Try to invalidate CloudFront if it exists
echo "🌐 Checking for CloudFront distribution..."
DISTRIBUTION_ID=$(aws cloudfront list-distributions \
    --query "DistributionList.Items[?Origins.Items[0].DomainName==\`$S3_BUCKET.s3.amazonaws.com\`].Id" \
    --output text 2>/dev/null || echo "")

if [ ! -z "$DISTRIBUTION_ID" ] && [ "$DISTRIBUTION_ID" != "None" ]; then
    echo "🔄 Invalidating CloudFront distribution: $DISTRIBUTION_ID"
    aws cloudfront create-invalidation \
        --distribution-id "$DISTRIBUTION_ID" \
        --paths "/*" > /dev/null
    echo "✅ CloudFront cache invalidated!"
else
    echo "ℹ️  No CloudFront distribution found for this S3 bucket"
fi

# Output URLs
echo ""
echo "🎉 Deployment completed successfully!"
echo "📍 S3 Website URL: https://$S3_BUCKET.s3-website-$AWS_REGION.amazonaws.com"

if [ ! -z "$DISTRIBUTION_ID" ] && [ "$DISTRIBUTION_ID" != "None" ]; then
    DOMAIN_NAME=$(aws cloudfront get-distribution \
        --id "$DISTRIBUTION_ID" \
        --query "Distribution.DomainName" \
        --output text)
    echo "🚀 CloudFront URL: https://$DOMAIN_NAME"
fi

echo ""
echo "✨ Your venue maps application is now live!"