import { PomodoroStatus } from "@shared/enums";
import { PomodoroState } from "@shared/interfaces";
import { getNextPomodoroStatus } from "@shared/utils";

export const DEFAULT_POMODORO_STATE: PomodoroState = {
  status: PomodoroStatus.Idle,
  isRunning: true,
  focusCompleted: 0,
  cyclesCompleted: 0,
  nextStatus: PomodoroStatus.Focus
};
