# Variables
COMPOSE_DEV_FILES := -f docker-compose.yml -f docker-compose.dev.yml

# Default target
.DEFAULT_GOAL := help

# Targets
.PHONY: help build up down up-dev pytest

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



