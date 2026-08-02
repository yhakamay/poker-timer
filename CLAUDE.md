# poker-timer

Single-page poker blind timer, laid out as a tournament clock. Next.js 16 App
Router, React 19, TypeScript, Tailwind 4 (CSS-first config, no component
library). Dark only. No tests, no backend, no database.

## Commands

```bash
npm run dev        # port 3000
npm run build
npm run lint       # eslint . (flat config in eslint.config.mjs)
npm run typecheck  # tsc --noEmit
```

Before calling a change done, run `lint`, `typecheck`, and `build`.

## Layout

- `src/app/page.tsx` — the whole app. Client component holding all state
  (`time`, `level`, `paused`, `settings`). `sb`, `maxLevel`, and the level
  length are all derived from `settings` during render, not stored.
- `src/lib/settings.ts` — the `Settings` type, the default blind schedule,
  and the localStorage load/save (with validation). The in-progress game is
  persisted separately under `poker-timer:game` by `page.tsx`.
- `src/components/*` — presentational only, props in, no state of their own.
  The one exception is `settings-dialog.tsx`, which keeps draft state while
  editing; the page remounts it (via `key`) when saved settings change.
- `src/components/` — `header` (brand + level), `level-progress` (one segment
  per level, the current one fills as the clock runs), `timer` (the MM:SS
  headline), `blinds` (current + next), the control buttons, `footer`,
  `settings-dialog`.
- `src/app/globals.css` — the Tailwind 4 CSS-first config (`@theme`: colors,
  fonts, the `invert-flicker` animation), the `squat` custom variant, and the
  hand-written widget classes (`.btn*`, `.label`, `.input`, `.digit` rolling
  countdown, `.timer-digits` sizing, `.danger-glow`). No `tailwind.config.ts`.

## Gotchas

- **Style-affecting rules must live in a cascade layer.** Tailwind 4 puts
  utilities in the native `utilities` layer, so an unlayered rule in
  `globals.css` (e.g. on `body`) silently wins over utility classes. Add such
  rules inside `@layer base`/`@layer components`.
- **The board must never overflow.** `body` is `overflow-hidden`, so anything
  that doesn't fit is unreachable, not scrollable. The timer is sized by
  `clamp(..., min(Xvw, Yvh), ...)` in `.timer-digits` — the `vh` term is what
  keeps the blinds and controls on screen. Changing it means re-checking tall
  portrait, short landscape, and desktop.
- **`squat` is a custom variant** (`@custom-variant` in `globals.css`) for short
  wide viewports — a phone on its side. It switches the board to a side-by-side
  layout; stacked, nothing fits under ~640px of height.
- **A green build does not mean the UI works.** For any styling change, check
  the real page: the countdown digits should roll (`.digit` strips), and
  `.btn-accent` should have a non-transparent background.
- **Checking colors in a non-displayed browser pane is misleading.** With no
  compositing, `document.timeline` is frozen and CSS transitions never advance,
  so `transition-colors` elements report their *old* color forever. Call
  `el.getAnimations().forEach(a => a.finish())` before reading computed styles,
  or the under-30s red will look broken when it isn't.
- **localStorage is only touched after mount.** The server render always uses
  the defaults; settings and the saved game are restored in a mount effect to
  avoid hydration mismatches. Saved data is validated on load — anything out
  of range falls back to a fresh game.
- **`postcss` and `sharp` are forced forward by npm `overrides`.** `next` pins
  `postcss` to 8.4.31 and caps `sharp` at `^0.34.5`, both with open advisories;
  the overrides in `package.json` are what keep `npm audit` at zero. The
  `postcss` override is `"$postcss"`, so it tracks the devDependency range —
  keep that range at or above the patched floor. Do not run
  `npm audit fix --force` — it downgrades Next to 9.x.
