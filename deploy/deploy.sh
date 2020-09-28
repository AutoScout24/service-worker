#!/bin/bash

set -ev

fail() {
  echo "FAIL: $*"
  exit 1
}

upload_to_s3() {
    echo "Uploading to S3: destination"
    echo $SERVICE_BUCKET_NAME

    aws s3 cp service-worker "s3://${SERVICE_BUCKET_NAME}/" --recursive --exclude "*" --include "*.html" --include "*.json" --include "*.js" --cache-control "max-age=60" --acl public-read

    aws s3 cp service-worker "s3://${SERVICE_BUCKET_NAME}/" --recursive --exclude "*" --include "*.png" --cache-control "max-age=31536000" --acl public-read
}

upload_to_s3