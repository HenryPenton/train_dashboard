FROM python:3.14-slim-bookworm AS build
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
ENV UV_PROJECT_ENVIRONMENT=/venv \
    UV_LINK_MODE=copy \
    UV_COMPILE_BYTECODE=1 \
    UV_PYTHON_DOWNLOADS=never

# Build the virtualenv as a separate step: only re-executed when pyproject.toml / uv.lock change
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project

# Copy the virtualenv into a slim runtime image (same Python version as the builder)
FROM python:3.14-slim-bookworm
COPY --from=build /venv /venv
COPY . /app
WORKDIR /app

ENTRYPOINT ["/venv/bin/python", "-m", "src.main"]
