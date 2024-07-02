/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{html,js,ts,tsx,jsx}","./components/**/*.{html,js,ts,tsx,jsx}"],
  theme: {
    extend: {
      screens: {
        'max-w-1230': {'max': '1230px'},
        'max-w-1062': {'max': '1062px'},
        'max-w-830': {'max': '830px'},
        'max-w-620': {'max': '620px'},
        'max-w-500': {'max': '500px'},
        'max-w-400': {'max': '400px'},
      },
    },
  },
  plugins: [],
}