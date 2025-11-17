import { PomodoroStatus } from "@shared/enums";
import { PomodoroState } from "@shared/interfaces";

export const getTabNotificationCelebrationForState = (pomodoroState: PomodoroState): string => {
  const { status, nextStatus } = pomodoroState;
  switch (status) {
    case PomodoroStatus.Focus:
      if (nextStatus === PomodoroStatus.LongBreak) {
        return `Awesome achievement! 🌟`;
      }
      return `Well done! 🎉`;
    case PomodoroStatus.ShortBreak:
      return `Ready to continue? 💪🏼`;
    case PomodoroStatus.LongBreak:
      return `Ready to continue your work? 💪🏼`;
    default:
      return '';
  }
}