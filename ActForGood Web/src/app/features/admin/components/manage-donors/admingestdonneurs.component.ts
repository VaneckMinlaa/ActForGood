import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface Donor {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalDonations: number;
  donationCount: number;
  lastDonation: string;
  status: 'Actif' | 'Inactif';
  registeredDate: string;
  donations: { id: string; date: string; amount: number; org: string; hash?: string }[];
}

@Component({
  selector: 'app-admingestdonneurs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  templateUrl: './admingestdonneurs.component.html',
  styleUrl: './admingestdonneurs.component.scss'
})
export class AdmingestdonneursComponent {

  searchQuery = '';
  filterStatus = '';
  selectedDonor: Donor | null = null;
  showDeleteConfirm = false;
  deleteConfirmText = '';

  donors: Donor[] = [
    {
      id: 1, name: 'Jean Dupont', email: 'jean.dupont@email.com', phone: '+237 690 123 456',
      city: 'Douala', totalDonations: 500000, donationCount: 12,
      lastDonation: '2024-03-15', status: 'Actif', registeredDate: '2023-05-10',
      donations: [
        { id: 'TX001', date: '2024-03-15', amount: 50000, org: 'Espoir de Douala', hash: '0x9c41...a12c' },
        { id: 'TX002', date: '2024-02-10', amount: 75000, org: 'Avenir Sahel', hash: '0x7b22...c34d' },
        { id: 'TX003', date: '2024-01-05', amount: 100000, org: 'Water First', hash: '0x3f11...e56f' }
      ]
    },
    {
      id: 2, name: 'Marie Kamga', email: 'marie.kamga@email.com', phone: '+237 677 234 567',
      city: 'Yaoundé', totalDonations: 1200000, donationCount: 25,
      lastDonation: '2024-03-18', status: 'Actif', registeredDate: '2023-03-15',
      donations: [
        { id: 'TX004', date: '2024-03-18', amount: 200000, org: 'SOS Children', hash: '0x1a2b...3c4d' }
      ]
    },
    {
      id: 3, name: 'Paul Mbarga', email: 'paul.mbarga@email.com', phone: '+237 655 345 678',
      city: 'Bafoussam', totalDonations: 300000, donationCount: 8,
      lastDonation: '2024-01-20', status: 'Inactif', registeredDate: '2023-06-20',
      donations: []
    }
  ];

  get filteredDonors(): Donor[] {
    return this.donors.filter(d => {
      const matchSearch = !this.searchQuery ||
        d.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        d.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchStatus = !this.filterStatus || d.status === this.filterStatus;
      return matchSearch && matchStatus;
    });
  }

  get totalAmount(): number {
    let t = 0;
    for (const d of this.donors) t += d.totalDonations;
    return t;
  }

  get activeCount(): number { return this.donors.filter(d => d.status === 'Actif').length; }

  openDetail(donor: Donor): void {
    this.selectedDonor = donor;
    this.showDeleteConfirm = false;
    this.deleteConfirmText = '';
  }

  closeDetail(): void { this.selectedDonor = null; }

  toggleStatus(donor: Donor): void {
    donor.status = donor.status === 'Actif' ? 'Inactif' : 'Actif';
  }

  confirmDelete(): void {
    if (this.deleteConfirmText === 'SUPPRIMER' && this.selectedDonor) {
      this.donors = this.donors.filter(d => d.id !== this.selectedDonor!.id);
      this.selectedDonor = null;
      this.showDeleteConfirm = false;
      this.deleteConfirmText = '';
    }
  }
}
