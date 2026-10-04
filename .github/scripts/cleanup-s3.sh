#!/bin/bash
# Shell script to empty S3 bucket prior to SAM stack deletion

STACK_NAME="smartdoc-ai-dev"

# Retrieve S3 bucket name from CloudFormation stack outputs
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --query "Stacks[0].Outputs[?OutputKey=='S3BucketName'].OutputValue" \
  --output text 2>/dev/null)

if [ -n "$BUCKET_NAME" ] && [ "$BUCKET_NAME" != "None" ]; then
  echo "Emptying S3 Bucket: $BUCKET_NAME..."
  
  # Remove all current objects
  aws s3 rm "s3://$BUCKET_NAME" --recursive
  
  # Remove object versions and delete markers if versioning was active
  aws s3api delete-objects \
    --bucket "$BUCKET_NAME" \
    --delete "$(aws s3api list-object-versions --bucket "$BUCKET_NAME" --query '{Objects: Versions[].{Key:Key,VersionId:VersionId}}' --output json)" 2>/dev/null || true

  aws s3api delete-objects \
    --bucket "$BUCKET_NAME" \
    --delete "$(aws s3api list-object-versions --bucket "$BUCKET_NAME" --query '{Objects: DeleteMarkers[].{Key:Key,VersionId:VersionId}}' --output json)" 2>/dev/null || true

  echo "S3 Bucket emptied successfully."
else
  echo "No active S3 bucket found for stack $STACK_NAME."
fi