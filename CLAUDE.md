# poker-timer

Single-page poker blind timer. Next.js 16 App Router, React 19, TypeScript,
Tailwind 4 (CSS-first config, no component library). No tests, no backend,
no database.

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
  (`time`, `level`, `paused`) plus the `calculateSb` blind schedule. `sb` is
  derived from `level` during render, not stored. Level count (`maxLevel`) and
  level length (`initialTime`) are constants here.
- `src/components/*` — presentational only, props in, no state of their own.
  The one exception is that `page.tsx` reaches into `document.body` directly to
  toggle `bg-error` and `animate-invert-flicker`.
- `src/app/globals.css` — the Tailwind 4 CSS-first config (`@theme`: colors,
  fonts, the `invert-flicker` animation) plus the hand-written widget classes
  (`.btn*`, `.digit` rolling countdown, `.steps`/`.step` level indicator).
  There is no `tailwind.config.ts`.

## Gotchas

- **Style-affecting rules must live in a cascade layer.** Tailwind 4 puts
  utilities in the native `utilities` layer, so an unlayered rule in
  `globals.css` (e.g. on `body`) silently wins over utility classes like
  `bg-error`. Add such rules inside `@layer base`/`@layer components`.
- **A green build does not mean the UI works.** For any styling change, check
  the real page: the countdown digits should roll (`.digit` strips), and
  `.btn-primary` should have a non-transparent background.
- **Level count is hardcoded in three places** — `maxLevel` in `page.tsx`,
  `maxLevel` in `prev-next-button.tsx`, and the nine hand-written `<li>`
  elements in `blind-level.tsx`. Changing the schedule means touching all three.
- **`calculateSb` throws** on any level outside 1–9 rather than clamping.
- **`postcss` and `sharp` are forced forward by npm `overrides`.** `next` pins
  `postcss` to 8.4.31 and caps `sharp` at `^0.34.5`, both with open advisories;
  the overrides in `package.json` are what keep `npm audit` at zero. The
  `postcss` override is `"$postcss"`, so it tracks the devDependency range —
  keep that range at or above the patched floor. Do not run
  `npm audit fix --force` — it downgrades Next to 9.x.
