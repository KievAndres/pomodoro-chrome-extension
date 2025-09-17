import { Injectable } from '@angular/core';
import { PomodoroStatus } from '@enums/pomodoro-status.enum';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PomodoroStatusService {

  private _$pomodoroStatus: BehaviorSubject<PomodoroStatus>;

  constructor() {
    this._$pomodoroStatus = new BehaviorSubject<PomodoroStatus>(PomodoroStatus.IDLE);
  }

  public observePomodoroStatus(): Observable<PomodoroStatus> {
    return this._$pomodoroStatus.asObservable();
  }

  public setPomodoroStatus(newPomodoroStatus: PomodoroStatus): void {
    this._$pomodoroStatus.next(newPomodoroStatus);
  }
}
