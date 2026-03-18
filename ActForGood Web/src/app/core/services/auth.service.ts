import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  userType: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: string;
  location?: string;
  country?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.storeUser(response);
        this.currentUserSubject.next(response);
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(response => {
        this.storeUser(response);
        this.currentUserSubject.next(response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('expiresAt');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const expires = localStorage.getItem('expiresAt');
    if (!token || !expires) {
      return false;
    }
    // if current time passed expiration, clear data
    if (Date.now() > Number(expires)) {
      this.logout();
      return false;
    }
    return true;
  }

  getUserRole(): string | null {
    const user = this.getStoredUser();
    return user ? user.userType : null;
  }

  getCurrentUser(): AuthResponse | null {
    return this.getStoredUser();
  }

  getRedirectUrlByRole(role: string): string {
    switch (role) {
      case 'ADMIN':
        return '/admin';
      case 'ORGANIZATION':
        return '/institution';
      case 'DONOR':
        return '/';
      default:
        return '/';
    }
  }

  private storeUser(user: AuthResponse): void {
    localStorage.setItem('token', user.token);
    localStorage.setItem('user', JSON.stringify(user));
    const expiresAt = Date.now() + user.expiresIn * 1000;
    localStorage.setItem('expiresAt', expiresAt.toString());
  }

  private getStoredUser(): AuthResponse | null {
    const expires = localStorage.getItem('expiresAt');
    if (expires && Date.now() > Number(expires)) {
      // session expired, clear stored data
      this.logout();
      return null;
    }
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}
