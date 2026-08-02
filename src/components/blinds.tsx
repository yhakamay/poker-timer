interface Props {
  sb: number;
  nextSb: number | null;
}

function Panel({
  label,
  sb,
  muted = false,
}: {
  label: string;
  sb: number | null;
  muted?: boolean;
}) {
  return (
    <div className="flex-1 rounded-2xl border border-line bg-panel px-6 py-5 text-center squat:px-4 squat:py-3">
      <div className="label">{label}</div>
      <div
        className={`mt-2 font-mono font-semibold tabular-nums whitespace-nowrap text-[clamp(1.5rem,5vw,2.75rem)] squat:mt-1 squat:text-2xl ${
          muted ? "text-dim" : "text-ink"
        }`}
      >
        {sb === null ? (
          <span className="text-dim">—</span>
        ) : (
          <>
            {sb.toLocaleString()}
            <span className="mx-1 text-dim">/</span>
            {(sb * 2).toLocaleString()}
          </>
        )}
      </div>
    </div>
  );
}

export default function Blinds({ sb, nextSb }: Props) {
  return (
    <div className="flex w-full gap-3 squat:flex-col squat:gap-2">
      <Panel label="Blinds" sb={sb} />
      <Panel label={nextSb === null ? "Final level" : "Next"} sb={nextSb} muted />
    </div>
  );
}
