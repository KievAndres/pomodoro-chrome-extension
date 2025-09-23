import ProgressCircle from "@shared/components/ProgressCircle/ProgressCircle";
import { PomodoroState } from "@shared/interfaces/PomodoroState";
import { storageUtils } from "@shared/utils/storage";

export default function SessionInProgress() {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [pomodoroState, setPomodoroState] = useState<PomodoroState | null>(null);

  useEffect(() => {
    const loadInitialState = async () => {
      const storagePomodoroState = await storageUtils.getPomodoroState();
      setPomodoroState(storagePomodoroState);
    };

    loadInitialState();
  }, []);

  useEffect(() => {
    if (!pomodoroState?.startTime) return;

    const updateElapsedTime = () => {
      const now = Date.now();
      const elapsed = now - pomodoroState.startTime!;
      const elpasedMinutes = Math.floor(elapsed / (1000 * 60));
      console.log(elpasedMinutes, pomodoroState);
      setElapsedTime(elpasedMinutes);
    };

    updateElapsedTime();

    const interval = setInterval(updateElapsedTime, 1000);

    return () => clearInterval(interval);
  }, [pomodoroState?.startTime]);
  
  return (
    <div className="session-in-progress">
      <ProgressCircle
        value={25 - elapsedTime}
        maxValue={25}
        colorRotation={true}
      />
    </div>
  )
}