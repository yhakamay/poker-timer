"use client";

import BlindLevel from "@/components/blind-level";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import PlayPauseButton from "@/components/play-pause-button";
import PrevNextButton from "@/components/prev-next-button";
import SbBb from "@/components/sb-bb";
import Timer from "@/components/timer";
import { useEffect, useRef, useState } from "react";

const beep = true;
const initialTime = 10 * 60; // 10 minutes
const initialSb = 100;
const maxLevel = 9;

export default function Home() {
  const [time, setTime] = useState(initialTime);
  const [level, setLevel] = useState(1);
  const [paused, setPaused] = useState(true);

  // The blinds are fully determined by the level, so derive them during render
  // instead of keeping a second copy in state
  const sb = calculateSb(level, initialSb);

  // The countdown interval below is re-created only when the level or the play
  // state changes, so the tick reads the remaining time through a ref instead
  // of taking `time` as a dependency
  const timeRef = useRef(time);

  useEffect(() => {
    timeRef.current = time;
  }, [time]);

  // If less than 30 seconds are left, change the background color to red to
  // alert the players
  useEffect(() => {
    document.body.classList.toggle("bg-error", time < 30);
  }, [time]);

  useEffect(() => {
    if (paused) {
      return;
    }

    const timer = setInterval(() => {
      if (timeRef.current > 0) {
        timeRef.current -= 1;
        setTime(timeRef.current);
        return;
      }

      // The level is over
      if (beep) {
        const audio = new Audio("/beep.mp3");
        audio.play();
      }

      flashBackground();

      if (level < maxLevel) {
        goToLevel(level + 1);
      } else {
        setPaused(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [paused, level]);

  function goToLevel(nextLevel: number) {
    setLevel(nextLevel);
    setTime(initialTime);
  }

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
              onLevelChange={goToLevel}
              type={"prev"}
            />
            <PlayPauseButton setPaused={setPaused} paused={paused} />
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
    </>
  );
}

// Flash the background color to tell inaudible users that the time is up
// using a custom animation class defined in tailwind.config.ts
function flashBackground() {
  const body = document.body;

  body.classList.remove("bg-error");
  body.classList.add("animate-invert-flicker");
  setTimeout(() => {
    body.classList.remove("animate-invert-flicker");
  }, 1000);
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
