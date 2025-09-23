import { StorageKeys } from "@shared/enums/StorageKeys"
import { PomodoroState } from "@shared/interfaces/PomodoroState";

export const storageUtils = {
  async savePomodoroState(state: PomodoroState): Promise<void> {
    try {
      if (browser?.storage) {
        await browser.storage.local.set({
          [StorageKeys.POMODORO_STATE]: state
        });
      } else {
        localStorage.setItem(StorageKeys.POMODORO_STATE, JSON.stringify(state));
      }
    } catch (error) {
      console.error('Error saving pomodoro state:', error);
    }
  },

  async getPomodoroState(): Promise<PomodoroState | null> {
    try {
      if (browser?.storage) {
        const result = await browser.storage.local.get(StorageKeys.POMODORO_STATE);
        return result[StorageKeys.POMODORO_STATE] || null;
      } else {
        const stored = localStorage.getItem(StorageKeys.POMODORO_STATE);
        return stored ? JSON.parse(stored) : null;
      }
    } catch (error) {
      console.error('Error getting pomodoro state:', error);
      return null;
    }
  },

  async clearPomodoroState(): Promise<void> {
    try {
      if (browser?.storage) {
        await browser.storage.local.remove(StorageKeys.POMODORO_STATE as string);
      } else {
        localStorage.removeItem(StorageKeys.POMODORO_STATE);
      }
    } catch (error) {
      console.error('Error clearing pomodoro state:', error);
    }
  }
}