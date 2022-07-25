import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  // base: './',
  plugins: [vue()],
  resolve: {
    alias: [{
      find: '@',
      replacement: resolve(__dirname, './src'),
    }],
  },
  // server: {
  //   host: '0.0.0.0',
  //   port: 3031,
  //   proxy: {
  //     '/api': {
  //       target: 'https://nest-api.buqiyuan.site/api/',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, '')
  //     }
  //   }
  // }
})
