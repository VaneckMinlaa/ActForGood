import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="register-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Inscription</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <mat-form-field>
              <mat-label>Prénom</mat-label>
              <input matInput formControlName="firstName" required>
            </mat-form-field>
            <mat-form-field>
              <mat-label>Nom</mat-label>
              <input matInput formControlName="lastName" required>
            </mat-form-field>
            <mat-form-field>
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" required>
            </mat-form-field>
            <mat-form-field>
              <mat-label>Mot de passe</mat-label>
              <input matInput formControlName="password" type="password" required>
            </mat-form-field>
            <mat-form-field>
              <mat-label>Type de compte</mat-label>
              <mat-select formControlName="userType" required>
                <mat-option value="DONOR">Bienfaiteur</mat-option>
                <mat-option value="NGO">ONG</mat-option>
                <mat-option value="ORPHANAGE">Orphelinat</mat-option>
                <mat-option value="ASSOCIATION">Association</mat-option>
              </mat-select>
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit" [disabled]="!registerForm.valid">
              S'inscrire
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
    }
    mat-card {
      width: 400px;
    }
    form {
      display: flex;
      flex-direction: column;
    }
    mat-form-field {
      width: 100%;
      margin-bottom: 10px;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userType: ['DONOR', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => console.error('Register error', err)
      });
    }
  }
}
