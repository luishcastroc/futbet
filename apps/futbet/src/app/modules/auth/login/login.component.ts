import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'futbet-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  pass = false;

  clickEvent() {
    this.pass = !this.pass;
  }
}
