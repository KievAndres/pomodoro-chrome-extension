import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { ProgressCircle } from "./progress-circle/progress-circle";

@Component({
  selector: 'app-root',
  imports: [ProgressCircle],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class App {
  protected readonly title = signal('pomodoro-chrome-extension');
}
