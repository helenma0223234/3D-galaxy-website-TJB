/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#05160e",
        secondary: "#cedddc",
        tertiary: "#192a29",
        "black-100": "#100d25",
        "black-200": "#090325",
        "white-100": "#f3f3f3",
        "primary-green": "#adf794",
        "secondary-green": "#c8f75b",
        "accent": "#ccccff",
        "neutral": "#1A1F23", 
        "base-100": "#3A393C",
        "info": "#73CEF2",
        "success": "#31D38A",
        "warning": "#EFBE5D",
        "error": "#E7556E",
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
      },
      screens: {
        xs: "450px",
      },
      // backgroundImage: {
      //   "hero-pattern": "url('/src/assets/star-bg.jpg')",
      // },
    },
  },
  plugins: [],
}

