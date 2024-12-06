"use client";

import BlindLevel from "@/components/blind-level";
import Footer from "@/components/footer";
import SbBb from "@/components/sb-bb";
import Timer from "@/components/timer";
import { useEffect, useState } from "react";

export default function Home() {
  const beep = true;
  const initialTimeInMinutes = 10;
  const initialTime = initialTimeInMinutes * 60;
  const initialSb = 10;

  const [time, setTime] = useState(initialTime);
  const [sb, setSb] = useState(initialSb);
  const [level, setLevel] = useState(1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (time <= 0) {
      if (beep) {
        const audio = new Audio("/beep.mp3");
        audio.play();
      }
      setTime(initialTime);
      if (level < 9) {
        setSb(calculateSb(level + 1, initialSb));
        setLevel(level + 1);
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-sans">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="font-bold text-3xl w-full text-center">Poker Timer</h1>
        <div className="mx-auto flex flex-row">
          <div className="w-16"></div>
          <Timer time={time} />
          <button
            className="btn btn-square self-end ml-4 md:ml-8"
            onClick={() => setPaused(!paused)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`p-2 ${!paused ? "hidden" : ""}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`p-2 ${paused ? "hidden" : ""}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 5.25v13.5m-7.5-13.5v13.5"
              />
            </svg>
          </button>
        </div>
        <SbBb sb={sb} />
        <BlindLevel level={level} />
      </main>
      <Footer />
    </div>
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
