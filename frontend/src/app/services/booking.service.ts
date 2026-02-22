import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Booking {
  id?: number
  user_id?: number
  schedule_id: number
  seat_number: number
  passenger_name: string
  passenger_phone: string
  total_amount?: number
  booking_reference?: string
  status?: string
  created_at?: string
  customer_name?: string
  customer_email?: string
  date?: string
  departure_time?: string
  arrival_time?: string
  vehicle_number?: string
  route_name?: string
  origin?: string
  destination?: string
  driver_name?: string
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private http = inject(HttpClient)
  private apiUrl = `${environment.apiUrl}/bookings`

  createBooking(booking: Booking): Observable<any> {
    return this.http.post(this.apiUrl, booking)
  }

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl)
  } 

  getUserBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/my-bookings`)
  }

  getBookedSeats(scheduleId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/seats/${scheduleId}`)
  }

  getBooking(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`)
  }

  updateBookingStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, {status})
  }

  cancelBooking(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
  }

  constructor() { }
}
