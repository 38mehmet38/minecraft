import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8'
    }
  },
  build: {
    target: 'es2020'
  }
})
