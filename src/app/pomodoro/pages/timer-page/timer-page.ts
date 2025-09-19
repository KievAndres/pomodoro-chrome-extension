import { Component, computed, inject } from '@angular/core';
import { ProgressCircle } from '../../components/progress-circle/progress-circle';
import { TimeControls } from '../../components/time-controls/time-controls';
import { ChromeStorageService } from '../../services/chrome-storage.service';
import { PomodoroStatus } from '../../enums/pomodoro-status.enum';
import { StartFocusingMessage } from '../../components/start-focusing-message/start-focusing-message';
import { ChromeStorageKeys } from '@/app/shared/enums/chrome-storage-keys.enum';

@Component({
  selector: 'timer-page',
  imports: [ProgressCircle, TimeControls, StartFocusingMessage],
  templateUrl: './timer-page.html',
  styleUrl: './timer-page.scss',
})
export class TimerPage {
  public chromeStorageService = inject(ChromeStorageService);
  public currentPomodoroStatus: PomodoroStatus;

  public readonly POMODORO_STATUS = PomodoroStatus;

  constructor() {
    this.currentPomodoroStatus = PomodoroStatus.IDLE;

    this._observePomodoroStatus();
  }

  private _observePomodoroStatus(): void {
    this.chromeStorageService.storageChanges$.subscribe((chromeStorageChange) => {
      switch (chromeStorageChange.key) {
        case ChromeStorageKeys.POMODORO_STATUS:
          this.currentPomodoroStatus = chromeStorageChange.newValue;
          break;
      }
    });
  }

  public startFocusingSession(): void {
    this.chromeStorageService.set(
      ChromeStorageKeys.POMODORO_STATUS,
      PomodoroStatus.FOCUS as unknown as string
    );
  }
}
