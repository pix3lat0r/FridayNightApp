export interface Guest {
    id?: string;
    name: string;
    rsvp: 'yes' | 'no' | 'maybe';
}