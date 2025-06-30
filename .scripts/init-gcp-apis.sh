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
