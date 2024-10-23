import {Component} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {ImageModule} from "primeng/image";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    imports: [FormsModule, ReactiveFormsModule, NgIf, InputTextModule, ButtonModule, HttpClientModule, RouterLink, NgOptimizedImage, ImageModule, ToastModule],
    providers: [MessageService]
})
export class LoginComponent {
    cpf: string = '';
    password: string = '';

    constructor(private authService: AuthService, private router: Router, private messageService: MessageService) {
    }

    onSubmit() {
        if (!this.cpf || !this.password) {
            this.messageService.add({severity: 'error', summary: 'Erro', detail: 'CPF e senha são obrigatórios'});
            return;
        }

        const formattedCpf = String(this.cpf).trim();

        this.authService.login(formattedCpf, this.password).subscribe(response => {
            const token = response?.token;
            if (token) {
                localStorage.setItem('token', token);
                this.messageService.add({
                    severity: 'success',
                    detail: 'Bem-vindo (a)!'
                });
                this.router.navigate(['/home']);
            } else {
                this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Token não recebido'});
            }
        }, error => {
            this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Login ou senha incorretos'});
        });
    }
}
