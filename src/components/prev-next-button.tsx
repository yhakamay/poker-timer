interface Props {
  type: "prev" | "next";
  currentLevel: number;
  maxLevel: number;
  onLevelChange: (level: number) => void;
}

export default function PrevNextButton(props: Props) {
  const { type, currentLevel, maxLevel, onLevelChange } = props;
  const minLevel = 1;
  const disabled =
    (currentLevel === minLevel && type === "prev") ||
    (currentLevel === maxLevel && type === "next");

  return (
    <button
      className="btn btn-ghost !px-0"
      disabled={disabled}
      aria-label={type === "prev" ? "Previous level" : "Next level"}
      onClick={() =>
        onLevelChange(type === "prev" ? currentLevel - 1 : currentLevel + 1)
      }
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`size-5 ${type === "next" ? "rotate-180" : ""}`}
      >
        <path d="M20 5.6v12.8a1 1 0 0 1-1.5.87l-6.5-3.9v3.03a1 1 0 0 1-1.5.87l-7.1-6.4a1 1 0 0 1 0-1.74l7.1-6.4a1 1 0 0 1 1.5.87v3.03l6.5-3.9A1 1 0 0 1 20 5.6Z" />
      </svg>
    </button>
  );
}
