import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  isLoading = false;

  // Utilisateurs de test (à retirer en production)
  private devUsers = [
    { email: 'admin@actforgood.com', password: 'admin', userType: 'ADMIN' },
    { email: 'org@actforgood.com', password: 'org', userType: 'ORGANIZATION' },
    { email: 'donor@actforgood.com', password: 'donor', userType: 'DONOR' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      // Mode développement : vérifier les utilisateurs de test
      const devUser = this.devUsers.find(u => u.email === email && u.password === password);

      if (devUser) {
        // Simuler une connexion réussie
        const fakeResponse = {
          token: `fake-${devUser.userType.toLowerCase()}-token-${Date.now()}`,
          userId: `${devUser.userType.toLowerCase()}-001`,
          email: devUser.email,
          userType: devUser.userType,
          expiresIn: 3600
        };

        // Stocker les données (incluant expiration)
        localStorage.setItem('token', fakeResponse.token);
        localStorage.setItem('user', JSON.stringify(fakeResponse));
        const expiresAt = Date.now() + fakeResponse.expiresIn * 1000;
        localStorage.setItem('expiresAt', expiresAt.toString());

        // Simuler un délai réseau
        setTimeout(() => {
          this.isLoading = false;
          const redirectUrl = this.authService.getRedirectUrlByRole(fakeResponse.userType);
          this.router.navigate([redirectUrl]);
        }, 500);
      } else {
        // Tentative avec le backend (si disponible)
        this.authService.login(this.loginForm.value).subscribe({
          next: (response) => {
            this.isLoading = false;
            const redirectUrl = this.authService.getRedirectUrlByRole(response.userType);
            this.router.navigate([redirectUrl]);
          },
          error: (err) => {
            this.isLoading = false;
            console.error('Login error', err);
            this.errorMessage = 'Identifiants incorrects. Essayez : admin@actforgood.com / admin';
          }
        });
      }
    }
  }
}
