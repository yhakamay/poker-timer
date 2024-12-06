import { CSSProperties } from "react";

export default function Timer({ time }: { time: number }) {
  const minutes = Math.floor(time / 60);
  const remainingSeconds = time % 60;

  return (
    <div className="w-full flex flex-row justify-center">
      <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
        <div className="flex flex-col">
          <span className="countdown font-mono text-6xl md:text-9xl">
            <span style={{ "--value": `${minutes}` } as CSSProperties}></span>
          </span>
          min
        </div>
        <div className="flex flex-col">
          <span className="countdown font-mono  text-6xl md:text-9xl">
            <span
              style={{ "--value": `${remainingSeconds}` } as CSSProperties}
            ></span>
          </span>
          sec
        </div>
      </div>
    </div>
  );
}
