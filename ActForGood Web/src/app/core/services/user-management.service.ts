import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserDTO } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(page: number = 0, size: number = 20): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  getUsersByType(type: string, page: number = 0, size: number = 20): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/type/${type}?page=${page}&size=${size}`);
  }

  searchUsers(query: string, page: number = 0, size: number = 20): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search?query=${query}&page=${page}&size=${size}`);
  }

  validateUser(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/validate`, {});
  }

  rejectUser(id: string, reason: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/reject`, reason);
  }

  activateUser(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/activate`, {});
  }

  suspendUser(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/suspend`, {});
  }

  deactivateUser(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/deactivate`, {});
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
