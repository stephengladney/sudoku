/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { museo: ["MuseoModerno"] },
    },
  },
  plugins: [require("daisyui")],
}
