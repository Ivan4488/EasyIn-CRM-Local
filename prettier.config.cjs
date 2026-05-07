/** @type {import("prettier").Config} */
const config = {
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  bracketSpacing: true,
  printWidth: 120,
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
};

module.exports = config;
