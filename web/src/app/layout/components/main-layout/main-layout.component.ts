import { Component } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  template: `
    <div class="main-layout">
      <app-header></app-header>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .main-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: #fff;
    }
    .content {
      flex: 1;
      padding: 0;
    }
  `]
})
export class MainLayoutComponent { }
