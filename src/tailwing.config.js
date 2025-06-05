/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          citi: {
            blue: '#056DAE',
            navy: '#003d6b',
            red: '#DC143C',
            gray: '#666666',
            lightgray: '#F5F5F5',
          }
        }
      },
    },
    plugins: [],
  }