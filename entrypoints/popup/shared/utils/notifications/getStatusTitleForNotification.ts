import { PomodoroStatus } from '@shared/enums';

export const getStatusTitleForNotification = (status: PomodoroStatus): string => {
  switch (status) {
    case PomodoroStatus.Focus:
      return 'Focus session ended';
    case PomodoroStatus.ShortBreak:
      return 'Short break ended';
    case PomodoroStatus.LongBreak:
      return 'Long break ended';
    default:
      return '';
  }
};
