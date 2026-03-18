import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

interface Orphanage {
  id: number; name: string; city: string; region: string;
  children: number; capacity: number; director: string;
  phone: string; email: string; institution: string;
  status: 'Actif' | 'Inactif' | 'En révision';
  createdAt: string; needs: string[];
  donations: { date: string; amount: number; donor: string }[];
}

@Component({
  selector: 'app-admingestorphelinats',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './admingestorphelinats.component.html',
  styleUrl: './admingestorphelinats.component.scss'
})
export class AdmingestorphelinatsComponent {

  searchQuery = ''; filterCity = ''; filterStatus = '';
  selected: Orphanage | null = null;

  orphanages: Orphanage[] = [
    {
      id: 1, name: 'Foyer Lumière', city: 'Douala', region: 'Littoral',
      children: 45, capacity: 60, director: 'Sœur Marie-Claire',
      phone: '+237 699 111 222', email: 'foyer.lumiere@gmail.com',
      institution: 'Espoir de Douala', status: 'Actif', createdAt: '2018-03-10',
      needs: ['Nourriture', 'Médicaments', 'Fournitures scolaires'],
      donations: [
        { date: '2024-03-10', amount: 150000, donor: 'Jean Dupont' },
        { date: '2024-02-15', amount: 200000, donor: 'Marie Kamga' }
      ]
    },
    {
      id: 2, name: 'Maison Espoir', city: 'Bonabéri', region: 'Littoral',
      children: 32, capacity: 50, director: 'M. Alain Nkeng',
      phone: '+237 677 333 444', email: 'maison.espoir@yahoo.fr',
      institution: 'Espoir de Douala', status: 'Actif', createdAt: '2020-07-22',
      needs: ['Vêtements', 'Jouets', 'Livres'],
      donations: [
        { date: '2024-01-20', amount: 80000, donor: 'Paul Mbarga' }
      ]
    },
    {
      id: 3, name: 'Centre Avenir', city: 'Maroua', region: 'Extrême-Nord',
      children: 60, capacity: 70, director: 'Mme Aïcha Bello',
      phone: '+237 655 555 666', email: 'centre.avenir@hotmail.com',
      institution: 'Avenir Sahel', status: 'En révision', createdAt: '2019-11-05',
      needs: ['Eau potable', 'Nourriture', 'Soins médicaux'],
      donations: []
    }
  ];

  get filtered(): Orphanage[] {
    return this.orphanages.filter(o => {
      const ms = !this.searchQuery || o.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const mc = !this.filterCity || o.city.toLowerCase().includes(this.filterCity.toLowerCase());
      const mst = !this.filterStatus || o.status === this.filterStatus;
      return ms && mc && mst;
    });
  }

  get totalChildren(): number { let t = 0; for (const o of this.orphanages) t += o.children; return t; }
  get activeCount(): number { return this.orphanages.filter(o => o.status === 'Actif').length; }

  getOccupancyPct(o: Orphanage): number { return Math.round((o.children / o.capacity) * 100); }

  getStatusClass(s: string): string {
    if (s === 'Actif') return 'badge-active';
    if (s === 'Inactif') return 'badge-inactive';
    return 'badge-review';
  }

  open(o: Orphanage): void { this.selected = o; }
  close(): void { this.selected = null; }
}
