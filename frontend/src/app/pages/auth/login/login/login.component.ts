import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
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
    console.log('LoginComponent: onSubmit method triggered.');
    this.error = '';

    if (this.loginForm.invalid) {
      console.warn('LoginComponent: Form is invalid. Cannot submit.');
      this.loginForm.markAllAsTouched();
      this.error = 'Please enter valid email and password.';
      return;
    }

    this.loading = true;
    console.log('LoginComponent: Form is valid. Submitting data.');

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.loading = false;
        console.log(
          'LoginComponent: Login successful, user role:',
          res.user.role
        );
      },
      error: (err) => {
        this.loading = false;
        console.error(
          'LoginComponent: Login failed in component, Error object:',
          err
        );
        this.error =
          err.error?.message ||
          err.message ||
          'Login failed. Please check your credentials.';
      },
      complete: () => {
        console.log('LoginComponent: Login observable completed.');
      },
    });
  }
}
