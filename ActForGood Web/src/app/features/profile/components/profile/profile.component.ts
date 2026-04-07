import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  template: `
    <app-main-layout>
      <div class="profile">
        <h1>Mon Profil</h1>
        <mat-card *ngIf="user">
          <mat-card-content>
            <p><strong>Nom:</strong> {{ user.firstName }} {{ user.lastName }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Type:</strong> {{ user.userType }}</p>
          </mat-card-content>
        </mat-card>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .profile {
      padding: 20px;
    }
  `],
  standalone: false
})
export class ProfileComponent implements OnInit {
  user: any;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.apiService.get(`/users/${user.userId}`).subscribe({
          next: (data: any) => this.user = data,
          error: (err) => console.error('Error loading user', err)
        });
      }
    });
  }
}
