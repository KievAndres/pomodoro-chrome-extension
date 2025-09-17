import { Component, computed, inject } from '@angular/core';
import { ProgressCircle } from '../../components/progress-circle/progress-circle';
import { TimeControls } from '../../components/time-controls/time-controls';
import { PomodoroStatusService } from '../../services/pomodoro-status.service';
import { PomodoroStatus } from '../../enums/pomodoro-status.enum';
import { StartFocusingMessage } from "../../components/start-focusing-message/start-focusing-message";

@Component({
  selector: 'timer-page',
  imports: [ProgressCircle, TimeControls, StartFocusingMessage],
  templateUrl: './timer-page.html',
  styleUrl: './timer-page.scss',
})
export class TimerPage {
  public pomodoroStatusService = inject(PomodoroStatusService);
  public currentPomodoroStatus: PomodoroStatus;

  public readonly POMODORO_STATUS = PomodoroStatus;

  constructor() {
    this.currentPomodoroStatus = PomodoroStatus.IDLE;

    this._observePomodoroStatus();
  }

  private _observePomodoroStatus(): void {
    this.pomodoroStatusService
      .observePomodoroStatus()
      .subscribe((newPomodoroStatus: PomodoroStatus) => {
        this.currentPomodoroStatus = newPomodoroStatus;
      });
  }

  public startFocusingSession(): void {
    this.pomodoroStatusService.setPomodoroStatus(PomodoroStatus.FOCUS);
  }
}
