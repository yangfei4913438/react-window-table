const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: require('./theme'),
  plugins: [
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
    require('daisyui'),
    plugin(function ({ addBase, theme }) {
      addBase({
        body: {
          backgroundColor: theme('backgroundColor.body'),
          color: theme('text.primary'),
        },
        'body::selection, body *::selection': {
          backgroundColor: 'hsla(var(--accent), 0.3)',
        },
      });
    }),
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/colors/themes')['[data-theme=light]'],
          primary: 'hsla(0, 0%, 8%)',
        },
        dark: {
          ...require('daisyui/src/colors/themes')['[data-theme=dark]'],
          primary: 'hsla(0, 0%, 96%)',
        },
      },
    ],
  },
  content: ['./src/**/*.@(js|jsx|ts|tsx|html)'],
  safelist: [
    'col-span-1',
    'col-span-2',
    'col-span-3',
    'col-span-4',
    'col-span-5',
    'col-span-6',
    'col-span-7',
    'col-span-8',
    'col-span-9',
    'col-span-10',
    'col-span-11',
    'col-span-12',
  ],
};
