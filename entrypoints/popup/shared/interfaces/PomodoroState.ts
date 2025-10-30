import { PomodoroStatus } from "@shared/enums";

export interface PomodoroState {
  status: PomodoroStatus;
  remainingTime?: number;
  duration?: number;
  completedFocusSessions?: number;
  completedPomodoroCycles?: number;
  isPaused?: boolean;
  previousStatus?: PomodoroStatus;
}