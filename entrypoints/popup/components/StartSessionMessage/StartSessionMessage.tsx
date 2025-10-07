import './StartSessionMessage.css';
import RotatingSphere from '@shared/components/RotatingSphere/RotatingSphere';
import { StartSessionMessageProps } from './StartSessionMessageProps';
import { usePomodoroConfig } from '@shared/hooks/usePomodoroConfig';

export default function StartSessionMessage({ onStartSession }: StartSessionMessageProps) {
  const handleStartSession = async () => {
    onStartSession?.();
  };

  return (
    <section className="start-focusing-container" onClick={handleStartSession}>
      <section className="item rotating-sphere">
        <RotatingSphere />
      </section>
      <section className="item text">
        <span>Click to start session!</span>
      </section>
    </section>
  );
}
