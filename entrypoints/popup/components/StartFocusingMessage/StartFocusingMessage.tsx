import './StartFocusingMessage.css';
import RotatingSphere from "@shared/components/RotatingSphere/RotatingSphere";
import { PomodoroStatus } from '@shared/enums/PomodoroStatus';
import { storageUtils } from '@shared/utils/storage';
import { StartFocusingMessageProps } from './StartFocusingMessageProps';

export default function StartFocusingMessage({ onStartFocusing }: StartFocusingMessageProps) {
  const handleStartFocusing = async () => {
    try {
      await storageUtils.savePomodoroState({
        status: PomodoroStatus.Focus,
        startTime: Date.now(),
        duration: 25 * 60 * 1000
      });

      onStartFocusing?.();
    } catch (error) {
      console.error('Error starting focus session:', error)
    }
  }

  return (
    <section className="start-focusing-container" onClick={handleStartFocusing}>
      <section className="item rotating-sphere">
        <RotatingSphere />
      </section>
      <section className="item text">
        <span>Click to start focusing!</span>
      </section>
    </section>
  );
}
