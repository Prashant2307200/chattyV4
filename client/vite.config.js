import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

const ReactCompilerConfig = { /* ... */ };

export default defineConfig({

  base: '/',

  plugins: [

    react({
      babel: {
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }),

    tailwindcss(),

    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      // strategies: 'generateSW',
      srcDir: 'src',
      filename: 'sw.js',
      includeAssets: ['apple-touch-icon.png', 'image.png', 'avatar.png', 'favicon.ico', 'robots.txt', 'screenshot1.png', 'screenshot2.png'],
      manifest: {
        name: 'Chatty',
        short_name: 'Chatty',
        description: 'A real-time chat application built with React and Socket.io.',
        start_url: '.',
        scope: '/',
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
        inlineWorkboxRuntime: true,
        runtimeCaching: [
          {
            urlPattern: /\/api\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              },
              cacheableResponse: {
                statuses: [200],
              },
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets'
            }
          }
        ],
      },
      injectManifest: {
        swSrc: 'src/sw.js',
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],

  build: {
    "outDir": 'dist',
    "sourcemap": true,
    "assetsDir": 'assets',
    "rollupOptions": {
      "output": {
        "manualChunks": {
          "react": ["react", "react-dom"],
          "tailwindcss": ["tailwindcss"],
          "axios": ["axios"],
          "zustand": ["zustand"],
          "lucide-react": ["lucide-react"],
          "motion": ["motion/react"]
        }
      }
    }
  },

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  }
});
