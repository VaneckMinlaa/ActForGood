import { Component, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  messageSent = false;

  contactData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderer.addClass(entry.target, 'visible');
          // Une fois visible, on peut arrêter d'observer l'élément
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const revealElements = this.el.nativeElement.querySelectorAll('.reveal');
    revealElements.forEach((element: HTMLElement) => {
      observer.observe(element);
    });
  }

  sendMessage(): void {
    console.log('Message envoyé:', this.contactData);
    this.messageSent = true;
    setTimeout(() => {
      this.messageSent = false;
      this.contactData = { name: '', email: '', subject: '', message: '' };
    }, 3000);
  }
}
