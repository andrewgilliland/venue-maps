#!/bin/bash

# Deploy script for venue-maps to S3
# Usage: ./deploy.sh

set -e

echo "🏗️ Building React Vite app..."
npm run build

echo "📦 Build completed. Contents:"
ls -la dist/

echo "🚀 Deploying to S3..."
aws s3 sync ./dist/ s3://${S3_BUCKET_NAME} --delete

echo "🌐 Setting website configuration..."
aws s3 website s3://${S3_BUCKET_NAME} --index-document index.html --error-document index.html

echo "✅ Deployment completed!"
echo "🌐 Website URL: http://${S3_BUCKET_NAME}.s3-website-${AWS_REGION}.amazonaws.com"