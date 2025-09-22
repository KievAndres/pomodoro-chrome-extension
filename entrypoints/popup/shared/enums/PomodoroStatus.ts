export enum PomodoroStatus {
  FOCUS, // ~25 min of focused work
  SHORT_BREAK, // ~5 min of short rest
  LONG_BREAK, // ~15 min of long rest
  IDLE, // Inactive pomodoro
  PAUSE, // Pomodoro stopped in the middle of a session
  COMPLETED // Cycle (work + break) completed
}