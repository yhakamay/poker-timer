import { Ref, useState } from "react";
import { defaultSettings, Settings } from "@/lib/settings";

interface Props {
  ref: Ref<HTMLDialogElement>;
  settings: Settings;
  onSave: (settings: Settings) => void;
}

// The page remounts this component (via `key`) whenever the saved settings
// change, so the draft state below always starts from the current settings
export default function SettingsDialog({ ref, settings, onSave }: Props) {
  const [minutes, setMinutes] = useState(settings.levelMinutes);
  const [blinds, setBlinds] = useState(settings.smallBlinds);

  const valid =
    Number.isInteger(minutes) &&
    minutes >= 1 &&
    blinds.length >= 1 &&
    blinds.every((sb) => Number.isInteger(sb) && sb >= 1);

  function setBlind(index: number, value: number) {
    setBlinds(blinds.map((sb, i) => (i === index ? value : sb)));
  }

  function reset() {
    setMinutes(defaultSettings.levelMinutes);
    setBlinds(defaultSettings.smallBlinds);
  }

  return (
    <dialog
      ref={ref}
      className="m-auto w-full max-w-md rounded-2xl bg-background text-foreground p-6 shadow-lg backdrop:bg-black/60"
      // Closing without saving discards the draft
      onClose={(e) => {
        setMinutes(settings.levelMinutes);
        setBlinds(settings.smallBlinds);
        e.currentTarget.scrollTop = 0;
      }}
    >
      <h2 className="text-lg font-bold mb-4">Settings</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid) {
            return;
          }
          onSave({ levelMinutes: minutes, smallBlinds: blinds });
          e.currentTarget.closest("dialog")?.close();
        }}
      >
        <label className="flex items-center justify-between gap-4 mb-6">
          <span>Minutes per level</span>
          <input
            type="number"
            min={1}
            value={Number.isNaN(minutes) ? "" : minutes}
            onChange={(e) => setMinutes(e.target.valueAsNumber)}
            className="input w-24"
          />
        </label>

        <div className="flex flex-col gap-2 mb-4">
          {blinds.map((sb, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-16 shrink-0 text-sm opacity-60">
                Level {i + 1}
              </span>
              <input
                type="number"
                min={1}
                aria-label={`Small blind for level ${i + 1}`}
                value={Number.isNaN(sb) ? "" : sb}
                onChange={(e) => setBlind(i, e.target.valueAsNumber)}
                className="input flex-1"
              />
              <span className="w-20 shrink-0 text-sm opacity-60 text-right tabular-nums">
                BB {Number.isInteger(sb) ? (sb * 2).toLocaleString() : "—"}
              </span>
              <button
                type="button"
                aria-label={`Remove level ${i + 1}`}
                disabled={blinds.length === 1}
                onClick={() => setBlinds(blinds.filter((_, j) => j !== i))}
                className="btn btn-ghost btn-square disabled:opacity-30"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setBlinds([...blinds, (blinds[blinds.length - 1] || 100) * 2])
          }
          className="btn btn-ghost w-full mb-6"
        >
          + Add level
        </button>

        <div className="flex justify-between gap-2">
          <button type="button" onClick={reset} className="btn btn-ghost">
            Reset to defaults
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={(e) => e.currentTarget.closest("dialog")?.close()}
              className="btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!valid}
              className="btn btn-primary disabled:opacity-30"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </dialog>
  );
}
