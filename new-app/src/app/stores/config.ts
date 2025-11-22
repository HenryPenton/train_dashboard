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
  forceRefresh: () => void;
  addRoute: (route: Omit<BestRoute, "importance">) => void;
  addDeparture: (departure: Omit<DepartureConfig, "importance">) => void;
  addTubeDeparture: (departure: Omit<TubeDeparture, "importance">) => void;
  removeRoute: (index: number) => void;
  removeDeparture: (index: number) => void;
  removeTubeDeparture: (index: number) => void;
  updateRouteImportance: (index: number, importance: number) => void;
  updateDepartureImportance: (index: number, importance: number) => void;
  updateTubeDepartureImportance: (index: number, importance: number) => void;
  updateTflLineStatusImportance: (importance: number) => void;
  setTflLineStatusEnabled: (enabled: boolean) => void;
  setRefreshTimer: (timer: number) => void;
  saveConfig: () => Promise<void>;
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
      try {
        const res = await fetch(APP_CONSTANTS.API_ENDPOINTS.CONFIG);
        if (!res.ok) throw new Error("Failed to fetch config");
        const config = await res.json();
        set({ 
          config,
          lastRefreshTimeStamp: new Date().toISOString()
        });
      } catch (error) {
        console.error("Failed to fetch config:", error);
      }
    },
    forceRefresh: () => {
      const { fetchConfig } = get();
      fetchConfig();
    },
    addRoute: (route) => {
      const state = get();
      const newRoute = { ...route, importance: 1 };
      set({
        config: {
          ...state.config,
          tfl_best_routes: [...state.config.tfl_best_routes, newRoute],
        },
      });
    },
    addDeparture: (departure) => {
      const state = get();
      const newDeparture = { ...departure, importance: 1 };
      set({
        config: {
          ...state.config,
          rail_departures: [...state.config.rail_departures, newDeparture],
        },
      });
    },
    addTubeDeparture: (departure) => {
      const state = get();
      const newDeparture = { ...departure, importance: 1 };
      set({
        config: {
          ...state.config,
          tube_departures: [...state.config.tube_departures, newDeparture],
        },
      });
    },
    removeRoute: (index) => {
      const state = get();
      const routes = [...state.config.tfl_best_routes];
      routes.splice(index, 1);
      set({
        config: {
          ...state.config,
          tfl_best_routes: routes,
        },
      });
    },
    removeDeparture: (index) => {
      const state = get();
      const departures = [...state.config.rail_departures];
      departures.splice(index, 1);
      set({
        config: {
          ...state.config,
          rail_departures: departures,
        },
      });
    },
    removeTubeDeparture: (index) => {
      const state = get();
      const departures = [...state.config.tube_departures];
      departures.splice(index, 1);
      set({
        config: {
          ...state.config,
          tube_departures: departures,
        },
      });
    },
    updateRouteImportance: (index, importance) => {
      const state = get();
      const routes = [...state.config.tfl_best_routes];
      routes[index] = { ...routes[index], importance };
      set({
        config: {
          ...state.config,
          tfl_best_routes: routes,
        },
      });
    },
    updateDepartureImportance: (index, importance) => {
      const state = get();
      const departures = [...state.config.rail_departures];
      departures[index] = { ...departures[index], importance };
      set({
        config: {
          ...state.config,
          rail_departures: departures,
        },
      });
    },
    updateTubeDepartureImportance: (index, importance) => {
      const state = get();
      const departures = [...state.config.tube_departures];
      departures[index] = { ...departures[index], importance };
      set({
        config: {
          ...state.config,
          tube_departures: departures,
        },
      });
    },
    updateTflLineStatusImportance: (importance) => {
      const state = get();
      set({
        config: {
          ...state.config,
          tfl_line_status: { ...state.config.tfl_line_status, importance },
        },
      });
    },
    setTflLineStatusEnabled: (enabled) => {
      const state = get();
      set({
        config: {
          ...state.config,
          tfl_line_status: { ...state.config.tfl_line_status, enabled },
        },
      });
    },
    setRefreshTimer: (timer) => {
      const state = get();
      set({
        config: {
          ...state.config,
          refresh_timer: timer,
        },
      });
    },
    saveConfig: async () => {
      const state = get();
      try {
        const res = await fetch(APP_CONSTANTS.API_ENDPOINTS.CONFIG, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(state.config),
        });
        if (!res.ok) throw new Error("Failed to save config");
      } catch (error) {
        console.error("Failed to save config:", error);
      }
    },
  }));
};
