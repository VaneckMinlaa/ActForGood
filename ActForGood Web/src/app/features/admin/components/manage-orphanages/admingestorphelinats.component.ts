import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UserManagementService } from '../../../../core/services/user-management.service';
import { UserDTO } from '../../../../core/models/user.model';

@Component({
  selector: 'app-admingestorphelinats',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './admingestorphelinats.component.html',
  styleUrl: './admingestorphelinats.component.scss'
})
export class AdmingestorphelinatsComponent implements OnInit {
  searchQuery = '';
  filterCity = '';
  filterStatus = '';
  
  // PAGINATION
  page = 0; // 0-indexed for backend
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  // EXPANSION
  expandedId: string | null = null;

  orphanages: UserDTO[] = [];
  isLoading = false;

  constructor(private userService: UserManagementService) {}

  ngOnInit() {
    this.loadOrphanages();
  }

  loadOrphanages() {
    this.isLoading = true;
    this.userService.getUsersByType('ORPHANAGE', this.page, this.pageSize).subscribe({
      next: (response) => {
        this.orphanages = response.data.content;
        this.totalElements = response.data.totalElements;
        this.totalPages = response.data.totalPages;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading orphanages', err);
        this.isLoading = false;
      }
    });
  }

  validateUser(id: string) {
    if (confirm('Voulez-vous vraiment valider cet orphelinat ? Un email contenant ses identifiants lui sera envoyé.')) {
      this.userService.validateUser(id).subscribe({
        next: () => {
          alert('Orphelinat validé avec succès !');
          this.loadOrphanages();
        },
        error: (err) => alert('Erreur lors de la validation')
      });
    }
  }

  rejectUser(id: string) {
    const reason = prompt('Raison du rejet :');
    if (reason) {
      this.userService.rejectUser(id, reason).subscribe({
        next: () => {
          alert('Demande rejetée.');
          this.loadOrphanages();
        },
        error: (err) => alert('Erreur lors du rejet')
      });
    }
  }

  get filtered(): UserDTO[] {
    // Client-side filtering as fallback or for small lists
    return this.orphanages.filter(o => {
      const name = o.organizationProfile?.organizationName || '';
      const ms = !this.searchQuery || name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const mc = !this.filterCity || o.location.toLowerCase().includes(this.filterCity.toLowerCase());
      const mst = !this.filterStatus || o.status === this.filterStatus;
      return ms && mc && mst;
    });
  }

  get activeCount(): number { return this.orphanages.filter(o => o.status === 'ACTIVE').length; }
  get pendingCount(): number { return this.orphanages.filter(o => o.status === 'PENDING_VALIDATION').length; }

  toggleRow(id: string) { this.expandedId = this.expandedId === id ? null : id; }

  changePage(newPage: number) {
    this.page = newPage;
    this.loadOrphanages();
  }
}
