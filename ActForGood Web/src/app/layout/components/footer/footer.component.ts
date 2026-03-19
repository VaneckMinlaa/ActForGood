import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="global-footer">
      <div class="footer-top">
        <div class="footer-brand">
          <a routerLink="/" class="footer-logo">ActForGood</a>
          <p class="footer-tagline">L'archive humaine de l'intégrité et de l'action positive.</p>
        </div>
        <nav class="footer-nav">
          <div class="nav-col">
            <h4>Plateforme</h4>
            <a routerLink="/mission">Mission</a>
            <a routerLink="/campaigns">Impact</a>
            <a routerLink="/stories">Histoires</a>
          </div>
          <div class="nav-col">
            <h4>Institution</h4>
            <a routerLink="/auth/register">Inscrire une ONG</a>
            <a routerLink="/">Partenariats</a>
            <a routerLink="/">Centre d'aide</a>
          </div>
          <div class="nav-col">
            <h4>Légal</h4>
            <a href="#">Confidentialité</a>
            <a href="#">Conditions</a>
            <a href="#">Sécurité</a>
          </div>
        </nav>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 ActForGood. Propulsé par la Plateforme de l'Archive Humaine. Tous droits réservés.</p>
        <div class="footer-socials">
          <a href="#" class="social-icon">IN</a>
          <a href="#" class="social-icon">X</a>
          <a href="#" class="social-icon">FB</a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .global-footer {
      background: var(--bg-deep);
      border-top: 1px solid var(--border-glass);
      padding: 60px 5% 30px;
      color: var(--text-main);
      margin-top: auto;
    }
    .footer-top {
      display: flex;
      justify-content: space-between;
      gap: 40px;
      margin-bottom: 60px;
      flex-wrap: wrap;
    }
    .footer-brand {
      flex: 1;
      min-width: 250px;
    }
    .footer-logo {
      font-size: 1.8rem;
      font-weight: 900;
      color: var(--text-main);
      text-decoration: none;
      letter-spacing: -1px;
      margin-bottom: 15px;
      display: block;
    }
    .footer-tagline {
      font-size: 0.95rem;
      color: var(--text-muted);
      line-height: 1.6;
      max-width: 300px;
    }
    .footer-nav {
      display: flex;
      gap: 60px;
      flex-wrap: wrap;
    }
    .nav-col h4 {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-main);
      margin-bottom: 20px;
      font-weight: 800;
    }
    .nav-col a {
      display: block;
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.9rem;
      margin-bottom: 12px;
      transition: color 0.2s;
      font-weight: 500;
    }
    .nav-col a:hover {
      color: var(--primary-yellow);
    }
    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 30px;
      border-top: 1px solid var(--border-glass);
      font-size: 0.82rem;
      color: var(--text-muted);
      flex-wrap: wrap;
      gap: 20px;
    }
    .footer-socials {
      display: flex;
      gap: 15px;
    }
    .social-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--bg-glass);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-main);
      text-decoration: none;
      font-weight: 800;
      font-size: 0.7rem;
      transition: all 0.3s;
    }
    .social-icon:hover {
      background: var(--primary-yellow);
      color: #000;
      transform: translateY(-3px);
    }
    @media (max-width: 768px) {
      .footer-top { flex-direction: column; }
      .footer-nav { gap: 40px; }
      .footer-bottom { flex-direction: column; text-align: center; }
    }
  `]
})
export class FooterComponent { }
