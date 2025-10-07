import { useState, useEffect } from 'react';
import './TimerPage.css';
import StartSessionMessage from '@components/StartSessionMessage/StartSessionMessage';
import { PomodoroStatus } from '@shared/enums/PomodoroStatus';
import { PomodoroState } from '@shared/interfaces/PomodoroState';
import { storageUtils } from '@shared/utils/storage';
import SessionInProgress from '@components/SessionInProgress/SessionInProgress';
import { usePomodoroConfig } from '@shared/hooks/usePomodoroConfig';

export default function TimerPage() {
  const [pomodoroState, setPomodoroState] = useState<PomodoroState | null>(null);
  const { config } = usePomodoroConfig();

  useEffect(() => {
    const loadInitialState = async () => {
      const storedPomodoroState = await storageUtils.getPomodoroState();
      console.log(storedPomodoroState);
      if (storedPomodoroState) {
        setPomodoroState(storedPomodoroState);
      } else {
        setPomodoroState({
          status: PomodoroStatus.Idle,
        });
      }
    };

    loadInitialState();
  }, []);

  useEffect(() => {
    if (!pomodoroState) return;

    storageUtils.savePomodoroState(pomodoroState);
  }, [pomodoroState]);

  const handleStartSession = async () => {
    setPomodoroState({
      status: PomodoroStatus.Focus,
      startTime: Date.now(),
      duration: config.focusDuration * 60 * 1000,
    });
  };

  const handleCompleteSession = async () => {
    if (!pomodoroState) return;
    switch (pomodoroState.status) {
      case PomodoroStatus.Focus:
        setPomodoroState({
          status: PomodoroStatus.ShortBreak,
          startTime: Date.now(),
          duration: config.shortBreakDuration * 60 * 1000,
        });
        break;
    }
  };

  return (
    <div className="timer">
      <section className="header">
        <h2>POMODORO TIMER</h2>
      </section>
      {pomodoroState?.status === PomodoroStatus.Idle && (
        <div>
          <StartSessionMessage onStartSession={handleStartSession} />
        </div>
      )}
      {pomodoroState?.status === PomodoroStatus.Focus && (
        <div className="focus-session">
          <SessionInProgress onComplete={handleCompleteSession} />
        </div>
      )}
    </div>
  );
}
