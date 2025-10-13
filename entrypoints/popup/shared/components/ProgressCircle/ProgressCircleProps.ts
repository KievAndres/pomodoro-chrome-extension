import { ProgressCircleTheme } from './ProgressCircleTheme';

export interface ProgressCircleProps {
  value?: number;
  maxValue?: number;
  label?: string;
  theme?: ProgressCircleTheme;
}
