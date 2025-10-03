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
  const { value = 0, maxValue = 100} = props;

  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min((value / maxValue) * 100, 100);
  const strokeDashArray = `${circumference} ${circumference}`;
  const storkeDashOffset = circumference - (progress / 100) * circumference;

  return (
    <svg xmlns="https://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 40 40">
      <defs>
        <linearGradient id="gradient" x1="80%" y1="20%" x2="5%" y2="5%" spreadMethod="pad">
          <stop offset="0%" stop-color="#FC466B" className="stop1" />
          <stop offset="100%" stop-color="#3F5EFB" className="stop2" />
        </linearGradient>

        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FC466B" className="stop1" />
          <stop offset="100%" stop-color="#3F5EFB" className="stop2" />
        </linearGradient>
      </defs>

      <circle className="rail" cx="20" cy="20" r="16" strokeWidth="1" fill="transparent"></circle>
      <circle
        className="progress"
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
          <tspan x="50%" textAnchor="middle" className="progress-percent">
            {value}
          </tspan>
        </text>
        <text y="60%" transform="translate(0,2)" fill="url(#textGradient)">
          <tspan x="50%" textAnchor="middle" className="progress-name">
            Focus
          </tspan>
        </text>
      </g>
    </svg>
  );
}
