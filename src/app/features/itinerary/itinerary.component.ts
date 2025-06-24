// can use OnInit when you need to fetch API, initialize dynamically
// import { Component, OnInit } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ItineraryService, ItineraryRow } from 'src/app/core/services/itinerary.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/shared/error-dialog/error-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss']
})

// see above: 
// export class ItineraryComponent implements OnInit {
export class ItineraryComponent implements OnInit {

  today = new Date();
  upcomingFriday = this.getUpcomingFriday();
  itinerary: ItineraryRow[] = [];
  newRow: ItineraryRow = { time: '', activity: '', location: '' };
  editingField: { [index: number]: { [key: string]: boolean } } = {};
  showAddRow: boolean = false;

  constructor(private itineraryService: ItineraryService, 
              private confirmDeleteRowDialog: MatDialog,
              private confirmResetDialog: MatDialog,
              private dialog: MatDialog) {
    this.itinerary = this.itineraryService.getRows();
  }

  ngOnInit(): void {
    this.refreshItinerary();
  }

  getUpcomingFriday(): Date {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7; // default to next Friday even if today is Friday
    const nextFriday = new Date(today);
    nextFriday.setDate(today.getDate() + daysUntilFriday);
    return nextFriday;
  }

  isTodayFriday(): boolean {
    return new Date().getDay() === 5;
  }

  showError(message: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: { message },
    });
  }

  startEditing(index: number, field: keyof ItineraryRow) {
    this.editingField[index] = { ...this.editingField[index], [field]: true };
  }

  stopEditing(index: number, field: keyof ItineraryRow, row: ItineraryRow) {
    this.editingField[index][field] = false;
    this.updateRow(index, row);
  }

  handleResetItineraryClick() {
    const dialogRef = this.confirmResetDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Please confirm',
        message: `Are you sure you want to reset the itinerary?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.resetItinerary();
      }
    });
  }

  handleAddRowClick() {
    if (this.itinerary.length >= 6) {
      this.showError('Maximum of 6 rows allowed.');
      return;
    }
    this.showAddRow = true;
  }

  addRow(row: ItineraryRow) {
    if (!row.time && !row.activity && !row.location) {
      this.showAddRow = false;
      return;
    }

    const added = this.itineraryService.addRow(row);
    if (added) {
      this.refreshItinerary();
      this.newRow = { time: '', activity: '', location: '' };
      this.showAddRow = false;
    } else {
      this.showError('Maximum of 6 rows allowed.');
    }
  }

  updateRow(index: number, row: ItineraryRow) {
    this.itineraryService.updateRow(index, row);
    this.refreshItinerary();
  }

  confirmDelete(index: number) {
    const dialogRef = this.confirmDeleteRowDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Please confirm',
        message: `Are you sure you want to remove this row?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteRow(index);
      }
    });
  }

  deleteRow(index: number) {
    this.itineraryService.deleteRow(index);
    this.refreshItinerary();
  }

  cancelAddRow() {
    this.showAddRow = false;
    return;
  }

  resetItinerary() {
    this.itineraryService.reset();
    this.refreshItinerary();
    this.showAddRow = false;
  }

  private refreshItinerary(): void {
    this.itinerary = this.itineraryService.getRows();
    this.showAddRow = false;
    // this.showAddRow = this.itinerary.length < 6;
  }

}
