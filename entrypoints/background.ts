import { DEFAULT_POMODORO_CONFIG } from '@shared/config/defaults';
import { StorageActions } from '@shared/enums/StorageActions';
import { StorageKeys } from '@shared/enums/StorageKeys';
import { PomodoroConfig } from '@shared/interfaces/PomodoroConfig';
import { PomodoroState } from '@shared/interfaces/PomodoroState';
import { validateConfig } from '@shared/utils/config';

export default defineBackground(() => {
  const {
    SavePomodoroState,
    GetPomodoroState,
    ClearPomodoroState,
    SavePomodoroConfig,
    GetPomodoroConfig,
    ResetPomodoroConfig,
  } = StorageActions;
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('message', message);

    switch (message.action) {
      case SavePomodoroState:
        savePomodoroState(message.state)
          .then(() => sendResponse({ success: true }))
          .catch((error) => sendResponse({ success: false, error: error.message }));
        return true;
      case GetPomodoroState:
        getPomodoroState()
          .then((state) => sendResponse({ success: true, state }))
          .catch((error) => sendResponse({ success: false, error: error.message }));
        return true;
      case ClearPomodoroState:
        clearPomodoroState()
          .then(() => sendResponse({ success: true }))
          .catch((error) => sendResponse({ success: false, error: error.message }));
        return true;

      // Config
      case SavePomodoroConfig:
        savePomodoroConfig(message.config)
          .then(() => sendResponse({ success: true }))
          .catch((error) => sendResponse({ success: false, error: error.message }));
        return true;
      case GetPomodoroConfig:
        getPomodoroConfig()
          .then((config) => sendResponse({ success: true, config }))
          .catch((error) => sendResponse({ success: false, error: error.message }));
        return true;
      case ResetPomodoroConfig:
        resetPomodoroConfig()
          .then(() => sendResponse({ success: true }))
          .catch((error) => sendResponse({ success: false, error: error.message }));
        return true;
      default:
        sendResponse({ success: false, error: 'Unkown action' });
    }
  });

  async function savePomodoroState(state: PomodoroState): Promise<void> {
    try {
      console.log('saving...', state);

      await browser.storage.local.set({
        [StorageKeys.PomodoroState]: state,
      });
    } catch (error) {
      console.error('Error saving pomodoro state:', error);
      throw error;
    }
  }

  async function getPomodoroState(): Promise<PomodoroState | null> {
    try {
      const result = await browser.storage.local.get(StorageKeys.PomodoroState);
      return result[StorageKeys.PomodoroState] || null;
    } catch (error) {
      console.error('Error getting pomodoro state:', error);
      throw error;
    }
  }

  async function clearPomodoroState(): Promise<void> {
    try {
      await browser.storage.local.remove(StorageKeys.PomodoroState as string);
    } catch (error) {
      console.error('Error clearing pomodoro state:', error);
      throw error;
    }
  }

  // Config
  async function savePomodoroConfig(config: PomodoroConfig): Promise<void> {
    try {
      const validatedConfig = validateConfig(config);
      await browser.storage.local.set({
        [StorageKeys.PomodoroConfig]: validatedConfig,
      });
    } catch (error) {
      console.error('Error saving pomodoro config:', error);
      throw error;
    }
  }

  async function getPomodoroConfig(): Promise<PomodoroConfig> {
    try {
      const result = await browser.storage.local.get(StorageKeys.PomodoroConfig);
      const config = result[StorageKeys.PomodoroConfig];

      if (!config) {
        return DEFAULT_POMODORO_CONFIG;
      }

      return validateConfig(config);
    } catch (error) {
      console.error('Error getting pomodoro config:', error);
      throw error;
    }
  }

  async function resetPomodoroConfig(): Promise<void> {
    try {
      await browser.storage.local.remove(StorageKeys.PomodoroConfig as string);
    } catch (error) {
      console.error('Error resetting pomodoro config:', error);
      throw error;
    }
  }
});
