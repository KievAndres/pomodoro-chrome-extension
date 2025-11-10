import { PomodoroConfig } from "@shared/interfaces";

export const DEFAULT_POMODORO_CONFIG: PomodoroConfig = {
  focusDuration: .0001,
  shortBreakDuration: .0001,
  longBreakDuration: .0001,
  focusCompletedUntilLongBreak: 4,
};
