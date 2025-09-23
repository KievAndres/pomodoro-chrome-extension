import './ProgressCircle.css';

interface ProgressCircleProps {
  background?: string;
  color?: string;
  value?: number;
  maxValue?: number;
}

export default function ProgressCircle(props: ProgressCircleProps) {
  const maxValue: number = props.maxValue ?? 100;
  const value: number = props.value ?? 0;
  const background: string = props.background || '#e0e0e0';
  const color: string = props.color || '#76e5b1';

  const FULL_CIRCLE_PROGRESS_VALUE: number = 565.48;

  const [circleProgress, setCircleProgress] = useState<string>('0px');
  const [textXPosition, setTextXPosition] = useState<string>('0px');

  useEffect(() => {
    setCircleProgress(getCircleProgress(value, maxValue));
  }, [value, maxValue]);

  useEffect(() => {
    setTextXPosition(getTextXPosition(value));
  }, [value]);


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
      className="progress-circle"
      viewBox="0 0 200 200"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        r="90"
        cx="100"
        cy="100"
        fill="transparent"
        stroke-width="16px"
        stroke={background}
      ></circle>
      <circle
        r="90"
        cx="100"
        cy="100"
        stroke-width="15"
        stroke-linecap="round"
        fill="transparent"
        stroke-dasharray="565.48px"
        stroke-dashoffset={circleProgress}
        stroke={color}
      ></circle>
      <text
        className="circle-text"
        y="117px"
        font-size="52px"
        font-weight="bold"
        style={{ transform: 'rotate(90deg) translate(0px, -196px)' }}
        fill={color}
        x={textXPosition}
      >
        {value}
      </text>
    </svg>
  );
}
