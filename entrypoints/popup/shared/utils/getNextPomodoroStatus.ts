import { PomodoroStatus } from '@shared/enums';
import { nextPomodoroStatusMapper } from '@shared/mappers';

export const getNextPomodoroStatus = (currentStatus: PomodoroStatus): PomodoroStatus => {
  return nextPomodoroStatusMapper[currentStatus] || PomodoroStatus.Idle;
};
