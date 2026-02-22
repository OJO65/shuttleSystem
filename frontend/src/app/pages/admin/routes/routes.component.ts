import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouteService, Route } from '../../../services/route.service';

@Component({
  selector: 'app-routes',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.css',
})
export class RoutesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private routeService = inject(RouteService);

  routes: Route[] = [];
  routeForm: FormGroup;
  showForm = false;
  editingRoute: Route | null = null;
  loading = false;

  constructor() {
    this.routeForm = this.fb.group({
      name: ['', [Validators.required]],
      origin: ['', [Validators.required]],
      destination: ['', [Validators.required]],
      distance: ['', [Validators.required, Validators.min(0)]],
      duration: ['', [Validators.required, Validators.min(0)]],
      price: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.loadRoutes();
  }

  loadRoutes() {
    this.routeService.getRoutes().subscribe((routes) => {
      this.routes = routes;
    });
  }

  onSubmit() {
    if (this.routeForm.valid) {
      this.loading = true;
      const routeData = this.routeForm.value;

      if (this.editingRoute) {
        this.routeService
          .updateRoute(this.editingRoute.id!, routeData)
          .subscribe({
            next: () => {
              this.loading = false;
              this.loadRoutes();
              this.cancelEdit();
            },
            error: () => {
              this.loading = false;
            },
          });
      }
    }
  }

  editRoute(route: Route) {
    this.editingRoute = route;
    this.routeForm.patchValue(route);
    this.showForm = true;
  }

  deleteRoute(id: number) {
    if (confirm('Are you sure you want to delete this route?')) {
      this.routeService.deleteRoute(id).subscribe(() => {
        this.loadRoutes();
      });
    }
  }

  cancelEdit() {
    this.showForm = false;
    this.editingRoute = null;
    this.routeForm.reset();
  }
}
