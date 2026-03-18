import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-institution-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './institution-profile.component.html',
  styleUrl: './institution-profile.component.scss'
})
export class InstitutionProfileComponent {
  saved = false;

  profile = {
    name: "Orphelinat de l'Espoir",
    sector: 'Orphelinat',
    city: 'Yaoundé',
    description: "Dédié à l'accueil et à l'éducation des enfants vulnérables depuis 2012. Notre mission est d'offrir un cadre familial stable et un accès à l'éducation de qualité.",
    email: 'contact@espoir-orphelinat.cm',
    phone: '+237 6 99 00 11 22',
    website: 'www.espoir-orphelinat.cm',
  };

  sectors = ['Orphelinat', 'Association', "Centre d'accueil", 'Fondation', 'ONG', 'Autre'];

  save(): void {
    this.saved = true;
    setTimeout(() => this.saved = false, 3000);
  }
}
