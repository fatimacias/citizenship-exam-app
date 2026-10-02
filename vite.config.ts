import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Civics Study — US Citizenship Exam Prep',
        short_name: 'Civics Study',
        description: 'Practice the US citizenship civics and English exam offline, with personalized state officials.',
        theme_color: '#2a5bd7',
        background_color: '#f7f7fb',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Precache the app shell + data so study/practice works fully offline.
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
      devOptions: {
        // Lets us verify installability/offline behavior against `vite dev`, not just prod builds.
        enabled: true,
      },
    }),
  ],
})
