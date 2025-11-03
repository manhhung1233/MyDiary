/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#FFB8CC",
        'blue-dark': "#FF91A4",
        secondary: "#FFB8D9",
        'text-light': "#1E40AF",
        dark: {
          DEFAULT: "#111928",
          2: "#1f2a37",
          3: "#374151",
          6: "#9ca3af",
          700: "#090e34b3",
        },
        'body-color': "#637381",
        'body-secondary': "#8899a8",
        stroke: "#dfe4ea",
        'gray-1': "#f9fafb",
        'gray-2': "#f3f4f6",
        'gray-7': "#ced4da",
      },
      boxShadow: {
        'form': '0px 1px 55px -11px rgba(0, 0, 0, 0.01)',
      },
    },
  },
  plugins: [],
}
