/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          hover: '#1d4ed8',
        },
        secondary: '#64748b',
      },
      spacing: {
        'section': '2rem',
        'container': '1rem',
      },
      borderRadius: {
        'container': '0.5rem',
      },
      animation: {
        'fadeInUp': 'fadeInUp 0.6s ease-out forwards',
        'fadeInLeft': 'fadeInLeft 0.6s ease-out forwards',
        'fadeInRight': 'fadeInRight 0.6s ease-out forwards',
        'fadeIn': 'fadeIn 0.3s ease-out forwards',
        'scaleIn': 'scaleIn 0.3s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'float-delayed': 'float-delayed 3s ease-in-out infinite 1.5s',
      },
    },
  },
  plugins: [],
}
