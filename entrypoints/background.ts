import { StorageActions, StorageKeys } from '@shared/enums';
import { PomodoroState } from '@shared/interfaces';

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
      case StorageActions.SavePomodoroState:
        savePomodoroState(message.state)
          .then(async () => {
            sendResponse({ success: true });
          })
          .catch((error) => sendResponse({ success: false, error: error.message }));
        return true;
      case StorageActions.GetPomodoroState:
        getPomodoroState()
          .then((pomodoroState) => sendResponse({ success: true, pomodoroState }))
          .catch((error) => sendResponse({ success: false, error: error.message }));
        return true;
      case StorageActions.ClearPomodoroState:
        clearPomodoroState()
          .then(() => sendResponse({ success: true}))
          .catch((error) => sendResponse({ success: false, error: error.message }));
        return true;
    }
  });

  async function savePomodoroState(state: PomodoroState): Promise<void> {
    try {
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
});
