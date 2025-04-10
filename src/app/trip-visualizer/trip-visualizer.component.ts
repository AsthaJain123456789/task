import { Component } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-trip-visualizer',
  imports: [DragDropModule, CommonModule, FormsModule],
  templateUrl: './trip-visualizer.component.html',
  styleUrl: './trip-visualizer.component.scss'
})
export class TripVisualizerComponent {
  start = '';
  end = '';
  trips: { start: string, end: string }[] = [];
  darkMode = false;
  editingIndex: number | null = null;
  editedStart = '';
  editedEnd = '';

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }
  addTrip() {
    if (!this.start.trim() || !this.end.trim()) {
      return;
    }
    this.trips.push({ start: this.start.toUpperCase(), end: this.end.toUpperCase() });
    this.start = '';
    this.end = '';
}
  deleteTrip(index: number) {
    this.trips.splice(index, 1);
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.trips, event.previousIndex, event.currentIndex);
  }
  exportTrips() {
    if (this.trips.length === 0) {
      alert('No trips to export.');
      return;
    }
    const tripData = JSON.stringify(this.trips, null, 2);
    localStorage.setItem('tripData', tripData);
    const blob = new Blob([tripData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trip-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Trips exported and saved to local storage.');
  }
  
  getLevel(index: number): number {
    const curr = this.trips[index];
    const prev = this.trips[index - 1];

    if (index > 0) {
      if (curr.start === prev.end) return 1;
      if (curr.start === prev.start && curr.end === prev.end) return 2;
    }

    return 1;
  }
  isArrowed(index: number): boolean {
    const curr = this.trips[index];
    const prev = this.trips[index - 1];
    return index > 0 && curr.start !== prev.end;
  }
  startEdit(index: number, trip: { start: string, end: string }) {
    this.editingIndex = index;
    this.editedStart = trip.start;
    this.editedEnd = trip.end;
  }
  
  cancelEdit() {
    this.editingIndex = null;
    this.editedStart = '';
    this.editedEnd = '';
  }
  saveEdit(index: number) {
    if (this.editedStart && this.editedEnd) {
      this.trips[index] = {
        start: this.editedStart.toUpperCase(),
        end: this.editedEnd.toUpperCase()
      };
      this.cancelEdit();
    }
  }
}
