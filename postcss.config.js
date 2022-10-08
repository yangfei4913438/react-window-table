module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nesting',
    tailwindcss: {},
    autoprefixer: {
      flexbox: 'no-2009',
    },
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {
      features: { 'nesting-rules': false },
    },
  },
};
