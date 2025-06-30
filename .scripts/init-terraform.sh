#!/usr/bin/env bash

# Extract values from terraform.tfvars using grep/awk
STATE_BUCKET=$(grep 'state_bucket' ./.deploy/terraform/terraform.tfvars | awk -F\" '{print $2}')
STATE_PREFIX=$(grep 'state_prefix' ./.deploy/terraform/terraform.tfvars | awk -F\" '{print $2}')

echo "Initializing Terraform with State Bucket: $STATE_BUCKET at prefix: $STATE_PREFIX"

cd ./.deploy/terraform && terraform init \
  -backend-config="bucket=${STATE_BUCKET}" \
  -backend-config="prefix=${STATE_PREFIX}"
