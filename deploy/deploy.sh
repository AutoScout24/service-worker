#!/bin/bash

set -ev

fail() {
  echo "FAIL: $*"
  exit 1
}

deploy() {
    echo "Cloudformation for bucket"
    aws cloudformation deploy --stack-name service-worker \
      --template-file deploy/stack.yaml \
      --no-fail-on-empty-changeset \
      --parameter-overrides "BucketName=$SERVICE_BUCKET_NAME" \
      --tags "UseCase=$USECASE" \
          "Segment=$SEGMENT" \
          "Team=$TEAM" \
          "Vertical=$VERTICAL" \
          "Service=$SERVICE"
    
    echo "Uploading to S3: destination"
    echo $SERVICE_BUCKET_NAME

    aws s3 cp service-worker "s3://${SERVICE_BUCKET_NAME}/service-worker/" --recursive --exclude "*" --include "*.html" --include "*.json" --include "*.js" --cache-control "max-age=60" --acl public-read

    aws s3 cp service-worker "s3://${SERVICE_BUCKET_NAME}/service-worker/" --recursive --exclude "*" --include "*.png" --cache-control "max-age=31536000" --acl public-read
}

deploy
