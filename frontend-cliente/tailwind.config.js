/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // azul moderno (para botones, enlaces)
        secondary: "#facc15", // amarillo (resaltados)
        dark: "#1e293b", // azul oscuro
        light: "#f8fafc", // gris claro
        accent: "#10b981", // verde (confirmaciones, estados OK)
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
