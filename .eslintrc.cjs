const path = require('path');

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    // 1. 继承 .prettierrc.cjs 文件规则
    // 2. 开启rules的 "prettier/prettier": "error"
    // 3. eslint fix 的同时执行 prettier 格式化
    'plugin:prettier/recommended',
    'plugin:storybook/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['simple-import-sort', 'react-refresh'],
  rules: {
    'no-nested-ternary': 0,
    'no-return-assign': 0,
    'no-param-reassign': 0,
    'no-restricted-syntax': 0,
    'no-plusplus': 0,
    'no-console': 0,
    'no-void': 0,
    'no-undef': 0,

    'consistent-return': 0,

    'tailwindcss/no-custom-classname': 0,

    'import/prefer-default-export': 0,
    'import/no-unresolved': 0,

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
    'react-refresh/only-export-components': 0,

    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,

    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-shadow': 0,
    '@typescript-eslint/naming-convention': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/no-var-requires': 0,

    'simple-import-sort/imports': 2,
    'simple-import-sort/exports': 2,
    'import/first': 2,
    'import/newline-after-import': 2,
    'import/no-duplicates': 2,
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
    tailwindcss: {
      config: 'tailwind.config.cjs',
      cssFiles: ['**/*.scss', '!**/node_modules', '!**/dist', '!**/build'],
      removeDuplicates: true,
      skipClassAttribute: false,
      whitelist: [],
    },
  },
  ignorePatterns: ['**/*.scss', '**/*.css'],
};
