import { Injectable } from "@angular/core";

export interface ItineraryRow {
    time: string;
    activity: string;
    location: string;
}

@Injectable({
    providedIn: 'root'
})
export class ItineraryService {
    private STORAGE_KEY = 'itinerary';
    private rows: ItineraryRow[] = [];

    private defaultRows: ItineraryRow[] = [
        { time: '6:00 PM', activity: 'Meet', location: 'Finch' },
        { time: '6:30 PM', activity: 'Dinner', location: 'Magic Noodle' },
        { time: '8:30 PM', activity: 'Dessert', location: 'TBD' },
        { time: '9:30 PM', activity: 'Karaoke', location: 'Twister' },
    ]

    constructor() {
        this.load();
    }

    private load() {
        const saved = localStorage.getItem(this.STORAGE_KEY);

        if (!saved) {
            this.rows = saved ? JSON.parse(saved) : [...this.defaultRows];
            return;
        }

        try {
            const parsed: ItineraryRow[] = JSON.parse(saved);

            const isSameAsDefault = 
                parsed.length === this.defaultRows.length && parsed.every((row, index) =>
                    row.time === this.defaultRows[index].time &&
                    row.activity === this.defaultRows[index].activity &&
                    row.location === this.defaultRows[index].location
                );

                this.rows = isSameAsDefault ? [...this.defaultRows] : parsed;
        } catch (e) {
            this.rows = [...this.defaultRows];
        }
        
    }

    private save() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.rows));
    }

    getRows(): ItineraryRow[] {
        return [...this.rows];
    }

    addRow(row: ItineraryRow): boolean {
        if (this.rows.length == 6) return false;
        this.rows.push(row);
        this.save();
        return true;
    }

    updateRow(index: number, row: ItineraryRow) {
        if (index < 0 || index >= this.rows.length) return;
        this.rows[index] = row;
        this.save();
    }

    deleteRow(index: number) {
        if (index < 0 || index >= this.rows.length) return;
        this.rows.splice(index, 1);
        this.save();
    }

    reset() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.rows = [];
        this.save();
    }
}