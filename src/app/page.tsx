"use client";

import BlindLevel from "@/components/blind-level";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import PlayPauseButton from "@/components/play-pause-button";
import PrevNextButton from "@/components/prev-next-button";
import SbBb from "@/components/sb-bb";
import Timer from "@/components/timer";
import { useEffect, useState } from "react";

export default function Home() {
  const beep = true;
  const initialTime = 10 * 60; // 10 minutes
  const initialSb = 100;

  const [time, setTime] = useState(initialTime);
  const [sb, setSb] = useState(initialSb);
  const [level, setLevel] = useState(1);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    // If the time is less than 30 seconds, change the background color
    // to red to alert the player
    if (time < 30) {
      const body = document.querySelector("body");

      if (body !== null) {
        body.classList.add("bg-error");
      }
    }

    if (time < 0) {
      if (beep) {
        const audio = new Audio("/beep.mp3");
        audio.play();
      }

      if (level < 9) {
        setLevel(level + 1);
        // setTime() is handled in a separate useEffect
      }

      if (level === 9) {
        setPaused(true);
      }

      // Flash the background color to tell inaudible users that the time is up
      // using a custom animation class defined in tailwind.config.ts
      const body = document.querySelector("body");

      if (body !== null) {
        body.classList.remove("bg-error");
        body.classList.add("animate-invert-flicker");
        setTimeout(() => {
          body.classList.remove("animate-invert-flicker");
        }, 1000);
      }
    }

    if (paused) {
      return;
    }

    const timer = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, paused]);

  // Separate useEffect to update sb when level changes
  // This is necessary because the sb can also be changed by PrevNextButton
  // and not only by the timer
  useEffect(() => {
    setTime(initialTime);
    setSb(calculateSb(level, initialSb));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-dvh p-8 pb-20 gap-16 sm:p-20 font-sans">
        <Navbar />
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <div className="w-16"></div>
          <Timer time={time} />
          <div className="self-center flex flex-row gap-8">
            <PrevNextButton
              currentLevel={level}
              setLevel={setLevel}
              type={"prev"}
            />
            <PlayPauseButton setPaused={setPaused} paused={paused} />
            <PrevNextButton
              currentLevel={level}
              setLevel={setLevel}
              type={"next"}
            />
          </div>
          <SbBb sb={sb} />
          <BlindLevel level={level} />
        </main>
        <Footer />
      </div>
    </>
  );
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
