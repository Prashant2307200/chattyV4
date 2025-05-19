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
        background_color: '#333',
        theme_color: '#333',
        icons: [
          {
            src: '/image.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/avatar.png',
            sizes: '266x261',
            type: 'image/png',
          },
        ],
        screenshots: [
          {
            src: "/screenshot1.png",
            sizes: "385x663",
            type: "image/png",
            form_factor: "narrow",
          },
          {
            src: "/screenshot2.png",
            sizes: "900x565",
            type: "image/png",
            form_factor: "wide", 
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,jpg,jpeg,json}'],
        runtimeCaching: [
          {
            urlPattern: /\/api\/ai\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'ai-responses',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
              backgroundSync: {
                name: 'ai-response-queue',
                options: {
                  maxRetentionTime: 24 * 60 // Retry for max 24h
                }
              }
            }
          },
          {
            urlPattern: /\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
              backgroundSync: {
                name: 'api-queue',
                options: {
                  maxRetentionTime: 24 * 60
                }
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
      },
    }),
  ], 

  build: {
    outDir: 'dist',
    sourcemap: true, // Enable source maps for debugging and best practices
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
