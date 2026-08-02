import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex w-full items-center justify-between gap-4">
      {/* Keyboard hints — this thing usually runs on a laptop next to the table */}
      <div className="hidden items-center gap-3 sm:flex">
        <Hint keys="Space" action="start / pause" />
        <Hint keys="← →" action="level" />
      </div>

      <Link
        className="label transition-colors hover:text-ink"
        href="https://x.com/yhakamay"
        target="_blank"
        rel="noopener noreferrer"
      >
        yhakamay
      </Link>
    </footer>
  );
}

function Hint({ keys, action }: { keys: string; action: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <kbd className="rounded border border-line bg-panel px-1.5 py-0.5 font-mono text-[0.6875rem] text-dim">
        {keys}
      </kbd>
      <span className="label">{action}</span>
    </span>
  );
}
