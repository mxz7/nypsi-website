/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {},
  },
  /* eslint-disable */
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
