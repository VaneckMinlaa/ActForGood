import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  template: `
    <mat-toolbar color="primary">
      <span routerLink="/" style="cursor: pointer;">ActForGood</span>
      <span class="spacer"></span>
      <button mat-button routerLink="/campaigns">Campagnes</button>
      <button mat-button *ngIf="!isAuthenticated" routerLink="/login">Connexion</button>
      <button mat-button *ngIf="!isAuthenticated" routerLink="/register">Inscription</button>
      <button mat-button *ngIf="isAuthenticated" routerLink="/dashboard">Tableau de bord</button>
      <button mat-button *ngIf="isAuthenticated" routerLink="/profile">Profil</button>
      <button mat-button *ngIf="isAuthenticated" (click)="logout()">Déconnexion</button>
    </mat-toolbar>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
  `]
})
export class HeaderComponent {
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
