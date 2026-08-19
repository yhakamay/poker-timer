interface Props {
  onToggle: () => void;
  paused: boolean;
}

export default function PlayPauseButton({ onToggle, paused }: Props) {
  return (
    <button
      className="btn btn-accent w-32 gap-2"
      onClick={onToggle}
      aria-label={paused ? "Play" : "Pause"}
    >
      {paused ? (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
          <path d="M6.3 4.4a1 1 0 0 1 1.5-.87l11.2 6.6a1 1 0 0 1 0 1.74L7.8 18.47a1 1 0 0 1-1.5-.87V4.4Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
          <path d="M7 4.5h3.2v15H7v-15Zm6.8 0H17v15h-3.2v-15Z" />
        </svg>
      )}
      <span className="label !text-inherit">{paused ? "Start" : "Pause"}</span>
    </button>
  );
}
