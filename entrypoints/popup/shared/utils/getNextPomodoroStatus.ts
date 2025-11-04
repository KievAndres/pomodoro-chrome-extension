import { PomodoroStatus } from '@shared/enums';
import { PomodoroConfig, PomodoroState } from '@shared/interfaces';

export const getNextPomodoroStatus = (pomodoroState: PomodoroState, config: PomodoroConfig): PomodoroStatus => {
  const { focusCompleted, status } = pomodoroState;
  const { focusCompletedUntilLongBreak } = config;

  switch (status) {
    case PomodoroStatus.Idle:
    case PomodoroStatus.ShortBreak:
    case PomodoroStatus.LongBreak:
      return PomodoroStatus.Focus;
    case PomodoroStatus.Focus:
      if (focusCompleted <= focusCompletedUntilLongBreak) {
        return PomodoroStatus.ShortBreak;
      }
      return PomodoroStatus.LongBreak;
    default:
      return PomodoroStatus.Idle;
  }
};
