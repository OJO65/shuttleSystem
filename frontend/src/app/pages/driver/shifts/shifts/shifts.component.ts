import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleService, Schedule } from '../../../../services/schedule.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { FormsModule } from '@angular/forms';

interface DriverShift {
  id: number
  driver_id: number
  schedule_id: number
  start_time: string
  end_time: string | null
  status: "active" | "completed"
  created_at: string
  route_name: string
  origin: string
  destination: string
  date: string
  departure_time: string
  vehicle_number: string
}

@Component({
  selector: 'app-shifts',
  imports: [CommonModule, FormsModule],
  templateUrl: './shifts.component.html',
  styleUrl: './shifts.component.css'
})
export class ShiftsComponent implements OnInit {
  private http = inject(HttpClient)
  private scheduleService = inject(ScheduleService)

  availableSchedules: Schedule[] = []
  shiftHistory: DriverShift[] = []
  activeShift: DriverShift | null = null
  selectedScheduleId: number | null = null
  startingShift = false
  endingShift = false
  shiftMessage = ""

  ngOnInit() {
    this.loadAvailableSchedules()
    this.loadShiftHistory()
  }

  loadAvailableSchedules() {
    this.scheduleService.getDriverSchedules().subscribe((schedules) => {
      // Filter for schedules that are today or in the future and not already part of an active shift
      const now = new Date()
      this.availableSchedules = schedules.filter(
        (s) => new Date(s.date) >= now && s.id !== this.activeShift?.schedule_id,
      )
    })
  }

  loadShiftHistory() {
    this.http.get<DriverShift[]>(`${environment.apiUrl}/drivers/shifts`).subscribe((shifts) => {
      this.shiftHistory = shifts
      this.activeShift = shifts.find((shift) => shift.status === "active") || null
      // Re-filter available schedules after active shift is determined
      this.loadAvailableSchedules()
    })
  }

  startShift() {
    if (!this.selectedScheduleId) {
      this.shiftMessage = "Please select a schedule to start a shift."
      return
    }
    if (this.activeShift) {
      this.shiftMessage = "You already have an active shift. Please end it first."
      return
    }

    this.startingShift = true
    this.shiftMessage = ""
    this.http.post(`${environment.apiUrl}/drivers/shift/start`, { schedule_id: this.selectedScheduleId }).subscribe({
      next: (res: any) => {
        this.startingShift = false
        this.shiftMessage = res.message
        this.loadShiftHistory() // Reload to show new active shift
        this.selectedScheduleId = null // Clear selection
      },
      error: (err) => {
        this.startingShift = false
        this.shiftMessage = err.error?.message || "Failed to start shift."
      },
    })
  }

  endShift(shiftId: number) {
    this.endingShift = true
    this.shiftMessage = ""
    this.http.post(`${environment.apiUrl}/drivers/shift/end/${shiftId}`, {}).subscribe({
      next: (res: any) => {
        this.endingShift = false
        this.shiftMessage = res.message
        this.loadShiftHistory() // Reload to update shift status
      },
      error: (err) => {
        this.endingShift = false
        this.shiftMessage = err.error?.message || "Failed to end shift."
      },
      complete: () => {
        this.activeShift = null // Clear active shift after ending
      },
    })
  }

  getStatusClass(status: string): string {
    switch (status) {
      case "active":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
}