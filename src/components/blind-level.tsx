interface Props {
  level: number;
  maxLevel: number;
}

export default function BlindLevel({ level, maxLevel }: Props) {
  return (
    <ul className="steps hidden lg:inline-grid">
      {Array.from({ length: maxLevel }, (_, i) => (
        <li key={i} className={level >= i + 1 ? "step step-primary" : "step"} />
      ))}
    </ul>
  );
}
