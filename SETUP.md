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

- List required variables and their purpose in `.env` or in the docker compose file.
- Example:

  ```env
  RTT_API_USER=your_rtt_user
  RTT_API_PASS=your_rtt_pass
  APP_URL=http://localhost:3000
  SERVER_URL=http://localhost:8000
  # NTFY topic codes
  RAIL_TOPIC=
  BEST_ROUTE_TOPIC=
  LINE_STATUS_TOPIC=
  # How often (in seconds) the NTFY server checks for new schedules from the API
  SCHEDULE_REFRESH_INTERVAL=300
  ```

  Real time trains api keys can be obtained at https://www.realtimetrains.co.uk/about/developer/

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

## 4. (Optional) Set Up Push Notification Server

If you want to receive push notifications via [ntfy](https://ntfy.sh), you can set up the notification server. This is optional but recommended for real-time alerts.

1. **Run push notification server:**
   Add the push notification server listed under the docker compose. You can set how often new schedules are looked for, but if you don't this will be polled at a rate of once per minute by default.
2. **Configure the notification topics:**
   Add one or more topics to the environment for the new push server.
3. **Test notifications:**
   Visit the /schedules endpoint on the main dashboard to set up cron based push notification timings.

---

## 5. Configure Application Settings

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
