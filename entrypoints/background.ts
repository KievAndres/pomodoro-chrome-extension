import { DEFAULT_POMODORO_CONFIG } from '@shared/config/defaults';
import { StorageActions } from '@shared/enums/StorageActions';
import { StorageKeys } from '@shared/enums/StorageKeys';
import { PomodoroConfig } from '@shared/interfaces/PomodoroConfig';
import { PomodoroState } from '@shared/interfaces/PomodoroState';
import { validateConfig } from '@shared/utils/config';
import { PomodoroStatus } from '@shared/enums/PomodoroStatus';
import { POMODORO_BADGE_REFRESH_ALARM } from '@shared/constants/alarm-names';
import { POMODORO_ACTIVE_STATUSES } from '@shared/constants/pomodoro-active-statuses';
import { ContextMenuId } from '@shared/enums/ContextMenuId';
import { ContextMenuContexts } from '@shared/enums/ContextMenuContexts';

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
      
      // // Context menu actions
      // case 'save-pomodoro-state':
      //   savePomodoroState(message.state)
      //     .then(async () => {
      //       await updateBadgeFromState(message.state);
      //       sendResponse({ success: true });
      //     })
      //     .catch((error) => sendResponse({ success: false, error: error.message }));
      //   return true;
      // case 'clear-pomodoro-state':
      //   clearPomodoroState()
      //     .then(() => sendResponse({ success: true }))
      //     .catch((error) => sendResponse({ success: false, error: error.message }));
      //   return true;
      default:
        sendResponse({ success: false, error: 'Unknown action' });
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
  createContextMenu();

  (async () => {
    const state = await getPomodoroState();
    // Sync badge with current state
    await updateBadgeFromState(state);
  })();

  function createContextMenu() {
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

    browser.contextMenus.onClicked.addListener(async (contextMenuInfo, tab) => {
      switch (contextMenuInfo.menuItemId) {
        case ContextMenuId.StartFocus:
          await startPomodoroSession(PomodoroStatus.Focus);
          break;
        case ContextMenuId.StartShortBreak:
          await startPomodoroSession(PomodoroStatus.ShortBreak);
          break;
        case ContextMenuId.StartLongBreak:
          await startPomodoroSession(PomodoroStatus.LongBreak);
          break;
      }
    });
  }

  async function startPomodoroSession(pomodoroStatus: PomodoroStatus): Promise<void>{
    try {
      const storedPomodoroConfig = await browser.storage.local.get(StorageKeys.PomodoroConfig);
      const pomodoroConfig: PomodoroConfig = storedPomodoroConfig[StorageKeys.PomodoroConfig] || DEFAULT_POMODORO_CONFIG;

      let duration: number;
      let status: PomodoroStatus;

      switch (pomodoroStatus) {
        case PomodoroStatus.Focus:
        default:
          duration = pomodoroConfig.focusDuration * 60 * 1000;
          status = PomodoroStatus.Focus;
          break;
        case PomodoroStatus.ShortBreak:
          duration = pomodoroConfig.shortBreakDuration * 60 * 1000;
          status = PomodoroStatus.ShortBreak;
          break;
        case PomodoroStatus.LongBreak:
          duration = pomodoroConfig.longBreakDuration * 60 * 1000;
          status = PomodoroStatus.LongBreak;
          break;
      }

      const newState: PomodoroState = {
        status,
        startTime: Date.now(),
        duration
      }

      await savePomodoroState(newState);
      await updateBadgeFromState(newState);
    } catch (error) {
      console.error('Error starting pomodoro session', error);
    }
  } 

//   function createContextMenu() {
//     // Separador
//     browser.contextMenus.create({
//       id: 'separator-1',
//       parentId: 'pomodoro-main',
//       type: 'separator',
//       contexts: ['all']
//     });

//     // Opciones de control
//     browser.contextMenus.create({
//       id: 'pause-timer',
//       parentId: 'pomodoro-main',
//       title: 'Pausar Timer',
//       contexts: ['all']
//     });

//     browser.contextMenus.create({
//       id: 'resume-timer',
//       parentId: 'pomodoro-main',
//       title: 'Reanudar Timer',
//       contexts: ['all']
//     });

//     browser.contextMenus.create({
//       id: 'stop-timer',
//       parentId: 'pomodoro-main',
//       title: 'Detener Timer',
//       contexts: ['all']
//     });

//     // Separador
//     browser.contextMenus.create({
//       id: 'separator-2',
//       parentId: 'pomodoro-main',
//       type: 'separator',
//       contexts: ['all']
//     });

//     // Abrir popup
//     browser.contextMenus.create({
//       id: 'open-popup',
//       parentId: 'pomodoro-main',
//       title: 'Abrir Pomodoro',
//       contexts: ['all']
//     });

//     // Listener para manejar clicks en el menú contextual
//     browser.contextMenus.onClicked.addListener(async (info, tab) => {
//       console.log('Context menu clicked:', info.menuItemId);

//       switch (info.menuItemId) {
//         case 'pause-timer':
//           await pauseTimer();
//           break;
//         case 'resume-timer':
//           await resumeTimer();
//           break;
//         case 'stop-timer':
//           await stopTimer();
//           break;
//         case 'open-popup':
//           if (tab?.id) {
//             await browser.action.openPopup();
//           }
//           break;
//       }
//     });
//   }


//   // Función para pausar el timer
//   async function pauseTimer() {
//     try {
//       const state = await getPomodoroState();
      
//       if (state && !state.isPaused && state.startTime && state.duration) {
//         const now = Date.now();
//         const elapsed = now - state.startTime;
//         const remaining = state.duration - elapsed;
        
//         const updatedState: PomodoroState = {
//           ...state,
//           isPaused: true,
//           remainingTime: remaining
//         };

//         await savePomodoroState(updatedState);
//         await updateBadgeFromState(updatedState);

//         console.log('Timer pausado');
//       }
//     } catch (error) {
//       console.error('Error pausando timer:', error);
//     }
//   }

//   // Función para reanudar el timer
//   async function resumeTimer() {
//     try {
//       const state = await getPomodoroState();
      
//       if (state && state.isPaused) {
//         const updatedState: PomodoroState = {
//           ...state,
//           isPaused: false,
//           startTime: Date.now(),
//           duration: state.remainingTime || state.duration,
//           remainingTime: undefined
//         };

//         await savePomodoroState(updatedState);
//         await updateBadgeFromState(updatedState);

//         console.log('Timer reanudado');
//       }
//     } catch (error) {
//       console.error('Error reanudando timer:', error);
//     }
//   }

//   // Función para detener el timer
//   async function stopTimer() {
//     try {
//       await clearPomodoroState();
//       await updateBadgeFromState(null);

//       console.log('Timer detenido');
//     } catch (error) {
//       console.error('Error deteniendo timer:', error);
//     }
//   }
});
