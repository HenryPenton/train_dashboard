"use client";

import { type ReactNode, createContext, useContext, useMemo } from "react";
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

export const ConfigStoreProvider = ({ children }: ConfigStoreProviderProps) => {
  const store = useMemo(() => createConfigStore(initConfigStore()), []);

  return (
    <ConfigStoreContext.Provider value={store}>
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