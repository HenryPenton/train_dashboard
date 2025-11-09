import { createStore } from "zustand/vanilla";

export type BestRoute = {
  origin: string;
  originNaPTANOrATCO: string;
  destination: string;
  destinationNaPTANOrATCO: string;
};

export type DepartureConfig = {
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
};

export type ConfigType = {
  tfl_best_routes: BestRoute[];
  rail_departures: DepartureConfig[];
  show_tfl_lines: boolean;
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
  setRefreshTimer: (timer: number) => void;
  setShowTflLines: (show: boolean) => void;
  saveConfig: () => Promise<boolean>;
  removeRoute: (index: number) => void;
  removeDeparture: (index: number) => void;
};

export type ConfigStore = ConfigState & ConfigActions;

export const initConfigStore = (): ConfigState => {
  return {
    config: {
      tfl_best_routes: [],
      rail_departures: [],
      show_tfl_lines: false,
      refresh_timer: 60,
    },
    lastRefreshTimeStamp: "",
  };
};

export const defaultInitState: ConfigState = {
  config: {
    tfl_best_routes: [],
    rail_departures: [],
    show_tfl_lines: false,
    refresh_timer: 60,
  },
  lastRefreshTimeStamp: "",
};

export const createConfigStore = (
  initState: ConfigState = defaultInitState,
) => {
  return createStore<ConfigStore>()((set, get) => ({
    ...initState,
    fetchConfig: async () => {
      const res = await fetch("/api/config");
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
    saveConfig: async () => {
      const currentConfig = get().config;

      try {
        const res = await fetch("/api/config", {
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
  }));
};
