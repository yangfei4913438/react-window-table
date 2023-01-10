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
  ],
  daisyui: {
    themes: [
      {
        light: {
          primary: '#111827',
          secondary: '#f3f4f6',
          accent: '#37CDBE',
          neutral: '#3D4451',
          'base-100': '#FFFFFF',
          info: '#3ABFF8',
          success: '#22c55e',
          warning: '#FBBD23',
          error: '#e11d48',
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
