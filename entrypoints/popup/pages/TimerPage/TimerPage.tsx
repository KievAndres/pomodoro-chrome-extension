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

  const TIMING_LIST = [PomodoroStatus.Focus, PomodoroStatus.ShortBreak, PomodoroStatus.LongBreak]

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

  const handleStartSession = async (): Promise<void> => {
    if (!pomodoroState) return;

    switch (pomodoroState.status) {
      case PomodoroStatus.Idle:
      case PomodoroStatus.WaitForFocus:
        setPomodoroState({
          ...pomodoroState,
          status: PomodoroStatus.Focus,
          startTime: Date.now(),
          duration: config.focusDuration * 60 * 1000,
        });
        break;
      case PomodoroStatus.WaitForShortBreak:
        setPomodoroState({
          ...pomodoroState,
          status: PomodoroStatus.ShortBreak,
          startTime: Date.now(),
          duration: config.shortBreakDuration * 60 * 1000,
        });
        break;
    }
  };

  const handleCompletedSession = async (): Promise<void> => {
    if (!pomodoroState) return;
    switch (pomodoroState.status) {
      case PomodoroStatus.Focus:
        const storedPomodoroState: PomodoroState | null = await storageUtils.getPomodoroState();
        const storedCompletedFocusSessions: number = storedPomodoroState?.completedFocusSessions ?? 0;
        const nextBreakStatus: PomodoroStatus = await determineBreakStatusAfterFocus();

        setPomodoroState({
          ...pomodoroState,
          status: nextBreakStatus,
          completedFocusSessions: storedCompletedFocusSessions + 1,
          startTime: undefined,
          duration: undefined
        });
        break;
      case PomodoroStatus.ShortBreak:
        setPomodoroState({
          ...pomodoroState,
          status: PomodoroStatus.WaitForFocus,
          startTime: undefined,
          duration: undefined
        });
        break;
      case PomodoroStatus.LongBreak:
        setPomodoroState({
          ...pomodoroState,
          status: PomodoroStatus.WaitForFocus,
          startTime: undefined,
          duration: undefined
        });
        break;
    }
  };

  const determineBreakStatusAfterFocus = async (): Promise<PomodoroStatus> => {
    const storedPomodoroState: PomodoroState | null = await storageUtils.getPomodoroState();
    const currentCompletedFocusSessions: number = storedPomodoroState?.completedFocusSessions ?? 0;
    console.log({currentCompletedFocusSessions}, {config})
    if (currentCompletedFocusSessions < config.sessionsUntilLongBreak) {
      return PomodoroStatus.WaitForShortBreak;
    }
    return PomodoroStatus.WaitForLongBreak;
  }

  return (
    <div className="timer">
      <section className="header">
        <h2>POMODORO TIMER</h2>
      </section>
      {pomodoroState?.status && !TIMING_LIST.includes(pomodoroState?.status) && (
        <div>
          <StartSessionMessage onStartSession={handleStartSession} pomodoroStatus={pomodoroState?.status} />
        </div>
      )}
      {pomodoroState?.status && TIMING_LIST.includes(pomodoroState?.status) && (
        <div className="focus-session">
          <SessionInProgress onComplete={handleCompletedSession} />
        </div>
      )}
    </div>
  );
}
