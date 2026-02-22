import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ScheduleService, Schedule } from '../../../services/schedule.service';
import { BookingService } from '../../../services/booking.service';


@Component({
  selector: 'app-book-shuttle',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-shuttle.component.html',
  styleUrl: './book-shuttle.component.css'
})
export class BookShuttleComponent implements OnInit {
  private fb = inject(FormBuilder)
  private scheduleService = inject(ScheduleService)
  private bookingService = inject(BookingService)

  availableSchedules: Schedule[] = []
  selectedSchedule: Schedule | null = null
  selectedSeat: number | null = null
  bookedSeats: number[] = []
  bookingForm: FormGroup
  loading = false
  bookingSuccess = false
  bookingReference = ""

  constructor() {
    this.bookingForm = this.fb.group({
      passenger_name: ["", [Validators.required]],
      passenger_phone: ["", [Validators.required]],
    })
  }

  ngOnInit() {
    this.loadAvailableSchedules()
  }

  loadAvailableSchedules() {
    this.scheduleService.getAvailableSchedules().subscribe((schedules) => {
      this.availableSchedules = schedules
    })
  }

  selectSchedule(schedule: Schedule) {
    this.selectedSchedule = schedule
    this.selectedSeat = null
    this.loadBookedSeats(schedule.id!)
  }

  loadBookedSeats(scheduleId: number) {
    this.bookingService.getBookedSeats(scheduleId).subscribe((seats) => {
      this.bookedSeats = seats
    })
  }

  selectSeat(seatNumber: number) {
    if (!this.bookedSeats.includes(seatNumber)) {
      this.selectedSeat = seatNumber
    }
  }

  getSeatClass(seatNumber: number): string {
    if (this.bookedSeats.includes(seatNumber)) {
      return "bg-red-200 border-red-400 cursor-not-allowed"
    } else if (this.selectedSeat === seatNumber) {
      return "bg-blue-200 border-blue-400"
    } else {
      return "bg-green-200 border-green-400 hover:bg-green-300"
    }
  }

  onSubmit() {
    if (this.bookingForm.valid && this.selectedSchedule && this.selectedSeat) {
      this.loading = true

      const bookingData = {
        schedule_id: this.selectedSchedule.id!,
        seat_number: this.selectedSeat,
        passenger_name: this.bookingForm.value.passenger_name,
        passenger_phone: this.bookingForm.value.passenger_phone,
      }

      this.bookingService.createBooking(bookingData).subscribe({
        next: (response) => {
          this.loading = false
          this.bookingSuccess = true
          this.bookingReference = response.booking.booking_reference
          this.resetForm()
        },
        error: (error) => {
          this.loading = false
          alert(error.error?.message || "Booking failed")
        },
      })
    }
  }

  resetForm() {
    this.selectedSchedule = null
    this.selectedSeat = null
    this.bookedSeats = []
    this.bookingForm.reset()
    this.loadAvailableSchedules()
  }
}
