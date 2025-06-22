build:
	docker compose build

down:
	docker compose down

up:
	docker compose up -d --force-recreate

up-dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --force-recreate

