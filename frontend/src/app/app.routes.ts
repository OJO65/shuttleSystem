import { Routes } from '@angular/router';
import { authGuard } from "./guards/auth.guard"
import { roleGuard } from "./guards/role.guard"

export const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  {
    path: "login",
    loadComponent: () => import("./pages/auth/login/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "register",
    loadComponent: () => import("./pages/auth/register/register/register.component").then((m) => m.RegisterComponent),
  },
  {
    path: "admin",
    canActivate: [authGuard, roleGuard],
    data: { role: "admin" },
    loadComponent: () =>
      import("./pages/admin/admin-dashboard/admin-dashboard.component").then((m) => m.AdminDashboardComponent),
    children: [
      { path: "", redirectTo: "overview", pathMatch: "full" },
      {
        path: "overview",
        loadComponent: () => import("./pages/admin/overview/overview.component").then((m) => m.OverviewComponent),
      },
      {
        path: "routes",
        loadComponent: () => import("./pages/admin/routes/routes.component").then((m) => m.RoutesComponent),
      },
      {
        path: "schedules",
        loadComponent: () => import("./pages/admin/schedules/schedules/schedules.component").then((m) => m.SchedulesComponent),
      },
      {
        path: "bookings",
        loadComponent: () => import("./pages/admin/bookings/bookings/bookings.component").then((m) => m.BookingsComponent),
      },
      {
        path: "users",
        loadComponent: () => import("./pages/admin/users/users/users.component").then((m) => m.UsersComponent),
      },
    ],
  },
  {
    path: "customer",
    canActivate: [authGuard, roleGuard],
    data: { role: "customer" },
    loadComponent: () =>
      import("./pages/customer/customer-dashboard/customer-dashboard.component").then(
        (m) => m.CustomerDashboardComponent,
      ),
    children: [
      { path: "", redirectTo: "book", pathMatch: "full" },
      {
        path: "book",
        loadComponent: () =>
          import("./pages/customer/book-shuttle/book-shuttle.component").then((m) => m.BookShuttleComponent),
      },
      {
        path: "my-bookings",
        loadComponent: () =>
          import("./pages/customer/my-bookings/my-bookings.component").then((m) => m.MyBookingsComponent),
      },
      {
        path: "profile",
        loadComponent: () => import("./pages/customer/profile/profile.component").then((m) => m.ProfileComponent),
      },
    ],
  },
  {
    path: "driver",
    canActivate: [authGuard, roleGuard],
    data: { role: "driver" },
    loadComponent: () =>
      import("./pages/driver/driver-dashboard/driver-dashboard.component").then((m) => m.DriverDashboardComponent),
    children: [
      { path: "", redirectTo: "schedules", pathMatch: "full" },
      {
        path: "schedules",
        loadComponent: () => import("./pages/driver/schedules/schedules/schedules.component").then((m) => m.SchedulesComponent),
      },
      {
        path: "shifts",
        loadComponent: () => import("./pages/driver/shifts/shifts/shifts.component").then((m) => m.ShiftsComponent),
      },
      {
        path: "profile",
        loadComponent: () => import("./pages/driver/profile/profile/profile.component").then((m) => m.ProfileComponent),
      },
    ],
  },
]