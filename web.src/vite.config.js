import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'
import fs from "fs-extra"

// auto copy vditor dist
try {
  fs.copySync('node_modules/vditor/dist', 'public/vditor-cdn/dist', {})
  console.log('Copy vditor dist as local cdn success!')
} catch (err) {
  console.error(err)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    ElementPlus({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  base: '/',

  clearScreen: false,
  envPrefix: ["VITE_"],
  build: {
    outDir: '../web/',
    emptyOutDir: true,
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          "vue": ["vue"],
          "vditor": ["vditor"],
          "element-plus": ["element-plus"],
        }
      },
    }
  },
});
