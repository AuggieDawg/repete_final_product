import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "out/**",
    "dist/**",
    "build/**",
    ".cache/**",
    "next-env.d.ts",
    "data/fixtures/*.live.xml",
    "data/fixtures/*.normalized.json"
  ])
]);

export default eslintConfig;
