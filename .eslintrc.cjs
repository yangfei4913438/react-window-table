const path = require('path');

module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true, commonjs: true },
  extends: [
    'eslint:recommended',
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:import/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    // 1. 继承 .prettierrc.cjs 文件规则
    // 2. 开启rules的 "prettier/prettier": "error"
    // 3. eslint fix 的同时执行 prettier 格式化
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['react-refresh'],
  rules: {
    'no-nested-ternary': 0,
    'no-return-assign': 0,
    'no-param-reassign': 0,
    'no-restricted-syntax': 0,
    'no-plusplus': 0,
    'no-console': 0,

    'consistent-return': 0,

    'import/prefer-default-export': 0,

    'react/function-component-definition': 0,
    'react/react-in-jsx-scope': 0,
    'react/require-default-props': 0,
    'react/jsx-no-constructed-context-values': 0,
    'react/jsx-props-no-spreading': 0,
    'react/no-array-index-key': 0,
    'react/no-unknown-property': 0,
    'react/no-unescaped-entities': 0,
    'react/no-unstable-nested-components': 0,

    'react-hooks/exhaustive-deps': 1,
    'react-refresh/only-export-components': 1,

    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,

    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-shadow': 0,
    '@typescript-eslint/naming-convention': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-unused-vars': 0,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        project: path.join(__dirname, './tsconfig.json'), // 读取ts配置文件
        alwaysTryTypes: true, // always try to resolve types under
      },
    },
  },
  ignorePatterns: ['.eslintrc.cjs'],
};
