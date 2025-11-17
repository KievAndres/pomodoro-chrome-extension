(async () => {
  try {
    const storage = chrome?.storage?.local || browser?.storage?.local || null;
    if (!storage) {
      console.error('Storage API not available');
      return;
    }

    const POMODORO_TAB_NOTIFICATION_KEY = 'pomodoroTabNotification';

    const storageResult = await storage.get(POMODORO_TAB_NOTIFICATION_KEY);
    const pomodoroTabNotification = storageResult[POMODORO_TAB_NOTIFICATION_KEY];
    if (!pomodoroTabNotification) {
      console.error('No pomodoro notification data found in storage');
      return;
    }

    const {  } = pomodoroTabNotification;
  } catch (error) {
    console.error('Error reading from storage', error);
  }
})();