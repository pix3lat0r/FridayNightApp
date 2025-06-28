import { Component, OnInit } from '@angular/core';
import { ItineraryService, ItineraryRow } from 'src/app/core/services/itinerary.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/shared/error-dialog/error-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss']
})
export class ItineraryComponent implements OnInit {
  today = new Date();
  upcomingFriday = this.getUpcomingFriday();
  itinerary: ItineraryRow[] = [];
  newRow: ItineraryRow = { time: '', activity: '', location: '' };
  editingField: { [id: string]: { [key: string]: boolean } } = {};
  showAddRow: boolean = false;

  constructor(
    private itineraryService: ItineraryService,
    private confirmDeleteRowDialog: MatDialog,
    private confirmResetDialog: MatDialog,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // First, call async method to insert missing defaults
    this.itineraryService.loadDefaults().then(() => {
      // Then subscribe to Firestore updates
      this.itineraryService.getRows().subscribe(rows => {
        this.itinerary = rows;
        this.showAddRow = false;
      });
    });
  }  

  getUpcomingFriday(): Date {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7; // next Friday even if today is Friday
    const nextFriday = new Date(today);
    nextFriday.setDate(today.getDate() + daysUntilFriday);
    return nextFriday;
  }

  isTodayFriday(): boolean {
    return new Date().getDay() === 5;
  }

  showError(message: string) {
    this.dialog.open(ErrorDialogComponent, { data: { message } });
  }

  startEditing(id: string, field: keyof ItineraryRow) {
    this.editingField[id] = { ...this.editingField[id], [field]: true };
  }

  async stopEditing(id: string, field: keyof ItineraryRow, row: ItineraryRow) {
    this.editingField[id][field] = false;
    if (row.id) {
      await this.itineraryService.updateRow(row.id, row);
    } else {
      this.showError('Unable to update: missing row ID');
    }
  }

  async handleResetItineraryClick() {
    const dialogRef = this.confirmResetDialog.open(ConfirmDialogComponent, {
      data: { title: 'Please confirm', message: `Are you sure you want to reset the itinerary?` }
    });

    const result = await firstValueFrom(dialogRef.afterClosed());
    if (result === true) {
      await this.resetItinerary();
    }
  }

  async handleAddRowClick() {
    if (this.itinerary.length >= 6) {
      this.showError('Maximum of 6 rows allowed.');
      return;
    }
    this.showAddRow = true;
  }

  async addRow(row: ItineraryRow) {
    if (!row.time && !row.activity && !row.location) {
      this.showAddRow = false;
      return;
    }

    const added = await this.itineraryService.addRow(row);
    if (added) {
      this.newRow = { time: '', activity: '', location: '' };
      this.showAddRow = false;
    } else {
      this.showError('Maximum of 6 rows allowed.');
    }
  }

  async confirmDelete(id: string) {
    const dialogRef = this.confirmDeleteRowDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Please confirm',
        message: `Are you sure you want to remove this row?`
      }
    });

    const result = await firstValueFrom(dialogRef.afterClosed());
    if (result === true) {
      // Find the row by id in the itinerary array
      const row = this.itinerary.find(r => r.id === id);
      if (row?.id) {
        await this.itineraryService.deleteRow(row.id);
      } else {
        this.showError('Unable to delete: missing row ID');
      }
    }
  }

  cancelAddRow() {
    this.showAddRow = false;
  }

  async resetItinerary() {
    await this.itineraryService.reset();
    this.showAddRow = false;
  }
}
