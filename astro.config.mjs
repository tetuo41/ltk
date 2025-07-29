import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  site: 'https://ltk-fansite.netlify.app',
  output: 'static',
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