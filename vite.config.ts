import react from '@vitejs/plugin-react'
import { rmSync } from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'
import pkg from './package.json'

export default defineConfig(({ command, mode }) => {
  console.log('vite', { command, mode })

  rmSync('dist-electron', { recursive: true, force: true })
  rmSync('dist', { recursive: true, force: true })
  rmSync('release', { recursive: true, force: true })

  return {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src'),
        '@electron': path.join(__dirname, 'electron'),
      },
    },
    plugins: [
      react(),
      electron({
        main: {
          entry: 'electron/main/index.ts',

          vite: {
            build: {
              outDir: 'dist-electron/main',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          },
        },
        preload: {
          input: 'electron/preload/index.ts',
          vite: {
            build: {
              outDir: 'dist-electron/preload',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          },
        },

        renderer: {},
      }),
    ],

    clearScreen: false,
  }
})
