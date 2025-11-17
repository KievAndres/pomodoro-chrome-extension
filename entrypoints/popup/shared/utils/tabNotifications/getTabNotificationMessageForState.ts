import { PomodoroStatus } from "@shared/enums";
import { PomodoroState } from "@shared/interfaces";

export const getTabNotificationMessageForState = (pomodoroState: PomodoroState): string => {
  const { status, nextStatus } = pomodoroState;
  switch (status) {
    case PomodoroStatus.Focus:
      if (nextStatus === PomodoroStatus.ShortBreak) {
        return `Excellent work. It's time to take a break.`;
      }
      return `You've completed a cycle. Take a longer break!`;
    case PomodoroStatus.ShortBreak:
      return `Time to get back to work!`;
    case PomodoroStatus.LongBreak:
      return `That's it for now. Take a deep breath and get ready to continue! 💔`;
    default:
      return '';
  }
}