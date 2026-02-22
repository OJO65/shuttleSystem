import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService, Booking } from '../../../../services/booking.service';

@Component({
  selector: 'app-bookings',
  imports: [CommonModule],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.css',
})
export class BookingsComponent implements OnInit {
  private bookingService = inject(BookingService);

  bookings: Booking[] = [];

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings() {
    this.bookingService.getBookings().subscribe((bookings) => {
      this.bookings = bookings;
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  updateBookingStatus(bookingId: number, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value;
    if (
      confirm(`Are you sure you want to change the status to ${newStatus}?`)
    ) {
      this.bookingService.updateBookingStatus(bookingId, newStatus).subscribe({
        next: () => {
          this.loadBookings();
          alert('Booking status updated successfully');
        },
        error: (error) => {
          alert(error.error?.message || 'Failed to update status');
        },
      });
    } else {
      selectElement.value =
        this.bookings.find((b) => b.id === bookingId)?.status || '';
    }
  }
}
