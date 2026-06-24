/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          gold: {
            50: '#FDF8F0',
            100: '#F9EDD5',
            200: '#F3D7A3',
            300: '#EBC071',
            400: '#E0A83F',
            500: '#D4940D',
            600: '#B37B0B',
            700: '#926209',
            800: '#704A07',
            900: '#4F3305',
          },
          ivory: {
            50: '#FFFFFD',
            100: '#FFFDF7',
            200: '#FFF9EB',
            300: '#FFF3D6',
            400: '#FFEBBF',
            500: '#F5E6D3',
          },
        },
        fontFamily: {
          serif: ['Playfair Display', 'Georgia', 'serif'],
          sans: ['Inter', 'Poppins', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }