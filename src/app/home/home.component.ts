import { Component } from '@angular/core';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  user: any;

  constructor(private authService: AuthService) {
    this.loadUser();
  }

  loadUser() {
    this.authService.getAuthenticatedUser().subscribe(
        (response: any) => {
          this.user = response;
        },
        (error) => {
          console.error('Erro ao carregar usuário', error);
        }
    );
  }
}
