import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    imports: [FormsModule, ReactiveFormsModule, NgIf, InputTextModule, ButtonModule, HttpClientModule]
})
export class LoginComponent {
    cpf: string = '';
    password: string = '';

    constructor(private authService: AuthService, private router: Router) {
    }

    onSubmit() {
        if (!this.cpf || !this.password) {
            console.error('CPF e senha são obrigatórios');
            return;
        }

        const formattedCpf = String(this.cpf).trim();

        this.authService.login(formattedCpf, this.password).subscribe(response => {
            const token = response?.token;
            if (token) {
                localStorage.setItem('token', token);
                this.router.navigate(['/home']);
            } else {
                console.error('Token não recebido');
            }
        }, error => {
            console.error('Login falhou', error);
        });
    }
}
