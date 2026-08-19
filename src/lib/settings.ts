export type Settings = {
  levelMinutes: number;
  smallBlinds: number[]; // one entry per level; BB is always 2×SB
};

// The classic schedule this app has always shipped with:
// 100 × [1, 2, 3, 5, 10, 15, 20, 40, 80]
export const defaultSettings: Settings = {
  levelMinutes: 10,
  smallBlinds: [100, 200, 300, 500, 1000, 1500, 2000, 4000, 8000],
};

const SETTINGS_KEY = "poker-timer:settings";

export function loadSettings(): Settings | null {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      return null;
    }

    const { levelMinutes, smallBlinds } = parsed as Record<string, unknown>;
    if (!Number.isInteger(levelMinutes) || (levelMinutes as number) < 1) {
      return null;
    }
    if (
      !Array.isArray(smallBlinds) ||
      smallBlinds.length === 0 ||
      !smallBlinds.every((sb) => Number.isInteger(sb) && sb >= 1)
    ) {
      return null;
    }

    return {
      levelMinutes: levelMinutes as number,
      smallBlinds: smallBlinds as number[],
    };
  } catch {
    return null;
  }
}

export function saveSettings(settings: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
