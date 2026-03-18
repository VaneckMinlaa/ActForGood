import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface DevUser {
  role: string;
  email: string;
  name: string;
  redirectUrl: string;
}

@Component({
  selector: 'app-dev-login',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './dev-login.component.html',
  styleUrls: ['./dev-login.component.scss']
})
export class DevLoginComponent {
  devUsers: DevUser[] = [
    {
      role: 'ADMIN',
      email: 'admin@actforgood.com',
      name: 'Administrateur',
      redirectUrl: '/admin'
    },
    {
      role: 'ORGANIZATION',
      email: 'org@actforgood.com',
      name: 'Organisation',
      redirectUrl: '/dashboard'
    },
    {
      role: 'DONOR',
      email: 'donor@actforgood.com',
      name: 'Donateur',
      redirectUrl: '/'
    }
  ];

  constructor(private router: Router) {}

  loginAs(user: DevUser): void {
    const fakeAuthResponse = {
      token: `fake-${user.role.toLowerCase()}-token-${Date.now()}`,
      userId: `${user.role.toLowerCase()}-001`,
      email: user.email,
      userType: user.role,
      expiresIn: 3600
    };

    localStorage.setItem('token', fakeAuthResponse.token);
    localStorage.setItem('user', JSON.stringify(fakeAuthResponse));
    const expiresAt = Date.now() + fakeAuthResponse.expiresIn * 1000;
    localStorage.setItem('expiresAt', expiresAt.toString());

    this.router.navigate([user.redirectUrl]);
  }

  getRoleIcon(role: string): string {
    switch (role) {
      case 'ADMIN':
        return 'admin_panel_settings';
      case 'ORGANIZATION':
        return 'business';
      case 'DONOR':
        return 'volunteer_activism';
      default:
        return 'person';
    }
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'ADMIN':
        return '#e89b2c';
      case 'ORGANIZATION':
        return '#2196f3';
      case 'DONOR':
        return '#4caf50';
      default:
        return '#666';
    }
  }
}
