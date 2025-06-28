import { Injectable } from "@angular/core";
import { Firestore, collection, doc, getDocs, setDoc, deleteDoc, updateDoc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface ItineraryRow {
    id?: string;          // Firestore document ID
    time: string;
    activity: string;
    location: string;
}

@Injectable({
    providedIn: 'root'
})
export class ItineraryService {
    private readonly COLLECTION_NAME = 'itinerary';
    private defaultRows: ItineraryRow[] = [
        { time: '6:00 PM', activity: 'Meet', location: 'Finch' },
        { time: '6:30 PM', activity: 'Dinner', location: 'Magic Noodle' },
        { time: '8:30 PM', activity: 'Dessert', location: 'TBD' },
        { time: '9:30 PM', activity: 'Karaoke', location: 'Twister' },
    ];

    constructor(private firestore: Firestore) {}

    async loadDefaults(): Promise<void> {
        const snapshot = await getDocs(collection(this.firestore, this.COLLECTION_NAME));
        if (snapshot.size < this.defaultRows.length) {
            console.log("[ItineraryService] Inserting missing default itinerary rows...");
            const existingTimes = snapshot.docs.map(docSnap => (docSnap.data() as ItineraryRow).time);
            for (const row of this.defaultRows) {
                if (!existingTimes.includes(row.time)) {
                    const newDoc = doc(collection(this.firestore, this.COLLECTION_NAME));
                    await setDoc(newDoc, row);
                }
            }
        }
      }

    getRows(): Observable<ItineraryRow[]> {
        // Returns an Observable that emits the list of itinerary rows with their Firestore IDs
        return collectionData(collection(this.firestore, this.COLLECTION_NAME), { idField: 'id' }) as Observable<ItineraryRow[]>;
    }

    async addRow(row: ItineraryRow): Promise<boolean> {
        // First check if limit reached (6 rows max)
        const rows = await this.getRowsOnce();
        if (rows.length >= 6) return false;

        try {
            const newDocRef = doc(collection(this.firestore, this.COLLECTION_NAME));
            await setDoc(newDocRef, {
                time: row.time,
                activity: row.activity,
                location: row.location
            });
            return true;
        } catch (error) {
            console.error('Error adding itinerary row:', error);
            return false;
        }
    }

    async updateRow(id: string, row: ItineraryRow): Promise<void> {
        try {
            const docRef = doc(this.firestore, this.COLLECTION_NAME, id);
            await updateDoc(docRef, {
                time: row.time,
                activity: row.activity,
                location: row.location
            });
        } catch (error) {
            console.error('Error updating itinerary row:', error);
        }
    }

    async deleteRow(id: string): Promise<void> {
        try {
            const docRef = doc(this.firestore, this.COLLECTION_NAME, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting itinerary row:', error);
        }
    }

    async reset(): Promise<void> {
        try {
            const rows = await this.getRowsOnce();
            const deletePromises = rows.map(row => row.id ? deleteDoc(doc(this.firestore, this.COLLECTION_NAME, row.id)) : Promise.resolve());
            await Promise.all(deletePromises);

            const addPromises = this.defaultRows.map(row => {
                const newDocRef = doc(collection(this.firestore, this.COLLECTION_NAME));
                return setDoc(newDocRef, row);
            });
            await Promise.all(addPromises);
        } catch (error) {
            console.error('Error resetting itinerary:', error);
        }
    }

    private async getRowsOnce(): Promise<ItineraryRow[]> {
        const snapshot = await collectionData(collection(this.firestore, this.COLLECTION_NAME), { idField: 'id' }).pipe().toPromise();
        return snapshot as ItineraryRow[];
    }
}
