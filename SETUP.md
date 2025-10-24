# Train Dashboard Setup Guide

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

## 2. Environment Variables

- List required variables and their purpose in `.env`.
- Example:
  ```env
  RTT_API_USER=your_rtt_user
  RTT_API_PASS=your_rtt_pass
  APP_URL=http://localhost:3000
  SERVER_URL=http://localhost:8000
  ```

## 3. Start the Example Docker Compose

- Copy `.env.example` to `.env` and fill in the required values.
- Run:
  ```sh
  docker compose up -d
  ```
- Check logs:
  ```sh
  docker compose logs -f
  ```

## 4. Configure Application Settings

- Access the app at [http://localhost:3000](http://localhost:3000).
- Go to the settings page.

---

## Additional Sections

### Troubleshooting

- **Port conflicts:** Make sure ports 3000 and 8000 are free.
- **Missing dependencies:** Ensure Docker and Docker Compose are installed.

### Updating Images

- To pull the latest stable images:
  ```sh
  docker compose pull
  docker compose up -d
  ```
