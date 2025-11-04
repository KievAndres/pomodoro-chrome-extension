import { defineConfig } from 'wxt';
import { resolve } from 'path';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['storage', 'alarms', 'contextMenus', 'notifications'],
    action: {
      default_title: 'Pomodoro'
    },
    commands: {
      'start-next-session': {
        suggested_key: {
          default: 'Alt+Shift+J',
          mac: 'Alt+Shift+J'
        },
        description: 'Start next Pomodoro session'
      }
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
