import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    includedRoutes() {
      return [
        '/',
        '/pricing',
        '/glossaire',
        '/faq',
        '/login',
        '/reset-password',
        '/aio-coaching',
        '/aio-ecommerce',
        '/aio-immobilier',
        '/aio-restauration',
        '/aio-rh',
        '/aio-sante',
      ]
    },
  },
})
