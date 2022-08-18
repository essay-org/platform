import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  // base: './',
  plugins: [vue(), vueJsx({})],
  resolve: {
    alias: [{
      find: '@',
      replacement: resolve(__dirname, './src'),
    }],
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3031,
    proxy: {
      '/api': {
        target: 'https://nest-api.buqiyuan.site/api/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
