import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[];
    
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    const user = JSON.parse(userStr);
    const userRole = user.userType;

    if (requiredRoles && requiredRoles.includes(userRole)) {
      return true;
    }

    // Redirection selon le rôle
    if (userRole === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else if (userRole === 'ORGANIZATION') {
      this.router.navigate(['/institution']);
    } else {
      this.router.navigate(['/']);
    }
    
    return false;
  }
}
