import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [ReactiveFormsModule, NgIf, HttpClientModule]
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
      private authService: AuthService,
      private router: Router
  ) {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      accountType: new FormControl('standard', [Validators.required]),
      name: new FormControl('', Validators.required),
      registration: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(18)])
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { email, password, accountType, name, registration } = this.registerForm.value;

      this.authService.register(email, password, accountType, name, registration)
          .subscribe({
            next: () => {
              this.router.navigate(['/login']);
            },
            error: () => {
              this.errorMessage = 'Falha ao realizar o registro. Tente novamente.';
            }
          });
    } else {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
    }
  }
}
