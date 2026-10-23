FROM python:3.14-slim AS build
RUN python -m venv /venv && \
    /venv/bin/pip install --upgrade pip setuptools wheel

# Build the virtualenv as a separate step: Only re-execute this step when requirements-lock.txt changes
FROM build AS build-venv
COPY requirements-lock.txt /requirements-lock.txt
RUN /venv/bin/pip install --disable-pip-version-check -r /requirements-lock.txt

# Copy the virtualenv into the runtime image (same Python as the build stage)
FROM python:3.14-slim
COPY --from=build-venv /venv /venv
COPY . /app
WORKDIR /app

ENTRYPOINT ["/venv/bin/python", "-m", "src.main"]