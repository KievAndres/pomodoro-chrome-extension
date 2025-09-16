import { Component } from '@angular/core';
import { ProgressCircle } from "../../components/progress-circle/progress-circle";
import { TimeControls } from "../../components/time-controls/time-controls";

@Component({
  selector: 'timer-page',
  imports: [ProgressCircle, TimeControls],
  templateUrl: './timer-page.html',
  styleUrl: './timer-page.scss',
})
export class TimerPage { }
