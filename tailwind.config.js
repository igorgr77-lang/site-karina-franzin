/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./eventos/**/*.template.html",
    "./eventos/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        'brand-yellow': '#FFD100',
        'brand-blue': '#0060AD',
        'brand-dark': '#1A1A1A',
        'brand-green': '#3a6125',
        'brand-purple': '#a855f7',
        'brand-orange': '#FF6B00',
        'lord-green': '#2D4F1E',
        'lord-gold': '#D4AF37',
        'peach': '#FFB3A7',
        'strava': '#FC4C02',
        'wpp': '#25D366',
        'dark': '#111111',
        'darker': '#0a0a0a',
        'card': '#1a1a1a',
        brand: {
          dark: '#0B0C10',
          darkGray: '#1F2833',
          amber: '#D4AF37',
          amberLight: '#F3E5AB',
          orange: '#FF4F00',
          orangeHover: '#E04300'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
        oswald: ['Oswald', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}
