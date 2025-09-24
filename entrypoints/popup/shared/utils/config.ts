import { DEFAULT_POMODORO_CONFIG } from "@shared/config/defaults";
import { StorageActions } from "@shared/enums/StorageActions";
import { PomodoroConfig } from "@shared/interfaces/PomodoroConfig";

export const configUtils = {
  async saveConfig(config: PomodoroConfig): Promise<void> {
    try {
      const response = await browser.runtime.sendMessage({
        action: StorageActions.SavePomodoroConfig,
        config
      });
      if (!response.success) {
        throw new Error(response.error || 'Failed to save pomodoro config');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      throw error;
    }
  },

  async getConfig(): Promise<PomodoroConfig> {
    try {
      const response = await browser.runtime.sendMessage({
        action: StorageActions.GetPomodoroConfig
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to get pomodoro config');
      }

      return response.config || DEFAULT_POMODORO_CONFIG;
    } catch (error) {
      console.error('Error getting config:', error);
      return DEFAULT_POMODORO_CONFIG;
    }
  },

  async resetConfig(): Promise<void> {
    try {
      const response = await browser.runtime.sendMessage({
        action: StorageActions.ResetPomodoroConfig
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to reset pomodoro config');
      }
    } catch (error) {
      console.error('Error resetting config:', error);
      throw error;
    }
  }
}