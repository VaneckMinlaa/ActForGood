import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../../../core/services/theme.service';
import { AuthService, RegisterRequest } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  currentStep = 1;
  totalSteps = 3;
  isLoading = false;
  isSubmitted = false;
  errorMessage = '';

  sectors = ['Éducation', 'Santé', 'Environnement', 'Droits de l\'Homme', 'Alimentation', 'Agriculture', 'Sport', 'Culture'];
  selectedSectors: string[] = ['Éducation'];

  missionLength = 0;

  step1 = { 
    name: '', type: '', year: '', city: '', country: 'Cameroun', 
    website: '', address: '', mission: '' 
  };
  step2 = { 
    rccm: '', 
    taxId: '', 
    legalDoc: null as File | null, 
    statutes: null as File | null,
    minasAuth: null as File | null, // Arrêté MINAS
    assocReceipt: null as File | null, // Récépissé association
    rulesInternal: null as File | null, // Règlement Intérieur
    registryEntry: null as File | null, // Registre Accueil
    socialInquiry: null as File | null // Enquête Sociale
  };
  step3 = { 
    firstName: '', lastName: '', email: '', phone: '', 
    acceptTerms: false 
  };
  
  constructor(
    private router: Router, 
    public themeService: ThemeService,
    private authService: AuthService
  ) {}

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

  onFileChange(event: Event, field: keyof typeof this.step2): void {
    const file = (event.target as HTMLInputElement).files?.[0] || null;
    (this.step2 as any)[field] = file;
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) this.currentStep++;
  }

  prevStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  submit(): void {
    const registerData: RegisterRequest = {
      email: this.step3.email,
      // password: this.step3.password, // Optional in PENDING state
      firstName: this.step3.firstName,
      lastName: this.step3.lastName,
      phone: this.step3.phone,
      userType: this.step1.type === 'Orphelinat' ? 'ORPHANAGE' : 
                (this.step1.type === 'Donateur' ? 'DONOR' : 
                (this.step1.type === 'Entreprise' ? 'COMPANY' : 'NGO')),
      location: this.step1.city,
      country: this.step1.country,

      // Organization Information
      organizationName: this.step1.name,
      organizationType: this.step1.type,
      creationYear: this.step1.year,
      website: this.step1.website,
      address: this.step1.address,
      mission: this.step1.mission,
      sectors: this.selectedSectors,

      // Document URLs (Mocked for now since upload service is pending)
      rccm: this.step2.rccm,
      taxId: this.step2.taxId,
      legalDocUrl: this.step2.legalDoc ? `uploads/${this.step2.legalDoc.name}` : undefined,
      statutesUrl: this.step2.statutes ? `uploads/${this.step2.statutes.name}` : undefined,
      minasAuthUrl: this.step2.minasAuth ? `uploads/${this.step2.minasAuth.name}` : undefined,
      assocReceiptUrl: this.step2.assocReceipt ? `uploads/${this.step2.assocReceipt.name}` : undefined,
      rulesInternalUrl: this.step2.rulesInternal ? `uploads/${this.step2.rulesInternal.name}` : undefined,
      registryEntryUrl: this.step2.registryEntry ? `uploads/${this.step2.registryEntry.name}` : undefined,
      socialInquiryUrl: this.step2.socialInquiry ? `uploads/${this.step2.socialInquiry.name}` : undefined
    };

    console.log('Sending registration request...', registerData);
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(registerData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.isSubmitted = true;
        console.log('Registration successful', response);
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Registration failed', err);
        this.errorMessage = 'Une erreur est survenue lors de l\'inscription. Assurez-vous que le backend est lancé.';
      }
    });
  }
}
