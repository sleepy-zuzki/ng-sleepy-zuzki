/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        sleepy: {
          DEFAULT: '#f5a623',        // Principal: Color cálido, sigue siendo tu color principal.
          hover: '#d4881c',          // Hover en modo claro: Un tono más oscuro para indicar interacción.
          light: '#ffd89f',          // Fondo inputs activos (modo claro): Suave y legible.
          dark: '#9a5c0d',           // Hover en modo oscuro: Color más oscuro, asegurando contraste.
          muted: '#ffe8c2',          // Inputs deshabilitados: Tonos más suaves para resaltar el estado inactivo.
          disabled: '#fbd69e',       // Botón deshabilitado: Mantén el tono, pero un poco más grisáceo.
          content: '#3b2d14',        // Texto sobre sleepy: Un marrón oscuro para legibilidad sobre fondos claros.
        },

        sleepyBg: {
          light: '#fffaf5',          // Fondo general claro: Suave y neutral.
          dark: '#1c1205',           // Fondo general oscuro: Profundo y oscuro para el modo nocturno.
        },

        sleepyText: {
          light: '#2c1c00',          // Texto principal claro: Color oscuro y legible sobre fondos claros.
          dark: '#ffe8c2',           // Texto principal oscuro: Claro, pero no tan brillante para no perder legibilidad.
        },

        sleepySurface: {
          light: '#fff8f0',          // Fondo de superficie claro: Similar al fondo general, suave y cálido.
          dark: '#2b1a0a',           // Fondo de superficie oscuro: Contrasta bien con texto y botones oscuros.
        },
      },
    },
  },
  darkMode: 'media',
  plugins: [],
}

