import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({ 

  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Chatty',
        short_name: 'Chatty',
        description: 'A real-time chat application built with React and Socket.io.',
        start_url: '.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2EB9DF',
        icons: [
          {
            src: '/image.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/avatar.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,jpg,jpeg,json}'],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ], 

  build: {
    outDir: 'dist',
  },

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
    },
  }
});
