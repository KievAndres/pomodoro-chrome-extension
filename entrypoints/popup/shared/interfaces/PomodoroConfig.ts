export interface PomodoroConfig {
  // Session durations
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;

  // Cycles configuration
  sessionsUntilLongBreak: number;

  // Notifications configuration
  enableNotifications: boolean;
  enableSound: boolean;
  soundVolume: number;

  // Auto-start configuration
  autoStartBreaks: boolean;
  autoStartFocus: boolean;

  // Pause configurations
  enablePause: boolean;
  pauseOnTabSwitch: boolean;
}
