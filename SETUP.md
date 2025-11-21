# Train Dashboard Setup Guide

## Prerequisites

- **Docker** and **Docker Compose** installed on your system
- **Real Time Trains API credentials** (free at [https://www.realtimetrains.co.uk/about/developer/](https://www.realtimetrains.co.uk/about/developer/))
- Ports **3000** (frontend) and **8000** (API) available on your system

## 1. Choose Between Docker Volume and Bind Mount

- **Bind Mount:**
  - Easier to back up, but potentially a little harder to set up.
  - Syncs a local folder with the container for live changes.
  - Example in `docker-compose.yaml`:
    ```yaml
    volumes:
      - ./config:/app/config:rw
    ```
- **Docker Volume:**
  - Easier to set up, harder to back up. If your configuration is simple, then re-configuring shouldn't be too much work.
  - Persists data independently of the local filesystem.
  - Example:
    ```yaml
    volumes:
      - train_dashboard_data:/app/data
    ```
  - Define the volume at the bottom of your compose file:
    ```yaml
    volumes:
      train_dashboard_data:
    ```

## 2. Environment Configuration

### Required Environment Variables

Copy `.env.template` to `.env` and configure the following required variables:

```env
# Required: Real Time Trains API credentials
RTT_API_USER=your_rtt_username
RTT_API_PASS=your_rtt_password

# Configured for Docker
SERVER_URL=http://train_dashboard_api:8000
APP_URL=http://train_dashboard_app:3000
```

### Optional Push Notification Variables

For push notifications via [ntfy.sh](https://ntfy.sh) (optional but recommended):

```env
# NTFY topic names (use random strings for security)
RAIL_TOPIC=some-random-string
BEST_ROUTE_TOPIC=some-random-string
LINE_STATUS_TOPIC=some-random-string

# Schedule refresh interval in seconds (default: 300)
SCHEDULE_REFRESH_INTERVAL=300

# Push service logging level (default: INFO)
# Options: DEBUG, INFO, WARNING, ERROR, CRITICAL
PUSH_LOG_LEVEL=INFO

# Optional: Custom NTFY server (leave empty for default ntfy.sh)
NTFY_SERVER=
```

> **Security Note:** Use random, unguessable topic names when using the public ntfy.sh service to prevent unauthorized access to your notifications.

> **Get API Keys:** Real Time Trains API keys are free at [https://www.realtimetrains.co.uk/about/developer/](https://www.realtimetrains.co.uk/about/developer/)

## 3. Quick Start with Docker

1. **Download the Docker Compose file:**

   ```sh
   # Create a directory for your train dashboard
   mkdir train-dashboard && cd train-dashboard

   # Download docker-compose.yaml
   curl -O https://raw.githubusercontent.com/HenryPenton/train_dashboard/main/docker-compose.yaml
   ```

2. **Create environment file:**

   ```sh
   # Download the environment template
   curl -O https://raw.githubusercontent.com/HenryPenton/train_dashboard/main/.env.template

   # Copy and edit with your API credentials
   cp .env.template .env
   # Edit .env with your Real Time Trains API credentials
   ```

3. **Create config directory:**

   ```sh
   mkdir config
   ```

4. **Start all services:**

   ```sh
   docker compose up -d
   ```

5. **Verify startup:**

   ```sh
   # Check all containers are running
   docker compose ps

   # View logs (optional)
   docker compose logs -f
   ```

6. **Access the application:**
   - **Dashboard:** [http://localhost:3000](http://localhost:3000)
   - **API Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)

## 4. Push Notifications Setup (Optional)

The push notification server provides real-time alerts for scheduled journeys via [ntfy.sh](https://ntfy.sh).

### Enable Push Notifications

1. **Configure notification topics** in your `.env` file:

   ```env
   # Generate random topic names for security
   RAIL_TOPIC=some-random-string
   BEST_ROUTE_TOPIC=some-random-string
   LINE_STATUS_TOPIC=some-random-string
   ```

2. **Subscribe to notifications:**

   - Visit [ntfy.sh](https://ntfy.sh) or install the mobile app
   - Subscribe to your random topic names from your `.env` file

3. **Set up scheduled alerts:**
   - Go to [http://localhost:3000/schedules](http://localhost:3000/schedules)
   - Create scheduled journey alerts with custom timing

### Timezone Configuration

Set your timezone in `docker-compose.yaml`:

```yaml
environment:
  - TZ=Europe/London # Change to your timezone
```

---

## 5. Application Configuration

### Initial Setup

1. **Access the dashboard:** [http://localhost:3000](http://localhost:3000)
2. **Configure your preferences:**
   - Add frequently used stations
   - Set up scheduled journeys

---

## Additional Sections

### Troubleshooting

**API Connection Issues:**

- Verify Real Time Trains API credentials in `.env`
- Check API status at [https://www.realtimetrains.co.uk/about/developer/](https://www.realtimetrains.co.uk/about/developer/)
- View API logs: `docker compose logs api`

**Container Issues:**

```sh
# Restart all services
docker compose down && docker compose up -d

```

### Updating to Latest Version

```sh
# Pull latest images and restart
docker compose pull
docker compose down
docker compose up -d
```
