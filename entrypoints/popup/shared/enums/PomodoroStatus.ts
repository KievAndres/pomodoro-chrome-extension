export enum PomodoroStatus {
  Focus = 'Focus', // ~25 min of focused work
  ShortBreak = 'ShortBreak', // ~5 min of short rest
  LongBreak = 'LongBreak', // ~15 min of long rest
  Idle = 'Idle', // Inactive pomodoro
  Pause = 'Pause', // Pomodoro stopped in the middle of a session
  Completed = 'Completed', // Cycle (work + break) completed
}