import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface ReportEntry {
  sno: number;
  date: string;
  topic: string;
  remarks: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  reportEntries: ReportEntry[] = JSON.parse(localStorage.getItem('tasks') || '[]').map((entry: ReportEntry) => ({
    ...entry,
    date: this.convertToDisplayFormat(entry.date)
  }));
  currentEntry: ReportEntry = { sno: 0, date: '', topic: '', remarks: '' };
  isEditMode = false;
  editIndex = -1;
  maxDate: string;

  constructor(private router: Router) {
    this.maxDate = this.getCurrentDate();
  }

  getCurrentDate(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  convertToDisplayFormat(dateStr: string): string {
    const [yyyy, mm, dd] = dateStr.split('-');
    return `${dd}-${mm}-${yyyy}`;
  }

  convertToStorageFormat(dateStr: string): string {
    const [dd, mm, yyyy] = dateStr.split('-');
    return `${yyyy}-${mm}-${dd}`;
  }

  addOrUpdateEntry() {
    this.currentEntry.date = this.convertToStorageFormat(this.currentEntry.date);
    if (this.isEditMode) {
      this.reportEntries[this.editIndex] = { ...this.currentEntry };
      this.isEditMode = false;
      this.editIndex = -1;
    } else {
      this.currentEntry.sno = this.reportEntries.length + 1;
      this.reportEntries.push({ ...this.currentEntry });
      localStorage.setItem('tasks', JSON.stringify(this.reportEntries.map(entry => ({
        ...entry,
        date: this.convertToStorageFormat(entry.date)
      }))));
    }
    this.currentEntry.date = this.convertToDisplayFormat(this.currentEntry.date);
    this.resetCurrentEntry();
  }

  editEntry(index: number) {
    this.currentEntry = { ...this.reportEntries[index] };
    this.isEditMode = true;
    this.editIndex = index;
  }

  deleteEntry(index: number) {
    this.reportEntries.splice(index, 1);
    this.reportEntries.forEach((entry, i) => (entry.sno = i + 1));
    localStorage.setItem('tasks', JSON.stringify(this.reportEntries.map(entry => ({
      ...entry,
      date: this.convertToStorageFormat(entry.date)
    }))));
  }

  resetCurrentEntry() {
    this.currentEntry = { sno: 0, date: '', topic: '', remarks: '' };
  }

  logout() {
    this.router.navigate(['/']);
  }
}
