/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  // theme: {
  //   extend: {
  //     colors: {
  //       accent: "#8b5cf6",
  //     },
  //   },
  // },

  plugins: [require("daisyui")],

  daisyui: {
    logs: false,
    themes: [
      {
        nypsi: {
          primary: "#8b5cf6",
          secondary: "#C7F65C",
          accent: "#5CF6D8",
          "base-100": "#0f172a",
          error: "#e31e3b",
          success: "#68f78c",
          "base-content": "#d9dce1",

          // https://www.canva.com/colors/color-wheel/
        },
      },
    ],
  },
};
