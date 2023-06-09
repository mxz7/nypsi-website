module.exports = {
  pluginSearchDirs: false,
  plugins: [require("prettier-plugin-svelte"), require("prettier-plugin-tailwindcss")],
  overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
  printWidth: 100
};
