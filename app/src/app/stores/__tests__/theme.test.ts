import { createConfigStore, initConfigStore } from "../config";

describe("config store theme", () => {
  it("defaults to dark and can be changed", () => {
    const store = createConfigStore(initConfigStore());
    expect(store.getState().config.theme).toBe("dark");
    store.getState().setTheme("retro");
    expect(store.getState().config.theme).toBe("retro");
  });

  it("falls back to dark when fetched config has no valid theme", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ refresh_timer: 60 }),
    }) as unknown as typeof fetch;
    const store = createConfigStore(initConfigStore());
    await store.getState().fetchConfig();
    expect(store.getState().config.theme).toBe("dark");
  });
});
