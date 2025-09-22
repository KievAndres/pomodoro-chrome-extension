export default function TimerPage() {
  return (
    <div className="timer">
    <section className="header">
      <h2>POMODORO TIMER</h2>
    </section>
    {/* @if (currentPomodoroStatus === POMODORO_STATUS.IDLE) {
      <start-focusing-message className="start-focusing-message" (click)="startFocusingSession()" />
    } @else {
      <progress-circle className="progress-circle" [maxValue]=25 [value]=25 />
    } */}
  </div>
  );
}