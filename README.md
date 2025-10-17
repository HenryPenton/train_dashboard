# Travel Dashboard

A full-stack web application for live train and tube status, route planning, and departures, built with Next.js (frontend) and FastAPI (backend).

## Overview

- **Frontend (app/):**
  - Built with Next.js, React, and Tailwind CSS
  - Responsive dashboard UI for train departures, tube line status, and best route suggestions
  - Fetches live data from the FastAPI backend

- **Backend (api/):**
  - Built with FastAPI (Python)
  - Modular endpoints for train departures, tube line status, best route
  - Integrates with Real Time Trains and TFL APIs
  - Returns simplified, frontend-friendly JSON responses

## Features

- Live train departures and delays
- Tube line status updates
- Best route suggestions using TFL Journey Planner
- Config endpoint for frontend settings
- Responsive, retro-inspired UI
- Multi-arch Docker builds and CI/CD via GitHub Actions

## Project Structure

```
train_dashboard/
├── app/         # Next.js frontend
├── api/         # FastAPI backend
├── .github/     # CI/CD workflows
├── docker-compose.yaml
├── README.md    # Project documentation
```

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/HenryPenton/train_dashboard.git
   cd train_dashboard
   ```

2. **Run with Docker Compose:**
   ```sh
   docker-compose up --build
   ```
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000

3. **Manual Development:**
   - Frontend: `cd app && pnpm install && pnpm dev`
   - Backend: `cd api && pip install -r requirements.txt && uvicorn main:app`

## API Endpoints

- `/departures/{station_code}`: Get train departures
- `/departures/{station_code}/{destination_tiploc}`: Get filtered departures
- `/tfl/line-status`: Get tube line status
- `/tfl/best-route/{from_station}/{to_station}`: Get best route
- `/config`: Get config JSON

## Frontend Routes

- `/`: Main dashboard
- `/api/*`: Next.js API routes (proxy to backend)

## CI/CD

- Multi-arch Docker builds for both frontend and backend
- Automated builds and pushes via GitHub Actions

## License

MIT
