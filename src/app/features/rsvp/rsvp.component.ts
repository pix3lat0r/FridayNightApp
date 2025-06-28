import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/shared/error-dialog/error-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { Guest } from '../../models/guest.model';
import { GuestService } from 'src/app/core/services/guest.service';

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.scss']
})
export class RsvpComponent implements OnInit{
  newGuestName = '';
  guests: Guest[] = [];

  constructor(
    public guestService: GuestService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.guestService.getGuests().subscribe(guests => {
      this.guests = guests.sort((a, b) => Number(a.id) - Number(b.id));
    });
  }

  async addGuest(name: string) {
    const trimmedName = name.trim();
    if (trimmedName) {
      const added = await this.guestService.addGuest(trimmedName);

      if (!added) {
        this.dialog.open(ErrorDialogComponent, {
          data: { message: `${trimmedName} is already on the guest list.` }
        });
        return;
      }

      this.newGuestName = '';  // Clear input only after successful add
    }
  }

  confirmDelete(guest: Guest): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Please confirm',
        message: `Are you sure you want to remove ${guest.name}?`
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result === true && guest.id) {
        await this.guestService.deleteGuest(guest.id);
      }
    });
  }

  onRsvpChange(guestId: string, newRsvp: string) {
    this.guestService.updateGuestRsvp(guestId, newRsvp as 'yes' | 'no' | 'maybe');
  }
}
