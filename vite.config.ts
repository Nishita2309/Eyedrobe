import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: [
        'favicon.svg',
      ],

      manifest: {
        id: '/',
        name: 'EyeDrope',
        short_name: 'EyeDrope',
        description: 'Your wardrobe. Your canvas. Your style.',

        start_url: '/',
        scope: '/',

        display: 'standalone',
        orientation: 'portrait-primary',

        theme_color: '#faf9f7',
        background_color: '#faf9f7',

        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})