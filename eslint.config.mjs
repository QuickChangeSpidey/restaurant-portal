import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable `@typescript-eslint/no-explicit-any` to allow `any` type
      "@typescript-eslint/no-explicit-any": "off",

      // Disable warning for using <img> instead of Next.js <Image> component
      "@next/next/no-img-element": "off",

      // Disable warning for unescaped HTML entities like " or '
      "react/no-unescaped-entities": "off",

      // Disable exhaustive-deps for useEffect missing dependencies
      "react-hooks/exhaustive-deps": "off",

      // Disable unused variables check
      "@typescript-eslint/no-unused-vars": "off",
    }
  }
];

export default eslintConfig;
