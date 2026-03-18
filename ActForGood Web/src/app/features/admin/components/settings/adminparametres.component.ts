import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-adminparametres',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './adminparametres.component.html',
  styleUrl: './adminparametres.component.scss'
})
export class AdminparametresComponent {

  activeTab = 'profile';

  profile = { firstName: 'Admin', lastName: 'Profile', email: 'admin@actforgood.cm', phone: '+237 699 000 001', role: 'Super Administrateur' };

  notifications = {
    newInstitution: true, newDonor: true, newTransaction: false,
    reportSubmitted: true, systemAlerts: true, weeklyDigest: false
  };

  security = { twoFactor: false, sessionTimeout: '30', passwordChanged: '2024-01-15' };

  platform = { platformName: 'ActForGood', currency: 'FCFA', language: 'Français', timezone: 'Africa/Douala', maintenanceMode: false };

  saveProfile(): void { alert('Profil mis à jour.'); }
  saveNotifications(): void { alert('Préférences de notifications sauvegardées.'); }
  saveSecurity(): void { alert('Paramètres de sécurité mis à jour.'); }
  savePlatform(): void { alert('Paramètres de la plateforme mis à jour.'); }
}
