import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {

  menuItems = [
    { icon: 'dashboard',          label: 'Dashboard Hub',                route: '/admin',               exact: true },
    { icon: 'account_balance',    label: 'Gestion des Institutions',     route: '/admin/institutions' },
    { icon: 'volunteer_activism', label: 'Gestion des Donateurs',        route: '/admin/donors' },
    { icon: 'swap_horiz',         label: 'Gestion des Transactions',     route: '/admin/transactions' },
    { icon: 'folder_open',        label: 'Gestion des Projets',          route: '/admin/projects' },
    { icon: 'home_work',          label: 'Orphelinats & Associations',   route: '/admin/orphanages' },
    { icon: 'notifications',      label: 'Notifications',                route: '/admin/notifications' }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
