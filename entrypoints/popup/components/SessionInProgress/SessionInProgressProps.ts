export interface SessionInProgressProps {
  onComplete?: () => void;
  togglePause?: (isPaused: boolean) => void;
}