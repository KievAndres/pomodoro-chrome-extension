import { ProgressCircleTheme } from '@shared/enums/ProgressCircleTheme';

export interface ProgressCircleProps {
  value?: number;
  maxValue?: number;
  label?: string;
  theme?: ProgressCircleTheme;
  onClick?: (isPaused: boolean) => void;
}
