module.exports = {
  pluginSearchDirs: false,
  plugins: [require("prettier-plugin-svelte"), require("prettier-plugin-tailwindcss")],
  overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
  trailingComma: "none",
  printWidth: 100,
  tabWidth: 2,
  endOfLine: "lf"
};
