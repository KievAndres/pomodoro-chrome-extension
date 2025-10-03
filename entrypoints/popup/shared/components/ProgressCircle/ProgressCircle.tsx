import './ProgressCircle.css';
import { useState, useEffect } from 'react';

interface ProgressCircleProps {
  background?: string;
  color?: string;
  value?: number;
  maxValue?: number;
  colorRotation?: boolean;
}

export default function ProgressCircle(props: ProgressCircleProps) {
  const maxValue: number = props.maxValue ?? 100;
  const value: number = props.value ?? 0;
  const background: string = props.background || '#e0e0e0';
  const color: string = props.color || '#00ff88';
  const colorRotation: boolean = props.colorRotation ?? false;

  const FULL_CIRCLE_PROGRESS_VALUE: number = 565;
  // Se agregan más colores para una transición neón más suave
  const NEON_COLORS = [
    '#00ff88', // verde neón
    '#00ffc3', // verde-azul neón
    '#00ffff', // cian neón
    '#00bfff', // azul claro neón
    '#0080ff', // azul neón
    '#7f00ff', // violeta neón
    '#ff00ff', // magenta neón
    '#ff0080', // rosa neón
    '#ff0055', // rojo neón
    '#ff5500', // naranja neón
    '#ffff00', // amarillo neón
    '#aaff00', // lima neón
  ];

  const [circleProgress, setCircleProgress] = useState<string>('0px');
  const [textXPosition, setTextXPosition] = useState<string>('0px');
  const [currentColor, setCurrentColor] = useState<string>(color);

  useEffect(() => {
    setCircleProgress(getCircleProgress(value, maxValue));
  }, [value, maxValue]);

  useEffect(() => {
    setTextXPosition(getTextXPosition(value));
  }, [value]);

  useEffect(() => {
    if (colorRotation) {
      const interval = setInterval(() => {
        setCurrentColor(prevColor => {
          const currentIndex = NEON_COLORS.indexOf(prevColor);
          const nextIndex = (currentIndex + 1) % NEON_COLORS.length;
          return NEON_COLORS[nextIndex];
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setCurrentColor(color);
    }
  }, [colorRotation, color]);

  const getCircleProgress = (value: number, maxValue: number): string => {
    if (value > maxValue) {
      return '0px';
    }
    const numericValue: number =
      FULL_CIRCLE_PROGRESS_VALUE * (1 - value / maxValue);
    return `${numericValue}px`;
  }

  const getTextXPosition = (value: number | string): string => {
    const stringValue: string = value.toString();
    switch (stringValue.length) {
      case 1:
        return '86px';
      case 2:
        return '72px';
      case 3:
        return '59px';
      default:
        return '40px';
    }
  }

  return (
    <svg
      xmlns="https://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 40 40">
      <defs>
        <linearGradient
          id="gradient"
          x1="80%"
          y1="20%"
          x2="5%"
          y2="5%"
          spreadMethod="pad"
        >
          <stop offset="0%" stop-color="#FC466B" />
          <stop offset="100%" stop-color="#3F5EFB"/>
        </linearGradient>
      </defs>

      <circle
        className="rail"
        cx="20"
        cy="20"
        r="16"
        strokeWidth="1"
        fill="transparent"
      ></circle>
      <circle
        className="progress"
        cx="20"
        cy="20"
        r="16"
        strokeWidth="2"
        fill="transparent"
        strokeDasharray="50 50"
        strokeDashoffset="25">
      </circle>

      <g className="progress-text">
        <text
          y="50%"
          transform="translate(0,2)">
            <tspan x="50%" textAnchor="middle" className="progress-percent">50%</tspan>
        </text>
        <text y="60%" transform="translate(0,2)">
          <tspan x="50%" textAnchor="middle" className="progress-name">
            Entertainment
          </tspan>
        </text>
      </g>
    </svg>
  );
}
