import { DEFAULT_POMODORO_CONFIG } from '@shared/defaults';
import { DEFAULT_POMODORO_STATE } from '@shared/defaults/defaultPomodoroState';
import { BackgroundActions, StorageKeys } from '@shared/enums';
import { PomodoroConfig, PomodoroState } from '@shared/interfaces';
import { getNextPomodoroStatus } from '@shared/utils';

export default defineBackground(() => {
  browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    switch (message.action) {
      case BackgroundActions.SavePomodoroState:
        savePomodoroState(message.state)
          .then(async () => {
            sendResponse({ success: true });
          })
          .catch((error) => sendResponse({ success: false, error: error.message }));
        return true;
      case BackgroundActions.GetPomodoroState:
        getPomodoroState()
          .then((pomodoroState) => sendResponse({ success: true, pomodoroState }))
          .catch((error) => sendResponse({ success: false, error: error.message }));
        return true;
      case BackgroundActions.ClearPomodoroState:
        clearPomodoroState()
          .then(() => sendResponse({ success: true}))
          .catch((error) => sendResponse({ success: false, error: error.message }));
        return true;
      case BackgroundActions.StartSession:
        await startSession();
        return true;
    }
  });

  async function savePomodoroState(newPomodoroState: PomodoroState): Promise<void> {
    try {
      await browser.storage.local.set({
        [StorageKeys.PomodoroState]: newPomodoroState,
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

  async function savePomodoroConfig(newPomodoroConfig: PomodoroConfig): Promise<void> {
    try {
      await browser.storage.local.set({
        [StorageKeys.PomodoroConfig]: newPomodoroConfig
      });
    } catch (error) {
      console.error('Error saving pomodoro config', error);
      throw error;
    }
  }

  async function getPomodoroConfig(): Promise<PomodoroConfig | null> {
    try {
      const result = await browser.storage.local.get(StorageKeys.PomodoroConfig);
      return result[StorageKeys.PomodoroConfig] || null;
    } catch (error) {
      console.error('Error getting pomodoro config', error);
      throw error;
    }
  }

  async function clearPomodoroConfig(): Promise<void> {
    try {
      await browser.storage.local.remove(StorageKeys.PomodoroConfig as string);
    } catch (error) {
      console.error('Error clearing pomodoro config', error);
      throw error;
    }
  }

  async function startSession(): Promise<void> {
    try {
      const pomodoroState: PomodoroState = await getPomodoroState() || DEFAULT_POMODORO_STATE;
      const pomodoroConfig: PomodoroConfig = await getPomodoroConfig() || DEFAULT_POMODORO_CONFIG;

      const nextPomodoroStatus = getNextPomodoroStatus(pomodoroState.status);
      const sessionDuration = pomodoroConfig.focusDuration;
      const startTime = Date.now();
      const endTime = startTime
    } catch (error) {
      console.error('Error starting pomodoro', error);
    }
  }

  browser.runtime.onInstalled.addListener(async () => {
    const defaultPomodoroConfig: PomodoroConfig = DEFAULT_POMODORO_CONFIG;
    const defaultPomodoroState: PomodoroState = DEFAULT_POMODORO_STATE;
    await savePomodoroConfig(defaultPomodoroConfig);
    await savePomodoroState(defaultPomodoroState);
  })
});
