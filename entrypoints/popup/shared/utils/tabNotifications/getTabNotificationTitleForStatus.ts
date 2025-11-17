import { PomodoroStatus } from "@shared/enums";

export const getTabNotificationTitleForStatus = (status: PomodoroStatus): string => {
  switch (status) {
    case PomodoroStatus.Focus:
      return 'Focus session completed!';
    case PomodoroStatus.ShortBreak:
      return 'Short break completed!';
    case PomodoroStatus.LongBreak:
      return 'Long break completed!'
    default:
      return '';
  }
}