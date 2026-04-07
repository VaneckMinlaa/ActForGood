import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  template: `
    <div class="layout-container">
      <app-header></app-header>
      <main class="main-content">
        <ng-content></ng-content>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .main-content {
      flex: 1;
      padding: 20px;
    }
  `],
  standalone: false
})
export class LayoutComponent { }
