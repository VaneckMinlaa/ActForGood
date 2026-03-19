import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-campaign-detail',
  template: `
    <div class="campaign-detail" *ngIf="campaign">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ campaign.title }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>{{ campaign.description }}</p>
          <p><strong>Objectif:</strong> {{ campaign.targetAmount | number }} FCFA</p>
          <p><strong>Collecté:</strong> {{ campaign.currentAmount | number }} FCFA</p>
          <p><strong>Localisation:</strong> {{ campaign.location }}</p>
          <button mat-raised-button color="primary" (click)="donate()">Faire un don</button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .campaign-detail {
      padding: 90px 20px;
      max-width: 800px;
      margin: 0 auto;
      background: var(--bg-deep);
      color: var(--text-main);
      min-height: 100vh;
    }
  `]
})
export class CampaignDetailComponent implements OnInit {
  campaign: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apiService.get(`/campaigns/${id}`).subscribe({
        next: (data: any) => this.campaign = data,
        error: (err) => console.error('Error loading campaign', err)
      });
    }
  }

  donate(): void {
    // Navigate to donation page
    this.router.navigate(['/donations', this.campaign.id]);
  }
}
