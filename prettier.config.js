module.exports = {
  plugins: [require('prettier-plugin-tailwindcss')],
  overrides: [
    {
      files: '*.{js,ts,jsx,tsx,css,scss,json,md,mdx,yaml,yml}',
      options: {
        semi: true, // 使用分号
        singleQuote: true, // 使用单引号而不是双引号
        tabWidth: 2, // 锁进宽度
        trailingComma: 'es5', // 在 ES5 中有效的尾随逗号（对象、数组等）。TypeScript 中的类型参数中没有尾随逗号
        printWidth: 100, // 每行宽度
        bracketSameLine: false, // 闭合符号在单独一行
      },
    },
  ],
};
