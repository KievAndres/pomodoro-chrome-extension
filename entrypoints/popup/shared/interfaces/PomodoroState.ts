import { PomodoroStatus } from "@shared/enums";

export interface PomodoroState {
  status: PomodoroStatus;
  startTime?: number;
  endTime?: number;
  isRunning?: boolean;
  remainingTime?: number;

  // Progress tracking
  focusCompleted?: number;
  cyclesCompleted?: number;
}