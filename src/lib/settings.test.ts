import { beforeEach, describe, expect, it } from "vitest";
import { defaultSettings, loadSettings, saveSettings } from "@/lib/settings";

describe("loadSettings", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null when nothing is stored", () => {
    expect(loadSettings()).toBeNull();
  });

  it("round-trips a value saved with saveSettings", () => {
    const custom = { levelMinutes: 15, smallBlinds: [50, 100, 200] };
    saveSettings(custom);
    expect(loadSettings()).toEqual(custom);
  });

  it("rejects malformed JSON", () => {
    localStorage.setItem("poker-timer:settings", "not json");
    expect(loadSettings()).toBeNull();
  });

  it("rejects a non-integer levelMinutes", () => {
    localStorage.setItem(
      "poker-timer:settings",
      JSON.stringify({ levelMinutes: 10.5, smallBlinds: [100] }),
    );
    expect(loadSettings()).toBeNull();
  });

  it("rejects a levelMinutes below 1", () => {
    localStorage.setItem(
      "poker-timer:settings",
      JSON.stringify({ levelMinutes: 0, smallBlinds: [100] }),
    );
    expect(loadSettings()).toBeNull();
  });

  it("rejects an empty smallBlinds schedule", () => {
    localStorage.setItem(
      "poker-timer:settings",
      JSON.stringify({ levelMinutes: 10, smallBlinds: [] }),
    );
    expect(loadSettings()).toBeNull();
  });

  it("rejects a smallBlinds entry below 1", () => {
    localStorage.setItem(
      "poker-timer:settings",
      JSON.stringify({ levelMinutes: 10, smallBlinds: [100, 0] }),
    );
    expect(loadSettings()).toBeNull();
  });
});

describe("defaultSettings", () => {
  it("has one small blind entry per level", () => {
    expect(defaultSettings.smallBlinds.length).toBeGreaterThan(0);
    expect(defaultSettings.levelMinutes).toBeGreaterThan(0);
  });
});
