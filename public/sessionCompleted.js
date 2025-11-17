(async () => {
  try {
    const storage = chrome?.storage?.local || browser?.storage?.local || null;
    if (!storage) {
      console.error('Storage API not available');
      return;
    }

    const POMODORO_STATE_KEY = 'pomodoroState';
    const statusLabelMapper = {
      ['FOCUS']: 'Focus',
      ['SHORT_BREAK']: 'Short Break',
      ['LONG_BREAK']: 'Long Break',
      ['LONG_BREAK']: 'Idle',
      ['LONG_BREAK']: 'Paused',
    }

    const storageResult = await storage.get(POMODORO_STATE_KEY);
    const pomodoroState = storageResult[POMODORO_STATE_KEY];
    if (!pomodoroState) {
      console.error('No pomodoro notification data found in storage');
      return;
    }

    const { status, nextStatus, focusCompleted, cyclesCompleted } = pomodoroState;
    console.log({ status, nextStatus, focusCompleted, cyclesCompleted });
  } catch (error) {
    console.error('Error reading from storage', error);
  }
})();