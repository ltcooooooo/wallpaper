import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            alias: {
              'ms': 'material-symbols'
            },
          })
        ],
      }),
      Components({
        resolvers: [
          IconsResolver({
            enabledCollections: ['ep', 'material-symbols', 'solar'],
            alias: {
              'ms': 'material-symbols' // 设置别名
            }
          }),
          ElementPlusResolver()
        ],
      }),
      Icons({
        autoInstall: true
      }),
    ]
  }
})
