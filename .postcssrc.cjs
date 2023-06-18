module.exports = (ctx) => ({
  map: ctx.env === 'development' ? ctx.map : false,
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('postcss-flexbugs-fixes'),
    require('postcss-preset-env')({
      stage: 3,
      features: { 'nesting-rules': false },
      autoprefixer: {
        grid: true,
        flexbox: 'no-2009',
      },
    }),
    ctx.env !== 'development' && require('cssnano'),
  ],
});
