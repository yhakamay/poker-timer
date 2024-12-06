export default function SbBb({ sb }: { sb: number }) {
  return (
    <>
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div className="stat place-items-center">
          <div className="stat-title">SB</div>
          <div className="stat-value">{sb.toLocaleString()}</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">BB</div>
          <div className="stat-value">{(sb * 2).toLocaleString()}</div>
        </div>
      </div>
    </>
  );
}
