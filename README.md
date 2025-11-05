# Travel Dashboard# Travel Dashboard

THIS PROJECT IS UNDER VERY HEAVY DEVELOPMENT!

A full-stack application for live train and tube status, route planning, and departures, built with Next.js (frontend), FastAPI (backend), and a Python push server for notifications and background jobs.

---

![Dashboard Screenshot](Dashboard.png)

![Tube lines Screenshot](TubeLines.png)

## Overview

A full-stack application for live train and tube status, route planning, and departures, built with Next.js (frontend) and FastAPI (backend).

- **Frontend (`app/`):** Next.js, React, Tailwind CSS. Responsive dashboard UI for train departures, tube line status, and best route suggestions. Supports standalone and Docker deployment.

- **Backend (`api/`):** FastAPI (Python). Modular endpoints for train departures, tube line status, best route, and config. Integrates with Real Time Trains and TFL APIs. Uses dependency injection and abstract base classes for testability.## Overview

- **Push Server (`push/`):** Python service for notifications and background jobs (e.g., scheduled updates, alerts). Includes job scheduling, notification handling, formatters, and fetchers.

## Setup

See [SETUP.md](./SETUP.md) for detailed installation and configuration instructions.

## Project Structure

### Backend Structure Highlights- Responsive, retro-inspired UI

```
- `src/adapters/` - API adapters and routers
- `src/application/` - Service layer (DI)
- `src/domain/` - Business logic
- `src/DAOs/` - Data access objects
- `src/DTOs/` - Data transfer objects
- `src/test/` - Unit and integration tests
```

### Push Server Structure

```
- `src/main.py`: Entry point
- `src/jobs/`: Job scheduling and execution
- `src/ntfy/`: Notification handling
- `src/formatters/`: Output formatting
- `src/fetchers/`: External data fetchers
- `src/test/`: Unit tests
```

---

## Development - Getting Started

1. **Clone the repository:**

```sh
git clone https://github.com/HenryPenton/train_dashboard.git
cd train_dashboard
```

2. **Manual Development:**

- Frontend: `cd app && pnpm install && pnpm dev`
- Backend:

```sh
cd api
python3.14 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
fastapi dev src/main.py
```

- Push Server:

```sh
cd push
python3.14 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python src/main.py
```

3. **Usage:**

- Frontend: http://localhost:3000
- Backend: http://localhost:8000

- Push Server: runs background jobs and notifications (no default web port)

## Frontend Routes

- `/`: Main dashboard
- `/api/*`: Next.js API routes (proxy to backend)

## CI/CD

- Multi-arch Docker builds for both frontend and backend
- Automated builds and pushes via GitHub Actions

## Coverage Reports

Coverage reports for backend (Python) are generated in `api/htmlcov/` and for frontend (Next.js) in `app/coverage/`. Open `index.html` in these folders to view detailed coverage.

## Running Unit Tests

### Backend (FastAPI/Python)

Unit tests for the backend are written using `pytest`.

To run all backend tests:

```sh
cd api
pytest
```

You can run a specific test file:

```sh
pytest src/test/domain/rail/departures/departure_parts/test_departure_times.py
```

### Push Server (Python)

Unit tests for the push server are written using `pytest`.

To run all push server tests:

```sh
cd push
pytest
```

Coverage reports are generated in `push/htmlcov/`.

### Frontend (Next.js/React)

Unit tests for the frontend are written using Jest and React Testing Library.

To run all frontend tests:

```sh
cd app
pnpm test
```

You can run a specific test file:

```sh
pnpm test app/components/__tests__/TflBestRoute.test.tsx
```

Test coverage reports and watch mode are also available via Jest CLI options.

## License

MIT
