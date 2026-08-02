"use client";

import BlindLevel from "@/components/blind-level";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import PlayPauseButton from "@/components/play-pause-button";
import PrevNextButton from "@/components/prev-next-button";
import SbBb from "@/components/sb-bb";
import SettingsDialog from "@/components/settings-dialog";
import Timer from "@/components/timer";
import {
  defaultSettings,
  loadSettings,
  saveSettings,
  Settings,
} from "@/lib/settings";
import { useCallback, useEffect, useRef, useState } from "react";

const GAME_KEY = "poker-timer:game";

export default function Home() {
  const [settings, setSettings] = useState(defaultSettings);
  const [time, setTime] = useState(defaultSettings.levelMinutes * 60);
  const [level, setLevel] = useState(1);
  const [paused, setPaused] = useState(true);
  const [flashing, setFlashing] = useState(false);

  const levelSeconds = settings.levelMinutes * 60;
  const maxLevel = settings.smallBlinds.length;
  // The blinds are fully determined by the level, so derive them during render
  // instead of keeping a second copy in state
  const sb = settings.smallBlinds[level - 1];

  // While running, the source of truth for the remaining time is a deadline
  // timestamp, not a decrementing counter: each tick recomputes the remaining
  // seconds from it, so the clock never drifts and stays correct even when the
  // browser throttles timers in a background tab
  const endAtRef = useRef<number | null>(null);

  // Lazily created on the first play press (a user gesture, which is what
  // browser autoplay policies require to unlock audio)
  const audioCtxRef = useRef<AudioContext | null>(null);

  const settingsDialogRef = useRef<HTMLDialogElement>(null);

  // Blocks the game-state persist effect from clobbering the saved game with
  // defaults before the restore below has run
  const restoredRef = useRef(false);

  // Restore settings and any in-progress game after mount; the server render
  // must use the defaults, so localStorage can only be read here. The one-off
  // cascading render this causes is exactly the intended hydration step.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const stored = loadSettings();
    if (stored) {
      setSettings(stored);
    }
    const active = stored ?? defaultSettings;
    const seconds = active.levelMinutes * 60;

    const game = loadGame(active);
    if (game) {
      setLevel(game.level);
      setTime(game.remaining);
    } else {
      setTime(seconds);
    }
    restoredRef.current = true;
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persist the game so a reload or accidental tab close resumes where the
  // game left off (always paused, never mid-countdown)
  useEffect(() => {
    if (!restoredRef.current) {
      return;
    }
    localStorage.setItem(GAME_KEY, JSON.stringify({ level, remaining: time }));
  }, [level, time]);

  // Flash the screen to tell inaudible users that the time is up, using the
  // invert-flicker animation defined in globals.css
  const flash = useCallback(() => {
    setFlashing(true);
    setTimeout(() => setFlashing(false), 1000);
  }, []);

  const goToLevel = useCallback(
    (nextLevel: number) => {
      setLevel(nextLevel);
      setTime(levelSeconds);
      // A non-null deadline means the clock is running; checking the ref (not
      // `paused`) keeps this correct even from a stale closure
      if (endAtRef.current !== null) {
        endAtRef.current = Date.now() + levelSeconds * 1000;
      }
    },
    [levelSeconds],
  );

  // Offline support: the service worker caches the app shell. Registered only
  // in production so the dev server never fights a stale cache
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  // Keep the screen awake while the clock is running — a timer that lets the
  // phone on the table go to sleep is not much of a timer. The browser drops
  // the lock when the tab is hidden, so re-acquire it on return
  useEffect(() => {
    if (paused || !("wakeLock" in navigator)) {
      return;
    }

    let lock: WakeLockSentinel | null = null;
    let cancelled = false;

    const acquire = async () => {
      try {
        const acquired = await navigator.wakeLock.request("screen");
        if (cancelled) {
          acquired.release();
        } else {
          lock = acquired;
        }
      } catch {
        // Denied (e.g. power saver) — the timer still works without it
      }
    };

    acquire();
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        acquire();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      lock?.release().catch(() => {});
    };
  }, [paused]);

  useEffect(() => {
    if (paused) {
      return;
    }

    const timer = setInterval(() => {
      const endAt = endAtRef.current;
      if (endAt === null) {
        return;
      }

      const remaining = remainingSeconds(endAt);
      setTime(remaining);
      if (remaining > 0) {
        return;
      }

      // The level is over
      beep(audioCtxRef.current);
      navigator.vibrate?.([200, 100, 200]);
      flash();

      if (level < maxLevel) {
        goToLevel(level + 1);
      } else {
        endAtRef.current = null;
        setPaused(true);
      }
    }, 250);

    return () => clearInterval(timer);
  }, [paused, level, maxLevel, goToLevel, flash]);

  function togglePaused() {
    if (paused) {
      audioCtxRef.current ??= new AudioContext();
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      endAtRef.current = Date.now() + time * 1000;
      setPaused(false);
      return;
    }

    // Freeze the displayed time at the exact remaining amount
    if (endAtRef.current !== null) {
      setTime(remainingSeconds(endAtRef.current));
    }
    endAtRef.current = null;
    setPaused(true);
  }

  function applySettings(next: Settings) {
    saveSettings(next);
    setSettings(next);
    // New schedule, new game
    endAtRef.current = null;
    setPaused(true);
    setLevel(1);
    setTime(next.levelMinutes * 60);
  }

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-dvh p-8 pb-20 gap-16 sm:p-20 font-sans ${
        // If less than 30 seconds are left, turn the background red to alert
        // the players
        time < 30 ? "bg-error" : ""
      } ${flashing ? "animate-invert-flicker" : ""}`}
    >
      <Navbar
        onOpenSettings={() => settingsDialogRef.current?.showModal()}
      />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="w-16"></div>
        <Timer time={time} />
        <div className="self-center flex flex-row gap-8">
          <PrevNextButton
            currentLevel={level}
            maxLevel={maxLevel}
            onLevelChange={goToLevel}
            type={"prev"}
          />
          <PlayPauseButton onToggle={togglePaused} paused={paused} />
          <PrevNextButton
            currentLevel={level}
            maxLevel={maxLevel}
            onLevelChange={goToLevel}
            type={"next"}
          />
        </div>
        <SbBb sb={sb} />
        <BlindLevel level={level} maxLevel={maxLevel} />
      </main>
      <Footer />
      <SettingsDialog
        // Remount on settings change so the dialog's draft state always
        // starts from the currently saved settings
        key={JSON.stringify(settings)}
        ref={settingsDialogRef}
        settings={settings}
        onSave={applySettings}
      />
    </div>
  );
}

function remainingSeconds(endAt: number) {
  return Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
}

// Reads the saved game and validates it against the active settings; anything
// out of range (e.g. the schedule shrank) starts a fresh game instead
function loadGame(settings: Settings): { level: number; remaining: number } | null {
  try {
    const raw = localStorage.getItem(GAME_KEY);
    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);
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
  } catch {
    return null;
  }
}

// A short triple beep generated with the Web Audio API — no audio asset needed
function beep(ctx: AudioContext | null) {
  if (!ctx) {
    return;
  }

  const start = ctx.currentTime;
  for (let i = 0; i < 3; i++) {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 880;

    const t = start + i * 0.25;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.5, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(t);
    oscillator.stop(t + 0.22);
  }
}
