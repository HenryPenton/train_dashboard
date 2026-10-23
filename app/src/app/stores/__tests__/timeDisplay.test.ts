import { createConfigStore, initConfigStore } from "../config";

describe("config store time display", () => {
  it("defaults to departure and can be changed", () => {
    const store = createConfigStore(initConfigStore());
    expect(store.getState().config.time_display).toBe("departure");
    store.getState().setTimeDisplay("arrival");
    expect(store.getState().config.time_display).toBe("arrival");
  });

  it("falls back to departure when fetched config has no valid value", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ refresh_timer: 60, time_display: "bogus" }),
    }) as unknown as typeof fetch;
    const store = createConfigStore(initConfigStore());
    await store.getState().fetchConfig();
    expect(store.getState().config.time_display).toBe("departure");
  });

  it("keeps a valid fetched value", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ refresh_timer: 60, time_display: "arrival" }),
    }) as unknown as typeof fetch;
    const store = createConfigStore(initConfigStore());
    await store.getState().fetchConfig();
    expect(store.getState().config.time_display).toBe("arrival");
  });
});
