(async () => {
  try {
    const storage = chrome?.storage?.local || browser?.storage?.local || null;
    if (!storage) {
      console.error('Storage API not available');
      return;
    }

    const POMODORO_STATE_KEY = 'pomodoroState';
    const TAB_NOTIFICATION_DATA_KEY = 'tabNotificationData';

    const storageResult = await storage.get([POMODORO_STATE_KEY, TAB_NOTIFICATION_DATA_KEY]);
    const pomodoroState = storageResult[POMODORO_STATE_KEY];
    const tabNotificationData = storageResult[TAB_NOTIFICATION_DATA_KEY];
    if (!pomodoroState) {
      console.error('No pomodoro notification data found in storage');
      return;
    }
    if (!tabNotificationData) {
      console.error('No tab notification data found in storage');
      return;
    }

    const { status, nextStatus, focusCompleted, cyclesCompleted } = pomodoroState;
    console.log({ pomodoroState, tabNotificationData });
  } catch (error) {
    console.error('Error reading from storage', error);
  }
})();