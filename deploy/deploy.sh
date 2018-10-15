#!/bin/bash

set -ev

fail() {
  echo "FAIL: $*"
  exit 1
}

upload_to_s3() {
    echo "Uploading to S3"

    aws --region "eu-west-1" s3 cp dist "s3://???/${SERVICE}/${BRANCH}/latest/" --recursive --exclude "*.html" --cache-control "max-age=2592000" --acl public-read
    aws --region "eu-west-1" s3 cp dist "s3://???/${SERVICE}/${BRANCH}/latest/" --recursive --exclude "*" --include "*.html" --cache-control "max-age=300" --acl public-read

    aws --region "eu-west-1" s3 cp dist "s3://???/${SERVICE}/" --recursive --exclude "*" --include "*-fragment.html" --cache-control "max-age=300" --acl public-read
}

upload_to_s3