import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-institution-projects',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="stub-page">
      <mat-icon>folder_open</mat-icon>
      <h2>Mes Projets</h2>
      <p>Créez et gérez vos projets de collecte de fonds.</p>
    </div>
  `,
  styles: [`
    .stub-page { text-align: center; padding: 80px 20px; color: #1a4a3a; }
    mat-icon { font-size: 56px; width: 56px; height: 56px; opacity: 0.3; display: block; margin: 0 auto 16px; }
    h2 { font-size: 1.4rem; margin: 0 0 8px; }
    p { color: #888; }
  `]
})
export class InstitutionProjectsComponent {}
