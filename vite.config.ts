import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  console.log('🚀 ~ file: vite.config.ts:7 ~ defineConfig ~ mode:', mode);
  console.log('🚀 ~ file: vite.config.ts:7 ~ defineConfig ~ command:', command);
  const boo = mode === 'development';
  const alias = {
    '@': resolve(__dirname, './src')
  };
  return {
    plugins: [
      react({
        jsxImportSource: '@emotion/react'
      })
    ],
    optimizeDeps: {
      include: ['@mui/icons-material', '@emotion/react', '@emotion/styled', '@mui/material/Tooltip']
    },
    resolve: {
      alias
    },
    css: {
      devSourcemap: boo
    },
    server: {
      host: '0.0.0.0',
      port: 5401,
      open: true
    },
    esbuild: {
      drop: !boo ? ['console', 'debugger'] : []
    },
    build: {
      // don't minify for debug builds
      minify: !boo ? 'esbuild' : false,
      // produce sourcemaps for debug builds
      sourcemap: boo,
      assetsDir: 'static',
      chunkSizeWarningLimit: 2100,
      esbuild: {
        drop: ['console', 'debugger']
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          },
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : [];
            const fileName = facadeModuleId[facadeModuleId.length - 2] || 'multikey';
            return `static/js/${fileName}/multikey.[hash].js`;
          },
          entryFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : [];
            const fileName = facadeModuleId[facadeModuleId.length - 2] || 'multikey';
            return `static/js/${fileName}/multikey.[hash].js`;
          }
        }
      }
    }
  };
});
