module.exports = {
    extends: ["airbnb-base", "prettier"],
    overrides: [
      {
        env: {
          node: true,
        },
        files: [".eslintrc.{js,cjs}"],
        parserOptions: {
          sourceType: "script",
        },
      },
    ],
    parserOptions: {
      ecmaVersion: "latest",
    },
    rules: {
      "no-console": "off",
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: ["**/*.test.js"],
        },
      ],
      "no-await-in-loop": "off",
      "import/extensions": "off",
      "import/no-dynamic-require": "off",
      "import/no-unresolved": "off",
      "radix": "off",
      "no-restricted-syntax": "off",
      "guard-for-in": "off",
      "array-callback-return": "off"
    },
  };
