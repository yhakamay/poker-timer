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

Everything lives in a single client component, [`src/app/page.tsx`](src/app/page.tsx),
which owns all the state — `time`, `sb`, `level`, `paused`:

- **9 blind levels**, 10 minutes each. Both are constants at the top of
  `page.tsx` (`initialTime`, `initialSb`) — change them there.
- **Blind schedule** is the `calculateSb` function at the bottom of `page.tsx`.
  It multiplies the initial small blind by `1, 2, 3, 5, 10, 15, 20, 40, 80`.
  BB is always 2×SB, computed in [`sb-bb.tsx`](src/components/sb-bb.tsx).
- **Under 30 seconds** the background turns red (`bg-error`).
- **At zero** it plays [`public/beep.mp3`](public/beep.mp3), flashes the screen
  with the custom `invert-flicker` animation from
  [`globals.css`](src/app/globals.css), and advances to the next level.
  After level 9 it pauses instead.
- **Prev/next buttons** jump levels manually; a `useEffect` keyed on `level`
  resets the clock and recalculates blinds either way.

State is in-memory only — a page refresh restarts at level 1.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4

No component library: the handful of widget styles the app needs (buttons, the
rolling countdown digits, the level indicator) are defined by hand in
[`globals.css`](src/app/globals.css), which also holds the Tailwind CSS-first
config (`@theme`) — there is no `tailwind.config.ts`.

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
