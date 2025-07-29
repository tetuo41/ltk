import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://ltk-tournament.example.com',
  output: 'static',
  adapter: node({
    mode: 'standalone'
  }),
  server: {
    port: 4321,
    host: '0.0.0.0'
  },
  build: {
    assets: 'assets'
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // Add global SCSS variables if needed
        }
      }
    }
  }
});