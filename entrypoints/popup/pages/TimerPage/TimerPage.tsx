import { useState, useEffect } from 'react';
import './TimerPage.css';
import StartFocusingMessage from "@components/StartFocusingMessage/StartFocusingMessage";
import { PomodoroStatus } from "@shared/enums/PomodoroStatus";
import { PomodoroState } from "@shared/interfaces/PomodoroState";
import { storageUtils } from "@shared/utils/storage";
import ProgressCircle from '@shared/components/ProgressCircle/ProgressCircle';

export default function TimerPage() {
  const [currentPomodoroStatus, setCurrentPomodoroStatus] = useState(
    PomodoroStatus.Idle
  );
  const [pomodoroState, setPomodoroState] = useState<PomodoroState | null>(null);

  useEffect(() => {
    const loadInitialState = async () => {
      const storagePomodoroState = await storageUtils.getPomodoroState();
      if (storagePomodoroState) {
        setPomodoroState(storagePomodoroState);
        setCurrentPomodoroStatus(storagePomodoroState.status);
      }
    };

    loadInitialState();
  }, []);

  const handleStartFocusing = async () => {
    setCurrentPomodoroStatus(PomodoroStatus.Focus);
  }

  return (
    <div className="timer">
      <section className="header">
        <h2>POMODORO TIMER</h2>
      </section>
      {currentPomodoroStatus === PomodoroStatus.Idle && (
        <div>
          <StartFocusingMessage
            onStartFocusing={handleStartFocusing}
          />
        </div>
      )}
      {
        currentPomodoroStatus === PomodoroStatus.Focus &&
        <div className="focus-session">
          <p>Active session</p>
          <ProgressCircle
            value={pomodoroState?.duration}
            maxValue={pomodoroState?.duration}
          />
          {/* {pomodoroState && (
            <p>Tiempo restante: {Math.ceil((pomodoroState.duration! - (Date.now() - pomodoroState.startTime!)) / 1000 / 60)} minutos</p>
          )} */}
        </div>
      }
    </div>
  );
}
