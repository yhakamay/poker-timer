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
      className="m-auto w-[min(28rem,calc(100vw-2rem))] max-h-[85dvh] overflow-y-auto rounded-2xl border border-line bg-panel p-0 text-ink backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      // Closing without saving discards the draft
      onClose={() => {
        setMinutes(settings.levelMinutes);
        setBlinds(settings.smallBlinds);
      }}
    >
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
        <div className="sticky top-0 border-b border-line bg-panel px-6 py-4">
          <h2 className="label">Structure</h2>
        </div>

        <div className="px-6 py-5">
          <label className="mb-6 flex items-center justify-between gap-4">
            <span className="label">Minutes per level</span>
            <input
              type="number"
              min={1}
              value={Number.isNaN(minutes) ? "" : minutes}
              onChange={(e) => setMinutes(e.target.valueAsNumber)}
              className="input w-24 text-right"
            />
          </label>

          <div className="mb-3 flex items-center justify-between">
            <span className="label">Small blind</span>
            <span className="label">Big blind</span>
          </div>

          <div className="flex flex-col gap-2">
            {blinds.map((sb, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-6 shrink-0 text-right font-mono text-xs tabular-nums text-dim">
                  {i + 1}
                </span>
                <input
                  type="number"
                  min={1}
                  aria-label={`Small blind for level ${i + 1}`}
                  value={Number.isNaN(sb) ? "" : sb}
                  onChange={(e) => setBlind(i, e.target.valueAsNumber)}
                  className="input min-w-0 flex-1 text-right"
                />
                <span className="w-20 shrink-0 text-right font-mono text-sm tabular-nums text-dim">
                  {Number.isInteger(sb) ? (sb * 2).toLocaleString() : "—"}
                </span>
                <button
                  type="button"
                  aria-label={`Remove level ${i + 1}`}
                  disabled={blinds.length === 1}
                  onClick={() => setBlinds(blinds.filter((_, j) => j !== i))}
                  className="btn btn-ghost !h-9 !min-w-9 !px-0 text-lg"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              setBlinds([...blinds, (blinds[blinds.length - 1] || 100) * 2])
            }
            className="btn btn-ghost mt-3 !h-10 w-full border-line !border-dashed"
          >
            <span className="label">+ Add level</span>
          </button>
        </div>

        <div className="sticky bottom-0 flex items-center justify-between gap-2 border-t border-line bg-panel px-6 py-4">
          <button
            type="button"
            onClick={reset}
            className="btn btn-ghost !h-10 !px-2"
          >
            <span className="label">Reset</span>
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={(e) => e.currentTarget.closest("dialog")?.close()}
              className="btn btn-ghost !h-10"
            >
              <span className="label">Cancel</span>
            </button>
            <button
              type="submit"
              disabled={!valid}
              className="btn btn-accent !h-10"
            >
              <span className="label !text-inherit">Save</span>
            </button>
          </div>
        </div>
      </form>
    </dialog>
  );
}
