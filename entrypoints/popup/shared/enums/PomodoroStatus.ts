export enum PomodoroStatus {
  WaitForFocus = 'WAIT_FOR_FOCUS', // Waiting for focus to start
  Focus = 'FOCUS', // ~25 min of focused work
  WaitForShortBreak = 'WAIT_FOR_SHORT_BREAK', // Wait for short break to start
  ShortBreak = 'SHORT_BREAK', // ~5 min of short rest
  WaitForLongBreak = 'WAIT_FOR_LONG_BREAK', // Wait for long break to start
  LongBreak = 'LONG_BREAK', // ~15 min of long rest
  Idle = 'IDLE', // Inactive pomodoro
  Pause = 'PAUSE' // Pomodoro stopped in the middle of a session
}