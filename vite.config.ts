import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // <--- Usa il percorso relativo, risolve il 404 al 100%
  build: {
    outDir: 'dist',
  }
})