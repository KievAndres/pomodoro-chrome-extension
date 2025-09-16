import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProgressCircle } from "./progress-circle/progress-circle";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProgressCircle],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('pomodoro-chrome-extension');
}
