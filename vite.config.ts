import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  base: '/systems/bardamigo/',
  server: {
    port: 30001,
    open: false,
    proxy: {
      '^(?!/systems/bardamigo)': 'http://localhost:30000',
      '/socket.io': {
        target: 'ws://localhost:30000',
        ws: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      name: 'bardamigo',
      entry: path.resolve(__dirname, 'src/bardamigo.ts'),
      formats: ['es'],
      fileName: () => 'bardamigo.js',
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'styles/bardamigo.css';
          }
          return assetInfo.name || '[name].[ext]';
        },
      },
    },
  },
});
