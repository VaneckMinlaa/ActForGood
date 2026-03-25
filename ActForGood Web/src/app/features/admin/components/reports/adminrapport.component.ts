import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

interface Report {
  id: number; title: string; institution: string; type: string;
  date: string; status: 'Validé' | 'En attente' | 'Rejeté'; size: string;
}

@Component({
  selector: 'app-adminrapport',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './adminrapport.component.html',
  styleUrl: './adminrapport.component.scss'
})
export class AdminrapportComponent {

  searchQuery = ''; 
  filterType = ''; 
  filterStatus = '';

  // PAGINATION
  pageCode = 1;
  pageSize = 10;

  // EXPANSION
  expandedId: number | null = null;

  reports: Report[] = [
    { id: 1, title: "Rapport d'activité T1 2024", institution: 'Espoir de Douala', type: 'Activité', date: '2024-04-01', status: 'En attente', size: '2.4 MB' },
    { id: 2, title: 'Bilan financier 2023', institution: 'Avenir Sahel', type: 'Financier', date: '2024-01-20', status: 'Validé', size: '1.8 MB' },
    { id: 3, title: 'Rapport annuel 2023', institution: 'TechCare Cameroun', type: 'Annuel', date: '2024-02-15', status: 'Rejeté', size: '3.1 MB' },
    { id: 4, title: 'Audit des dons Q4 2023', institution: 'Water First', type: 'Audit', date: '2024-03-10', status: 'Validé', size: '0.9 MB' },
    { id: 5, title: "Rapport d'impact social", institution: 'SOS Children', type: 'Impact', date: '2024-03-18', status: 'En attente', size: '4.2 MB' }
  ];

  get filtered(): Report[] {
    let list = this.reports.filter(r => {
      const ms = !this.searchQuery || r.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || r.institution.toLowerCase().includes(this.searchQuery.toLowerCase());
      const mt = !this.filterType || r.type === this.filterType;
      const mst = !this.filterStatus || r.status === this.filterStatus;
      return ms && mt && mst;
    });
    return list.slice((this.pageCode - 1) * this.pageSize, this.pageCode * this.pageSize);
  }

  get totalPages() { return Math.ceil(this.reports.length / this.pageSize); }

  get pendingCount(): number { return this.reports.filter(r => r.status === 'En attente').length; }
  get validatedCount(): number { return this.reports.filter(r => r.status === 'Validé').length; }

  validate(r: Report): void { r.status = 'Validé'; }
  reject(r: Report): void { r.status = 'Rejeté'; }

  getStatusClass(s: string): string {
    if (s === 'Validé') return 'badge-active';
    if (s === 'En attente') return 'badge-pending';
    return 'badge-failed';
  }

  getTypeIcon(t: string): string {
    const map: Record<string, string> = { Activité: 'event_note', Financier: 'account_balance_wallet', Annuel: 'calendar_today', Audit: 'verified', Impact: 'trending_up' };
    return map[t] || 'description';
  }

  toggleExpand(id: number) { this.expandedId = this.expandedId === id ? null : id; }
}
