import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

interface Transaction {
  id: string; date: string; amount: number; type: string;
  donor: string; recipient: string; status: 'Complété' | 'En attente' | 'Échoué';
  hash?: string; platform: boolean;
}

@Component({
  selector: 'app-admingestfondsetdons',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './admingestfondsetdons.component.html',
  styleUrl: './admingestfondsetdons.component.scss'
})
export class AdmingestfondsetdonsComponent {

  searchQuery = ''; 
  filterStatus = ''; 
  filterType = '';

  // PAGINATION
  pageCode = 1;
  pageSize = 10;

  // EXPANSION
  expandedId: string | null = null;

  transactions: Transaction[] = [
    { id: 'TX001', date: '2024-03-18', amount: 500000, type: 'Don en espèces', donor: 'Jean Dupont', recipient: 'Espoir de Douala', status: 'Complété', hash: '0x9c41...a12c', platform: true },
    { id: 'TX002', date: '2024-03-15', amount: 1200000, type: 'Subvention', donor: 'Fondation XYZ', recipient: 'Avenir Sahel', status: 'Complété', platform: false },
    { id: 'TX003', date: '2024-03-10', amount: 300000, type: 'Don en nature', donor: 'Entreprise ABC', recipient: 'Foyer Lumière', status: 'Complété', platform: false },
    { id: 'TX004', date: '2024-03-08', amount: 750000, type: 'Don en espèces', donor: 'Marie Kamga', recipient: 'Water First', status: 'En attente', hash: '0x7b22...c34d', platform: true },
    { id: 'TX005', date: '2024-03-05', amount: 200000, type: 'Don en espèces', donor: 'Paul Mbarga', recipient: 'SOS Children', status: 'Échoué', hash: '0x3f11...e56f', platform: true }
  ];

  get filtered(): Transaction[] {
    let list = this.transactions.filter(t => {
      const ms = !this.searchQuery || t.donor.toLowerCase().includes(this.searchQuery.toLowerCase()) || t.recipient.toLowerCase().includes(this.searchQuery.toLowerCase()) || t.id.toLowerCase().includes(this.searchQuery.toLowerCase());
      const mst = !this.filterStatus || t.status === this.filterStatus;
      const mt = !this.filterType || t.type === this.filterType;
      return ms && mst && mt;
    });
    return list.slice((this.pageCode - 1) * this.pageSize, this.pageCode * this.pageSize);
  }

  get totalPages() { return Math.ceil(this.transactions.length / this.pageSize); }

  get totalVolume(): number { let t = 0; for (const tx of this.transactions) if (tx.status === 'Complété') t += tx.amount; return t; }
  get pendingCount(): number { return this.transactions.filter(t => t.status === 'En attente').length; }
  get platformCount(): number { return this.transactions.filter(t => t.platform).length; }

  getStatusClass(s: string): string {
    if (s === 'Complété') return 'badge-active';
    if (s === 'En attente') return 'badge-pending';
    return 'badge-failed';
  }

  toggleExpand(id: string) { this.expandedId = this.expandedId === id ? null : id; }
}
