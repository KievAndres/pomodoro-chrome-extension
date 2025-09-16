import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'progress-circle',
  imports: [],
  templateUrl: './progress-circle.html',
  styleUrl: './progress-circle.scss',
})
export class ProgressCircle {
  public maxValue = input.required<number>();
  public value = input.required<number>();
  public background = input<string>('#e0e0e0');
  public color = input<string>('#76e5b1');

  public circleProgress = computed(() => {
    if (this.value() > this.maxValue()) {
      return this.maxValue();
    }
    const numericValue: number =
      this.FULL_CIRCLE_PROGRESS_VALUE * (1 - this.value() / this.maxValue());
    return `${numericValue}px`;
  });

  public textXPosition = computed(() => {
    const stringValue: string = this.value().toString();
    switch (stringValue.length) {
      case 1:
        return '86px';
      case 2:
        return '72px';
      case 3:
        return '59px';
      default:
        return '40px';
    }
  })

  private readonly FULL_CIRCLE_PROGRESS_VALUE = 565;
}
