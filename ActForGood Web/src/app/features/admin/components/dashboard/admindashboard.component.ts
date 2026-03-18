import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admindashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './admindashboard.component.html',
  styleUrl: './admindashboard.component.scss'
})
export class AdmindashboardComponent {

  activeTab = 'overview';

  tabs = [
    { key: 'overview',    label: "Vue d'Ensemble" },
    { key: 'validations', label: 'Validations ONG' },
    { key: 'analytics',   label: 'Analytique Donateurs' },
    { key: 'reports',     label: 'Rapports & Activités' },
    { key: 'projects',    label: 'Supervision Projets' }
  ];

  categoryProjects = [
    { label: 'ÉDUCATION',   pct: 45, color: '#1a4a3a' },
    { label: 'SANTÉ',       pct: 30, color: '#1a4a3a' },
    { label: 'EAU & HYGIÈNE', pct: 15, color: '#F59542' },
    { label: 'URGENCE',     pct: 10, color: '#e53935' }
  ];

  pendingNgos = [
    { initials: 'ED', color: '#F59542', name: 'Espoir de Douala', sub: 'Humanitaire • Douala',
      risk: 'ÉLEVÉ', riskColor: '#e53935', riskBg: '#fdecea', docs: 3, status: 'En attente', statusColor: '#F59542' },
    { initials: 'AS', color: '#4caf50', name: 'Avenir Sahel', sub: 'Éducation • Maroua',
      risk: 'FAIBLE', riskColor: '#4caf50', riskBg: '#e8f5e9', docs: 1, status: 'En cours', statusColor: '#2196f3' }
  ];

  lastReports = [
    { icon: 'description', iconBg: '#fff3e0', iconColor: '#F59542',
      title: "Rapport d'activité : SOS Children", meta: 'Soumis il y a 2h • Attente revue', tags: ['Santé', 'Douala'] },
    { icon: 'verified', iconBg: '#e8f5e9', iconColor: '#4caf50',
      title: 'Audit financier : Water First', meta: "Validé par Blockchain • Aujourd'hui 10/15", hash: '0x9c41...a12c' }
  ];

  barData = [
    { month: 'Mai',  cash: 60, nature: 30 },
    { month: 'Juin', cash: 80, nature: 45 },
    { month: 'Juil', cash: 55, nature: 25 },
    { month: 'Août', cash: 90, nature: 50 },
    { month: 'Sep',  cash: 70, nature: 35 },
    { month: 'Oct',  cash: 100, nature: 60 }
  ];
}
