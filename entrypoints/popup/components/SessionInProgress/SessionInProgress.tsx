import { useState, useEffect } from "react";
import ProgressCircle from "@shared/components/ProgressCircle/ProgressCircle";
import { usePomodoroConfig } from "@shared/hooks/usePomodoroConfig";
import { PomodoroState } from "@shared/interfaces/PomodoroState";
import { storageUtils } from "@shared/utils/storage";
import { SessionInProgressProps } from "./SessionInProgressProps";
import { PomodoroStatus } from "@shared/enums/PomodoroStatus";

export default function SessionInProgress({ onComplete }: SessionInProgressProps) {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [pomodoroState, setPomodoroState] = useState<PomodoroState | null>(null);
  const [sessionDuration, setSessionDuration] = useState<number>(0);
  const {config} = usePomodoroConfig();

  useEffect(() => {
    const loadInitialState = async () => {
      const storagePomodoroState = await storageUtils.getPomodoroState();
      setPomodoroState(storagePomodoroState);
    };

    loadInitialState();
  }, []);

  useEffect(() => {
    if (!pomodoroState?.startTime) return;

    const updateElapsedTime = () => {
      const now = Date.now();
      const elapsed = now - pomodoroState.startTime!;
      let elpasedMinutes = Math.floor(elapsed / (1000 * 60));
      let currentSessionDuration = 0;
      switch (pomodoroState.status) {
        case PomodoroStatus.Focus:
          currentSessionDuration = config.focusDuration;
          break;
        case PomodoroStatus.ShortBreak:
          currentSessionDuration = config.shortBreakDuration;
          break;
        case PomodoroStatus.LongBreak:
          currentSessionDuration = config.longBreakDuration;
          break;
      }
      setSessionDuration(currentSessionDuration);
      console.log(elapsed, elpasedMinutes, currentSessionDuration);
      if (elpasedMinutes >= currentSessionDuration) {
        elpasedMinutes = currentSessionDuration;
        onComplete?.();
      }
      setElapsedTime(elpasedMinutes);
    };

    updateElapsedTime();

    const interval = setInterval(updateElapsedTime, 1000);

    return () => clearInterval(interval);
  }, [pomodoroState?.startTime]);
  
  return (
    <div className="session-in-progress">
      <ProgressCircle
        value={sessionDuration - elapsedTime}
        maxValue={sessionDuration}
      />
    </div>
  )
}