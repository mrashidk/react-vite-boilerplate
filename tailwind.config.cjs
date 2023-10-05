const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      height: {
        '10v': '10vh',
        '20v': '20vh',
        '30v': '30vh',
        '40v': '40vh',
        '50v': '50vh',
        '60v': '60vh',
        '70v': '70vh',
        '80v': '80vh',
        '90v': '90vh',
        '100v': '100vh',
      },
      width: {
        '10v': '10vw',
        '20v': '20vw',
        '30v': '30vw',
        '40v': '40vw',
        '50v': '50vw',
        '60v': '60vw',
        '70v': '70vw',
        '80v': '80vw',
        '90v': '90vw',
        '100v': '100vw',
        fill: '-webkit-fill-available',
      },
      scale: {
        200: '2',
      },
      colors: {
        'list-dark': '#222424',
      },
    },
  },
  plugins: [
    require('@savvywombat/tailwindcss-grid-areas'),
    require('@tailwindcss/forms')({
      strategy: 'base', // only generate global styles
      strategy: 'class', // only generate classes
    }),
    require('tailwindcss-themer')({
      defaultTheme: {
        // put the default values of any config you want themed
        // just as if you were to extend tailwind's theme like normal https://tailwindcss.com/docs/theme#extending-the-default-theme
        extend: {
          // colors is used here for demonstration purposes
          colors: {
            primary: 'red',
          },
        },
      },
      themes: [
        {
          // name your theme anything that could be a valid css selector
          // remember what you named your theme because you will use it as a class to enable the theme
          name: 'blue-theme',
          // put any overrides your theme has here
          // just as if you were to extend tailwind's theme like normal https://tailwindcss.com/docs/theme#extending-the-default-theme
          extend: {
            colors: {
              primary: '#4a148c',
              primaryLight: '#7c43bd',
              primaryDark: '#12005e',
              highlight: '#1e88e5',
              text: '#000',
            },
          },
        },
        {
          // name your theme anything that could be a valid css selector
          // remember what you named your theme because you will use it as a class to enable the theme
          name: 'red-theme',
          // put any overrides your theme has here
          // just as if you were to extend tailwind's theme like normal https://tailwindcss.com/docs/theme#extending-the-default-theme
          extend: {
            colors: {
              primary: '#ef4444',
              primaryLight: '#fca5a5',
              primaryDark: '#991b1b',
              highlight: '#fee2e2',
              text: '#ffffff',
            },
          },
        },
      ],
    }),
    plugin(({ theme, addUtilities }) => {
      const neonUtilities = {};
      const colors = theme('colors');
      for (const color in colors) {
        if (typeof colors[color] === 'object') {
          const color1 = colors[color][500];
          const color2 = colors[color][700];
          const colorLight1 = colors[color][200];
          const colorLight2 = colors[color][400];
          neonUtilities[`.neon-${color}`] = {
            'box-shadow': `0 0 5px ${color1}, 0 0 20px ${color2}`,
          };
          neonUtilities[`.neon-${color}-light`] = {
            'box-shadow': `0 0 2px ${colorLight1}, 0 0 10px ${colorLight2}`,
          };
        }
      }
      addUtilities(neonUtilities);
    }),
  ],
};
