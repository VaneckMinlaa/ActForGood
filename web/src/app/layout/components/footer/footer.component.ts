import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer>
      <p>&copy; 2026 ActForGood. Tous droits réservés.</p>
    </footer>
  `,
  styles: [`
    footer {
      background-color: #1a1a1a;
      color: #fff;
      text-align: center;
      padding: 24px;
      margin-top: auto;
      font-size: 0.9rem;
    }
  `]
})
export class FooterComponent { }
