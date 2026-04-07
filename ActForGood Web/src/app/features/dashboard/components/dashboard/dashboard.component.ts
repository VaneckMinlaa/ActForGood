import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <app-main-layout>
      <div class="dashboard">
        <h1>Tableau de bord</h1>
        <div class="stats">
          <mat-card>
            <mat-card-title>Mes dons</mat-card-title>
            <mat-card-content>
              <p>{{ totalDonations | number }} FCFA</p>
            </mat-card-content>
          </mat-card>
          <mat-card>
            <mat-card-title>Campagnes suivies</mat-card-title>
            <mat-card-content>
              <p>{{ followedCampaigns }}</p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .dashboard {
      padding: 20px;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
  `],
  standalone: false
})
export class DashboardComponent implements OnInit {
  totalDonations = 0;
  followedCampaigns = 0;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Load user statistics
    this.loadStatistics();
  }

  private loadStatistics(): void {
    // Implementation to load user statistics
  }
}
