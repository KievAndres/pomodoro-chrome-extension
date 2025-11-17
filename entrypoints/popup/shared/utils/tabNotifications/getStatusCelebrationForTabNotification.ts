import { PomodoroStatus } from "@shared/enums";

export const getStatusCelebrationForTabNotification = (status: PomodoroStatus): string => {
  switch (status) {
    case PomodoroStatus.Focus:
      return `Well done! 🎉`;
    case PomodoroStatus.ShortBreak:
      return `Ready to continue? 💪🏼`;
    case PomodoroStatus.LongBreak:
      return `Awesome achievement! 🌟`;
    default:
      return '';
  }
}