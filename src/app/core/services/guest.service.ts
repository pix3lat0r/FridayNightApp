import { Injectable } from '@angular/core';
import { Guest } from '../../models/guest.model';
import { collection, Firestore, doc, setDoc, deleteDoc, updateDoc, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { collectionData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  private guestCollectionRef;

  constructor(private firestore: Firestore) {
    // Initialize the collection reference once using the injected Firestore instance
    this.guestCollectionRef = collection(this.firestore, 'guests');
  }

  // Live stream of guests - updates automatically when Firestore changes
  getGuests(): Observable<Guest[]> {
    return collectionData(this.guestCollectionRef, { idField: 'id' }) as Observable<Guest[]>;
  }

  // One-time fetch of guests snapshot
  async getGuestsOnce(): Promise<Guest[]> {
    const snapshot = await getDocs(this.guestCollectionRef);
    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Guest, 'id'>)
    }));
  }

  // Add guest only if not duplicate (case insensitive)
  async addGuest(name: string): Promise<boolean> {
    try {
      const guests = await this.getGuestsOnce();

      const isDuplicate = guests.some(
        guest => guest.name.toLowerCase() === name.toLowerCase()
      );
      if (isDuplicate) {
        console.warn('[GuestService] Duplicate guest:', name);
        return false;
      }

      // Generate new ID by incrementing max existing ID or start at 1
      const newId = guests.length > 0
        ? (Math.max(...guests.map(g => +g.id! || 0)) + 1).toString()
        : '1';

      await setDoc(doc(this.guestCollectionRef, newId), {
        id: newId,
        name,
        rsvp: 'no'
      });

      console.log('[GuestService] Added guest:', name);
      return true;
    } catch (error) {
      console.error('[GuestService] Error adding guest:', error);
      throw error;  // Let the caller handle errors if needed
    }
  }

  async deleteGuest(id: string): Promise<void> {
    await deleteDoc(doc(this.guestCollectionRef, id));
  }

  async updateGuestRsvp(id: string, rsvp: 'yes' | 'no' | 'maybe'): Promise<void> {
    const guestDocRef = doc(this.guestCollectionRef, id);
    await updateDoc(guestDocRef, { rsvp });
  }
}


// constructor() {
//   const savedGuests = localStorage.getItem(STORAGE_KEY);
//   this.guests = savedGuests ? JSON.parse(savedGuests) : [
//     { id: 1, name: 'Kathy', rsvp: 'no' },
//     { id: 2, name: 'Mary', rsvp: 'no' },
//     { id: 3, name: 'Alison', rsvp: 'no' },
//     { id: 4, name: 'Angela', rsvp: 'no' },
//     { id: 5, name: 'Red', rsvp: 'no' },
//     { id: 6, name: 'Gary', rsvp: 'no' },
//     { id: 7, name: 'Jason', rsvp: 'no' },
//     { id: 8, name: 'Tyler', rsvp: 'no' },
//     { id: 9, name: 'Fred', rsvp: 'no' },
//     { id: 10, name: 'Daniel', rsvp: 'no' },
//     { id: 11, name: 'Ryan', rsvp: 'no' },
//     { id: 12, name: 'Yehchan', rsvp: 'no' }
//   ];
// }
