import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

export interface Institution {
  id: number;
  name: string;
  type: 'ONG' | 'Entreprise' | 'Association';
  city: string;
  sector: string;
  status: 'Validé' | 'En attente' | 'Rejeté';
  createdAt: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  mission: string;
  rccm: string;
  niu: string;
  responsable: string;
  orphanages: { id: number; name: string; city: string; children: number }[];
  transactions: { id: string; date: string; amount: number; type: string; donor: string; hash?: string; platform: boolean }[];
  reports: { id: number; title: string; date: string; type: string; url: string }[];
  messages: { id: number; from: string; date: string; content: string; direction: 'sent' | 'received' }[];
}

@Component({
  selector: 'app-admingestinstitutions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  templateUrl: './admingestinstitutions.component.html',
  styleUrl: './admingestinstitutions.component.scss'
})
export class AdmingestinstitutionsComponent {

  searchQuery = '';
  filterType = '';
  filterCity = '';
  filterStatus = '';

  selectedInstitution: Institution | null = null;
  activeTab = 'profil';
  showDeleteConfirm = false;
  deleteConfirmText = '';
  rejectReason = '';
  showRejectForm = false;
  contactMessage = '';
  contactSubject = '';
  showValidationSuccess = false;

  institutions: Institution[] = [
    {
      id: 1, name: 'Espoir de Douala', type: 'ONG', city: 'Douala', sector: 'Humanitaire',
      status: 'En attente', createdAt: '2024-01-15', email: 'contact@espoirdouala.cm',
      phone: '+237 699 123 456', website: 'www.espoirdouala.cm', address: 'Akwa, Douala',
      mission: "Apporter aide et soutien aux populations vulnérables de la région du Littoral.",
      rccm: 'RC/DLA/2023/B/1234', niu: 'P123456789',
      responsable: 'Jean-Paul Mbarga',
      orphanages: [
        { id: 1, name: 'Foyer Lumière', city: 'Douala', children: 45 },
        { id: 2, name: 'Maison Espoir', city: 'Bonabéri', children: 32 }
      ],
      transactions: [
        { id: 'TX001', date: '2024-03-10', amount: 500000, type: 'Don en espèces', donor: 'Marie Dupont', hash: '0x9c41...a12c', platform: true },
        { id: 'TX002', date: '2024-02-20', amount: 1200000, type: 'Subvention', donor: 'Fondation XYZ', platform: false },
        { id: 'TX003', date: '2024-01-05', amount: 300000, type: 'Don en nature', donor: 'Entreprise ABC', platform: false }
      ],
      reports: [
        { id: 1, title: "Rapport d'activité T1 2024", date: '2024-04-01', type: 'Activité', url: '#' },
        { id: 2, title: 'Bilan financier 2023', date: '2024-01-20', type: 'Financier', url: '#' }
      ],
      messages: [
        { id: 1, from: 'Admin', date: '2024-03-15 10:30', content: 'Bonjour, merci de compléter vos documents légaux.', direction: 'sent' },
        { id: 2, from: 'Jean-Paul Mbarga', date: '2024-03-15 14:00', content: 'Bien reçu, nous allons les soumettre cette semaine.', direction: 'received' }
      ]
    },
    {
      id: 2, name: 'Avenir Sahel', type: 'Association', city: 'Maroua', sector: 'Éducation',
      status: 'Validé', createdAt: '2023-06-10', email: 'info@avenirsahel.org',
      phone: '+237 677 987 654', website: 'www.avenirsahel.org', address: 'Centre, Maroua',
      mission: "Promouvoir l'éducation et la formation professionnelle dans l'Extrême-Nord.",
      rccm: 'RC/MRW/2022/A/5678', niu: 'P987654321',
      responsable: 'Fatima Oumarou',
      orphanages: [
        { id: 3, name: 'Centre Avenir', city: 'Maroua', children: 60 }
      ],
      transactions: [
        { id: 'TX004', date: '2024-03-18', amount: 750000, type: 'Don en espèces', donor: 'Pierre Martin', hash: '0x7b22...c34d', platform: true }
      ],
      reports: [
        { id: 3, title: 'Rapport annuel 2023', date: '2024-02-15', type: 'Annuel', url: '#' }
      ],
      messages: []
    },
    {
      id: 3, name: 'TechCare Cameroun', type: 'Entreprise', city: 'Yaoundé', sector: 'Technologie',
      status: 'Rejeté', createdAt: '2024-02-01', email: 'csr@techcare.cm',
      phone: '+237 655 321 789', website: 'www.techcare.cm', address: 'Bastos, Yaoundé',
      mission: "Soutenir les initiatives numériques pour les jeunes défavorisés.",
      rccm: 'RC/YDE/2024/C/9012', niu: 'P112233445',
      responsable: 'Samuel Nkomo',
      orphanages: [],
      transactions: [],
      reports: [],
      messages: [
        { id: 3, from: 'Admin', date: '2024-02-10 09:00', content: 'Votre dossier a été rejeté pour documents incomplets.', direction: 'sent' }
      ]
    }
  ];

