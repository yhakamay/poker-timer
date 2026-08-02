"use client";

import BlindLevel from "@/components/blind-level";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import PlayPauseButton from "@/components/play-pause-button";
import PrevNextButton from "@/components/prev-next-button";
import SbBb from "@/components/sb-bb";
import Timer from "@/components/timer";
import { useEffect, useRef, useState } from "react";

const initialTime = 10 * 60; // 10 minutes
const initialSb = 100;
const maxLevel = 9;

export default function Home() {
  const [time, setTime] = useState(initialTime);
  const [level, setLevel] = useState(1);
  const [paused, setPaused] = useState(true);
  const [flashing, setFlashing] = useState(false);

  // The blinds are fully determined by the level, so derive them during render
  // instead of keeping a second copy in state
  const sb = calculateSb(level, initialSb);

  // While running, the source of truth for the remaining time is a deadline
  // timestamp, not a decrementing counter: each tick recomputes the remaining
  // seconds from it, so the clock never drifts and stays correct even when the
  // browser throttles timers in a background tab
  const endAtRef = useRef<number | null>(null);

  // Lazily created on the first play press (a user gesture, which is what
  // browser autoplay policies require to unlock audio)
  const audioCtxRef = useRef<AudioContext | null>(null);

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
  }, [paused, level]);

  function goToLevel(nextLevel: number) {
    setLevel(nextLevel);
    setTime(initialTime);
    // A non-null deadline means the clock is running; checking the ref (not
    // `paused`) keeps this correct even from a stale closure
    if (endAtRef.current !== null) {
      endAtRef.current = Date.now() + initialTime * 1000;
    }
  }

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

  // Flash the screen to tell inaudible users that the time is up, using the
  // invert-flicker animation defined in globals.css
  function flash() {
    setFlashing(true);
    setTimeout(() => setFlashing(false), 1000);
  }

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-dvh p-8 pb-20 gap-16 sm:p-20 font-sans ${
        // If less than 30 seconds are left, turn the background red to alert
        // the players
        time < 30 ? "bg-error" : ""
      } ${flashing ? "animate-invert-flicker" : ""}`}
    >
      <Navbar />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="w-16"></div>
        <Timer time={time} />
        <div className="self-center flex flex-row gap-8">
          <PrevNextButton
            currentLevel={level}
            onLevelChange={goToLevel}
            type={"prev"}
          />
          <PlayPauseButton onToggle={togglePaused} paused={paused} />
          <PrevNextButton
            currentLevel={level}
            onLevelChange={goToLevel}
            type={"next"}
          />
        </div>
        <SbBb sb={sb} />
        <BlindLevel level={level} />
      </main>
      <Footer />
    </div>
  );
}

function remainingSeconds(endAt: number) {
  return Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
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

function calculateSb(level: number, initialSb: number) {
  switch (level) {
    case 1:
      return initialSb;
    case 2:
      return initialSb * 2;
    case 3:
      return initialSb * 3;
    case 4:
      return initialSb * 5;
    case 5:
      return initialSb * 10;
    case 6:
      return initialSb * 15;
    case 7:
      return initialSb * 20;
    case 8:
      return initialSb * 40;
    case 9:
      return initialSb * 80;
    default:
      throw new Error("Level not found");
  }
}
