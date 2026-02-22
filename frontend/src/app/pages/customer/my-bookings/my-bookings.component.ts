import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService, Booking } from '../../../services/booking.service';

@Component({
  selector: 'app-my-bookings',
  imports: [CommonModule],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css'
})
export class MyBookingsComponent implements OnInit {
  private bookingService = inject(BookingService)

  bookings: Booking[] = []

  ngOnInit() {
    this.loadBookings()
  }

  loadBookings() {
    this.bookingService.getUserBookings().subscribe((bookings) => {
      this.bookings = bookings
    })
  }

  getStatusClass(status: string): string {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  cancelBooking(bookingId: number) {
    if (confirm("Are you sure you want to cancel this booking?")) {
      this.bookingService.cancelBooking(bookingId).subscribe({
        next: () => {
          this.loadBookings()
          alert("Booking cancelled successfully")
        },
        error: (error) => {
          alert(error.error?.message || "Failed to cancel booking")
        },
      })
    }
  }
}
