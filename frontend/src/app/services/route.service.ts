import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


export interface Route {
  id?: number
  name: string
  origin: string
  destination: string
  distance: number
  duration: number
  price: number
  created_at?: string 
}

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private http = inject(HttpClient)
  private apiUrl = `${environment.apiUrl}/routes`

  getRoutes(): Observable<Route[]> {
    return this.http.get<Route[]>(this.apiUrl)
  }

  getRoute(id: number): Observable<Route> {
    return this.http.get<Route>(`${this.apiUrl}/${id}`)
  }

  createRoute(route: Route): Observable<any> {
    return this.http.post(this.apiUrl, route)
  }

  updateRoute(id: number, route: Route): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, route)
  }

  deleteRoute(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
  }

  constructor() { }
}
