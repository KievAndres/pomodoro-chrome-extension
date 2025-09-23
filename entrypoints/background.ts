import { StorageActions } from "@shared/enums/StorageActions";
import { StorageKeys } from "@shared/enums/StorageKeys";
import { PomodoroState } from "@shared/interfaces/PomodoroState";

export default defineBackground(() => {
  const { SavePomodoroState, GetPomodoroState, ClearPomodoroState } = StorageActions;
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('message', message);

    switch (message.action) {
      case SavePomodoroState:
        savePomodoroState(message.state)
          .then(() => sendResponse({ success: true}))
          .catch((error) => sendResponse({ success: false, error: error.message }));
        return true;
      case GetPomodoroState:
        getPomodoroState()
          .then(state => sendResponse({ success: true, state }))
          .catch(error => sendResponse({ success: false, error: error.message }))
        return true;
      case ClearPomodoroState:
        clearPomodoroState()
          .then(() => sendResponse({ success: true}))
          .catch(error => sendResponse({ success: false, error: error.message }))
        return true;
      default:
        sendResponse({ success: false, error: 'Unkown action' })
    }
  })

  async function savePomodoroState(state: PomodoroState): Promise<void> {
    try {
      console.log('saving...', state);
      
      await browser.storage.local.set({
        [StorageKeys.POMODORO_STATE]: state
      });
    } catch (error) {
      console.error('Error saving pomodoro state:', error);
      throw error;
    }
  }

  async function getPomodoroState(): Promise<PomodoroState | null> {
    try {
      const result = await browser.storage.local.get(StorageKeys.POMODORO_STATE);
      return result[StorageKeys.POMODORO_STATE] || null;
    } catch (error) {
      console.error('Error getting pomodoro state:', error);
      throw error;
    }
  }

  async function clearPomodoroState(): Promise<void> {
    try {
      await browser.storage.local.remove(StorageKeys.POMODORO_STATE as string);
    } catch (error) {
      console.error('Error clearing pomodoro state:', error);
      throw error;
    }
  }
});
