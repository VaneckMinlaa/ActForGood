import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

interface DonRecord {
  orphanage: string;
  project: string;
  amount: number;
  date: string;
  status: 'confirmé' | 'en attente' | 'rejeté';
}

interface Report {
  orphanage: string;
  title: string;
  date: string;
  type: string;
}

@Component({
  selector: 'app-institution-activity',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './institution-activity.component.html',
  styleUrl: './institution-activity.component.scss'
})
export class InstitutionActivityComponent {

  totalDonated   = 25800000;
  donCount       = 18;
  orphanagesAided = 4;
  pendingCount   = 2;

  monthlyDons = [
    { month: 'Oct', amount: 1200000 },
    { month: 'Nov', amount: 2800000 },
    { month: 'Déc', amount: 1500000 },
    { month: 'Jan', amount: 3200000 },
    { month: 'Fév', amount: 4100000 },
    { month: 'Mar', amount: 2450000 },
  ];

  get maxAmount(): number { return Math.max(...this.monthlyDons.map(m => m.amount)); }

  getBarHeight(amount: number): number {
    return Math.round((amount / this.maxAmount) * 100);
  }

  donHistory: DonRecord[] = [
    { orphanage: "Orphelinat de l'Espoir", project: 'Fournitures scolaires',       amount: 150000,  date: '10 Mar 2026', status: 'confirmé'   },
    { orphanage: 'Centre Samuel',          project: 'Consultation médicale',        amount: 50000,   date: '08 Mar 2026', status: 'confirmé'   },
    { orphanage: 'Maison des Enfants',     project: 'Eau potable — forage',         amount: 500000,  date: '05 Mar 2026', status: 'en attente' },
    { orphanage: "Orphelinat de l'Espoir", project: 'Réfection du dortoir',         amount: 300000,  date: '28 Fév 2026', status: 'confirmé'   },
    { orphanage: 'Foyer Sainte-Marie',     project: 'Matériel informatique',        amount: 200000,  date: '20 Fév 2026', status: 'confirmé'   },
    { orphanage: 'Centre Samuel',          project: 'Alimentation mensuelle',       amount: 120000,  date: '15 Fév 2026', status: 'en attente' },
  ];

  reports: Report[] = [
    { orphanage: "Orphelinat de l'Espoir", title: 'Rapport d\'utilisation — Fournitures scolaires', date: '12 Mar 2026', type: 'Utilisation des fonds' },
    { orphanage: 'Centre Samuel',          title: 'Rapport médical trimestriel Q1 2026',             date: '01 Mar 2026', type: 'Rapport médical'       },
    { orphanage: 'Foyer Sainte-Marie',     title: 'Bilan d\'activité Février 2026',                  date: '28 Fév 2026', type: 'Bilan mensuel'         },
  ];

  statusColor(s: string): string {
    return s === 'confirmé' ? '#2e7d32' : s === 'en attente' ? '#e65100' : '#c62828';
  }
  statusBg(s: string): string {
    return s === 'confirmé' ? '#e8f5e9' : s === 'en attente' ? '#fff3e0' : '#ffebee';
  }

  formatAmount(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }
}
