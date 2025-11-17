import { PomodoroStatus } from "@shared/enums";

export const getStatusMessageForTabNotification = (status: PomodoroStatus): string => {
  switch (status) {
    case PomodoroStatus.Focus:
      return `Excellent work. It's time to take a break.`;
    case PomodoroStatus.ShortBreak:
      return `Short break completed. Let's get back to work!`;
    case PomodoroStatus.LongBreak:
      return `You've completed a cycle. Take a longer break!`
    default:
      return '';
  }
}