# # Use official Python Alpine image
# FROM python:3.11-alpine

# # Set environment variables
# ENV PYTHONDONTWRITEBYTECODE=1 \
#     PYTHONUNBUFFERED=1

# # Set work directory
# WORKDIR /app

# # Install system dependencies
# RUN apk update && apk upgrade


# # Create and activate venv, then install pip dependencies
# COPY requirements.txt ./
# RUN python -m venv /venv \
#     && /venv/bin/pip install --no-cache-dir --upgrade pip \
#     && /venv/bin/pip install --no-cache-dir -r requirements.txt

# # Copy project
# COPY . .

# # Expose port
# EXPOSE 8000

# # Run the FastAPI app with uvicorn from the venv
# CMD ["/venv/bin/uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# Build a virtualenv using the appropriate Debian release
# * Install python3-venv for the built-in Python3 venv module (not installed by default)
# * Install gcc libpython3-dev to compile C Python modules
# * In the virtualenv: Update pip setuputils and wheel to support building new packages
FROM debian:12-slim AS build
RUN apt-get update && \
    apt-get install --no-install-suggests --no-install-recommends --yes python3-venv gcc libpython3-dev && \
    python3 -m venv /venv && \
    /venv/bin/pip install --upgrade pip setuptools wheel

# Build the virtualenv as a separate step: Only re-execute this step when requirements.txt changes
FROM build AS build-venv
COPY requirements.txt /requirements.txt
RUN /venv/bin/pip install --disable-pip-version-check -r /requirements.txt

# Copy the virtualenv into a distroless image
FROM gcr.io/distroless/python3-debian12
COPY --from=build-venv /venv /venv
COPY . /app
WORKDIR /app
EXPOSE 8000

ENTRYPOINT ["/venv/bin/uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]