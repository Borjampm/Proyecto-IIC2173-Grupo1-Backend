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
      "no-await-in-loop": "off"
    },
  };
