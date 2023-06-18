import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig, loadEnv, type UserConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default ({ mode }: UserConfig) => {
  process.env = { ...process.env, ...loadEnv(mode ?? 'development', process.cwd()) };

  return defineConfig({
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
    },
    plugins: [react(), eslint()],
    build: {
      outDir: 'dist2',
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, '.', 'stories'),
        lib: resolve(__dirname, '.', 'lib'),
      },
    },
  });
};
