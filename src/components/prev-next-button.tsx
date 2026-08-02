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
      className={`btn btn-ghost ${disabled ? "btn-disabled" : ""}`}
      aria-label={type === "prev" ? "Previous level" : "Next level"}
      onClick={function () {
        if (disabled) {
          return;
        }

        return onLevelChange(
          type === "prev" ? currentLevel - 1 : currentLevel + 1,
        );
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width="100%"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`size-6 ${type === "next" ? "rotate-180" : ""}`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z"
        />
      </svg>
    </button>
  );
}
