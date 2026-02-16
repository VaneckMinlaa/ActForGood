import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

type UserTypeValue = 'DONOR' | 'NGO' | 'ORPHANAGE' | 'ASSOCIATION';

interface UserTypeOption {
  value: UserTypeValue;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
  subtitle: string;
}

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm = control.get('passwordConfirm')?.value;
  if (!password || !confirm) return null;
  return password === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  step = 1;
  selectedType: UserTypeValue | null = null;
  registerForm: FormGroup;

  userTypes: UserTypeOption[] = [
    {
      value: 'DONOR',
      label: 'Personne Anonyme / Donateur',
      shortLabel: 'Donateur',
      description: 'Contribuez avec ou sans reconnaissance publique, suivez votre impact.',
      icon: 'favorite',
      subtitle: 'Créez votre compte pour suivre votre impact.'
    },
    {
      value: 'NGO',
      label: 'ONG / Organisation Sociale',
      shortLabel: 'ONG',
      description: 'Enregistrez votre organisation, publiez vos projets et recevez des dons.',
      icon: 'people',
      subtitle: 'Créez votre compte pour publier vos projets et recevoir des dons.'
    },
    {
      value: 'ORPHANAGE',
      label: 'Orphelinat',
      shortLabel: 'Orphelinat',
      description: 'Inscrivez votre orphelinat pour solliciter du soutien et gérer vos besoins.',
      icon: 'home',
      subtitle: 'Créez votre compte pour solliciter du soutien et gérer vos besoins.'
    },
    {
      value: 'ASSOCIATION',
      label: 'Entreprise / Partenaire',
      shortLabel: 'Partenaire',
      description: 'Collaborez avec des projets sociaux, engagez votre RSE et mesurez votre impact.',
      icon: 'work',
      subtitle: 'Créez votre compte pour collaborer et mesurer votre impact.'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        lastName: [''],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        passwordConfirm: ['', [Validators.required]],
        anonymousDonation: [false],
        acceptTerms: [false, [Validators.requiredTrue]]
      },
      { validators: passwordMatchValidator }
    );
  }

  selectType(value: UserTypeValue): void {
    this.selectedType = value;
  }

  goToStep2(): void {
    if (!this.selectedType) return;
    this.registerForm.patchValue({ userType: this.selectedType });
    this.step = 2;
  }

  getInscriptionTitle(): string {
    const opt = this.userTypes.find((t) => t.value === this.selectedType);
    return opt ? `Inscription : ${opt.shortLabel}` : 'Inscription';
  }

  getSubtitle(): string {
    const opt = this.userTypes.find((t) => t.value === this.selectedType);
    return opt ? opt.subtitle : 'Créez votre compte.';
  }

  getSelectedTypeLabel(): string {
    const opt = this.userTypes.find((t) => t.value === this.selectedType);
    return opt ? opt.label : '';
  }

  getPasswordStrength(): 'Faible' | 'Moyen' | 'Fort' {
    const p = this.registerForm.get('password')?.value || '';
    if (p.length < 8) return 'Faible';
    if (p.length < 12 && !/[A-Z]/.test(p) && !/[0-9]/.test(p)) return 'Faible';
    if (p.length >= 12 && /[A-Z]/.test(p) && /[0-9]/.test(p)) return 'Fort';
    return 'Moyen';
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    const v = this.registerForm.value;
    const nom = (v.lastName || '').trim();
    const payload = {
      email: v.email,
      password: v.password,
      firstName: nom ? nom.split(/\s+/)[0] : '',
      lastName: nom,
      userType: this.selectedType!,
      anonymousDonation: v.anonymousDonation
    };
    this.authService.register(payload).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => console.error('Register error', err)
    });
  }
}
