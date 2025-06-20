import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    proxy: {
      '/sendOTP': 'http://localhost:3000/',
      '/verifyOTP': 'http://localhost:3000/',
      '/registerUser': 'http://localhost:3000/',
      '/updateDisplayName': 'http://localhost:3000/',
      '/submit': 'http://localhost:3000/',
      '/entries': 'http://localhost:3000/',
      '/deleteTask': 'http://localhost:3000/',
      '/editTask': 'http://localhost:3000/',
      '/complete': 'http://localhost:3000/',
      '/logout': 'http://localhost:3000/',
    }
  },
  build: {
    outDir: 'dist'
  }
})
