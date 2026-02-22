import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  ScheduleService,
  Schedule,
} from '../../../../services/schedule.service';
import { RouteService, Route } from '../../../../services/route.service';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../services/auth.service';

@Component({
  selector: 'app-schedules',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.css',
})
export class SchedulesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private scheduleService = inject(ScheduleService);
  private routeService = inject(RouteService);
  private userService = inject(UserService);

  schedules: Schedule[] = [];
  routes: Route[] = [];
  drivers: User[] = [];
  scheduleForm: FormGroup;
  showForm = false;
  editingSchedule: Schedule | null = null;
  loading = false;

  constructor() {
    this.scheduleForm = this.fb.group({
      route_id: [null, [Validators.required]],
      driver_id: [null, [Validators.required]],
      date: ['', [Validators.required]],
      departure_time: ['', [Validators.required]],
      arrival_time: ['', [Validators.required]],
      vehicle_number: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.loadSchedules();
    this.loadRoutes();
    this.loadDrivers();
  }

  loadSchedules() {
    this.scheduleService.getSchedules().subscribe((schedules) => {
      this.schedules = schedules;
    });
  }

  loadRoutes() {
    this.routeService.getRoutes().subscribe((routes) => {
      this.routes = routes;
    });
  }

loadDrivers() {
  this.userService.getDrivers().subscribe({
    next: (drivers) => this.drivers = drivers,
    error: (err) => console.error('Failed to load drivers', err),
  });
}


  onSubmit() {
    if (this.scheduleForm.valid) {
      this.loading = true;
      const scheduleData = this.scheduleForm.value;

      if (this.editingSchedule) {
        this.scheduleService
          .updateSchudle(this.editingSchedule.id!, scheduleData)
          .subscribe({
            next: () => {
              this.loading = false;
              this.loadSchedules();
              this.cancelEdit();
            },
            error: () => {
              this.loading = false;
            },
          });
      } else {
        this.scheduleService.createSchedule(scheduleData).subscribe({
          next: () => {
            this.loading = false;
            this.loadSchedules();
            this.cancelEdit();
          },
          error: () => {
            this.loading = false;
          },
        });
      }
    }
  }

  editSchedule(schedule: Schedule) {
    this.editingSchedule = schedule;
    const formattedData = schedule.date
      ? new Date(schedule.date).toISOString().split('T')[0]
      : '';
    this.scheduleForm.patchValue({
      ...schedule,
      date: formattedData,
    });
    this.showForm = true;
  }

  deleteSchedule(id: number) {
    if (confirm('Are you sure you want to delete this schedule?')) {
      this.scheduleService.deleteSchedule(id).subscribe(() => {
        this.loadSchedules();
      });
    }
  }

  cancelEdit() {
    this.showForm = false;
    this.editingSchedule = null;
    this.scheduleForm.reset();
    this.scheduleForm.get('route_id')?.setValue(null);
    this.scheduleForm.get('driver_id')?.setValue(null);
  }
}
