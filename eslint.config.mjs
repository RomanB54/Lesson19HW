import globals from "globals";
import pluginJs from "@eslint/js";
import jest from "eslint-plugin-jest";
import eslintRecommended from "eslint-plugin-prettier/recommended";

export default [
  eslintRecommended,
  {
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      "prefer-const": "warn",
      "no-unused-vars": "warn",
      "semi": "error",
    },
  },
  {
     files: ["src/**/*.js"], 
	 ...jest.configs["flat/recommended"],
  }
];