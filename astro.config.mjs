import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    sitemap({
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date(),
      entryLimit: 10000,
      // Custom sitemap entries
      customPages: [
        'https://ltk-sbb.shiai.games/',
        'https://ltk-sbb.shiai.games/#standings',
        'https://ltk-sbb.shiai.games/#teams',
        'https://ltk-sbb.shiai.games/#schedule'
      ]
    })
  ],
  site: 'https://ltk-sbb.shiai.games',
  output: 'static',
  server: {
    port: 4321,
    host: '0.0.0.0'
  },
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto'
  },
  compressHTML: true,
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // Add global SCSS variables if needed
        }
      }
    },
    build: {
      cssMinify: true,
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    }
  }
});