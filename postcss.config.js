module.exports = {
  plugins: {
    'postcss-import': {},
    // postcss-nested 使用 Sass 语法。postcss-nesting使用 CSS 嵌套规范草案中的语法。
    'tailwindcss/nesting': 'postcss-nested',
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
