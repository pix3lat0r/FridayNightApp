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
    public confirmRemoveGuestDialog: MatDialog,
  ) {}

  ngOnInit(): void {
      this.guests = this.guestService.getGuests();
  }

  addGuest(name: string) {
    const trimmedName = name.trim();
    if (trimmedName) {
      const added = this.guestService.addGuest(trimmedName);

      if (!added) {
        this.confirmRemoveGuestDialog.open(ErrorDialogComponent, {
          data: { message: `${trimmedName} is already on the guest list.` }
        });
        return;
      }

      this.guests = this.guestService.getGuests();
    }
  }

  confirmDelete(guest: Guest): void {
    const dialogRef = this.confirmRemoveGuestDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Please confirm',
        message: `Are you sure you want to remove ${guest.name}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.guestService.deleteGuest(guest.id);
        this.guests = this.guestService.getGuests();
      }
    });
  }

  // deleteGuest(id: number, name: string) {
  //   const confirmed = confirm(`Are you sure you want to remove ${name}?`)
  //   if (confirmed) {
  //     this.guestService.deleteGuest(id);
  //     this.guests = this.guestService.getGuests();
  //   }
  // }

  onRsvpChange(guestId: number, newRsvp: string) {
    this.guestService.updateGuestRsvp(guestId, newRsvp as 'yes' | 'no' | 'maybe');
  }

  updateGuestRsvp(id: number, rsvp: 'yes' | 'no' | 'maybe') {
    this.guestService.updateGuestRsvp(id, rsvp);
  }
}
