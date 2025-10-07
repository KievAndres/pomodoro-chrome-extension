import { PomodoroStatus } from '@shared/enums/PomodoroStatus';

export interface StartSessionMessageProps {
  pomodoroStatus?: PomodoroStatus;
  onStartSession?: () => void;
}
