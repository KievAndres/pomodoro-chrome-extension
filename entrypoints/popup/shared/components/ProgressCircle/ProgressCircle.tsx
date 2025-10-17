import './ProgressCircle.css';
import { useState, useEffect } from 'react';
import { ProgressCircleProps } from './ProgressCircleProps';
import { ProgressCircleTheme } from '@shared/enums/ProgressCircleTheme';

export default function ProgressCircle({
  value = 0,
  maxValue = 100,
  label = '',
  theme = ProgressCircleTheme.Focus1,
  onClick
}: ProgressCircleProps) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min((value / maxValue) * 100, 100);
  const strokeDashArray = `${circumference} ${circumference}`;
  const storkeDashOffset = circumference - (progress / 100) * circumference;
  const STOP_COLOR_1_PREFIX = 'stop-color-1-theme';
  const STOP_COLOR_2_PREFIX = 'stop-color-2-theme';

  const [stopColor1, setStopColor1] = useState<string>('#FC466B');
  const [stopColor2, setStopColor2] = useState<string>('#3F5EFB');
  const [stopColor1ClassName, setStopColor1ClassName] = useState<string>(`${STOP_COLOR_1_PREFIX}-focus-1`);
  const [stopColor2ClassName, setStopColor2ClassName] = useState<string>(`${STOP_COLOR_2_PREFIX}-focus-1`);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  useEffect(() => {
    determineCurrentTheme();
  }, [theme, isPaused]);

  const handleClick = (): void => {
    setIsPaused(!isPaused);
    onClick?.();
  }
  
  const determineCurrentTheme = (): void => {
    if (isPaused) {
      setStopColor1('#676868');
      setStopColor2('#adadad');
      setStopColor1ClassName(`${STOP_COLOR_1_PREFIX}-pause`);
      setStopColor2ClassName(`${STOP_COLOR_2_PREFIX}-pause`);
      return;
    }
    switch (theme) {
      case ProgressCircleTheme.Focus1:
      default:
        setStopColor1('#FC466B');
        setStopColor2('#3F5EFB');
        setStopColor1ClassName(`${STOP_COLOR_1_PREFIX}-focus-1`);
        setStopColor2ClassName(`${STOP_COLOR_2_PREFIX}-focus-1`);
        break;
      case ProgressCircleTheme.Break1:
        setStopColor1('#ecec49');
        setStopColor2('#26e86a');
        setStopColor1ClassName(`${STOP_COLOR_1_PREFIX}-break-1`);
        setStopColor2ClassName(`${STOP_COLOR_2_PREFIX}-break-1`);
        break;
    }
  }

  return (
    <svg xmlns="https://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 40 40" onClick={handleClick}>
      <defs>
        <linearGradient id="gradient" x1="80%" y1="20%" x2="5%" y2="5%" spreadMethod="pad">
          <stop offset="0%" stopColor={stopColor1} className={stopColor1ClassName} />
          <stop offset="100%" stopColor={stopColor2} className={stopColor2ClassName} />
        </linearGradient>

        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={stopColor1} className={stopColor1ClassName} />
          <stop offset="100%" stopColor={stopColor2} className={stopColor2ClassName} />
        </linearGradient>
      </defs>

      <circle className="rail" cx="20" cy="20" r="16" strokeWidth="1" fill="transparent"></circle>
      <circle
        className={`progress ${isPaused ? 'progress-paused' : ''}`}
        cx="20"
        cy="20"
        r="16"
        strokeWidth="2"
        fill="transparent"
        strokeDasharray={strokeDashArray}
        strokeDashoffset={storkeDashOffset}
        transform="rotate(-90 20 20)"
      ></circle>

      <g className="progress-text">
        <text y="50%" transform="translate(0,2)" fill="url(#textGradient)">
          <tspan x="50%" textAnchor="middle" className={`progress-percent ${isPaused ? 'text-paused' : ''}`}>
            {value}
          </tspan>
        </text>
        <text y="60%" transform="translate(0,2)" fill="url(#textGradient)">
          <tspan x="50%" textAnchor="middle" className={`progress-name ${isPaused ? 'text-paused' : ''}`}>
            {label}
          </tspan>
        </text>
      </g>
    </svg>
  );
}
