import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

export interface Publication {
  id: number;
  title: string;
  description: string;
  need: string;
  goalAmount: number;
  raisedAmount: number;
  date: string;
  urgent: boolean;
}

export interface Orphanage {
  id: number;
  name: string;
  city: string;
  region: string;
  children: number;
  verified: boolean;
  color: string;
  publications: Publication[];
}

export type FlatPublication = Publication & { orphanageName: string; orphanageColor: string; orphanageCity: string; };

@Component({
  selector: 'app-institution-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  templateUrl: './institution-home.component.html',
  styleUrl: './institution-home.component.scss'
})
export class InstitutionHomeComponent {

  searchQuery = '';
  activeCity = 'Toutes les villes';
  selectedId: number = 0; // 0 = tous

  cities = ['Toutes les villes', 'Yaoundé', 'Douala', 'Bafoussam', 'Garoua'];

  orphanages: Orphanage[] = [
    {
      id: 1, name: "Orphelinat de l'Espoir", city: 'Yaoundé', region: 'Bastos',
      children: 47, verified: true, color: '#e8f5e9',
      publications: [
        { id: 1, title: 'Fournitures scolaires — rentrée 2026', description: "Nous avons besoin de fournitures scolaires pour 47 enfants pour la rentrée de septembre. Cahiers, stylos, sacs et uniformes.", need: 'Éducation', goalAmount: 850000, raisedAmount: 420000, date: '10 Mar 2026', urgent: true },
        { id: 2, title: 'Réfection du dortoir principal', description: "Le toit du dortoir principal présente des infiltrations. Des travaux urgents sont nécessaires avant la saison des pluies.", need: 'Infrastructure', goalAmount: 2500000, raisedAmount: 800000, date: '02 Mar 2026', urgent: false },
      ]
    },
    {
      id: 2, name: 'Centre Samuel', city: 'Douala', region: 'Bonapriso',
      children: 32, verified: true, color: '#e3f2fd',
      publications: [
        { id: 3, title: 'Alimentation mensuelle — Avril 2026', description: "Couverture des besoins alimentaires de 32 enfants pour le mois d'avril. Riz, légumes, protéines et produits laitiers.", need: 'Alimentation', goalAmount: 600000, raisedAmount: 600000, date: '15 Mar 2026', urgent: false },
        { id: 4, title: 'Consultation médicale trimestrielle', description: "Financement des consultations médicales et des vaccins pour les enfants du centre ce trimestre.", need: 'Santé', goalAmount: 450000, raisedAmount: 120000, date: '08 Mar 2026', urgent: true },
      ]
    },
    {
      id: 3, name: 'Foyer Sainte-Marie', city: 'Bafoussam', region: 'Tamdjo',
      children: 28, verified: true, color: '#fff3e0',
      publications: [
        { id: 5, title: 'Matériel informatique pour la salle de classe', description: "Acquisition de 10 ordinateurs reconditionnés pour permettre aux enfants d'apprendre l'informatique.", need: 'Éducation', goalAmount: 1200000, raisedAmount: 350000, date: '12 Mar 2026', urgent: false },
      ]
    },
    {
      id: 4, name: 'Maison des Enfants du Nord', city: 'Garoua', region: 'Plateau',
      children: 61, verified: true, color: '#fce4ec',
      publications: [
        { id: 6, title: 'Eau potable — installation de forage', description: "Le forage actuel est en panne depuis 3 semaines. Les enfants manquent d'eau potable. Intervention urgente requise.", need: 'Eau & Hygiène', goalAmount: 3200000, raisedAmount: 900000, date: '14 Mar 2026', urgent: true },
        { id: 7, title: "Kits d'hygiène pour 61 enfants", description: "Distribution mensuelle de savon, dentifrice, serviettes et produits d'hygiène pour tous les enfants.", need: 'Eau & Hygiène', goalAmount: 380000, raisedAmount: 200000, date: '05 Mar 2026', urgent: false },
      ]
    },
    {
      id: 5, name: 'Orphelinat St. Joseph', city: 'Yaoundé', region: 'Melen',
      children: 39, verified: true, color: '#ede7f6',
      publications: [
        { id: 8, title: 'Soutien scolaire — cours particuliers', description: "Financement de cours de soutien en mathématiques et français pour les enfants en difficulté scolaire.", need: 'Éducation', goalAmount: 500000, raisedAmount: 310000, date: '11 Mar 2026', urgent: false },
      ]
    },
    {
      id: 6, name: 'Centre Lumière', city: 'Douala', region: 'Akwa',
      children: 24, verified: false, color: '#e0f7fa',
      publications: [
        { id: 9, title: 'Réhabilitation de la cuisine', description: "La cuisine du centre est vétuste et dangereuse. Nous cherchons des fonds pour la rénover et équiper d'un matériel sécurisé.", need: 'Infrastructure', goalAmount: 1800000, raisedAmount: 450000, date: '07 Mar 2026', urgent: true },
      ]
    },
  ];

  get totalVerified(): number { return this.orphanages.filter(o => o.verified).length; }

  get filteredOrphanages(): Orphanage[] {
    return this.orphanages.filter(o => {
      const ms = !this.searchQuery ||
        o.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        o.city.toLowerCase().includes(this.searchQuery.toLowerCase());
      const mv = this.activeCity === 'Toutes les villes' || o.city === this.activeCity;
      return ms && mv;
    });
  }

  get feedPublications(): FlatPublication[] {
    const source = this.selectedId
      ? this.filteredOrphanages.filter(o => o.id === this.selectedId)
      : this.filteredOrphanages;
    return source.flatMap(o =>
      o.publications.map(p => ({
        ...p,
        orphanageName: o.name,
        orphanageColor: o.color,
        orphanageCity: o.city
      }))
    ).sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0));
  }

  get urgentCount(): number { return this.feedPublications.filter(p => p.urgent).length; }

  selectOrphanage(id: number): void {
    this.selectedId = this.selectedId === id ? 0 : id;
  }

  setCity(city: string): void { this.activeCity = city; }

  getInitials(name: string): string {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  getProgress(raised: number, goal: number): number {
    return Math.min(100, Math.round((raised / goal) * 100));
  }

  formatAmount(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }

  needIcon(need: string): string {
    const map: Record<string, string> = {
      'Éducation': 'school', 'Alimentation': 'restaurant', 'Santé': 'local_hospital',
      'Infrastructure': 'construction', 'Eau & Hygiène': 'water_drop'
    };
    return map[need] || 'help_outline';
  }

  getSelectedName(): string {
    return this.orphanages.find(o => o.id === this.selectedId)?.name ?? '';
  }
}
