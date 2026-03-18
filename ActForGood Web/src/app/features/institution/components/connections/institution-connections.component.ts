import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface ConnectedPub {
  id: number;
  orphanageName: string;
  orphanageCity: string;
  orphanageColor: string;
  title: string;
  need: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  date: string;
  urgent: boolean;
  myDonation: number | null; // montant que j'ai déjà donné, null si pas encore
}

@Component({
  selector: 'app-institution-connections',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './institution-connections.component.html',
  styleUrl: './institution-connections.component.scss'
})
export class InstitutionConnectionsComponent {

  publications: ConnectedPub[] = [
    {
      id: 1, orphanageName: "Orphelinat de l'Espoir", orphanageCity: 'Yaoundé', orphanageColor: '#e8f5e9',
      title: 'Fournitures scolaires — rentrée 2026',
      need: 'Éducation', description: "Nous avons besoin de fournitures scolaires pour 47 enfants pour la rentrée de septembre.",
      goalAmount: 850000, raisedAmount: 420000, date: '10 Mar 2026', urgent: true, myDonation: 150000
    },
    {
      id: 2, orphanageName: "Orphelinat de l'Espoir", orphanageCity: 'Yaoundé', orphanageColor: '#e8f5e9',
      title: 'Réfection du dortoir principal',
      need: 'Infrastructure', description: "Le toit du dortoir principal présente des infiltrations. Des travaux urgents sont nécessaires avant la saison des pluies.",
      goalAmount: 2500000, raisedAmount: 800000, date: '02 Mar 2026', urgent: false, myDonation: null
    },
    {
      id: 3, orphanageName: 'Centre Samuel', orphanageCity: 'Douala', orphanageColor: '#e3f2fd',
      title: 'Consultation médicale trimestrielle',
      need: 'Santé', description: "Financement des consultations médicales et des vaccins pour les enfants du centre ce trimestre.",
      goalAmount: 450000, raisedAmount: 120000, date: '08 Mar 2026', urgent: true, myDonation: 50000
    },
    {
      id: 4, orphanageName: 'Maison des Enfants du Nord', orphanageCity: 'Garoua', orphanageColor: '#fce4ec',
      title: 'Eau potable — installation de forage',
      need: 'Eau & Hygiène', description: "Le forage actuel est en panne depuis 3 semaines. Les enfants manquent d'eau potable.",
      goalAmount: 3200000, raisedAmount: 900000, date: '14 Mar 2026', urgent: true, myDonation: null
    },
  ];

  get connectedOrphanages(): string[] {
    return [...new Set(this.publications.map(p => p.orphanageName))];
  }

  get totalMyDonations(): number {
    return this.publications.reduce((s, p) => s + (p.myDonation ?? 0), 0);
  }

  getProgress(raised: number, goal: number): number {
    return Math.min(100, Math.round((raised / goal) * 100));
  }

  formatAmount(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }

  getInitials(name: string): string {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  needIcon(need: string): string {
    const map: Record<string, string> = {
      'Éducation': 'school', 'Alimentation': 'restaurant', 'Santé': 'local_hospital',
      'Infrastructure': 'construction', 'Eau & Hygiène': 'water_drop'
    };
    return map[need] || 'help_outline';
  }
}
