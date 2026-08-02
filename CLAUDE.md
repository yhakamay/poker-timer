# poker-timer

Single-page poker blind timer. Next.js 15 App Router, React 19, TypeScript,
Tailwind 3, daisyUI 5. No tests, no backend, no database.

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
- `tailwind.config.ts` — daisyUI plugin registration and the custom
  `invert-flicker` keyframes.

## Gotchas

- **daisyUI 5 on Tailwind 3.** Unsupported upstream but working. daisyUI is
  registered as a v3 plugin (`plugins: [require("daisyui")]`), not via the v4
  `@plugin` CSS directive. Upgrading either package means upgrading both and
  rewriting `globals.css` to the CSS-first config.
- **Two deps are pinned deliberately** — `tailwindcss` (3.x) and `daisyui`
  (5.0.9). Each was tested and rejected; see "Pinned dependencies" in README.md
  before bumping. Close Dependabot PRs for these rather than merging them.
- **A green build does not mean the UI works.** daisyui 5.5.14 passes lint,
  typecheck, and build while the countdown digits silently stop rendering. For
  any Tailwind/daisyUI change, check the real page: `.countdown span`'s
  `::before` content should be the `"00\a 01\a …"` digit string, and
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
