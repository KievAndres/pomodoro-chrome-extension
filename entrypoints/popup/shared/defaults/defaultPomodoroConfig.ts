import { PomodoroConfig } from "@shared/interfaces";

export const DEFAULT_POMODORO_CONFIG: PomodoroConfig = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  focusCompletedUntilLongBreak: 4,
};
