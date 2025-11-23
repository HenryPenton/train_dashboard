export const APP_CONSTANTS = {
  MAX_DEPARTURES: 10,
  DEFAULT_REFRESH_TIMER: 60,
  API_ENDPOINTS: {
    CONFIG: "/api/config",
    LINE_STATUS: "/api/line-status",
    ARRIVALS: (stationId: string) => `/api/arrivals/${stationId}`,
    DEPARTURES: (from: string, to: string) =>
      `/api/departures/${from}/to/${to}`,
    BEST_ROUTE: (from: string, to: string) => `/api/best-route/${from}/${to}`,
    SCHEDULES: "/api/schedules",
    TFL_STATION_CODES: "/api/tfl/station-codes",
  },
  ERROR_MESSAGES: {
    FETCH_FAILED: "Failed to fetch data",
    NO_SERVICES: (from: string, to: string) => `Could not find any services between ${from} and ${to}.`,
    UNKNOWN_ERROR: "Unknown error occurred",
  },
} as const;
