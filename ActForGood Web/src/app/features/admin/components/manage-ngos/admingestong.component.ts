import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { UserManagementService } from '../../../../core/services/user-management.service';
import { UserDTO } from '../../../../core/models/user.model';

@Component({
  selector: 'app-admingestong',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, FormsModule],
  templateUrl: './admingestong.component.html',
  styleUrl: './admingestong.component.scss'
})
export class AdmingestongComponent implements OnInit {
  activeTab: 'ngos' | 'projects' = 'ngos';
  searchQuery = '';
  
  // PAGINATION
  ngoPage = 0;
  ngoSize = 10;
  totalNgoElements = 0;
  ngoTotalPages = 0;

  projectPage = 1;
  projectSize = 5;

  // EXPANSION
  expandedNgoId: string | null = null;
  expandedProjectId: number | null = null;

  ngos: UserDTO[] = [];
  isLoading = false;

  projects = [
    { id: 1, title: 'École pour Tous', ngo: 'Espoir de Douala', category: 'Éducation', progress: 75, funding: '12M F', status: 'Actif', date: '2024-01-10' },
    { id: 2, title: 'Clinique Mobile Sahel', ngo: 'Avenir Sahel', category: 'Santé', progress: 40, funding: '25M F', status: 'Actif', date: '2024-02-15' },
    { id: 3, title: 'Puits de l\'Espoir', ngo: 'Water First Africa', category: 'Eau', progress: 100, funding: '8M F', status: 'Terminé', date: '2023-11-20' },
    { id: 4, title: 'Reboisement Nord', ngo: 'Green Hands', category: 'Forêt', progress: 20, funding: '3M F', status: 'En pause', date: '2024-03-01' },
  ];

  constructor(private userService: UserManagementService) {}

  ngOnInit() {
    this.loadNGOs();
  }

  loadNGOs() {
    this.isLoading = true;
    this.userService.getUsersByType('NGO', this.ngoPage, this.ngoSize).subscribe({
      next: (response) => {
        this.ngos = response.data.content;
        this.totalNgoElements = response.data.totalElements;
        this.ngoTotalPages = response.data.totalPages;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading NGOs', err);
        this.isLoading = false;
      }
    });
  }

  validateUser(id: string) {
    if (confirm('Valider cette ONG ?')) {
      this.userService.validateUser(id).subscribe({
        next: () => {
          alert('ONG validée.');
          this.loadNGOs();
        },
        error: () => alert('Erreur validation')
      });
    }
  }

  rejectUser(id: string) {
    const reason = prompt('Raison rejet :');
    if (reason) {
      this.userService.rejectUser(id, reason).subscribe({
        next: () => {
          alert('Rejeté.');
          this.loadNGOs();
        },
        error: () => alert('Erreur rejet')
      });
    }
  }

  get pendingNgos() { return this.ngos.filter(n => n.status === 'PENDING_VALIDATION').length; }
  get activeProjectsCount() { return this.projects.filter(p => p.status === 'Actif').length; }

  get filteredNgos() {
    return this.ngos.filter(n => {
      const name = n.organizationProfile?.organizationName || '';
      return name.toLowerCase().includes(this.searchQuery.toLowerCase());
    });
  }

  get filteredProjects() {
    let list = this.projects.filter(p => p.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || p.ngo.toLowerCase().includes(this.searchQuery.toLowerCase()));
    return list.slice((this.projectPage - 1) * this.projectSize, this.projectPage * this.projectSize);
  }

  get projectTotalPages() { return Math.ceil(this.projects.length / this.projectSize); }

  toggleNgo(id: string) { this.expandedNgoId = this.expandedNgoId === id ? null : id; }
  toggleProject(id: number) { this.expandedProjectId = this.expandedProjectId === id ? null : id; }

  changeNgoPage(p: number) {
    this.ngoPage = p;
    this.loadNGOs();
  }
}
