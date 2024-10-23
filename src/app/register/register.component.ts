import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../services/auth.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MessageService } from "primeng/api";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  providers: [MessageService]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isShopkeeper: boolean = false;

  constructor(
      private authService: AuthService,
      private router: Router,
      private messageService: MessageService
  ) {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
      accountType: new FormControl('standard', [Validators.required]),
      name: new FormControl('', Validators.required),
      registration: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(18)])
    });
  }

  toggleAccountType(): void {
    this.isShopkeeper = !this.isShopkeeper;
    this.registerForm.controls['accountType'].setValue(this.isShopkeeper ? 'shopkeeper' : 'standard');
    this.registerForm.controls['name'].setValue('');
    this.registerForm.controls['registration'].setValue('');
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { email, password, accountType, name, registration } = this.registerForm.value;

      this.authService.register(email, password, accountType, name, registration)
          .subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Tudo pronto, agora você já pode acessar a sua conta através do painel de Login.' });
              this.router.navigate(['/login']);
            },
            error: () => {
              this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao realizar o registro. Tente novamente.' });
            }
          });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Por favor, preencha todos os campos corretamente.' });
    }
  }
}
