import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import { dirname } from "path";
import tseslint from "typescript-eslint";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const nextEslintConfig = [
  ...compat.extends("next"),

  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  nextEslintConfig
);
