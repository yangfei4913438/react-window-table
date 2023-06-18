import peerDepsExternal from 'rollup-plugin-peer-deps-external'; // // 打包的时候用来排除 package.json 内 peerDependencies 字段内的包
import commonjs from '@rollup/plugin-commonjs'; // 可以处理commonjs类型的库
import json from '@rollup/plugin-json'; // 识别json文件, 自动摇树
import resolve from '@rollup/plugin-node-resolve'; // 可以让 Rollup 查找到外部模块
import { terser } from 'rollup-plugin-terser'; // 代码压缩
import typescript from 'rollup-plugin-typescript2'; // 处理ts文件
import postcss from 'rollup-plugin-postcss'; // 样式处理
import { visualizer } from 'rollup-plugin-visualizer'; // 打包分析
import { defineConfig } from 'rollup';
import alias from 'rollup-plugin-alias';

/** @type {import('rollup-plugin-typescript2').default} */
const tsOptions = {
  tsconfigOverride: {
    compilerOptions: {
      declaration: true,
    },
    // 排除的文件
    exclude: [
      'dist',
      'dist2',
      'node_modules',
      'src',
      'stories',
      'vite.config.ts',
      '**/*.md',
      '**/*.mdx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.story.ts',
      '**/*.story.tsx',
      '**/*.stories.ts',
      '**/*.stories.tsx',
      '*.d.ts',
      '**/*.d.ts',
      '**/*.d.cts',
      '**/*.d.mts',
    ],
    // 包括的文件
    include: ['lib/**/*.ts', 'lib/**/*.tsx'],
  },
};

/**
 * 打包提示：
 * 组件编写的时候，第三方库的打包，尽可能使用 submodules 的方式引入。
 * 否则可能会造成打包工具，不能正确的判断，将无关的内容也打包进来。
 *
 * 例如:
 *  import uniq from 'lodash-es/uniq';
 *  不要写成
 *  import { uniq } from 'lodash-es';
 * */

const rollupConfig = defineConfig([
  {
    // 入口文件
    input: 'lib/index.ts',
    // 排除外部依赖
    external: ['react', 'react-dom'],
    output: [
      {
        // 需要对排除的依赖作一个全局变量声明
        globals: {
          react: 'React',
          'react/jsx-runtime': 'jsxRuntime',
          'react-dom': 'ReactDom',
        },
        file: 'dist/index.umd.js',
        format: 'umd',
        name: 'react-window-table', // 全局变量的名称
        exports: 'named', // 导出的是全局变量命名
        plugins: [
          // 压缩js代码
          terser(),
          // 打包分析
          visualizer({
            template: 'treemap',
            open: false, // 查看打包结果分析
            gzipSize: true,
            brotliSize: true,
            filename: 'analyse.html', // will be saved in project's root
          }),
        ],
      },
      {
        file: 'dist/index.es.js',
        format: 'es',
        name: 'react-window-table', // 全局变量的名称
      },
    ],
    // rollup的插件都是函数，这些函数之间是有执行顺序的。
    plugins: [
      alias({
        entries: [{ find: '@', replacement: 'src' }],
      }),
      json(),
      peerDepsExternal(),
      postcss({
        inject: true,
        use: {
          sass: true,
          stylus: null,
          less: null,
        },
        extract: false,
      }),
      resolve(),
      commonjs(),
      typescript(tsOptions),
    ],
  },
]);

export default rollupConfig;
