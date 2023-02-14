/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  important: '#__next',
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      display: ['group-hover'],
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
