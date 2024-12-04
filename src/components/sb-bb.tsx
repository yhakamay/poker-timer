export default function SbBb({ sb }: { sb: number }) {
  return (
    <div className="flex gap-4">
      <div>
        <h1>SB</h1>
        <h2>{sb}</h2>
      </div>
      <div>
        <h1>BB</h1>
        <h2>{sb * 2}</h2>
      </div>
    </div>
  );
}
