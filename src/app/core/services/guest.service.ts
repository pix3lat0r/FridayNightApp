import { Injectable } from '@angular/core';
import { Guest } from '../../models/guest.model';

const STORAGE_KEY = 'guestList';

@Injectable({
  providedIn: 'root'
})

export class GuestService {
  private guests: Guest[];

  constructor() {
    const savedGuests = localStorage.getItem(STORAGE_KEY);
    this.guests = savedGuests ? JSON.parse(savedGuests) : [
      { id: 1, name: 'Kathy', rsvp: 'no' },
      { id: 2, name: 'Mary', rsvp: 'no' },
      { id: 3, name: 'Alison', rsvp: 'no' },
      { id: 4, name: 'Angela', rsvp: 'no' },
      { id: 5, name: 'Red', rsvp: 'no' },
      { id: 6, name: 'Gary', rsvp: 'no' },
      { id: 7, name: 'Jason', rsvp: 'no' },
      { id: 8, name: 'Tyler', rsvp: 'no' },
      { id: 9, name: 'Fred', rsvp: 'no' },
      { id: 10, name: 'Daniel', rsvp: 'no' },
      { id: 11, name: 'Ryan', rsvp: 'no' },
      { id: 12, name: 'Yehchan', rsvp: 'no' }
    ];
  }

  addGuest(name: string): boolean {
    const isDuplicate = this.guests.some(
      guest => guest.name.toLowerCase() == name.toLowerCase()
    );

    if (isDuplicate) {
      return false;
    }

    const newId = this.guests.length > 0 ? Math.max(...this.guests.map(g => g.id)) + 1 : 1;
    this.guests.push({ id: newId, name, rsvp: 'no'});
    return true;
  }

  deleteGuest(id: number): boolean {
    const initialLength = this.guests.length;
    this.guests = this.guests.filter(g => g.id !== id);
    return this.guests.length < initialLength;
  }

  getGuests(): Guest[] {
    return this.guests;
  }

  updateGuestRsvp(id: number, rsvp: 'yes' | 'no' | 'maybe') {
    const guest = this.guests.find(g => g.id === id);
    if (guest) {
      guest.rsvp = rsvp;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.guests));
    }
  }
}
