import { PomodoroStatus } from "@shared/enums";
import { PomodoroState } from "@shared/interfaces";

export const DEFAULT_STATE: PomodoroState = {
  status: PomodoroStatus.Idle,
};
