import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleService, Schedule } from '../../../../services/schedule.service';

@Component({
  selector: 'app-schedules',
  imports: [CommonModule],
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.css'
})
export class SchedulesComponent implements OnInit {
  private scheduleService = inject(ScheduleService)

  schedules: Schedule[] = []

  ngOnInit() {
    this.loadDriverSchedules()
  }

  loadDriverSchedules() {
    this.scheduleService.getDriverSchedules().subscribe((schedules) => {
      this.schedules = schedules
    })
  }
}