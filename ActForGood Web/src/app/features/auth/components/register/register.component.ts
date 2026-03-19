import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  currentStep = 1;
  totalSteps = 3;

  sectors = ['Éducation', 'Santé', 'Environnement', 'Droits de l\'Homme', 'Alimentation', 'Agriculture', 'Sport', 'Culture'];
  selectedSectors: string[] = ['Éducation'];

  missionLength = 0;

  step1 = { name: '', type: '', year: '', city: '', website: '', address: '', mission: '' };
  step2 = { rccm: '', taxId: '', legalDoc: null as File | null, statutes: null as File | null };
  step3 = { firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', acceptTerms: false };
  
  constructor(private router: Router, public themeService: ThemeService) {}

  toggleSector(sector: string): void {
    const idx = this.selectedSectors.indexOf(sector);
    if (idx > -1) this.selectedSectors.splice(idx, 1);
    else this.selectedSectors.push(sector);
  }

  isSectorSelected(sector: string): boolean {
    return this.selectedSectors.includes(sector);
  }

  onMissionInput(event: Event): void {
    this.missionLength = (event.target as HTMLTextAreaElement).value.length;
  }

  onFileChange(event: Event, field: 'legalDoc' | 'statutes'): void {
    this.step2[field] = (event.target as HTMLInputElement).files?.[0] || null;
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) this.currentStep++;
  }

  prevStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  submit(): void {
    // TODO: connecter au service d'inscription
    console.log('Institution enregistrée', { step1: this.step1, step2: this.step2, step3: this.step3, sectors: this.selectedSectors });
    this.router.navigate(['/']);
  }
}
