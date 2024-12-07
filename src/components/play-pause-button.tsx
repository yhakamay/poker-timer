import { Dispatch, SetStateAction } from "react";

interface Props {
  setPaused: Dispatch<SetStateAction<boolean>>;
  paused: boolean;
}

export default function PlayPauseButton(props: Props) {
  const { setPaused, paused } = props;

  return (
    <button
      className={`btn btn-square ${paused ? "btn-primary" : ""}`}
      onClick={() => setPaused(!paused)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width="100%"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className={`size-6 ${!paused ? "hidden" : ""}`}
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
        width="100%"
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
  );
}
