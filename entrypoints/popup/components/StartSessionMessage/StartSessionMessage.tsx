import './StartSessionMessage.css';
import RotatingSphere from '@shared/components/RotatingSphere/RotatingSphere';
import { StartSessionMessageProps } from './StartSessionMessageProps';
import { PomodoroStatus } from '@shared/enums/PomodoroStatus';
import { useMemo } from 'react';

export default function StartSessionMessage({ pomodoroStatus, onStartSession }: StartSessionMessageProps) {
  const handleStartSession = async () => {
    onStartSession?.();
  };

  const sessionMessage = useMemo(() => {
    switch (pomodoroStatus) {
      case PomodoroStatus.Idle:
      case PomodoroStatus.WaitForFocus:
        return 'Click to start focusing!'
      case PomodoroStatus.WaitForShortBreak:
        return 'Click to start short break!'
    }
  }, [pomodoroStatus]);

  return (
    <section className="start-focusing-container" onClick={handleStartSession}>
      <section className="item rotating-sphere">
        <RotatingSphere />
      </section>
      <section className="item text">
        <span>{sessionMessage}</span>
      </section>
    </section>
  );
}
