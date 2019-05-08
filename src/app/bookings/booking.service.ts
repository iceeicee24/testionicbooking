import { Injectable } from '@angular/core';
import { Booking } from './booking.model';

@Injectable ({
    providedIn: 'root'
})
export class BookingService {
    private _bookings: Booking[] = [{
        id: '1',
        plcadId: 'p1',
        placeTitle: 'Sydney Mansion',
        guestNumber: 2,
        userId: 'abc'
    }];

    get bookings() {
        return [...this._bookings];
    }
}
