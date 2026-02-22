import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Schedule {
  id?: number
  route_id: number
  driver_id: number
  departure_time: string
  arrival_time: string
  date: string
  vehicle_number: string
  available_seats?: number
  route_name?: string
  origin?: string
  destination?: string
  price?: number
  driver_name?: string
  created_at?: string
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
private http = inject(HttpClient)
private apiUrl = `${environment.apiUrl}/schedules`

getSchedules(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(this.apiUrl)
}

getAvailableSchedules(): Observable<Schedule[]> {
  return this.http.get<Schedule[]>(`${this.apiUrl}/available`)
}

getDriverSchedules(): Observable<Schedule[]> {
  return this.http.get<Schedule[]>(`${this.apiUrl}/driver`)
}

getSchudule(id: number): Observable<Schedule> {
  return this.http.get<Schedule>(`${this.apiUrl}/${id}`)
}

createSchedule(schedule: Schedule): Observable<any> {
  return this.http.post(this.apiUrl, schedule)
}

updateSchudle(id: number, schedule: Schedule): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, schedule)
}

deleteSchedule(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`)
}

  constructor() { }
}
