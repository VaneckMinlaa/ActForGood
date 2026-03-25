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
  firstName: string;
  lastName: string;
  phone?: string;
  userType: string;
  location?: string;
  country?: string;

  // Organization fields
  organizationName?: string;
  organizationType?: string;
  creationYear?: string | number;
  website?: string;
  address?: string;
  mission?: string;
  sectors?: string[];

  // Document URL placeholders (to be set after potential upload)
  rccm?: string;
  taxId?: string;
  legalDocUrl?: string;
  statutesUrl?: string;
  minasAuthUrl?: string;
  assocReceiptUrl?: string;
  rulesInternalUrl?: string;
  registryEntryUrl?: string;
  socialInquiryUrl?: string;
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
        if (response && response.token) {
          this.storeUser(response);
          this.currentUserSubject.next(response);
        }
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
    const token = localStorage.getItem('token');
    return (token && token !== 'null' && token !== 'undefined') ? token : null;
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
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return '/admin';
      case 'ORGANIZATION':
      case 'NGO':
      case 'ORPHANAGE':
        return '/institution';
      case 'DONOR':
      case 'PARTNER':
        return '/';
      default:
        return '/';
    }
  }

  private storeUser(user: AuthResponse): void {
    if (!user || !user.token) return;
    
    localStorage.setItem('token', user.token);
    localStorage.setItem('user', JSON.stringify(user));
    const expiresAt = Date.now() + (user.expiresIn || 3600) * 1000;
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
    if (!userStr || userStr === 'null') return null;
    return JSON.parse(userStr);
  }
}
