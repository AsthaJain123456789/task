import { Component } from '@angular/core';
import { TripVisualizerComponent } from './trip-visualizer/trip-visualizer.component';
@Component({
  selector: 'app-root',
  imports: [TripVisualizerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'task';
}
