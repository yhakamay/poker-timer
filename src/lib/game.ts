import { Settings } from "@/lib/settings";

export type LevelState = {
  maxLevel: number;
  levelSeconds: number;
  sb: number;
  nextSb: number | null;
  progress: number;
  danger: boolean;
};

// How long before the end of a level the board switches to its alert look
export const dangerSeconds = 30;

// `sb`, `nextSb`, `maxLevel` etc. are fully determined by `settings` and the
// current level, so they're derived here rather than kept as separate state
export function deriveLevelState(settings: Settings, level: number, time: number): LevelState {
  const levelSeconds = settings.levelMinutes * 60;
  const maxLevel = settings.smallBlinds.length;
  const sb = settings.smallBlinds[level - 1];
  const nextSb = level < maxLevel ? settings.smallBlinds[level] : null;
  const progress = (levelSeconds - time) / levelSeconds;
  const danger = time < dangerSeconds;

  return { maxLevel, levelSeconds, sb, nextSb, progress, danger };
}

// The remaining time is always recomputed from a deadline timestamp rather
// than decremented, so the clock never drifts and stays correct even when a
// background tab throttles timers
export function remainingSeconds(endAt: number, now: number): number {
  return Math.max(0, Math.ceil((endAt - now) / 1000));
}

export type SavedGame = { level: number; remaining: number };

const GAME_KEY = "poker-timer:game";

// Validates a saved game against the active settings; anything out of range
// (e.g. the schedule shrank since the game was saved) is rejected so the
// caller can fall back to a fresh game instead
export function validateGame(settings: Settings, parsed: unknown): SavedGame | null {
  if (typeof parsed !== "object" || parsed === null) {
    return null;
  }

  const { level, remaining } = parsed as Record<string, unknown>;
  const seconds = settings.levelMinutes * 60;
  if (
    !Number.isInteger(level) ||
    (level as number) < 1 ||
    (level as number) > settings.smallBlinds.length ||
    !Number.isInteger(remaining) ||
    (remaining as number) < 0 ||
    (remaining as number) > seconds
  ) {
    return null;
  }

  return { level: level as number, remaining: remaining as number };
}

export function loadGame(settings: Settings): SavedGame | null {
  try {
    const raw = localStorage.getItem(GAME_KEY);
    if (!raw) {
      return null;
    }

    return validateGame(settings, JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveGame(game: SavedGame) {
  localStorage.setItem(GAME_KEY, JSON.stringify(game));
}
