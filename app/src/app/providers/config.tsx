"use client";

import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useStore } from "zustand";

import {
  type ConfigStore,
  createConfigStore,
  initConfigStore,
} from "../stores/config";

export type ConfigStoreApi = ReturnType<typeof createConfigStore>;

export const ConfigStoreContext = createContext<ConfigStoreApi | undefined>(
  undefined,
);

export interface ConfigStoreProviderProps {
  children: ReactNode;
}

export const THEME_STORAGE_KEY = "theme";

/**
 * Applies the configured theme to <html data-theme>. Waits until the config has
 * actually been fetched so the cached theme (set early by the inline script in
 * layout.tsx) is not overwritten by the default while loading.
 */
const ThemeApplier = ({ store }: { store: ConfigStoreApi }) => {
  const theme = useStore(store, (s) => s.config.theme);
  const loaded = useStore(store, (s) => s.lastRefreshTimeStamp !== "");

  useEffect(() => {
    if (!loaded) return;
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* storage unavailable */
    }
  }, [theme, loaded]);

  return null;
};

export const ConfigStoreProvider = ({ children }: ConfigStoreProviderProps) => {
  const store = useMemo(() => createConfigStore(initConfigStore()), []);

  return (
    <ConfigStoreContext.Provider value={store}>
      <ThemeApplier store={store} />
      {children}
    </ConfigStoreContext.Provider>
  );
};

export const useConfigStore = <T,>(selector: (store: ConfigStore) => T): T => {
  const configStoreContext = useContext(ConfigStoreContext);

  if (!configStoreContext) {
    throw new Error(`useConfigStore must be used within ConfigStoreProvider`);
  }

  return useStore(configStoreContext, selector);
};
