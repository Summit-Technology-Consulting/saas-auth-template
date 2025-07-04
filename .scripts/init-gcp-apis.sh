#!/usr/bin/env bash

PROJECT_ID=""

# Loop over args and parse project_id=
for ARG in "$@"; do
  case $ARG in
    project_id=*)
      PROJECT_ID="${ARG#project_id=}"
      ;;
  esac
done

# Enable admin api
gcloud services enable run.googleapis.com --project=$PROJECT_ID

# Enable compute engine api
gcloud services enable compute.googleapis.com --project=$PROJECT_ID

# Enable serverless connector api 
gcloud services enable vpcaccess.googleapis.com --project=$PROJECT_ID

# Enable Service Networking
gcloud services enable servicenetworking.googleapis.com --project=$PROJECT_ID
