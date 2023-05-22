module.exports = (ctx) => ({
  map: ctx.env === 'development' ? ctx.map : false,
  plugins: {
    tailwindcss: {},
    // postcss-nested 使用 Sass 语法。postcss-nesting使用 CSS 嵌套规范草案中的语法。
    'tailwindcss/nesting': 'postcss-nested',
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {
      stage: 3, // 使用stage为3的标准，同时允许嵌套规则(嵌套是stage 1的标准). 3是稳定阶段，基本上已经有浏览器厂商实现了，可以直接使用
      features: { 'nesting-rules': false },
      autoprefixer: {
        grid: true,
        flexbox: 'no-2009',
      },
    },
  },
});
