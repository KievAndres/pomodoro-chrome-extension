import { PomodoroStatus } from '@shared/enums';

export const statusLabelMapper: Record<PomodoroStatus, string> = {
  [PomodoroStatus.Focus]: 'Focus',
  [PomodoroStatus.ShortBreak]: 'Short Break',
  [PomodoroStatus.LongBreak]: 'Long Break',
  [PomodoroStatus.Idle]: 'Idle',
  [PomodoroStatus.Pause]: 'Paused',
};
