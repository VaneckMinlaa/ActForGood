import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { UserManagementService } from '../../../../core/services/user-management.service';
import { UserDTO } from '../../../../core/models/user.model';

@Component({
  selector: 'app-admingestdonneurs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  templateUrl: './admingestdonneurs.component.html',
  styleUrl: './admingestdonneurs.component.scss'
})
export class AdmingestdonneursComponent implements OnInit {

  searchQuery = '';
  filterStatus = '';

  // PAGINATION
  page = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  // EXPANSION
  expandedId: string | null = null;

  donors: UserDTO[] = [];
  isLoading = false;

  constructor(private userService: UserManagementService) {}

  ngOnInit() {
    this.loadDonors();
  }

  loadDonors() {
    this.isLoading = true;
    this.userService.getUsersByType('DONOR', this.page, this.pageSize).subscribe({
      next: (response) => {
        this.donors = response.data.content;
        this.totalElements = response.data.totalElements;
        this.totalPages = response.data.totalPages;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading donors', err);
        this.isLoading = false;
      }
    });
  }

  get filteredDonors(): UserDTO[] {
    return this.donors.filter(d => {
      const matchSearch = !this.searchQuery ||
        (d.firstName + ' ' + (d.lastName || '')).toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        d.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchStatus = !this.filterStatus || d.status === this.filterStatus;
      return matchSearch && matchStatus;
    });
  }

  get activeCount(): number { return this.donors.filter(d => d.status === 'ACTIVE').length; }
  get pendingCount(): number { return this.donors.filter(d => d.status === 'PENDING_VALIDATION').length; }

  validateUser(id: string) {
    if (confirm('Valider ce donateur ?')) {
      this.userService.validateUser(id).subscribe({
        next: () => {
          alert('Donateur validé.');
          this.loadDonors();
        },
        error: () => alert('Erreur validation')
      });
    }
  }

  toggleStatus(id: string, currentStatus: string): void {
    if (currentStatus === 'ACTIVE') {
      this.userService.suspendUser(id).subscribe(() => this.loadDonors());
    } else {
      this.userService.activateUser(id).subscribe(() => this.loadDonors());
    }
  }

  deleteUser(id: string): void {
    if (confirm('Supprimer définitivement ce donateur ?')) {
      this.userService.deleteUser(id).subscribe(() => this.loadDonors());
    }
  }

  toggleExpand(id: string) { this.expandedId = this.expandedId === id ? null : id; }

  changePage(p: number) {
    this.page = p;
    this.loadDonors();
  }
}
