import { PomodoroStatus } from "@shared/enums";

export interface PomodoroState {
  status: PomodoroStatus;
  isRunning: boolean;
  startTime?: number;
  endTime?: number;
  remainingTime?: number;

  // Progress tracking
  focusCompleted: number;
  cyclesCompleted: number;
}