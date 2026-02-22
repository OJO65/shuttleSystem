import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      try {
        this.currentUserSubject.next(JSON.parse(user));
        console.log(
          'AuthService: User found in localStorage:',
          JSON.parse(user)
        );
      } catch (e) {
        console.error('AuthService: Error pasrsing user from localStorage', e);
        this.logout();
      }
    } else {
      console.log('AuthService: No user found in localStorage');
    }
  }

  register(userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
  }): Observable<any> {
    console.log('AuthService: Attempting registration with data:', userData);
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap((res) => {
          console.log('AuthService: Registration successful, respons:', res);
        }),
        catchError((error) => {
          console.error('AuthService: Registration API error:', error);
          return throwError(() => error);
        })
      );
  }


  login(email: string, password: string): Observable<AuthResponse> {
    console.log("AuthService: Attempting login for:", email)
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => this.handleAuthentication(res)),
      catchError((error) => {
        console.error("AuthService: Login API error:", error)
        return throwError(() => error)
      })
    )
  }

  private handleAuthentication(res: AuthResponse): void {
    const { token, user } = res
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))
    this.currentUserSubject.next(user)

    console.log("AuthService: Authentication successful, redirecting to:", user.role)

    setTimeout(() => {
      if (user.role === "admin") {
        this.router.navigate(["/admin"])
      } else if (user.role === "customer") {
        this.router.navigate(["/customer"])
      } else if (user.role === "driver") {
        this.router.navigate(["/driver"])
      } else {
        this.router.navigate(["/login"])
      }
    }, 0)
  }

  logout(): void {
    console.log("AuthService: Logging out user.")
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    this.currentUserSubject.next(null)
    this.router.navigate(["/login"])
  }

  getToken(): string | null {
    return localStorage.getItem("token")
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser()
    return user?.role === role
  }
}
