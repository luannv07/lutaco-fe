import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    commonjsOptions: {
      include: [/node_modules/, /zone.js/], // Explicitly include zone.js for CommonJS processing
    },
  },
});
