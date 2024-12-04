"use client";

import { useEffect, useState } from "react";
import SbBb from "./sb-bb";

export default function Timer({
  initialTime,
  beep,
  initialSb,
  maxSb,
}: {
  initialTime: number;
  beep: boolean;
  initialSb: number;
  maxSb: number;
}) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [sb, setSb] = useState(initialSb);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (beep) {
        //const audio = new Audio("/beep.mp3");
        //audio.play();
      }
      setTimeLeft(initialTime);
      if (sb * 2 > maxSb) {
        // Do nothing
      } else {
        setSb(sb * 2);
      }
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  return (
    <>
      <time>{formatTime(timeLeft)}</time>
      <SbBb sb={sb} />
    </>
  );
}
