import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-campaign-list',
  template: `
    <div class="campaign-list">
      <h1>Campagnes Actives</h1>
      <div class="campaigns-grid">
        <mat-card *ngFor="let campaign of campaigns" class="campaign-card">
          <mat-card-header>
            <mat-card-title>{{ campaign.title }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>{{ campaign.description }}</p>
            <p><strong>Objectif:</strong> {{ campaign.targetAmount | number }} FCFA</p>
            <p><strong>Collecté:</strong> {{ campaign.currentAmount | number }} FCFA</p>
            <mat-progress-bar 
              mode="determinate" 
              [value]="(campaign.currentAmount / campaign.targetAmount) * 100">
            </mat-progress-bar>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button routerLink="/campaigns/{{ campaign.id }}">Voir détails</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .campaign-list {
      padding: 20px;
    }
    .campaigns-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .campaign-card {
      height: 100%;
    }
  `]
})
export class CampaignListComponent implements OnInit {
  campaigns: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.get('/campaigns/active').subscribe({
      next: (data: any) => this.campaigns = data,
      error: (err) => console.error('Error loading campaigns', err)
    });
  }
}
