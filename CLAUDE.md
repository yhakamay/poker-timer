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
  (`time`, `sb`, `level`, `paused`) plus the `calculateSb` blind schedule.
  Level count (9) and level length (`initialTime`) are constants here.
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
- **Level count is hardcoded in three places** — the `9` bounds in `page.tsx`,
  the `maxLevel` in `prev-next-button.tsx`, and the nine hand-written `<li>`
  elements in `blind-level.tsx`. Changing the schedule means touching all three.
- **`calculateSb` throws** on any level outside 1–9 rather than clamping.
- `npm audit` reports 3 high advisories from `postcss`/`sharp` bundled inside
  `next`. Not actionable here; they clear on the next Next.js release. Do not
  run `npm audit fix --force` — it downgrades Next to 9.x.
