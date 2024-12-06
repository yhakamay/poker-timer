export default function BlindLevel({ level }: { level: number }) {
  return (
    <ul className="steps hidden lg:inline-grid ">
      <li className={level >= 1 ? "step step-primary" : "step"}></li>
      <li className={level >= 2 ? "step step-primary" : "step"}></li>
      <li className={level >= 3 ? "step step-primary" : "step"}></li>
      <li className={level >= 4 ? "step step-primary" : "step"}></li>
      <li className={level >= 5 ? "step step-primary" : "step"}></li>
      <li className={level >= 6 ? "step step-primary" : "step"}></li>
      <li className={level >= 7 ? "step step-primary" : "step"}></li>
      <li className={level >= 8 ? "step step-primary" : "step"}></li>
      <li className={level >= 9 ? "step step-primary" : "step"}></li>
    </ul>
  );
}
