module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    project: ["./tsconfig.json"],
  },
  rules: {
    "@typescript-eslint/ban-ts-comment": "off",
    "react/prop-types": "off",
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "parent", "sibling", "index"],
        pathGroupsExcludedImportTypes: [],
        alphabetize: { order: "asc" },
        "newlines-between": "never",
      },
    ],
    // FIXME: delete
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
  root: true,
  settings: {
    "import/resolver": {
      node: {
        extensions: [".json", ".ts"],
        moduleDirectory: ["node_modules", "src/"],
      },
    },
  },
  ignorePatterns: ["prisma/seed.ts"],
};
