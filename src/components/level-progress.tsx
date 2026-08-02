interface Props {
  level: number;
  maxLevel: number;
  /** How far through the current level, 0-1 */
  progress: number;
  danger: boolean;
}

// One segment per level: past levels are filled, the current one fills as the
// clock runs. Unlike the old step indicator this stays useful at every width,
// and it answers "how far in are we" and "how far through this level" at once.
export default function LevelProgress({
  level,
  maxLevel,
  progress,
  danger,
}: Props) {
  return (
    <div
      className="grid w-full auto-cols-fr grid-flow-col gap-1"
      role="progressbar"
      aria-label={`Level ${level} of ${maxLevel}`}
      aria-valuenow={level}
      aria-valuemin={1}
      aria-valuemax={maxLevel}
    >
      {Array.from({ length: maxLevel }, (_, i) => {
        const index = i + 1;
        const fill =
          index < level ? 1 : index === level ? Math.min(1, progress) : 0;

        return (
          <div key={i} className="h-1 overflow-hidden rounded-full bg-line">
            <div
              className={`h-full rounded-full transition-[width,background-color] duration-300 ease-linear ${
                danger && index === level ? "bg-danger" : "bg-accent"
              }`}
              style={{ width: `${fill * 100}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}
