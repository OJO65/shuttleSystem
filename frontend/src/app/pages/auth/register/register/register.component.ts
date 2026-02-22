import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['customer', [Validators.required]],
    });

    if (this.authService.isAuthenticated()) {
      const user = this.authService.getCurrentUser();
      if (user?.role === 'admin') {
        this.router.navigate(['/admin']);
      } else if (user?.role === 'customer') {
        this.router.navigate(['/customer']);
      } else if (user?.role === 'driver') {
        this.router.navigate(['/driver']);
      }
    }
  }

  onSubmit() {
    console.log('RegisterComponent: onSubmit method triggered.');
    this.error = '';
    this.success = '';

    if (this.registerForm.invalid) {
      console.warn('RegisterComponent is invalid. Cannot submit.');
      this.registerForm.markAllAsTouched();
      this.error = 'Please fill in all required fields correctly';
      return;
    }

    this.loading = true;
    console.log('RegisterComponent: Form is valid. Submitting data.');

    const { name, email, password, phone, role } = this.registerForm.value;

    this.authService
      .register({ name, email, password, phone, role })
      .subscribe({
        next: (res) => {
          console.log(
            'RegisterComponent: Registration successful in component. Response.',
            res
          );
          this.success = 'Account created successfully! Please login';
          this.registerForm.reset({ role: 'customer' });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          console.error(
            'RegisterComponent: Registration failed in component. Error object:',
            err
          );
          this.error =
            err.error?.message ||
            err.message ||
            'Registration failed due to an unknown error.';
        },
        complete: () => {
          console.log('RegisterComponent: Registration observable completed.');
          this.loading = false;
        },
      });
  }
}
