import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="main-footer">
      <div class="container footer-grid">
        <!-- Brand Column -->
        <div class="footer-col brand-col">
          <div class="footer-logo">
             <div class="logo-icon">AFG</div>
             <div class="logo-text">ACTFORGOOD<span>C O M P A N Y</span></div>
          </div>
          <p class="brand-desc">
            Notre mission est d'aider les organisations et donateurs à naviguer dans la complexité de l'humanitaire, en créant un impact durable grâce à des stratégies transparentes et des partenariats collaboratifs.
          </p>
          <div class="footer-socials">
            <a href="#" class="social-link"><i class="fab fa-x-twitter"></i></a>
            <a href="#" class="social-link"><i class="fab fa-facebook-f"></i></a>
            <a href="#" class="social-link"><i class="fab fa-LinkInk"></i></a>
            <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
          </div>
        </div>

        <!-- Services Column -->
        <div class="footer-col">
          <h3>Services</h3>
          <ul class="footer-links">
            <li><a routerLink="/evaluation">Évaluation</a></li>
            <li><a routerLink="/positioning">Positionnement</a></li>
            <li><a routerLink="/strategy">Stratégie</a></li>
            <li><a routerLink="/implementation">Mise en œuvre</a></li>
          </ul>
        </div>

        <!-- Info Column -->
        <div class="footer-col">
          <h3>Info</h3>
          <ul class="footer-links">
            <li><a routerLink="/about">À propos</a></li>
            <li><a routerLink="/services">Nos Services</a></li>
            <li><a routerLink="/cases">Études de cas</a></li>
            <li><a routerLink="/blog">Blog d'impact</a></li>
            <li><a routerLink="/terms">Conditions Générales</a></li>
            <li><a routerLink="/contact">Contact</a></li>
          </ul>
        </div>

        <!-- Contact Column -->
        <div class="footer-col contact-col">
          <h3>Get in touch</h3>
          <div class="contact-item">
            <span class="phone">+237-680-43-46-67</span>
            <span class="hours">Lundi au Vendredi : 9h - 17h</span>
          </div>
          <div class="contact-item">
            <a href="mailto:info&#64;actforgood.org" class="email">info&#64;actforgood.org</a>
          </div>
          <div class="contact-item">
            <p class="address">
              3 Rockaway St., New Rochelle,<br>
              Eyang, Yaoundé Cameroun - 10801
            </p>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .main-footer {
      background-color: var(--section-dark);
      padding: 100px 0;
      color: #fff;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr 0.8fr 1.2fr;
      gap: 60px;
    }
    .footer-col h3 {
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--primary-yellow);
      margin-bottom: 30px;
      font-weight: 800;
      font-family: var(--font-body);
    }
    .footer-logo {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 30px;
    }
    .logo-icon {
      width: 45px;
      height: 45px;
      background: var(--primary-yellow);
      color: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 0.8rem;
      clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%);
    }
    .logo-text {
      font-family: var(--font-heading);
      font-weight: 800;
      font-size: 1.4rem;
      line-height: 0.9;
      letter-spacing: 1px;
      span { display: block; font-size: 0.55rem; letter-spacing: 5px; opacity: 0.8; margin-top: 5px; font-weight: 400; }
    }
    .brand-desc {
      font-size: 0.95rem;
      color: rgba(255, 255, 255, 0.6);
      line-height: 1.7;
      margin-bottom: 35px;
      max-width: 350px;
    }
    .footer-socials {
      display: flex;
      gap: 15px;
    }
    .social-link {
      width: 40px;
      height: 40px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      text-decoration: none;
      transition: all 0.3s ease;
      font-size: 0.9rem;
      &:hover { background: var(--primary-yellow); border-color: var(--primary-yellow); color: #000; transform: translateY(-3px); }
    }
    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
      li { margin-bottom: 12px; }
      a {
        color: rgba(255, 255, 255, 0.6);
        text-decoration: none;
        font-size: 0.95rem;
        transition: color 0.3s ease;
        &:hover { color: #fff; padding-left: 5px; }
      }
    }
    .contact-item {
      margin-bottom: 25px;
      .phone { display: block; font-size: 1.5rem; font-weight: 700; font-family: var(--font-heading); color: #fff; }
      .hours { display: block; font-size: 0.8rem; color: var(--primary-yellow); opacity: 0.8; margin-top: 5px; }
      .email { color: rgba(255, 255, 255, 0.6); text-decoration: none; font-size: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 5px; transition: all 0.3s; &:hover { color: #fff; border-color: var(--primary-yellow); } }
      .address { color: rgba(255, 255, 255, 0.6); font-size: 0.95rem; line-height: 1.6; }
    }
    @media (max-width: 1024px) {
      .footer-grid { grid-template-columns: 1fr 1fr; gap: 60px; }
    }
    @media (max-width: 600px) {
      .footer-grid { grid-template-columns: 1fr; }
      .main-footer { padding: 60px 0; }
    }
  `]
})
export class FooterComponent { }
