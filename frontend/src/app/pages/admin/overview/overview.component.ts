import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteService } from '../../../services/route.service';
import { ScheduleService } from '../../../services/schedule.service';
import { BookingService } from '../../../services/booking.service';

@Component({
  selector: 'app-overview',
  imports: [CommonModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
})
export class OverviewComponent implements OnInit {
  private routeService = inject(RouteService);
  private scheduleService = inject(ScheduleService);
  private bookingService = inject(BookingService);

  stats = {
    totalRoutes: 0,
    totalSchedules: 0,
    totalBookings: 0,
    totalRevenue: 0,
  };

  recentBookings: any[] = [];

  ngOnInit() {
    this.loadStats();
    this.loadRecentBookings();
  }

  loadStats() {
    this.routeService.getRoutes().subscribe((routes) => {
      this.stats.totalRoutes = routes.length;
    });

    this.scheduleService.getSchedules().subscribe((schedules) => {
      this.stats.totalSchedules = schedules.length;
    });

    this.bookingService.getBookings().subscribe((bookings) => {
      this.stats.totalBookings = bookings.length;
      this.stats.totalRevenue = bookings.reduce(
        (sum, booking) => sum + (booking.total_amount || 0),
        0
      );
    });
  }

  loadRecentBookings() {
    this.bookingService.getBookings().subscribe((bookings) => {
      this.recentBookings = bookings.slice(0, 10);
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
}
