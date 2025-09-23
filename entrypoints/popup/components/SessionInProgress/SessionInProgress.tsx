import ProgressCircle from "@shared/components/ProgressCircle/ProgressCircle";
import { PomodoroState } from "@shared/interfaces/PomodoroState";
import { storageUtils } from "@shared/utils/storage";

export default function SessionInProgress() {

  const [pomodoroState, setPomodoroState] = useState<PomodoroState | null>(null);

  useEffect(() => {
    const loadInitialState = async () => {
      const storagePomodoroState = await storageUtils.getPomodoroState();
      setPomodoroState(storagePomodoroState);
    };

    loadInitialState();
  }, []);
  return (
    <div className="session-in-progress">
      <ProgressCircle
        value={pomodoroState?.duration}
        maxValue={25}
      />
    </div>
  )
}