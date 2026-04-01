import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  isScrolled = false;
  isHomePage = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    public themeService: ThemeService
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 60;
  }

  ngOnInit(): void {
    this.checkAuthStatus();
    this.checkCurrentRoute();

    this.subscription.add(
      this.authService.currentUser$.subscribe(user => {
        this.isAuthenticated = !!user && this.authService.isAuthenticated();
      })
    );

    this.subscription.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.checkAuthStatus();
        this.checkCurrentRoute();
      })
    );
  }

  checkCurrentRoute(): void {
    this.isHomePage = this.router.url === '/' || this.router.url === '/home';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  checkAuthStatus(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
    this.router.navigate(['/']);
  }
}
