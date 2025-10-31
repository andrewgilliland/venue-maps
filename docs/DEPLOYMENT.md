# AWS S3 Deployment Setup

This guide will help you set up automated deployment of your React Vite app to AWS S3 using GitHub Actions.

## Prerequisites

1. AWS account with S3 bucket created
2. GitHub repository
3. AWS CLI installed locally (for testing)

## 1. Create AWS IAM User for GitHub Actions

### Create IAM Policy

1. Go to AWS Console > IAM > Policies
2. Click "Create policy"
3. Use JSON editor and paste this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:PutBucketWebsite"
      ],
      "Resource": [
        "arn:aws:s3:::venue-maps-bucket-1234567890",
        "arn:aws:s3:::venue-maps-bucket-1234567890/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation"],
      "Resource": "*"
    }
  ]
}
```

3. Name it: `venue-maps-deployment-policy`

### Create IAM User

1. Go to IAM > Users
2. Click "Create user"
3. Username: `venue-maps-github-actions`
4. Attach the policy you just created
5. Create access keys and **save them securely**

## 2. Set up GitHub Secrets

Go to your GitHub repository > Settings > Secrets and variables > Actions

Add these repository secrets:

- `AWS_ACCESS_KEY_ID`: Your IAM user access key
- `AWS_SECRET_ACCESS_KEY`: Your IAM user secret key
- `S3_BUCKET_NAME`: `venue-maps-bucket-1234567890`
- `CLOUDFRONT_DISTRIBUTION_ID`: (optional, if using CloudFront)

## 3. Test Local Deployment

First, test the deployment locally:

```bash
# Make deploy script executable
chmod +x scripts/deploy.sh

# Set environment variables
export S3_BUCKET_NAME=venue-maps-bucket-1234567890
export AWS_REGION=us-east-2

# Run deployment
./scripts/deploy.sh
```

## 4. GitHub Actions Workflow

The workflow in `.github/workflows/deploy.yml` will automatically:

1. **Trigger on**: Push to main branch or manual dispatch
2. **Build**: Install dependencies and build Vite app
3. **Deploy**: Sync files to S3 with proper caching
4. **Configure**: Set S3 website hosting
5. **Invalidate**: Clear CloudFront cache (if configured)

## 5. Workflow Features

### ✅ Smart Caching

- Static assets (JS, CSS, images): 1 year cache
- HTML/JSON files: No cache (always fresh)

### ✅ Performance Optimizations

- Only uploads changed files (`--delete` flag)
- Parallel uploads for faster deployment
- Proper MIME types and compression

### ✅ Error Handling

- Continues on test failures
- Optional CloudFront invalidation
- Detailed logging and status updates

## 6. Manual Deployment

You can trigger deployment manually:

1. Go to GitHub > Actions tab
2. Select "Deploy Venue Maps to AWS S3"
3. Click "Run workflow"
4. Select branch and click "Run workflow"

## 7. Website URLs

After deployment, your site will be available at:

**S3 Website URL:**

```
http://venue-maps-bucket-1234567890.s3-website-us-east-1.amazonaws.com
```

**If using CloudFront:**

```
https://your-distribution-id.cloudfront.net
```

## 8. Troubleshooting

### Build Failures

```bash
# Test build locally
npm run build
```

### AWS Permission Issues

- Verify IAM policy includes all required S3 actions
- Check bucket name matches exactly
- Ensure bucket policy allows public read access

### Deployment Issues

```bash
# Test AWS credentials
aws s3 ls s3://venue-maps-bucket-1234567890

# Manual sync
aws s3 sync ./dist/ s3://venue-maps-bucket-1234567890 --delete
```

## 9. Security Best Practices

- ✅ Use least-privilege IAM policies
- ✅ Store sensitive data in GitHub Secrets
- ✅ Enable CloudFront for HTTPS and better security
- ✅ Regularly rotate access keys
- ✅ Monitor CloudWatch logs for unusual activity

## 10. Cost Optimization

- Use S3 Intelligent Tiering for infrequent access
- Enable CloudFront compression
- Set up lifecycle policies for old versions
- Monitor S3 storage costs in AWS Console
