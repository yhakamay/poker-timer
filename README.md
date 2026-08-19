# Poker Timer

A simple blind timer for home poker games. Counts down each level, bumps the
blinds automatically, and beeps + flashes the screen when time is up.

![Poker Timer](public/Poker%20Timer.png)

## Requirements

- Node.js 20.9+ (the repo pins **24** via [`.nvmrc`](.nvmrc))
- npm

## Getting started

```bash
npm ci
```

```bash
npm run dev
```

Then open <http://localhost:3000>.

## Scripts

| Command             | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Dev server on port 3000 (Turbopack)           |
| `npm run build`     | Production build                              |
| `npm start`         | Serve the production build (run `build` first) |
| `npm run lint`      | ESLint                                        |
| `npm run typecheck` | `tsc --noEmit`                                |

## How it works

It's laid out as a tournament clock: level and structure at the top, the
remaining time as the headline, current and next blinds beneath it, controls at
the bottom. The point is that it stays readable from across the table.

Everything lives in a single client component, [`src/app/page.tsx`](src/app/page.tsx),
which owns all the state — `time`, `level`, `paused`, `settings`:

- **9 blind levels by default**, 10 minutes each, small blinds
  `100, 200, 300, 500, 1000, 1500, 2000, 4000, 8000`. BB is always 2×SB.
  The defaults live in [`src/lib/settings.ts`](src/lib/settings.ts).
- **Next blinds are always shown**, so the table can see what's coming.
- **The level bar** has one segment per level; the current segment fills as the
  clock runs, so "how far in are we" and "how long is left" read at a glance.
- **Everything is editable** in the settings dialog (gear icon, a native
  `<dialog>`): minutes per level, and the small blind for each level —
  add or remove levels freely. Saved settings persist in `localStorage`.
- **The game survives a reload.** The current level and remaining time are
  saved as they change and restored (paused) on the next visit.
- **Keyboard**: `Space` starts/pauses, `←` / `→` change level.
- **Under 30 seconds** the digits and the level bar turn red and a red vignette
  comes up behind the board — loud enough to notice, dim enough to still read.
- **At zero** it plays a triple beep generated with the Web Audio API (no
  audio asset), vibrates on devices that support it, flashes the screen with
  the custom `invert-flicker` animation from
  [`globals.css`](src/app/globals.css), and advances to the next level.
  After the last level it pauses instead.
- **The clock doesn't drift.** While running, the remaining time is recomputed
  every 250 ms from a deadline timestamp, so it stays correct even when the
  browser throttles timers in a background tab.
- **The screen stays awake** while the clock runs (Screen Wake Lock API), so
  the phone on the table doesn't go to sleep mid-level.
- **It's a PWA.** Add it to your home screen and it works offline — a
  service worker ([`public/sw.js`](public/sw.js)) caches the app shell, and
  [`src/app/manifest.ts`](src/app/manifest.ts) provides the manifest and
  icons. The worker registers in production builds only.
- **Prev/next buttons** jump levels manually and reset the clock either way.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4

No component library: the handful of widget styles the app needs (buttons, the
rolling countdown digits, the level indicator) are defined by hand in
[`globals.css`](src/app/globals.css), which also holds the Tailwind CSS-first
config (`@theme`) — there is no `tailwind.config.ts`.

**Dark only, on purpose.** Poker happens in dim rooms; there is no light theme
to keep in sync. The type scales with the viewport (`clamp` on both `vw` and
`vh`), and on short landscape screens — a phone propped on its side — the board
switches to a side-by-side layout via the `squat` variant.

## Deploy

Static output, so any Node host works. Deploying to
[Vercel](https://vercel.com/new) needs no configuration.

## Maintenance

Dependabot opens npm PRs weekly ([`.github/dependabot.yml`](.github/dependabot.yml)),
and CI runs lint + typecheck + build on every PR
([`.github/workflows/ci.yml`](.github/workflows/ci.yml)).

`next` pins `postcss` to an old exact version (8.4.31) and caps `sharp` at
`^0.34.5`, both of which carry open advisories. `package.json` forces them
forward with npm `overrides` (`postcss: "$postcss"`, `sharp: "^0.35.3"`), which
is what keeps `npm audit` at zero. Don't drop those entries when bumping Next —
re-check whether Next has caught up first. And never run `npm audit fix --force`
here; it downgrades Next to 9.x.
