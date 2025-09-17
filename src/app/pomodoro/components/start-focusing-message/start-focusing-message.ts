import { Component } from '@angular/core';
import { RotatingSphereComponent } from "@/app/shared/components/rotating-sphere/rotating-sphere.component";

@Component({
  selector: 'start-focusing-message',
  imports: [RotatingSphereComponent],
  templateUrl: './start-focusing-message.html',
  styleUrl: './start-focusing-message.scss',
})
export class StartFocusingMessage { }
