import { defineConfig } from 'vite';

export default defineConfig({
  // 配置选项
  root: './src',
  base: './',
  server: {
    port: 3000,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});