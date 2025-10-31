import { AlarmKeys, ContextMenuContexts, ContextMenuId, StorageKeys } from '@shared/browserKeys';
import { DEFAULT_POMODORO_CONFIG } from '@shared/defaults';
import { DEFAULT_POMODORO_STATE } from '@shared/defaults/defaultPomodoroState';
import { BackgroundActions, PomodoroStatus } from '@shared/enums';
import { PomodoroConfig, PomodoroState } from '@shared/interfaces';
import { convertMillisecondsIntoMinutes, convertMinutesIntoMilliseconds, getNextPomodoroStatus, getSessionDurationInMinutes } from '@shared/utils';

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
      cyclesCompleted,
    };
    await savePomodoroState(newPomodoroState);
    showNotification();
  }

  function showNotification(): void {
    browser.notifications.create({
      type: 'basic',
      title: 'Session end',
      message: 'Session end',
      iconUrl: '',
    });
  }

  async function updateBadge(): Promise<void> {
    try {
      const pomodoroState: PomodoroState | null = await getPomodoroState();
      if (!pomodoroState) {
        throw new Error('No pomodoro state found');
      }

      const remainingTime: number = pomodoroState.remainingTime ?? 0;
      if (!remainingTime) {
        await browser.action.setBadgeText({ text: '' });
        throw new Error('Remaining time is not set');
      }
      const remainingTimeInMinutes: number = convertMillisecondsIntoMinutes(remainingTime);
      // Set badge text to remaining time in minutes
      await browser.action.setBadgeText({ text: String(remainingTimeInMinutes) });

      switch (pomodoroState.status) {
        case PomodoroStatus.Focus:
          await browser.action.setBadgeBackgroundColor({ color: '#E95b5b' });
          break;
        case PomodoroStatus.ShortBreak:
        case PomodoroStatus.LongBreak:
          await browser.action.setBadgeBackgroundColor({ color: '#35bd8f' });
          break;
        default:
          await browser.action.setBadgeBackgroundColor({ color: '#666666' });
          break;
      }
    } catch (error) {
      console.error('Error updating badge', error);
      throw error;
    }
  }

  function createContextMenu(): void {
    browser.contextMenus.create({
      id: ContextMenuId.MainMenu,
      title: '🍅 Pomodoro',
      contexts: [ContextMenuContexts.All]
    });

    browser.contextMenus.create({
      id: ContextMenuId.StartFocus,
      parentId: ContextMenuId.MainMenu,
      title: 'Start focus session',
      contexts: [ContextMenuContexts.All]
    });

    browser.contextMenus.create({
      id: ContextMenuId.StartShortBreak,
      parentId: ContextMenuId.MainMenu,
      title: 'Start short break session',
      contexts: [ContextMenuContexts.All]
    });

    browser.contextMenus.create({
      id: ContextMenuId.StartLongBreak,
      parentId: ContextMenuId.MainMenu,
      title: 'Start long break session',
      contexts: [ContextMenuContexts.All]
    });
  }

  browser.runtime.onInstalled.addListener(async () => {
    const defaultPomodoroConfig: PomodoroConfig = DEFAULT_POMODORO_CONFIG;
    const defaultPomodoroState: PomodoroState = DEFAULT_POMODORO_STATE;
    await savePomodoroConfig(defaultPomodoroConfig);
    await savePomodoroState(defaultPomodoroState);
  });

  browser.alarms.create(AlarmKeys.PomodoroBadgeRefresh, { periodInMinutes: 1 });

  browser.alarms.onAlarm.addListener(async (alarm) => {
    const pomodoroState: PomodoroState | null = await getPomodoroState();
    switch (alarm.name) {
      case AlarmKeys.PomodoroSessionEnd:
        if (pomodoroState?.isRunning) {
          await handlePomodoroFinished();
        }
        break;
      case AlarmKeys.PomodoroBadgeRefresh:
        await updateBadge();
        break;
    }
  });

  browser.contextMenus.onClicked.addListener(async (contextMenuInfo) => {
    switch (contextMenuInfo.menuItemId) {
      case ContextMenuId.StartFocus:
        await startSession(PomodoroStatus.Focus);
        break;
      case ContextMenuId.StartShortBreak:
        await startSession(PomodoroStatus.ShortBreak);
        break;
      case ContextMenuId.StartLongBreak:
        await startSession(PomodoroStatus.LongBreak);
        break;
    }
  });

  createContextMenu();

  (async () => {
    // Sync badge with current state
    await updateBadge();
  })();
});
