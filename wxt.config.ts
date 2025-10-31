import { defineConfig } from 'wxt';
import { resolve } from 'path';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['storage', 'alarms', 'contextMenus', 'notifications'],
    action: {
      default_title: 'Pomodoro'
    }
  },
  vite: () => ({
    resolve: {
      alias: {
        '@shared': resolve(__dirname, 'entrypoints/popup/shared')
      }
    }
  })
});
