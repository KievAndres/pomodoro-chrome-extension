import { StorageActions } from "@shared/enums/StorageActions";
import { PomodoroState } from "@shared/interfaces/PomodoroState";

export const storageUtils = {
  async savePomodoroState(state: PomodoroState): Promise<void> {
    try {
      const response = await browser.runtime.sendMessage({
        action: StorageActions.SavePomodoroState,
        state
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to save pomodoro state');
      }
    } catch (error) {
      console.error('Error saving pomodoro state:', error);
      throw error;
    }
  },

  async getPomodoroState(): Promise<PomodoroState | null> {
    try {
      const response = await browser.runtime.sendMessage({
        action: StorageActions.GetPomodoroState,
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to get pomodoro state');
      }
      return response.state;
    } catch (error) {
      console.error('Error getting pomodoro state:', error);
      return null;
    }
  },

  async clearPomodoroState(): Promise<void> {
    try {
      const response = await browser.runtime.sendMessage({
        action: StorageActions.ClearPomodoroState
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to clear pomodoro state');
      }
    } catch (error) {
      console.error('Error clearing pomodoro state:', error);
      throw error;
    }
  }
}