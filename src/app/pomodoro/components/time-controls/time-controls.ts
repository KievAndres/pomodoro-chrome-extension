import { Component } from '@angular/core';

@Component({
  selector: 'time-controls',
  imports: [],
  templateUrl: './time-controls.html',
  styleUrl: './time-controls.scss',
})
export class TimeControls {
  public isPlaying: boolean = false;
  // public isPlaying

  public togglePlayPause(): void {
    this.isPlaying = !this.isPlaying;
  }
}
