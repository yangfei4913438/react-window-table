module.exports = (ctx) => ({
  map: ctx.env === 'development' ? ctx.map : false,
  plugins: [
    require('tailwindcss'),
    require('postcss-nested'),
    require('postcss-flexbugs-fixes'),
    require('postcss-preset-env')({
      stage: 3, // 使用stage为3的标准，同时允许嵌套规则(嵌套是stage 1的标准). 3是稳定阶段，基本上已经有浏览器厂商实现了，可以直接使用
      features: { 'nesting-rules': false },
      autoprefixer: {
        grid: true,
        flexbox: 'no-2009',
      },
    }),
    ctx.env !== 'development' && require('cssnano'),
  ],
});
