# Variables
COMPOSE_DEV_FILES := -f docker-compose.yml -f docker-compose.dev.yml

# Terraform Directory
TERRAFORM_DIRECTORY = ./.deploy/terraform

# Default target
.DEFAULT_GOAL := help

# Targets
.PHONY: help build up down up-dev pytest init-terraform apply apply-resource destroy destory-resource init-gcp-apis terraform-refresh

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Build Docker images using docker-compose
	docker compose build

up: ## Start containers in detached mode (recreates containers)
	docker compose up -d --force-recreate

down: ## Stop and remove containers, networks, and volumes
	docker compose down

up-dev: ## Start containers using dev override compose file
	docker compose $(COMPOSE_DEV_FILES) up -d --force-recreate

pytest: ## Run pytest
	PYTHONPATH=. pdm run pytest -v -ra src/saas_backend/tests

init-terraform: ## Init terraform 
	./.scripts/init-terraform.sh

apply: ## Terraform apply
	terraform -chdir=$(TERRAFORM_DIRECTORY) apply

apply-resource: ## Terraform apply (with target)
	terraform -chdir=$(TERRAFORM_DIRECTORY) apply -target=$(target)

apply-resource: ## Terraform apply (with target)
	terraform -chdir=$(TERRAFORM_DIRECTORY) apply -target=$(target)

destroy: ## Terraform destroy
	terraform -chdir=$(TERRAFORM_DIRECTORY) destroy

destroy-resource: ## Terraform destroy a specific resource
	terraform -chdir=$(TERRAFORM_DIRECTORY) destroy -target=$(resource)

terraform-refresh: ## Refresh Terraform Resources
	terraform -chdir=$(TERRAFORM_DIRECTORY) refresh

init-gcp-apis: ## Initialize GCP APIs
	./.scripts/init-gcp-apis.sh project_id=$(project_id)



