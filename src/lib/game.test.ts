import { beforeEach, describe, expect, it } from "vitest";
import { Settings } from "@/lib/settings";
import {
  dangerSeconds,
  deriveLevelState,
  loadGame,
  remainingSeconds,
  saveGame,
  validateGame,
} from "@/lib/game";

const settings: Settings = {
  levelMinutes: 10,
  smallBlinds: [100, 200, 300],
};

describe("remainingSeconds", () => {
  it("counts down to the deadline", () => {
    const now = 1_000_000;
    expect(remainingSeconds(now + 5_000, now)).toBe(5);
  });

  it("rounds up a partial second so the clock never shows 0 early", () => {
    const now = 1_000_000;
    expect(remainingSeconds(now + 4_200, now)).toBe(5);
  });

  it("never goes negative once the deadline has passed", () => {
    const now = 1_000_000;
    expect(remainingSeconds(now - 5_000, now)).toBe(0);
  });
});

describe("deriveLevelState", () => {
  it("derives the current and next small blind from the level", () => {
    const state = deriveLevelState(settings, 1, 600);
    expect(state.sb).toBe(100);
    expect(state.nextSb).toBe(200);
    expect(state.maxLevel).toBe(3);
    expect(state.levelSeconds).toBe(600);
  });

  it("reports no next blind on the last level", () => {
    const state = deriveLevelState(settings, 3, 600);
    expect(state.nextSb).toBeNull();
  });

  it("computes progress as the fraction of the level elapsed", () => {
    const state = deriveLevelState(settings, 1, 150);
    expect(state.progress).toBeCloseTo(0.75);
  });

  it("flags danger once time drops below the threshold", () => {
    expect(deriveLevelState(settings, 1, dangerSeconds).danger).toBe(false);
    expect(deriveLevelState(settings, 1, dangerSeconds - 1).danger).toBe(true);
  });
});

describe("validateGame", () => {
  it("accepts a game within range", () => {
    expect(validateGame(settings, { level: 2, remaining: 300 })).toEqual({
      level: 2,
      remaining: 300,
    });
  });

  it("rejects a level beyond the current schedule", () => {
    expect(validateGame(settings, { level: 4, remaining: 300 })).toBeNull();
  });

  it("rejects a level below 1", () => {
    expect(validateGame(settings, { level: 0, remaining: 300 })).toBeNull();
  });

  it("rejects remaining time greater than the level length", () => {
    expect(validateGame(settings, { level: 1, remaining: 601 })).toBeNull();
  });

  it("rejects non-object input", () => {
    expect(validateGame(settings, null)).toBeNull();
    expect(validateGame(settings, "nope")).toBeNull();
  });
});

describe("loadGame / saveGame", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null when nothing is stored", () => {
    expect(loadGame(settings)).toBeNull();
  });

  it("round-trips a game saved with saveGame", () => {
    saveGame({ level: 2, remaining: 120 });
    expect(loadGame(settings)).toEqual({ level: 2, remaining: 120 });
  });

  it("falls back to null when the saved level no longer fits the schedule", () => {
    saveGame({ level: 3, remaining: 120 });
    const shorterSchedule: Settings = { levelMinutes: 10, smallBlinds: [100] };
    expect(loadGame(shorterSchedule)).toBeNull();
  });
});
