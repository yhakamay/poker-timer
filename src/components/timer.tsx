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

export default function Timer({ time }: { time: number }) {
  const minutes = Math.floor(time / 60);
  const remainingSeconds = time % 60;

  return (
    <div className="w-full flex flex-row justify-center">
      <div
        className="grid grid-flow-col gap-5 text-center auto-cols-max"
        role="timer"
        aria-label={`${minutes} minutes ${remainingSeconds} seconds`}
      >
        <div className="flex flex-col">
          <span className="font-mono text-6xl md:text-9xl">
            <RollingNumber value={minutes} />
          </span>
          min
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-6xl md:text-9xl">
            <RollingNumber value={remainingSeconds} />
          </span>
          sec
        </div>
      </div>
    </div>
  );
}
