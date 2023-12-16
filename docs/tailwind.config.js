/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", "[data-theme='dark']"],
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        accent: {
          light: "#1e40af",
          dark: "#7dd3fc",
        },
      },
    },
  },
  plugins: [],
};
