import { PomodoroStatus } from "@shared/enums/PomodoroStatus";

export interface PomodoroState {
  status: PomodoroStatus;
  startTime?: number;
  duration?: number;
  completedFocusSessions?: number;
  completedPomodoroCycles?: number;
}
