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
          default: 'Alt+Q',
          mac: 'Alt+Q'
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
