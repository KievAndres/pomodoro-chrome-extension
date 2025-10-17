import { DEFAULT_POMODORO_CONFIG } from '@shared/config/defaults';
import { StorageActions } from '@shared/enums/StorageActions';
import { StorageKeys } from '@shared/enums/StorageKeys';
import { PomodoroConfig } from '@shared/interfaces/PomodoroConfig';
import { PomodoroState } from '@shared/interfaces/PomodoroState';
import { validateConfig } from '@shared/utils/config';
import { PomodoroStatus } from '@shared/enums/PomodoroStatus';
import { POMODORO_BADGE_REFRESH_ALARM } from '@shared/constants/alarm-names';
import { POMODORO_ACTIVE_STATUSES } from '@shared/constants/pomodoro-active-statuses';

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('message', message);

    switch (message.action) {
      case StorageActions.SavePomodoroState:
        savePomodoroState(message.state)
          .then(async () => {
            await updateBadgeFromState(message.state);
            sendResponse({ success: true})
          })
          .catch((error) => sendResponse({ success: false, error: error.message }));
        return true;
      case StorageActions.GetPomodoroState:
        getPomodoroState()
          .then((state) => sendResponse({ success: true, state }))
          .catch((error) => sendResponse({ success: false, error: error.message }));
        return true;
      case StorageActions.ClearPomodoroState:
        clearPomodoroState()
          .then(() => sendResponse({ success: true }))
          .catch((error) => sendResponse({ success: false, error: error.message }));
        return true;

      // Config
      case StorageActions.SavePomodoroConfig:
        savePomodoroConfig(message.config)
          .then(() => sendResponse({ success: true }))
          .catch((error) => sendResponse({ success: false, error: error.message }));
        return true;
      case StorageActions.GetPomodoroConfig:
        getPomodoroConfig()
          .then((config) => sendResponse({ success: true, config }))
          .catch((error) => sendResponse({ success: false, error: error.message }));
        return true;
      case StorageActions.ResetPomodoroConfig:
        resetPomodoroConfig()
          .then(() => sendResponse({ success: true }))
          .catch((error) => sendResponse({ success: false, error: error.message }));
        return true;
      default:
        sendResponse({ success: false, error: 'Unkown action' });
    }
  });

  browser.storage.onChanged.addListener(async (changes) => {
    if (changes[StorageKeys.PomodoroState]) {
      const newState = changes[StorageKeys.PomodoroState].newValue as PomodoroState | null;
      await updateBadgeFromState(newState);
    }
  });

  // Create alarm to refresh badge every minute
  browser.alarms.create(POMODORO_BADGE_REFRESH_ALARM, { periodInMinutes: 1});
  browser.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name !== POMODORO_BADGE_REFRESH_ALARM) return;
    const state = await getPomodoroState();
    await updateBadgeFromState(state);
  })

  async function savePomodoroState(state: PomodoroState): Promise<void> {
    try {
      console.log('saving...', state);

      await browser.storage.local.set({
        [StorageKeys.PomodoroState]: state,
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

  // Config
  async function savePomodoroConfig(config: PomodoroConfig): Promise<void> {
    try {
      const validatedConfig = validateConfig(config);
      await browser.storage.local.set({
        [StorageKeys.PomodoroConfig]: validatedConfig,
      });
    } catch (error) {
      console.error('Error saving pomodoro config:', error);
      throw error;
    }
  }

  function getMinutesRemaining(pomodoroState: PomodoroState | null): number | null {
    if (!pomodoroState?.startTime || !pomodoroState.duration) return null;
    if (!POMODORO_ACTIVE_STATUSES.includes(pomodoroState.status)) return null;

    const now = Date.now();
    const endAt = pomodoroState.startTime + pomodoroState.duration;
    const remainingMs = Math.max(0, endAt - now);
    const remainingMinutes = Math.ceil(remainingMs / 60000);
    return remainingMinutes;
  }

  async function updateBadgeFromState(pomodoroState: PomodoroState | null): Promise<void> {
    try {
      const minutes = getMinutesRemaining(pomodoroState);
      if (minutes == null || minutes <= 0) {
        await browser.action.setBadgeText({ text: ''});
        return;
      }
      // Badge text with minutes remaining
      await browser.action.setBadgeText({ text: String(minutes)})

      // Background color based on status
      switch (pomodoroState!.status) {
        case PomodoroStatus.Focus:
          await browser.action.setBadgeBackgroundColor({ color: '#E95b5b' });
          break;
        case PomodoroStatus.ShortBreak:
        case PomodoroStatus.LongBreak:
          await browser.action.setBadgeBackgroundColor({ color: '#35bd8f' });
          break;
        default:
          await browser.action.setBadgeBackgroundColor({ color: '#666666' });
      }
    } catch (error) {
      console.error('Error updating badge:', error);
    }
  }

  async function getPomodoroConfig(): Promise<PomodoroConfig> {
    try {
      const result = await browser.storage.local.get(StorageKeys.PomodoroConfig);
      const config = result[StorageKeys.PomodoroConfig];

      if (!config) {
        return DEFAULT_POMODORO_CONFIG;
      }

      return validateConfig(config);
    } catch (error) {
      console.error('Error getting pomodoro config:', error);
      throw error;
    }
  }

  async function resetPomodoroConfig(): Promise<void> {
    try {
      await browser.storage.local.remove(StorageKeys.PomodoroConfig as string);
    } catch (error) {
      console.error('Error resetting pomodoro config:', error);
      throw error;
    }
  }

  // Initialization
  (async () => {
    const state = await getPomodoroState();
    // Sync badge with current state
    await updateBadgeFromState(state);
  })();
});
