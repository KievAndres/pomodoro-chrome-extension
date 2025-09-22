import { defineConfig } from 'wxt';
import { resolve } from 'path';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  vite: () =>  ({
    resolve: {
      alias: {
        '@components': resolve(__dirname, 'entrypoints/popup/components'),
        '@shared': resolve(__dirname, 'entrypoints/popup/shared'),
      }
    }
  })
});
