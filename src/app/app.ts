import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { TimerPage } from './pomodoro/pages/timer-page/timer-page';

@Component({
  selector: 'app-root',
  imports: [TimerPage],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class App {
  protected readonly title = signal('pomodoro-chrome-extension');
}
