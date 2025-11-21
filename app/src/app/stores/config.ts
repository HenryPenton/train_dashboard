import { createStore } from "zustand/vanilla";
import { APP_CONSTANTS } from "../constants/app";

export type BestRoute = {
  origin: string;
  originNaPTANOrATCO: string;
  destination: string;
  destinationNaPTANOrATCO: string;
  importance: number;
};

export type DepartureConfig = {
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  importance: number;
};

export type TubeDeparture = {
  stationName: string;
  stationId: string;
  importance: number;
};

export type TflLineStatusConfig = {
  enabled: boolean;
  importance: number;
};

export type ConfigType = {
  tfl_best_routes: BestRoute[];
  rail_departures: DepartureConfig[];
  tube_departures: TubeDeparture[];
  tfl_line_status: TflLineStatusConfig;
  refresh_timer: number;
};

export type ConfigState = {
  config: ConfigType;
  lastRefreshTimeStamp: string;
};

export type ConfigActions = {
  fetchConfig: () => Promise<void>;
  forceRefresh: () => Promise<void>;
  addDeparture: (departure: DepartureConfig) => void;
  addRoute: (route: BestRoute) => void;
  addTubeDeparture: (tubeDeparture: TubeDeparture) => void;
  setRefreshTimer: (timer: number) => void;
  setShowTflLines: (show: boolean) => void;
  updateTflLineStatusImportance: (importance: number) => void;
  setTflLineStatusEnabled: (enabled: boolean) => void;
  saveConfig: () => Promise<boolean>;
  removeRoute: (index: number) => void;
  removeDeparture: (index: number) => void;
  removeTubeDeparture: (index: number) => void;
  updateRouteImportance: (index: number, importance: number) => void;
  updateDepartureImportance: (index: number, importance: number) => void;
  updateTubeDepartureImportance: (index: number, importance: number) => void;
};

export type ConfigStore = ConfigState & ConfigActions;

export const initConfigStore = (): ConfigState => {
  return {
    config: {
      tfl_best_routes: [],
      rail_departures: [],
      tube_departures: [],
      tfl_line_status: { enabled: false, importance: 1 },
      refresh_timer: APP_CONSTANTS.DEFAULT_REFRESH_TIMER,
    },
    lastRefreshTimeStamp: "",
  };
};

export const defaultInitState: ConfigState = {
  config: {
    tfl_best_routes: [],
    rail_departures: [],
    tube_departures: [],
    tfl_line_status: { enabled: false, importance: 1 },
    refresh_timer: APP_CONSTANTS.DEFAULT_REFRESH_TIMER,
  },
  lastRefreshTimeStamp: "",
};

export const createConfigStore = (
  initState: ConfigState = defaultInitState,
) => {
  return createStore<ConfigStore>()((set, get) => ({
    ...initState,
    fetchConfig: async () => {
      const res = await fetch(APP_CONSTANTS.API_ENDPOINTS.CONFIG);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const config = await res.json();

      set(() => ({
        config,
        lastRefreshTimeStamp: new Date().toISOString(),
      }));
    },
    forceRefresh: async () => {
      set(() => ({
        lastRefreshTimeStamp: new Date().toISOString(),
      }));
    },
    addDeparture: (departure: DepartureConfig) => {
      set((state) => {
        return {
          config: {
            ...structuredClone(state.config),
            rail_departures: [...state.config.rail_departures, departure],
          },
        };
      });
    },
    addRoute: (route: BestRoute) => {
      set((state) => {
        return {
          config: {
            ...structuredClone(state.config),
            tfl_best_routes: [...state.config.tfl_best_routes, route],
          },
        };
      });
    },
    addTubeDeparture: (tubeDeparture: TubeDeparture) => {
      set((state) => {
        return {
          config: {
            ...structuredClone(state.config),
            tube_departures: [...state.config.tube_departures, tubeDeparture],
          },
        };
      });
    },
    setRefreshTimer: (timer: number) => {
      set((state) => {
        return {
          config: {
            ...structuredClone(state.config),
            refresh_timer: timer,
          },
        };
      });
    },
    setShowTflLines: (show: boolean) => {
      set((state) => {
        return {
          config: {
            ...structuredClone(state.config),
            show_tfl_lines: show,
          },
        };
      });
    },
    updateTflLineStatusImportance: (importance: number) => {
      set((state) => {
        return {
          config: {
            ...structuredClone(state.config),
            tfl_line_status: {
              ...state.config.tfl_line_status,
              importance,
            },
          },
        };
      });
    },
    setTflLineStatusEnabled: (enabled: boolean) => {
      set((state) => {
        return {
          config: {
            ...structuredClone(state.config),
            tfl_line_status: {
              ...state.config.tfl_line_status,
              enabled,
            },
          },
        };
      });
    },
    saveConfig: async () => {
      const currentConfig = get().config;

      try {
        const res = await fetch(APP_CONSTANTS.API_ENDPOINTS.CONFIG, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentConfig),
        });
        if (res.ok) {
          // Optionally update state if needed
          return true;
        } else {
          return false;
        }
      } catch {
        return false;
      }
    },
    removeRoute: (index: number) => {
      set((state) => {
        return {
          config: {
            ...structuredClone(state.config),
            tfl_best_routes: state.config.tfl_best_routes.filter(
              (_, i) => i !== index,
            ),
          },
        };
      });
    },
    removeDeparture: (index: number) => {
      set((state) => {
        return {
          config: {
            ...structuredClone(state.config),
            rail_departures: state.config.rail_departures.filter(
              (_, i) => i !== index,
            ),
          },
        };
      });
    },
    removeTubeDeparture: (index: number) => {
      set((state) => {
        return {
          config: {
            ...structuredClone(state.config),
            tube_departures: state.config.tube_departures.filter(
              (_, i) => i !== index,
            ),
          },
        };
      });
    },
    updateRouteImportance: (index: number, importance: number) => {
      set((state) => {
        const updatedRoutes = [...state.config.tfl_best_routes];
        if (updatedRoutes[index]) {
          updatedRoutes[index] = { ...updatedRoutes[index], importance };
        }
        return {
          config: {
            ...structuredClone(state.config),
            tfl_best_routes: updatedRoutes,
          },
        };
      });
    },
    updateDepartureImportance: (index: number, importance: number) => {
      set((state) => {
        const updatedDepartures = [...state.config.rail_departures];
        if (updatedDepartures[index]) {
          updatedDepartures[index] = {
            ...updatedDepartures[index],
            importance,
          };
        }
        return {
          config: {
            ...structuredClone(state.config),
            rail_departures: updatedDepartures,
          },
        };
      });
    },
    updateTubeDepartureImportance: (index: number, importance: number) => {
      set((state) => {
        const updatedTubeDepartures = [...state.config.tube_departures];
        if (updatedTubeDepartures[index]) {
          updatedTubeDepartures[index] = {
            ...updatedTubeDepartures[index],
            importance,
          };
        }
        return {
          config: {
            ...structuredClone(state.config),
            tube_departures: updatedTubeDepartures,
          },
        };
      });
    },
  }));
};
