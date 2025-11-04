import { PomodoroStatus } from "@shared/enums";

export const getStatusMessageForNotification = (status: PomodoroStatus): string => {
  switch (status) {
    case PomodoroStatus.Focus:
      return `Let's get to work!`;
    case PomodoroStatus.ShortBreak:
      return 'Take a break';
    case PomodoroStatus.LongBreak:
      return 'You did it! Take a long break';
    default:
      return '';
  }
}