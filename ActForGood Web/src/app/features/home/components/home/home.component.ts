import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  messageSent = false;

  contactData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  sendMessage(): void {
    // TODO: connecter à un service email (ex: EmailJS, API backend)
    console.log('Message envoyé:', this.contactData);
    this.messageSent = true;
    setTimeout(() => {
      this.messageSent = false;
      this.contactData = { name: '', email: '', subject: '', message: '' };
    }, 3000);
  }
}
