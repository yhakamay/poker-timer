export default function SbBb({ sb }: { sb: number }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 w-full rounded-2xl shadow border border-muted divide-y lg:divide-y-0 lg:divide-x divide-muted">
      <div className="flex flex-col items-center gap-1 px-6 py-4">
        <div className="text-xs opacity-60">SB</div>
        <div className="text-4xl font-extrabold tabular-nums">
          {sb.toLocaleString()}
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 px-6 py-4">
        <div className="text-xs opacity-60">BB</div>
        <div className="text-4xl font-extrabold tabular-nums">
          {(sb * 2).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
