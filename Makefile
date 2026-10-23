.DEFAULT_GOAL := help

.PHONY: dev-up dev-down help install dev-app dev-api dev-push test test-app test-api test-push \
        lint format docker-build up down logs clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies for app (pnpm) and api/push (uv)
	pnpm --dir app install
	uv sync --project api
	uv sync --project push

dev-app: ## Run the Next.js dev server
	pnpm --dir app dev

dev-api: ## Run the FastAPI dev server
	cd api && uv run fastapi dev src/main.py

dev-push: ## Run the push server
	cd push && uv run python -m src.main

test: test-app test-api test-push ## Run all tests

test-app: ## Run app tests (jest)
	pnpm --dir app test

test-api: ## Run api tests (pytest)
	cd api && uv run pytest

test-push: ## Run push tests (pytest)
	cd push && uv run pytest

lint: ## Lint the app
	pnpm --dir app lint

format: ## Format the app (prettier)
	pnpm --dir app format

docker-build: ## Build the app, api and push docker images
	docker build -t train-dashboard-app ./app
	docker build -t train-dashboard-api ./api
	docker build -t train-dashboard-push ./push

up: ## Start services with docker compose
	docker compose up -d

down: ## Stop docker compose services
	docker compose down

logs: ## Tail docker compose logs
	docker compose logs -f

dev-up: ## Start the hot-reloading dev stack in docker
	docker compose -f docker-compose.dev.yaml up

dev-down: ## Stop the dev stack
	docker compose -f docker-compose.dev.yaml down

clean: ## Remove build artefacts, caches and virtualenvs
	rm -rf app/.next app/coverage api/.venv push/.venv api/htmlcov push/htmlcov
	rm -rf api/.pytest_cache push/.pytest_cache api/.coverage push/.coverage
	find api push -type d -name __pycache__ -prune -exec rm -rf {} +
