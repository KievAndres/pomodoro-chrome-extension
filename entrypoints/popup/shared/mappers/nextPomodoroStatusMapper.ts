import { PomodoroStatus } from '@shared/enums';

export const nextPomodoroStatusMapper: Record<PomodoroStatus, PomodoroStatus> = {
  [PomodoroStatus.Idle]: PomodoroStatus.Focus,
  [PomodoroStatus.Focus]: PomodoroStatus.ShortBreak,
  [PomodoroStatus.ShortBreak]: PomodoroStatus.LongBreak,
  [PomodoroStatus.LongBreak]: PomodoroStatus.Focus,
  [PomodoroStatus.Pause]: PomodoroStatus.Idle,
};
