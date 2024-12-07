import { Dispatch, SetStateAction } from "react";

interface Props {
  type: "prev" | "next";
  currentLevel: number;
  setLevel: Dispatch<SetStateAction<number>>;
}

export default function PrevNextButton(props: Props) {
  const { type, currentLevel, setLevel } = props;
  const minLvel = 1;
  const maxLevel = 9;
  const disabled =
    (currentLevel === minLvel && type === "prev") ||
    (currentLevel === maxLevel && type === "next");

  return (
    <button
      className={`btn btn-ghost ${disabled ? "btn-disabled" : ""}`}
      onClick={function () {
        if (disabled) {
          return;
        }

        return setLevel(type === "prev" ? currentLevel - 1 : currentLevel + 1);
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
