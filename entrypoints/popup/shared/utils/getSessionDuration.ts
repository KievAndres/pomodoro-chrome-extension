import { PomodoroStatus } from '@shared/enums';
import { PomodoroConfig } from '@shared/interfaces';

export const getSessionDuration = (status: PomodoroStatus, config: PomodoroConfig): number => {
  switch (status) {
    case PomodoroStatus.Focus:
      return config.focusDuration;
    case PomodoroStatus.ShortBreak:
      return config.shortBreakDuration;
    case PomodoroStatus.LongBreak:
      return config.longBreakDuration;
    default:
      return 0;
  }
};
