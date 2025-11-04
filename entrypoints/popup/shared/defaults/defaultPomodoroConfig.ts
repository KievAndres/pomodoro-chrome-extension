import { PomodoroConfig } from "@shared/interfaces";

export const DEFAULT_POMODORO_CONFIG: PomodoroConfig = {
  focusDuration: .1,
  shortBreakDuration: .1,
  longBreakDuration: .1,
  focusCompletedUntilLongBreak: 4,
};
