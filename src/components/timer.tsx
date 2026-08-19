// A 0-9 digit strip, one digit tall; shifting it up by `value` em rolls to the
// digit, animated by the .digit transition in globals.css
function Digit({ value }: { value: number }) {
  return (
    <span className="digit" aria-hidden="true">
      <span style={{ transform: `translateY(-${value}em)` }}>
        {Array.from({ length: 10 }, (_, digit) => (
          <span key={digit}>{digit}</span>
        ))}
      </span>
    </span>
  );
}

function RollingNumber({ value }: { value: number }) {
  return (
    <>
      <Digit value={Math.floor(value / 10) % 10} />
      <Digit value={value % 10} />
    </>
  );
}

interface Props {
  time: number;
  danger: boolean;
}

export default function Timer({ time, danger }: Props) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div
      role="timer"
      aria-label={`${minutes} minutes ${seconds} seconds remaining`}
      // Sized in globals.css: it scales with both axes so the board fills
      // whatever screen it lands on, and the vh term is what keeps the panels
      // and controls below it on screen
      className={`timer-digits flex items-center justify-center font-mono font-medium leading-none tabular-nums transition-colors duration-300 ${
        danger ? "text-danger" : "text-ink"
      }`}
    >
      <RollingNumber value={minutes} />
      <span className="px-[0.06em] pb-[0.08em] opacity-40">:</span>
      <RollingNumber value={seconds} />
    </div>
  );
}
