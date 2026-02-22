import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from "@angular/router"
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-driver-dashboard',
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './driver-dashboard.component.html',
  styleUrl: './driver-dashboard.component.css'
})
export class DriverDashboardComponent {
  private authService = inject(AuthService)
  private router = inject(Router)

  currentUser = this.authService.getCurrentUser()

  logout() {
    this.authService.logout()
    this.router.navigate(["/login"])
  }
}