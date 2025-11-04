import { PomodoroConfig } from "@shared/interfaces";

export const DEFAULT_POMODORO_CONFIG: PomodoroConfig = {
  focusDuration: .001,
  shortBreakDuration: .001,
  longBreakDuration: .001,
  focusCompletedUntilLongBreak: 4,
};
