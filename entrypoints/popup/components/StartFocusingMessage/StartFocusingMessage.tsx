import './StartFocusingMessage.css';
import RotatingSphere from '@shared/components/RotatingSphere/RotatingSphere';
import { StartFocusingMessageProps } from './StartFocusingMessageProps';
import { usePomodoroConfig } from '@shared/hooks/usePomodoroConfig';

export default function StartFocusingMessage({ onStartFocusing }: StartFocusingMessageProps) {
  const handleStartFocusing = async () => {
    onStartFocusing?.();
  };

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
