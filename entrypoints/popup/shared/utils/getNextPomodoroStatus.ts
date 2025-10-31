import { PomodoroStatus } from '@shared/enums';
import { PomodoroConfig } from '@shared/interfaces';

export const getNextPomodoroStatus = (
  currentStatus: PomodoroStatus,
  config: PomodoroConfig,
  focusCompleted: number
): PomodoroStatus => {
  switch (currentStatus) {
    case PomodoroStatus.Idle:
    case PomodoroStatus.ShortBreak:
    case PomodoroStatus.LongBreak:
      return PomodoroStatus.Focus;
    case PomodoroStatus.Focus:
      if (focusCompleted <= config.focusCompletedUntilLongBreak) {
        return PomodoroStatus.ShortBreak;
      }
      return PomodoroStatus.LongBreak;
    default:
      return PomodoroStatus.Idle;
  }
};
