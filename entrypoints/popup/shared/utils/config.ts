import { DEFAULT_POMODORO_CONFIG } from '@shared/config/defaults';
import { StorageActions } from '@shared/enums/StorageActions';
import { PomodoroConfig } from '@shared/interfaces/PomodoroConfig';

export const configUtils = {
  async saveConfig(config: PomodoroConfig): Promise<void> {
    try {
      const response = await browser.runtime.sendMessage({
        action: StorageActions.SavePomodoroConfig,
        config,
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
        action: StorageActions.GetPomodoroConfig,
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
        action: StorageActions.ResetPomodoroConfig,
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to reset pomodoro config');
      }
    } catch (error) {
      console.error('Error resetting config:', error);
      throw error;
    }
  },
};

export const validateConfig = (config: Partial<PomodoroConfig>): PomodoroConfig => {
  return {
    focusDuration: Math.max(1, Math.min(60, config.focusDuration || DEFAULT_POMODORO_CONFIG.focusDuration)),
    shortBreakDuration: Math.max(
      1,
      Math.min(30, config.shortBreakDuration || DEFAULT_POMODORO_CONFIG.shortBreakDuration)
    ),
    longBreakDuration: Math.max(1, Math.min(60, config.longBreakDuration || DEFAULT_POMODORO_CONFIG.longBreakDuration)),
    sessionsUntilLongBreak: Math.max(
      1,
      Math.min(10, config.sessionsUntilLongBreak || DEFAULT_POMODORO_CONFIG.sessionsUntilLongBreak)
    ),
    enableNotifications: config.enableNotifications ?? DEFAULT_POMODORO_CONFIG.enableNotifications,
    enableSound: config.enableSound ?? DEFAULT_POMODORO_CONFIG.enableSound,
    soundVolume: Math.max(0, Math.min(100, config.soundVolume || DEFAULT_POMODORO_CONFIG.soundVolume)),
    autoStartBreaks: config.autoStartBreaks ?? DEFAULT_POMODORO_CONFIG.autoStartBreaks,
    autoStartFocus: config.autoStartFocus ?? DEFAULT_POMODORO_CONFIG.autoStartFocus,
    enablePause: config.enablePause ?? DEFAULT_POMODORO_CONFIG.enablePause,
    pauseOnTabSwitch: config.pauseOnTabSwitch ?? DEFAULT_POMODORO_CONFIG.pauseOnTabSwitch,
  };
};

export const migrateConfig = (oldConfig: any, version: string): PomodoroConfig => {
  if (version === '1.0.0') {
    return {
      ...DEFAULT_POMODORO_CONFIG,
      ...oldConfig,
    };
  }

  return validateConfig(oldConfig);
};
