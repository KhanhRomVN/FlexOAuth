import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path';
import copy from 'rollup-plugin-copy';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        newtab: resolve(__dirname, 'index.html'),
        popup: resolve(__dirname, 'popup.html'),
        background: resolve(__dirname, 'src/background/service-worker.ts'),
      },
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      },
      plugins: [
        copy({
          targets: [
            { src: 'manifest.json', dest: 'dist' },
            { src: 'src/assets/icons/icon.png', dest: 'dist' }
          ],
          copyOnce: true,
          flatten: false
        })
      ]
    },
    outDir: 'dist'
  },
  server: {
    port: 5173,
    headers: mode === 'development'
      ? {}
      : {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
  },
  define: {
    'process.env': {}
  }
}))