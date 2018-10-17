#!/bin/bash

set -ev

fail() {
  echo "FAIL: $*"
  exit 1
}

S3_BUCKET_NAME=$SERVICE-$ACCOUNT_NAME-$AWS_DEFAULT_REGION

upload_to_s3() {
    echo "Uploading to S3: destination"
    echo $S3_BUCKET_NAME

    aws s3 cp service-worker "s3:/${S3_BUCKET_NAME}/service-worker/" --recursive --cache-control "max-age=60" --acl public-read
}

upload_to_s3