  get filteredInstitutions(): Institution[] {
    return this.institutions.filter(i => {
      const matchSearch = !this.searchQuery || i.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchType = !this.filterType || i.type === this.filterType;
      const matchCity = !this.filterCity || i.city.toLowerCase().includes(this.filterCity.toLowerCase());
      const matchStatus = !this.filterStatus || i.status === this.filterStatus;
      return matchSearch && matchType && matchCity && matchStatus;
    });
  }

  get pendingCount(): number { return this.institutions.filter(i => i.status === 'En attente').length; }
  get validatedCount(): number { return this.institutions.filter(i => i.status === 'Validé').length; }
  get rejectedCount(): number { return this.institutions.filter(i => i.status === 'Rejeté').length; }

  get totalAmount(): number {
    if (!this.selectedInstitution) return 0;
    let total = 0;
    for (const t of this.selectedInstitution.transactions) {
      total += t.amount;
    }
    return total;
  }

  openDetail(inst: Institution): void {
    this.selectedInstitution = inst;
    this.activeTab = 'profil';
    this.showDeleteConfirm = false;
    this.showRejectForm = false;
    this.rejectReason = '';
    this.contactMessage = '';
    this.contactSubject = '';
  }

  closeDetail(): void {
    this.selectedInstitution = null;
  }

  validate(): void {
    if (this.selectedInstitution) {
      this.selectedInstitution.status = 'Validé';
      this.showValidationSuccess = true;
      setTimeout(() => this.showValidationSuccess = false, 3000);
    }
  }

  reject(): void {
    if (this.selectedInstitution && this.rejectReason.trim()) {
      this.selectedInstitution.status = 'Rejeté';
      this.showRejectForm = false;
      this.rejectReason = '';
    }
  }

  sendMessage(): void {
    if (this.selectedInstitution && this.contactMessage.trim()) {
      this.selectedInstitution.messages.push({
        id: Date.now(),
        from: 'Admin',
        date: new Date().toLocaleString('fr-FR'),
        content: this.contactMessage,
        direction: 'sent'
      });
      this.contactMessage = '';
      this.contactSubject = '';
    }
  }

  confirmDelete(): void {
    if (this.deleteConfirmText === 'SUPPRIMER' && this.selectedInstitution) {
      this.institutions = this.institutions.filter(i => i.id !== this.selectedInstitution!.id);
      this.selectedInstitution = null;
      this.showDeleteConfirm = false;
      this.deleteConfirmText = '';
    }
  }

  generateReport(): void {
    alert('Rapport synthétique généré (fonctionnalité à connecter au backend).');
  }

  getStatusClass(status: string): string {
    if (status === 'Validé') return 'badge-valid';
    if (status === 'En attente') return 'badge-pending';
    return 'badge-rejected';
  }

  getTypeClass(type: string): string {
    if (type === 'ONG') return 'type-ong';
    if (type === 'Entreprise') return 'type-entreprise';
    return 'type-association';
  }
}
