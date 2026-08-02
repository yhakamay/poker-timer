import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Pinned to eslint-config-next 15 on purpose. v16 ships native flat config
// (drop FlatCompat and import eslint-config-next/core-web-vitals directly),
// but it also enables react-hooks/set-state-in-effect, which flags the two
// setState-in-effect calls in src/app/page.tsx. Bump it together with that
// refactor, not before.
const eslintConfig = [
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
