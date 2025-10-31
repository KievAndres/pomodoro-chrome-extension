import { AlarmKeys, StorageKeys } from '@shared/browserKeys';
import { DEFAULT_POMODORO_CONFIG } from '@shared/defaults';
import { DEFAULT_POMODORO_STATE } from '@shared/defaults/defaultPomodoroState';
import { BackgroundActions, PomodoroStatus } from '@shared/enums';
import { PomodoroConfig, PomodoroState } from '@shared/interfaces';
import { convertMinutesIntoMilliseconds, getNextPomodoroStatus, getSessionDurationInMinutes } from '@shared/utils';

export default defineBackground(() => {
  browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    switch (message.action) {
      case BackgroundActions.SavePomodoroState:
        savePomodoroState(message.state)
          .then(async () => {
            sendResponse({ success: true });
          })
          .catch((error) => sendResponse({ success: false, error: error.message }));
        return true;
      case BackgroundActions.GetPomodoroState:
        getPomodoroState()
          .then((pomodoroState) => sendResponse({ success: true, pomodoroState }))
          .catch((error) => sendResponse({ success: false, error: error.message }));
        return true;
      case BackgroundActions.ClearPomodoroState:
        clearPomodoroState()
          .then(() => sendResponse({ success: true }))
          .catch((error) => sendResponse({ success: false, error: error.message }));
        return true;
      case BackgroundActions.StartNextSession:
        await startNextSession();
        return true;
    }
  });

  async function savePomodoroState(newPomodoroState: PomodoroState): Promise<void> {
    try {
      await browser.storage.local.set({
        [StorageKeys.PomodoroState]: newPomodoroState,
      });
    } catch (error) {
      console.error('Error saving pomodoro state:', error);
      throw error;
    }
  }

  async function getPomodoroState(): Promise<PomodoroState | null> {
    try {
      const result = await browser.storage.local.get(StorageKeys.PomodoroState);
      return result[StorageKeys.PomodoroState] || null;
    } catch (error) {
      console.error('Error getting pomodoro state:', error);
      throw error;
    }
  }

  async function clearPomodoroState(): Promise<void> {
    try {
      await browser.storage.local.remove(StorageKeys.PomodoroState as string);
    } catch (error) {
      console.error('Error clearing pomodoro state:', error);
      throw error;
    }
  }

  async function savePomodoroConfig(newPomodoroConfig: PomodoroConfig): Promise<void> {
    try {
      await browser.storage.local.set({
        [StorageKeys.PomodoroConfig]: newPomodoroConfig,
      });
    } catch (error) {
      console.error('Error saving pomodoro config', error);
      throw error;
    }
  }

  async function getPomodoroConfig(): Promise<PomodoroConfig | null> {
    try {
      const result = await browser.storage.local.get(StorageKeys.PomodoroConfig);
      return result[StorageKeys.PomodoroConfig] || null;
    } catch (error) {
      console.error('Error getting pomodoro config', error);
      throw error;
    }
  }

  async function clearPomodoroConfig(): Promise<void> {
    try {
      await browser.storage.local.remove(StorageKeys.PomodoroConfig as string);
    } catch (error) {
      console.error('Error clearing pomodoro config', error);
      throw error;
    }
  }

  async function startSession(newPomodoroStatus: PomodoroStatus): Promise<void> {
    try {
      const pomodoroState: PomodoroState = (await getPomodoroState()) || DEFAULT_POMODORO_STATE;
      const pomodoroConfig: PomodoroConfig = (await getPomodoroConfig()) || DEFAULT_POMODORO_CONFIG;
    
      const sessionDurationInMinutes: number = getSessionDurationInMinutes(newPomodoroStatus, pomodoroConfig);
      const sessionDuration: number = convertMinutesIntoMilliseconds(sessionDurationInMinutes);
      const startTime: number = Date.now();
      const endTime: number = startTime + sessionDuration;

      const newPomodoroState: PomodoroState = {
        ...pomodoroState,
        status: newPomodoroStatus,
        startTime,
        endTime,
        isRunning: true,
        remainingTime: undefined,
      };

      await savePomodoroState(newPomodoroState);
      browser.alarms.create(AlarmKeys.PomodoroSessionEnd, { when: endTime });
    } catch (error) {
      console.error('Error starting next session', error);
      throw error;
    }
  }

  async function startNextSession(): Promise<void> {
    try {
      const pomodoroState: PomodoroState | null = await getPomodoroState();
      const pomodoroConfig: PomodoroConfig | null = await getPomodoroConfig();
  
      if (!pomodoroState) {
        throw new Error('No pomodoro state found');
      }
      if (!pomodoroConfig) {
        throw new Error('No pomodoro config found');
      }
      const nextPomodoroStatus: PomodoroStatus = getNextPomodoroStatus(
        pomodoroState.status,
        pomodoroConfig,
        pomodoroState.focusCompleted
      );
      await startSession(nextPomodoroStatus);
    } catch (error) {
      console.error('Error starting next session', error);
      throw error;
    }
  }

  async function handlePomodoroFinished(): Promise<void> {
    const pomodoroState: PomodoroState | null = await getPomodoroState();
    const pomodoroConfig: PomodoroConfig | null = await getPomodoroConfig();
    if (!pomodoroState) {
      throw new Error('No pomodoro state found');
    }
    if (!pomodoroConfig) {
      console.error('No pomodoro config found');
      throw new Error('No pomodoro config found');
    }

    let focusCompleted: number = pomodoroState.focusCompleted;
    let cyclesCompleted: number = pomodoroState.cyclesCompleted;

    if (pomodoroState.status === PomodoroStatus.Focus) {
      focusCompleted++;
      if (focusCompleted >= pomodoroConfig.focusCompletedUntilLongBreak) {
        cyclesCompleted++;
        focusCompleted = 0;
      }
    }

    const newPomodoroState: PomodoroState = {
      ...pomodoroState,
      focusCompleted,
      cyclesCompleted
    };
    await savePomodoroState(newPomodoroState);
    showNotification();
  }

  function showNotification(): void {
    browser.notifications.create({
      type: 'basic',
      title: 'Session end',
      message: 'Session end',
      iconUrl: ''
    })
  }

  browser.runtime.onInstalled.addListener(async () => {
    const defaultPomodoroConfig: PomodoroConfig = DEFAULT_POMODORO_CONFIG;
    const defaultPomodoroState: PomodoroState = DEFAULT_POMODORO_STATE;
    await savePomodoroConfig(defaultPomodoroConfig);
    await savePomodoroState(defaultPomodoroState);
  });

  browser.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === AlarmKeys.PomodoroSessionEnd) {
      const pomodoroState: PomodoroState | null = await getPomodoroState();
      if (pomodoroState?.isRunning) {
        await handlePomodoroFinished();
      }
    }
  });
});
