import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-plugin-prettier";

export default [
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.browser },
    plugins: { js, prettier },
    extends: [
      "js/recommended",
      "plugin:prettier/recommended" // 👈 Prettier integration
    ],
    rules: {
      "prettier/prettier": ["error", { singleQuote: true, semi: true }]
    }
  }
];
