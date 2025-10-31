export enum PomodoroStatus {
  Focus = 'FOCUS', // ~25 min of focused work
  ShortBreak = 'SHORT_BREAK', // ~5 min of short rest
  LongBreak = 'LONG_BREAK', // ~15 min of long rest
  Idle = 'IDLE', // Inactive pomodoro
  Pause = 'PAUSE' // Pomodoro stopped in the middle of a session
}