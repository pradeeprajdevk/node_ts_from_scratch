const { rules } = require("eslint-config-prettier");

module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommened",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommened",
  ],
  parseOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {},
};
