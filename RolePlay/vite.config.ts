import react from '@vitejs/plugin-react-swc';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import * as path from 'node:path';
import postcssNested from 'postcss-nested';
import { defineConfig } from 'vite';

type args = {
  mode: 'development' | 'production' | 'test';
}

export default ({ mode }: args) => {
  const isProduction = mode === 'production';
  const isTest = mode === 'test';

  return defineConfig({
    plugins: [
      react(),
    ],
    base: './',
    resolve: {
      alias: {
        'App': path.resolve('Src/App'),
        'Shared': path.resolve('Src/Shared'),
      },
      extensions: ['.tsx', '.ts', '.css', '.jpg', 'mp3'],
    },
    css: {
      devSourcemap: !isProduction,
      modules: {
        generateScopedName: isProduction || isTest ? '[hash:base64:8]' : '[path][name]__[local]___[hash: base64: 5]'
      },
      postcss: {
        plugins: [
          cssnano({
            preset: isProduction || isTest ? 'default' : false,
          }),
          autoprefixer,
          postcssNested,
        ],
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
        },
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          },
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            let extType = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'img';
            }
            return `assets/${extType}/[name]-[hash][extname]`;
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
        },
      },
      outDir: './electron/dist-electron/win-unpacked/resources/wwwroot',
      emptyOutDir: true,
      sourcemap: !isProduction,
      assetsInlineLimit: 4096,
    },
  });
};
