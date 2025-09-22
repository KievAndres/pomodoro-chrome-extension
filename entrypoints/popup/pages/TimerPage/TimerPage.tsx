import './TimerPage.css';
import StartFocusingMessage from '@components/StartFocusingMessage/StartFocusingMessage';
import { PomodoroStatus } from '@shared/enums/PomodoroStatus';
import { useState } from 'react';

export default function TimerPage() {
  const [currentPomodoroStatus, setCurrentPomodoroStatus] = useState(PomodoroStatus.IDLE);
  return (
    <div className="timer">
    <section className="header">
      <h2>POMODORO TIMER</h2>
    </section>
    {
      currentPomodoroStatus === PomodoroStatus.IDLE && 
      <div className="start-focusing-message">
        <StartFocusingMessage />
      </div>
    }
    {/* @if (currentPomodoroStatus === POMODORO_STATUS.IDLE) {
      <start-focusing-message className="start-focusing-message" (click)="startFocusingSession()" />
    } @else {
      <progress-circle className="progress-circle" [maxValue]=25 [value]=25 />
    } */}
  </div>
  );
}