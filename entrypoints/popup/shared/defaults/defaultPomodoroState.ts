import { PomodoroStatus } from "@shared/enums";
import { PomodoroState } from "@shared/interfaces";

export const DEFAULT_POMODORO_STATE: PomodoroState = {
  status: PomodoroStatus.Idle,
  isRunning: true,
  focusCompleted: 0,
  cyclesCompleted: 0,
};
