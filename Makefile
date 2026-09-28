.PHONY: install db db-down etl api fe test lint format ci

install:
	uv sync --all-extras
	cd frontend && pnpm install

db:
	docker compose -f infra/docker-compose.yml up -d

db-down:
	docker compose -f infra/docker-compose.yml down

etl:
	cd etl && uv run python -m pipelines.flows

api:
	cd api && uv run uvicorn src.main:app --reload --port 8000

fe:
	cd frontend && pnpm dev

test:
	uv run pytest etl/tests api/tests

lint:
	uv run ruff check .

format:
	uv run ruff format .

ci: lint test
	@echo "CI local pasado"
