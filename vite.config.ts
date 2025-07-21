/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  esbuild: {
    supported: {
      "top-level-await": true,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['three'],
          bim: ['@thatopen/components', '@thatopen/components-front', '@thatopen/ui', '@thatopen/ui-obc'],
          fragments: ['@thatopen/fragments', 'web-ifc']
        }
      }
    }
  },
  server: {
    headers: {
      'Service-Worker-Allowed': '/'
    }
  }
});
