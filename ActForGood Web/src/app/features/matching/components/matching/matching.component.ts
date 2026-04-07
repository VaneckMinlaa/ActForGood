import { Component, OnInit } from '@angular/core';
import { MatchingService } from '../../../../core/services/matching.service';
import { MatchScore } from '../../../../core/models/match-score';

@Component({
  selector: 'app-matching',
  template: `
    <div class="matching-container">
      <h1>Recommandations pour vous</h1>
      <div class="recommendations-grid">
        <mat-card *ngFor="let match of recommendations" class="match-card">
          <mat-card-header>
            <mat-card-title>{{ match.campaignTitle }}</mat-card-title>
            <mat-card-subtitle>Score: {{ (match.score * 100).toFixed(0) }}%</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>{{ match.reason }}</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button [routerLink]="['/campaigns', match.campaignId]">Voir campagne</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .matching-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .recommendations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
  `],
  standalone: false
})
export class MatchingComponent implements OnInit {
  recommendations: MatchScore[] = [];

  constructor(private matchingService: MatchingService) {}

  ngOnInit(): void {
    // TODO: Get donor ID from auth service
    const donorId = 'donor-id-placeholder';
    this.matchingService.getRecommendations(donorId).subscribe({
      next: (recommendations) => {
        this.recommendations = recommendations;
      },
      error: (err) => {
        console.error('Error loading recommendations', err);
      }
    });
  }
}
