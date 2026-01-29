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
      background-color: #3f51b5;
      color: white;
      text-align: center;
      padding: 20px;
      margin-top: auto;
    }
  `]
})
export class FooterComponent { }
