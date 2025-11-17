export const APP_CONSTANTS = {
  MAX_DEPARTURES: 10,
  DEFAULT_REFRESH_TIMER: 60,
  API_ENDPOINTS: {
    CONFIG: '/api/config',
    LINE_STATUS: '/api/line-status',
    DEPARTURES: (from: string, to: string) => `/api/departures/${from}/to/${to}`,
    BEST_ROUTE: (from: string, to: string) => `/api/best-route/${from}/${to}`,
  },
  ERROR_MESSAGES: {
    FETCH_FAILED: 'Failed to fetch data',
    NO_SERVICES: 'Could not find any services for the configured route.',
    UNKNOWN_ERROR: 'Unknown error occurred',
  },
} as const;